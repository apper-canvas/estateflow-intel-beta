import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import propertyService from '../services/api/propertyService'

function PropertyComparison() {
  const navigate = useNavigate()
  const location = useLocation()
  const [properties, setProperties] = useState([])
  const [comparisonProperties, setComparisonProperties] = useState([])
  const [loading, setLoading] = useState(false)

useEffect(() => {
    const loadComparisonData = async () => {
      setLoading(true)
      try {
        // Get comparison data from state or localStorage
        let comparisonData = location.state?.comparisonProperties || 
          JSON.parse(localStorage.getItem('comparisonProperties') || '[]')
        
        if (!comparisonData || comparisonData.length === 0) {
          toast.warning('No properties selected for comparison')
          navigate('/properties')
          return
        }

        // Load all properties for reference
        const allProperties = await propertyService.getAll()
        setProperties(allProperties)

        let selectedProperties = []

        // Handle different data formats
        if (comparisonData.length > 0) {
          // Check if we have full property objects or just IDs
          const firstItem = comparisonData[0]
          
          if (typeof firstItem === 'object' && firstItem.id && firstItem.title) {
            // We have full property objects from Properties page
            selectedProperties = comparisonData.map(prop => {
              // Ensure we have the most up-to-date property data
              const fullProperty = allProperties.find(p => p.id === prop.id)
              return fullProperty || prop
            }).filter(Boolean)
          } else if (typeof firstItem === 'string' || typeof firstItem === 'number') {
            // We have property IDs from localStorage
            selectedProperties = allProperties.filter(property => 
              comparisonData.includes(property.id)
            )
          } else {
            // Invalid data format
            throw new Error('Invalid comparison data format')
          }
        }

        // Validate we have properties to compare
        if (selectedProperties.length === 0) {
          toast.error('Selected properties not found or invalid')
          navigate('/properties')
          return
        }

        // Limit to maximum 4 properties for comparison
        if (selectedProperties.length > 4) {
          selectedProperties = selectedProperties.slice(0, 4)
          toast.info('Comparison limited to 4 properties')
        }

        setComparisonProperties(selectedProperties)

        // Update localStorage with current comparison
        const propertyIds = selectedProperties.map(p => p.id)
        localStorage.setItem('comparisonProperties', JSON.stringify(propertyIds))

        toast.success(`Comparing ${selectedProperties.length} properties`)

      } catch (error) {
        console.error('Comparison loading error:', error)
        toast.error('Failed to load comparison data')
        navigate('/properties')
      } finally {
        setLoading(false)
      }
    }

    loadComparisonData()
  }, [location.state, navigate])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  const removeFromComparison = (propertyId) => {
    const updatedProperties = comparisonProperties.filter(p => p.id !== propertyId)
    setComparisonProperties(updatedProperties)
    
    // Update localStorage
    const updatedIds = updatedProperties.map(p => p.id)
    localStorage.setItem('comparisonProperties', JSON.stringify(updatedIds))
    
    toast.success('Property removed from comparison')
    
    if (updatedProperties.length === 0) {
      navigate('/')
    }
  }

  const clearAllComparisons = () => {
    setComparisonProperties([])
    localStorage.setItem('comparisonProperties', JSON.stringify([]))
    toast.success('All comparisons cleared')
    navigate('/')
  }

  const getPropertyTypeIcon = (type) => {
    switch (type) {
      case 'house': return 'Home'
      case 'apartment': return 'Building'
      case 'condo': return 'Building2'
      case 'townhouse': return 'Buildings'
      default: return 'Home'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-secondary text-white'
      case 'pending': return 'bg-accent text-white'
      case 'sold': return 'bg-surface-400 text-white'
      default: return 'bg-surface-400 text-white'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-surface-600">Loading comparison...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-surface-600 hover:text-surface-900 transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5" />
              <span className="font-medium">Back to Search</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-surface-600">
                Comparing {comparisonProperties.length} properties
              </span>
              <button
                onClick={clearAllComparisons}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-surface-900 mb-2">
            Property Comparison
          </h1>
<p className="text-surface-600">
            Compare key features, pricing, and amenities side by side
          </p>
        </div>

        {/* Selected Properties Summary */}
        {comparisonProperties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-surface-900">
                  Selected Properties for Comparison
                </h2>
                <div className="flex items-center space-x-2 text-sm text-surface-600">
                  <ApperIcon name="GitCompare" className="w-4 h-4" />
                  <span>{comparisonProperties.length} properties selected</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {comparisonProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 border-2 border-primary/20"
                    >
                      <button
                        onClick={() => removeFromComparison(property.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors z-10"
                      >
                        <ApperIcon name="X" className="w-3 h-3" />
                      </button>
                      
                      <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3">
                        <img
                          src={property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium text-surface-900 text-sm line-clamp-2">
                          {property.title}
                        </h3>
                        
                        <div className="flex items-center space-x-1 text-xs text-surface-600">
                          <ApperIcon name="MapPin" className="w-3 h-3" />
                          <span>{property.location?.city}, {property.location?.state}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-primary">
                            {formatPrice(property.price)}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-surface-600">
                            <span>{property.bedrooms}bd</span>
                            <span>•</span>
                            <span>{property.bathrooms}ba</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                            {property.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="Info" className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Comparison Tips:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Compare up to 4 properties side by side</li>
                      <li>• Remove properties by clicking the X button</li>
                      <li>• Scroll horizontally on mobile for full comparison</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-full">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="text-left p-6 font-medium text-surface-900 bg-surface-50 w-48">
                      Property Details
                    </th>
                    {comparisonProperties.map((property) => (
                      <th key={property.id} className="p-6 w-80">
                        <div className="relative">
                          <button
                            onClick={() => removeFromComparison(property.id)}
                            className="absolute top-0 right-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors z-10"
                          >
                            <ApperIcon name="X" className="w-4 h-4" />
                          </button>
                          
                          <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4">
                            <img
                              src={property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <h3 className="font-heading font-semibold text-lg text-surface-900 mb-2 line-clamp-2">
                            {property.title}
                          </h3>
                          
                          <div className="flex items-center space-x-1 text-surface-600 mb-3">
                            <ApperIcon name="MapPin" className="w-4 h-4" />
                            <span className="text-sm">
                              {property.location?.city}, {property.location?.state}
                            </span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                
                <tbody>
                  {/* Price */}
                  <tr className="border-b border-surface-100">
                    <td className="p-6 font-medium text-surface-900 bg-surface-50">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="DollarSign" className="w-5 h-5 text-primary" />
                        <span>Price</span>
                      </div>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id} className="p-6">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(property.price)}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Property Type */}
                  <tr className="border-b border-surface-100">
                    <td className="p-6 font-medium text-surface-900 bg-surface-50">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Home" className="w-5 h-5 text-primary" />
                        <span>Property Type</span>
                      </div>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id} className="p-6">
<div className="flex items-center space-x-2">
                          <ApperIcon name={getPropertyTypeIcon(property.type)} className="w-5 h-5 text-surface-600" />
                          <span className="capitalize font-medium">{property.type}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Status */}
                  <tr className="border-b border-surface-100">
                    <td className="p-6 font-medium text-surface-900 bg-surface-50">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Activity" className="w-5 h-5 text-primary" />
                        <span>Status</span>
                      </div>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id} className="p-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(property.status)}`}>
                          {property.status}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Bedrooms */}
                  <tr className="border-b border-surface-100">
                    <td className="p-6 font-medium text-surface-900 bg-surface-50">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Bed" className="w-5 h-5 text-primary" />
                        <span>Bedrooms</span>
                      </div>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id} className="p-6">
                        <span className="text-lg font-semibold">{property.bedrooms}</span>
                      </td>
                    ))}
                  </tr>

                  {/* Bathrooms */}
                  <tr className="border-b border-surface-100">
                    <td className="p-6 font-medium text-surface-900 bg-surface-50">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Bath" className="w-5 h-5 text-primary" />
                        <span>Bathrooms</span>
                      </div>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id} className="p-6">
                        <span className="text-lg font-semibold">{property.bathrooms}</span>
                      </td>
                    ))}
                  </tr>

                  {/* Square Feet */}
                  <tr className="border-b border-surface-100">
                    <td className="p-6 font-medium text-surface-900 bg-surface-50">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Maximize" className="w-5 h-5 text-primary" />
                        <span>Square Feet</span>
                      </div>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id} className="p-6">
                        <span className="text-lg font-semibold">
                          {property.squareFeet?.toLocaleString()} sqft
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Amenities */}
                  <tr className="border-b border-surface-100">
                    <td className="p-6 font-medium text-surface-900 bg-surface-50">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Star" className="w-5 h-5 text-primary" />
                        <span>Amenities</span>
                      </div>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id} className="p-6">
                        <div className="space-y-2">
                          {property.amenities?.slice(0, 5).map((amenity, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <ApperIcon name="Check" className="w-4 h-4 text-secondary" />
                              <span className="text-sm text-surface-700">{amenity}</span>
                            </div>
                          ))}
                          {property.amenities?.length > 5 && (
                            <div className="text-sm text-surface-500">
                              +{property.amenities.length - 5} more
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Address */}
                  <tr className="border-b border-surface-100">
                    <td className="p-6 font-medium text-surface-900 bg-surface-50">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="MapPin" className="w-5 h-5 text-primary" />
                        <span>Address</span>
                      </div>
                    </td>
                    {comparisonProperties.map((property) => (
                      <td key={property.id} className="p-6">
                        <div className="text-sm text-surface-700">
                          <div>{property.location?.street}</div>
                          <div>
                            {property.location?.city}, {property.location?.state} {property.location?.zipCode}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="p-6 font-medium text-surface-900 bg-surface-50">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="MousePointer" className="w-5 h-5 text-primary" />
                        <span>Actions</span>
                      </div>
                    </td>
                    {comparisonProperties.map((property) => (
<td key={property.id} className="p-6">
                        <div className="space-y-3">
                          <button 
                            onClick={() => navigate(`/property/${property.id}`)}
                            className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                          >
                            View Details
                          </button>
                          <button className="w-full py-2.5 bg-secondary/10 text-secondary rounded-lg font-medium hover:bg-secondary hover:text-white transition-colors">
                            Contact Agent
                          </button>
                          <button
                            onClick={() => removeFromComparison(property.id)}
                            className="w-full py-2.5 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
</div>

        {/* Add Another Property Section */}
        {comparisonProperties.length < 4 && (
          <div className="mt-8 bg-white rounded-2xl shadow-soft p-6">
            <div className="text-center">
              <div className="mb-4">
                <ApperIcon name="Plus" className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-heading font-semibold text-surface-900 mb-2">
                  Add Another Property
                </h3>
                <p className="text-surface-600">
                  Compare up to 4 properties side by side. You currently have {comparisonProperties.length} propert{comparisonProperties.length === 1 ? 'y' : 'ies'} selected.
                </p>
              </div>
              
              <button
                onClick={() => {
                  // Preserve current comparison in localStorage before navigating
                  const currentIds = comparisonProperties.map(p => p.id)
                  localStorage.setItem('comparisonProperties', JSON.stringify(currentIds))
                  toast.info('Browse properties to add to your comparison')
                  navigate('/properties')
                }}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                <ApperIcon name="Plus" className="w-5 h-5" />
                <span>Add Another Property</span>
              </button>
              
              <div className="mt-4 flex items-center justify-center space-x-1">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index < comparisonProperties.length ? 'bg-primary' : 'bg-surface-200'
                    }`}
                  />
                ))}
                <span className="ml-3 text-sm text-surface-600">
                  {4 - comparisonProperties.length} more slot{4 - comparisonProperties.length === 1 ? '' : 's'} available
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 lg:hidden">
          <div className="flex items-start space-x-3">
            <ApperIcon name="Info" className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Tip for mobile viewing:</p>
              <p>Scroll horizontally to view all property comparisons and features.</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default PropertyComparison