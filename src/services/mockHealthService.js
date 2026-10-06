/**
 * CareLink mock health service.
 *
 * ⚠️ Every function here only manipulates LOCAL prototype state.
 * There is no network, no database and no healthcare transaction of any kind.
 * Small artificial delays are used purely to make the demo feel realistic.
 */

import { jitterDelay, demoCode, clamp } from '@/lib/utils'
import {
  appointments as seedAppointments,
  prescriptions as seedPrescriptions,
  testResults as seedResults,
  labTests,
} from '@/data/mockData'

/** Deep-ish clone so seeds are never mutated. */
const clone = (value) => JSON.parse(JSON.stringify(value))

/** Read-only dataset loaders (simulated "fetch"). */
export async function fetchAppointments() {
  await jitterDelay(300, 700)
  return clone(seedAppointments)
}

export async function fetchDoctors(doctors) {
  await jitterDelay(300, 650)
  return clone(doctors)
}

export async function fetchTestResults() {
  await jitterDelay(350, 800)
  return clone(seedResults)
}

export async function fetchPrescriptions() {
  await jitterDelay(300, 750)
  return clone(seedPrescriptions)
}

export async function fetchLabTests() {
  await jitterDelay(300, 700)
  return clone(labTests)
}

/**
 * Book a DEMO appointment.
 * @returns {Promise<{ok:true, appointment:object, message:string}>}
 */
export async function bookAppointment({ doctor, date, time, type = 'Video', reason = '' }) {
  await jitterDelay(500, 800)

  if (!doctor || !date || !time) {
    return { ok: false, message: 'Please choose a doctor, date and time for this demo booking.' }
  }

  const [hourRaw, minuteRaw, meridiem] = time.match(/(\d+):(\d+)\s*(AM|PM)/i)?.slice(1) ?? []
  let hour = Number(hourRaw)
  const meridiemUpper = String(meridiem || 'AM').toUpperCase()
  if (meridiemUpper === 'PM' && hour < 12) hour += 12
  if (meridiemUpper === 'AM' && hour === 12) hour = 0

  const start = new Date(`${date}T00:00:00`)
  start.setHours(hour, Number(minuteRaw) || 0, 0, 0)

  const appointment = {
    id: `apt_${Date.now().toString(36)}`,
    code: demoCode('CL-DEMO'),
    doctorId: doctor.id,
    type,
    status: 'confirmed',
    start: start.toISOString(),
    durationMins: 30,
    reason: reason?.trim() ? `${reason.trim()} (demo)` : 'General consultation (demo)',
    location: type === 'Video' ? 'Simulated video room' : `${doctor.hospital}, ${doctor.city}`,
    notes: 'Sample appointment created for interface demonstration.',
    isDemo: true,
  }

  return {
    ok: true,
    appointment,
    message: `Demo appointment confirmed · ${appointment.code}. No real booking was made.`,
  }
}

/** Move a demo appointment to a new slot. */
export async function rescheduleAppointment(appointmentId, { date, time }) {
  await jitterDelay(450, 800)
  if (!appointmentId) return { ok: false, message: 'No demo appointment selected.' }

  const [hourRaw, minuteRaw, meridiem] = time.match(/(\d+):(\d+)\s*(AM|PM)/i)?.slice(1) ?? []
  let hour = Number(hourRaw)
  const meridiemUpper = String(meridiem || 'AM').toUpperCase()
  if (meridiemUpper === 'PM' && hour < 12) hour += 12
  if (meridiemUpper === 'AM' && hour === 12) hour = 0

  const start = new Date(`${date}T00:00:00`)
  start.setHours(hour, Number(minuteRaw) || 0, 0, 0)

  return {
    ok: true,
    appointmentId,
    start: start.toISOString(),
    status: 'confirmed',
    message: 'Demo appointment rescheduled. Nothing was changed in the real world.',
  }
}

/** Cancel a demo appointment. */
export async function cancelAppointment(appointmentId) {
  await jitterDelay(350, 650)
  if (!appointmentId) return { ok: false, message: 'No demo appointment selected.' }
  return {
    ok: true,
    appointmentId,
    status: 'cancelled',
    message: 'Demo appointment cancelled. No fees or real bookings were involved.',
  }
}

/**
 * "Join" the simulated consultation — never opens a real call.
 * @returns waiting-room state with a countdown in seconds
 */
export async function joinMockConsultation(appointmentId, leadMinutes = 5) {
  await jitterDelay(500, 800)
  if (!appointmentId) return { ok: false, message: 'No demo appointment selected.' }
  return {
    ok: true,
    appointmentId,
    state: 'waiting',
    countdownSeconds: clamp(leadMinutes * 60, 60, 900),
    message:
      'You are in the simulated waiting room. No video call is connected — this is a frontend prototype.',
  }
}

/** Mark a simulated consultation as ended. */
export async function leaveMockConsultation() {
  await jitterDelay(300, 500)
  return { ok: true, message: 'Simulated consultation ended. Nothing real was recorded.' }
}

/** Book a DEMO laboratory test. */
export async function bookLabTest(testId, { date, collection = 'Centre collection' }) {
  await jitterDelay(450, 800)
  const test = labTests.find((t) => t.id === testId)
  if (!test) return { ok: false, message: 'Please choose a sample test first.' }
  if (!date) return { ok: false, message: 'Please choose a date for this demo booking.' }

  return {
    ok: true,
    booking: {
      id: `labk_${Date.now().toString(36)}`,
      code: demoCode('CL-DEMO-LAB'),
      testId: test.id,
      testName: test.name,
      lab: test.lab,
      date,
      collection,
      status: 'scheduled',
      isDemo: true,
    },
    message: `Demo lab booking created for ${test.name}. No sample will actually be collected.`,
  }
}

/** Open a MOCK test result (local state only). */
export async function viewTestResult(resultId) {
  await jitterDelay(300, 650)
  if (!resultId) return { ok: false, message: 'No sample result selected.' }
  return {
    ok: true,
    resultId,
    openedAt: new Date().toISOString(),
    message: 'Sample result opened. Discuss any real result with a qualified healthcare professional.',
  }
}

/** Open a DEMO prescription (local state only). */
export async function viewPrescription(prescriptionId) {
  await jitterDelay(300, 600)
  if (!prescriptionId) return { ok: false, message: 'No demo prescription selected.' }
  return { ok: true, prescriptionId, openedAt: new Date().toISOString() }
}

/** Add a DEMO pharmacy item to the local cart. */
export async function orderMockPharmacyItem(product, qty = 1) {
  await jitterDelay(350, 750)
  if (!product) return { ok: false, message: 'No sample product selected.' }
  if (!product.inStock) {
    return { ok: false, message: `${product.name} is out of stock in this demo.` }
  }
  return {
    ok: true,
    item: { ...product, qty: clamp(qty, 1, 9) },
    message: `${product.name} added to your demo cart (demo price). No order was placed.`,
  }
}

/** Simulated checkout — never charges anything. */
export async function checkoutDemoCart(cart) {
  await jitterDelay(600, 800)
  if (!cart?.length) return { ok: false, message: 'Your demo cart is empty.' }
  return {
    ok: true,
    orderId: demoCode('CL-DEMO-ORDER'),
    message: 'Demo order created. No payment was taken and nothing will be delivered.',
  }
}

export default {
  fetchAppointments,
  fetchDoctors,
  fetchTestResults,
  fetchPrescriptions,
  fetchLabTests,
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  joinMockConsultation,
  leaveMockConsultation,
  bookLabTest,
  viewTestResult,
  viewPrescription,
  orderMockPharmacyItem,
  checkoutDemoCart,
}
