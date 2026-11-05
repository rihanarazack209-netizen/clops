import {
  mockRooms,
  mockGuests,
  mockBookings,
  mockFolios,
  mockHousekeepingTasks,
  mockMaintenanceTickets,
  mockMenuItems,
  mockEmployees,
  mockInventory,
  mockDashboardKPIs,
  mockRevenueTrend,
  mockBookingSources,
} from '@/mocks/data/hotelData'
import type {
  Room,
  Guest,
  Booking,
  Folio,
  HousekeepingTask,
  MaintenanceTicket,
  MenuItem,
  Employee,
  InventoryItem,
  DashboardKPIs,
  RevenueData,
  BookingSourceData,
} from '@/types'

// Simulated network latency for realistic UX state testing (loading/error/empty)
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

export const pmsApi = {
  // Dashboard & Analytics
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    await delay()
    return { ...mockDashboardKPIs }
  },

  async getRevenueTrend(): Promise<RevenueData[]> {
    await delay()
    return [...mockRevenueTrend]
  },

  async getBookingSources(): Promise<BookingSourceData[]> {
    await delay()
    return [...mockBookingSources]
  },

  // Rooms
  async getRooms(): Promise<Room[]> {
    await delay()
    return [...mockRooms]
  },

  async updateRoomStatus(roomId: string, status: Room['status']): Promise<Room> {
    await delay(100)
    const room = mockRooms.find((r) => r.id === roomId)
    if (!room) throw new Error('Room not found')
    room.status = status
    return { ...room }
  },

  // Guests
  async getGuests(): Promise<Guest[]> {
    await delay()
    return [...mockGuests]
  },

  async getGuestById(id: string): Promise<Guest | undefined> {
    await delay(80)
    return mockGuests.find((g) => g.id === id)
  },

  // Reservations
  async getBookings(): Promise<Booking[]> {
    await delay()
    return [...mockBookings]
  },

  async createBooking(booking: Partial<Booking>): Promise<Booking> {
    await delay(200)
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      bookingNumber: `HMS${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 900 + 100)}`,
      guestId: booking.guestId || 'g-001',
      roomType: booking.roomType || 'standard',
      checkInDate: booking.checkInDate || new Date().toISOString().slice(0, 10),
      checkOutDate: booking.checkOutDate || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      nights: booking.nights || 1,
      adults: booking.adults || 1,
      children: booking.children || 0,
      status: 'confirmed',
      source: booking.source || 'walk_in',
      roomRate: booking.roomRate || 450,
      totalAmount: (booking.roomRate || 450) * (booking.nights || 1),
      paidAmount: booking.paidAmount || 0,
      balanceAmount: (booking.roomRate || 450) * (booking.nights || 1) - (booking.paidAmount || 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...booking,
    } as Booking
    mockBookings.unshift(newBooking)
    return newBooking
  },

  // Folio & Cashiering
  async getFolios(): Promise<Folio[]> {
    await delay()
    return [...mockFolios]
  },

  async getFolioByBookingId(bookingId: string): Promise<Folio | undefined> {
    await delay(100)
    return mockFolios.find((f) => f.bookingId === bookingId)
  },

  // Housekeeping
  async getHousekeepingTasks(): Promise<HousekeepingTask[]> {
    await delay()
    return [...mockHousekeepingTasks]
  },

  // Maintenance
  async getMaintenanceTickets(): Promise<MaintenanceTicket[]> {
    await delay()
    return [...mockMaintenanceTickets]
  },

  // Restaurant
  async getMenuItems(): Promise<MenuItem[]> {
    await delay()
    return [...mockMenuItems]
  },

  // Employees
  async getEmployees(): Promise<Employee[]> {
    await delay()
    return [...mockEmployees]
  },

  // Inventory
  async getInventory(): Promise<InventoryItem[]> {
    await delay()
    return [...mockInventory]
  },
}
