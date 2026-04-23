import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'
import { userApi } from '../../api/userApi'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../../components/common/NotificationBell'
import TicketStatusStepper from '../../components/tickets/TicketStatusStepper'
import CommentThread from '../../components/tickets/CommentThread'

const STATUS_STYLE = {
  OPEN:        'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  RESOLVED:    'bg-green-100 text-green-700',
  CLOSED:      'bg-gray-100 text-gray-600',
  REJECTED:    'bg-red-100 text-red-700',
}

const PRIORITY_STYLE = {
  LOW:      'bg-gray-100 text-gray-500',
  MEDIUM:   'bg-blue-50 text-blue-600',
  HIGH:     'bg-orange-100 text-orange-600',
  CRITICAL: 'bg-red-100 text-red-600',
}

function fmt(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const { user, logout, hasRole } = useAuth()
  const navigate = useNavigate()

  const isAdmin = hasRole('ADMIN')
  const isTech  = hasRole('TECHNICIAN')

  const [ticket, setTicket]           = useState(null)
  const [comments, setComments]       = useState([])
  const [attachments, setAttachments] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading]         = useState(true)

  // Admin action state
  const [assignId, setAssignId]       = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject]   = useState(false)
  const [techNotes, setTechNotes]     = useState('')
  const [nextStatus, setNextStatus]   = useState('')
  const [busy, setBusy]               = useState(false)
  const [toast, setToast]             = useState(null)

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const loadAll = () => {
    Promise.all([
      ticketApi.getById(id),
      ticketApi.getComments(id),
    ]).then(([tRes, cRes]) => {
      const t = tRes.data.data
      setTicket(t)
      setComments(cRes.data.data || [])
      // Load attachments metadata via the list endpoint (not available directly — derive from ticket)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => {
    loadAll()
    if (isAdmin) {
      userApi.getAllUsers()
        .then(res => {
          const all = res.data.data || []
          setTechnicians(all.filter(u => u.roles?.includes('TECHNICIAN')))
        })
        .catch(() => {})
    }
  }, [id])

  const canAdvance = (ticket) => {
    if (!ticket) return false
    const validFrom = isAdmin
      ? ['IN_PROGRESS', 'RESOLVED']
      : isTech
        ? ['IN_PROGRESS']
        : []
    return validFrom.includes(ticket.status)
  }

  const nextStatusFor = (status) => {
    if (status === 'IN_PROGRESS') return 'RESOLVED'
    if (status === 'RESOLVED')    return 'CLOSED'
    return null
  }

  const handleAssign = async () => {
    if (!assignId) return
    setBusy(true)
    try {
      await ticketApi.assign(id, Number(assignId))
      notify('Technician assigned.')
      loadAll()
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to assign.')
    } finally { setBusy(false) }
  }

  const handleAdvance = async () => {
    const next = nextStatusFor(ticket.status)
    if (!next) return
    setBusy(true)
    try {
      await ticketApi.updateStatus(id, next, techNotes || undefined)
      notify(`Status updated to ${next.replace('_', ' ')}.`)
      setTechNotes('')
      loadAll()
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to update status.')
    } finally { setBusy(false) }
  }

  const handleReject = async (e) => {
    e.preventDefault()
    if (!rejectReason.trim()) return
    setBusy(true)
    try {
      await ticketApi.reject(id, rejectReason.trim())
      notify('Ticket rejected.')
      setShowReject(false)
      setRejectReason('')
      loadAll()
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to reject.')
    } finally { setBusy(false) }
  }

  const handleDelete = async () => {
    if (!confirm('Permanently delete this ticket?')) return
    setBusy(true)
    try {
      await ticketApi.delete(id)
      navigate('/tickets')
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to delete.')
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading ticket…</p>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Ticket not found.</p>
          <button onClick={() => navigate('/tickets')} className="mt-2 text-sm text-blue-500 hover:underline">
            Back to tickets
          </button>
        </div>
      </div>
    )
  }

  const dashboardPath = isAdmin ? '/admin/dashboard' : '/student/dashboard'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Smart Campus</h1>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <span className="text-sm text-gray-600">{user?.name}</span>
          <button onClick={() => navigate('/tickets')} className="text-sm text-blue-500 hover:underline">
            All Tickets
          </button>
          <button onClick={() => navigate(dashboardPath)} className="text-sm text-gray-500 hover:underline">
            Dashboard
          </button>
          <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </nav>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      {/* Reject modal */}
      {showReject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-800 mb-1">Reject Ticket #{ticket.id}</h3>
            <p className="text-sm text-gray-500 mb-4">Provide a reason to send to the reporter.</p>
            <form onSubmit={handleReject} className="space-y-3">
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Rejection reason…"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReject(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy || !rejectReason.trim()}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {busy ? 'Rejecting…' : 'Confirm Reject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* Ticket header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Ticket #{ticket.id} · Reported by {ticket.userName}</p>
              <h2 className="text-xl font-bold text-gray-800">{ticket.title}</h2>
              {ticket.location && <p className="text-sm text-gray-500 mt-0.5">📍 {ticket.location}</p>}
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[ticket.status] ?? ''}`}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_STYLE[ticket.priority] ?? ''}`}>
                {ticket.priority}
              </span>
            </div>
          </div>

          {/* Status stepper */}
          <div className="mb-4 overflow-x-auto">
            <TicketStatusStepper status={ticket.status} />
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{ticket.description}</p>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 border-t border-gray-100 pt-4">
            <div>
              <span className="text-gray-400">Created</span>
              <p className="font-medium text-gray-700">{fmt(ticket.createdAt)}</p>
            </div>
            <div>
              <span className="text-gray-400">Last updated</span>
              <p className="font-medium text-gray-700">{fmt(ticket.updatedAt)}</p>
            </div>
            {ticket.technicianName && (
              <div>
                <span className="text-gray-400">Assigned to</span>
                <p className="font-medium text-gray-700">🔧 {ticket.technicianName}</p>
              </div>
            )}
            {ticket.rejectionReason && (
              <div className="col-span-2">
                <span className="text-gray-400">Rejection reason</span>
                <p className="font-medium text-red-600">{ticket.rejectionReason}</p>
              </div>
            )}
            {ticket.technicianNotes && (
              <div className="col-span-2">
                <span className="text-gray-400">Technician notes</span>
                <p className="font-medium text-gray-700">{ticket.technicianNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Admin / Tech actions */}
        {(isAdmin || isTech) && ticket.status !== 'CLOSED' && ticket.status !== 'REJECTED' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm">Actions</h3>

            {/* Assign technician — admin only */}
            {isAdmin && !ticket.technicianId && (
              <div className="flex gap-2">
                <select
                  value={assignId}
                  onChange={e => setAssignId(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select a technician…</option>
                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={busy || !assignId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  Assign
                </button>
              </div>
            )}

            {/* Advance status */}
            {canAdvance(ticket) && (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  placeholder="Add technician notes (optional)…"
                  value={techNotes}
                  onChange={e => setTechNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={handleAdvance}
                  disabled={busy}
                  className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  Mark as {nextStatusFor(ticket.status)?.replace('_', ' ')}
                </button>
              </div>
            )}

            {/* Reject + Delete — admin only */}
            {isAdmin && (
              <div className="flex gap-2 pt-1 border-t border-gray-100">
                {(ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') && (
                  <button
                    onClick={() => setShowReject(true)}
                    disabled={busy}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50"
                  >
                    Reject Ticket
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  disabled={busy}
                  className="flex-1 border border-red-300 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                >
                  Delete Ticket
                </button>
              </div>
            )}
          </div>
        )}

        {/* Comments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <CommentThread
            ticketId={id}
            comments={comments}
            currentUserId={user?.id}
            isAdmin={isAdmin}
            onRefresh={() => {
              ticketApi.getComments(id)
                .then(res => setComments(res.data.data || []))
                .catch(() => {})
            }}
          />
        </div>
      </div>
    </div>
  )
}
