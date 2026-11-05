import { useState, useEffect, useCallback } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  Search,
  ArrowRight,
  LayoutDashboard,
  BedDouble,
  Users,
  CalendarCheck,
  Sparkles,
  Wrench,
  UtensilsCrossed,
  FileBarChart,
  Settings,
  Receipt,
  Moon,
  UserCog,
  Package,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

interface CommandItem {
  id: string
  label: string
  category: string
  icon: React.ReactNode
  action: () => void
  keywords?: string[]
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  const commands: CommandItem[] = [
    { id: 'dashboard', label: 'CEO Dashboard & Business KPIs', category: 'Operations', icon: <LayoutDashboard className="h-4 w-4" />, action: () => navigate('/'), keywords: ['home', 'ceo', 'kpi', 'revenue', 'adr'] },
    { id: 'front-desk', label: 'Front Desk - 60s Check-in / Check-out', category: 'Operations', icon: <CalendarCheck className="h-4 w-4" />, action: () => navigate('/front-desk'), keywords: ['checkin', 'checkout', 'reception', 'walkin', 'arrivals'] },
    { id: 'rooms', label: 'Interactive Room Rack & Status Matrix', category: 'Operations', icon: <BedDouble className="h-4 w-4" />, action: () => navigate('/rooms'), keywords: ['room', 'rack', 'status', 'grid', 'clean'] },
    { id: 'reservations', label: 'Reservations & Group Blocks', category: 'Operations', icon: <CalendarCheck className="h-4 w-4" />, action: () => navigate('/reservations'), keywords: ['booking', 'reserve', 'ota', 'siteminder'] },
    { id: 'guests', label: 'Guest Profiles & Qatar ID Vault', category: 'Operations', icon: <Users className="h-4 w-4" />, action: () => navigate('/guests'), keywords: ['guest', 'profile', 'qid', 'passport', 'history'] },
    { id: 'housekeeping', label: 'Housekeeping Mobile Task Board', category: 'Services', icon: <Sparkles className="h-4 w-4" />, action: () => navigate('/housekeeping'), keywords: ['clean', 'dirty', 'hk', 'attendant', 'inspect'] },
    { id: 'maintenance', label: 'Maintenance Tickets & OOO Rooms', category: 'Services', icon: <Wrench className="h-4 w-4" />, action: () => navigate('/maintenance'), keywords: ['repair', 'fix', 'ticket', 'ac', 'plumbing'] },
    { id: 'restaurant', label: 'Restaurant POS & Room Postings', category: 'Services', icon: <UtensilsCrossed className="h-4 w-4" />, action: () => navigate('/restaurant'), keywords: ['food', 'order', 'fnb', 'pos', 'dining'] },
    { id: 'billing', label: 'Folio Cashiering & GTA E-Invoicing', category: 'Finance', icon: <Receipt className="h-4 w-4" />, action: () => navigate('/billing'), keywords: ['folio', 'bill', 'invoice', 'payment', 'cashier', 'qr'] },
    { id: 'night-audit', label: 'Night Audit Roll & Daily Pre-Checks', category: 'Finance', icon: <Moon className="h-4 w-4" />, action: () => navigate('/night-audit'), keywords: ['audit', 'eod', 'roll', 'trial balance'] },
    { id: 'employees', label: 'Staff Directory & Designations', category: 'Management', icon: <UserCog className="h-4 w-4" />, action: () => navigate('/employees'), keywords: ['staff', 'employee', 'hr', 'roster'] },
    { id: 'inventory', label: 'Linen, Stock & Reorder Alerts', category: 'Management', icon: <Package className="h-4 w-4" />, action: () => navigate('/inventory'), keywords: ['inventory', 'supplies', 'purchase', 'amenities'] },
    { id: 'reports', label: 'Manager Flash & Analytics Reports', category: 'Management', icon: <FileBarChart className="h-4 w-4" />, action: () => navigate('/reports'), keywords: ['report', 'export', 'pdf', 'excel', 'usali'] },
    { id: 'settings', label: 'System Configuration & Qatar Rules', category: 'System', icon: <Settings className="h-4 w-4" />, action: () => navigate('/settings'), keywords: ['config', 'admin', 'tax', 'vat', 'gta', 'roles'] },
  ]

  const filtered = commands.filter((cmd) => {
    const q = query.toLowerCase()
    return (
      cmd.label.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.keywords?.some((k) => k.includes(q))
    )
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelect = useCallback((cmd: CommandItem) => {
    cmd.action()
    setOpen(false)
    setQuery('')
  }, [])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex])
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content
          className="fixed left-1/2 top-[18%] z-50 w-[92vw] max-w-xl -translate-x-1/2 rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden focus:outline-none animate-scale-in"
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center border-b border-gray-100 px-4">
            <Search className="h-5 w-5 text-gray-400 shrink-0" />
            <input
              className="flex-1 bg-transparent px-3 py-4 text-sm outline-none placeholder:text-gray-400 font-medium"
              placeholder="Type a screen name, shortcut, or search query (e.g. 'Front Desk', 'Folio')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 font-mono text-[11px] font-medium text-gray-400">
              ESC
            </kbd>
          </div>
          <div className="max-h-[360px] overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400 font-medium">No results found for "{query}".</p>
            ) : (
              filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-left transition-colors rtl:text-right group',
                    i === selectedIndex ? 'bg-blue-50 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                  )}
                  onClick={() => handleSelect(cmd)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <span className={cn('shrink-0 p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors', i === selectedIndex && 'bg-blue-100 text-blue-700')}>
                    {cmd.icon}
                  </span>
                  <div className="flex-1 text-left rtl:text-right min-w-0">
                    <p className="font-semibold truncate">{cmd.label}</p>
                    <p className="text-xs text-gray-400">{cmd.category}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0 rtl:rotate-180" />
                </button>
              ))
            )}
          </div>
          <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-2.5 text-xs text-gray-500 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span><kbd className="bg-white border rounded px-1 text-[10px]">↑</kbd> <kbd className="bg-white border rounded px-1 text-[10px]">↓</kbd> Navigate</span>
              <span><kbd className="bg-white border rounded px-1 text-[10px]">↵</kbd> Select</span>
            </div>
            <span>Quick jump to any module</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
