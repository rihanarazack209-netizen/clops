import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CalendarCheck,
  UserCheck,
  LogOut,
  PlusCircle,
  Search,
  Key,
  CreditCard,
  FileSignature,
  BedDouble,
  ArrowRightLeft,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookingStatusBadge } from '@/components/ui/status-badge'
import { useHotel } from '@/context/HotelContext'
import { formatCurrency } from '@/lib/utils'
import type { Booking } from '@/types'

export function FrontDeskPage() {
  const { t } = useTranslation()
  const { bookings, rooms, guests, checkInGuest, checkOutGuest } = useHotel()

  const [activeTab, setActiveTab] = useState<'arrivals' | 'in_house' | 'departures'>('arrivals')
  const [searchQuery, setSearchQuery] = useState('')

  // 60-Second Fast Check-In Modal state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('')
  const [checkInStep, setCheckInStep] = useState<1 | 2 | 3>(1)
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [signatureSigned, setSignatureSigned] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const filteredBookings = bookings.filter((b) => {
    const guest = guests.find((g) => g.id === b.guestId)
    const matchesSearch =
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest?.governmentIdNumber.includes(searchQuery)

    if (!matchesSearch) return false

    if (activeTab === 'arrivals') return b.status === 'confirmed' || b.status === 'pending'
    if (activeTab === 'in_house') return b.status === 'checked_in'
    if (activeTab === 'departures') return b.status === 'checked_in'
    return true
  })

  const availableCleanRooms = rooms.filter(
    (r) =>
      (r.status === 'available' || r.status === 'inspected') &&
      (!selectedBooking || r.type === selectedBooking.roomType)
  )

  const handleStartCheckIn = (booking: Booking) => {
    setSelectedBooking(booking)
    const matchingRoom = rooms.find(
      (r) => (r.status === 'available' || r.status === 'inspected') && r.type === booking.roomType
    )
    setSelectedRoomNumber(matchingRoom ? matchingRoom.roomNumber : rooms.find((r) => r.status === 'available')?.roomNumber || '102')
    setCheckInStep(1)
    setSignatureSigned(false)
    setIsCheckInOpen(true)
  }

  const handleCompleteCheckIn = () => {
    if (!selectedBooking) return

    // Central interconnected dispatch
    checkInGuest(selectedBooking.id, selectedRoomNumber)

    setIsCheckInOpen(false)
    setSuccessMessage(
      `Check-in completed for ${selectedBooking.bookingNumber}! Room ${selectedRoomNumber} is now OCCUPIED. Key card encoded & Qatar MOI registered.`
    )
    setTimeout(() => setSuccessMessage(''), 6000)
  }

  const handleCheckOut = (bookingId: string, bookingNum: string) => {
    checkOutGuest(bookingId)
    setSuccessMessage(`Check-out completed for ${bookingNum}! Room marked DIRTY and dispatched to Housekeeping turnaround queue.`)
    setTimeout(() => setSuccessMessage(''), 6000)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Front Desk Operations</h1>
            <Badge variant="info">Live Interconnected</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Manage arrivals, guest registration, key issuance, and departures</p>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl animate-fade-in text-sm font-semibold">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <Button
            variant={activeTab === 'arrivals' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('arrivals')}
            className="text-xs font-semibold gap-1.5 h-8"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Expected Arrivals ({bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length})</span>
          </Button>
          <Button
            variant={activeTab === 'in_house' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('in_house')}
            className="text-xs font-semibold gap-1.5 h-8"
          >
            <BedDouble className="h-3.5 w-3.5" />
            <span>In-House Guests ({bookings.filter((b) => b.status === 'checked_in').length})</span>
          </Button>
          <Button
            variant={activeTab === 'departures' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('departures')}
            className="text-xs font-semibold gap-1.5 h-8"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Departures / Due Out</span>
          </Button>
        </div>

        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by name, ID number, or booking ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Bookings & Front Desk Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Booking Ref</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Guest</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Room / Type</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Stay Dates</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Status</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Balance</th>
                <th className="px-5 py-3.5 text-right rtl:text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 font-medium">
                    No reservations found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const guest = guests.find((g) => g.id === b.guestId)
                  const room = rooms.find((r) => r.id === b.roomId)

                  return (
                    <tr key={b.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-blue-700">
                        {b.bookingNumber}
                        <div className="text-[11px] text-gray-400 font-sans font-normal uppercase tracking-wider">{b.source}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900">{guest ? `${guest.firstName} ${guest.lastName}` : 'Guest'}</div>
                        <div className="text-xs text-gray-400">
                          {guest?.nationality} • {guest?.governmentIdType?.toUpperCase()}: {guest?.governmentIdNumber}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900 capitalize">
                          {room ? `Room ${room.roomNumber} (${room.type})` : `Unassigned (${b.roomType})`}
                        </div>
                        <div className="text-xs text-gray-400">{b.adults} Adults, {b.children} Children</div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600">
                        <div>In: <span className="font-semibold text-gray-900">{b.checkInDate}</span></div>
                        <div>Out: <span className="font-semibold text-gray-900">{b.checkOutDate}</span> ({b.nights} nights)</div>
                      </td>
                      <td className="px-5 py-4">
                        <BookingStatusBadge status={b.status} />
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {b.balanceAmount > 0 ? (
                          <span className="text-rose-600 font-bold">{formatCurrency(b.balanceAmount)}</span>
                        ) : (
                          <span className="text-emerald-600 font-semibold">Settled</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right rtl:text-left space-x-2 rtl:space-x-reverse">
                        {b.status === 'confirmed' || b.status === 'pending' ? (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 h-8 gap-1.5"
                            onClick={() => handleStartCheckIn(b)}
                          >
                            <Key className="h-3.5 w-3.5" />
                            <span>Fast Check-In</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 text-rose-700 border-rose-200 hover:bg-rose-50"
                            onClick={() => handleCheckOut(b.id, b.bookingNumber)}
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            <span>Check-Out</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 60-Second Guided Check-In Modal */}
      {isCheckInOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in">
            <div className="p-5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">60-Second Rapid Check-In</h3>
                <p className="text-xs text-gray-500 font-medium">Booking: {selectedBooking.bookingNumber} • Step {checkInStep} of 3</p>
              </div>
              <Badge variant="teal">MOI & Key Ready</Badge>
            </div>

            <div className="p-6 space-y-5">
              {checkInStep === 1 && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-blue-900 uppercase">Guest Identity Verification</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {guests.find((g) => g.id === selectedBooking.guestId)?.firstName}{' '}
                      {guests.find((g) => g.id === selectedBooking.guestId)?.lastName}
                    </p>
                    <p className="text-xs text-gray-600">
                      ID: {guests.find((g) => g.id === selectedBooking.guestId)?.governmentIdNumber} (Qatar ID / Passport Verified)
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase">Select Clean & Inspected Room</label>
                    <select
                      value={selectedRoomNumber}
                      onChange={(e) => setSelectedRoomNumber(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm font-medium focus:border-blue-600 focus:outline-none"
                    >
                      {availableCleanRooms.map((r) => (
                        <option key={r.id} value={r.roomNumber}>
                          Room {r.roomNumber} — Floor {r.floor} ({r.type.toUpperCase()}) — Status: {r.status.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCheckInOpen(false)}>Cancel</Button>
                    <Button onClick={() => setCheckInStep(2)}>Next: Payment Guarantee →</Button>
                  </div>
                </div>
              )}

              {checkInStep === 2 && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-900 uppercase">Payment Summary</p>
                      <p className="text-sm font-semibold text-gray-900">Total Stay: {formatCurrency(selectedBooking.totalAmount)}</p>
                      <p className="text-xs text-gray-500">Security Deposit / Incidental Hold: {formatCurrency(500)}</p>
                    </div>
                    <Badge variant="success">QNB Gateway Tokenized</Badge>
                  </div>

                  <div className="border border-dashed border-gray-200 rounded-xl p-4 text-center space-y-2">
                    <CreditCard className="h-6 w-6 text-gray-400 mx-auto" />
                    <p className="text-xs font-medium text-gray-600">Credit card pre-authorization hold: QAR 500.00 confirmed</p>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <Button variant="outline" onClick={() => setCheckInStep(1)}>← Back</Button>
                    <Button onClick={() => setCheckInStep(3)}>Next: Digital Signature →</Button>
                  </div>
                </div>
              )}

              {checkInStep === 3 && (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-gray-700">Bilingual Registration Card (EN/AR)</span>
                      <Badge variant="outline">Mandatory Law 13/2016</Badge>
                    </div>
                    <div
                      onClick={() => setSignatureSigned(!signatureSigned)}
                      className="h-28 border-2 border-dashed border-gray-300 rounded-xl bg-white flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      {signatureSigned ? (
                        <div className="text-center text-blue-700">
                          <CheckCircle2 className="h-6 w-6 mx-auto mb-1" />
                          <span className="text-xs font-bold font-mono">E-Signature Captured & Timestamped</span>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400">
                          <FileSignature className="h-6 w-6 mx-auto mb-1" />
                          <span className="text-xs font-medium">Click / Tap to sign registration card on tablet</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <Button variant="outline" onClick={() => setCheckInStep(2)}>← Back</Button>
                    <Button
                      variant="success"
                      disabled={!signatureSigned}
                      onClick={handleCompleteCheckIn}
                      className="gap-2 shadow-sm font-semibold"
                    >
                      <Key className="h-4 w-4" />
                      <span>Encode Key Card & Check In</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
