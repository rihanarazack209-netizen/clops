import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enCommon from './en/common.json'
import enDashboard from './en/dashboard.json'
import enRooms from './en/rooms.json'
import arCommon from './ar/common.json'
import arDashboard from './ar/dashboard.json'
import arRooms from './ar/rooms.json'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      dashboard: enDashboard,
      rooms: enRooms,
    },
    ar: {
      common: arCommon,
      dashboard: arDashboard,
      rooms: arRooms,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
