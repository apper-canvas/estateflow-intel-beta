import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import Properties from './pages/Properties'
import NotFound from './pages/NotFound'
import PropertyDetails from './pages/PropertyDetails'
import NeighborhoodDetails from './pages/NeighborhoodDetails'
import PropertyComparison from './components/PropertyComparison'
function App() {
  return (
    <div className="min-h-screen bg-surface-50">
<Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/neighborhood/:city/:state" element={<NeighborhoodDetails />} />
        <Route path="/comparison" element={<PropertyComparison />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
        toastClassName="backdrop-blur-soft bg-white/90 shadow-glass rounded-xl border border-surface-200"
      />
    </div>
  )
}

export default App