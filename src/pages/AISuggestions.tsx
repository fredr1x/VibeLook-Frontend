import { useState, useEffect } from 'react';
import {motion, AnimatePresence, color} from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

// -------------------- Вспомогательная функция для fetch с ngrok bypass --------------------
const fetchWithNgrokBypass = async (url: string, options: RequestInit = {}) => {
    const headers = {
        ...options.headers,
        'ngrok-skip-browser-warning': 'true',
    };
    return fetch(url, { ...options, headers });
};

type Outfit = {
    id: string;
    name: string;
    items: string[]; // base64 image URLs
    saved: boolean;
    saving?: boolean;
    suggestedDate: string;
    lookItems?: {
        clothesDto: {
            id: number;
            itemName: string;
            category: string;
        };
    }[];
};

export default function AISuggestions() {
    const navigate = useNavigate();

    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [photos, setPhotos] = useState<Record<number, string>>({});
    const [selectedLook, setSelectedLook] = useState<Outfit | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generating, setGenerating] = useState(false);

    const keycloakId = localStorage.getItem('keycloakId');
    const accessToken = localStorage.getItem('accessToken');

    // -------------------- Функция загрузки луков --------------------
    const fetchOutfits = async () => {
        if (!keycloakId || !accessToken) return;

        setLoading(true);
        setError(null);

        try {
            // Получаем AI suggestions
            const resLooks = await fetchWithNgrokBypass(`${API_URL}/api/looks/ai-suggestion/${keycloakId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!resLooks.ok) throw new Error('Failed to fetch AI suggestions');
            const looksData = await resLooks.json();

            // Получаем base64 фото
            const resPhotos = await fetchWithNgrokBypass(`${API_URL}/api/clothes/photos/${keycloakId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!resPhotos.ok) throw new Error('Failed to fetch clothes images');
            const photosData: Record<number, string> = await resPhotos.json();
            setPhotos(photosData);

            // Маппим луки для отображения
            const mapped: Outfit[] = looksData.map((look: any) => ({
                id: look.id.toString(),
                name: look.name,
                items: look.lookItems
                    .map((li: any) => {
                        const itemId = li.clothesDto.id;
                        const base64 = photosData[itemId];
                        return base64 ? `data:image/jpeg;base64,${base64}` : '';
                    })
                    .filter(Boolean),
                lookItems: look.lookItems,
                suggestedDate: look.createdAt,
                saved: false,
            }));

            setOutfits(mapped);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    // -------------------- useEffect для начальной загрузки --------------------
    useEffect(() => {
        if (!keycloakId || !accessToken) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }
        fetchOutfits();
    }, [keycloakId, accessToken]);

    // -------------------- Сохранение лука --------------------
    const handleSaveLook = async (id: string) => {
        const outfitIndex = outfits.findIndex((o) => o.id === id);
        if (outfitIndex === -1) return;

        const updatedOutfits = [...outfits];
        updatedOutfits[outfitIndex].saving = true;
        setOutfits(updatedOutfits);

        try {
            const res = await fetchWithNgrokBypass(`${API_URL}/api/looks/save-look/${id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) throw new Error('Failed to save look');

            updatedOutfits[outfitIndex].saved = true;
        } catch (err) {
            console.error(err);
        } finally {
            updatedOutfits[outfitIndex].saving = false;
            setOutfits([...updatedOutfits]);
        }
    };

    // -------------------- Модалка --------------------
    const openLookModal = (look: Outfit) => {
        setSelectedLook(look);
        setIsModalOpen(true);
    };

    // -------------------- Генерация новых луков --------------------
    const handleGenerateLooks = async () => {
        if (!keycloakId || !accessToken) return;

        setGenerating(true);
        try {
            const res = await fetchWithNgrokBypass(`${API_URL}/api/ai/suggestion/${keycloakId}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!res.ok) throw new Error('Failed to generate looks');

            const message = await res.text();
            console.log(message);

            // После генерации обновляем список луков
            await fetchOutfits();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong during generation');
        } finally {
            setGenerating(false);
        }
    };

    const savedCount = outfits.filter((o) => o.saved).length;

    if (loading) return <div className="text-center py-12">Loading AI suggestions...</div>;
    if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                        <Sparkles className="w-8 h-8 text-purple-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Outfit Suggestions</h1>
                    <p className="text-lg text-gray-600 mb-4">
                        Personalized outfit combinations from your wardrobe
                    </p>
                    {savedCount > 0 && (
                        <button
                            onClick={() => navigate('/saved-looks')}
                            className="text-purple-600 font-medium hover:text-purple-700"
                        >
                            View {savedCount} saved {savedCount === 1 ? 'look' : 'looks'}
                        </button>
                    )}
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {outfits.map((outfit, index) => (
                        <motion.div
                            key={outfit.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col h-full"
                            onClick={() => openLookModal(outfit)}
                        >
                            {/* Секция с изображениями - фиксированная высота */}
                            <div className="grid grid-cols-3 gap-1 p-4 bg-gray-50 flex-shrink-0">
                                {outfit.items.slice(0, 6).map((item, idx) => (
                                    <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                                        <img
                                            src={item}
                                            alt={`Item ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Секция с контентом - растягивается и выравнивает содержимое */}
                            <div className="p-6 flex flex-col flex-grow">
                                {/* Название и дата - занимают доступное пространство */}
                                <div className="flex-grow mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{outfit.name}</h3>
                                    <span className="text-xs text-gray-500">
                                        Suggested date: {new Date(outfit.suggestedDate).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Кнопка - всегда внизу */}
                                <button
                                    disabled={outfit.saving || outfit.saved}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSaveLook(outfit.id);
                                    }}
                                    className={`w-full px-4 py-2 rounded-full font-medium transition-colors ${
                                        outfit.saved
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                    }`}
                                >
                                    {outfit.saving ? 'Saving...' : outfit.saved ? 'Saved' : 'Save Look'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* -------------------- Генерация новых луков -------------------- */}
                <div className="text-center mt-10">
                    <button
                        onClick={handleGenerateLooks}
                        disabled={generating}
                        className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Sparkles className="mr-2 w-5 h-5" />
                        {generating ? 'Generating...' : (outfits.length == 0 ? 'Generate looks' : 'Generate more looks')}
                    </button>
                    <p className="mt-2 text-sm text-gray-500 ">
                        Note: You can generate new outfits only once per day
                    </p>
                </div>

                {/* -------------------- Modal -------------------- */}
                <AnimatePresence>
                    {isModalOpen && selectedLook && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                        >
                            <motion.div
                                className="bg-white rounded-2xl p-8 w-full max-w-4xl relative mx-4"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <h2 className="text-2xl font-bold mb-6 text-center">{selectedLook.name}</h2>

                                <div className="flex overflow-x-auto gap-6 py-4 px-2 sm:px-4 md:px-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                    {selectedLook.lookItems?.map((li) => {
                                        const img = photos[li.clothesDto.id];
                                        return (
                                            <div
                                                key={li.clothesDto.id}
                                                className="flex-shrink-0 flex flex-col items-center min-w-[160px] text-center"
                                            >
                                                {img && (
                                                    <img
                                                        src={`data:image/jpeg;base64,${img}`}
                                                        alt={li.clothesDto.itemName}
                                                        className="w-36 h-36 object-cover rounded-xl shadow-md mb-2"
                                                    />
                                                )}
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {li.clothesDto.itemName}
                                                </p>
                                                <p className="text-xs text-gray-500">{li.clothesDto.category}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
