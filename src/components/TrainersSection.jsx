import { motion } from 'framer-motion';

const TrainersSection = () => {
  const trainers = [
    {
      id: 1,
      name: "Vikram 'The Iron' Singh",
      role: "Elite Bodybuilding Coach",
      experience: "12+ Years Exp",
      specialty: "Hypertrophy & Contest Prep",
      image: "/images/trainer_male.png",
      quote: "Pain is weakness leaving the body.",
      color: "from-orange-600 to-red-600"
    },
    {
      id: 2,
      name: "Sarah 'Valkyrie' Kaur",
      role: "Functional Strength Expert",
      experience: "8+ Years Exp",
      specialty: "Fat Loss & Athletic Performance",
      image: "/images/trainer_female.png",
      quote: "Train like a warrior, look like a goddess.",
      color: "from-blue-600 to-purple-600"
    }
  ];

  return (
    <div className="py-16 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">
            Train with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Legends</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Unlock your true potential with personalized coaching from our elite trainers. 
            Don't just train—transform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {trainers.map((trainer, index) => (
            <motion.div 
              key={trainer.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-96 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-t ${trainer.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-20"></div>
                <img 
                  src={trainer.image} 
                  alt={trainer.name}
                  className="w-full h-full object-cover object-top transform group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Floating Badge */}
                <div className="absolute top-4 right-4 z-30 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-700">
                  <span className="text-white font-bold text-sm">⭐ {trainer.experience}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 relative z-30 -mt-20">
                <div className="bg-gray-900/90 backdrop-blur-xl p-6 rounded-2xl border border-gray-800 shadow-2xl">
                  <h3 className="text-2xl font-bold text-white mb-1">{trainer.name}</h3>
                  <p className={`text-sm font-bold bg-gradient-to-r ${trainer.color} bg-clip-text text-transparent mb-4 uppercase tracking-wider`}>
                    {trainer.role}
                  </p>
                  
                  <p className="text-gray-400 text-sm mb-6 italic">"{trainer.quote}"</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-300 text-sm">
                      <span className="w-6 text-center mr-2">🎯</span>
                      {trainer.specialty}
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <span className="w-6 text-center mr-2">🏆</span>
                      Proven Results
                    </div>
                  </div>

                  <button className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${trainer.color} hover:shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-1 transition-all duration-300`}>
                    Book Free Consultation
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainersSection;
