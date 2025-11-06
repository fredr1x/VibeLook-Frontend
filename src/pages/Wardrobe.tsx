import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

type ClothingItem = {
    id: string;
    image: string;
    category: string;
    name: string;
};

type ClothesForm = {
    type: string;
    subtype: string;
    color: string;
    itemName: string;
    partnerBrand?: string;
    file?: File | null;
};

// Компонент для отображения шаблона одежды с цветом
const ClothingTemplate = ({ type, subtype, color }: { type: string; subtype: string; color: string }) => {
    // Маппинг цветов на CSS filter
    const getColorFilter = (color: string): string => {
        const filters: Record<string, string> = {
            'Black': 'brightness(0) saturate(100%)',
            'White': 'brightness(2) saturate(0%)',
            'Gray': 'brightness(0.7) saturate(0%)',
            'Blue': 'brightness(0.6) saturate(3) hue-rotate(200deg)',
            'Red': 'brightness(0.6) saturate(3) hue-rotate(340deg)',
            'Green': 'brightness(0.6) saturate(2) hue-rotate(90deg)',
            'Beige': 'brightness(1.2) saturate(0.5) hue-rotate(30deg)',
            'Navy': 'brightness(0.3) saturate(3) hue-rotate(220deg)',
            'Brown': 'brightness(0.5) saturate(1.5) hue-rotate(20deg)',
            'Pink': 'brightness(1.1) saturate(2) hue-rotate(320deg)',
            'Yellow': 'brightness(1.3) saturate(2) hue-rotate(50deg)',
            'Purple': 'brightness(0.5) saturate(2) hue-rotate(270deg)',
        };
        return filters[color] || 'none';
    };

    // Маппинг типов и подтипов на изображения из /resources/templates/
    const getTemplatePath = (type: string, subtype: string): string => {
        const templates: Record<string, Record<string, string>> = {
            'Shirts': {
                'Casual': '/resources/shirts/tshirt.png',
                'Formal': '/resources/shirts/shirt.png',
                'Polo': '/resources/shirts/polo.png',
                'Long sleeve': '/resources/shirts/longsleeve.png',
                'Hoodie': '/resources/shirts/hoodie.png',
                'Sweatshirt': '/resources/shirts/sweatshirt.png',
                'Tank top': '/resources/shirts/tanktop.png',
            },
            'Pants': {
                'Jeans': '/resources/pants/jeans.png',
                'Chinos': '/resources/pants/chinos.png',
                'Shorts': '/resources/pants/shorts.png',
                'Joggers': '/resources/pants/joggers.png',
            },
            'Outwear': {
                'Jacket': '/resources/outwears/jacket.png',
                'Coat': '/resources/outwears/coat.png',
                'Windbreaker': '/resources/outwears/windbreaker.png'
            },
            'Shoes': {
                'Sneakers': '/resources/shoes/sneakers.png',
                'Boots': '/resources/shoes/boots.png',
                'Sandals': '/resources/shoes/sandals.png',
            },
            'Accessories': {
                'Baseball cap': '/resources/accessories/cap.png',
                'Belt': '/resources/accessories/belt.png',
                'Watch': '/resources/accessories/watch.png',
            },
        };

        const typeTemplates = templates[type];
        if (typeTemplates && typeTemplates[subtype]) {
            return typeTemplates[subtype];
        }

        // Fallback к дефолтному изображению типа (используем футболку как базу)
        const defaultTemplates: Record<string, string> = {
            'Shirts': '/resources/shirts/tshirt.png',
            'Pants': '/resources/pants/chinos.png',
            'Outwear': '/resources/outwears/jacket.png',
            'Shoes': '/resources/shoes/sneakers.png',
            'Accessories': '/resources/accessories/watch.png',
        };

        return defaultTemplates[type] || '/resources/shirts/tshirt.png';
    };

    const templatePath = getTemplatePath(type, subtype);
    const colorFilter = getColorFilter(color);

    return (
        <img
            src={templatePath}
            alt={`${type} ${subtype}`}
            className="w-full h-full object-contain"
            style={{ filter: colorFilter }}
        />
    );
};

export default function Wardrobe() {
    const [items, setItems] = useState<ClothingItem[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<ClothesForm>({
        type: '',
        subtype: '',
        color: '',
        itemName: '',
        partnerBrand: '',
        file: null,
    });

    const keycloakId = localStorage.getItem('keycloakId');
    const accessToken = localStorage.getItem('accessToken');

    const api = axios.create({
        baseURL: 'http://localhost:80/api',
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const categories: string[] = ['All', 'Shirts', 'Outwear', 'Pants', 'Shoes', 'Accessories'];

    /** Дефолтные шаблоны по типу */
    const defaultImages: Record<string, string> = {
        Shirts: '/resources/tshirt.png',
        Outwear: '/resources/windbreaker.png',
        Pants: '/resources/chinos.png',
        Shoes: '/templates/sneakers.png',
        Accessories: '/templates/watch.png',
        Other: '/templates/tshirt.png',
    };

    const fetchData = async () => {
        if (!keycloakId || !accessToken) {
            setError('Authentication required. Please log in.');
            setLoading(false);
            return;
        }

        try {
            // Используем правильный эндпоинт из бэкенда
            const wardrobeRes = await api.get(`/wardrobes/${keycloakId}`);
            const clothes = wardrobeRes.data.clothes || [];

            const photosRes = await api.get(`/clothes/photos/${keycloakId}`);
            const photos: string[] = Array.isArray(photosRes.data)
                ? photosRes.data.map((b64: string) => b64.trim().replace(/^["']+|["']+$/g, ''))
                : [];

            const merged: ClothingItem[] = clothes.map((item: any, i: number) => {
                let imageUrl = '';
                const base64 = photos[i];
                if (base64 && base64.length > 100) {
                    let prefix = 'data:image/png;base64,';
                    if (base64.startsWith('/9j/')) prefix = 'data:image/jpeg;base64,';
                    imageUrl = `${prefix}${base64}`;
                }

                const normalizedCategory =
                    item.type && typeof item.type === 'string'
                        ? item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase()
                        : 'Other';

                return {
                    id: item.id || `item-${i}`,
                    category: normalizedCategory,
                    name: item.itemName || item.subtype || 'Unnamed Item',
                    image: imageUrl || defaultImages[normalizedCategory] || defaultImages.Other,
                };
            });

            setItems(merged);
            setError('');
        } catch (err) {
            console.error('Failed to load wardrobe:', err);
            if (axios.isAxiosError(err)) {
                setError(`Failed to load wardrobe: ${err.response?.status} ${err.message}`);
            } else {
                setError('Failed to load wardrobe. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /** Добавление новой вещи через форму */
    const handleAddClothes = async () => {
        if (!keycloakId) return;

        const form = new FormData();
        const dto = {
            wardrobeId: Number(keycloakId),
            type: formData.type || 'Other',
            subtype: formData.subtype || '',
            color: formData.color || '',
            itemName: formData.itemName || '',
            partnerBrand: formData.partnerBrand || '',
        };

        form.append('clothesDto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

        if (formData.file) {
            form.append('file', formData.file);
        }

        try {
            const res = await api.post(`/clothes/add/${keycloakId}`, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const added = res.data;
            const imageBase64 =
                added.imageBase64 ||
                (formData.file
                    ? URL.createObjectURL(formData.file)
                    : defaultImages[dto.type] || defaultImages.Other);

            setItems((prev) => [
                ...prev,
                {
                    id: added.id,
                    image: imageBase64,
                    category: added.type,
                    name: added.itemName,
                },
            ]);

            setIsModalOpen(false);
            setFormData({
                type: '',
                subtype: '',
                color: '',
                itemName: '',
                partnerBrand: '',
                file: null,
            });
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload item.');
        }
    };

    const filteredItems =
        activeFilter === 'All'
            ? items
            : items.filter((item) => item.category.toLowerCase() === activeFilter.toLowerCase());

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">My Wardrobe</h1>
                    <p className="text-lg text-gray-600">Upload and organize your clothing items</p>
                </motion.div>

                {/* UPLOAD AREA */}
                <div className="mb-8 border-2 border-dashed rounded-2xl p-12 text-center transition-all border-gray-300 bg-white">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Clothes</h3>
                    <p className="text-gray-600 mb-4">Add new clothing items to your wardrobe</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors"
                    >
                        Upload
                    </button>
                </div>

                {/* FILTER BUTTONS */}
                <div className="mb-8 flex flex-wrap gap-3 justify-center">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveFilter(category)}
                            className={`px-6 py-2 rounded-full font-medium transition-colors ${
                                activeFilter === category
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-purple-50'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* LOADING STATE */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        <p className="mt-4 text-gray-600">Loading your wardrobe...</p>
                    </div>
                ) : (
                    <>
                        {/* ITEMS GRID */}
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    {activeFilter === 'All'
                                        ? 'No items in your wardrobe yet. Upload some clothes to get started!'
                                        : `No ${activeFilter.toLowerCase()} found in your wardrobe.`}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                                {filteredItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="bg-white rounded-xl shadow-md overflow-hidden group relative hover:shadow-xl transition-shadow"
                                    >
                                        <button
                                            onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-50"
                                        >
                                            <X className="w-4 h-4 text-red-600" />
                                        </button>
                                        <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                                        <div className="p-4">
                                            <p className="text-xs text-purple-600 font-semibold mb-1">{item.category}</p>
                                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {items.length > 0 && (
                            <div className="text-center">
                                <Link
                                    to="/ai-suggestions"
                                    className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
                                >
                                    <Sparkles className="mr-2 w-5 h-5" />
                                    Get AI Outfits
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New Clothing Item</h2>

                            {/* превью изображения с шаблоном */}
                            <div className="flex justify-center mb-6">
                                <div className="w-48 h-48 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
                                    {formData.file ? (
                                        <img
                                            src={URL.createObjectURL(formData.file)}
                                            alt="Preview"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <ClothingTemplate
                                            type={formData.type || 'Shirts'}
                                            subtype={formData.subtype || 'Casual'}
                                            color={formData.color || 'Gray'}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* TYPE SELECT */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value, subtype: '' })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">Select type</option>
                                        <option value="Shirts">Shirts</option>
                                        <option value="Outwear">Outwear</option>
                                        <option value="Pants">Pants</option>
                                        <option value="Shoes">Shoes</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>

                                {/* SUBTYPE SELECT */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtype</label>
                                    <select
                                        value={formData.subtype}
                                        onChange={(e) => setFormData({ ...formData, subtype: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        disabled={!formData.type}
                                    >
                                        <option value="">Select subtype</option>
                                        {formData.type === 'Shirts' && (
                                            <>
                                                <option value="Casual">T-Shirt</option>
                                                <option value="Shirt">Shirt</option>
                                                <option value="Polo">Polo</option>
                                                <option value="Long sleeve">Long sleeve</option>
                                                <option value="Hoodie">Hoodie</option>
                                                <option value="Sweatshirt">Sweatshirt</option>
                                                <option value="Tank top">Tank top</option>
                                            </>
                                        )}
                                        {formData.type === 'Outwear' && (
                                            <>
                                                <option value="Jacket">Jacket</option>
                                                <option value="Coat">Coat</option>
                                                <option value="Windbreaker">Windbreaker</option>
                                            </>
                                        )}
                                        {formData.type === 'Pants' && (
                                            <>
                                                <option value="Jeans">Jeans</option>
                                                <option value="Chinos">Chinos</option>
                                                <option value="Shorts">Shorts</option>
                                            </>
                                        )}
                                        {formData.type === 'Shoes' && (
                                            <>
                                                <option value="Sneakers">Sneakers</option>
                                                <option value="Boots">Boots</option>
                                                <option value="Sandals">Sandals</option>
                                            </>
                                        )}
                                        {formData.type === 'Accessories' && (
                                            <>
                                                <option value="Baseball cap">Baseball cap</option>
                                                <option value="Belt">Belt</option>
                                                <option value="Watch">Watch</option>
                                            </>
                                        )}
                                    </select>
                                </div>

                                {/* COLOR SELECT */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                                    <select
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">Select color</option>
                                        <option value="Black">⚫ Black</option>
                                        <option value="White">⚪ White</option>
                                        <option value="Gray">🔘 Gray</option>
                                        <option value="Blue">🔵 Blue</option>
                                        <option value="Red">🔴 Red</option>
                                        <option value="Green">🟢 Green</option>
                                        <option value="Beige">🟤 Beige</option>
                                        <option value="Navy">🔵 Navy</option>
                                        <option value="Brown">🟤 Brown</option>
                                        <option value="Pink">🩷 Pink</option>
                                        <option value="Yellow">🟡 Yellow</option>
                                        <option value="Purple">🟣 Purple</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Nike, Zara, H&M"
                                        value={formData.partnerBrand}
                                        onChange={(e) => setFormData({ ...formData, partnerBrand: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                {/* FILE UPLOAD */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Photo (optional)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setFormData({ ...formData, file: e.target.files?.[0] || null })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        💡 If no photo uploaded, a colored template will be shown
                                    </p>
                                </div>

                                {/* SAVE BUTTON */}
                                <button
                                    onClick={handleAddClothes}
                                    disabled={!formData.type || !formData.color}
                                    className="w-full mt-4 bg-purple-600 text-white py-3 rounded-full hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                                >
                                    Save Item
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}