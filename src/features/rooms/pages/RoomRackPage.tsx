import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BedDouble,
  Filter,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Wrench,
  Search,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { RoomStatusBadge } from '@/components/ui/status-badge'
import { useHotel } from '@/context/HotelContext'
import { formatCurrency } from '@/lib/utils'
import type { Room, RoomStatus, RoomType } from '@/types'

export function RoomRackPage() {
  const { t } = useTranslation()
  const { rooms, guests, updateRoomHousekeepingStatus } = useHotel()

  // Filters
  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<RoomType | 'all'>('all')
  const [search, setSearch] = useState('')

  // Room detail drawer / modal state
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  const filteredRooms = rooms.filter((r) => {
    if (floorFilter !== 'all' && r.floor !== floorFilter) return false
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (typeFilter !== 'all' && r.type !== typeFilter) return false
    if (search && !r.roomNumber.includes(search)) return false
    return true
  })

  const handleStatusChange = (roomId: string, newStatus: RoomStatus) => {
    updateRoomHousekeepingStatus(roomId, newStatus)
    if (selectedRoom?.id === roomId) {
      setSelectedRoom({ ...selectedRoom, status: newStatus })
    }
  }

  // Room counts
  const total = rooms.length
  const occupied = rooms.filter((r) => r.status === 'occupied').length
  const available = rooms.filter((r) => r.status === 'available' || r.status === 'inspected').length
  const dirty = rooms.filter((r) => r.status === 'dirty' || r.status === 'cleaning').length
  const ooo = rooms.filter((r) => r.status === 'maintenance' || r.status === 'ooo' || r.status === 'oos').length

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Counts */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Room Rack & House Matrix</h1>
            <Badge variant="teal">Live Synced with Front Desk & HK</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Live room availability, floor status, and instant housekeeping dispatch</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-xs font-bold text-blue-700">
            <span>Occupied: {occupied}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-700">
            <span>Ready: {available}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl text-xs font-bold text-amber-700">
            <span>Dirty: {dirty}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-700">
            <span>Out of Order: {ooo}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none"
          >
            <option value="all">All Floors</option>
            <option value="1">Floor 1</option>
            <option value="2">Floor 2</option>
            <option value="3">Floor 3</option>
            <option value="4">Floor 4</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available (Clean)</option>
            <option value="occupied">Occupied</option>
            <option value="dirty">Dirty</option>
            <option value="cleaning">Cleaning</option>
            <option value="inspected">Inspected & Ready</option>
            <option value="maintenance">Maintenance</option>
            <option value="ooo">Out of Order (OOO)</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none"
          >
            <option value="all">All Room Types</option>
            <option value="standard">Standard Deluxe</option>
            <option value="deluxe">Executive Deluxe</option>
            <option value="suite">Panoramic Suite</option>
            <option value="presidential">Presidential Suite</option>
          </select>
        </div>

        <div className="w-full sm:w-60">
          <Input
            placeholder="Search room #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      {/* Visual Room Grid / Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
        {filteredRooms.map((room) => {
          const guest = guests.find((g) => g.id === room.currentGuestId)

          const statusBorderColors: Record<RoomStatus, string> = {
            available: 'border-l-emerald-500 bg-emerald-50/20',
            occupied: 'border-l-blue-600 bg-blue-50/20',
            dirty: 'border-l-amber-500 bg-amber-50/20',
            cleaning: 'border-l-purple-500 bg-purple-50/20',
            inspected: 'border-l-teal-500 bg-teal-50/20',
            maintenance: 'border-l-rose-500 bg-rose-50/20',
            ooo: 'border-l-gray-500 bg-gray-100/40',
            oos: 'border-l-gray-400 bg-gray-50',
          }

          return (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`p-4 bg-white rounded-xl border border-gray-200 border-l-4 ${statusBorderColors[room.status]} shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl font-black text-gray-900 tracking-tight font-mono">{room.roomNumber}</span>
                  <span className="text-[10px] font-bold uppercase text-gray-400">FL {room.floor}</span>
                </div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  {room.type}
                </div>
                <RoomStatusBadge status={room.status} />
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                {room.status === 'occupied' && guest ? (
                  <span className="font-semibold text-gray-800 truncate" title={`${guest.firstName} ${guest.lastName}`}>
                    {guest.lastName}
                  </span>
                ) : (
                  <span className="text-gray-400 font-medium">{formatCurrency(room.pricePerNight)}</span>
                )}
                <Eye className="h-3.5 w-3.5 text-gray-400 hover:text-blue-600" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Room Detail Drawer / Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 p-6 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold font-mono text-gray-900">Room {selectedRoom.roomNumber}</h3>
                  <RoomStatusBadge status={selectedRoom.status} />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Floor {selectedRoom.floor} • {selectedRoom.type} Category</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRoom(null)}>✕</Button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Base Rate per Night</span>
                <span className="font-bold text-gray-900">{formatCurrency(selectedRoom.pricePerNight)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Max Capacity</span>
                <span className="font-semibold text-gray-900">{selectedRoom.capacity} Guests</span>
              </div>
              <div className="py-1.5">
                <span className="text-gray-500 text-xs uppercase font-bold">Room Amenities</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedRoom.amenities.map((am) => (
                    <Badge key={am} variant="secondary">{am}</Badge>
                  ))}
                </div>
              </div>
              {selectedRoom.notes && (
                <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                  <span className="font-bold">Maintenance / Operational Note:</span> {selectedRoom.notes}
                </div>
              )}
            </div>

            {/* Quick Status Action Controls */}
            <div>
              <span className="text-xs font-bold text-gray-700 uppercase">Change Housekeeping / Operational Status:</span>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-emerald-700 hover:bg-emerald-50"
                  onClick={() => handleStatusChange(selectedRoom.id, 'inspected')}
                >
                  Mark Inspected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-amber-700 hover:bg-amber-50"
                  onClick={() => handleStatusChange(selectedRoom.id, 'dirty')}
                >
                  Mark Dirty
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-rose-700 hover:bg-rose-50"
                  onClick={() => handleStatusChange(selectedRoom.id, 'ooo')}
                >
                  Set OOO (Repair)
                </Button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={() => setSelectedRoom(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
