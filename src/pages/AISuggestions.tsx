import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Outfit = {
  id: string;
  name: string;
  items: string[];
  occasion: string;
  saved: boolean;
};

export default function AISuggestions() {
  const navigate = useNavigate();
  const [outfits, setOutfits] = useState<Outfit[]>([
    {
      id: '1',
      name: 'Casual Weekend',
      items: [
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      occasion: 'Casual',
      saved: false,
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
      saved: false,
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
      saved: false,
    },
    {
      id: '4',
      name: 'Summer Vibes',
      items: [
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      occasion: 'Casual',
      saved: false,
    },
  ]);

  const handleSaveLook = (id: string) => {
    setOutfits(outfits.map(outfit =>
      outfit.id === id ? { ...outfit, saved: !outfit.saved } : outfit
    ));
  };

  const savedCount = outfits.filter(o => o.saved).length;

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Outfit Suggestions
          </h1>
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
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {outfit.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full">
                      {outfit.occasion}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSaveLook(outfit.id)}
                    className={`p-2 rounded-full transition-colors ${
                      outfit.saved
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${outfit.saved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleSaveLook(outfit.id)}
                    className={`flex-1 px-4 py-2 rounded-full font-medium transition-colors ${
                      outfit.saved
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {outfit.saved ? 'Saved' : 'Save Look'}
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Shop
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-50 transition-colors border-2 border-purple-600">
            Generate More Outfits
          </button>
        </div>
      </div>
    </div>
  );
}
