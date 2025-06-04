import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

function NeighborhoodDetails() {
  const { city, state } = useParams()
  const navigate = useNavigate()

  const handleBackToProperties = () => {
    navigate('/properties')
  }

  const handleContactAgent = () => {
    toast.success('Agent contact information will be available soon')
  }

  const handleSaveNeighborhood = () => {
    toast.success('Neighborhood saved to your favorites')
  }

  // Mock neighborhood data - in a real app, this would be fetched based on city/state
  const neighborhoodData = {
    name: `${city}, ${state}`,
    overview: `${city} is a vibrant community known for its family-friendly atmosphere, excellent schools, and convenient location. The area offers a perfect blend of urban amenities and suburban comfort.`,
    walkScore: 78,
    transitScore: 65,
    bikeScore: 72,
    medianHomePrice: '$425,000',
    averageRent: '$2,100',
    crimeSafety: 85,
    schoolRating: 8.5,
    demographics: {
      population: '47,250',
      medianAge: 34,
      medianIncome: '$78,500',
      homeOwnership: '67%'
    },
    amenities: [
      { type: 'restaurant', name: 'The Garden Bistro', rating: 4.6, distance: '0.3 miles' },
      { type: 'shopping', name: 'City Center Mall', rating: 4.2, distance: '0.8 miles' },
      { type: 'park', name: 'Riverside Park', rating: 4.8, distance: '0.5 miles' },
      { type: 'gym', name: 'FitLife Gym', rating: 4.4, distance: '0.6 miles' },
      { type: 'grocery', name: 'Fresh Market', rating: 4.3, distance: '0.4 miles' },
      { type: 'hospital', name: 'Community Medical Center', rating: 4.5, distance: '1.2 miles' }
    ],
    schools: [
      { name: 'Oakwood Elementary', type: 'Elementary', rating: 9, distance: '0.7 miles' },
      { name: 'Central Middle School', type: 'Middle', rating: 8, distance: '1.1 miles' },
      { name: 'Heritage High School', type: 'High', rating: 8.5, distance: '1.8 miles' }
    ],
    transportation: [
      { type: 'Bus', name: 'Metro Bus Route 42', frequency: 'Every 15 minutes' },
      { type: 'Train', name: 'Light Rail Station', distance: '0.9 miles' },
      { type: 'Highway', name: 'I-95 Access', distance: '2.1 miles' }
    ]
  }

  const getAmenityIcon = (type) => {
    switch (type) {
      case 'restaurant': return 'UtensilsCrossed'
      case 'shopping': return 'ShoppingBag'
      case 'park': return 'Trees'
      case 'gym': return 'Dumbbell'
      case 'grocery': return 'ShoppingCart'
      case 'hospital': return 'Heart'
      default: return 'MapPin'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-surface-200/50 backdrop-blur-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button 
              onClick={handleBackToProperties}
              className="flex items-center space-x-2 text-surface-600 hover:text-surface-900 transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5" />
              <span className="font-medium">Back to Properties</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Home" className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-surface-900">
                EstateFlow
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleSaveNeighborhood}
                className="p-2 bg-surface-100 text-surface-600 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <ApperIcon name="Star" className="w-5 h-5" />
              </button>
              <button className="p-2 bg-surface-100 text-surface-600 rounded-full hover:bg-surface-200 transition-colors">
                <ApperIcon name="Share" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 lg:py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-surface-900 mb-4">
              {neighborhoodData.name}
            </h1>
            <p className="text-xl text-surface-600 mb-8 leading-relaxed">
              {neighborhoodData.overview}
            </p>
            
            {/* Key Scores */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h3 className="text-sm font-medium text-surface-600 mb-2">Walk Score</h3>
                <div className={`text-2xl font-bold rounded-lg px-3 py-1 inline-block ${getScoreColor(neighborhoodData.walkScore)}`}>
                  {neighborhoodData.walkScore}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h3 className="text-sm font-medium text-surface-600 mb-2">Transit Score</h3>
                <div className={`text-2xl font-bold rounded-lg px-3 py-1 inline-block ${getScoreColor(neighborhoodData.transitScore)}`}>
                  {neighborhoodData.transitScore}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h3 className="text-sm font-medium text-surface-600 mb-2">Bike Score</h3>
                <div className={`text-2xl font-bold rounded-lg px-3 py-1 inline-block ${getScoreColor(neighborhoodData.bikeScore)}`}>
                  {neighborhoodData.bikeScore}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Demographics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-property-card"
              >
                <h2 className="text-2xl font-heading font-bold text-surface-900 mb-6">Demographics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{neighborhoodData.demographics.population}</div>
                    <div className="text-sm text-surface-600">Population</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{neighborhoodData.demographics.medianAge}</div>
                    <div className="text-sm text-surface-600">Median Age</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{neighborhoodData.demographics.medianIncome}</div>
                    <div className="text-sm text-surface-600">Median Income</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{neighborhoodData.demographics.homeOwnership}</div>
                    <div className="text-sm text-surface-600">Home Ownership</div>
                  </div>
                </div>
              </motion.div>

              {/* Amenities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-property-card"
              >
                <h2 className="text-2xl font-heading font-bold text-surface-900 mb-6">Local Amenities</h2>
                <div className="space-y-4">
                  {neighborhoodData.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name={getAmenityIcon(amenity.type)} className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-surface-900">{amenity.name}</h4>
                          <p className="text-sm text-surface-600">{amenity.distance}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Star" className="w-4 h-4 text-accent fill-current" />
                        <span className="text-sm font-medium text-surface-700">{amenity.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Schools */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-property-card"
              >
                <h2 className="text-2xl font-heading font-bold text-surface-900 mb-6">Schools</h2>
                <div className="space-y-4">
                  {neighborhoodData.schools.map((school, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="GraduationCap" className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-surface-900">{school.name}</h4>
                          <p className="text-sm text-surface-600">{school.type} • {school.distance}</p>
                        </div>
                      </div>
                      <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {school.rating}/10
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Transportation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-property-card"
              >
                <h2 className="text-2xl font-heading font-bold text-surface-900 mb-6">Transportation</h2>
                <div className="space-y-4">
                  {neighborhoodData.transportation.map((transport, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-surface-50 rounded-xl">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Car" className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-medium text-surface-900">{transport.name}</h4>
                        <p className="text-sm text-surface-600">
                          {transport.frequency || transport.distance}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Market Data */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-property-card"
              >
                <h3 className="text-lg font-semibold text-surface-900 mb-4">Market Overview</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-surface-600 text-sm">Median Home Price</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">{neighborhoodData.medianHomePrice}</div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-surface-600 text-sm">Average Rent</span>
                    </div>
                    <div className="text-2xl font-bold text-secondary">{neighborhoodData.averageRent}</div>
                  </div>
                </div>
              </motion.div>

              {/* Safety Score */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-property-card"
              >
                <h3 className="text-lg font-semibold text-surface-900 mb-4">Safety & Schools</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-surface-600">Crime Safety Score</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(neighborhoodData.crimeSafety)}`}>
                      {neighborhoodData.crimeSafety}/100
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-surface-600">School Rating</span>
                    <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {neighborhoodData.schoolRating}/10
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-property-card"
              >
                <h3 className="text-lg font-semibold text-surface-900 mb-4">Get More Info</h3>
                <div className="space-y-3">
                  <button 
                    onClick={handleContactAgent}
                    className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                  >
                    Contact Local Agent
                  </button>
                  <button 
                    onClick={() => navigate('/properties', { state: { location: city } })}
                    className="w-full py-3 bg-surface-100 text-surface-700 rounded-xl font-medium hover:bg-surface-200 transition-colors"
                  >
                    View Properties Here
                  </button>
                  <button className="w-full py-3 bg-surface-100 text-surface-700 rounded-xl font-medium hover:bg-surface-200 transition-colors">
                    Get Market Report
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NeighborhoodDetails