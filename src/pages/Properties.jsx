import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import propertyService from '../services/api/propertyService'

function Properties() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [filters, setFilters] = useState({
    priceRange: searchParams.get('priceRange') || 'all',
    propertyType: searchParams.get('type') || 'all',
    bedrooms: searchParams.get('bedrooms') || 'all',
    bathrooms: searchParams.get('bathrooms') || 'all',
    location: searchParams.get('location') || '',
    status: searchParams.get('status') || 'all'
  })
const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [viewMode, setViewMode] = useState('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [selectedForComparison, setSelectedForComparison] = useState([])
  // Load properties
  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true)
      try {
        const allProperties = await propertyService.getAll()
        setProperties(allProperties || [])
      } catch (err) {
        setError(err.message)
        toast.error('Failed to load properties')
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  // Filter and search properties
  const filteredProperties = properties.filter(property => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        property.title?.toLowerCase().includes(query) ||
        property.description?.toLowerCase().includes(query) ||
        property.location?.city?.toLowerCase().includes(query) ||
        property.location?.state?.toLowerCase().includes(query) ||
        property.location?.address?.toLowerCase().includes(query)
      
      if (!matchesSearch) return false
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      const price = property.price
      switch (filters.priceRange) {
        case 'under-300k':
          if (price >= 300000) return false
          break
        case '300k-500k':
          if (price < 300000 || price >= 500000) return false
          break
        case '500k-800k':
          if (price < 500000 || price >= 800000) return false
          break
        case '800k-1m':
          if (price < 800000 || price >= 1000000) return false
          break
        case 'over-1m':
          if (price < 1000000) return false
          break
      }
    }

    // Property type filter
    if (filters.propertyType !== 'all' && property.type !== filters.propertyType) {
      return false
    }

    // Bedrooms filter
    if (filters.bedrooms !== 'all') {
      const bedrooms = parseInt(filters.bedrooms)
      if (property.bedrooms !== bedrooms) return false
    }

    // Bathrooms filter
    if (filters.bathrooms !== 'all') {
      const bathrooms = parseInt(filters.bathrooms)
      if (property.bathrooms !== bathrooms) return false
    }

    // Location filter
    if (filters.location) {
      const location = filters.location.toLowerCase()
      const matchesLocation = 
        property.location?.city?.toLowerCase().includes(location) ||
        property.location?.state?.toLowerCase().includes(location)
      
      if (!matchesLocation) return false
    }

    // Status filter
    if (filters.status !== 'all' && property.status !== filters.status) {
      return false
    }

    return true
  })

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'newest':
        return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
      case 'oldest':
        return new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now())
      case 'bedrooms':
        return b.bedrooms - a.bedrooms
      case 'sqft':
        return (b.squareFeet || 0) - (a.squareFeet || 0)
      default:
        return 0
    }
  })

  // Pagination
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProperties = sortedProperties.slice(startIndex, startIndex + itemsPerPage)

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    setCurrentPage(1)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    toast.info(`Searching for "${searchQuery}"`)
  }

  const clearFilters = () => {
    setFilters({
      priceRange: 'all',
      propertyType: 'all',
      bedrooms: 'all',
      bathrooms: 'all',
      location: '',
      status: 'all'
    })
    setSearchQuery('')
    setSortBy('newest')
    setCurrentPage(1)
toast.success('Filters cleared')
  }

  const togglePropertyForComparison = (property) => {
    setSelectedForComparison(prev => {
      const isSelected = prev.some(p => p.id === property.id)
      if (isSelected) {
        return prev.filter(p => p.id !== property.id)
      } else if (prev.length < 4) {
        return [...prev, property]
      } else {
        toast.warning('You can compare up to 4 properties at once')
        return prev
      }
    })
  }

  const clearComparison = () => {
    setSelectedForComparison([])
    toast.info('Comparison cleared')
  }

  const goToComparison = () => {
    if (selectedForComparison.length >= 2) {
      // Store comparison data in localStorage for the comparison page
      localStorage.setItem('comparisonProperties', JSON.stringify(selectedForComparison))
      navigate('/comparison')
    }
  }

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
            <div className="h-32 bg-surface-200 rounded-2xl mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
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
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                  <ApperIcon name="Home" className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-surface-900">
                  EstateFlow
                </h1>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 text-surface-600 hover:text-surface-900 transition-colors"
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search and Filters Section */}
      <section className="py-8 bg-white/80 border-b border-surface-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by location, property type, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-4 pl-12 pr-20 bg-white border border-surface-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-lg"
                />
                <ApperIcon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
              {/* Price Range */}
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="px-3 py-2 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">Any Price</option>
                <option value="under-300k">Under $300K</option>
                <option value="300k-500k">$300K - $500K</option>
                <option value="500k-800k">$500K - $800K</option>
                <option value="800k-1m">$800K - $1M</option>
                <option value="over-1m">Over $1M</option>
              </select>

              {/* Property Type */}
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                className="px-3 py-2 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">Any Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="villa">Villa</option>
              </select>

              {/* Bedrooms */}
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="px-3 py-2 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">Any Beds</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4">4 Beds</option>
                <option value="5">5+ Beds</option>
              </select>

              {/* Bathrooms */}
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                className="px-3 py-2 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">Any Baths</option>
                <option value="1">1 Bath</option>
                <option value="2">2 Baths</option>
                <option value="3">3 Baths</option>
                <option value="4">4+ Baths</option>
              </select>

              {/* Status */}
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">Any Status</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-surface-100 text-surface-600 rounded-lg hover:bg-surface-200 transition-colors flex items-center justify-center space-x-2"
              >
                <ApperIcon name="RotateCcw" className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <p className="text-surface-600">
                  <span className="font-semibold text-surface-900">{sortedProperties.length}</span> properties found
                </p>
                
                {/* View Mode Toggle */}
                <div className="flex items-center bg-surface-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-surface-200'
                    }`}
                  >
                    <ApperIcon name="Grid3X3" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-surface-200'
                    }`}
                  >
                    <ApperIcon name="List" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="bedrooms">Most Bedrooms</option>
                <option value="sqft">Largest Size</option>
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {error ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                <ApperIcon name="AlertTriangle" className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          ) : paginatedProperties.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Search" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-surface-900 mb-2">No properties found</h3>
              <p className="text-surface-600 mb-6">Try adjusting your search criteria or filters</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                <AnimatePresence>
                  {paginatedProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className={`group bg-white rounded-2xl shadow-property-card hover:shadow-elevated transition-all duration-300 overflow-hidden ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={`relative overflow-hidden ${
                        viewMode === 'list' ? 'w-80 flex-shrink-0' : 'aspect-[4/3]'
                      }`}>
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
                      <div className="absolute bottom-4 right-4 flex space-x-2">
                        <button 
                          onClick={() => togglePropertyForComparison(property)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 ${
                            selectedForComparison.some(p => p.id === property.id)
                              ? 'bg-primary text-white'
                              : 'bg-white hover:bg-primary/10'
                          }`}
                        >
                          <ApperIcon name="GitCompare" className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors duration-200">
                          <ApperIcon name="Heart" className="w-5 h-5 text-surface-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                      
                      <div className="p-6 flex-grow">
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
                        
                        <button 
                          onClick={() => navigate(`/property/${property.id}`)}
                          className="w-full py-3 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary hover:text-white transition-all duration-200 group-hover:bg-primary group-hover:text-white"
                        >
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-surface-300 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ApperIcon name="ChevronLeft" className="w-5 h-5" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === page
                              ? 'bg-primary text-white'
                              : 'border border-surface-300 hover:bg-surface-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (
                      page === currentPage - 3 ||
                      page === currentPage + 3
                    ) {
                      return <span key={page} className="px-2">...</span>
                    }
                    return null
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-surface-300 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ApperIcon name="ChevronRight" className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
)}
        </div>
      </section>

      {/* Comparison Toolbar */}
      {selectedForComparison.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-white rounded-2xl shadow-elevated border border-surface-200 px-6 py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <ApperIcon name="GitCompare" className="w-5 h-5 text-primary" />
                <span className="font-medium text-surface-900">
                  {selectedForComparison.length} selected for comparison
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={clearComparison}
                  className="px-4 py-2 text-surface-600 hover:text-surface-900 transition-colors text-sm font-medium"
                >
                  Clear All
                </button>
                <button
                  onClick={goToComparison}
                  disabled={selectedForComparison.length < 2}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Compare Properties
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Properties