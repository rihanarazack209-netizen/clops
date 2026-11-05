import { useState } from 'react'
import {
  Wrench,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MaintenanceStatusBadge } from '@/components/ui/status-badge'
import { useHotel } from '@/context/HotelContext'
import type { MaintenanceTicket } from '@/types'

export function MaintenancePage() {
  const { maintenanceTickets, rooms, createMaintenanceTicket, resolveMaintenanceTicket } = useHotel()

  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false)
  const [roomNumber, setRoomNumber] = useState('204')
  const [category, setCategory] = useState<'ac' | 'electrical' | 'plumbing' | 'wifi' | 'tv' | 'furniture'>('ac')
  const [priority, setPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('high')
  const [description, setDescription] = useState('')

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    createMaintenanceTicket(
      {
        category,
        priority,
        description,
      },
      roomNumber
    )
    setIsNewTicketOpen(false)
    setDescription('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Engineering & Work Orders</h1>
            <Badge variant="destructive">Connected to Room OOO State</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Track asset maintenance, HVAC repairs, and out-of-order room blocking</p>
        </div>
        <Button variant="default" className="gap-2 shadow-sm" onClick={() => setIsNewTicketOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>New Work Order</span>
        </Button>
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Ticket ID</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Location / Room</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Category</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Description</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Priority</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right rtl:text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {maintenanceTickets.map((t) => {
                const room = rooms.find((r) => r.id === t.roomId)

                return (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-blue-700">{t.id}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {room ? `Room ${room.roomNumber} (Fl ${room.floor})` : 'Public Area / Corridor'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="uppercase text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-700 max-w-xs">{t.description}</td>
                    <td className="px-5 py-4">
                      <Badge variant={t.priority === 'critical' ? 'destructive' : t.priority === 'high' ? 'warning' : 'outline'}>
                        {t.priority.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-5 py-4"><MaintenanceStatusBadge status={t.status} /></td>
                    <td className="px-5 py-4 text-right rtl:text-left">
                      {t.status !== 'resolved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs text-emerald-700 hover:bg-emerald-50"
                          onClick={() => resolveMaintenanceTicket(t.id)}
                        >
                          Resolve & Release
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-6 space-y-4 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900">Create Work Order / OOO Request</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Room Number</label>
                  <select
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm mt-1"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.roomNumber}>Room {r.roomNumber}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm mt-1"
                  >
                    <option value="ac">HVAC / Air Conditioning</option>
                    <option value="plumbing">Plumbing & Drains</option>
                    <option value="electrical">Electrical & Lighting</option>
                    <option value="wifi">High Speed Wi-Fi / TV</option>
                    <option value="furniture">Carpentry / Furniture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Priority Severity</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm mt-1"
                >
                  <option value="critical">Critical (Block room / OOO)</option>
                  <option value="high">High (4-Hour SLA)</option>
                  <option value="medium">Medium (Same-day)</option>
                  <option value="low">Low (Next maintenance shift)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Issue Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail symptoms, guest presence, technician access instructions..."
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm mt-1 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setIsNewTicketOpen(false)}>Cancel</Button>
                <Button type="submit">Submit Work Order</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
