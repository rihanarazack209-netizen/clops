import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  KeyRound,
  Utensils,
  Receipt,
  Bell,
  Sparkles,
  Wifi,
  PhoneCall,
  CheckCircle2,
  Clock,
  Coffee,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Bed,
  Layers,
  Send,
  Wrench,
  AlertCircle,
  Smartphone,
  Flame,
} from 'lucide-react'
import { useHotel } from '@/context/HotelContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export function GuestPortalPage() {
  const navigate = useNavigate()
  const {
    rooms,
    guests,
    bookings,
    folios,
    postFnbChargeToRoom,
    createMaintenanceTicket,
    todayRevenue,
  } = useHotel()

  // Find all active in-house guests
  const inHouseBookings = bookings.filter((b) => b.status === 'checked_in')
  const defaultBooking = inHouseBookings.find((b) => b.roomId === 'r-202') || inHouseBookings[0]
  const defaultGuest = guests.find((g) => g.id === defaultBooking?.guestId) || guests[0]
  const defaultRoom = rooms.find((r) => r.id === defaultBooking?.roomId) || rooms[0]

  // State for logged in guest
  const [selectedBookingId, setSelectedBookingId] = useState<string>(defaultBooking?.id || 'b-1006')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'dining' | 'services' | 'bill'>('overview')

  // In-Room Dining State
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [orderSuccess, setOrderSuccess] = useState('')

  // Service Request State
  const [serviceMessage, setServiceMessage] = useState('')
  const [serviceSuccess, setServiceSuccess] = useState('')
  const [dndActive, setDndActive] = useState(false)
  const [cleanRoomRequested, setCleanRoomRequested] = useState(false)

  // Maintenance Quick Report
  const [maintenanceIssue, setMaintenanceIssue] = useState('')
  const [maintSuccess, setMaintSuccess] = useState('')

  // Derive current guest data
  const currentBooking = bookings.find((b) => b.id === selectedBookingId) || defaultBooking
  const currentGuest = guests.find((g) => g.id === currentBooking?.guestId) || defaultGuest
  const currentRoom = rooms.find((r) => r.id === currentBooking?.roomId) || defaultRoom
  const currentFolio = folios.find((f) => f.bookingId === currentBooking?.id) || folios[0]

  // Menu items for in-room dining
  const diningMenu = [
    { id: 'm-1', name: 'Royal Indian Dum Biryani', category: 'Main Course', price: 85, desc: 'Fragrant basmati rice, tender spiced cuts, saffron & raita', tag: 'Chef Special' },
    { id: 'm-2', name: 'Paneer Butter Masala & Garlic Naan', category: 'Vegetarian', price: 65, desc: 'Cottage cheese simmered in velvety tomato gravy with warm naan', tag: 'Vegetarian' },
    { id: 'm-3', name: 'Al Mourjan Mezze Platter', category: 'Appetizer', price: 75, desc: 'Hummus, mutabal, tabbouleh, stuffed vine leaves & fresh pita' },
    { id: 'm-4', name: 'Wagyu Beef Club Sandwich', category: 'Light Fare', price: 90, desc: 'Triple-decker with smoked bacon, egg, aged cheddar & truffle fries' },
    { id: 'm-5', name: 'Gulab Jamun with Pistachio Rabri', category: 'Dessert', price: 40, desc: 'Warm milk dumplings infused with cardamom syrup and condensed milk' },
    { id: 'm-6', name: 'Fresh Mint & Lime Mojito', category: 'Beverages', price: 35, desc: 'Sparkling mineral water with crushed mint leaves and lime wedge' },
  ]

  // Digital Key Unlock Simulation
  const handleUnlockDoor = () => {
    setUnlocking(true)
    setTimeout(() => {
      setUnlocking(false)
      setIsUnlocked(true)
      setTimeout(() => setIsUnlocked(false), 5000)
    }, 1200)
  }

  // Dining Cart Handlers
  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const copy = { ...prev }
      if (copy[id] > 1) {
        copy[id] -= 1
      } else {
        delete copy[id]
      }
      return copy
    })
  }

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = diningMenu.find((m) => m.id === id)
    return sum + (item ? item.price * qty : 0)
  }, 0)

  const handlePlaceOrder = () => {
    if (cartTotal <= 0) return
    const orderItems = Object.entries(cart).map(([id, qty]) => {
      const item = diningMenu.find((m) => m.id === id)!
      return { name: item.name, quantity: qty, price: item.price }
    })

    // Post charge directly to the in-house room folio
    postFnbChargeToRoom(currentRoom.roomNumber, orderItems, cartTotal)
    setOrderSuccess(`Order placed! QAR ${cartTotal} added to Room ${currentRoom.roomNumber} folio. Delivery in 25 mins.`)
    setCart({})
    setTimeout(() => setOrderSuccess(''), 6000)
  }

  // Quick Service Request
  const handleQuickService = (serviceName: string) => {
    setServiceSuccess(`Request received for "${serviceName}". Our guest service team will attend to Room ${currentRoom.roomNumber} shortly.`)
    setTimeout(() => setServiceSuccess(''), 4000)
  }

  // Custom Maintenance / Desk Issue
  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!maintenanceIssue.trim()) return

    createMaintenanceTicket(
      {
        roomId: currentRoom.id,
        category: 'electrical',
        priority: 'high',
        description: `Guest In-Room Request (Room ${currentRoom.roomNumber}): ${maintenanceIssue}`,
      },
      currentRoom.roomNumber
    )

    setMaintSuccess(`Maintenance ticket dispatched. Engineer assigned to Room ${currentRoom.roomNumber}.`)
    setMaintenanceIssue('')
    setTimeout(() => setMaintSuccess(''), 5000)
  }

  return (
    <div className="min-h-screen bg-[#070d17] text-gray-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#0c1421]/95 backdrop-blur-md border-b border-gray-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-0.5 text-[#e5b54f]">
            <span className="w-1.5 h-3 bg-[#e5b54f] rounded-t-sm" />
            <span className="w-1.5 h-5 bg-[#e5b54f] rounded-t-sm" />
            <span className="w-1.5 h-7 bg-[#e5b54f] rounded-t-sm" />
            <span className="w-1.5 h-5 bg-[#e5b54f] rounded-t-sm" />
            <span className="w-1.5 h-3 bg-[#e5b54f] rounded-t-sm" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              Cognivex <span className="text-[#e5b54f] font-normal text-xs uppercase tracking-widest">Guest Experience</span>
            </h1>
            <p className="text-[11px] text-gray-400">Grand Plaza Hotel & Suites</p>
          </div>
        </div>

        {/* Guest Switcher & Switch to PMS Admin */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 bg-[#121c2d] px-3 py-1.5 rounded-xl border border-gray-700/60 text-xs">
            <span className="text-gray-400">Viewing as Guest:</span>
            <select
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              className="bg-transparent font-bold text-[#e5b54f] focus:outline-none cursor-pointer"
            >
              {inHouseBookings.map((b) => {
                const g = guests.find((x) => x.id === b.guestId)
                const r = rooms.find((x) => x.id === b.roomId)
                return (
                  <option key={b.id} value={b.id} className="bg-[#0c1421] text-white">
                    Room {r?.roomNumber} · {g?.firstName} {g?.lastName} ({g?.country || 'Guest'})
                  </option>
                )
              })}
            </select>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#9e763a] to-[#ba934f] text-white text-xs font-bold hover:brightness-110 shadow-sm transition-all"
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Switch to Hotel Staff PMS</span>
            <span className="sm:hidden">Staff PMS</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Guest Hero Welcome Card */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-[#121d2f] via-[#0d1624] to-[#152236] border border-amber-500/20 shadow-2xl">
          <div
            className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ba934f]/20 text-[#f5cf79] border border-[#ba934f]/40 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {currentGuest.vipLevel ? `${currentGuest.vipLevel.toUpperCase()} VIP GUEST` : 'IN-HOUSE GUEST'}
                </span>
                <span className="text-gray-400 text-xs">Booking #{currentBooking?.bookingNumber}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Welcome, {currentGuest.firstName} {currentGuest.lastName}
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-lg">
                Deluxe In-Room Guest Services Terminal. Control your stay, dining, bill &amp; services effortlessly.
              </p>

              {/* In-House Stay Quick Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-700/50 text-xs">
                <div>
                  <span className="text-gray-400 block text-[11px]">Assigned Room</span>
                  <span className="font-bold text-white text-base text-[#e5b54f]">
                    Room {currentRoom.roomNumber}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Room Category</span>
                  <span className="font-medium text-gray-200 capitalize">{currentRoom.type} Suite</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Checkout Date</span>
                  <span className="font-medium text-gray-200">{currentBooking?.checkOutDate}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Current Bill</span>
                  <span className="font-bold text-emerald-400">
                    QAR {currentFolio ? currentFolio.balance.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Digital Key Widget */}
            <div className="flex flex-col items-center justify-center bg-[#09111c]/80 backdrop-blur-md p-5 rounded-2xl border border-amber-500/30 text-center shrink-0 w-full md:w-56">
              <div
                className={`h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 animate-pulse'
                    : unlocking
                    ? 'bg-amber-500 text-white animate-spin'
                    : 'bg-gradient-to-tr from-[#9e763a] to-[#ba934f] text-white shadow-md'
                }`}
              >
                {isUnlocked ? (
                  <CheckCircle2 className="h-8 w-8" />
                ) : (
                  <KeyRound className="h-8 w-8" />
                )}
              </div>
              <h4 className="text-xs font-bold text-white mt-3">
                {isUnlocked ? 'Door Unlocked!' : unlocking ? 'Connecting NFC...' : 'Mobile Room Key'}
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {isUnlocked ? 'Room 202 is now open' : 'Tap to unlock your door'}
              </p>
              <button
                type="button"
                onClick={handleUnlockDoor}
                disabled={unlocking || isUnlocked}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-[#ba934f]/20 hover:bg-[#ba934f]/30 border border-[#ba934f]/50 text-xs font-bold text-[#f5cf79] transition-all"
              >
                {unlocking ? 'Opening Door...' : isUnlocked ? 'Door Open (5s)' : 'Tap to Unlock'}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 gap-1 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#ba934f] text-[#f5cf79]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Room &amp; Amenities</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dining')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'dining'
                ? 'border-[#ba934f] text-[#f5cf79]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Utensils className="h-4 w-4" />
            <span>In-Room Dining</span>
            {cartTotal > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-black">
                QAR {cartTotal}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'services'
                ? 'border-[#ba934f] text-[#f5cf79]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Guest Services</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bill')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'bill'
                ? 'border-[#ba934f] text-[#f5cf79]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Receipt className="h-4 w-4" />
            <span>Live Bill / Folio</span>
          </button>
        </div>

        {/* Tab 1: Overview & Amenities */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick In-Room Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#0e1726] border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">High-Speed Wi-Fi</span>
                  </div>
                  <Badge variant="teal">Connected</Badge>
                </div>
                <p className="text-xs text-gray-400">Network: <strong className="text-white">GrandPlaza_VIP</strong></p>
                <p className="text-xs text-gray-400">Password: <strong className="text-[#f5cf79] font-mono">plaza{currentRoom.roomNumber}</strong></p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e1726] border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Housekeeping Mode</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dndActive ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {dndActive ? 'DND Active' : 'Normal'}
                  </span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDndActive(!dndActive)
                      if (!dndActive) setCleanRoomRequested(false)
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      dndActive
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {dndActive ? 'Turn Off DND' : 'Do Not Disturb'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCleanRoomRequested(!cleanRoomRequested)
                      if (!cleanRoomRequested) setDndActive(false)
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      cleanRoomRequested
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {cleanRoomRequested ? 'Requested' : 'Make Up Room'}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e1726] border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Concierge &amp; Butler</span>
                  </div>
                  <Badge variant="purple">24/7 Live</Badge>
                </div>
                <p className="text-xs text-gray-400">Direct Desk: <strong className="text-white">Dial '0' on Room Phone</strong></p>
                <p className="text-xs text-gray-400">WhatsApp Butler: <strong className="text-[#f5cf79]">+974 5500 1122</strong></p>
              </div>
            </div>

            {/* Room Features & Amenities */}
            <div className="p-5 rounded-2xl bg-[#0e1726] border border-gray-800 space-y-3">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Bed className="h-4 w-4 text-[#ba934f]" />
                Room Amenities &amp; Inclusions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(currentRoom.amenities || ['King Bed', 'Sea View', 'Bathtub', 'Balcony', 'Nespresso']).map((am, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#131d2e] border border-gray-800 text-xs text-gray-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#ba934f]" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Express Services Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Instant One-Tap Services
              </h3>
              {serviceSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{serviceSuccess}</span>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickService('Fresh Luxury Bath Towels')}
                  className="p-4 rounded-2xl bg-[#0e1726] hover:bg-[#152136] border border-gray-800 hover:border-amber-500/40 text-left transition-all space-y-1.5"
                >
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <h4 className="text-xs font-bold text-white">Extra Towels</h4>
                  <p className="text-[11px] text-gray-400">Delivered in 10 mins</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickService('Feather Soft Pillows')}
                  className="p-4 rounded-2xl bg-[#0e1726] hover:bg-[#152136] border border-gray-800 hover:border-amber-500/40 text-left transition-all space-y-1.5"
                >
                  <Bed className="h-5 w-5 text-purple-400" />
                  <h4 className="text-xs font-bold text-white">Extra Pillows</h4>
                  <p className="text-[11px] text-gray-400">Firm or soft feather</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickService('Morning Wake-up Call (07:00 AM)')}
                  className="p-4 rounded-2xl bg-[#0e1726] hover:bg-[#152136] border border-gray-800 hover:border-amber-500/40 text-left transition-all space-y-1.5"
                >
                  <Clock className="h-5 w-5 text-blue-400" />
                  <h4 className="text-xs font-bold text-white">Wake-Up Call</h4>
                  <p className="text-[11px] text-gray-400">Schedule morning call</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickService('Bellboy Luggage Assistance')}
                  className="p-4 rounded-2xl bg-[#0e1726] hover:bg-[#152136] border border-gray-800 hover:border-amber-500/40 text-left transition-all space-y-1.5"
                >
                  <Bell className="h-5 w-5 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white">Bellboy Assistance</h4>
                  <p className="text-[11px] text-gray-400">Luggage &amp; taxi aid</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: In-Room Dining */}
        {activeTab === 'dining' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-[#0e1726] border border-amber-500/30">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-[#ba934f]" />
                  In-Room 24/7 Fine Dining Menu
                </h3>
                <p className="text-xs text-gray-400">
                  Orders are prepared hot and automatically billed to your Room {currentRoom.roomNumber} folio.
                </p>
              </div>
              {cartTotal > 0 && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] text-gray-400 block">Cart Total</span>
                    <span className="text-base font-black text-amber-400 font-mono">QAR {cartTotal}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9e763a] to-[#ba934f] text-white text-xs font-bold shadow-md hover:brightness-110 flex items-center gap-1.5"
                  >
                    <span>Confirm &amp; Charge Room</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {orderSuccess && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>{orderSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {diningMenu.map((item) => {
                const qty = cart[item.id] || 0
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#0e1726] border border-gray-800 flex flex-col justify-between hover:border-gray-700 transition-all space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          {item.category}
                        </span>
                        {item.tag && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                      <span className="text-sm font-black text-[#e5b54f] font-mono">
                        QAR {item.price}
                      </span>
                      {qty > 0 ? (
                        <div className="flex items-center gap-2 bg-[#141f32] px-2 py-1 rounded-xl border border-gray-700">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="h-6 w-6 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="text-xs font-black text-white px-1.5">{qty}</span>
                          <button
                            type="button"
                            onClick={() => addToCart(item.id)}
                            className="h-6 w-6 rounded-lg bg-[#ba934f] hover:bg-[#a88241] text-white font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(item.id)}
                          className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-[#ba934f] text-gray-200 hover:text-white text-xs font-bold transition-all"
                        >
                          + Add to Order
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Guest Services & In-Room Maintenance */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Assistance */}
            <div className="p-5 rounded-2xl bg-[#0e1726] border border-gray-800 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#ba934f]" />
                Housekeeping &amp; Valet Requests
              </h3>
              <p className="text-xs text-gray-400">
                Click below to request amenities or laundry services directly to your door.
              </p>

              <div className="space-y-2.5">
                {[
                  'Daily Evening Turn-Down Service',
                  'Dental Kit & Shaving Kit',
                  'Baby Cot / Infant Crib',
                  'Same-Day Laundry & Dry Cleaning',
                  'Universal Power Adapter / Charger',
                  'Shoe Shine Service',
                ].map((req, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickService(req)}
                    className="w-full p-3 rounded-xl bg-[#121c2c] hover:bg-[#18263c] border border-gray-800/80 text-left text-xs font-semibold text-gray-200 flex items-center justify-between transition-all"
                  >
                    <span>{req}</span>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* In-Room Maintenance & Engineering */}
            <div className="p-5 rounded-2xl bg-[#0e1726] border border-gray-800 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Wrench className="h-4 w-4 text-amber-400" />
                Report Room Issue to Hotel Desk
              </h3>
              <p className="text-xs text-gray-400">
                Need temperature adjustment, TV assistance, or plumbing check? Our engineering team will arrive promptly.
              </p>

              {maintSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{maintSuccess}</span>
                </div>
              )}

              <form onSubmit={handleReportIssue} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                    Describe Issue in Room {currentRoom.roomNumber}
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. AC cooling needs calibration, extra reading lamp, or bathroom faucet check..."
                    value={maintenanceIssue}
                    onChange={(e) => setMaintenanceIssue(e.target.value)}
                    className="w-full rounded-xl bg-[#121c2c] border border-gray-700 p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ba934f]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#9e763a] to-[#ba934f] text-white text-xs font-bold h-10 gap-2 shadow-md"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Dispatch Maintenance Engineer</span>
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 4: Live Bill & Folio */}
        {activeTab === 'bill' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0e1726] border border-gray-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
                <div>
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Live Guest Folio</span>
                  <h3 className="text-lg font-bold text-white">
                    Room {currentRoom.roomNumber} Itemized Charges
                  </h3>
                  <p className="text-xs text-gray-400">Folio ID: {currentFolio?.id || 'fol-1001'}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-gray-400 block">Outstanding Balance</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    QAR {currentFolio ? currentFolio.balance.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>

              {/* Charges Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#121c2d] text-gray-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Amount (QAR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {(currentFolio?.charges || []).map((ch) => (
                      <tr key={ch.id} className="hover:bg-gray-800/30">
                        <td className="p-3 text-gray-400 font-mono">{ch.date}</td>
                        <td className="p-3 font-semibold text-white">{ch.description}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-800 text-gray-300 capitalize">
                            {ch.category}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-gray-200">
                          {ch.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Express Checkout Button */}
              <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-gray-400">
                  Total Paid: <strong className="text-white">QAR {currentFolio?.totalPayments.toFixed(2)}</strong> via Card on File
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => alert(`Official GTA E-Invoice for Room ${currentRoom.roomNumber} has been emailed to ${currentGuest.email}`)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold border border-gray-700 transition-all"
                  >
                    Email PDF Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Express Checkout request sent to Front Desk for Room ${currentRoom.roomNumber}. Keycard drop box is located in the lobby.`)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md hover:brightness-110 transition-all"
                  >
                    Express Mobile Check-Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
