import { useParams, Link } from 'react-router-dom'
import machinesData from '../data/machines.json'
import KGFLogo from '../components/KGFLogo'

const CategoryBrowse = () => {
  const { categoryId } = useParams()
  const category = machinesData[categoryId]

  if (!category) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
          <p className="mb-6 text-gray-400">The requested equipment category could not be found.</p>
          <Link to="/" className="inline-block bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white animate-fade-in">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </Link>
          <div className="text-center">
            <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {category.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <Link to="/scan" className="flex items-center space-x-2 text-orange-500 hover:text-orange-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Category Info */}
        <div className="relative overflow-hidden bg-gray-900 rounded-2xl p-8 mb-8 text-center border border-gray-800">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600"></div>
          {category.thumbnail && (
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-gray-800 shadow-xl">
                <img 
                  src={category.thumbnail} 
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
            </div>
          )}
          <h2 className="text-3xl font-bold mb-3 text-white">{category.name}</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">{category.description}</p>
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-sm text-gray-300">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            {Object.keys(category.machines).length} machines available
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(category.machines).map(([machineId, machine], index) => (
            <Link
              key={machineId}
              to={`/machine/${categoryId}/${machineId}`}
              className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 text-orange-500 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                    {machine.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{machine.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {machine.variations?.length || 0} Variations
                    </span>
                    <span className="text-orange-500 text-sm font-medium group-hover:translate-x-1 transition-transform flex items-center">
                      View Guide
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryBrowse