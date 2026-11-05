import { useState } from 'react'
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  DollarSign,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

export function ReportsPage() {
  const [activeReport, setActiveReport] = useState('manager_flash')
  const [exportNotice, setExportNotice] = useState('')

  const reportsList = [
    { id: 'manager_flash', name: 'Daily Manager Flash Report', category: 'Executive & Finance' },
    { id: 'trial_balance', name: 'USALI Trial Balance & Dept Revenue', category: 'Finance' },
    { id: 'occupancy_forecast', name: '30/90-Day Occupancy & ADR Forecast', category: 'Revenue & Sales' },
    { id: 'cashier_reconciliation', name: 'Cashier Shift Audit & Payment Gateway', category: 'Finance' },
    { id: 'tax_vat_summary', name: 'Qatar GTA Tax & Municipality Fee Summary', category: 'Compliance' },
    { id: 'housekeeping_turnaround', name: 'Housekeeping Performance & Room Turnover', category: 'Operations' },
  ]

  const handleExport = (format: 'pdf' | 'excel') => {
    setExportNotice(`Generating official ${format.toUpperCase()} report... Download started.`)
    setTimeout(() => setExportNotice(''), 4000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Hospitality BI Reports & Analytics</h1>
            <Badge variant="teal">USALI 11th Edition Compliant</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">Audit-ready financial statements, occupancy pickup, and Qatar GTA e-reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Export to Excel</span>
          </Button>
          <Button variant="default" className="gap-2 shadow-sm" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </Button>
        </div>
      </div>

      {exportNotice && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold animate-fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Reports Catalogue & Active Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Col: Report Selector List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 space-y-1">
          <p className="px-3 py-2 text-[11px] font-bold uppercase text-gray-400">Available Report Catalogue</p>
          {reportsList.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveReport(r.id)}
              className={`w-full text-left rtl:text-right p-3 rounded-xl text-xs font-semibold transition-all ${
                activeReport === r.id ? 'bg-blue-50 text-blue-800 font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div>{r.name}</div>
              <div className="text-[10px] text-gray-400 font-normal mt-0.5">{r.category}</div>
            </button>
          ))}
        </div>

        {/* Right 3 Cols: Report Paper Preview */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {reportsList.find((r) => r.id === activeReport)?.name}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Hotel Business Date: 31-Oct-2026 • Currency: QAR</p>
            </div>
            <Badge variant="outline">Official Document</Badge>
          </div>

          {/* Sample Tabular Report Body */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 font-bold text-gray-600 uppercase">
                <tr>
                  <th className="py-2.5 px-4 text-left rtl:text-right">Department / Revenue Center</th>
                  <th className="py-2.5 px-4 text-right rtl:text-left">Today Actual</th>
                  <th className="py-2.5 px-4 text-right rtl:text-left">Month to Date (MTD)</th>
                  <th className="py-2.5 px-4 text-right rtl:text-left">Budget Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                <tr>
                  <td className="py-3 px-4 font-sans font-semibold text-gray-900">Rooms Revenue (USALI 01)</td>
                  <td className="py-3 px-4 text-right rtl:text-left">{formatCurrency(71200)}</td>
                  <td className="py-3 px-4 text-right rtl:text-left">{formatCurrency(1820000)}</td>
                  <td className="py-3 px-4 text-right rtl:text-left text-emerald-600 font-bold">+6.4%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-semibold text-gray-900">Food & Beverage (USALI 02)</td>
                  <td className="py-3 px-4 text-right rtl:text-left">{formatCurrency(17150)}</td>
                  <td className="py-3 px-4 text-right rtl:text-left">{formatCurrency(412000)}</td>
                  <td className="py-3 px-4 text-right rtl:text-left text-emerald-600 font-bold">+4.1%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-semibold text-gray-900">Laundry & Valet (USALI 03)</td>
                  <td className="py-3 px-4 text-right rtl:text-left">{formatCurrency(4200)}</td>
                  <td className="py-3 px-4 text-right rtl:text-left">{formatCurrency(98000)}</td>
                  <td className="py-3 px-4 text-right rtl:text-left text-gray-600">0.0%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-semibold text-gray-900">Spa & Wellness (USALI 04)</td>
                  <td className="py-3 px-4 text-right rtl:text-left">{formatCurrency(3600)}</td>
                  <td className="py-3 px-4 text-right rtl:text-left">{formatCurrency(85800)}</td>
                  <td className="py-3 px-4 text-right rtl:text-left text-rose-600 font-bold">-1.2%</td>
                </tr>
                <tr className="bg-gray-50/80 font-black text-gray-900 text-sm">
                  <td className="py-3.5 px-4 font-sans">Total Gross Operating Revenue</td>
                  <td className="py-3.5 px-4 text-right rtl:text-left text-blue-700">{formatCurrency(96150)}</td>
                  <td className="py-3.5 px-4 text-right rtl:text-left text-blue-700">{formatCurrency(2415800)}</td>
                  <td className="py-3.5 px-4 text-right rtl:text-left text-emerald-700">+5.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
