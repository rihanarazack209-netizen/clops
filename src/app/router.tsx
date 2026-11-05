import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { CEODashboard } from '@/features/dashboard/pages/CEODashboard'
import { FrontDeskPage } from '@/features/front-desk/pages/FrontDeskPage'
import { RoomRackPage } from '@/features/rooms/pages/RoomRackPage'
import { ReservationsPage } from '@/features/reservations/pages/ReservationsPage'
import { GuestProfilePage } from '@/features/guests/pages/GuestProfilePage'
import { HousekeepingPage } from '@/features/housekeeping/pages/HousekeepingPage'
import { MaintenancePage } from '@/features/maintenance/pages/MaintenancePage'
import { RestaurantPage } from '@/features/restaurant/pages/RestaurantPage'
import { FolioPage } from '@/features/folio/pages/FolioPage'
import { NightAuditPage } from '@/features/night-audit/pages/NightAuditPage'
import { EmployeesPage } from '@/features/employees/pages/EmployeesPage'
import { AttendancePage } from '@/features/employees/pages/AttendancePage'
import { InventoryPage } from '@/features/inventory/pages/InventoryPage'
import { ReportsPage } from '@/features/reports/pages/ReportsPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { SignUpPage } from '@/features/auth/pages/SignUpPage'
import { VerificationPage } from '@/features/auth/pages/VerificationPage'
import { GuestPortalPage } from '@/features/guest-portal/pages/GuestPortalPage'

function AuthGuard({ children }: { children: React.ReactNode }) {
  // Check for JWT token (new) or legacy flag (backward compat)
  const isAuth =
    typeof window !== 'undefined' &&
    (!!localStorage.getItem('auth_token') ||
      localStorage.getItem('cognivex_logged_in') === 'true')
  if (!isAuth) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/verify',
    element: <VerificationPage />,
  },
  {
    path: '/guest-portal',
    element: <GuestPortalPage />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <CEODashboard /> },
      { path: 'front-desk', element: <FrontDeskPage /> },
      { path: 'rooms', element: <RoomRackPage /> },
      { path: 'reservations', element: <ReservationsPage /> },
      { path: 'guests', element: <GuestProfilePage /> },
      { path: 'housekeeping', element: <HousekeepingPage /> },
      { path: 'maintenance', element: <MaintenancePage /> },
      { path: 'restaurant', element: <RestaurantPage /> },
      { path: 'billing', element: <FolioPage /> },
      { path: 'night-audit', element: <NightAuditPage /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
