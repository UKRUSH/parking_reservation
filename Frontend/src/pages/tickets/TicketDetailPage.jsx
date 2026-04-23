import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'
import { userApi } from '../../api/userApi'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../../components/common/NotificationBell'
import TicketStatusStepper from '../../components/tickets/TicketStatusStepper'
import CommentThread from '../../components/tickets/CommentThread'
import AttachmentImage from '../../components/tickets/AttachmentImage'

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

  const [assignId, setAssignId]         = useState('')
  const [techNotes, setTechNotes]       = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject]     = useState(false)
  const [busy, setBusy]                 = useState(false)
  const [toast, setToast]               = useState(null)

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const loadAll = () => {
    Promise.all([
      ticketApi.getById(id),
      ticketApi.getComments(id),
      ticketApi.listAttachments(id),
    ]).then(([tRes, cRes, aRes]) => {
      setTicket(tRes.data.data)
      setComments(cRes.data.data || [])
      setAttachments(aRes.data.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  const handleDeleteAttachment = async (fileId) => {
    if (!confirm('Delete this attachment?')) return
    try {
      await ticketApi.deleteAttachment(id, fileId)
      setAttachments(prev => prev.filter(a => a.id !== fileId))
      notify('Attachment deleted.')
    } catch {
      notify('Failed to delete attachment.')
    }
  }

  useEffect(() => {
    loadAll()
    if (isAdmin) {
      userApi.getAll()
        .then(res => {
          const all = res.data.data || []
          setTechnicians(all.filter(u => [...(u.roles ?? [])].includes('TECHNICIAN')))
        })
        .catch(() => {})
    }
  }, [id])

  // ── Status transition handlers ─────────────────────────────────────────────

  const handleMoveToInProgress = async () => {
    setBusy(true)
    try {
      if (assignId) {
        await ticketApi.assign(id, Number(assignId))
      } else {
        await ticketApi.updateStatus(id, 'IN_PROGRESS', techNotes || undefined)
      }
      notify('Ticket moved to In Progress.')
      setTechNotes('')
      setAssignId('')
      loadAll()
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to update.')
    } finally { setBusy(false) }
  }

  const handleResolve = async () => {
    setBusy(true)
    try {
      await ticketApi.updateStatus(id, 'RESOLVED', techNotes || undefined)
      notify('Ticket marked as Resolved.')
      setTechNotes('')
      loadAll()
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to resolve.')
    } finally { setBusy(false) }
  }

  const handleClose = async () => {
    setBusy(true)
    try {
      await ticketApi.updateStatus(id, 'CLOSED')
      notify('Ticket closed.')
      loadAll()
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to close.')
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

  // ── Loading / not found ────────────────────────────────────────────────────

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
  const canActOn = ticket.status !== 'CLOSED' && ticket.status !== 'REJECTED'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Smart Campus{isAdmin ? ' — Admin' : ''}</h1>
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
            <p className="text-sm text-gray-500 mb-4">This will notify the reporter.</p>
            <form onSubmit={handleReject} className="space-y-3">
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Reason for rejection…"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowReject(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={busy || !rejectReason.trim()}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                  {busy ? 'Rejecting…' : 'Confirm Reject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* ── Ticket header ── */}
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

          {/* Attachments gallery */}
          {attachments.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">
                Attachments ({attachments.length})
              </p>
              <div className="flex flex-wrap gap-3">
                {attachments.map(a => (
                  <AttachmentImage
                    key={a.id}
                    ticketId={id}
                    fileId={a.id}
                    originalName={a.originalName}
                    canDelete={isAdmin}
                    onDelete={handleDeleteAttachment}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs border-t border-gray-100 pt-4">
            <div>
              <p className="text-gray-400">Created</p>
              <p className="font-medium text-gray-700">{fmt(ticket.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-400">Last updated</p>
              <p className="font-medium text-gray-700">{fmt(ticket.updatedAt)}</p>
            </div>
            {ticket.technicianName && (
              <div>
                <p className="text-gray-400">Assigned to</p>
                <p className="font-medium text-gray-700">🔧 {ticket.technicianName}</p>
              </div>
            )}
            {ticket.rejectionReason && (
              <div className="col-span-2">
                <p className="text-gray-400">Rejection reason</p>
                <p className="font-medium text-red-600">{ticket.rejectionReason}</p>
              </div>
            )}
            {ticket.technicianNotes && (
              <div className="col-span-2">
                <p className="text-gray-400">Technician notes</p>
                <p className="font-medium text-gray-700">{ticket.technicianNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Admin / Tech workflow panel ── */}
        {(isAdmin || isTech) && canActOn && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h3 className="font-bold text-gray-800 text-base">Ticket Workflow</h3>

            {/* ── Step 2: In Progress ── */}
            {ticket.status === 'OPEN' && isAdmin && (
              <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-yellow-400 text-white text-xs font-bold flex items-center justify-center">2</span>
                  <span className="font-semibold text-yellow-800 text-sm">Move to In Progress</span>
                </div>
                <p className="text-xs text-yellow-700">Assign a technician (optional) and start working on this ticket.</p>

                {technicians.length > 0 && (
                  <select
                    value={assignId}
                    onChange={e => setAssignId(e.target.value)}
                    className="w-full border border-yellow-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">— Assign technician (optional) —</option>
                    {technicians.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                    ))}
                  </select>
                )}

                <textarea
                  rows={2}
                  placeholder="Add notes (optional)…"
                  value={techNotes}
                  onChange={e => setTechNotes(e.target.value)}
                  className="w-full border border-yellow-300 bg-white rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  onClick={handleMoveToInProgress}
                  disabled={busy}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition"
                >
                  {busy ? 'Updating…' : '▶ Start — Move to In Progress'}
                </button>
              </div>
            )}

            {/* ── Step 3: Resolved ── */}
            {ticket.status === 'IN_PROGRESS' && (isAdmin || isTech) && (
              <div className="border border-green-200 bg-green-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">3</span>
                  <span className="font-semibold text-green-800 text-sm">Mark as Resolved</span>
                </div>
                <p className="text-xs text-green-700">Describe what was done to fix the issue before marking resolved.</p>
                <textarea
                  rows={3}
                  placeholder="Describe the resolution (required for audit trail)…"
                  value={techNotes}
                  onChange={e => setTechNotes(e.target.value)}
                  className="w-full border border-green-300 bg-white rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={handleResolve}
                  disabled={busy}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition"
                >
                  {busy ? 'Updating…' : '✓ Mark as Resolved'}
                </button>
              </div>
            )}

            {/* ── Step 4: Closed ── */}
            {ticket.status === 'RESOLVED' && isAdmin && (
              <div className="border border-gray-200 bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-gray-500 text-white text-xs font-bold flex items-center justify-center">4</span>
                  <span className="font-semibold text-gray-700 text-sm">Close the Ticket</span>
                </div>
                <p className="text-xs text-gray-500">Close the ticket once you've confirmed the issue is fully resolved.</p>
                <button
                  onClick={handleClose}
                  disabled={busy}
                  className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition"
                >
                  {busy ? 'Closing…' : '✕ Close Ticket'}
                </button>
              </div>
            )}

            {/* ── Danger zone (admin only) ── */}
            {isAdmin && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">Danger Zone</p>
                <div className="flex gap-2">
                  {(ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') && (
                    <button
                      onClick={() => setShowReject(true)}
                      disabled={busy}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition"
                    >
                      Reject Ticket
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    disabled={busy}
                    className="flex-1 border border-red-300 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition"
                  >
                    Delete Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Comments ── */}
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
