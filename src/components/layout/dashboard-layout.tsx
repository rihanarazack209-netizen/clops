import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { CommandPalette } from '@/components/ui/command-palette'
import { getStoredUIState, setStoredUIState, type Theme, type Language } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const { i18n } = useTranslation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => getStoredUIState().sidebarCollapsed)
  const [theme, setTheme] = useState<Theme>(() => getStoredUIState().theme)
  const [language, setLanguage] = useState<Language>(() => getStoredUIState().language)

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
    i18n.changeLanguage(language)
  }, [language, i18n])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const handleToggleSidebar = () => {
    const newVal = !sidebarCollapsed
    setSidebarCollapsed(newVal)
    setStoredUIState({ sidebarCollapsed: newVal })
  }

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    setStoredUIState({ theme: newTheme })
  }

  const handleToggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en'
    setLanguage(newLang)
    setStoredUIState({ language: newLang })
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onThemeToggle={handleToggleTheme}
        onLanguageToggle={handleToggleLanguage}
        theme={theme}
        language={language}
      />
      <main
        className={cn(
          'pt-16 transition-all duration-300 min-h-screen',
          sidebarCollapsed
            ? 'ml-[70px] rtl:ml-0 rtl:mr-[70px]'
            : 'ml-[240px] rtl:ml-0 rtl:mr-[240px]'
        )}
      >
        <div className="p-5 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
      <CommandPalette />
    </div>
  )
}
