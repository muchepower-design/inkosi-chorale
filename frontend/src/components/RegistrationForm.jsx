import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { apiClient } from '../config/api';

const RegistrationForm = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    church_origin: '',
    district: '',
    voice_type: '',
    age: '',
    song_choice_1: '',
    song_choice_2: '',
    inkhosi_song: ''
  })
  
  const [loading, setLoading] = useState(false)

  const voiceTypes = ['Soprano', 'Alto', 'Tenor', 'Bass']

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      //const response = await axios.post('/api/register', formData)
      const response = await apiClient.post('/api/register', formData);
      console.log('Registration response:', response)  // Debug log
      if (response.success) {
        toast.success('Registration successful! Check your email for confirmation.')
        setFormData({
          full_name: '', email: '', phone: '', church_origin: '', district: '',
          voice_type: '', age: '', song_choice_1: '', song_choice_2: '', inkhosi_song: ''
        })
        if (onRegisterSuccess) onRegisterSuccess()
      } else {
        response.errors?.forEach(err => toast.error(err))
      }
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0] || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card bg-gradient-to-r from-white to-inkosi-cream/30">
      <div className="bg-gradient-to-r from-inkosi-navy to-inkosi-navy/90 p-6">
        <h2 className="text-3xl font-serif font-bold text-white">Register for Auditions</h2>
        <p className="text-inkosi-gold mt-1">Fill in your details below</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2 text-inkosi-navy">Full Name *</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange}
                   className="input-field" placeholder="e.g., John Mwale" required />
          </div>
          
          <div>
            <label className="block font-semibold mb-2 text-inkosi-navy">Email Address *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
                   className="input-field" placeholder="john@example.com" required />
          </div>
          
          <div>
            <label className="block font-semibold mb-2 text-inkosi-navy">Phone Number *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                   className="input-field" placeholder="+260 XXX XXX XXX" required />
          </div>
          
          <div>
            <label className="block font-semibold mb-2 text-inkosi-navy">Church of Origin *</label>
            <input type="text" name="church_origin" value={formData.church_origin} onChange={handleChange}
                   className="input-field" placeholder="Your local SDA church" required />
          </div>
          
          <div>
            <label className="block font-semibold mb-2 text-inkosi-navy">District *</label>
            <input type="text" name="district" value={formData.district} onChange={handleChange}
                   className="input-field" placeholder="e.g., Chupata District" required />
          </div>
          
          <div>
            <label className="block font-semibold mb-2 text-inkosi-navy">Voice Type *</label>
            <select name="voice_type" value={formData.voice_type} onChange={handleChange}
                    className="input-field" required>
              <option value="">Select voice part</option>
              {voiceTypes.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block font-semibold mb-2 text-inkosi-navy">Age *</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange}
                   className="input-field" placeholder="18+" min="18" required />
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6" hidden>
          <h3 className="text-xl font-serif font-semibold text-inkosi-navy mb-4">Audition Songs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-semibold mb-2 text-inkosi-navy">Inkosi Chorale Song *</label>
              <input type="text" name="inkhosi_song" value={formData.inkhosi_song} onChange={handleChange}
                     className="input-field" placeholder="Learn 1 song from our repertoire"  />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-inkosi-navy">Your Choice Song 1 *</label>
              <input type="text" name="song_choice_1" value={formData.song_choice_1} onChange={handleChange}
                     className="input-field" placeholder="Song of your choice"  />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-inkosi-navy">Your Choice Song 2 *</label>
              <input type="text" name="song_choice_2" value={formData.song_choice_2} onChange={handleChange}
                     className="input-field" placeholder="Another song of your choice"  />
            </div>
          </div>
        </div>
        
        <div className="bg-inkosi-gold/10 rounded-lg p-4">
          <p className="text-sm text-inkosi-dark/70">
            📋 Requirements: Committed and quick to learn songs • Active in local church music ministry • 
            Dedicated to work with the group • Age 18+
          </p>
        </div>
        
        <button type="submit" disabled={loading}
                className="btn-primary w-full md:w-auto px-8 py-3 text-lg disabled:opacity-50">
          {loading ? 'Registering...' : '🎵 Register for Auditions'}
        </button>
      </form>
    </div>
  )
}

export default RegistrationForm