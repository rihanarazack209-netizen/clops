import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  ChevronDown,
  Search,
  Sun,
  Moon,
  Bell,
  Globe,
  LogOut,
  ShieldCheck,
  UserPlus,
  Sparkles,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

interface HeaderProps {
  sidebarCollapsed: boolean
  onThemeToggle: () => void
  onLanguageToggle: () => void
  theme: 'light' | 'dark'
  language: 'en' | 'ar'
}

// Logged-in user info (in a real app, read from auth context / JWT)
const CURRENT_USER = {
  name: 'Rihan Ahmed',
  initials: 'RA',
  role: 'Hotel Manager',
  email: 'rihan.ahmed@grandplaza.qa',
}

export function Header({
  sidebarCollapsed,
  onThemeToggle,
  onLanguageToggle,
  theme,
  language,
}: HeaderProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedHotel, setSelectedHotel] = useState('Grand Plaza Hotel')

  const handleLogout = () => {
    // Clear ALL auth keys so the guard redirects correctly
    localStorage.removeItem('cognivex_logged_in')
    localStorage.removeItem('auth_token')
    navigate('/login')
  }

  return (
    <header
      className={cn(
        'fixed top-0 z-30 flex h-16 items-center justify-between bg-white px-6 transition-all duration-300 border-b border-gray-100/80 shadow-xs',
        sidebarCollapsed
          ? 'left-[70px] rtl:left-0 rtl:right-[70px]'
          : 'left-[240px] rtl:left-0 rtl:right-[240px]',
        'right-0 rtl:left-0'
      )}
    >
      {/* Left: Hotel Switcher Dropdown */}
      <div className="flex items-center gap-3">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60 px-3.5 py-2 text-xs font-bold text-gray-800 transition-colors focus:outline-none">
              <Building2 className="h-4 w-4 text-gray-600" />
              <span>{selectedHotel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[200px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl animate-scale-in"
              align="start"
              sideOffset={6}
            >
              <DropdownMenu.Item
                className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer outline-none"
                onClick={() => setSelectedHotel('Grand Plaza Hotel')}
              >
                Grand Plaza Hotel (Main)
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer outline-none"
                onClick={() => setSelectedHotel('Cognivex Luxury Suites')}
              >
                Cognivex Luxury Suites (West Bay)
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer outline-none"
                onClick={() => setSelectedHotel('Pearl Resort & Spa')}
              >
                Pearl Resort & Spa (The Pearl)
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <div
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true })
            document.dispatchEvent(event)
          }}
          className="flex items-center gap-2.5 rounded-full bg-gray-50 border border-gray-200/70 px-4 py-2 text-xs text-gray-400 hover:bg-gray-100/70 hover:border-gray-300 transition-all cursor-pointer shadow-2xs"
        >
          <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <span className="flex-1 truncate">Search guests, rooms, reservations...</span>
          <kbd className="hidden sm:inline-flex h-4 items-center gap-1 rounded bg-white px-1.5 font-mono text-[9px] font-medium text-gray-400 border border-gray-200">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Language, Theme & User */}
      <div className="flex items-center gap-3">
        {/* Language Switcher – shows CURRENT language; click to switch */}
        <button
          onClick={onLanguageToggle}
          title={language === 'en' ? 'Switch to Arabic / التبديل إلى العربية' : 'Switch to English'}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <Globe className="h-3.5 w-3.5 shrink-0" />
          <span>{language === 'en' ? 'EN' : 'AR'}</span>
          <span className="text-gray-300 font-normal">|</span>
          <span className="text-gray-400 font-normal">{language === 'en' ? 'AR' : 'EN'}</span>
        </button>

        {/* Guest Experience Portal Shortcut */}
        <button
          onClick={() => navigate('/guest-portal')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#9e763a] text-xs font-bold transition-all shadow-xs"
          title="Open In-House Hotel Guest Portal"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Guest Portal</span>
        </button>

        {/* Sun / Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notification Bell with red badge */}
        <button className="relative h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs">
            3
          </span>
        </button>

        {/* User Profile with Interactive Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2.5 pl-2 rtl:pl-0 rtl:pr-2 border-l rtl:border-l-0 rtl:border-r border-gray-200 hover:bg-gray-50 p-1.5 rounded-xl transition-colors focus:outline-none">
              {/* Avatar – shows user initials */}
              <div className="h-9 w-9 rounded-full overflow-hidden bg-amber-100 border border-amber-200 flex items-center justify-center shadow-xs">
                <span className="text-xs font-bold text-amber-800">{CURRENT_USER.initials}</span>
              </div>
              <div className="hidden md:block text-left rtl:text-right">
                <p className="text-xs font-bold text-gray-900 leading-tight">{CURRENT_USER.name}</p>
                <p className="text-[10px] text-gray-400 font-medium">{CURRENT_USER.role}</p>
              </div>
              <ChevronDown className="h-3 w-3 text-gray-400 hidden md:block" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[210px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl animate-scale-in text-xs font-semibold"
              align="end"
              sideOffset={8}
            >
              <div className="px-3 py-2 border-b border-gray-100 mb-1">
                <p className="text-xs font-bold text-gray-900">{CURRENT_USER.name}</p>
                <p className="text-[10px] text-gray-400">{CURRENT_USER.email}</p>
              </div>
              <DropdownMenu.Item
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#9e763a] hover:bg-amber-50 cursor-pointer outline-none font-bold"
                onClick={() => navigate('/guest-portal')}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>In-House Guest Portal</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer outline-none"
                onClick={() => navigate('/verify')}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>2FA Verification Screen</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer outline-none"
                onClick={() => navigate('/signup')}
              >
                <UserPlus className="h-3.5 w-3.5 text-amber-600" />
                <span>Register New Property</span>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />
              <DropdownMenu.Item
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-rose-600 hover:bg-rose-50 cursor-pointer outline-none"
                onClick={handleLogout}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Lock Station & Sign Out</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}
