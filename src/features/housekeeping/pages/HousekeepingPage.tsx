import { useState } from 'react'
import {
  Sparkles,
  CheckCircle,
  Play,
  CheckCheck,
  Smartphone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HousekeepingStatusBadge } from '@/components/ui/status-badge'
import { useHotel } from '@/context/HotelContext'
import type { HousekeepingTask } from '@/types'

export function HousekeepingPage() {
  const {
    housekeepingTasks,
    rooms,
    completeHousekeepingClean,
    releaseInspectedRoom,
  } = useHotel()

  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [isMobilePwaMode, setIsMobilePwaMode] = useState(false)
  const [successNote, setSuccessNote] = useState('')

  const handleStartTask = (taskId: string) => {
    setSuccessNote('Cleaning task in progress. Room status updated on Front Desk & Room Rack.')
    setTimeout(() => setSuccessNote(''), 4000)
  }

  const handleCompleteTask = (taskId: string) => {
    completeHousekeepingClean(taskId)
    setSuccessNote('Cleaning completed! Supervisor notified for release inspection.')
    setTimeout(() => setSuccessNote(''), 4000)
  }

  const handleInspectRelease = (taskId: string, roomId?: string) => {
    releaseInspectedRoom(taskId, roomId)
    setSuccessNote('Room successfully inspected and released to Inventory & Channels as READY FOR SALE!')
    setTimeout(() => setSuccessNote(''), 4000)
  }

  const filteredTasks = housekeepingTasks.filter(
    (t) => filterPriority === 'all' || t.priority === filterPriority
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Housekeeping & Room Turnaround</h1>
            <Badge variant="teal">Live Synced with Front Desk & Room Rack</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Manage cleaning tasks, supervisor inspection, and attendant mobile views</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isMobilePwaMode ? 'default' : 'outline'}
            className="gap-2"
            onClick={() => setIsMobilePwaMode(!isMobilePwaMode)}
          >
            <Smartphone className="h-4 w-4" />
            <span>{isMobilePwaMode ? 'Exit Mobile PWA View' : 'Switch to Attendant Mobile View'}</span>
          </Button>
        </div>
      </div>

      {successNote && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold animate-fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>{successNote}</span>
        </div>
      )}

      {/* Attendant Mobile PWA Preview */}
      {isMobilePwaMode ? (
        <div className="max-w-md mx-auto bg-gray-900 p-4 rounded-3xl shadow-2xl border-4 border-gray-800">
          <div className="bg-white rounded-2xl p-4 min-h-[500px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span className="font-bold text-gray-900">Attendant Portal</span>
                </div>
                <Badge variant="purple">Floor 1 & 2</Badge>
              </div>

              <div className="space-y-3">
                {filteredTasks.map((task) => {
                  const room = rooms.find((r) => r.id === task.roomId)
                  return (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black font-mono">Room {room?.roomNumber || '103'}</span>
                        <Badge variant={task.priority === 'urgent' ? 'destructive' : 'warning'}>
                          {task.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 capitalize">{task.type.replace('_', ' ')} • {task.notes || 'Standard clean'}</p>

                      <div className="pt-2 flex gap-2">
                        {task.status === 'pending' && (
                          <Button
                            size="sm"
                            className="w-full bg-blue-600 text-xs h-10 gap-1.5"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <Play className="h-3.5 w-3.5" /> Start & Complete
                          </Button>
                        )}
                        {task.status === 'in_progress' && (
                          <Button
                            size="sm"
                            variant="success"
                            className="w-full text-xs h-10 gap-1.5"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <CheckCheck className="h-3.5 w-3.5" /> Mark Completed
                          </Button>
                        )}
                        {task.status === 'completed' && (
                          <div className="w-full text-center text-xs text-emerald-700 font-bold py-2 bg-emerald-50 rounded-lg">
                            ✓ Ready for Supervisor Inspection
                          </div>
                        )}
                        {task.status === 'inspected' && (
                          <div className="w-full text-center text-xs text-teal-700 font-bold py-2 bg-teal-50 rounded-lg">
                            ✓ Inspected & Released for Sale
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t text-center text-xs text-gray-400">
              Cognivex Mobile PWA • Real-time Folio Minibar Posting enabled
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Supervisor Task Table */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Active Cleaning & Turnaround Queue</h3>
            <div className="flex items-center gap-2">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="rounded-lg border border-gray-200 text-xs p-1.5 bg-gray-50 font-semibold"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Room</th>
                  <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Clean Type</th>
                  <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Priority</th>
                  <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Assigned To</th>
                  <th className="px-5 py-3.5 text-right rtl:text-left font-semibold">Supervisor Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTasks.map((task) => {
                  const room = rooms.find((r) => r.id === task.roomId)

                  return (
                    <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-gray-900 text-base">
                        Room {room?.roomNumber || '103'}
                        <div className="text-xs font-sans text-gray-400 capitalize">{room?.type}</div>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold capitalize text-gray-700">
                        {task.type.replace('_', ' ')}
                        {task.notes && <div className="text-[11px] text-gray-400">{task.notes}</div>}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={task.priority === 'urgent' ? 'destructive' : task.priority === 'high' ? 'warning' : 'outline'}>
                          {task.priority.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-5 py-4"><HousekeepingStatusBadge status={task.status} /></td>
                      <td className="px-5 py-4 text-xs text-gray-600 font-medium">
                        {task.assignedTo ? 'Ramesh Kumar' : 'Unassigned (Floor 1 Pool)'}
                      </td>
                      <td className="px-5 py-4 text-right rtl:text-left space-x-2 rtl:space-x-reverse">
                        {task.status === 'completed' && (
                          <Button
                            variant="success"
                            size="sm"
                            className="h-8 text-xs font-semibold"
                            onClick={() => handleInspectRelease(task.id, task.roomId)}
                          >
                            Release Room
                          </Button>
                        )}
                        {task.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            Mark Cleaned
                          </Button>
                        )}
                        {task.status === 'inspected' && (
                          <span className="text-xs text-teal-700 font-bold">✓ Released</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
