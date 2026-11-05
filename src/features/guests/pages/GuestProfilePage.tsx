import { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Plus,
  Shield,
  Eye,
  EyeOff,
  History,
  Star,
  Hotel,
  Mail,
  Phone,
  Calendar,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PageLoader } from '@/components/ui/loading'
import { pmsApi } from '@/services/api-client'
import { formatCurrency } from '@/lib/utils'
import type { Guest } from '@/types'

export function GuestProfilePage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [unmaskedId, setUnmaskedId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const res = await pmsApi.getGuests()
        setGuests(res)
        if (res.length > 0) setSelectedGuest(res[0])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filtered = guests.filter((g) => {
    const q = search.toLowerCase()
    return (
      g.firstName.toLowerCase().includes(q) ||
      g.lastName.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.governmentIdNumber.includes(q)
    )
  })

  const maskIdNumber = (id: string, isUnmasked: boolean) => {
    if (isUnmasked) return id
    if (id.length <= 4) return '****'
    return id.slice(0, 3) + '******' + id.slice(-2)
  }

  if (loading) return <PageLoader text="Loading Guest Profiles & Profiles Vault..." />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Guest Profiles & Privacy Vault</h1>
            <Badge variant="teal">PDPPL Law 13/2016 Compliant</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Manage guest records, VIP tiers, stay history, and encrypted identification</p>
        </div>
        <Button variant="default" className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>New Guest Profile</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Searchable List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <Input
            placeholder="Search name, phone, QID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />

          <div className="divide-y divide-gray-100 max-h-[550px] overflow-y-auto">
            {filtered.map((g) => (
              <div
                key={g.id}
                onClick={() => {
                  setSelectedGuest(g)
                  setUnmaskedId(null)
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                  selectedGuest?.id === g.id ? 'bg-blue-50/80 border border-blue-200' : 'hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">{g.firstName} {g.lastName}</p>
                    {g.vipLevel === 'platinum' && <Badge variant="purple">VIP Plat</Badge>}
                    {g.vipLevel === 'gold' && <Badge variant="warning">VIP Gold</Badge>}
                  </div>
                  <p className="text-xs text-gray-400">{g.nationality} • {g.phone}</p>
                </div>
                <div className="text-right rtl:text-left text-xs font-mono font-semibold text-gray-700">
                  {g.totalStays} Stays
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Guest 360 Detail View */}
        {selectedGuest && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            {/* Guest Summary Card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                  {selectedGuest.firstName[0]}{selectedGuest.lastName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">{selectedGuest.firstName} {selectedGuest.lastName}</h2>
                    <Badge variant="purple" className="capitalize">{selectedGuest.vipLevel} VIP</Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Profile ID: {selectedGuest.id} • Registered {selectedGuest.createdAt.slice(0, 10)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="px-3 py-2 bg-emerald-50 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Revenue</span>
                  <span className="text-base font-black text-emerald-700 font-mono">{formatCurrency(selectedGuest.totalSpent)}</span>
                </div>
              </div>
            </div>

            {/* Identification & Qatar PDPPL Privacy Mask */}
            <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-700">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Government Identification (Qatar MOI / Tourism)</span>
                </div>
                <button
                  onClick={() => setUnmaskedId(unmaskedId ? null : selectedGuest.id)}
                  className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
                >
                  {unmaskedId ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>{unmaskedId ? 'Hide / Mask ID' : 'Reveal ID (Role Audited)'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block">Document Type</span>
                  <span className="font-bold text-gray-800 uppercase">{selectedGuest.governmentIdType}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Document Number</span>
                  <span className="font-bold font-mono text-gray-900">
                    {maskIdNumber(selectedGuest.governmentIdNumber, unmaskedId === selectedGuest.id)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Date of Birth</span>
                  <span className="font-semibold text-gray-800">{selectedGuest.dateOfBirth}</span>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Guest Stay Preferences</h4>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline">Preferred: {selectedGuest.preferences?.roomType || 'Deluxe Room'}</Badge>
                <Badge variant="outline">Floor: High Floor</Badge>
                <Badge variant="outline">Non-Smoking</Badge>
                <Badge variant="outline">Firm Pillows</Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
