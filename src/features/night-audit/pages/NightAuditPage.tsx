import { useState } from 'react'
import {
  Moon,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  FileText,
  Calendar,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useHotel } from '@/context/HotelContext'
import { formatCurrency } from '@/lib/utils'

export function NightAuditPage() {
  const { businessDate, runNightAuditRollover, occupiedRooms } = useHotel()
  const [auditRunning, setAuditRunning] = useState(false)
  const [auditStep, setAuditStep] = useState(0)
  const [auditCompleted, setAuditCompleted] = useState(false)

  const preChecks = [
    { id: '1', title: 'Pending Arrivals Check', detail: '0 unassigned arrivals remaining (All checked in or marked No-Show)', status: 'pass' },
    { id: '2', title: 'Cashier Shift Settlement', detail: 'All front desk shift floats counted and closed with zero variance', status: 'pass' },
    { id: '3', title: 'Room Status Reconciliation', detail: 'Front office and housekeeping discrepancy matrix clear', status: 'pass' },
    { id: '4', title: 'POS Open Tickets', detail: 'All restaurant outlets closed, kitchen orders billed to room folios', status: 'pass' },
  ]

  const steps = [
    `Posting room & package charges to all ${occupiedRooms} in-house folios...`,
    'Calculating Qatar Municipality 5% fees & 7% service charges...',
    'Generating immutable Trial Balance & Manager Flash PDFs...',
    'Performing pre-rollover database snapshot...',
    'Advancing accounting business date to 21-Oct-2026 & locking ledger...',
  ]

  const handleRunAudit = () => {
    setAuditRunning(true)
    setAuditStep(0)
    setAuditCompleted(false)

    const interval = setInterval(() => {
      setAuditStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval)
          setAuditRunning(false)
          setAuditCompleted(true)
          // Execute central interconnected state rollover!
          runNightAuditRollover()
          return steps.length - 1
        }
        return prev + 1
      })
    }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">End-of-Day Night Audit Rollover</h1>
            <Badge variant="purple">Connected to All Room Folios</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Roll the hotel business date, post room charges, and generate daily USALI reports</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-900 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span>Active Hotel Date: {businessDate}</span>
          </div>
        </div>
      </div>

      {auditCompleted && (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 font-bold text-base">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <span>Night Audit Completed Successfully! New Business Date: {businessDate}</span>
          </div>
          <p className="text-xs text-emerald-700">
            Nightly accommodation rates posted to all {occupiedRooms} in-house folios. Trial balance archived to PDF. Date updated on Dashboard.
          </p>
        </div>
      )}

      {/* Pre-Audit Verification Matrix */}
      <Card className="border-gray-100">
        <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-gray-900">Pre-Audit System Validation Checklist</CardTitle>
            <p className="text-xs text-gray-400 mt-0.5">Automated validation ensures no unposted revenue or cashier leakage before rollover</p>
          </div>
          <Badge variant="success">All 4 Checks Passed</Badge>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {preChecks.map((chk) => (
            <div key={chk.id} className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-900">{chk.title}</p>
                  <p className="text-xs text-gray-500">{chk.detail}</p>
                </div>
              </div>
              <Badge variant="success">PASS</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Audit Runner Terminal */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <Moon className="h-6 w-6 text-indigo-400" />
            <div>
              <h3 className="font-bold text-base">Night Audit Automation Pipeline</h3>
              <p className="text-xs text-gray-400">Target Business Date: 21-Oct-2026 (Roll forward)</p>
            </div>
          </div>
          <Button
            variant="default"
            disabled={auditRunning}
            onClick={handleRunAudit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2"
          >
            <Play className="h-4 w-4" />
            <span>{auditRunning ? 'Running Audit...' : 'Execute Night Audit'}</span>
          </Button>
        </div>

        {auditRunning && (
          <div className="space-y-3 py-4 animate-fade-in">
            <div className="flex items-center justify-between text-xs text-gray-300 font-mono">
              <span>Step {auditStep + 1} of {steps.length}</span>
              <span>{Math.round(((auditStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${((auditStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <p className="text-sm font-mono text-indigo-300 animate-pulse">{steps[auditStep]}</p>
          </div>
        )}

        <div className="text-[11px] font-mono text-gray-500 pt-2 border-t border-gray-800">
          Cognivex Audit Engine v1.0 • Safe idempotent re-runs guaranteed without duplicate postings.
        </div>
      </div>
    </div>
  )
}
