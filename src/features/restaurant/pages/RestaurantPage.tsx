import { useState } from 'react'
import {
  UtensilsCrossed,
  Plus,
  ShoppingCart,
  BedDouble,
  DollarSign,
  CheckCircle2,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useHotel } from '@/context/HotelContext'
import { formatCurrency } from '@/lib/utils'
import type { MenuItem } from '@/types'

export function RestaurantPage() {
  const { menuItems, rooms, postFnbChargeToRoom } = useHotel()
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied')

  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([])
  const [roomToCharge, setRoomToCharge] = useState(
    occupiedRooms.length > 0 ? occupiedRooms[0].roomNumber : '101'
  )
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [confirmedTotal, setConfirmedTotal] = useState(0)

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id)
      if (existing) {
        return prev.map((i) => (i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId))
  }

  const subtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0)
  const tax = subtotal * 0.05
  const serviceCharge = subtotal * 0.07
  const grandTotal = subtotal + tax + serviceCharge

  const handleChargeToRoom = () => {
    if (cart.length === 0) return

    const itemsSummary = cart.map((c) => ({
      name: c.item.name,
      quantity: c.quantity,
      price: c.item.price,
    }))

    // Post into central interconnected hotel state
    postFnbChargeToRoom(roomToCharge, itemsSummary, grandTotal)

    setConfirmedTotal(grandTotal)
    setOrderConfirmed(true)
    setCart([])
    setTimeout(() => {
      setOrderConfirmed(false)
    }, 6000)
  }

  const categories = ['all', 'breakfast', 'dinner', 'room_service', 'drinks', 'snacks']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Restaurant POS & In-Room Dining</h1>
            <Badge variant="teal">Connected to Room Folios</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Direct guest folio post-to-room charge integration with live tax calculation</p>
        </div>
      </div>

      {orderConfirmed && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-bold animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>
            Success! F&B order of {formatCurrency(confirmedTotal)} charged directly to Room {roomToCharge} Folio Window 1 and added to Today's Revenue. Kitchen ticket printed.
          </span>
        </div>
      )}

      {/* POS Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Menu Category Selector & Item Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap gap-1.5 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'ghost'}
                size="sm"
                className="text-xs capitalize font-semibold h-8"
                onClick={() => setActiveCategory(cat)}
              >
                {cat.replace('_', ' ')}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {menuItems
              .filter((item) => activeCategory === 'all' || item.category === activeCategory)
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-500 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                      {item.category.replace('_', ' ')}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 mt-1 line-clamp-2">{item.name}</h4>
                  </div>
                  <div className="mt-4 pt-2 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-sm font-black text-blue-700 font-mono">{formatCurrency(item.price)}</span>
                    <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      +
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right 1 Col: Active Order Ticket & Folio Charge Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between h-fit space-y-5">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                <h3 className="font-bold text-gray-900">Active Bill Ticket</h3>
              </div>
              <Badge variant="outline">{cart.reduce((a, c) => a + c.quantity, 0)} Items</Badge>
            </div>

            {/* Target Occupied Room Selector */}
            <div className="mt-4 p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
              <label className="text-[11px] font-bold uppercase text-blue-900 block mb-1">Charge to Occupied Room</label>
              <select
                value={roomToCharge}
                onChange={(e) => setRoomToCharge(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-xs font-bold text-gray-800 bg-white"
              >
                {occupiedRooms.map((r) => (
                  <option key={r.id} value={r.roomNumber}>
                    Room {r.roomNumber} ({r.type.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Items List */}
            <div className="mt-4 divide-y divide-gray-100 max-h-60 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center py-8 text-xs text-gray-400 font-medium">Select menu items on the left to add to bill.</p>
              ) : (
                cart.map((i) => (
                  <div key={i.item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex-1 pr-2">
                      <p className="font-semibold text-gray-800 line-clamp-1">{i.item.name}</p>
                      <p className="text-gray-400 font-mono">{i.quantity} × {formatCurrency(i.item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 font-mono">{formatCurrency(i.item.price * i.quantity)}</span>
                      <button onClick={() => removeFromCart(i.item.id)} className="text-gray-400 hover:text-rose-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pricing Totals & Post Action */}
          <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Municipality Tax (5%):</span>
              <span className="font-mono font-semibold">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>F&B Service Charge (7%):</span>
              <span className="font-mono font-semibold">{formatCurrency(serviceCharge)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-gray-900 border-t pt-2">
              <span>Total Charge (QAR):</span>
              <span className="font-mono text-blue-700">{formatCurrency(grandTotal)}</span>
            </div>

            <Button
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 font-bold gap-2"
              disabled={cart.length === 0 || occupiedRooms.length === 0}
              onClick={handleChargeToRoom}
            >
              <BedDouble className="h-4 w-4" />
              <span>Post to Room {roomToCharge} Folio</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
