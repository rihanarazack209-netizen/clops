import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BedDouble,
  CalendarCheck,
  LogOut,
  Coins,
  Sun,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Bed,
  Wrench,
  Sparkles,
  ChevronDown,
  ArrowRight,
  User,
  UtensilsCrossed,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'
import { useHotel } from '@/context/HotelContext'
import { formatCurrency } from '@/lib/utils'

export function CEODashboard() {
  const { t } = useTranslation('dashboard')
  const [performanceRange, setPerformanceRange] = useState(t('periods.last7days'))
  const {
    hotelName,
    businessDate,
    totalRooms,
    occupiedRooms,
    availableRooms,
    dirtyRooms,
    oooRooms,
    occupancyRate,
    arrivalsTodayCount,
    departuresTodayCount,
    todayRevenue,
    activities,
    bookings,
    guests,
    rooms,
  } = useHotel()

  // Sparklines
  const occupancySparkline = [
    { v: 84 }, { v: 86 }, { v: 85 }, { v: 89 }, { v: 88 }, { v: 91 }, { v: occupancyRate },
  ]
  const arrivalsSparkline = [
    { v: 95 }, { v: 102 }, { v: 98 }, { v: 110 }, { v: 114 }, { v: 112 }, { v: arrivalsTodayCount },
  ]
  const departuresSparkline = [
    { v: 90 }, { v: 94 }, { v: 105 }, { v: 102 }, { v: 112 }, { v: 110 }, { v: departuresTodayCount },
  ]
  const revenueSparkline = [
    { v: 195000 }, { v: 210000 }, { v: 205000 }, { v: 228000 }, { v: 235000 }, { v: 240000 }, { v: todayRevenue },
  ]

  // Combo bar + line data for Hotel Performance
  const performanceData = [
    { day: 'Mon', occupancy: 78, adr: 710 },
    { day: 'Tue', occupancy: 82, adr: 730 },
    { day: 'Wed', occupancy: 85, adr: 750 },
    { day: 'Thu', occupancy: 88, adr: 780 },
    { day: 'Fri', occupancy: 91, adr: 810 },
    { day: 'Sat', occupancy: 93, adr: 830 },
    { day: 'Sun', occupancy: occupancyRate, adr: 825 },
  ]

  // Donut data for Room Status
  const roomStatusData = [
    {
      name: t('roomStatusLabels.available'),
      value: availableRooms,
      percentage: totalRooms > 0 ? `${Math.round((availableRooms / totalRooms) * 100)}%` : '0%',
      color: '#10b981',
    },
    {
      name: t('roomStatusLabels.occupied'),
      value: occupiedRooms,
      percentage: totalRooms > 0 ? `${Math.round((occupiedRooms / totalRooms) * 100)}%` : '0%',
      color: '#2563eb',
    },
    {
      name: t('roomStatusLabels.dirty'),
      value: dirtyRooms,
      percentage: totalRooms > 0 ? `${Math.round((dirtyRooms / totalRooms) * 100)}%` : '0%',
      color: '#f97316',
    },
    {
      name: t('roomStatusLabels.ooo'),
      value: oooRooms,
      percentage: totalRooms > 0 ? `${Math.round((oooRooms / totalRooms) * 100)}%` : '0%',
      color: '#94a3b8',
    },
  ]

  // Filter Upcoming Arrivals
  const expectedArrivals = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'pending')
    .slice(0, 4)

  // Filter Departures Today
  const expectedDepartures = bookings
    .filter((b) => b.status === 'checked_in')
    .slice(0, 4)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'checkin':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      case 'checkout':
        return <LogOut className="h-4 w-4 text-purple-600" />
      case 'fnb':
        return <UtensilsCrossed className="h-4 w-4 text-amber-600" />
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-rose-600" />
      case 'housekeeping':
        return <Sparkles className="h-4 w-4 text-teal-600" />
      default:
        return <Bed className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <div className="space-y-5">
      {/* 1. Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm min-h-[160px] flex items-center bg-[#0d1624]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1421] via-[#0c1421]/90 to-transparent w-full sm:w-[85%]" />

        <div className="relative z-10 w-full px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('greeting')}
            </h1>
            <p className="text-sm text-gray-300 mt-1 font-normal">
              {t('subgreeting', { date: businessDate, hotel: hotelName })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 text-white shadow-sm">
              <Sun className="h-6 w-6 text-amber-400 shrink-0" />
              <div>
                <p className="text-base font-extrabold leading-tight">{t('weather.temp')}</p>
                <p className="text-[11px] text-gray-200">{t('weather.location')}</p>
              </div>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 text-white shadow-sm">
              <p className="text-base font-extrabold leading-tight tracking-wide font-mono">09:24 AM</p>
              <p className="text-[11px] text-gray-200">{businessDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Occupancy Rate */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow overflow-hidden">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BedDouble className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-2xl font-black text-gray-900 tracking-tight leading-none truncate">{occupancyRate}%</p>
              <p className="text-xs text-gray-500 font-medium mt-1 truncate">
                {t('kpi.occupancyDetail', { occupied: occupiedRooms, total: totalRooms })}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2">
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 truncate">
              {t('trends.vsYesterday')}
            </span>
            <div className="h-8 w-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancySparkline}>
                  <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPI 2: Arrivals Today */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow overflow-hidden">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-2xl font-black text-gray-900 tracking-tight leading-none">{arrivalsTodayCount}</p>
              <p className="text-xs text-gray-500 font-medium mt-1 truncate">{t('kpi.arrivals')}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2">
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 truncate">
              {t('trends.pickup')}
            </span>
            <div className="h-8 w-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={arrivalsSparkline}>
                  <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPI 3: Departures Today */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow overflow-hidden">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <LogOut className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-2xl font-black text-gray-900 tracking-tight leading-none">{departuresTodayCount}</p>
              <p className="text-xs text-gray-500 font-medium mt-1 truncate">{t('kpi.departures')}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2">
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 truncate">
              {t('trends.activeStays')}
            </span>
            <div className="h-8 w-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={departuresSparkline}>
                  <Area type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPI 4: Revenue Today */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow overflow-hidden">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Coins className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-black text-gray-900 tracking-tight leading-none truncate">
                {formatCurrency(todayRevenue)}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1 truncate">{t('kpi.revenue')}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2">
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 truncate">
              {t('trends.liveConnected')}
            </span>
            <div className="h-8 w-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSparkline}>
                  <Area type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} fill="#f59e0b" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hotel Performance */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">{t('sections.hotelPerformance')}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg font-medium cursor-pointer">
              <span>{performanceRange}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
                <Tooltip
                  formatter={(val: number, name: string) => [name === 'occupancy' ? `${val}%` : `QAR ${val}`, name === 'occupancy' ? 'Occupancy' : 'ADR']}
                  contentStyle={{ borderRadius: '10px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="occupancy" fill="#0f2b48" radius={[4, 4, 0, 0]} barSize={26} label={{ position: 'top', fill: '#475569', fontSize: 10, formatter: (v: number) => `${v}%` }} />
                <Line type="monotone" dataKey="occupancy" stroke="#eab308" strokeWidth={2} dot={{ fill: '#eab308', r: 3 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-gray-700">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0f2b48]" />
              <span>{t('legend.occupancyPct')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <span className="h-2.5 w-2.5 rounded-full bg-[#eab308]" />
              <span>{t('legend.adr')}</span>
            </div>
          </div>
        </div>

        {/* Room Status Donut */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900">{t('sections.roomStatus')}</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
            <div className="relative h-[180px] w-[180px] shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {roomStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} rooms`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <p className="text-2xl font-black text-gray-900 leading-none">{totalRooms}</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">{t('sections.totalRooms')}</p>
              </div>
            </div>

            <div className="space-y-2.5 w-full text-xs">
              {roomStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900 font-mono">
                    {item.value} <span className="text-gray-400 font-normal">({item.percentage})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Interconnected Activity Feed */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900">{t('sections.liveActivity')}</h3>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">{t('sections.realTime')}</span>
          </div>

          <div className="space-y-3 my-auto max-h-[250px] overflow-y-auto">
            {activities.map((act) => (
              <div key={act.id} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 border bg-gray-50 border-gray-100">
                  {getActivityIcon(act.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{act.title}</p>
                  <p className="text-[11px] text-gray-400">{act.time} • {act.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Upcoming Arrivals */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">{t('sections.upcomingArrivals')}</h3>
            <a href="/front-desk" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
              <span>{t('sections.viewAll')}</span>
              <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-gray-400 font-semibold border-b border-gray-100 pb-2">
                <tr>
                  <th className="text-left rtl:text-right pb-2 font-medium">{t('table.booking')}</th>
                  <th className="text-left rtl:text-right pb-2 font-medium">{t('table.guestName')}</th>
                  <th className="text-center pb-2 font-medium">{t('table.room')}</th>
                  <th className="text-right rtl:text-left pb-2 font-medium">{t('table.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expectedArrivals.map((arr) => {
                  const guest = guests.find((g) => g.id === arr.guestId)
                  const targetRoom = rooms.find((r) => r.id === arr.roomId)

                  return (
                    <tr key={arr.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 font-mono font-bold text-blue-700 whitespace-nowrap">{arr.bookingNumber.slice(-6)}</td>
                      <td className="py-2.5 font-bold text-gray-900 whitespace-nowrap flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        <span>{guest ? `${guest.firstName} ${guest.lastName}` : 'Guest'}</span>
                      </td>
                      <td className="py-2.5 text-center font-mono font-bold text-gray-700">
                        {targetRoom ? targetRoom.roomNumber : arr.roomType.toUpperCase().slice(0, 3)}
                      </td>
                      <td className="py-2.5 text-right rtl:text-left">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                          {arr.status === 'confirmed' ? t('table.expected') : t('table.pending')}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Departures Today / In-House */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">{t('sections.inHouseGuests')}</h3>
            <a href="/front-desk" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
              <span>{t('sections.viewAll')}</span>
              <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-gray-400 font-semibold border-b border-gray-100 pb-2">
                <tr>
                  <th className="text-left rtl:text-right pb-2 font-medium">{t('table.booking')}</th>
                  <th className="text-left rtl:text-right pb-2 font-medium">{t('table.guestName')}</th>
                  <th className="text-center pb-2 font-medium">{t('table.room')}</th>
                  <th className="text-right rtl:text-left pb-2 font-medium">{t('table.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expectedDepartures.map((dep) => {
                  const guest = guests.find((g) => g.id === dep.guestId)
                  const targetRoom = rooms.find((r) => r.id === dep.roomId)

                  return (
                    <tr key={dep.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 font-mono font-bold text-blue-700 whitespace-nowrap">{dep.bookingNumber.slice(-6)}</td>
                      <td className="py-2.5 font-bold text-gray-900 whitespace-nowrap flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        <span>{guest ? `${guest.firstName} ${guest.lastName}` : 'Guest'}</span>
                      </td>
                      <td className="py-2.5 text-center font-mono font-bold text-gray-700">
                        {targetRoom ? targetRoom.roomNumber : '101'}
                      </td>
                      <td className="py-2.5 text-right rtl:text-left">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          {t('table.inHouse')}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Premium Experience Promo Card */}
        <div className="lg:col-span-4 rounded-2xl bg-[#141210] p-5 border border-amber-950/40 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div
            className="absolute inset-y-0 right-0 w-1/2 bg-cover bg-center opacity-70"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141210] via-[#141210]/95 to-transparent w-3/4" />

          <div className="relative z-10 space-y-2 max-w-[200px]">
            <h4 className="text-sm font-black text-[#e5b54f] tracking-wide">
              {t('sections.premiumExperience')}
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-normal">
              {t('sections.premiumDesc')}
            </p>
          </div>

          <div className="relative z-10 mt-4">
            <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#e5b54f] hover:bg-[#d8a43e] text-gray-900 font-bold text-xs transition-colors shadow-sm">
              <span>{t('sections.viewDetails')}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
