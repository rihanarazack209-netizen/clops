import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Mail,
  Smartphone,
  Lock,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const DEMO_CODE = '123456'

export function VerificationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state =
    (location.state as { email?: string; phone?: string; hotelName?: string }) || {}

  const email = state.email || 'admin@cognivexpms.qa'
  const phone = state.phone || '+91 98765 43210'

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'email'>('whatsapp')
  const [timer, setTimer] = useState(45)
  const [canResend, setCanResend] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [timer])

  // Fill all 6 boxes with the demo code
  const fillDemoCode = () => {
    const digits = DEMO_CODE.split('')
    setOtp(digits)
    setError('')
    inputRefs.current[5]?.focus()
  }

  // Handle digit change
  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle clipboard paste of full 6-digit OTP
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('')
      setOtp(digits)
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')

    if (code.length < 6) {
      setError('Please enter the complete 6-digit verification code.')
      return
    }

    // Accept any 6-digit code in demo mode — no server check
    setLoading(true)
    setError('')

    setTimeout(() => {
      setLoading(false)
      setVerified(true)
      localStorage.setItem('auth_token', 'cognivex-demo-token')
      localStorage.setItem('cognivex_logged_in', 'true')
      setTimeout(() => {
        navigate('/')
      }, 1200)
    }, 800)
  }

  const handleResend = () => {
    if (!canResend) return
    setTimer(45)
    setCanResend(false)
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    setError('')
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

      <div className="relative z-10 w-full max-w-lg bg-white text-gray-900 rounded-3xl shadow-2xl p-7 sm:p-9 border border-gray-100 space-y-6">
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#9e763a] to-[#ba934f] text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Security Verification
          </h2>
          <p className="text-xs font-semibold text-[#b88c3a] uppercase tracking-wider">
            2-Factor Station Authentication
          </p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            We sent a 6-digit code to your channel. In demo mode,{' '}
            <strong>any 6-digit code works</strong> — or click the button below.
          </p>
        </div>

        {/* Demo shortcut */}
        <button
          type="button"
          onClick={fillDemoCode}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-50 border border-amber-200 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors"
        >
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          Use Demo Code ({DEMO_CODE}) — instant fill
        </button>

        {/* Channel Selector Chips */}
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveChannel('whatsapp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeChannel === 'whatsapp'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
            <span>WhatsApp: {phone}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveChannel('email')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeChannel === 'email'
                ? 'bg-blue-50 text-blue-800 border border-blue-300 shadow-xs'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Mail className="h-3.5 w-3.5 text-blue-600" />
            <span>Email: {email}</span>
          </button>
        </div>

        {verified ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold">Verification Successful!</h3>
            <p className="text-xs text-emerald-700">
              Access granted. Launching Cognivex Executive Dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold text-center">
                {error}
              </div>
            )}

            {/* 6 Digit OTP Input Grid */}
            <div className="flex justify-center items-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                  className="h-12 w-11 sm:h-14 sm:w-12 text-center text-xl sm:text-2xl font-black font-mono rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-[#ba934f] focus:outline-none transition-all shadow-xs"
                />
              ))}
            </div>

            {/* Resend Timer */}
            <div className="text-center text-xs text-gray-500">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:underline"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Resend New Code</span>
                </button>
              ) : (
                <p>
                  Didn't receive code? Resend in{' '}
                  <span className="font-bold font-mono text-gray-800">{timer}s</span>
                </p>
              )}
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-[#9e763a] to-[#ba934f] hover:from-[#8d6932] hover:to-[#a88241] text-white font-bold text-sm gap-2 shadow-md"
            >
              <span>{loading ? 'Validating...' : 'Verify & Enter Dashboard'}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </form>
        )}

        {/* Security badge footer */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-emerald-600" /> End-to-End TLS 1.3
          </span>
          <Link to="/login" className="text-gray-500 hover:underline font-semibold">
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

