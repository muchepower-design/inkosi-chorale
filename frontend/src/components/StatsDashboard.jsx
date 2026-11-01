import React from 'react'

const StatsDashboard = ({ stats }) => {
  if (!stats) return null

  const statCards = [
    { label: 'Total Applicants', value: stats.total || 0, icon: '👥', color: 'from-blue-500 to-blue-600' },
    { label: 'Pending Review', value: stats.pending || 0, icon: '⏳', color: 'from-yellow-500 to-yellow-600' },
    { label: 'Approved', value: stats.approved || 0, icon: '✅', color: 'from-green-500 to-green-600' },
    { label: 'Rejected', value: stats.rejected || 0, icon: '❌', color: 'from-red-500 to-red-600' },
  ]

  const voiceStats = [
    { name: 'Soprano', count: stats.soprano || 0, bg: 'bg-pink-100', text: 'text-pink-700' },
    { name: 'Alto', count: stats.alto || 0, bg: 'bg-purple-100', text: 'text-purple-700' },
    { name: 'Tenor', count: stats.tenor || 0, bg: 'bg-blue-100', text: 'text-blue-700' },
    { name: 'Bass', count: stats.bass || 0, bg: 'bg-indigo-100', text: 'text-indigo-700' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-4 border-l-4 border-inkosi-gold">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <p className="text-3xl font-bold text-inkosi-navy">{card.value}</p>
              </div>
              <span className="text-2xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="font-serif font-semibold text-inkosi-navy mb-4">Voice Section Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {voiceStats.map((voice, idx) => (
            <div key={idx} className={`${voice.bg} rounded-lg p-3 text-center`}>
              <p className={`font-bold text-lg ${voice.text}`}>{voice.count}</p>
              <p className={`text-sm font-medium ${voice.text}`}>{voice.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatsDashboard