import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Heart, Shirt } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    favoriteColors: ['Purple', 'Black', 'White', 'Navy'],
    favoriteStyles: ['Casual', 'Business', 'Streetwear'],
    wardrobeSize: 24,
    savedLooks: 3,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [editedEmail, setEditedEmail] = useState(profile.email);

  const handleSave = () => {
    setProfile({
      ...profile,
      name: editedName,
      email: editedEmail,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-32"></div>

          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-2xl font-bold text-gray-900 border-b-2 border-purple-600 focus:outline-none px-2 py-1"
                    />
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="block text-gray-600 border-b-2 border-purple-600 focus:outline-none px-2 py-1"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                    <p className="text-gray-600 flex items-center justify-center sm:justify-start mt-1">
                      <Mail className="w-4 h-4 mr-2" />
                      {profile.email}
                    </p>
                  </>
                )}
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-auto">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
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
                <p className="text-3xl font-bold text-gray-900">{profile.wardrobeSize}</p>
                <p className="text-gray-600 text-sm">Wardrobe Items</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 text-center">
                <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{profile.savedLooks}</p>
                <p className="text-gray-600 text-sm">Saved Looks</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 text-center">
                <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">Premium</p>
                <p className="text-gray-600 text-sm">Member Status</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Style Preferences</h2>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Favorite Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.favoriteColors.map((color) => (
                      <span
                        key={color}
                        className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Favorite Styles</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.favoriteStyles.map((style) => (
                      <span
                        key={style}
                        className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium"
                      >
                        {style}
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
