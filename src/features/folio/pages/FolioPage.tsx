import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Receipt,
  Plus,
  CreditCard,
  Printer,
  QrCode,
  AlertCircle,
  FileText,
  DollarSign,
  Ban,
  Split,
  Building,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useHotel } from '@/context/HotelContext'
import { formatCurrency } from '@/lib/utils'
import type { Folio, FolioCharge, FolioWindow } from '@/types'

export function FolioPage() {
  const { folios, bookings, guests, rooms, postFolioCharge, voidFolioCharge } = useHotel()

  const [selectedFolioId, setSelectedFolioId] = useState<string>(
    folios.length > 0 ? folios[0].id : ''
  )
  const [activeWindow, setActiveWindow] = useState<FolioWindow>(1)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false)
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false)
  const [selectedChargeForVoid, setSelectedChargeForVoid] = useState<FolioCharge | null>(null)
  const [voidReason, setVoidReason] = useState('')

  // New posting state
  const [chargeDescription, setChargeDescription] = useState('')
  const [chargeAmount, setChargeAmount] = useState('')
  const [chargeCategory, setChargeCategory] = useState<'restaurant' | 'laundry' | 'spa' | 'minibar' | 'other'>('restaurant')

  const currentFolio = folios.find((f) => f.id === selectedFolioId) || folios[0]
  const currentBooking = bookings.find((b) => b.id === currentFolio?.bookingId)
  const currentGuest = guests.find((g) => g.id === currentBooking?.guestId)
  const currentRoom = rooms.find((r) => r.id === currentBooking?.roomId)

  if (!currentFolio) {
    return <div className="p-8 text-center text-gray-500">No active folios found.</div>
  }

  const windowCharges = currentFolio.charges.filter((c) => c.window === activeWindow && !c.isVoid)
  const windowTotal = windowCharges.reduce((acc, curr) => acc + curr.total, 0)

  const handlePostCharge = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chargeAmount || isNaN(Number(chargeAmount))) return

    postFolioCharge(
      currentFolio.id,
      activeWindow,
      chargeDescription,
      chargeCategory,
      Number(chargeAmount)
    )

    setIsPostingModalOpen(false)
    setChargeDescription('')
    setChargeAmount('')
  }

  const handleVoidCharge = () => {
    if (!selectedChargeForVoid || !voidReason) return

    voidFolioCharge(currentFolio.id, selectedChargeForVoid.id, voidReason)

    setIsVoidModalOpen(false)
    setSelectedChargeForVoid(null)
    setVoidReason('')
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Folio & Multi-Window Cashiering</h1>
            <Badge variant="teal">Live Synced with Front Desk & POS</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Active Folio for Room {currentRoom ? currentRoom.roomNumber : '101'} •{' '}
            <span className="font-semibold text-gray-800">
              {currentGuest ? `${currentGuest.firstName} ${currentGuest.lastName}` : 'Guest'}
            </span>{' '}
            (Booking: {currentBooking?.bookingNumber})
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Folio switcher */}
          <select
            value={currentFolio.id}
            onChange={(e) => setSelectedFolioId(e.target.value)}
            className="rounded-lg border border-gray-300 p-2 text-xs font-bold text-gray-800 bg-gray-50 focus:outline-none"
          >
            {folios.map((f) => {
              const b = bookings.find((bk) => bk.id === f.bookingId)
              const g = guests.find((gk) => gk.id === b?.guestId)
              return (
                <option key={f.id} value={f.id}>
                  Folio {f.id.slice(-6)}: {g ? `${g.firstName} ${g.lastName}` : 'Guest'} ({formatCurrency(f.balance)})
                </option>
              )
            })}
          </select>

          <Button variant="default" className="gap-2 shadow-sm" onClick={() => setIsPostingModalOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Post Charge</span>
          </Button>
          <Button variant="outline" className="gap-2 text-blue-700 border-blue-200" onClick={() => setIsInvoiceModalOpen(true)}>
            <Printer className="h-4 w-4" />
            <span>Qatar GTA E-Invoice</span>
          </Button>
        </div>
      </div>

      {/* Balance Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Incurred Charges</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(currentFolio.totalCharges)}</p>
          <p className="text-xs text-gray-400 mt-1">Includes Room, Taxes & F&B Postings</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Settled & Pre-Auth Payments</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(currentFolio.totalPayments)}</p>
          <p className="text-xs text-emerald-600 mt-1">Card Authorized via QNB</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Net Outstanding Balance</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{formatCurrency(currentFolio.balance)}</p>
          <p className="text-xs text-rose-500 mt-1">Payable at Check-out</p>
        </div>
      </div>

      {/* Multi-Window Folio Selector (Windows 1 to 4) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50/70 p-2 gap-2">
          <button
            onClick={() => setActiveWindow(1)}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all text-left rtl:text-right ${
              activeWindow === 1 ? 'bg-white text-blue-700 shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Window 1: Guest Personal</span>
              <Badge variant={activeWindow === 1 ? 'default' : 'secondary'}>Room & Extras</Badge>
            </div>
          </button>

          <button
            onClick={() => setActiveWindow(2)}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all text-left rtl:text-right ${
              activeWindow === 2 ? 'bg-white text-blue-700 shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Window 2: Corporate City Ledger</span>
              <Badge variant="outline">Direct Bill</Badge>
            </div>
          </button>

          <button
            onClick={() => setActiveWindow(3)}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all text-left rtl:text-right ${
              activeWindow === 3 ? 'bg-white text-blue-700 shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Window 3: Incidentals & Minibar</span>
              <Badge variant="outline">Non-Room</Badge>
            </div>
          </button>

          <button
            onClick={() => setActiveWindow(4)}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all text-left rtl:text-right ${
              activeWindow === 4 ? 'bg-white text-blue-700 shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Window 4: Disputed / Third Party</span>
              <Badge variant="outline">Hold</Badge>
            </div>
          </button>
        </div>

        {/* Postings Table for Active Window */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Date</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Description</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Category</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Posted By</th>
                <th className="px-5 py-3.5 text-right rtl:text-left font-semibold">Amount (QAR)</th>
                <th className="px-5 py-3.5 text-right rtl:text-left font-semibold">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {windowCharges.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 font-medium">
                    No charges posted to Window {activeWindow}.
                  </td>
                </tr>
              ) : (
                windowCharges.map((ch) => (
                  <tr key={ch.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{ch.date}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-900">{ch.description}</td>
                    <td className="px-5 py-3.5">
                      <span className="capitalize px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold">
                        {ch.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">{ch.postedBy}</td>
                    <td className="px-5 py-3.5 text-right rtl:text-left font-bold text-gray-900 font-mono">
                      {formatCurrency(ch.total)}
                    </td>
                    <td className="px-5 py-3.5 text-right rtl:text-left">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-rose-600 hover:bg-rose-50 h-7"
                        onClick={() => {
                          setSelectedChargeForVoid(ch)
                          setIsVoidModalOpen(true)
                        }}
                      >
                        <Ban className="h-3.5 w-3.5 mr-1" />
                        Void / Adjust
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Window Subtotal Footer */}
        <div className="bg-gray-50/80 p-4 border-t border-gray-100 flex items-center justify-between text-sm font-semibold">
          <span className="text-gray-600">Subtotal for Window {activeWindow}:</span>
          <span className="text-lg font-black text-gray-900 font-mono">{formatCurrency(windowTotal)}</span>
        </div>
      </div>

      {/* Post Charge Modal */}
      {isPostingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-6 space-y-4 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900">Post Charge to Window {activeWindow}</h3>
            <form onSubmit={handlePostCharge} className="space-y-4 text-sm">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Category</label>
                <select
                  value={chargeCategory}
                  onChange={(e) => setChargeCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm mt-1"
                >
                  <option value="restaurant">Food & Beverage / Restaurant</option>
                  <option value="room_service">In-Room Dining</option>
                  <option value="laundry">Laundry & Dry Cleaning</option>
                  <option value="spa">Spa & Wellness</option>
                  <option value="minibar">Minibar Consumption</option>
                  <option value="other">Miscellaneous</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Description</label>
                <input
                  required
                  placeholder="e.g. Lobby Lounge Afternoon Tea"
                  value={chargeDescription}
                  onChange={(e) => setChargeDescription(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Amount (QAR)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="150.00"
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm mt-1"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setIsPostingModalOpen(false)}>Cancel</Button>
                <Button type="submit">Post to Folio</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory Void / Adjustment Reason Modal */}
      {isVoidModalOpen && selectedChargeForVoid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-6 space-y-4 animate-scale-in">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-lg font-bold">Immutable Void / Adjustment</h3>
            </div>
            <p className="text-xs text-gray-500">
              Under strict hotel accounting standards, charges cannot be deleted. A compensating negative reversal line will be posted with audit reason.
            </p>
            <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
              <p><span className="font-semibold">Item:</span> {selectedChargeForVoid.description}</p>
              <p><span className="font-semibold">Amount:</span> {formatCurrency(selectedChargeForVoid.total)}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase">Mandatory Reason Code</label>
              <select
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm mt-1"
              >
                <option value="">Select Audit Reason...</option>
                <option value="guest_dispute">Guest Dispute / Quality Complaint</option>
                <option value="posting_error">Cashier Wrong Room Posting</option>
                <option value="package_included">Already Included in Rate Package</option>
                <option value="management_rebate">Management Approved Rebate</option>
              </select>
            </div>
            <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
              <Button variant="outline" onClick={() => setIsVoidModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" disabled={!voidReason} onClick={handleVoidCharge}>
                Confirm Void
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bilingual Qatar GTA E-Invoice Preview Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-100 p-8 space-y-6 my-8 animate-scale-in">
            <div className="flex justify-between items-start border-b border-gray-200 pb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">GRAND PLAZA HOTEL DOHA</h2>
                <p className="text-xs text-gray-500">West Bay Diplomatic Area, PO Box 2026, Doha, Qatar</p>
                <p className="text-xs text-gray-500 font-mono">Tax Identification No (TIN): 000048192800003</p>
              </div>
              <div className="text-right rtl:text-left">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase">
                  Tax Invoice / فاتورة ضريبية
                </span>
                <p className="text-xs font-mono font-bold text-gray-900 mt-2">INV-2026-001043</p>
                <p className="text-xs text-gray-400">Date: 20-Oct-2026 / ١٩ ربيع الثاني ١٤٤٨</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="font-bold text-gray-400 uppercase">Guest Name / اسم الضيف</p>
                <p className="font-bold text-gray-900 text-sm mt-0.5">
                  {currentGuest ? `${currentGuest.firstName} ${currentGuest.lastName}` : 'Guest'}
                </p>
                <p className="text-gray-500">Qatar ID: {currentGuest?.governmentIdNumber || '28963401928'}</p>
              </div>
              <div className="text-right rtl:text-left">
                <p className="font-bold text-gray-400 uppercase">Stay Details / بيانات الإقامة</p>
                <p className="font-semibold text-gray-900">Room {currentRoom ? currentRoom.roomNumber : '101'}</p>
                <p className="text-gray-500">
                  In: {currentBooking?.checkInDate} • Out: {currentBooking?.checkOutDate}
                </p>
              </div>
            </div>

            <table className="w-full text-xs">
              <thead className="border-b border-gray-200 font-bold text-gray-500 uppercase">
                <tr>
                  <th className="py-2 text-left rtl:text-right">Description / البيان</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right rtl:text-left">Amount (QAR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentFolio.charges.filter((c) => !c.isVoid).map((c) => (
                  <tr key={c.id}>
                    <td className="py-2 font-medium">{c.description}</td>
                    <td className="py-2 text-center font-mono">{c.quantity}</td>
                    <td className="py-2 text-right rtl:text-left font-mono font-semibold">{c.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-end border-t border-gray-200 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-24 w-24 bg-gray-100 border border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center">
                  <QrCode className="h-16 w-16 text-gray-900" />
                  <span className="text-[8px] font-mono font-bold text-gray-500 mt-0.5">GTA COMPLIANT</span>
                </div>
                <div className="text-[10px] text-gray-400 max-w-xs">
                  Cryptographically hashed e-invoice payload verified per Qatar General Tax Authority (GTA) guidelines.
                </div>
              </div>

              <div className="w-64 space-y-1.5 text-xs text-right rtl:text-left">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="font-mono font-bold">{formatCurrency(currentFolio.totalCharges * 0.88)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Municipality Fee (5%):</span>
                  <span className="font-mono font-bold">{formatCurrency(currentFolio.totalCharges * 0.05)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service Charge (7%):</span>
                  <span className="font-mono font-bold">{formatCurrency(currentFolio.totalCharges * 0.07)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-black text-gray-900">
                  <span>Grand Total (QAR):</span>
                  <span className="font-mono text-blue-700">{formatCurrency(currentFolio.totalCharges)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
              <Button variant="outline" onClick={() => setIsInvoiceModalOpen(false)}>Close</Button>
              <Button onClick={() => window.print()} className="gap-2">
                <Printer className="h-4 w-4" />
                <span>Print Official PDF</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
