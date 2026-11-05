import { useState, useEffect } from 'react'
import {
  UserCog,
  Plus,
  Search,
  Mail,
  Phone,
  Building,
  Clock,
  CheckCircle,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PageLoader } from '@/components/ui/loading'
import { pmsApi } from '@/services/api-client'
import type { Employee, Department } from '@/types'

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [deptFilter, setDeptFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const res = await pmsApi.getEmployees()
        setEmployees(res)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filtered = employees.filter((emp) => {
    if (deptFilter !== 'all' && emp.department !== deptFilter) return false
    const match =
      emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeNumber.toLowerCase().includes(search.toLowerCase())
    return match
  })

  if (loading) return <PageLoader text="Loading Staff Directory..." />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Hotel Staff & HR Directory</h1>
            <Badge variant="teal">{employees.length} Active Staff</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Manage departmental designations, roster shifts, and role-based permissions</p>
        </div>
        <Button variant="default" className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Add Employee</span>
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none"
        >
          <option value="all">All Departments</option>
          <option value="front_office">Front Office</option>
          <option value="housekeeping">Housekeeping</option>
          <option value="food_beverage">Food & Beverage</option>
          <option value="maintenance">Maintenance & Engineering</option>
          <option value="finance">Finance & Audit</option>
        </select>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search staff by name or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((emp) => (
          <div key={emp.id} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
                  {emp.firstName[0]}{emp.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{emp.firstName} {emp.lastName}</h3>
                  <p className="text-xs text-gray-400 font-mono">{emp.employeeNumber}</p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-semibold text-gray-800">{emp.designation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-3.5 w-3.5 text-gray-400" />
                <span className="capitalize">{emp.department.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span className="capitalize">{emp.shift} Shift (08:00 - 16:30)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="truncate">{emp.email}</span>
              <span className="font-mono text-gray-700 font-semibold">{emp.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
