// Simple store without external state library dependency — using localStorage and React context
// This file exports UI state helpers

export type Theme = 'light' | 'dark'
export type Language = 'en' | 'ar'

export interface UIState {
  sidebarCollapsed: boolean
  theme: Theme
  language: Language
}

const STORAGE_KEY = 'cognivex-ui-state'

export function getStoredUIState(): UIState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return { sidebarCollapsed: false, theme: 'light', language: 'en' }
}

export function setStoredUIState(state: Partial<UIState>) {
  try {
    const current = getStoredUIState()
    const updated = { ...current, ...state }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {}
}
