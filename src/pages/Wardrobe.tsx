import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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

const ClothingTemplate = ({ type, subtype }: { type: string; subtype: string; color: string }) => {
    const getTemplatePath = (type: string, subtype: string): string => {
        const templates: Record<string, Record<string, string>> = {
            'SHIRTS': {
                'T_SHIRT': '/resources/shirts/tshirt.png',
                'SHIRT': '/resources/shirts/shirt.png',
                'POLO': '/resources/shirts/polo.png',
                'LONG_SLEEVE': '/resources/shirts/longsleeve.png',
                'HOODIE': '/resources/shirts/hoodie.png',
                'SWEATSHIRT': '/resources/shirts/sweatshirt.png',
                'TANK_TOP': '/resources/shirts/tanktop.png',
            },
            'PANTS': {
                'JEANS': '/resources/pants/jeans.png',
                'CHINOS': '/resources/pants/chinos.png',
                'SHORTS': '/resources/pants/shorts.png',
                'JOGGERS': '/resources/pants/joggers.png',
                'SUIT_PANTS': '/resources/pants/suitpants.png',
                'CARGO': '/resources/pants/cargo.png',
            },
            'OUTWEAR': {
                'JACKET': '/resources/outwears/jacket.png',
                'COAT': '/resources/outwears/coat.png',
                'WINDBREAKER': '/resources/outwears/windbreaker.png',
                'ZIPPER_JACKET': '/resources/outwears/zipperjacket.png',
                'SUIT_JACKET': '/resources/outwears/suitjacket.png',
                'DOWN_JACKET': '/resources/outwears/downjacket.png',
                'VEST': '/resources/outwears/vest.png'
            },
            'SHOES': {
                'SNEAKERS': '/resources/shoes/sneakers.png',
                'BOOTS': '/resources/shoes/boots.png',
                'SANDALS': '/resources/shoes/sandals.png',
                'LOAFERS': '/resources/shoes/loafers.png',
                'FORMAL_SHOES': '/resources/shoes/formalshoes.png',
                'HEELS': '/resources/shoes/heels.png',
                'SLIPPERS': '/resources/shoes/slippers.png',
                'CROCS': '/resources/shoes/crocs.png',
            },
            'ACCESSORIES': {
                'CAP': '/resources/accessories/cap.png',
                'BELT': '/resources/accessories/belt.png',
                'WATCH': '/resources/accessories/watch.png',
                'BEANIE': '/resources/accessories/beanie.png',
                'HAT': '/resources/accessories/hat.png',
                'SCARF': '/resources/accessories/scarf.png',
                'TIE': '/resources/accessories/tie.png',
                'SUNGLASSES': '/resources/accessories/sunglasses.png',
                'BRACELET': '/resources/accessories/bracelet.png',
            },
        };

        const typeTemplates = templates[type];
        if (typeTemplates && typeTemplates[subtype]) {
            return typeTemplates[subtype];
        }

        const defaultTemplates: Record<string, string> = {
            'Shirts': '/resources/shirts/shirt.png',
            'Pants': '/resources/pants/chinos.png',
            'Outwear': '/resources/outwears/downjacket.png',
            'Shoes': '/resources/shoes/sneakers.png',
            'Accessories': '/resources/accessories/watch.png',
        };

        return defaultTemplates[type] || '/resources/shirts/tshirt.png';
    };

    const templatePath = getTemplatePath(type, subtype);

    return (
        <img
            src={templatePath}
            alt={`${type} ${subtype}`}
            className="w-full h-full object-contain"
        />
    );
};

export default function Wardrobe() {
    const [items, setItems] = useState<ClothingItem[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [wardrobeId, setWardrobeId] = useState<number | null>(null);
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

    // -------------------- Axios instance с ngrok bypass --------------------
    const api = axios.create({
        baseURL: `${API_URL}/api`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'ngrok-skip-browser-warning': 'true', // ✅ Добавлен заголовок
        },
    });

    const categories: string[] = ['All', 'Shirts', 'Outwear', 'Pants', 'Shoes', 'Accessories'];

    /** Дефолтные шаблоны по типу */
    const defaultImages: Record<string, string> = {
        Shirts: '/resources/shirt.png',
        Outwear: '/resources/windbreaker.png',
        Pants: '/resources/chinos.png',
        Shoes: '/resources/sneakers.png',
        Accessories: '/resources/watch.png',
        Other: '/resources/shirt.png',
    };

    const fetchData = async () => {
        if (!keycloakId || !accessToken) {
            setError('Authentication required. Please log in.');
            setLoading(false);
            return;
        }

        try {
            // Получаем wardrobe с одеждой
            const wardrobeRes = await api.get(`/wardrobes/${keycloakId}`);
            setWardrobeId(wardrobeRes.data.id);
            const clothes = wardrobeRes.data.clothes || [];

            // Получаем Map<Long, byte[]> с фото
            const photosRes = await api.get(`/clothes/photos/${keycloakId}`);
            const photosMap: Record<string, string> = photosRes.data; // { clothesId: base64 }

            const merged: ClothingItem[] = clothes.map((item: any) => {
                const base64 = photosMap[item.id]; // берём фото по id
                let imageUrl = '';

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
                    id: item.id,
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
            wardrobeId: wardrobeId,
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
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'ngrok-skip-browser-warning': 'true', // ✅ Для multipart тоже
                },
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
                    category: added.type.charAt(0).toUpperCase() + added.type.slice(1).toLowerCase(),
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

    /** Удаление вещи */
    const handleDeleteItem = async (itemId: string) => {
        try {
            await api.delete(`/clothes/delete/${itemId}`);
            setItems(items.filter((i) => i.id !== itemId));
        } catch (err) {
            console.error('Failed to delete item:', err);
            alert('Failed to delete item.');
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
                                            onClick={() => handleDeleteItem(item.id)}
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value, subtype: '' })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">Select type</option>
                                        <option value="SHIRTS">Shirts</option>
                                        <option value="OUTWEAR">Outwear</option>
                                        <option value="PANTS">Pants</option>
                                        <option value="SHOES">Shoes</option>
                                        <option value="ACCESSORIES">Accessories</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtype</label>
                                    <select
                                        value={formData.subtype}
                                        onChange={(e) => setFormData({ ...formData, subtype: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        disabled={!formData.type}
                                    >
                                        <option value="">Select subtype</option>
                                        {formData.type === 'OUTWEAR' && (
                                            <>
                                                <option value="COAT">Coat</option>
                                                <option value="DOWN_JACKET">Down jacket</option>
                                                <option value="JACKET">Jacket</option>
                                                <option value="SUIT_JACKET">Suit jacket</option>
                                                <option value="VEST">Vest</option>
                                                <option value="WINDBREAKER">Windbreaker</option>
                                                <option value="ZIPPER_JACKET">Zipper jacket</option>
                                            </>
                                        )}
                                        {formData.type === 'SHIRTS' && (
                                            <>
                                                <option value="HOODIE">Hoodie</option>
                                                <option value="LONG_SLEEVE">Long sleeve</option>
                                                <option value="POLO">Polo</option>
                                                <option value="SHIRT">Shirt</option>
                                                <option value="SWEATSHIRT">Sweatshirt</option>
                                                <option value="TANK_TOP">Tank top</option>
                                                <option value="T_SHIRT">T-Shirt</option>
                                            </>
                                        )}
                                        {formData.type === 'PANTS' && (
                                            <>
                                                <option value="CARGO">Cargo</option>
                                                <option value="CHINOS">Chinos</option>
                                                <option value="JEANS">Jeans</option>
                                                <option value="JOGGERS">Joggers</option>
                                                <option value="SHORTS">Shorts</option>
                                                <option value="SUIT_PANTS">Suit pants</option>
                                            </>
                                        )}
                                        {formData.type === 'SHOES' && (
                                            <>
                                                <option value="BOOTS">Boots</option>
                                                <option value="CROCS">Crocs</option>
                                                <option value="FORMAL_SHOES">Formal shoes</option>
                                                <option value="HEELS">Heels</option>
                                                <option value="LOAFERS">Loafers</option>
                                                <option value="SANDALS">Sandals</option>
                                                <option value="SLIPPERS">Slippers</option>
                                                <option value="SNEAKERS">Sneakers</option>
                                            </>
                                        )}
                                        {formData.type === 'ACCESSORIES' && (
                                            <>
                                                <option value="BEANIE">Beanie</option>
                                                <option value="BELT">Belt</option>
                                                <option value="BRACELET">Bracelet</option>
                                                <option value="CAP">Cap</option>
                                                <option value="HAT">Hat</option>
                                                <option value="SCARF">Scarf</option>
                                                <option value="SUNGLASSES">Sunglasses</option>
                                                <option value="TIE">Tie</option>
                                                <option value="WATCH">Watch</option>
                                            </>
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                                    <select
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">Select color</option>

                                        <option value="WHITE">White</option>
                                        <option value="BLACK">Black</option>
                                        <option value="GRAY">Gray</option>
                                        <option value="BROWN">Brown</option>
                                        <option value="BEIGE">Beige</option>
                                        <option value="CREAM">Cream</option>

                                        <option value="RED">Red</option>
                                        <option value="MAROON">Maroon</option>
                                        <option value="PINK">Pink</option>
                                        <option value="ORANGE">Orange</option>
                                        <option value="CORAL">Coral</option>
                                        <option value="BURGUNDY">Burgundy</option>

                                        <option value="BLUE">Blue</option>
                                        <option value="NAVY">Navy</option>
                                        <option value="SKY_BLUE">Sky Blue</option>
                                        <option value="TURQUOISE">Turquoise</option>
                                        <option value="CYAN">Cyan</option>
                                        <option value="TEAL">Teal</option>

                                        <option value="GREEN">Green</option>
                                        <option value="OLIVE">Olive</option>
                                        <option value="KHAKI">Khaki</option>
                                        <option value="MINT">Mint</option>

                                        <option value="PURPLE">Purple</option>
                                        <option value="LILAC">Lilac</option>
                                        <option value="VIOLET">Violet</option>

                                        <option value="YELLOW">Yellow</option>
                                        <option value="GOLD">Gold</option>
                                        <option value="MUSTARD">Mustard</option>

                                        <option value="SILVER">Silver</option>
                                        <option value="CHARCOAL">Charcoal</option>

                                        <option value="IVORY">Ivory</option>
                                        <option value="DENIM">Denim</option>
                                        <option value="CAMEL">Camel</option>

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
                                        💡Note: if no photo uploaded, only a template will be shown
                                    </p>
                                </div>

                                <button
                                    onClick={handleAddClothes}
                                    disabled={!formData.type || !formData.color}
                                    className="w-full mt-4 bg-purple-600 text-white py-3 rounded-full hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                                >
                                    Save item
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
