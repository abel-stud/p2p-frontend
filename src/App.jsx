import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Homepage from './pages/Homepage'
import Listings from './pages/Listings'
import PostAd from './pages/PostAd'
import DealPage from './pages/DealPage'
import HowItWorks from './pages/HowItWorks'

// API Configuration - FIXED: Updated to Railway backend URL
const API_BASE_URL = 'https://p2p-railway-backend-production.up.railway.app';

function App() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch listings from API
  const fetchListings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/listings`)
      const data = await response.json()
      
      // FIXED: Backend returns array directly, not {success: true, data: [...]}
      if (Array.isArray(data)) {
        setListings(data)
      } else {
        console.error('Unexpected response format:', data)
        setListings([])
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  // Refresh listings
  const handleRefresh = () => {
    fetchListings()
  }

  // Handle new ad posted
  const handleAdPosted = () => {
    fetchListings() // Refresh listings when new ad is posted
  }

  useEffect(() => {
    fetchListings()
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route 
              path="/listings" 
              element={
                <Listings 
                  listings={listings} 
                  loading={loading} 
                  onRefresh={handleRefresh} 
                />
              } 
            />
            <Route 
              path="/post-ad" 
              element={<PostAd onAdPosted={handleAdPosted} />} 
            />
            <Route path="/deal/:id" element={<DealPage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

