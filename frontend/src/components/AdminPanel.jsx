import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import StatsDashboard from './StatsDashboard'  // Import the stats component
import { apiClient } from '../config/api';

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [applicants, setApplicants] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  // Check for existing session on page load
  useEffect(() => {
    const savedSession = localStorage.getItem('adminSession')
    if (savedSession) {
      const session = JSON.parse(savedSession)
      if (session.expiresAt > Date.now()) {
        setIsLoggedIn(true)
        fetchApplicants()
        fetchStats()
      } else {
        localStorage.removeItem('adminSession')
      }
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      //const res = await axios.post('/api/admin/login', { username, password })
      const res = await apiClient.post('/api/admin/login', {username, password});
      console.log('Login response:', res)  // Debug log
      if (res.success) {
        setIsLoggedIn(true)
        const session = {
          userId: res.user_id,
          username: res.username,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000)
        }
        localStorage.setItem('adminSession', JSON.stringify(session))
        toast.success('Logged in successfully')
        fetchApplicants()
        fetchStats()
        setPassword('')
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      toast.error('Login failed')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
    setApplicants([])
    setStats(null)
    toast.success('Logged out successfully')
  }

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete applicant "${name}"? This action cannot be undone.`);
    if (!confirmDelete) return;
    
    try {
        //await axios.delete(`/api/applicants/${id}`);
        const res = await apiClient.delete(`/api/applicants/${id}`);
        console.log('Delete response:', res);  // Debug log
        toast.success('Applicant deleted successfully');
        fetchApplicants();  // refresh the list
        fetchStats();       // refresh stats if visible
    } catch (error) {
        toast.error('Failed to delete applicant');
    }
};

  const fetchApplicants = async () => {
    setLoading(true)
    try {
      //const res = await axios.get('/api/applicants')
      const res = await apiClient.get('/api/applicants');
      console.log('Applicants response:', res)  // Debug log
      if (res.success) {
        setApplicants(res.applicants)
      }
    } catch (error) {
      toast.error('Failed to fetch applicants')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      //const res = await axios.get('/api/stats')
      const res = await apiClient.get('/api/stats');
      console.log('Stats response:', res)  // Debug log
      if (res.success) {
        setStats(res.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats')
    }
  }

  const updateStatus = async (id, status) => {
    try {
      //await axios.put(`/api/applicants/${id}/status`, { status })
      await apiClient.put(`/api/applicants/${id}/status`, {status});
      toast.success('Status updated')
      fetchApplicants()
      fetchStats()  // Refresh stats after status change
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="card max-w-md mx-auto mt-10">
        <div className="bg-gradient-to-r from-inkosi-navy to-inkosi-navy/90 p-6">
          <h2 className="text-2xl font-serif font-bold text-white">Admin Login</h2>
          <p className="text-inkosi-gold text-sm mt-1">Enter your credentials</p>
        </div>
        <form onSubmit={handleLogin} className="p-6 space-y-5">
          <div>
            <label className="block font-semibold mb-2 text-inkosi-navy">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="input-field" 
              placeholder="Enter username" 
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
                placeholder="Enter password" 
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-inkosi-gold transition"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button type="submit" className="btn-primary w-full">Login</button>
          
          <div className="text-center text-xs text-gray-400 pt-2">
            {/*
            <p>Demo: <span className="font-mono">admin / admin123</span></p>
            <p className="mt-1 text-inkosi-gold">✓ Session persists for 24 hours</p>
            */}
          </div>
        </form>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const colors = { 
      pending: 'bg-yellow-100 text-yellow-800', 
      approved: 'bg-green-100 text-green-800', 
      rejected: 'bg-red-100 text-red-800' 
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || colors.pending}`}>{status}</span>
  }

  const getVoiceBadge = (voice) => {
    const colors = {
      Soprano: 'bg-pink-100 text-pink-800',
      Alto: 'bg-purple-100 text-purple-800',
      Tenor: 'bg-blue-100 text-blue-800',
      Bass: 'bg-indigo-100 text-indigo-800'
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[voice] || 'bg-gray-100'}`}>{voice}</span>
  }

  return (
    <div className="space-y-6">
      {/* Stats Dashboard - Only visible to admin */}
      {stats && <StatsDashboard stats={stats} />}
      
      <div className="card">
        <div className="bg-gradient-to-r from-inkosi-navy to-inkosi-navy/90 p-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white">Applicants Management</h2>
            <p className="text-inkosi-gold text-sm mt-1">Welcome back, {username}!</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn-secondary text-white border-white hover:bg-white/10 px-5 py-2"
          >
            Logout
          </button>
        </div>
        
        <div className="p-6 overflow-x-auto">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-inkosi-gold"></div>
              <p className="mt-2 text-gray-500">Loading applicants...</p>
            </div>
          ) : applicants.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="mt-3">No applicants registered yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="p-3 text-left font-semibold text-inkosi-navy">Applicant</th>
                  <th className="p-3 text-left font-semibold text-inkosi-navy">Church / District</th>
                  <th className="p-3 text-left font-semibold text-inkosi-navy">Voice</th>
                  <th className="p-3 text-left font-semibold text-inkosi-navy">Age</th>
                  <th className="p-3 text-left font-semibold text-inkosi-navy" hidden>Songs</th>
                  <th className="p-3 text-left font-semibold text-inkosi-navy">Participant Number</th>
                  <th className="p-3 text-left font-semibold text-inkosi-navy">Status</th>
                  <th className="p-3 text-left font-semibold text-inkosi-navy">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map(app => (
                  <tr key={app.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">
                      <div className="font-semibold text-inkosi-navy">{app.full_name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {app.email}<br/>{app.phone}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>{app.church_origin}</div>
                      <div className="text-xs text-gray-500">{app.district}</div>
                    </td>
                    <td className="p-3">{getVoiceBadge(app.voice_type)}</td>
                    <td className="p-3 font-medium">{app.age} yrs</td>
                    <td className="p-3" hidden>
                      <div className="text-xs">
                        <div><span className="font-semibold">Inkosi:</span> {app.inkhosi_song}</div>
                        <div><span className="font-semibold">Choice 1:</span> {app.song_choice_1}</div>
                        <div><span className="font-semibold">Choice 2:</span> {app.song_choice_2}</div>
                      </div>
                    </td>
                    <td className="p-3">#{app.id}</td>
                    <td className="p-3">{getStatusBadge(app.status)}</td>
                        <td className="p-3">
                            <div className="flex gap-2 items-center">
                                <select
                                    onChange={(e) => updateStatus(app.id, e.target.value)}
                                    value={app.status}
                                    className="text-sm border rounded-lg p-2 focus:outline-none focus:border-inkosi-gold"
                                >
                                    <option value="pending">⏳ Pending</option>
                                    <option value="approved">✅ Approve</option>
                                    <option value="rejected">❌ Reject</option>
                                </select>
                                <button
                                    onClick={() => handleDelete(app.id, app.full_name)}
                                    className="text-red-600 hover:text-red-800 transition p-2 rounded-lg hover:bg-red-50"
                                    title="Delete applicant"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {applicants.length > 0 && (
            <div className="mt-6 pt-4 border-t text-sm text-gray-500 flex justify-between items-center">
              <span>Total: {applicants.length} applicants</span>
              <span className="text-inkosi-gold">Last updated: {new Date().toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel