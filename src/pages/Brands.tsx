import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';

type Brand = {
  id: string;
  name: string;
  logo: string;
  description: string;
  rating: number;
  category: string;
  url: string;
};

export default function Brands() {
  const brands: Brand[] = [
    {
      id: '1',
      name: 'Zara',
      logo: '/public/resources/brands/zara.png',
      description: 'Contemporary fashion with European flair',
      rating: 4.5,
      category: 'Fast Fashion',
      url: 'https://www.zara.com/kz/en/'
    },
    {
      id: '2',
      name: 'Nike',
      logo: '/public/resources/brands/nike.png',
      description: 'Athletic wear and streetwear essentials',
      rating: 4.8,
      category: 'Sportswear',
      url: 'https://www.nike.com/'
    },
    {
      id: '3',
      name: 'Uniqlo',
      logo: '/public/resources/brands/uniqlo.png',
      description: 'Quality basics and innovative fabrics',
      rating: 4.6,
      category: 'Basics',
      url: 'https://www.uniqlo.com/us/en/'
    },
    {
      id: '4',
      name: 'Adidas',
      logo: '/public/resources/brands/adidas.png',
      description: 'Sporty classics and modern streetwear',
      rating: 4.7,
      category: 'Sportswear',
      url: 'https://adidas.kz/ru'
    },
    {
      id: '5',
      name: 'Patagonia',
      logo: '/public/resources/brands/patagonia.png',
      description: 'American casual wear for everyone',
      rating: 4.2,
      category: 'Casual',
      url: 'https://www.patagonia.com/home/'
    },
    {
      id: '6',
      name: 'Levi\'s',
      logo: '/public/resources/brands/levis.png',
      description: 'Iconic denim and timeless styles',
      rating: 4.7,
      category: 'Denim',
      url: 'https://www.levi.com/US/en_US/'
    }
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
                  </div>/public
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {brand.description}
                </p>

                <a
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
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
