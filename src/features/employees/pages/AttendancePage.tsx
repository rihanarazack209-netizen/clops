import { useState } from 'react'
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Calendar,
  UserCheck,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function AttendancePage() {
  const [attendanceRecords] = useState([
    { id: '1', emp: 'Aisha Al-Kuwari', dept: 'Front Office', shift: 'Morning', in: '07:55 AM', out: '04:10 PM', status: 'present', hours: 8.2 },
    { id: '2', emp: 'Ramesh Kumar', dept: 'Housekeeping', shift: 'Morning', in: '08:02 AM', out: '04:30 PM', status: 'present', hours: 8.5 },
    { id: '3', emp: 'Mohamed Ibrahim', dept: 'Maintenance', shift: 'Morning', in: '07:45 AM', out: '--', status: 'present', hours: 7.5 },
    { id: '4', emp: 'Mariam Al-Sulaiti', dept: 'Finance', shift: 'Morning', in: '--', out: '--', status: 'on_leave', hours: 0 },
    { id: '5', emp: 'Chef Jean Pierre', dept: 'F&B', shift: 'Afternoon', in: '02:00 PM', out: '--', status: 'present', hours: 6.0 },
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Staff Shifts & Daily Attendance</h1>
            <Badge variant="teal">Biometric Terminal Synced</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Qatar WPS wage protection & daily roster attendance tracking</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Staff Member</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Department</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Shift Roster</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Clock In</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Clock Out</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Working Hours</th>
                <th className="px-5 py-3.5 text-right rtl:text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendanceRecords.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4 font-bold text-gray-900">{r.emp}</td>
                  <td className="px-5 py-4 text-xs text-gray-600">{r.dept}</td>
                  <td className="px-5 py-4 text-xs font-semibold">{r.shift}</td>
                  <td className="px-5 py-4 font-mono text-xs text-emerald-700">{r.in}</td>
                  <td className="px-5 py-4 font-mono text-xs text-gray-600">{r.out}</td>
                  <td className="px-5 py-4 font-mono text-xs font-bold">{r.hours ? `${r.hours} hrs` : '--'}</td>
                  <td className="px-5 py-4 text-right rtl:text-left">
                    <Badge variant={r.status === 'present' ? 'success' : 'warning'}>
                      {r.status === 'present' ? 'Present Today' : 'Approved Leave'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
