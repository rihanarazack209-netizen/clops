// ========================
// Room Types
// ========================
export type RoomStatus = 'available' | 'occupied' | 'dirty' | 'cleaning' | 'inspected' | 'maintenance' | 'ooo' | 'oos'
export type RoomType = 'standard' | 'deluxe' | 'suite' | 'presidential'

export interface Room {
  id: string
  roomNumber: string
  floor: number
  type: RoomType
  status: RoomStatus
  capacity: number
  pricePerNight: number
  amenities: string[]
  currentGuestId?: string
  currentBookingId?: string
  lastCleaned?: string
  notes?: string
}

// ========================
// Guest Types
// ========================
export interface Guest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  city?: string
  country: string
  nationality: string
  governmentIdType: 'passport' | 'national_id' | 'qid' | 'driving_license'
  governmentIdNumber: string
  dateOfBirth: string
  preferences?: GuestPreferences
  vipLevel?: 'none' | 'silver' | 'gold' | 'platinum'
  totalStays: number
  totalSpent: number
  createdAt: string
  avatar?: string
}

export interface GuestPreferences {
  roomType?: RoomType
  floor?: 'high' | 'low' | 'any'
  bedType?: 'king' | 'queen' | 'twin'
  smoking?: boolean
  pillowType?: 'soft' | 'firm'
  dietaryRestrictions?: string[]
  specialRequests?: string
}

// ========================
// Booking Types
// ========================
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'checked_in' | 'checked_out' | 'no_show'
export type BookingSource = 'website' | 'mobile_app' | 'walk_in' | 'phone' | 'ota' | 'corporate' | 'travel_agent'

export interface Booking {
  id: string
  bookingNumber: string
  guestId: string
  guest?: Guest
  roomId?: string
  room?: Room
  roomType: RoomType
  checkInDate: string
  checkOutDate: string
  nights: number
  adults: number
  children: number
  status: BookingStatus
  source: BookingSource
  roomRate: number
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  specialRequests?: string
  createdAt: string
  updatedAt: string
}

// ========================
// Folio / Billing Types
// ========================
export type ChargeCategory = 'room' | 'restaurant' | 'room_service' | 'laundry' | 'spa' | 'transportation' | 'minibar' | 'telephone' | 'other'
export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'city_ledger' | 'online'
export type FolioWindow = 1 | 2 | 3 | 4

export interface FolioCharge {
  id: string
  folioId: string
  window: FolioWindow
  date: string
  description: string
  category: ChargeCategory
  amount: number
  quantity: number
  total: number
  isVoid: boolean
  voidReason?: string
  postedBy: string
  postedAt: string
}

export interface FolioPayment {
  id: string
  folioId: string
  date: string
  method: PaymentMethod
  amount: number
  reference?: string
  postedBy: string
}

export interface Folio {
  id: string
  bookingId: string
  guestId: string
  charges: FolioCharge[]
  payments: FolioPayment[]
  totalCharges: number
  totalPayments: number
  balance: number
}

// ========================
// Employee Types
// ========================
export type Department = 'front_office' | 'housekeeping' | 'food_beverage' | 'maintenance' | 'security' | 'hr' | 'finance' | 'management'
export type EmploymentStatus = 'active' | 'on_leave' | 'terminated' | 'suspended'
export type ShiftType = 'morning' | 'afternoon' | 'night'

export interface Employee {
  id: string
  employeeNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: Department
  designation: string
  shift: ShiftType
  managerId?: string
  joiningDate: string
  status: EmploymentStatus
  avatar?: string
}

export interface Attendance {
  id: string
  employeeId: string
  date: string
  checkIn?: string
  checkOut?: string
  workingHours?: number
  isLate: boolean
  overtime?: number
  status: 'present' | 'absent' | 'on_leave' | 'half_day'
}

// ========================
// Housekeeping Types
// ========================
export type HousekeepingTaskStatus = 'pending' | 'in_progress' | 'completed' | 'inspected'
export type HousekeepingPriority = 'urgent' | 'high' | 'normal' | 'low'

export interface HousekeepingTask {
  id: string
  roomId: string
  room?: Room
  assignedTo?: string
  assignee?: Employee
  status: HousekeepingTaskStatus
  priority: HousekeepingPriority
  type: 'checkout_clean' | 'stay_over' | 'deep_clean' | 'turn_down'
  notes?: string
  startedAt?: string
  completedAt?: string
  inspectedBy?: string
  inspectedAt?: string
  createdAt: string
}

// ========================
// Maintenance Types
// ========================
export type MaintenanceTicketStatus = 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
export type MaintenancePriority = 'critical' | 'high' | 'medium' | 'low'
export type MaintenanceCategory = 'ac' | 'electrical' | 'plumbing' | 'tv' | 'wifi' | 'furniture' | 'other'

export interface MaintenanceTicket {
  id: string
  roomId?: string
  room?: Room
  category: MaintenanceCategory
  description: string
  priority: MaintenancePriority
  status: MaintenanceTicketStatus
  reportedBy: string
  assignedTo?: string
  assignee?: Employee
  images?: string[]
  resolution?: string
  createdAt: string
  resolvedAt?: string
  closedAt?: string
}

// ========================
// Restaurant / F&B Types
// ========================
export type OrderStatus = 'new' | 'preparing' | 'ready' | 'served' | 'billed'

export interface MenuItem {
  id: string
  name: string
  category: 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'snacks' | 'room_service'
  price: number
  available: boolean
  description?: string
}

export interface RestaurantOrder {
  id: string
  bookingId?: string
  guestId?: string
  roomNumber?: string
  items: OrderItem[]
  status: OrderStatus
  totalAmount: number
  isRoomCharge: boolean
  createdAt: string
}

export interface OrderItem {
  menuItemId: string
  name: string
  quantity: number
  price: number
  total: number
  notes?: string
}

// ========================
// Inventory Types
// ========================
export interface InventoryItem {
  id: string
  name: string
  category: string
  unit: string
  currentStock: number
  reorderLevel: number
  lastPurchasePrice: number
  supplierId?: string
  supplier?: Supplier
}

export interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  products: string[]
  totalPurchaseAmount: number
  pendingPayments: number
}

// ========================
// Notification Types
// ========================
export type NotificationType = 'booking' | 'checkin' | 'checkout' | 'payment' | 'maintenance' | 'housekeeping' | 'inventory' | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  userId: string
  createdAt: string
  actionUrl?: string
}

// ========================
// Dashboard / KPI Types
// ========================
export interface DashboardKPIs {
  occupancyRate: number
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
  maintenanceRooms: number
  todayRevenue: number
  monthRevenue: number
  yearRevenue: number
  adr: number
  revpar: number
  todayCheckIns: number
  todayCheckOuts: number
  todayBookings: number
  pendingArrivals: number
  totalGuests: number
  totalEmployees: number
  presentToday: number
  onLeave: number
  absent: number
  openMaintenanceTickets: number
  cancelledBookings: number
  cancellationRate: number
}

export interface RevenueData {
  date: string
  room: number
  restaurant: number
  services: number
  other: number
  total: number
}

export interface BookingSourceData {
  source: BookingSource
  count: number
  percentage: number
}

export interface OccupancyData {
  date: string
  occupancy: number
  available: number
  maintenance: number
}

// ========================
// User / Auth Types
// ========================
export type UserRole = 'ceo' | 'admin' | 'manager' | 'receptionist' | 'housekeeping' | 'maintenance_staff' | 'restaurant_staff' | 'hr' | 'accountant'

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  avatar?: string
  department?: Department
  permissions: string[]
  lastLogin?: string
}

// ========================
// Feedback Types
// ========================
export interface Feedback {
  id: string
  guestId: string
  bookingId: string
  overallRating: number
  roomCleanliness: number
  staffBehavior: number
  foodQuality: number
  serviceQuality: number
  checkInExperience: number
  checkOutExperience: number
  comments?: string
  createdAt: string
}

// ========================
// API / Common Types
// ========================
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

export interface DateRange {
  from: Date
  to: Date
}

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: string
  direction: SortDirection
}
