import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Heart, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;
type SavedOutfit = {
    id: string;
    name: string;
    items: string[];
    savedDate: string;
    lookItems: {
        clothesDto: {
            id: number;
            itemName: string;
            category: string;
        };
    }[];
};

export default function SavedLooks() {
    const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const [selectedLook, setSelectedLook] = useState<SavedOutfit | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [photos, setPhotos] = useState<Record<number, string>>({});

    const keycloakId = localStorage.getItem('keycloakId');
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!keycloakId || !accessToken) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        const fetchSavedLooks = async () => {
            try {
                const resLooks = await fetch(`${API_URL}/api/looks/saved-looks/${keycloakId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!resLooks.ok) throw new Error('Failed to fetch saved looks');
                const looksData = await resLooks.json();

                const resPhotos = await fetch(`${API_URL}/api/clothes/photos/${keycloakId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!resPhotos.ok) throw new Error('Failed to fetch clothes images');
                const photosData: Record<number, string> = await resPhotos.json();
                setPhotos(photosData);

                const mapped: SavedOutfit[] = looksData.map((look: any) => ({
                    id: look.id.toString(),
                    name: look.name,
                    lookItems: look.lookItems,
                    items: look.lookItems
                        .map((li: any) => {
                            const itemId = li.clothesDto.id;
                            const base64 = photosData[itemId];
                            return base64 ? `data:image/jpeg;base64,${base64}` : '';
                        })
                        .filter(Boolean),
                    savedDate: look.createdAt
                }));

                setSavedOutfits(mapped);
                setLoading(false);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Something went wrong');
                setLoading(false);
            }
        };

        fetchSavedLooks();
    }, [keycloakId, accessToken]);

    const handleDelete = (id: string) => {
        setSavedOutfits(savedOutfits.filter((outfit) => outfit.id !== id));
    };

    const handleEditStart = (outfit: SavedOutfit) => {
        setEditingId(outfit.id);
        setEditName(outfit.name);
    };

    const handleEditSave = (id: string) => {
        setSavedOutfits(
            savedOutfits.map((outfit) =>
                outfit.id === id ? { ...outfit, name: editName } : outfit
            )
        );
        setEditingId(null);
        setEditName('');
    };

    const openLookModal = (look: SavedOutfit) => {
        setSelectedLook(look);
        setIsModalOpen(true);
    };

    if (loading) return <div className="text-center py-12">Loading saved looks...</div>;
    if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <Heart className="w-8 h-8 text-red-600 fill-current" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Saved Looks</h1>
                    <p className="text-lg text-gray-600">
                        Your favorite outfit combinations in one place
                    </p>
                </motion.div>

                {savedOutfits.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No saved looks yet
                        </h3>
                        <p className="text-gray-600">
                            Start saving your favorite outfits from AI suggestions!
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {savedOutfits.map((outfit, index) => (
                            <motion.div
                                key={outfit.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                                onClick={() => openLookModal(outfit)}
                            >
                                <div className="grid grid-cols-3 gap-1 p-4 bg-gray-50">
                                    {outfit.items.map((item, idx) => (
                                        <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                                            <img
                                                src={item}
                                                alt={`Item ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6">
                                    {editingId === outfit.id ? (
                                        <div className="mb-4">
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleEditSave(outfit.id)}
                                                    className="flex-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {outfit.name}
                                            </h3>
                                            <span className="text-xs text-gray-500">
                        Saved {new Date(outfit.savedDate).toLocaleDateString()}
                      </span>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditStart(outfit);
                                            }}
                                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                                        >
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(outfit.id);
                                            }}
                                            className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-full font-medium hover:bg-red-100 transition-colors flex items-center justify-center"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

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
                                {selectedLook.lookItems.map((li) => {
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

                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
