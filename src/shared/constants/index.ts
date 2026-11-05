export const APP_CONFIG = {
  name: 'Cognivex Hotel PMS',
  nameAr: 'كوجنيفكس لإدارة الفنادق',
  version: '1.0.0',
  defaultCurrency: 'QAR',
  currencySymbol: 'QR',
  timezone: 'Asia/Qatar',
  vatRate: 0.05,
  serviceChargeRate: 0.07,
}

export const ROOM_STATUSES = [
  { value: 'available', labelEn: 'Available', labelAr: 'متاحة', color: '#22c55e', bg: 'bg-green-100', text: 'text-green-800' },
  { value: 'occupied', labelEn: 'Occupied', labelAr: 'مشغولة', color: '#3b82f6', bg: 'bg-blue-100', text: 'text-blue-800' },
  { value: 'dirty', labelEn: 'Dirty', labelAr: 'تحتاج تنظيف', color: '#f59e0b', bg: 'bg-amber-100', text: 'text-amber-800' },
  { value: 'cleaning', labelEn: 'Cleaning', labelAr: 'قيد التنظيف', color: '#8b5cf6', bg: 'bg-purple-100', text: 'text-purple-800' },
  { value: 'inspected', labelEn: 'Inspected', labelAr: 'تم الفحص', color: '#14b8a6', bg: 'bg-teal-100', text: 'text-teal-800' },
  { value: 'maintenance', labelEn: 'Maintenance', labelAr: 'صيانة', color: '#ef4444', bg: 'bg-red-100', text: 'text-red-800' },
  { value: 'ooo', labelEn: 'Out of Order', labelAr: 'خارج الخدمة', color: '#6b7280', bg: 'bg-gray-200', text: 'text-gray-800' },
  { value: 'oos', labelEn: 'Out of Service', labelAr: 'خارج النظام', color: '#9ca3af', bg: 'bg-gray-100', text: 'text-gray-600' },
] as const

export const ROOM_TYPES = [
  { value: 'standard', labelEn: 'Standard Deluxe', labelAr: 'ديلوكس عادية', basePrice: 450, capacity: 2 },
  { value: 'deluxe', labelEn: 'Executive Deluxe', labelAr: 'ديلوكس تنفيذي', basePrice: 650, capacity: 2 },
  { value: 'suite', labelEn: 'Panoramic Suite', labelAr: 'جناح بانورامي', basePrice: 1200, capacity: 4 },
  { value: 'presidential', labelEn: 'Royal Suite', labelAr: 'الجناح الملكي', basePrice: 2800, capacity: 6 },
] as const

export const DEPARTMENTS = [
  { value: 'front_office', labelEn: 'Front Office', labelAr: 'مكتب الاستقبال' },
  { value: 'housekeeping', labelEn: 'Housekeeping', labelAr: 'التدبير المنزلي' },
  { value: 'food_beverage', labelEn: 'Food & Beverage', labelAr: 'الأغذية والمشروبات' },
  { value: 'maintenance', labelEn: 'Engineering & Maintenance', labelAr: 'الهندسة والصيانة' },
  { value: 'security', labelEn: 'Security', labelAr: 'الأمن والسلامة' },
  { value: 'finance', labelEn: 'Finance & Accounts', labelAr: 'المالية والحسابات' },
  { value: 'hr', labelEn: 'Human Resources', labelAr: 'الموارد البشرية' },
  { value: 'management', labelEn: 'Executive Management', labelAr: 'الإدارة العليا' },
] as const
