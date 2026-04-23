import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../../components/common/NotificationBell'
import TicketCard from '../../components/tickets/TicketCard'

const STATUS_FILTERS = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']

const PRIORITY_STYLE = {
  LOW:      'text-gray-500',
  MEDIUM:   'text-blue-600',
  HIGH:     'text-orange-600',
  CRITICAL: 'text-red-600 font-bold',
}

export default function TicketListPage() {
  const { user, logout, hasRole } = useAuth()
  const navigate = useNavigate()
  const isAdmin = hasRole('ADMIN')
  const isTech  = hasRole('TECHNICIAN')

  const [tickets, setTickets]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('ALL')
  const [search, setSearch]     = useState('')

  const load = () => {
    setLoading(true)
    ticketApi.getAll(filter === 'ALL' ? null : filter)
      .then(res => setTickets(res.data.data || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filter])

  const displayed = tickets.filter(t =>
    !search.trim() ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.location?.toLowerCase().includes(search.toLowerCase()) ||
    t.userName?.toLowerCase().includes(search.toLowerCase())
  )

  const counts = tickets.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1
    return acc
  }, {})

  const dashboardPath = isAdmin ? '/admin/dashboard' : '/student/dashboard'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Smart Campus</h1>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <span className="text-sm text-gray-600">{user?.name}</span>
          <button onClick={() => navigate(dashboardPath)} className="text-sm text-blue-500 hover:underline">
            Dashboard
          </button>
          {!isTech && (
            <button
              onClick={() => navigate('/tickets/new')}
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
            >
              + Report Incident
            </button>
          )}
          <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Incident Tickets</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {isAdmin ? 'All reported incidents' : isTech ? 'Tickets assigned to you' : 'Your reported incidents'}
          </p>
        </div>

        {/* Summary cards — admin only */}
        {isAdmin && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
            {[
              { label: 'Open',        key: 'OPEN',        color: 'border-blue-400 text-blue-700'   },
              { label: 'In Progress', key: 'IN_PROGRESS', color: 'border-yellow-400 text-yellow-700' },
              { label: 'Resolved',    key: 'RESOLVED',    color: 'border-green-400 text-green-700'  },
              { label: 'Closed',      key: 'CLOSED',      color: 'border-gray-400 text-gray-600'   },
              { label: 'Rejected',    key: 'REJECTED',    color: 'border-red-400 text-red-700'     },
            ].map(({ label, key, color }) => (
              <div key={key} className={`bg-white rounded-xl p-3 shadow-sm border-l-4 ${color.split(' ')[0]}`}>
                <p className="text-xs text-gray-500">{label}</p>
                <p className={`text-xl font-bold mt-0.5 ${color.split(' ')[1]}`}>{counts[key] ?? 0}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            placeholder="Search tickets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f === 'ALL' ? `All (${tickets.length})` : f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Ticket grid */}
        {loading ? (
          <p className="text-gray-500 text-sm">Loading…</p>
        ) : displayed.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400 text-sm">
            {tickets.length === 0 ? 'No tickets yet.' : 'No tickets match your search.'}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {displayed.map(t => <TicketCard key={t.id} ticket={t} />)}
          </div>
        )}
      </div>
    </div>
  )
}
