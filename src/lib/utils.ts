import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'QAR', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date | string, format: 'short' | 'long' | 'iso' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    case 'long':
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    case 'iso':
      return d.toISOString().split('T')[0]
    default:
      return d.toLocaleDateString()
  }
}

export function generateId(prefix = 'HMS'): string {
  const date = new Date()
  const dateStr = date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0')
  const seq = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}${dateStr}${seq}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function calculateOccupancyRate(occupied: number, total: number): number {
  if (total === 0) return 0
  return Math.round((occupied / total) * 100)
}

export function calculateADR(totalRevenue: number, roomsSold: number): number {
  if (roomsSold === 0) return 0
  return Math.round((totalRevenue / roomsSold) * 100) / 100
}

export function calculateRevPAR(totalRevenue: number, totalRooms: number): number {
  if (totalRooms === 0) return 0
  return Math.round((totalRevenue / totalRooms) * 100) / 100
}
