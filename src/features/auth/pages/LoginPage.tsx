import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Info,
  Eye,
  EyeOff,
  User,
  KeyRound,
  Phone,
  Sparkles,
  Bed,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const DEMO_EMAIL = 'admin@cognivexpms.qa'
const DEMO_PASSWORD = 'Admin@1234'

export function LoginPage() {
  const navigate = useNavigate()
  const [loginMode, setLoginMode] = useState<'staff' | 'guest'>('staff')

  // Staff Login State
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [showPassword, setShowPassword] = useState(false)

  // Guest Login State
  const [roomNumber, setRoomNumber] = useState('202')
  const [guestLastName, setGuestLastName] = useState('Sharma')
  const [guestPhone, setGuestPhone] = useState('+91 98765 43210')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter your work email and password.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      localStorage.setItem('auth_token', 'cognivex-demo-token')
      localStorage.setItem('cognivex_logged_in', 'true')
      navigate('/')
    }, 700)
  }

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!roomNumber.trim()) {
      setError('Please enter your allocated hotel room number.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Navigate to guest portal with state
      navigate('/guest-portal', {
        state: { roomNumber, guestLastName, guestPhone },
      })
    }, 700)
  }

  return (
    <div className="min-h-screen bg-[#0c1421] text-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient hotel glow */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c1421] via-[#0c1421]/90 to-[#0c1421]/80" />

      <div className="relative z-10 w-full max-w-md bg-white text-gray-900 rounded-3xl shadow-2xl p-7 sm:p-8 border border-gray-100 space-y-5">
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
            Enterprise Hospitality Platform
          </p>
          <div className="pt-0.5">
            <Badge variant="teal">Grand Plaza Hotel &amp; Suites</Badge>
          </div>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setLoginMode('staff')
              setError('')
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              loginMode === 'staff'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Staff Terminal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginMode('guest')
              setError('')
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              loginMode === 'guest'
                ? 'bg-gradient-to-r from-[#9e763a] to-[#ba934f] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Hotel Guest Portal</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Tab 1: Staff Terminal Form */}
        {loginMode === 'staff' ? (
          <div className="space-y-4">
            {/* Demo Hint Banner */}
            <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-800">
              <Info className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
              <div>
                <span className="font-bold">Staff Demo — </span>
                <span className="font-mono">{DEMO_EMAIL}</span> / <span className="font-mono">{DEMO_PASSWORD}</span>
              </div>
            </div>

            <form onSubmit={handleStaffLogin} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                  Work Email / Staff ID
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                  Security Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="h-4 w-4" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-[#9e763a] to-[#ba934f] hover:from-[#8d6932] hover:to-[#a88241] text-white text-sm font-bold gap-2 shadow-md mt-2"
              >
                <span>{loading ? 'Authenticating Terminal...' : 'Sign In to Management PMS'}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </form>
          </div>
        ) : (
          /* Tab 2: Hotel Guest Portal Login */
          <div className="space-y-4">
            <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 border border-blue-200 px-3 py-2.5 text-xs text-blue-900">
              <Sparkles className="h-4 w-4 mt-0.5 shrink-0 text-blue-600" />
              <div>
                <span className="font-bold">In-House Guest Access — </span>
                Enter your assigned room number &amp; phone or last name.
              </div>
            </div>

            {/* Quick Demo Guest Selector */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
              <span className="text-gray-500 font-bold block text-[11px] uppercase">
                Quick Demo Guests (Select One):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRoomNumber('202')
                    setGuestLastName('Sharma')
                    setGuestPhone('+91 98765 43210')
                  }}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    roomNumber === '202'
                      ? 'bg-amber-100 border-[#ba934f] text-gray-900 font-bold'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="block text-[11px] text-[#ba934f]">Room 202 (Deluxe)</span>
                  <span>Vikram Sharma 🇮🇳</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRoomNumber('101')
                    setGuestLastName('Al-Kuwari')
                    setGuestPhone('+974 5512 3456')
                  }}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    roomNumber === '101'
                      ? 'bg-amber-100 border-[#ba934f] text-gray-900 font-bold'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="block text-[11px] text-[#ba934f]">Room 101 (Standard)</span>
                  <span>Nasser Al-Kuwari 🇶🇦</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleGuestLogin} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                    Room Number
                  </label>
                  <Input
                    required
                    placeholder="e.g. 202"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    icon={<Bed className="h-4 w-4" />}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                    Guest Last Name
                  </label>
                  <Input
                    required
                    placeholder="e.g. Sharma"
                    value={guestLastName}
                    onChange={(e) => setGuestLastName(e.target.value)}
                    icon={<User className="h-4 w-4" />}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                  Mobile / WhatsApp (India / International)
                </label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210 or +974 5512 3456"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  icon={<Phone className="h-4 w-4" />}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-[#9e763a] to-[#ba934f] hover:from-[#8d6932] hover:to-[#a88241] text-white text-sm font-bold gap-2 shadow-md mt-2"
              >
                <span>{loading ? 'Verifying Stay...' : 'Access My Room Services & Key'}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </form>
          </div>
        )}

        {/* Link to Signup */}
        <div className="pt-3 border-t border-gray-100 text-center text-xs text-gray-500 flex items-center justify-between">
          <span>New hotel property?</span>
          <Link to="/signup" className="text-blue-600 font-bold hover:underline">
            Register Property
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Cognivex Hospitality PMS · Dual Staff &amp; In-House Guest Terminal</span>
        </div>
      </div>
    </div>
  )
}

