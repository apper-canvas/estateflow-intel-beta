import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import propertyService from '../services/api/propertyService'

function MainFeature() {
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    location: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    status: 'available'
  })
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'map'
  const [sortBy, setSortBy] = useState('price-asc')
  const [savedProperties, setSavedProperties] = useState(new Set())

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true)
      try {
        const result = await propertyService.getAll()
        setProperties(result || [])
        setFilteredProperties(result || [])
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load properties")
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  useEffect(() => {
    filterAndSortProperties()
  }, [filters, sortBy, properties])

  const filterAndSortProperties = () => {
    let filtered = [...(properties || [])]

    // Apply filters
    if (filters.location) {
      filtered = filtered.filter(property => 
        property.location?.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.location?.state?.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.title?.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.priceMin) {
      filtered = filtered.filter(property => property.price >= parseInt(filters.priceMin))
    }

    if (filters.priceMax) {
      filtered = filtered.filter(property => property.price <= parseInt(filters.priceMax))
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.bedrooms))
    }

    if (filters.bathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= parseInt(filters.bathrooms))
    }

    if (filters.propertyType) {
      filtered = filtered.filter(property => property.propertyType === filters.propertyType)
    }

    if (filters.status) {
      filtered = filtered.filter(property => property.status === filters.status)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'newest':
          return new Date(b.listingDate) - new Date(a.listingDate)
        case 'size-desc':
          return (b.squareFeet || 0) - (a.squareFeet || 0)
        default:
          return 0
      }
    })

    setFilteredProperties(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      status: 'available'
    })
    toast.success("Filters cleared")
  }

  const toggleSaveProperty = (propertyId) => {
    const newSaved = new Set(savedProperties)
    if (newSaved.has(propertyId)) {
      newSaved.delete(propertyId)
      toast.success("Property removed from saved")
    } else {
      newSaved.add(propertyId)
      toast.success("Property saved successfully")
    }
setSavedProperties(newSaved)
  }

  const handleViewDetails = (propertyId) => {
    toast.info(`Viewing details for property ${propertyId}`)
    // Navigate to property details page or open modal
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-6 lg:p-8 border-b border-surface-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl lg:text-3xl font-heading font-bold text-surface-900 mb-2">
              Property Search & Discovery
            </h2>
            <p className="text-surface-600">
              Use our advanced filters to find your perfect property match
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-surface-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                <ApperIcon name="Grid3X3" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                <ApperIcon name="Map" className="w-4 h-4" />
              </button>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="size-desc">Largest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 lg:p-8 bg-surface-50 border-b border-surface-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <div className="xl:col-span-2">
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="City, State, or Zip"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <ApperIcon name="MapPin" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Min Price
            </label>
            <input
              type="number"
              placeholder="$0"
              value={filters.priceMin}
              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              className="w-full px-4 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Max Price
            </label>
            <input
              type="number"
              placeholder="$999,999"
              value={filters.priceMax}
              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              className="w-full px-4 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Bedrooms
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="w-full px-4 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              className="w-full px-4 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-surface-100 text-surface-700 rounded-lg hover:bg-surface-200 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ApperIcon name="X" className="w-4 h-4" />
              <span className="text-sm font-medium">Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900">
            {loading ? 'Loading...' : `${filteredProperties.length} Properties Found`}
          </h3>
          {filteredProperties.length > 0 && (
            <div className="text-sm text-surface-600">
              Showing {Math.min(filteredProperties.length, 12)} of {filteredProperties.length} results
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 bg-surface-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-surface-200 rounded mb-2"></div>
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
              <ApperIcon name="AlertTriangle" className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Home" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-surface-900 mb-2">No Properties Found</h4>
            <p className="text-surface-600 mb-4">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProperties.slice(0, 12).map((property, index) => (
                <motion.div
                  key={property.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 glass-dark text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {formatPrice(property.price)}
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.status === 'available' ? 'bg-secondary text-white' : 
                        property.status === 'pending' ? 'bg-accent text-white' : 
                        'bg-surface-400 text-white'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                    <button 
                      onClick={() => toggleSaveProperty(property.id)}
                      className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors duration-200"
                    >
                      <ApperIcon 
                        name="Heart" 
                        className={`w-5 h-5 transition-colors duration-200 ${
                          savedProperties.has(property.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-surface-400'
                        }`} 
                      />
                    </button>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="font-heading font-semibold text-lg text-surface-900 mb-2 line-clamp-2">
                      {property.title}
                    </h4>
                    <div className="flex items-center space-x-1 text-surface-600 mb-3">
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
                    
                    <button 
                      onClick={() => handleViewDetails(property.id)}
                      className="w-full py-2.5 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-surface-100 rounded-xl p-8 text-center">
            <ApperIcon name="Map" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-surface-900 mb-2">Map View</h4>
            <p className="text-surface-600">
              Interactive map view would be displayed here with property markers
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MainFeature