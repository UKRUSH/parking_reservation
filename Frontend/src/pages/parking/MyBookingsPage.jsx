import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parkingBookingApi } from '../../api/parkingBookingApi'
import { parkingSlotApi } from '../../api/parkingSlotApi'
import ParkingMap from '../../components/parking/ParkingMap'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../../components/common/NotificationBell'

const STATUS_STYLES = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  APPROVED:  'bg-green-100 text-green-700',
  REJECTED:  'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
}

const VEHICLE_TYPES = [
  {
    id: 'CAR',
    label: 'Car',
    icon: (
      <svg viewBox="0 0 64 32" className="w-16 h-8" fill="currentColor">
        <rect x="8" y="12" width="48" height="14" rx="3" />
        <rect x="16" y="6" width="28" height="10" rx="2" />
        <circle cx="18" cy="28" r="4" />
        <circle cx="46" cy="28" r="4" />
      </svg>
    ),
  },
  {
    id: 'MOTORCYCLE',
    label: 'Motorcycle',
    icon: (
      <svg viewBox="0 0 64 40" className="w-16 h-10" fill="currentColor">
        <circle cx="12" cy="30" r="8" fillOpacity="0" stroke="currentColor" strokeWidth="3" />
        <circle cx="52" cy="30" r="8" fillOpacity="0" stroke="currentColor" strokeWidth="3" />
        <path d="M12 30 L24 16 L38 16 L52 30" fillOpacity="0" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <rect x="30" y="10" width="10" height="6" rx="1" />
      </svg>
    ),
  },
  {
    id: 'BICYCLE',
    label: 'Bicycle',
    icon: (
      <svg viewBox="0 0 64 40" className="w-16 h-10" fill="currentColor">
        <circle cx="12" cy="28" r="9" fillOpacity="0" stroke="currentColor" strokeWidth="3" />
        <circle cx="52" cy="28" r="9" fillOpacity="0" stroke="currentColor" strokeWidth="3" />
        <path d="M12 28 L28 12 L36 12 M36 12 L52 28 M28 12 L32 28" fillOpacity="0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="34" y="8" width="10" height="4" rx="1" />
      </svg>
    ),
  },
]

function formatDateTime(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString()
}

function getTomorrowEnd() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(23, 59, 0, 0)
  return d
}

// ── Step 1: Vehicle type picker ───────────────────────────────────────────────
function VehicleSelector({ onSelect }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">Select Your Vehicle</h3>
      <p className="text-sm text-gray-500 mb-6">We will show available spaces for your vehicle type</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {VEHICLE_TYPES.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelect(v.id)}
            className="bg-white border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center gap-3 hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <span className="text-gray-700">{v.icon}</span>
            <span className="font-semibold text-gray-800">{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Step 2: Map + confirm ─────────────────────────────────────────────────────
function SlotPicker({ vehicleType, onBack, onBooked }) {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState(null)

  const startTime = new Date()
  const endTime = getTomorrowEnd()
  // LocalDateTime in Spring requires "yyyy-MM-ddTHH:mm:ss" — no Z or ms
  const toLocal = (d) => d.toISOString().slice(0, 19)

  useEffect(() => {
    setLoading(true)
    setError(null)
    // Don't pass date params — backend defaults to now → tomorrow 23:59
    parkingSlotApi
      .getSlots(vehicleType)
      .then((res) => setSlots(res.data.data || []))
      .catch(() => setError('Could not load parking map. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [vehicleType])

  const handleConfirm = async () => {
    if (!selected) return
    setBooking(true)
    setError(null)
    try {
      await parkingBookingApi.create({
        slotId: selected.id,
        startTime: toLocal(startTime),
        endTime: toLocal(endTime),
        purpose: `${vehicleType} parking`,
      })
      onBooked()
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  const vehicleLabel = VEHICLE_TYPES.find((v) => v.id === vehicleType)?.label

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-sm text-blue-600 hover:underline">
          ← Back
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          {vehicleLabel} Parking Spaces
        </h3>
      </div>

      {/* Booking window info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800 mb-5">
        Booking period: <strong>Now</strong> → <strong>Tomorrow 11:59 PM</strong>
      </div>

      {loading ? (
        <p className="text-gray-500 py-8 text-center">Loading parking map...</p>
      ) : error ? (
        <p className="text-red-600 bg-red-50 px-4 py-3 rounded-lg text-sm">{error}</p>
      ) : slots.length === 0 ? (
        <p className="text-gray-500 py-8 text-center">No parking spaces found for this vehicle type.</p>
      ) : (
        <ParkingMap
          slots={slots}
          selectedId={selected?.id}
          onSelect={setSelected}
        />
      )}

      {/* Selected slot + confirm */}
      {selected && (
        <div className="mt-6 bg-white border border-blue-300 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">
              Slot <span className="text-blue-600">{selected.slotNumber}</span>
              <span className="text-gray-400 font-normal ml-2">Zone {selected.zone}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDateTime(startTime.toISOString())} → {formatDateTime(endTime.toISOString())}
            </p>
          </div>
          <button
            onClick={handleConfirm}
            disabled={booking}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {booking ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MyBookingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  // step: 'list' | 'vehicle' | 'map'
  const [step, setStep] = useState('list')
  const [vehicleType, setVehicleType] = useState(null)

  const loadBookings = () => {
    setLoadingBookings(true)
    parkingBookingApi.getAll()
      .then((res) => setBookings(res.data.data || []))
      .finally(() => setLoadingBookings(false))
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    await parkingBookingApi.cancel(id)
    loadBookings()
  }

  const handleBooked = () => {
    setStep('list')
    setVehicleType(null)
    loadBookings()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Smart Campus</h1>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <span className="text-sm text-gray-600">{user?.name}</span>
          <button onClick={() => navigate('/student-dashboard')} className="text-sm text-blue-500 hover:underline">
            Dashboard
          </button>
          <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">

        {/* ── Booking flow panel ── */}
        {step !== 'list' && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            {step === 'vehicle' && (
              <VehicleSelector
                onSelect={(type) => { setVehicleType(type); setStep('map') }}
              />
            )}
            {step === 'map' && (
              <SlotPicker
                vehicleType={vehicleType}
                onBack={() => setStep('vehicle')}
                onBooked={handleBooked}
              />
            )}
          </div>
        )}

        {/* ── Bookings list ── */}
        {step === 'list' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Parking Bookings</h2>
              <button
                onClick={() => setStep('vehicle')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                + New Booking
              </button>
            </div>

            {loadingBookings ? (
              <p className="text-gray-500">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                No bookings yet. Click <strong>+ New Booking</strong> to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          Slot {b.slotNumber}
                          {b.zone && <span className="text-gray-500 font-normal"> — Zone {b.zone}</span>}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDateTime(b.startTime)} → {formatDateTime(b.endTime)}
                        </p>
                        {b.purpose && (
                          <p className="text-sm text-gray-500 mt-0.5">{b.purpose}</p>
                        )}
                        {b.rejectionReason && (
                          <p className="text-sm text-red-500 mt-1">Reason: {b.rejectionReason}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[b.status] ?? ''}`}>
                          {b.status}
                        </span>
                        {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                          <button
                            onClick={() => handleCancel(b.id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
