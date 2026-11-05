import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const COUNTRY_CODES = [
  { code: '+91', country: 'India 🇮🇳', example: '98765 43210' },
  { code: '+974', country: 'Qatar 🇶🇦', example: '5512 3456' },
  { code: '+971', country: 'UAE 🇦🇪', example: '50 123 4567' },
  { code: '+966', country: 'Saudi Arabia 🇸🇦', example: '50 123 4567' },
  { code: '+44', country: 'UK 🇬🇧', example: '7700 900123' },
  { code: '+1', country: 'USA / Canada 🇺🇸', example: '202 555 0123' },
  { code: '+65', country: 'Singapore 🇸🇬', example: '8123 4567' },
  { code: '+49', country: 'Germany 🇩🇪', example: '151 23456789' },
]

export function SignUpPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [hotelName, setHotelName] = useState('')
  const [propertyType, setPropertyType] = useState('luxury_hotel')
  const [roomCount, setRoomCount] = useState('100-300')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const activeCountry = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0]

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.')
      return
    }

    if (!agreed) {
      setError('You must agree to the Terms of Service and Privacy Policy.')
      return
    }

    const fullPhone = `${countryCode} ${phoneNumber.trim()}`

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Navigate to verification page with email & international phone state
      navigate('/verify', {
        state: {
          email: email || 'manager@grandplaza.qa',
          phone: fullPhone || '+91 98765 43210',
          hotelName: hotelName || 'Grand Plaza Hotel',
        },
      })
    }, 700)
  }

  return (
    <div className="min-h-screen bg-[#0c1421] text-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient hotel glow & texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c1421] via-[#0c1421]/90 to-[#0c1421]/80" />

      <div className="relative z-10 w-full max-w-xl bg-white text-gray-900 rounded-3xl shadow-2xl p-7 sm:p-9 border border-gray-100 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="flex items-end gap-0.5 text-[#e5b54f]">
              <span className="w-1.5 h-3 bg-[#e5b54f] rounded-t-sm" />
              <span className="w-1.5 h-5 bg-[#e5b54f] rounded-t-sm" />
              <span className="w-1.5 h-7 bg-[#e5b54f] rounded-t-sm" />
              <span className="w-1.5 h-5 bg-[#e5b54f] rounded-t-sm" />
              <span className="w-1.5 h-3 bg-[#e5b54f] rounded-t-sm" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Cognivex</h1>
          </div>
          <p className="text-xs font-semibold text-[#b88c3a] uppercase tracking-wider">
            Property Registration & Onboarding
          </p>
          <p className="text-xs text-gray-500">
            Deploy your hotel onto Cognivex Next-Gen Cloud PMS (Supports India, GCC & Global)
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4 text-xs">
          {/* Row 1: Manager Name & Work Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-gray-700 uppercase block mb-1">General Manager / Contact</label>
              <Input
                required
                placeholder="e.g. Rahul Sharma / Ahmed Al Thani"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<User className="h-4 w-4" />}
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 uppercase block mb-1">Official Work Email</label>
              <Input
                type="email"
                required
                placeholder="manager@hotel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Row 2: Hotel Name & Mobile (WhatsApp OTP with Country Code Selector) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-gray-700 uppercase block mb-1">Hotel / Property Name</label>
              <Input
                required
                placeholder="e.g. Royal Orchid Grand Palace"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                icon={<Building2 className="h-4 w-4" />}
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 uppercase block mb-1">
                Mobile / WhatsApp (India / International)
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-32 rounded-lg border border-gray-300 px-2 py-2 text-xs font-semibold bg-gray-50 text-gray-800 focus:outline-none focus:border-[#ba934f] focus:bg-white"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.country.split(' ')[0]})
                    </option>
                  ))}
                </select>
                <div className="flex-1">
                  <Input
                    type="tel"
                    required
                    placeholder={activeCountry.example}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    icon={<Phone className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Property Type & Room Inventory Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-gray-700 uppercase block mb-1">Property Classification</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-xs font-medium bg-white focus:outline-none focus:border-blue-600"
              >
                <option value="luxury_hotel">5-Star Luxury Hotel & Resort</option>
                <option value="business_hotel">4-Star Business Hotel</option>
                <option value="heritage_palace">Heritage Palace / Boutique Resort</option>
                <option value="serviced_apartments">Serviced Apartments & Suites</option>
                <option value="budget_chain">Midscale / Express Hotel</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-700 uppercase block mb-1">Total Room Inventory</label>
              <select
                value={roomCount}
                onChange={(e) => setRoomCount(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-xs font-medium bg-white focus:outline-none focus:border-blue-600"
              >
                <option value="20-50">20 – 50 Rooms</option>
                <option value="50-100">51 – 100 Rooms</option>
                <option value="100-300">101 – 300 Rooms</option>
                <option value="300-500">301 – 500+ Rooms</option>
              </select>
            </div>
          </div>

          {/* Row 4: Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-gray-700 uppercase block mb-1">Master Password</label>
              <Input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 uppercase block mb-1">Confirm Password</label>
              <Input
                type="password"
                required
                placeholder="Re-type password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-gray-600">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="leading-snug">
                I agree to the <span className="text-blue-600 font-semibold">Terms of Service</span> and acknowledge compliance with international hospitality data security standards (ISO 27001 &amp; DPDP / PDPPL).
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-[#9e763a] to-[#ba934f] hover:from-[#8d6932] hover:to-[#a88241] text-white font-bold text-sm gap-2 shadow-md mt-2"
          >
            <span>{loading ? 'Registering Property...' : 'Continue to Security Verification'}</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </form>

        {/* Footer Link to Login */}
        <div className="pt-3 border-t border-gray-100 text-center text-xs text-gray-500 flex items-center justify-between">
          <Link to="/guest-portal" className="text-[#9e763a] font-bold hover:underline flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Are you an in-house hotel guest? Log In here</span>
          </Link>
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Sign In to Terminal
          </Link>
        </div>
      </div>
    </div>
  )
}
