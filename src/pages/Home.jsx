import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import propertyService from '../services/api/propertyService'
import agentService from '../services/api/agentService'

function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [topAgents, setTopAgents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadFeaturedData = async () => {
      setLoading(true)
      try {
        const [properties, agents] = await Promise.all([
          propertyService.getAll(),
          agentService.getAll()
        ])
        
        // Get featured properties (first 6)
        setFeaturedProperties(properties?.slice(0, 6) || [])
        
        // Get top agents (first 4)
        setTopAgents(agents?.slice(0, 4) || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedData()
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="animate-pulse">
          <div className="h-20 bg-surface-200 mb-8"></div>
          <div className="container mx-auto px-4">
            <div className="h-96 bg-surface-200 rounded-2xl mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-80 bg-surface-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass border-b border-surface-200/50 backdrop-blur-soft"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Home" className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-surface-900">
                EstateFlow
              </h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 px-4 py-2 pl-10 bg-white/80 border border-surface-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              </div>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors duration-200">
                <ApperIcon name="User" className="w-4 h-4" />
                <span className="text-sm font-medium">Sign In</span>
              </button>
            </div>

            <button className="md:hidden p-2 rounded-lg hover:bg-surface-100">
              <ApperIcon name="Menu" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative py-12 lg:py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl mx-4 sm:mx-6 lg:mx-8"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-surface-900 mb-6"
            >
              Find Your <span className="text-primary">Dream</span> Property
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-surface-600 mb-8 max-w-2xl mx-auto"
            >
              Discover extraordinary homes, connect with trusted agents, and make your property journey seamless with our advanced search and filtering tools.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <button className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                Start Searching
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-primary border-2 border-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-200">
                Browse Featured
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Feature Component */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MainFeature />
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 lg:py-16 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl lg:text-4xl font-heading font-bold text-surface-900 mb-4">
              Featured Properties
            </h3>
            <p className="text-lg text-surface-600 max-w-2xl mx-auto">
              Handpicked premium properties that offer exceptional value and stunning features
            </p>
          </motion.div>

          {error ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                <ApperIcon name="AlertTriangle" className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <AnimatePresence>
                {featuredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group bg-white rounded-2xl shadow-property-card hover:shadow-elevated transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 glass-dark text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {formatPrice(property.price)}
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          property.status === 'available' ? 'bg-secondary text-white' : 
                          property.status === 'pending' ? 'bg-accent text-white' : 
                          'bg-surface-400 text-white'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                      <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors duration-200">
                        <ApperIcon name="Heart" className="w-5 h-5 text-surface-400 hover:text-red-500" />
                      </button>
                    </div>
                    
                    <div className="p-6">
                      <h4 className="font-heading font-semibold text-xl text-surface-900 mb-2 line-clamp-2">
                        {property.title}
                      </h4>
                      <div className="flex items-center space-x-1 text-surface-600 mb-4">
                        <ApperIcon name="MapPin" className="w-4 h-4" />
                        <span className="text-sm">
                          {property.location?.city}, {property.location?.state}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-surface-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Bed" className="w-4 h-4" />
                          <span>{property.bedrooms} beds</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Bath" className="w-4 h-4" />
                          <span>{property.bathrooms} baths</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Maximize" className="w-4 h-4" />
                          <span>{property.squareFeet?.toLocaleString()} sqft</span>
                        </div>
                      </div>
                      
                      <button className="w-full py-3 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary hover:text-white transition-all duration-200 group-hover:bg-primary group-hover:text-white">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Top Agents */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl lg:text-4xl font-heading font-bold text-surface-900 mb-4">
              Top Rated Agents
            </h3>
            <p className="text-lg text-surface-600 max-w-2xl mx-auto">
              Connect with our network of experienced professionals who know the market inside out
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-property-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <img 
                  src={agent.photo || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face`}
                  alt={agent.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="font-semibold text-lg text-surface-900 mb-1">
                  {agent.name}
                </h4>
                <p className="text-surface-600 text-sm mb-3">{agent.agency}</p>
                <div className="flex items-center justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <ApperIcon 
                      key={i} 
                      name="Star" 
                      className={`w-4 h-4 ${i < Math.floor(agent.rating) ? 'text-accent fill-current' : 'text-surface-300'}`} 
                    />
                  ))}
                  <span className="text-sm text-surface-600 ml-1">
                    {agent.rating}
                  </span>
                </div>
                <p className="text-xs text-surface-500 mb-4">
                  {agent.listings?.length || 0} active listings
                </p>
                <button className="w-full py-2 bg-surface-100 text-surface-700 rounded-lg hover:bg-primary hover:text-white transition-colors duration-200">
                  Contact Agent
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                  <ApperIcon name="Home" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold">EstateFlow</h3>
              </div>
              <p className="text-surface-300 max-w-md">
                Your trusted partner in finding the perfect property. We connect buyers, sellers, and renters with the best opportunities in the market.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-surface-300">
                <li><a href="#" className="hover:text-white transition-colors">Properties</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Agents</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-surface-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-surface-700 mt-8 pt-8 text-center text-surface-400">
            <p>&copy; 2024 EstateFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home