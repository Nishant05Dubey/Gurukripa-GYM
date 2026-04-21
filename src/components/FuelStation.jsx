import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const FuelStation = () => {
  const handleOrder = (item) => {
    toast.success(`Added ${item} to cart! 🥤`, {
      icon: '😋',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <div className="py-16 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter flex items-center gap-3">
              <span className="text-orange-500">⚡</span> Fuel Station
            </h2>
            <p className="text-gray-400 text-lg">Recharge, Recover, and Dominate.</p>
          </div>
          <button className="px-8 py-3 rounded-full bg-gray-800 border border-gray-700 text-white font-bold hover:bg-gray-700 transition-all flex items-center gap-2">
            View Full Menu 📜
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Featured Item 1: Pre-Workout */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-gray-900 rounded-3xl overflow-hidden border border-blue-900/50 group hover:border-blue-500/50 transition-colors"
          >
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-20">
              PRE-WORKOUT OF THE DAY
            </div>
            <div className="h-64 overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
               <img 
                 src="/images/pre_workout_drink.png" 
                 alt="Blue Voltage Pre-Workout" 
                 className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                 loading="lazy"
               />
            </div>
            <div className="p-6 relative z-20 -mt-12">
              <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-1">Blue Voltage ⚡</h3>
                <p className="text-blue-400 text-sm font-bold mb-4">Explosive Energy & Focus</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">₹150</span>
                  <button 
                    onClick={() => handleOrder('Blue Voltage')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-colors"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Featured Item 2: Post-Workout Smoothie */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-gray-900 rounded-3xl overflow-hidden border border-orange-900/50 group hover:border-orange-500/50 transition-colors"
          >
            <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-20">
              BEST SELLER
            </div>
            <div className="h-64 overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
               <img 
                 src="/images/protein_smoothie.png" 
                 alt="Tropical Mango Shred" 
                 className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                 loading="lazy"
               />
            </div>
            <div className="p-6 relative z-20 -mt-12">
              <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-1">Mango Shred 🥭</h3>
                <p className="text-orange-400 text-sm font-bold mb-4">30g Protein • Low Carb</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">₹200</span>
                  <button 
                    onClick={() => handleOrder('Mango Shred')}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-xl font-bold transition-colors"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FuelStation;
