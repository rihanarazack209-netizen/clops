import React, { createContext, useContext, useState, useEffect } from 'react'
import type {
  Room,
  Guest,
  Booking,
  Folio,
  FolioCharge,
  HousekeepingTask,
  MaintenanceTicket,
  MenuItem,
  Employee,
  InventoryItem,
  RoomStatus,
} from '@/types'
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
} from '@/mocks/data/hotelData'

export interface ActivityLog {
  id: string
  title: string
  time: string
  location: string
  type: 'checkin' | 'checkout' | 'room_move' | 'maintenance' | 'housekeeping' | 'fnb' | 'payment'
}

interface HotelContextType {
  // State
  hotelName: string
  setHotelName: (name: string) => void
  businessDate: string
  rooms: Room[]
  guests: Guest[]
  bookings: Booking[]
  folios: Folio[]
  housekeepingTasks: HousekeepingTask[]
  maintenanceTickets: MaintenanceTicket[]
  menuItems: MenuItem[]
  employees: Employee[]
  inventory: InventoryItem[]
  activities: ActivityLog[]
  todayRevenue: number

  // Computed metrics
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
  dirtyRooms: number
  oooRooms: number
  occupancyRate: number
  arrivalsTodayCount: number
  departuresTodayCount: number

  // Interconnected actions
  checkInGuest: (bookingId: string, roomNumber: string) => void
  checkOutGuest: (bookingId: string) => void
  createBooking: (newBooking: Partial<Booking>, guestDetails?: Partial<Guest>) => Booking
  postFnbChargeToRoom: (roomNumber: string, items: { name: string; quantity: number; price: number }[], grandTotal: number) => boolean
  postFolioCharge: (folioId: string, window: 1 | 2 | 3 | 4, description: string, category: any, amount: number) => void
  voidFolioCharge: (folioId: string, chargeId: string, reason: string) => void
  updateRoomHousekeepingStatus: (roomId: string, status: RoomStatus) => void
  createMaintenanceTicket: (ticket: Partial<MaintenanceTicket>, roomNumber?: string) => void
  resolveMaintenanceTicket: (ticketId: string) => void
  completeHousekeepingClean: (taskId: string) => void
  releaseInspectedRoom: (taskId: string, roomId?: string) => void
  runNightAuditRollover: () => void
  resetAllData: () => void
}

const STORAGE_KEY = 'cognivex_hotel_pms_data_v1'

const HotelContext = createContext<HotelContextType | undefined>(undefined)

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or mock defaults
  const [hotelName, setHotelName] = useState('Grand Plaza Hotel')
  const [businessDate, setBusinessDate] = useState('20 Oct 2026')
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const [guests, setGuests] = useState<Guest[]>(mockGuests)
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [folios, setFolios] = useState<Folio[]>(mockFolios)
  const [housekeepingTasks, setHousekeepingTasks] = useState<HousekeepingTask[]>(mockHousekeepingTasks)
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(mockMaintenanceTickets)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems)
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [todayRevenue, setTodayRevenue] = useState(245320)

  const [activities, setActivities] = useState<ActivityLog[]>([
    { id: '1', title: 'Check-in #45872', time: '09:15 AM', location: 'Room 101', type: 'checkin' },
    { id: '2', title: 'Room Change #45871', time: '08:50 AM', location: 'Room 212', type: 'room_move' },
    { id: '3', title: 'Maintenance Request', time: '08:30 AM', location: 'AC Issue', type: 'maintenance' },
    { id: '4', title: 'Housekeeping Update', time: '08:20 AM', location: 'Room 305', type: 'housekeeping' },
  ])

  // Computed live metrics
  const totalRooms = rooms.length
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length
  const availableRooms = rooms.filter((r) => r.status === 'available' || r.status === 'inspected').length
  const dirtyRooms = rooms.filter((r) => r.status === 'dirty' || r.status === 'cleaning').length
  const oooRooms = rooms.filter((r) => r.status === 'maintenance' || r.status === 'ooo' || r.status === 'oos').length
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

  const arrivalsTodayCount = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length
  const departuresTodayCount = bookings.filter((b) => b.status === 'checked_in').length

  // Helper to log activities
  const logActivity = (title: string, location: string, type: ActivityLog['type']) => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      title,
      time: timeStr,
      location,
      type,
    }
    setActivities((prev) => [newAct, ...prev.slice(0, 7)])
  }

  // 1. Interconnected Check-In Action
  const checkInGuest = (bookingId: string, roomNumber: string) => {
    const booking = bookings.find((b) => b.id === bookingId)
    const targetRoom = rooms.find((r) => r.roomNumber === roomNumber)

    if (!booking || !targetRoom) return

    // A. Update Booking status to checked_in
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'checked_in', roomId: targetRoom.id, updatedAt: new Date().toISOString() }
          : b
      )
    )

    // B. Update Room to occupied
    setRooms((prev) =>
      prev.map((r) =>
        r.id === targetRoom.id
          ? {
              ...r,
              status: 'occupied',
              currentGuestId: booking.guestId,
              currentBookingId: booking.id,
            }
          : r
      )
    )

    // C. Activate / Ensure a Folio exists for this booking
    setFolios((prev) => {
      const exists = prev.find((f) => f.bookingId === bookingId)
      if (exists) return prev

      const newFolio: Folio = {
        id: `fol-${Date.now()}`,
        bookingId: booking.id,
        guestId: booking.guestId,
        totalCharges: booking.totalAmount,
        totalPayments: booking.paidAmount,
        balance: booking.balanceAmount,
        charges: [
          {
            id: `ch-init-${Date.now()}`,
            folioId: `fol-${Date.now()}`,
            window: 1,
            date: new Date().toISOString().slice(0, 10),
            description: `Room Accommodation (${targetRoom.type.toUpperCase()} Room ${targetRoom.roomNumber})`,
            category: 'room',
            amount: booking.totalAmount,
            quantity: 1,
            total: booking.totalAmount,
            isVoid: false,
            postedBy: 'Front Desk Check-in',
            postedAt: new Date().toISOString(),
          },
        ],
        payments: booking.paidAmount > 0 ? [
          {
            id: `pay-init-${Date.now()}`,
            folioId: `fol-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            method: 'credit_card',
            amount: booking.paidAmount,
            reference: 'PREAUTH-GUARANTEE',
            postedBy: 'Front Desk Terminal',
          }
        ] : [],
      }
      return [newFolio, ...prev]
    })

    // D. Log Activity
    const guest = guests.find((g) => g.id === booking.guestId)
    const guestName = guest ? `${guest.firstName} ${guest.lastName}` : 'Guest'
    logActivity(`Check-in: ${guestName}`, `Room ${targetRoom.roomNumber}`, 'checkin')
  }

  // 2. Interconnected Check-Out Action
  const checkOutGuest = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId)
    if (!booking) return

    const targetRoom = rooms.find((r) => r.id === booking.roomId)

    // A. Update Booking status to checked_out
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: 'checked_out', updatedAt: new Date().toISOString() } : b
      )
    )

    // B. Mark Room Dirty
    if (targetRoom) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === targetRoom.id
            ? { ...r, status: 'dirty', currentGuestId: undefined, currentBookingId: undefined }
            : r
        )
      )

      // C. Auto-create Housekeeping Task with Urgent Priority
      const newTask: HousekeepingTask = {
        id: `hk-checkout-${Date.now()}`,
        roomId: targetRoom.id,
        status: 'pending',
        priority: 'urgent',
        type: 'checkout_clean',
        notes: `Departure clean for next arrival (Room ${targetRoom.roomNumber})`,
        createdAt: new Date().toISOString(),
      }
      setHousekeepingTasks((prev) => [newTask, ...prev])

      logActivity(`Check-out completed`, `Room ${targetRoom.roomNumber}`, 'checkout')
    }
  }

  // 3. Interconnected Restaurant F&B Charge to Room
  const postFnbChargeToRoom = (
    roomNumber: string,
    items: { name: string; quantity: number; price: number }[],
    grandTotal: number
  ): boolean => {
    const targetRoom = rooms.find((r) => r.roomNumber === roomNumber)
    if (!targetRoom || targetRoom.status !== 'occupied') return false

    // Find active folio for room
    const targetFolio = folios.find((f) => f.bookingId === targetRoom.currentBookingId) || folios[0]

    const itemDesc = items.map((i) => `${i.quantity}x ${i.name}`).join(', ')
    const newCharge: FolioCharge = {
      id: `fnb-${Date.now()}`,
      folioId: targetFolio.id,
      window: 1, // Window 1 (Guest personal)
      date: new Date().toISOString().slice(0, 10),
      description: `Al Mourjan Restaurant: ${itemDesc}`,
      category: 'restaurant',
      amount: grandTotal,
      quantity: 1,
      total: grandTotal,
      isVoid: false,
      postedBy: 'F&B POS Terminal 1',
      postedAt: new Date().toISOString(),
    }

    setFolios((prev) =>
      prev.map((f) =>
        f.id === targetFolio.id
          ? {
              ...f,
              charges: [...f.charges, newCharge],
              totalCharges: f.totalCharges + grandTotal,
              balance: f.balance + grandTotal,
            }
          : f
      )
    )

    // Increment today's gross revenue
    setTodayRevenue((prev) => prev + grandTotal)

    logActivity(`F&B Order (QAR ${grandTotal.toFixed(0)})`, `Room ${roomNumber}`, 'fnb')
    return true
  }

  // 4. Folio Manual Post
  const postFolioCharge = (
    folioId: string,
    window: 1 | 2 | 3 | 4,
    description: string,
    category: any,
    amount: number
  ) => {
    const newCharge: FolioCharge = {
      id: `ch-manual-${Date.now()}`,
      folioId,
      window,
      date: new Date().toISOString().slice(0, 10),
      description,
      category,
      amount,
      quantity: 1,
      total: amount,
      isVoid: false,
      postedBy: 'Cashier Terminal',
      postedAt: new Date().toISOString(),
    }

    setFolios((prev) =>
      prev.map((f) =>
        f.id === folioId
          ? {
              ...f,
              charges: [...f.charges, newCharge],
              totalCharges: f.totalCharges + amount,
              balance: f.balance + amount,
            }
          : f
      )
    )

    setTodayRevenue((prev) => prev + amount)
  }

  // 5. Folio Void / Reversal
  const voidFolioCharge = (folioId: string, chargeId: string, reason: string) => {
    setFolios((prev) =>
      prev.map((f) => {
        if (f.id !== folioId) return f
        const targetCharge = f.charges.find((c) => c.id === chargeId)
        if (!targetCharge) return f

        return {
          ...f,
          charges: f.charges.map((c) => (c.id === chargeId ? { ...c, isVoid: true, voidReason: reason } : c)),
          totalCharges: f.totalCharges - targetCharge.total,
          balance: f.balance - targetCharge.total,
        }
      })
    )
  }

  // 6. Housekeeping Workflow
  const updateRoomHousekeepingStatus = (roomId: string, status: RoomStatus) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, status } : r)))
    const targetRoom = rooms.find((r) => r.id === roomId)
    if (targetRoom) {
      logActivity(`Housekeeping: ${status.toUpperCase()}`, `Room ${targetRoom.roomNumber}`, 'housekeeping')
    }
  }

  const completeHousekeepingClean = (taskId: string) => {
    setHousekeepingTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: 'completed', completedAt: new Date().toISOString() } : t
      )
    )
  }

  const releaseInspectedRoom = (taskId: string, roomId?: string) => {
    setHousekeepingTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'inspected', inspectedAt: new Date().toISOString(), inspectedBy: 'Supervisor' }
          : t
      )
    )
    if (roomId) {
      setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, status: 'inspected' } : r)))
      const room = rooms.find((r) => r.id === roomId)
      if (room) {
        logActivity(`Room Inspected & Released`, `Room ${room.roomNumber}`, 'housekeeping')
      }
    }
  }

  // 7. Maintenance Workflow
  const createMaintenanceTicket = (ticket: Partial<MaintenanceTicket>, roomNumber?: string) => {
    const targetRoom = roomNumber ? rooms.find((r) => r.roomNumber === roomNumber) : undefined

    const newTicket: MaintenanceTicket = {
      id: `mnt-${Date.now()}`,
      roomId: targetRoom?.id,
      category: ticket.category || 'ac',
      description: ticket.description || 'Equipment fault',
      priority: ticket.priority || 'high',
      status: 'open',
      reportedBy: 'Front Desk / Staff',
      createdAt: new Date().toISOString(),
    }

    setMaintenanceTickets((prev) => [newTicket, ...prev])

    // If critical priority, set Room to OOO
    if (targetRoom && (ticket.priority === 'critical' || ticket.priority === 'high')) {
      setRooms((prev) =>
        prev.map((r) => (r.id === targetRoom.id ? { ...r, status: 'maintenance', notes: ticket.description } : r))
      )
    }

    logActivity(`Maintenance: ${ticket.category?.toUpperCase()}`, targetRoom ? `Room ${targetRoom.roomNumber}` : 'Public Area', 'maintenance')
  }

  const resolveMaintenanceTicket = (ticketId: string) => {
    setMaintenanceTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t
        // If room was blocked, restore it to dirty for cleaning inspection
        if (t.roomId) {
          setRooms((rPrev) =>
            rPrev.map((r) => (r.id === t.roomId ? { ...r, status: 'dirty', notes: undefined } : r))
          )
        }
        return { ...t, status: 'resolved', resolvedAt: new Date().toISOString() }
      })
    )
  }

  // 8. Create Reservation
  const createBooking = (newBookingData: Partial<Booking>, guestDetails?: Partial<Guest>): Booking => {
    const newGuest: Guest = {
      id: `g-${Date.now()}`,
      firstName: guestDetails?.firstName || 'New',
      lastName: guestDetails?.lastName || 'Guest',
      email: guestDetails?.email || 'guest@example.com',
      phone: guestDetails?.phone || '+974 5500 0000',
      nationality: guestDetails?.nationality || 'Qatari',
      country: guestDetails?.country || 'Qatar',
      governmentIdType: guestDetails?.governmentIdType || 'qid',
      governmentIdNumber: guestDetails?.governmentIdNumber || `28${Math.floor(Math.random() * 900000000)}`,
      dateOfBirth: '1990-01-01',
      totalStays: 1,
      totalSpent: newBookingData.totalAmount || 1200,
      createdAt: new Date().toISOString(),
    }
    setGuests((prev) => [newGuest, ...prev])

    const createdBooking: Booking = {
      id: `b-${Date.now()}`,
      bookingNumber: `HMS${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 900 + 100)}`,
      guestId: newGuest.id,
      roomType: newBookingData.roomType || 'standard',
      checkInDate: newBookingData.checkInDate || new Date().toISOString().slice(0, 10),
      checkOutDate: newBookingData.checkOutDate || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      nights: newBookingData.nights || 1,
      adults: newBookingData.adults || 1,
      children: newBookingData.children || 0,
      status: 'confirmed',
      source: newBookingData.source || 'website',
      roomRate: newBookingData.roomRate || 450,
      totalAmount: (newBookingData.roomRate || 450) * (newBookingData.nights || 1),
      paidAmount: (newBookingData.roomRate || 450) * (newBookingData.nights || 1),
      balanceAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...newBookingData,
    } as Booking

    setBookings((prev) => [createdBooking, ...prev])
    logActivity(`New Booking: ${newGuest.firstName} ${newGuest.lastName}`, createdBooking.bookingNumber, 'checkin')
    return createdBooking
  }

  // 9. Night Audit Rollover
  const runNightAuditRollover = () => {
    // A. Post nightly room charge to all occupied rooms
    const inHouseBookings = bookings.filter((b) => b.status === 'checked_in')
    inHouseBookings.forEach((b) => {
      const folio = folios.find((f) => f.bookingId === b.id)
      if (folio) {
        postFolioCharge(folio.id, 1, `Night Audit Room Rate (${b.roomType.toUpperCase()})`, 'room', b.roomRate)
      }
    })

    // B. Advance business date
    setBusinessDate('21 Oct 2026')
    logActivity('Night Audit Complete', 'Business Date Advanced', 'payment')
  }

  const resetAllData = () => {
    setRooms(mockRooms)
    setGuests(mockGuests)
    setBookings(mockBookings)
    setFolios(mockFolios)
    setHousekeepingTasks(mockHousekeepingTasks)
    setMaintenanceTickets(mockMaintenanceTickets)
    setTodayRevenue(245320)
    setBusinessDate('20 Oct 2026')
  }

  return (
    <HotelContext.Provider
      value={{
        hotelName,
        setHotelName,
        businessDate,
        rooms,
        guests,
        bookings,
        folios,
        housekeepingTasks,
        maintenanceTickets,
        menuItems,
        employees,
        inventory,
        activities,
        todayRevenue,
        totalRooms,
        occupiedRooms,
        availableRooms,
        dirtyRooms,
        oooRooms,
        occupancyRate,
        arrivalsTodayCount,
        departuresTodayCount,
        checkInGuest,
        checkOutGuest,
        createBooking,
        postFnbChargeToRoom,
        postFolioCharge,
        voidFolioCharge,
        updateRoomHousekeepingStatus,
        createMaintenanceTicket,
        resolveMaintenanceTicket,
        completeHousekeepingClean,
        releaseInspectedRoom,
        runNightAuditRollover,
        resetAllData,
      }}
    >
      {children}
    </HotelContext.Provider>
  )
}

export const useHotel = () => {
  const context = useContext(HotelContext)
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider')
  }
  return context
}
