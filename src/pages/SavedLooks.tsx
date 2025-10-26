import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Heart } from 'lucide-react';

type SavedOutfit = {
  id: string;
  name: string;
  items: string[];
  occasion: string;
  savedDate: string;
};

export default function SavedLooks() {
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([
    {
      id: '1',
      name: 'Casual Weekend',
      items: [
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      occasion: 'Casual',
      savedDate: '2025-10-14',
    },
    {
      id: '2',
      name: 'Business Professional',
      items: [
        'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      occasion: 'Business',
      savedDate: '2025-10-13',
    },
    {
      id: '3',
      name: 'Date Night Chic',
      items: [
        'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      occasion: 'Evening',
      savedDate: '2025-10-12',
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleDelete = (id: string) => {
    setSavedOutfits(savedOutfits.filter(outfit => outfit.id !== id));
  };

  const handleEditStart = (outfit: SavedOutfit) => {
    setEditingId(outfit.id);
    setEditName(outfit.name);
  };

  const handleEditSave = (id: string) => {
    setSavedOutfits(savedOutfits.map(outfit =>
      outfit.id === id ? { ...outfit, name: editName } : outfit
    ));
    setEditingId(null);
    setEditName('');
  };

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Saved Looks
          </h1>
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
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
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
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full">
                          {outfit.occasion}
                        </span>
                        <span className="text-xs text-gray-500">
                          Saved {new Date(outfit.savedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditStart(outfit)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(outfit.id)}
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
    </div>
  );
}
