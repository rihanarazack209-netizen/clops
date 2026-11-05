import React from 'react'
import { cn } from '@/lib/utils'
import { Card } from './card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  className?: string
  valueClassName?: string
}

export function StatCard({ title, value, subtitle, icon, trend, className, valueClassName }: StatCardProps) {
  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
        ? TrendingDown
        : Minus
    : null

  return (
    <Card className={cn('p-5 hover:shadow-md transition-all duration-200 border-gray-100 overflow-hidden', className)}>
      <div className="flex items-start justify-between gap-3 min-w-0">
        {/* Text content – min-w-0 so it can shrink and truncate */}
        <div className="space-y-2 min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 truncate">{title}</p>
          {/* Responsive font size: smaller on mobile to prevent overflow */}
          <p className={cn('text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 truncate', valueClassName)}>
            {value}
          </p>
          {subtitle && <p className="text-xs text-gray-400 font-medium truncate">{subtitle}</p>}
          {trend && TrendIcon && (
            <div className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
              trend.value > 0 ? 'bg-emerald-50 text-emerald-700' : trend.value < 0 ? 'bg-rose-50 text-rose-700' : 'bg-gray-100 text-gray-600'
            )}>
              <TrendIcon className="h-3.5 w-3.5" />
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-500 font-normal">{trend.label}</span>
            </div>
          )}
        </div>
        {/* Icon – shrink-0 so it never squishes */}
        {icon && (
          <div className="rounded-xl bg-blue-50/80 p-3 text-blue-600 border border-blue-100/50 shadow-sm shrink-0">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
