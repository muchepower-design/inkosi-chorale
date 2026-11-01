import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { apiClient } from '../config/api';

const UniversalLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First, try admin login
      //const adminRes = await axios.post('/api/admin/login', { username: email, password })
      const adminRes = await apiClient.post('/api/admin/login', { username: email, password });
      console.log('Admin login response:', adminRes)  // Debug log
      if (adminRes.success) {
        localStorage.setItem('adminSession', JSON.stringify({
          userId: adminRes.user_id,
          username: adminRes.username,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000
        }))
        toast.success('Admin login successful')
        navigate('/admin')
        setLoading(false)
        return
      }
    } catch (err) {
      // Admin login failed, try applicant login
    }

    try {
      const applicantRes = await apiClient.post('/api/applicant/login', { email, password })
      console.log('Applicant login response:', applicantRes)  // Debug log
      if (applicantRes.success) {
        localStorage.setItem('applicantSession', JSON.stringify({
          id: applicantRes.applicant_id,
          name: applicantRes.full_name,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000
        }))
        toast.success('Login successful')
        navigate('/applicant-dashboard')
      } else {
        toast.error(applicantRes.message || 'Invalid credentials')
      }
    } catch (error) {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 card">
      <div className="bg-gradient-to-r from-inkosi-navy to-inkosi-navy/90 p-6">
        <h2 className="text-2xl font-serif font-bold text-white">Login</h2>
        <p className="text-inkosi-gold text-sm">Admin or Applicant portal</p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block font-semibold mb-2 text-inkosi-navy">Email / Username</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="youremail@example.com"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-inkosi-navy">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-12"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-inkosi-gold"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center text-xs text-gray-400 pt-2">
          <p>Use your email and password to login</p>
        </div>
      </form>
    </div>
  )
}

export default UniversalLogin