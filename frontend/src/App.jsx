import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios'

// Components
import RegistrationForm from './components/RegistrationForm'
import AdminPanel from './components/AdminPanel'
import StatsDashboard from './components/StatsDashboard'
import UniversalLogin from './components/UniversalLogin'
import ApplicantDashboard from './components/ApplicantDashboard'

// Import the actual logo image
import logoImage from './assets/logo.jpg'
import { apiClient } from './config/api';

// Logo Component using the real image
const Logo = ({ className = "h-16" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <img 
      src={logoImage} 
      alt="Inkosi Chorale Logo" 
      className="h-12 w-auto object-contain rounded-md"
    />
    <div>
      <h1 className="font-serif font-bold text-2xl text-inkosi-navy">Inkosi Chorale</h1>
      <p className="text-xs text-inkosi-gold -mt-1">Seventh-Day Adventist Church</p>
    </div>
  </div>
)

function App() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      //const res = await axios.get('/api/stats')
      const res = await apiClient.get('/api/stats');
      if (res.success) {
        setStats(res.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats')
    }
  }

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      
      <div className="min-h-screen bg-gradient-to-br from-inkosi-cream via-white to-inkosi-cream/80">
        {/* Navigation */}
        <nav className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50 border-b border-inkosi-gold/20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <Link to="/">
                <Logo />
              </Link>
              <div className="flex gap-4">
                <Link to="/" className="text-inkosi-navy hover:text-inkosi-gold font-medium transition">Home</Link>
                <Link to="/login" className="text-inkosi-navy hover:text-inkosi-gold font-medium transition">Login</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-inkosi-navy/5 to-inkosi-gold/5"></div>
          <div className="container mx-auto px-4 py-12 text-center">
            <div className="flex justify-center mb-6">
              <Logo className="scale-150" />
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-inkosi-navy mb-4">
              Auditions 2026
            </h1>
            <p className="text-xl text-inkosi-dark/70 max-w-2xl mx-auto">
              Join the sound. Serve through music.
            </p>
            <div className="mt-6 inline-flex gap-3 bg-inkosi-gold/10 rounded-full px-4 py-2">
              <span className="text-inkosi-navy font-semibold">📅 14 June 2026</span>
              <span className="text-inkosi-navy">•</span>
              <span className="text-inkosi-navy font-semibold">📍 TBA</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 pb-16">
          <Routes>
            <Route path="/" element={
              <>
                <RegistrationForm onRegisterSuccess={fetchStats} />
              </>
            } />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/login" element={<UniversalLogin />} />
            <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-inkosi-navy text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <Logo className="justify-center mb-4 [&_h1]:!text-white [&_p]:!text-inkosi-gold" />
            <p className="text-inkosi-cream/70 text-sm">
              Seventh-Day Adventist Church • Chipata District of EZF
            </p>
            <p className="text-inkosi-cream/50 text-xs mt-4">
              © 2026 Inkosi Chorale • Serving through music
            </p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App