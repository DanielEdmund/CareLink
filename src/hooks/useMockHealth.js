import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCareLink } from '@/context/CareLinkContext'
import * as service from '@/services/mockHealthService'

/**
 * useMockHealth — the prototype's "data layer" hook.
 *
 * Simulates async loading of local mock data with small artificial delays,
 * exposes the CareLink context state, and provides the mock service actions.
 * No network requests are performed.
 */
export function useMockHealth() {
  const ctx = useCareLink()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    const t = setTimeout(() => {
      if (mounted.current) setLoading(false)
    }, 550)
    return () => {
      mounted.current = false
      clearTimeout(t)
    }
  }, [])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await service.fetchAppointments()
    } catch {
      setError('Sample data could not be loaded. Please try again.')
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [])

  const actions = useMemo(
    () => ({
      bookAppointment: ctx.bookAppointment,
      rescheduleAppointment: ctx.rescheduleAppointment,
      cancelAppointment: ctx.cancelAppointment,
      joinConsultation: ctx.joinConsultation,
      leaveConsultation: ctx.leaveConsultation,
      bookLabTest: ctx.bookLabTest,
      openTestResult: ctx.openTestResult,
      openPrescription: ctx.openPrescription,
      addToCart: ctx.addToCart,
      checkoutCart: ctx.checkoutCart,
    }),
    [ctx]
  )

  return { ...ctx, loading, error, refetch, actions }
}

export default useMockHealth
