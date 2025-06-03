import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center"
        >
          <ApperIcon name="Home" className="w-16 h-16 text-white" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-6xl font-heading font-bold text-surface-900 mb-4"
        >
          404
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-semibold text-surface-700 mb-4"
        >
          Property Not Found
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-surface-600 mb-8"
        >
          The property you're looking for seems to have moved to a new address. Let's get you back on track.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-surface-500 text-sm">
            Or try searching for properties above
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound