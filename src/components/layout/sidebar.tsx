import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  UserCheck,
  BedDouble,
  CalendarCheck,
  Receipt,
  Sparkles,
  Wrench,
  UtensilsCrossed,
  Users,
  Package,
  FileBarChart,
  UserSquare2,
  Moon,
  Settings,
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed }: SidebarProps) {
  const { t } = useTranslation()
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, path: '/' },
    { label: 'Front Desk', icon: <UserCheck className="h-4 w-4" />, path: '/front-desk' },
    { label: 'Rooms', icon: <BedDouble className="h-4 w-4" />, path: '/rooms' },
    { label: 'Reservations', icon: <CalendarCheck className="h-4 w-4" />, path: '/reservations' },
    { label: 'Folio', icon: <Receipt className="h-4 w-4" />, path: '/billing' },
    { label: 'Housekeeping', icon: <Sparkles className="h-4 w-4" />, path: '/housekeeping' },
    { label: 'Maintenance', icon: <Wrench className="h-4 w-4" />, path: '/maintenance' },
    { label: 'Restaurant', icon: <UtensilsCrossed className="h-4 w-4" />, path: '/restaurant' },
    { label: 'Employees', icon: <Users className="h-4 w-4" />, path: '/employees' },
    { label: 'Inventory', icon: <Package className="h-4 w-4" />, path: '/inventory' },
    { label: 'Reports', icon: <FileBarChart className="h-4 w-4" />, path: '/reports' },
    { label: 'Guests', icon: <UserSquare2 className="h-4 w-4" />, path: '/guests' },
    { label: 'Night Audit', icon: <Moon className="h-4 w-4" />, path: '/night-audit' },
    { label: 'Settings', icon: <Settings className="h-4 w-4" />, path: '/settings' },
  ]

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col bg-[#0c1421] text-gray-300 transition-all duration-300 select-none rtl:left-auto rtl:right-0',
        collapsed ? 'w-[70px]' : 'w-[240px]'
      )}
    >
      {/* Brand Header */}
      <div className="flex flex-col items-center justify-center py-6 px-4">
        <div className="flex items-center gap-2.5">
          {/* Gold Crown/Building Logo Icon */}
          <div className="flex items-end gap-0.5 text-[#e5b54f]">
            <span className="w-1.5 h-3 bg-[#e5b54f] rounded-t-sm" />
            <span className="w-1.5 h-5 bg-[#e5b54f] rounded-t-sm" />
            <span className="w-1.5 h-7 bg-[#e5b54f] rounded-t-sm" />
            <span className="w-1.5 h-5 bg-[#e5b54f] rounded-t-sm" />
            <span className="w-1.5 h-3 bg-[#e5b54f] rounded-t-sm" />
          </div>
          {!collapsed && (
            <div className="text-left rtl:text-right">
              <h1 className="text-base font-bold text-white tracking-wide leading-tight">Cognivex</h1>
              <p className="text-[10px] font-semibold text-[#e5b54f] tracking-wider uppercase">Hotel PMS</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={cn(
                'relative flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150',
                isActive
                  ? 'bg-gradient-to-r from-[#9e763a] to-[#ba934f] text-white font-semibold shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5',
                collapsed && 'justify-center px-0'
              )}
            >
              <span className={cn('shrink-0', isActive ? 'text-white' : 'text-gray-400')}>{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}

              {/* Active right notch/triangle */}
              {isActive && !collapsed && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-gray-100 rtl:right-auto rtl:left-0 rtl:border-r-0 rtl:border-l-4 rtl:border-l-gray-100" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Skyline & Version Footer */}
      <div className="relative mt-auto pt-8 pb-3 px-4 overflow-hidden">
        {/* Doha Skyline silhouette graphic */}
        <div className="absolute inset-x-0 bottom-6 h-12 opacity-30 pointer-events-none flex items-end justify-center gap-1.5 px-3">
          <div className="w-2 h-7 bg-blue-400/40 rounded-t-sm" />
          <div className="w-3 h-10 bg-blue-300/50 rounded-t-sm" />
          <div className="w-2.5 h-6 bg-blue-400/30 rounded-t-sm" />
          <div className="w-4 h-12 bg-amber-400/40 rounded-t-sm" />
          <div className="w-3 h-8 bg-blue-300/40 rounded-t-sm" />
          <div className="w-2.5 h-5 bg-blue-400/30 rounded-t-sm" />
        </div>
        <div className="relative z-10 flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  )
}
