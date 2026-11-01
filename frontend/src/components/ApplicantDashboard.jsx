import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { apiClient } from '../config/api';

const ApplicantDashboard = () => {
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('applicantSession') || '{}')
    if (!session.id || session.expiresAt < Date.now()) {
      localStorage.removeItem('applicantSession')
      navigate('/login')
      return
    }
    fetchProfile(session.id)
  }, [navigate])

  const fetchProfile = async (id) => {
    try {
      //const res = await axios.get(`/api/applicant/profile/${id}`)
      const res = await apiClient.get(`/api/applicant/profile/${id}`);
      console.log('Profile response:', res)  // Debug log
      if (res.success) {
        setProfile(res.profile)
      } else {
        toast.error('Could not load profile')
      }
    } catch (error) {
      toast.error('Error loading profile')
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[status]}`}>{status.toUpperCase()}</span>
  }

  const handleLogout = () => {
    localStorage.removeItem('applicantSession')
    navigate('/login')
    toast.success('Logged out')
  }

  if (!profile) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 card">
      <div className="bg-gradient-to-r from-inkosi-navy to-inkosi-navy/90 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white">Welcome, {profile.full_name}</h2>
          <p className="text-inkosi-gold text-sm">Applicant Dashboard</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary text-white border-white">
          Logout
        </button>
      </div>
      <div className="p-6 space-y-6">
        {/* Status section */}
        <div className="border-b pb-4">
          <h3 className="text-xl font-serif font-semibold text-inkosi-navy">Audition Status</h3>
          <div className="mt-2">{getStatusBadge(profile.status)}</div>
        </div>

        {/* Personal details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><span className="font-semibold">Full Name:</span> {profile.full_name}</div>
          <div><span className="font-semibold">Email:</span> {profile.email}</div>
          <div><span className="font-semibold">Phone:</span> {profile.phone}</div>
          <div><span className="font-semibold">Voice Part:</span> {profile.voice_type}</div>
          <div><span className="font-semibold">Age:</span> {profile.age}</div>
          <div><span className="font-semibold">Church of Origin:</span> {profile.church_origin}</div>
          <div><span className="font-semibold">District:</span> {profile.district}</div>
          <div><span className="font-semibold">Registration Date:</span> {new Date(profile.registration_date).toLocaleDateString()}</div>
          <div><span className="font-semibold">Participant Number:</span> #{profile.id}</div>
        </div>

        {/* Important notice */}
        <div className="bg-inkosi-gold/10 p-4 rounded-lg">
          <p className="text-sm">📅 Audition Date: <strong>14 June 2026</strong></p>
          <p className="text-sm">📍 Venue: <strong>To Be Announced (TBA)</strong> – check this dashboard for updates.</p>
        </div>
      </div>
    </div>
  )
}

export default ApplicantDashboard