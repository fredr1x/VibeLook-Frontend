import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Heart, Shirt } from 'lucide-react';
import {jwtDecode} from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

// -------------------- Вспомогательная функция для fetch --------------------
const fetchWithNgrokBypass = async (url: string, options: RequestInit = {}) => {
    const headers = {
        ...options.headers,
        'ngrok-skip-browser-warning': 'true',
    };

    return fetch(url, { ...options, headers });
};

interface UserPreferences {
    colorPreferences: string[];
    stylePreferences: string[];
}

interface Profile {
    id: number;
    keycloakId: string;
    email: string;
    firstname: string;
    lastname: string;
    gender?: string;
    memberStatus: string;
    userPreferences?: UserPreferences;
    savedLooksAmount?: number;
    wardrobeItemsAmount?: number;
    photoUrl?: string;
}

interface DecodedToken {
    sub: string;
    email?: string;
    preferred_username?: string;
    exp?: number;
}

function getUserIdFromToken(): string | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.sub;
    } catch (e) {
        console.error('Invalid token:', e);
        return null;
    }
}

function formatEnum(value?: string): string {
    if (!value) return '';
    return value
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

export default function Profile() {
    // -------------------- Состояния --------------------
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [editedFirstname, setEditedFirstname] = useState('');
    const [editedLastname, setEditedLastname] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedColors, setEditedColors] = useState<string[]>([]);
    const [editedStyles, setEditedStyles] = useState<string[]>([]);

    const [profilePhoto, setProfilePhoto] = useState<string>('https://via.placeholder.com/150?text=Avatar');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // -------------------- Загрузка профиля --------------------
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('accessToken');
            const userId = getUserIdFromToken();

            if (!token || !userId) {
                window.location.href = '/login';
                return;
            }

            try {
                // --- 1. Загружаем профиль ---
                const response = await fetchWithNgrokBypass(`${API_URL}/api/profile/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error('Failed to load profile');
                const data: Profile = await response.json();
                setProfile(data);

                // Инициализация редактирования
                setEditedFirstname(data.firstname);
                setEditedLastname(data.lastname);
                setEditedEmail(data.email);
                setEditedColors(data.userPreferences?.colorPreferences || []);
                setEditedStyles(data.userPreferences?.stylePreferences || []);

                // --- 2. Загружаем фото профиля как BLOB ---
                try {
                    const photoResponse = await fetchWithNgrokBypass(
                        `${API_URL}/api/files/get-profile/${data.keycloakId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (photoResponse.ok) {
                        const blob = await photoResponse.blob();
                        if (blob.size > 0) {
                            const imageUrl = URL.createObjectURL(blob);
                            setProfilePhoto(imageUrl);
                        } else {
                            setProfilePhoto('/public/resources/avatar-placeholder.png');
                        }
                    } else {
                        setProfilePhoto('/public/resources/avatar-placeholder.png');
                    }
                } catch (photoErr) {
                    console.error('Failed to load profile photo:', photoErr);
                    setProfilePhoto('/public/resources/avatar-placeholder.png');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // -------------------- Сохранение профиля --------------------
    const handleSave = async () => {
        if (!profile) return;
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetchWithNgrokBypass(`${API_URL}/api/profile/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: profile.id,
                    firstname: editedFirstname,
                    lastname: editedLastname,
                    email: editedEmail,
                    userPreferences: {
                        colorPreferences: editedColors,
                        stylePreferences: editedStyles,
                    },
                }),
            });

            if (!response.ok) throw new Error('Failed to update profile');
            const updated: Profile = await response.json();
            setProfile(updated);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    // -------------------- Загрузка фото --------------------
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) setProfilePhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadPhoto = async () => {
        if (!selectedFile || !profile) return;

        const token = localStorage.getItem('accessToken');
        const userId = getUserIdFromToken();
        if (!token || !userId) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetchWithNgrokBypass(`${API_URL}/api/files/profile/${userId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');
            const url = await response.text();
            setProfilePhoto(url);
            setSelectedFile(null);

            setProfile(prev => prev ? { ...prev, photoUrl: url } : prev);
        } catch (err) {
            console.error(err);
        }
    };
    
    if (isLoading) return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
    if (!profile) return <div className="flex justify-center items-center h-screen text-red-500">Profile not found</div>;

    // -------------------- UI --------------------
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                    <div className="px-8 pb-8 pt-20">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
                            <div className="relative">
                                <img
                                    src={profilePhoto}
                                    alt={`${profile.firstname} ${profile.lastname}`}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                                {isEditing && (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="fileInput"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <label
                                            htmlFor="fileInput"
                                            className="absolute bottom-0 right-0 cursor-pointer bg-purple-600 text-white px-3 py-1 rounded-full text-xs hover:bg-purple-700"
                                        >
                                            Change
                                        </label>
                                    </>
                                )}
                            </div>

                            {isEditing && selectedFile && (
                                <button
                                    onClick={handleUploadPhoto}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 text-sm whitespace-nowrap self-start"
                                >
                                    Upload Photo
                                </button>
                            )}

                            <div className="flex-1 text-center sm:text-left min-w-0">
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={editedFirstname}
                                            onChange={e => setEditedFirstname(e.target.value)}
                                            placeholder="First Name"
                                            className="w-full text-2xl font-bold text-gray-900 border-b-2 border-purple-600 focus:outline-none px-2 py-1 bg-white"
                                        />
                                        <input
                                            type="text"
                                            value={editedLastname}
                                            onChange={e => setEditedLastname(e.target.value)}
                                            placeholder="Last Name"
                                            className="w-full text-2xl font-bold text-gray-900 border-b-2 border-purple-600 focus:outline-none px-2 py-1 bg-white"
                                        />
                                        <input
                                            type="email"
                                            value={editedEmail}
                                            onChange={e => setEditedEmail(e.target.value)}
                                            placeholder="Email"
                                            className="w-full text-gray-600 border-b-2 border-purple-600 focus:outline-none px-2 py-1 bg-white"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {profile.firstname} {profile.lastname}
                                        </h1>
                                        <p className="text-gray-600 flex items-center justify-center sm:justify-start mt-1">
                                            <Mail className="w-4 h-4 mr-2" />
                                            {profile.email}
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="flex gap-2 sm:ml-auto shrink-0">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="px-6 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setSelectedFile(null);
                                                if (profile) {
                                                    setEditedFirstname(profile.firstname);
                                                    setEditedLastname(profile.lastname);
                                                    setEditedEmail(profile.email);
                                                    setProfilePhoto(profile.photoUrl || '/public/resources/avatar-placeholder.png');
                                                }
                                            }}
                                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-purple-50 rounded-xl p-6 text-center">
                                <Shirt className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <p className="text-3xl font-bold text-gray-900">{profile.wardrobeItemsAmount || 0}</p>
                                <p className="text-gray-600 text-sm">Wardrobe Items</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-6 text-center">
                                <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <p className="text-3xl font-bold text-gray-900">{profile.savedLooksAmount || 0}</p>
                                <p className="text-gray-600 text-sm">Saved Looks</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-6 text-center">
                                <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <p className="text-3xl font-bold text-gray-900">{formatEnum(profile.memberStatus)}</p>
                                <p className="text-gray-600 text-sm">Member Status</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Style Preferences</h2>

                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Favorite Styles</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {editedStyles.map(style => (
                                            <span
                                                key={style}
                                                className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium"
                                            >
                                                {formatEnum(style)}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Favorite Colors</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {editedColors.map(color => (
                                            <span
                                                key={color}
                                                className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium"
                                            >
                                                {formatEnum(color)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}