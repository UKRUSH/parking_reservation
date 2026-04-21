import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parkingSlotApi } from '../../api/parkingSlotApi'
import { parkingBookingApi } from '../../api/parkingBookingApi'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../../components/common/NotificationBell'
import ParkingMap from '../../components/parking/ParkingMap'

const TYPES = ['ALL', 'CAR', 'MOTORCYCLE', 'SUV']

export default function ParkingSlotsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.roles?.includes('ADMIN')

  const [typeFilter, setTypeFilter]   = useState('ALL')
  const [slots, setSlots]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [selectedSlot, setSelectedSlot] = useState(null)

  // Booking form state
  const [form, setForm] = useState({ startTime: '', endTime: '', purpose: '', vehicleNumber: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const fetchSlots = () => {
    setLoading(true)
    parkingSlotApi.getSlots(typeFilter === 'ALL' ? undefined : typeFilter)
      .then((res) => setSlots(res.data.data || []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchSlots()
    setSelectedSlot(null)
  }, [typeFilter])

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot)
    setSubmitError('')
    setSubmitSuccess(false)
    setForm({ startTime: '', endTime: '', purpose: '', vehicleNumber: '' })
  }

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSubmitError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    try {
      await parkingBookingApi.create({
        slotId: selectedSlot.id,
        startTime: form.startTime,
        endTime: form.endTime,
        purpose: form.purpose,
        vehicleNumber: form.vehicleNumber,
      })
      setSubmitSuccess(true)
      setSelectedSlot(null)
      fetchSlots()
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  const total     = slots.length
  const available = slots.filter(s => s.available).length
  const occupied  = total - available

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Smart Campus</h1>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <span className="text-sm text-gray-600">{user?.name}</span>
          {isAdmin ? (
            <button onClick={() => navigate('/dashboard')} className="text-sm text-blue-500 hover:underline">
              Dashboard
            </button>
          ) : (
            <button onClick={() => navigate('/my-bookings')} className="text-sm text-blue-500 hover:underline">
              My Bookings
            </button>
          )}
          <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Parking Slots</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isAdmin ? 'Overview of all parking slots' : 'Select an available slot to request a booking'}
            </p>
          </div>

          {/* Type filter */}
          <div className="flex gap-2">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  typeFilter === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Slots</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Available</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{available}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Occupied</p>
            <p className="text-2xl font-bold text-red-500 mt-1">{occupied}</p>
          </div>
        </div>

        {submitSuccess && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            Booking request submitted! Waiting for admin approval.
          </div>
        )}

        <div className="flex gap-6">
          {/* Parking map */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <p className="text-gray-500">Loading parking slots...</p>
            ) : slots.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No slots found.</p>
            ) : (
              <ParkingMap
                slots={slots}
                selectedId={selectedSlot?.id ?? null}
                onSelect={isAdmin ? () => {} : handleSelectSlot}
              />
            )}
          </div>

          {/* Booking form panel — students only */}
          {!isAdmin && selectedSlot && (
            <div className="w-80 shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Request Slot</h3>
                  <button
                    onClick={() => setSelectedSlot(null)}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>

                {/* Selected slot info */}
                <div className="bg-blue-50 rounded-lg px-3 py-2 mb-4">
                  <p className="text-sm font-medium text-blue-700">{selectedSlot.slotNumber}</p>
                  <p className="text-xs text-blue-500">Zone {selectedSlot.zone} · {selectedSlot.type}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Vehicle Number</label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={form.vehicleNumber}
                      onChange={handleFormChange}
                      placeholder="e.g. ABC-1234"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleFormChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleFormChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Purpose (optional)</label>
                    <input
                      type="text"
                      name="purpose"
                      value={form.purpose}
                      onChange={handleFormChange}
                      placeholder="e.g. Daily commute"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {submitError && (
                    <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
