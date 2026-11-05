import { useState } from 'react'
import {
  Settings,
  Building,
  DollarSign,
  Shield,
  Key,
  Globe,
  Bell,
  Save,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'property' | 'taxes' | 'roles' | 'compliance'>('property')
  const [savedNotice, setSavedNotice] = useState('')

  // Form states
  const [propertyNameEn, setPropertyNameEn] = useState('Cognivex Doha Hotel & Suites')
  const [propertyNameAr, setPropertyNameAr] = useState('فندق وأجنحة كوجنيفكس الدوحة')
  const [taxNumber, setTaxNumber] = useState('000048192800003')
  const [currency, setCurrency] = useState('QAR')
  const [timezone, setTimezone] = useState('Asia/Qatar (GMT+3)')
  const [vatToggle, setVatToggle] = useState(true)
  const [vatRate, setVatRate] = useState('5.0')
  const [serviceChargeRate, setServiceChargeRate] = useState('7.0')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedNotice('Settings saved successfully and propagated across all front desk terminals!')
    setTimeout(() => setSavedNotice(''), 4000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">System Configuration & Property Setup</h1>
            <Badge variant="teal">Multi-Tenant Core</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Configure property master profiles, Qatar compliance rules, taxes, and roles</p>
        </div>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-bold animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
        <Button
          variant={activeTab === 'property' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('property')}
          className="text-xs font-semibold"
        >
          Property Master Profile
        </Button>
        <Button
          variant={activeTab === 'taxes' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('taxes')}
          className="text-xs font-semibold"
        >
          Taxes & Qatar GTA Engine
        </Button>
        <Button
          variant={activeTab === 'roles' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('roles')}
          className="text-xs font-semibold"
        >
          Role-Based Permissions (RBAC)
        </Button>
        <Button
          variant={activeTab === 'compliance' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('compliance')}
          className="text-xs font-semibold"
        >
          Qatar MOI & Data Privacy
        </Button>
      </div>

      {/* Settings Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-3xl">
        {activeTab === 'property' && (
          <form onSubmit={handleSave} className="space-y-4 text-sm">
            <h3 className="font-bold text-gray-900 border-b pb-3">Hotel Profile Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Property Name (English)</label>
                <Input value={propertyNameEn} onChange={(e) => setPropertyNameEn(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">اسم المنشأة (العربية)</label>
                <Input value={propertyNameAr} onChange={(e) => setPropertyNameAr(e.target.value)} dir="rtl" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Operating Currency</label>
                <Input value={currency} onChange={(e) => setCurrency(e.target.value)} disabled />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Timezone</label>
                <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} disabled />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Qatar Tax TIN</label>
                <Input value={taxNumber} onChange={(e) => setTaxNumber(e.target.value)} required />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" /> Save Property Settings
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'taxes' && (
          <form onSubmit={handleSave} className="space-y-4 text-sm">
            <h3 className="font-bold text-gray-900 border-b pb-3">Qatar Tax & Fee Engine (FR-SET-04, FR-QAT-07)</h3>
            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Qatar Tourism / Municipality Fee (5%)</span>
                <Badge variant="teal">Active</Badge>
              </div>
              <p className="text-xs text-gray-500">Automatically applied to room folio postings during Night Audit.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">VAT Rate (%)</label>
                <Input value={vatRate} onChange={(e) => setVatRate(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Service Charge Rate (%)</label>
                <Input value={serviceChargeRate} onChange={(e) => setServiceChargeRate(e.target.value)} />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" /> Update Tax Rules
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'roles' && (
          <div className="space-y-4 text-sm">
            <h3 className="font-bold text-gray-900 border-b pb-3">Role-Based Access Control (RBAC)</h3>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">General Manager / CEO</p>
                  <p className="text-xs text-gray-400">Full business intelligence, revenue dashboards, rate overrides</p>
                </div>
                <Badge variant="success">Unrestricted</Badge>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Receptionist / Front Desk</p>
                  <p className="text-xs text-gray-400">Check-in, Check-out, Folio settlement (Hidden: Salaries, CEO Analytics)</p>
                </div>
                <Badge variant="info">Operations Level</Badge>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Housekeeping Attendant</p>
                  <p className="text-xs text-gray-400">Mobile room tasks only (Hidden: Guest ID numbers, payment tokens, revenue)</p>
                </div>
                <Badge variant="purple">Mobile PWA Restrict</Badge>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-4 text-sm">
            <h3 className="font-bold text-gray-900 border-b pb-3">Qatar Authority & Privacy Compliance</h3>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2">
              <p className="text-xs font-bold text-emerald-900 uppercase">Qatar Ministry of Interior (MOI) Adapter</p>
              <p className="text-xs text-gray-600">
                Encrypted payload sent automatically upon Check-In, Room Move, and Check-Out.
              </p>
              <Badge variant="success">API Transport Status: Connected</Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
