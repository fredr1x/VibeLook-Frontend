import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';

type Brand = {
  id: string;
  name: string;
  logo: string;
  description: string;
  rating: number;
  category: string;
};

export default function Brands() {
  const brands: Brand[] = [
    {
      id: '1',
      name: 'Zara',
      logo: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Contemporary fashion with European flair',
      rating: 4.5,
      category: 'Fast Fashion',
    },
    {
      id: '2',
      name: 'H&M',
      logo: 'https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Affordable and sustainable fashion choices',
      rating: 4.3,
      category: 'Fast Fashion',
    },
    {
      id: '3',
      name: 'Nike',
      logo: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Athletic wear and streetwear essentials',
      rating: 4.8,
      category: 'Sportswear',
    },
    {
      id: '4',
      name: 'Uniqlo',
      logo: 'https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Quality basics and innovative fabrics',
      rating: 4.6,
      category: 'Basics',
    },
    {
      id: '5',
      name: 'Adidas',
      logo: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Sporty classics and modern streetwear',
      rating: 4.7,
      category: 'Sportswear',
    },
    {
      id: '6',
      name: 'Gap',
      logo: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'American casual wear for everyone',
      rating: 4.2,
      category: 'Casual',
    },
    {
      id: '7',
      name: 'Levi\'s',
      logo: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Iconic denim and timeless styles',
      rating: 4.7,
      category: 'Denim',
    },
    {
      id: '8',
      name: 'Mango',
      logo: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Mediterranean-inspired fashion',
      rating: 4.4,
      category: 'Contemporary',
    },
    {
      id: '9',
      name: 'COS',
      logo: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Minimalist design and modern style',
      rating: 4.5,
      category: 'Premium',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fashion Brands
          </h1>
          <p className="text-lg text-gray-600">
            Shop similar styles from popular fashion retailers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {brand.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full">
                      {brand.category}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-semibold text-gray-700">
                      {brand.rating}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {brand.description}
                </p>

                <a
                  href="#"
                  className="flex items-center justify-center w-full px-4 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
                >
                  Shop Now
                  <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Partner with VibeLook
          </h2>
          <p className="text-gray-600 mb-6">
            Are you a fashion brand? Join our platform and reach style-conscious customers.
          </p>
          <button className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors">
            Become a Partner
          </button>
        </motion.div>
      </div>
    </div>
  );
}
