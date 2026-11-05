import { Badge } from './badge'
import type { RoomStatus, BookingStatus, HousekeepingTaskStatus, MaintenanceTicketStatus } from '@/types'

const roomStatusConfig: Record<RoomStatus, { label: string; variant: 'success' | 'info' | 'warning' | 'destructive' | 'purple' | 'teal' | 'secondary' | 'outline' }> = {
  available: { label: 'Available', variant: 'success' },
  occupied: { label: 'Occupied', variant: 'info' },
  dirty: { label: 'Dirty', variant: 'warning' },
  cleaning: { label: 'Cleaning', variant: 'purple' },
  inspected: { label: 'Inspected', variant: 'teal' },
  maintenance: { label: 'Maintenance', variant: 'destructive' },
  ooo: { label: 'Out of Order', variant: 'secondary' },
  oos: { label: 'Out of Service', variant: 'outline' },
}

const bookingStatusConfig: Record<BookingStatus, { label: string; variant: 'success' | 'warning' | 'destructive' | 'info' | 'secondary' | 'outline' }> = {
  confirmed: { label: 'Confirmed', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  checked_in: { label: 'In-House', variant: 'info' },
  checked_out: { label: 'Checked Out', variant: 'secondary' },
  no_show: { label: 'No Show', variant: 'destructive' },
}

const housekeepingStatusConfig: Record<HousekeepingTaskStatus, { label: string; variant: 'warning' | 'info' | 'success' | 'teal' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  in_progress: { label: 'In Progress', variant: 'info' },
  completed: { label: 'Cleaned', variant: 'success' },
  inspected: { label: 'Inspected & Released', variant: 'teal' },
}

const maintenanceStatusConfig: Record<MaintenanceTicketStatus, { label: string; variant: 'warning' | 'info' | 'purple' | 'success' | 'secondary' }> = {
  open: { label: 'Open', variant: 'warning' },
  assigned: { label: 'Assigned', variant: 'info' },
  in_progress: { label: 'In Progress', variant: 'purple' },
  resolved: { label: 'Resolved', variant: 'success' },
  closed: { label: 'Closed', variant: 'secondary' },
}

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const config = roomStatusConfig[status] || { label: status, variant: 'secondary' }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config = bookingStatusConfig[status] || { label: status, variant: 'secondary' }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function HousekeepingStatusBadge({ status }: { status: HousekeepingTaskStatus }) {
  const config = housekeepingStatusConfig[status] || { label: status, variant: 'secondary' }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function MaintenanceStatusBadge({ status }: { status: MaintenanceTicketStatus }) {
  const config = maintenanceStatusConfig[status] || { label: status, variant: 'secondary' }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
