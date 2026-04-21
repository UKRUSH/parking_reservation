import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import NotificationBell from '../../components/common/NotificationBell'

export default function StudentDashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Smart Campus</h1>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <span className="text-sm text-gray-600">{user?.name}</span>
          <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-gray-500 mt-1">Manage your campus parking from here.</p>
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/my-bookings')}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left hover:shadow-md hover:border-blue-200 transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-lg">My Bookings</h3>
            <p className="text-gray-500 text-sm mt-1">View and manage your parking reservations</p>
          </button>

          <button
            onClick={() => navigate('/notifications')}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left hover:shadow-md hover:border-purple-200 transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-lg">Notifications</h3>
            <p className="text-gray-500 text-sm mt-1">Check booking approvals and reminders</p>
          </button>
        </div>

        {/* Profile card */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-3">Account</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
