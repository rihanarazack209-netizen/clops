import { useState } from 'react'
import {
  CalendarCheck,
  Plus,
  Search,
  Eye,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookingStatusBadge } from '@/components/ui/status-badge'
import { useHotel } from '@/context/HotelContext'
import { formatCurrency } from '@/lib/utils'
import type { Booking, RoomType } from '@/types'

export function ReservationsPage() {
  const { bookings, guests, createBooking } = useHotel()

  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // New Booking Form State
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestIdNum, setGuestIdNum] = useState('')
  const [roomType, setRoomType] = useState<RoomType>('deluxe')
  const [checkIn, setCheckIn] = useState('2026-11-01')
  const [checkOut, setCheckOut] = useState('2026-11-04')
  const [adults, setAdults] = useState(2)

  const filtered = bookings.filter((b) => {
    const guest = guests.find((g) => g.id === b.guestId)
    const matchesSearch =
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      guest?.firstName.toLowerCase().includes(search.toLowerCase()) ||
      guest?.lastName.toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false
    if (sourceFilter !== 'all' && b.source !== sourceFilter) return false
    return true
  })

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault()
    const rateMap: Record<RoomType, number> = { standard: 450, deluxe: 650, suite: 1200, presidential: 2800 }
    const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    const rate = rateMap[roomType]

    const parts = guestName.trim().split(' ')
    const firstName = parts[0] || 'Guest'
    const lastName = parts.slice(1).join(' ') || 'Customer'

    // Create through central interconnected store
    createBooking(
      {
        roomType,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights,
        adults,
        children: 0,
        source: 'website',
        roomRate: rate,
        totalAmount: rate * nights,
        paidAmount: rate * nights,
        balanceAmount: 0,
        specialRequests: 'Direct CRS Reservation',
      },
      {
        firstName,
        lastName,
        email: guestEmail || `${firstName.toLowerCase()}@example.qa`,
        phone: guestPhone || '+974 5512 0000',
        governmentIdNumber: guestIdNum || '28963401928',
      }
    )

    setIsNewBookingOpen(false)
    setGuestName('')
    setGuestEmail('')
    setGuestPhone('')
    setGuestIdNum('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Reservations & Central CRS</h1>
            <Badge variant="teal">Connected to Arrivals & Dashboard</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Manage individual bookings, corporate groups, and OTA channel allotments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" className="gap-2 shadow-sm" onClick={() => setIsNewBookingOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Create Reservation</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Layers className="h-4 w-4" />
            <span>Group Block</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none"
          >
            <option value="all">All Channels (OTA + Direct)</option>
            <option value="website">Direct Website</option>
            <option value="ota">OTA (Booking.com / Expedia)</option>
            <option value="corporate">Corporate Negotiated</option>
            <option value="walk_in">Walk-In</option>
          </select>
        </div>

        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by reservation ID, guest name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Res #</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Guest</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Category</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Arrival / Departure</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Channel</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Total Price</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right rtl:text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b) => {
                const guest = guests.find((g) => g.id === b.guestId)

                return (
                  <tr key={b.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-blue-700">{b.bookingNumber}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {guest ? `${guest.firstName} ${guest.lastName}` : 'Direct Guest'}
                    </td>
                    <td className="px-5 py-4 capitalize text-gray-700 font-medium">{b.roomType}</td>
                    <td className="px-5 py-4 text-xs text-gray-600">
                      <div>{b.checkInDate} ➔ {b.checkOutDate}</div>
                      <div className="text-gray-400 font-medium">({b.nights} Nights)</div>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold uppercase text-gray-600">
                      <Badge variant="outline">{b.source.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900">{formatCurrency(b.totalAmount)}</td>
                    <td className="px-5 py-4"><BookingStatusBadge status={b.status} /></td>
                    <td className="px-5 py-4 text-right rtl:text-left">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(b)}>
                        <Eye className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Reservation Modal */}
      {isNewBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-gray-100 p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">New Direct Reservation</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsNewBookingOpen(false)}>✕</Button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Guest Full Name</label>
                  <Input required placeholder="e.g. Jassem Al-Sulaiti" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Phone Number</label>
                  <Input required placeholder="+974 5500 1234" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Qatar ID / Passport</label>
                  <Input required placeholder="28963401928" value={guestIdNum} onChange={(e) => setGuestIdNum(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Room Category</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm font-medium focus:outline-none"
                  >
                    <option value="standard">Standard Deluxe (QAR 450/nt)</option>
                    <option value="deluxe">Executive Deluxe (QAR 650/nt)</option>
                    <option value="suite">Panoramic Suite (QAR 1200/nt)</option>
                    <option value="presidential">Presidential Suite (QAR 2800/nt)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Check-In Date</label>
                  <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Check-Out Date</label>
                  <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setIsNewBookingOpen(false)}>Cancel</Button>
                <Button type="submit" variant="default">Confirm & Issue Booking</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
