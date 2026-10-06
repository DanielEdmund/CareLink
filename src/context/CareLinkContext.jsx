import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import {
  appointments as seedAppointments,
  prescriptions as seedPrescriptions,
  testResults as seedResults,
  labTests as seedLabTests,
  pharmacyProducts,
  demoUser,
  journeySteps as seedJourney,
} from '@/data/mockData'
import * as service from '@/services/mockHealthService'
import { prefersReducedMotion } from '@/lib/utils'

const CareLinkContext = createContext(null)

/* ------------------------------------------------------------------ */
/*  Reducer — appointment / lab booking lifecycle                      */
/* ------------------------------------------------------------------ */
const initialState = {
  appointments: seedAppointments,
  prescriptions: seedPrescriptions,
  testResults: seedResults,
  labBookings: [],
  orders: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'appointment/booked': {
      const exists = state.appointments.some((a) => a.id === action.payload.id)
      return {
        ...state,
        appointments: exists
          ? state.appointments.map((a) => (a.id === action.payload.id ? action.payload : a))
          : [action.payload, ...state.appointments],
      }
    }
    case 'appointment/updated':
      return {
        ...state,
        appointments: state.appointments.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a
        ),
      }
    case 'lab/booked':
      return { ...state, labBookings: [action.payload, ...state.labBookings] }
    case 'order/placed':
      return { ...state, orders: [action.payload, ...state.orders] }
    case 'result/reviewed':
      return {
        ...state,
        testResults: state.testResults.map((r) =>
          r.id === action.payload ? { ...r, review: 'reviewed' } : r
        ),
      }
    case 'prescription/collected':
      return {
        ...state,
        prescriptions: state.prescriptions.map((p) =>
          p.id === action.payload ? { ...p, status: 'collected' } : p
        ),
      }
    case 'state/reset':
      return initialState
    default:
      return state
  }
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */
export function CareLinkProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Selection & UI state
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [selectedLabTest, setSelectedLabTest] = useState(null)
  const [selectedTestResult, setSelectedTestResult] = useState(null)
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [cart, setCart] = useState([])
  const [recordFilters, setRecordFilters] = useState({ type: 'All records', query: '', year: 'All time' })
  const [journey, setJourney] = useState(seedJourney)
  const [pending, setPending] = useState({})
  const [toasts, setToasts] = useState([])

  // Simulated consultation room
  const [consultation, setConsultation] = useState({
    appointmentId: null,
    state: 'idle', // idle | joining | waiting | in-session | ended
    countdownSeconds: 0,
  })

  // User preferences (local only)
  const [preferences, setPreferences] = useState({
    reduceMotion: prefersReducedMotion(),
    pushNotifications: true,
    smsReminders: true,
    emailSummaries: false,
    shareAnonymousData: false,
    units: 'Metric (kg, cm)',
    language: 'English (Nigeria)',
    themeAccent: 'Deep Medical Blue',
  })

  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  /* ------------------------------ toasts ------------------------------ */
  const pushToast = useCallback((toast) => {
    const id = `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
    setToasts((prev) => [...prev.slice(-2), { id, tone: 'info', ...toast }])
    const t = setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 5200)
    timers.current.push(t)
    return id
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const setPendingFlag = useCallback((key, value) => {
    setPending((prev) => ({ ...prev, [key]: value }))
  }, [])

  /* ------------------------- reduced motion --------------------------- */
  useEffect(() => {
    const root = document.documentElement
    if (preferences.reduceMotion) root.classList.add('reduce-motion')
    else root.classList.remove('reduce-motion')
  }, [preferences.reduceMotion])

  /* --------------------- high-contrast surfaces ----------------------- */
  useEffect(() => {
    const root = document.documentElement
    if (preferences.highContrastFallback) root.classList.add('cl-hc')
    else root.classList.remove('cl-hc')
  }, [preferences.highContrastFallback])

  /* ----------------------- consultation timer ------------------------- */
  useEffect(() => {
    if (consultation.state !== 'waiting') return undefined
    const interval = setInterval(() => {
      setConsultation((prev) => {
        if (prev.state !== 'waiting') return prev
        const next = prev.countdownSeconds - 1
        if (next <= 0) return { ...prev, state: 'in-session', countdownSeconds: 0 }
        return { ...prev, countdownSeconds: next }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [consultation.state])

  /* ---------------------------- actions ------------------------------- */
  const bookAppointment = useCallback(
    async (payload) => {
      setPendingFlag('bookAppointment', true)
      const res = await service.bookAppointment(payload)
      setPendingFlag('bookAppointment', false)
      if (res.ok) {
        dispatch({ type: 'appointment/booked', payload: res.appointment })
        setSelectedAppointment(res.appointment)
        setJourney((prev) =>
          prev.map((s) => (s.id === 'js_3' ? { ...s, status: 'current' } : s))
        )
      }
      pushToast({ tone: res.ok ? 'success' : 'warning', title: res.ok ? 'Demo appointment confirmed' : 'Demo booking incomplete', message: res.message })
      return res
    },
    [pushToast, setPendingFlag]
  )

  const rescheduleAppointment = useCallback(
    async (appointmentId, slot) => {
      setPendingFlag('rescheduleAppointment', true)
      const res = await service.rescheduleAppointment(appointmentId, slot)
      setPendingFlag('rescheduleAppointment', false)
      if (res.ok) {
        dispatch({
          type: 'appointment/updated',
          payload: { id: appointmentId, start: res.start, status: res.status },
        })
      }
      pushToast({ tone: res.ok ? 'success' : 'warning', title: res.ok ? 'Demo appointment rescheduled' : 'Could not reschedule', message: res.message })
      return res
    },
    [pushToast, setPendingFlag]
  )

  const cancelAppointment = useCallback(
    async (appointmentId) => {
      setPendingFlag('cancelAppointment', true)
      const res = await service.cancelAppointment(appointmentId)
      setPendingFlag('cancelAppointment', false)
      if (res.ok) {
        dispatch({ type: 'appointment/updated', payload: { id: appointmentId, status: 'cancelled' } })
        setSelectedAppointment((prev) => (prev?.id === appointmentId ? { ...prev, status: 'cancelled' } : prev))
      }
      pushToast({ tone: 'info', title: res.ok ? 'Demo appointment cancelled' : 'Could not cancel', message: res.message })
      return res
    },
    [pushToast, setPendingFlag]
  )

  const joinConsultation = useCallback(
    async (appointmentId) => {
      setPendingFlag('joinConsultation', true)
      setConsultation((prev) => ({ ...prev, state: 'joining', appointmentId }))
      const res = await service.joinMockConsultation(appointmentId, 3)
      setPendingFlag('joinConsultation', false)
      if (res.ok) {
        setConsultation({
          appointmentId: res.appointmentId,
          state: 'waiting',
          countdownSeconds: res.countdownSeconds,
        })
        setJourney((prev) => prev.map((s) => (s.id === 'js_3' ? { ...s, status: 'current' } : s)))
      } else {
        setConsultation((prev) => ({ ...prev, state: 'idle' }))
      }
      pushToast({ tone: 'info', title: 'Simulated consultation', message: res.message })
      return res
    },
    [pushToast, setPendingFlag]
  )

  const leaveConsultation = useCallback(async () => {
    const res = await service.leaveMockConsultation()
    setConsultation({ appointmentId: null, state: 'ended', countdownSeconds: 0 })
    pushToast({ tone: 'info', title: 'Session ended', message: res.message })
    return res
  }, [pushToast])

  const bookLabTest = useCallback(
    async (payload) => {
      setPendingFlag('bookLabTest', true)
      const res = await service.bookLabTest(payload.testId, payload)
      setPendingFlag('bookLabTest', false)
      if (res.ok) {
        dispatch({ type: 'lab/booked', payload: res.booking })
        setJourney((prev) => prev.map((s) => (s.id === 'js_4' ? { ...s, status: 'current' } : s)))
      }
      pushToast({ tone: res.ok ? 'success' : 'warning', title: res.ok ? 'Demo lab booking created' : 'Demo booking incomplete', message: res.message })
      return res
    },
    [pushToast, setPendingFlag]
  )

  const openTestResult = useCallback(
    async (resultId) => {
      setPendingFlag(`result:${resultId}`, true)
      const res = await service.viewTestResult(resultId)
      setPendingFlag(`result:${resultId}`, false)
      if (res.ok) {
        const result = state.testResults.find((r) => r.id === resultId) || null
        setSelectedTestResult(result)
      }
      pushToast({ tone: 'info', title: 'Mock test result', message: res.message })
      return res
    },
    [pushToast, setPendingFlag, state.testResults]
  )

  const closeTestResult = useCallback(() => setSelectedTestResult(null), [])

  const markResultReviewed = useCallback((resultId) => {
    dispatch({ type: 'result/reviewed', payload: resultId })
    setSelectedTestResult((prev) => (prev?.id === resultId ? { ...prev, review: 'reviewed' } : prev))
  }, [])

  const openPrescription = useCallback(
    async (prescriptionId) => {
      setPendingFlag(`rx:${prescriptionId}`, true)
      const res = await service.viewPrescription(prescriptionId)
      setPendingFlag(`rx:${prescriptionId}`, false)
      if (res.ok) {
        setSelectedPrescription(state.prescriptions.find((p) => p.id === prescriptionId) || null)
      }
      return res
    },
    [pending, state.prescriptions]
  )

  const closePrescription = useCallback(() => setSelectedPrescription(null), [])

  const markPrescriptionCollected = useCallback(
    (id) => {
      dispatch({ type: 'prescription/collected', payload: id })
      pushToast({ tone: 'info', title: 'Demo prescription updated', message: 'Marked as collected in this prototype only.' })
    },
    [pushToast]
  )

  const addToCart = useCallback(
    async (product, qty = 1) => {
      setPendingFlag(`cart:${product.id}`, true)
      const res = await service.orderMockPharmacyItem(product, qty)
      setPendingFlag(`cart:${product.id}`, false)
      if (res.ok) {
        setCart((prev) => {
          const existing = prev.find((i) => i.id === product.id)
          if (existing) {
            return prev.map((i) => (i.id === product.id ? { ...i, qty: Math.min(9, i.qty + qty) } : i))
          }
          return [...prev, { ...res.item }]
        })
      }
      pushToast({ tone: res.ok ? 'success' : 'warning', title: res.ok ? 'Added to demo cart' : 'Could not add item', message: res.message })
      return res
    },
    [pushToast, setPendingFlag]
  )

  const updateCartQty = useCallback((productId, qty) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== productId)
        : prev.map((i) => (i.id === productId ? { ...i, qty: Math.min(9, qty) } : i))
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const checkoutCart = useCallback(async () => {
    setPendingFlag('checkoutCart', true)
    const res = await service.checkoutDemoCart(cart)
    setPendingFlag('checkoutCart', false)
    if (res.ok) {
      dispatch({ type: 'order/placed', payload: { id: res.orderId, items: cart, placedAt: new Date().toISOString() } })
      setCart([])
    }
    pushToast({ tone: res.ok ? 'success' : 'warning', title: res.ok ? 'Demo order created' : 'Checkout incomplete', message: res.message })
    return res
  }, [cart, pushToast, setPendingFlag])

  const resetDemo = useCallback(() => {
    dispatch({ type: 'state/reset' })
    setCart([])
    setJourney(seedJourney)
    setSelectedDoctor(null)
    setSelectedAppointment(null)
    setSelectedTestResult(null)
    setSelectedPrescription(null)
    setConsultation({ appointmentId: null, state: 'idle', countdownSeconds: 0 })
    pushToast({ tone: 'info', title: 'Prototype reset', message: 'All local demo state was restored to its starting sample data.' })
  }, [pushToast])

  const value = useMemo(
    () => ({
      // data
      user: demoUser,
      appointments: state.appointments,
      prescriptions: state.prescriptions,
      testResults: state.testResults,
      labTests: seedLabTests,
      products: pharmacyProducts,
      labBookings: state.labBookings,
      orders: state.orders,
      journey,

      // selection
      selectedDoctor,
      setSelectedDoctor,
      selectedAppointment,
      setSelectedAppointment,
      selectedLabTest,
      setSelectedLabTest,
      selectedTestResult,
      closeTestResult,
      selectedPrescription,
      closePrescription,
      recordFilters,
      setRecordFilters,

      // consultation
      consultation,
      joinConsultation,
      leaveConsultation,

      // cart
      cart,
      addToCart,
      updateCartQty,
      clearCart,
      checkoutCart,

      // actions
      bookAppointment,
      rescheduleAppointment,
      cancelAppointment,
      bookLabTest,
      openTestResult,
      openPrescription,
      markResultReviewed,
      markPrescriptionCollected,
      resetDemo,

      // ui
      pending,
      toasts,
      pushToast,
      dismissToast,
      preferences,
      setPreferences,
    }),
    [
      state,
      journey,
      selectedDoctor,
      selectedAppointment,
      selectedLabTest,
      selectedTestResult,
      selectedPrescription,
      recordFilters,
      consultation,
      cart,
      pending,
      toasts,
      preferences,
      bookAppointment,
      rescheduleAppointment,
      cancelAppointment,
      joinConsultation,
      leaveConsultation,
      bookLabTest,
      openTestResult,
      closeTestResult,
      openPrescription,
      closePrescription,
      markResultReviewed,
      markPrescriptionCollected,
      addToCart,
      updateCartQty,
      clearCart,
      checkoutCart,
      resetDemo,
      pushToast,
      dismissToast,
    ]
  )

  return <CareLinkContext.Provider value={value}>{children}</CareLinkContext.Provider>
}

/** Access the CareLink prototype state. Throws outside the provider. */
export function useCareLink() {
  const ctx = useContext(CareLinkContext)
  if (!ctx) throw new Error('useCareLink must be used inside <CareLinkProvider>')
  return ctx
}

export default CareLinkContext
