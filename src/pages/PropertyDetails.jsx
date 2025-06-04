import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import propertyService from '../services/api/propertyService'
import agentService from '../services/api/agentService'

function PropertyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
const loadPropertyDetails = async () => {
      try {
        setLoading(true)
        const properties = await propertyService.getAll()
        const foundProperty = properties.find(p => p.id === id)
        
        if (!foundProperty) {
          setError('Property not found')
          return
        }
        setProperty(foundProperty)
        
        // Load agent details if available
        if (foundProperty.agentId) {
          const agents = await agentService.getAll()
          const foundAgent = agents.find(a => a.id === foundProperty.agentId)
          setAgent(foundAgent)
        }
      } catch (err) {
        setError(err.message)
        toast.error('Failed to load property details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadPropertyDetails()
    }
  }, [id])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleContactAgent = () => {
    if (agent) {
      toast.success(`Contacting ${agent.name}...`)
    } else {
      toast.info('Agent contact information will be available soon')
    }
  }

  const handleScheduleTour = () => {
    toast.success('Tour request submitted! An agent will contact you soon.')
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
  }

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="animate-pulse">
          <div className="h-20 bg-surface-200 mb-8"></div>
          <div className="container mx-auto px-4">
            <div className="h-96 bg-surface-200 rounded-2xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-32 bg-surface-200 rounded-xl"></div>
                <div className="h-48 bg-surface-200 rounded-xl"></div>
              </div>
              <div className="h-64 bg-surface-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Property Not Found</h1>
          <p className="text-surface-600 mb-6">{error || 'The property you are looking for does not exist.'}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const images = property.images || ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"]

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-surface-200/50 backdrop-blur-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button 
              onClick={() => navigate('/')}
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
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'bg-red-100 text-red-600' : 'bg-surface-100 text-surface-600 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                <ApperIcon name="Heart" className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 bg-surface-100 text-surface-600 rounded-full hover:bg-surface-200 transition-colors">
                <ApperIcon name="Share" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <section className="relative">
        <div className="aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-surface-200">
          <img 
            src={images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <ApperIcon name="ChevronLeft" className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <ApperIcon name="ChevronRight" className="w-6 h-6" />
              </button>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Property Details */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-property-card"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-heading font-bold text-surface-900 mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center space-x-2 text-surface-600 mb-4">
                      <ApperIcon name="MapPin" className="w-5 h-5" />
                      <span className="text-lg">
                        {property.location?.address}, {property.location?.city}, {property.location?.state} {property.location?.zipCode}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                      {formatPrice(property.price)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.status === 'available' ? 'bg-secondary text-white' : 
                      property.status === 'pending' ? 'bg-accent text-white' : 
                      'bg-surface-400 text-white'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-surface-50 rounded-xl">
                    <ApperIcon name="Bed" className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-surface-900">{property.bedrooms}</div>
                    <div className="text-sm text-surface-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-surface-50 rounded-xl">
                    <ApperIcon name="Bath" className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-surface-900">{property.bathrooms}</div>
                    <div className="text-sm text-surface-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-surface-50 rounded-xl">
                    <ApperIcon name="Maximize" className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-surface-900">{property.squareFeet?.toLocaleString()}</div>
                    <div className="text-sm text-surface-600">Sq Ft</div>
                  </div>
                  <div className="text-center p-4 bg-surface-50 rounded-xl">
                    <ApperIcon name="Calendar" className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-surface-900">{property.yearBuilt || 'N/A'}</div>
                    <div className="text-sm text-surface-600">Year Built</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-surface-900 mb-4">Description</h3>
                  <p className="text-surface-600 leading-relaxed">
                    {property.description || 'This beautiful property offers modern living with exceptional features and amenities. Located in a desirable neighborhood, it provides the perfect blend of comfort, style, and convenience for today\'s lifestyle.'}
                  </p>
                </div>
              </motion.div>

              {/* Amenities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-property-card"
              >
                <h3 className="text-xl font-semibold text-surface-900 mb-6">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(property.amenities || [
                    'Air Conditioning', 'Heating', 'Parking', 'Garden', 'Swimming Pool', 'Gym',
                    'Security System', 'Balcony', 'Fireplace', 'Laundry Room', 'Walk-in Closet', 'Hardwood Floors'
                  ]).map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <ApperIcon name="Check" className="w-5 h-5 text-secondary" />
                      <span className="text-surface-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-property-card"
              >
                <h3 className="text-xl font-semibold text-surface-900 mb-6">Location</h3>
                <div className="aspect-[16/9] bg-surface-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <ApperIcon name="MapPin" className="w-12 h-12 text-surface-400 mx-auto mb-2" />
                    <p className="text-surface-600">Interactive map view would be displayed here</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Agent */}
              {agent && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-property-card"
                >
                  <h3 className="text-lg font-semibold text-surface-900 mb-4">Contact Agent</h3>
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src={agent.photo || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`}
                      alt={agent.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-surface-900">{agent.name}</h4>
                      <p className="text-surface-600 text-sm">{agent.agency}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <ApperIcon 
                            key={i} 
                            name="Star" 
                            className={`w-4 h-4 ${i < Math.floor(agent.rating) ? 'text-accent fill-current' : 'text-surface-300'}`} 
                          />
                        ))}
                        <span className="text-sm text-surface-600 ml-1">{agent.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button 
                      onClick={handleContactAgent}
                      className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                    >
                      Contact Agent
                    </button>
                    <button 
                      onClick={handleScheduleTour}
                      className="w-full py-3 bg-surface-100 text-surface-700 rounded-xl font-medium hover:bg-surface-200 transition-colors"
                    >
                      Schedule Tour
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-property-card"
              >
                <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full py-3 bg-secondary text-white rounded-xl font-medium hover:bg-secondary/90 transition-colors">
                    Calculate Mortgage
                  </button>
                  <button 
                    onClick={() => navigate('/comparison')}
                    className="w-full py-3 bg-surface-100 text-surface-700 rounded-xl font-medium hover:bg-surface-200 transition-colors"
                  >
                    Compare Properties
                  </button>
                  <button className="w-full py-3 bg-surface-100 text-surface-700 rounded-xl font-medium hover:bg-surface-200 transition-colors">
                    View Neighborhood
                  </button>
                </div>
              </motion.div>

              {/* Property Features */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-property-card"
              >
                <h3 className="text-lg font-semibold text-surface-900 mb-4">Property Features</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-surface-600">Property Type:</span>
                    <span className="text-surface-900 font-medium">{property.type || 'House'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600">Lot Size:</span>
                    <span className="text-surface-900 font-medium">{property.lotSize || '0.25 acres'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600">HOA Fees:</span>
                    <span className="text-surface-900 font-medium">{property.hoaFees || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600">Property ID:</span>
                    <span className="text-surface-900 font-medium">#{property.id}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PropertyDetails