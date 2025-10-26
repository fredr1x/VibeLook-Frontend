import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';

type ClothingItem = {
  id: string;
  image: string;
  category: string;
  name: string;
};

export default function Wardrobe() {
  const [items, setItems] = useState<ClothingItem[]>([
    { id: '1', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Shirts', name: 'White T-Shirt' },
    { id: '2', image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Pants', name: 'Blue Jeans' },
    { id: '3', image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Shoes', name: 'White Sneakers' },
    { id: '4', image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Shirts', name: 'Black Blazer' },
    { id: '5', image: 'https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Accessories', name: 'Leather Bag' },
    { id: '6', image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Shoes', name: 'Black Boots' },
  ]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isDragging, setIsDragging] = useState(false);

  const categories = ['All', 'Shirts', 'Pants', 'Shoes', 'Accessories'];

  const filteredItems = activeFilter === 'All'
    ? items
    : items.filter(item => item.category === activeFilter);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Wardrobe
          </h1>
          <p className="text-lg text-gray-600">
            Upload and organize your clothing items
          </p>
        </motion.div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-8 border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            isDragging
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-300 bg-white'
          }`}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Your Clothes
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop images here, or click to browse
          </p>
          <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors">
            Browse Files
          </button>
        </div>

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
                onClick={() => handleRemoveItem(item.id)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-50"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-xs text-purple-600 font-semibold mb-1">
                  {item.category}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {item.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

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
      </div>
    </div>
  );
}
