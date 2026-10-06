/**
 * CareLink — local mock data (frontend prototype only).
 *
 * Everything in this file is SAMPLE content created for demonstration.
 * No real patients, clinicians, facilities, records, prices or transactions
 * are represented here.
 */

export const APP_NAME = 'CareLink'
export const TAGLINE = 'Healthcare, Connected Around You.'
export const DEMO_DISCLAIMER =
  'This is sample information for demonstration purposes and is not medical advice.'
export const RESULT_DISCLAIMER =
  'This is a mock test result shown for demonstration purposes. Discuss any real test result with a qualified healthcare professional.'
export const NOT_A_REAL_SERVICE =
  'CareLink is a frontend prototype. No real healthcare services, appointments, prescriptions or payments are provided.'

/* ------------------------------------------------------------------ */
/*  Date helpers — keeps the demo always feeling "current"             */
/* ------------------------------------------------------------------ */
const DAY = 86400000

function atOffset(days, hour = 9, minute = 0) {
  const d = new Date(Date.now() + days * DAY)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

/**
 * A demo time guaranteed to be in the future (rolls forward a day at a time).
 * Keeps "next available / starts in" copy sensible at any hour of the day.
 */
function futureAt(days, hour = 9, minute = 0, bufferMs = 30 * 60 * 1000) {
  let d = new Date(Date.now() + days * DAY)
  d.setHours(hour, minute, 0, 0)
  while (d.getTime() <= Date.now() + bufferMs) {
    d = new Date(d.getTime() + DAY)
  }
  return d.toISOString()
}

function dayLabel(days) {
  const d = new Date(Date.now() + days * DAY)
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

/* ------------------------------------------------------------------ */
/*  Demo user                                                          */
/* ------------------------------------------------------------------ */
export const demoUser = {
  id: 'usr_demo_001',
  name: 'Adaeze Okonkwo',
  preferredName: 'Adaeze',
  age: 34,
  gender: 'Female',
  bloodType: 'O+',
  genotype: 'AS (sample)',
  height: '168 cm (sample)',
  weight: '68 kg (sample)',
  phone: '+234 803 412 7788',
  email: 'adaeze.okonkwo@example.com',
  address: '12 Admiralty Way, Lekki Phase 1, Lagos',
  city: 'Lagos',
  state: 'Lagos',
  occupation: 'Product Designer',
  language: 'English',
  emergencyContact: {
    name: 'Chinedu Okonkwo',
    relation: 'Brother',
    phone: '+234 806 220 1145',
  },
  insurance: {
    provider: 'Crown Health HMO (Sample)',
    number: 'CL-HMO-0093-DEMO',
    plan: 'Gold Family (Sample Plan)',
  },
  avatar:
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=70',
  allergies: ['Penicillin (sample entry)'],
  careTeam: ['Dr. Chiamaka Eze', 'Dr. Tunde Bakare'],
}

export const demoFamilyMembers = [
  {
    id: 'fam_01',
    name: 'Emeka Okonkwo',
    relation: 'Son',
    age: 8,
    avatar:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=200&q=70',
    note: 'Sample profile',
  },
  {
    id: 'fam_02',
    name: 'Ngozi Okonkwo',
    relation: 'Mother',
    age: 63,
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=70',
    note: 'Sample profile',
  },
]

/* ------------------------------------------------------------------ */
/*  Doctors                                                            */
/* ------------------------------------------------------------------ */
export const doctors = [
  {
    id: 'doc_01',
    name: 'Dr. Chiamaka Eze',
    specialty: 'Cardiology',
    focus: 'Heart & vascular health',
    hospital: 'Lagoon Heart Centre',
    facilityType: 'Specialist clinic',
    city: 'Lagos',
    state: 'Lagos',
    area: 'Ikoyi',
    rating: 4.9,
    reviews: 214,
    experienceYears: 14,
    fee: 25000,
    gender: 'Female',
    languages: ['English', 'Igbo', 'Pidgin'],
    about:
      'Sample profile: a consultant cardiologist with 14 years of simulated experience in preventive cardiology and hypertension follow-up.',
    nextAvailable: futureAt(0, 14, 30),
    slots: ['10:00 AM', '11:30 AM', '2:30 PM', '4:00 PM'],
    tags: ['Video consult', 'Hypertension', 'Preventive care'],
    accepting: true,
    image:
      'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&crop=faces&w=640&h=400&q=70',
  },
  {
    id: 'doc_02',
    name: 'Dr. Tunde Bakare',
    specialty: 'General Practice',
    focus: 'Everyday family medicine',
    hospital: 'Wellness Point Medical',
    facilityType: 'Family practice',
    city: 'Lagos',
    state: 'Lagos',
    area: 'Ikeja',
    rating: 4.8,
    reviews: 341,
    experienceYears: 11,
    fee: 15000,
    gender: 'Male',
    languages: ['English', 'Yoruba', 'Pidgin'],
    about:
      'Sample profile: a general practitioner focused on routine check-ups, common illnesses and coordinated referrals.',
    nextAvailable: futureAt(0, 16, 0),
    slots: ['9:00 AM', '12:00 PM', '4:00 PM', '5:30 PM'],
    tags: ['Same-day', 'Video consult', 'Check-ups'],
    accepting: true,
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&crop=faces&w=640&h=400&q=70',
  },
  {
    id: 'doc_03',
    name: 'Dr. Amina Yusuf',
    specialty: 'Paediatrics',
    focus: 'Children & adolescents',
    hospital: "Cedarcrest Children's Clinic",
    facilityType: 'Children’s clinic',
    city: 'Abuja',
    state: 'FCT',
    area: 'Maitama',
    rating: 4.9,
    reviews: 176,
    experienceYears: 9,
    fee: 18000,
    gender: 'Female',
    languages: ['English', 'Hausa'],
    about:
      'Sample profile: a paediatrician covering routine growth reviews, childhood immunisation schedules and common childhood illnesses.',
    nextAvailable: futureAt(1, 10, 0),
    slots: ['10:00 AM', '11:00 AM', '1:00 PM', '3:30 PM'],
    tags: ['Video consult', 'New parents', 'Growth review'],
    accepting: true,
    image:
      'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&crop=faces&w=640&h=400&q=70',
  },
  {
    id: 'doc_04',
    name: 'Dr. Emeka Nwosu',
    specialty: 'Dermatology',
    focus: 'Skin, hair & nails',
    hospital: 'Grace Skin Centre',
    facilityType: 'Specialist clinic',
    city: 'Enugu',
    state: 'Enugu',
    area: 'Independence Layout',
    rating: 4.7,
    reviews: 132,
    experienceYears: 8,
    fee: 20000,
    gender: 'Male',
    languages: ['English', 'Igbo'],
    about:
      'Sample profile: a dermatologist covering everyday skin concerns, acne follow-up and sun-safety education.',
    nextAvailable: futureAt(1, 13, 0),
    slots: ['1:00 PM', '2:00 PM', '4:30 PM'],
    tags: ['Photo review', 'Skin health'],
    accepting: true,
    image:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&crop=faces&w=640&h=400&q=70',
  },
  {
    id: 'doc_05',
    name: 'Dr. Folake Adeyemi',
    specialty: 'Women’s Health',
    focus: 'Antenatal & gynaecology',
    hospital: 'QueenCare Hospital',
    facilityType: 'Teaching hospital',
    city: 'Ibadan',
    state: 'Oyo',
    area: 'Bodija',
    rating: 4.9,
    reviews: 289,
    experienceYears: 16,
    fee: 22000,
    gender: 'Female',
    languages: ['English', 'Yoruba'],
    about:
      'Sample profile: a consultant covering antenatal visits, routine women’s health screenings and family planning information.',
    nextAvailable: futureAt(2, 9, 30),
    slots: ['9:30 AM', '11:00 AM', '2:00 PM'],
    tags: ['Antenatal', 'Video consult'],
    accepting: true,
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&crop=faces&w=640&h=400&q=70',
  },
  {
    id: 'doc_06',
    name: 'Dr. Ibrahim Sule',
    specialty: 'Orthopaedics',
    focus: 'Bones, joints & mobility',
    hospital: 'Bone & Joint Clinic',
    facilityType: 'Specialist clinic',
    city: 'Kano',
    state: 'Kano',
    area: 'Nassarawa',
    rating: 4.6,
    reviews: 98,
    experienceYears: 12,
    fee: 21000,
    gender: 'Male',
    languages: ['English', 'Hausa'],
    about:
      'Sample profile: an orthopaedic doctor covering joint pain, sports injuries and post-injury rehabilitation guidance.',
    nextAvailable: futureAt(2, 11, 0),
    slots: ['11:00 AM', '12:30 PM', '3:00 PM'],
    tags: ['Sports injury', 'Rehab'],
    accepting: false,
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&crop=faces&w=640&h=400&q=70',
  },
  {
    id: 'doc_07',
    name: 'Dr. Ngozi Obi',
    specialty: 'Family Medicine',
    focus: 'Whole-family continuity of care',
    hospital: 'Port Harcourt Medical Centre',
    facilityType: 'General hospital',
    city: 'Port Harcourt',
    state: 'Rivers',
    area: 'GRA Phase 2',
    rating: 4.8,
    reviews: 205,
    experienceYears: 10,
    fee: 16000,
    gender: 'Female',
    languages: ['English', 'Igbo', 'Pidgin'],
    about:
      'Sample profile: a family physician coordinating long-term care for adults and children in one household.',
    nextAvailable: futureAt(0, 15, 0),
    slots: ['3:00 PM', '4:00 PM', '5:00 PM'],
    tags: ['Family plans', 'Same-day'],
    accepting: true,
    image:
      'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&crop=faces&w=640&h=400&q=70',
  },
  {
    id: 'doc_08',
    name: 'Dr. Kelechi Umeh',
    specialty: 'Mental Wellbeing',
    focus: 'Stress, sleep & mood support',
    hospital: 'Mindful Health Studio',
    facilityType: 'Wellbeing clinic',
    city: 'Lagos',
    state: 'Lagos',
    area: 'Victoria Island',
    rating: 4.9,
    reviews: 167,
    experienceYears: 7,
    fee: 19000,
    gender: 'Male',
    languages: ['English', 'Igbo'],
    about:
      'Sample profile: a wellbeing doctor offering supportive conversations around stress, sleep and everyday mental health.',
    nextAvailable: futureAt(1, 17, 0),
    slots: ['5:00 PM', '6:00 PM', '7:00 PM'],
    tags: ['Evening slots', 'Video consult', 'Confidential'],
    accepting: true,
    image:
      'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?auto=format&fit=crop&crop=faces&w=640&h=400&q=70',
  },
]

export const specialtyOptions = [
  'All specialties',
  ...Array.from(new Set(doctors.map((d) => d.specialty))),
]

export const cityOptions = ['All cities', ...Array.from(new Set(doctors.map((d) => d.city)))]

/* ------------------------------------------------------------------ */
/*  Appointments (demo)                                                */
/* ------------------------------------------------------------------ */
export const appointments = [
  {
    id: 'apt_01',
    code: 'CL-DEMO-8F2KQ',
    doctorId: 'doc_01',
    type: 'Video',
    status: 'confirmed',
    start: futureAt(0, 14, 30),
    durationMins: 30,
    reason: 'Routine blood pressure follow-up (demo)',
    location: 'Simulated video room',
    notes: 'Sample appointment created for interface demonstration.',
    isDemo: true,
  },
  {
    id: 'apt_02',
    code: 'CL-DEMO-3J7XZ',
    doctorId: 'doc_03',
    type: 'In person',
    status: 'confirmed',
    start: futureAt(3, 10, 0),
    durationMins: 20,
    reason: 'Child growth review (demo)',
    location: "Cedarcrest Children's Clinic, Maitama, Abuja",
    notes: 'Sample appointment created for interface demonstration.',
    isDemo: true,
  },
  {
    id: 'apt_03',
    code: 'CL-DEMO-5Q1MB',
    doctorId: 'doc_08',
    type: 'Video',
    status: 'pending',
    start: futureAt(5, 17, 0),
    durationMins: 45,
    reason: 'Stress and sleep check-in (demo)',
    location: 'Simulated video room',
    notes: 'Awaiting simulated confirmation.',
    isDemo: true,
  },
  {
    id: 'apt_04',
    code: 'CL-DEMO-2W9CD',
    doctorId: 'doc_02',
    type: 'In person',
    status: 'completed',
    start: atOffset(-9, 9, 0),
    durationMins: 20,
    reason: 'Annual general check-up (demo)',
    location: 'Wellness Point Medical, Ikeja, Lagos',
    notes: 'Completed sample appointment. No real consultation took place.',
    isDemo: true,
  },
  {
    id: 'apt_05',
    code: 'CL-DEMO-6H4RT',
    doctorId: 'doc_07',
    type: 'Video',
    status: 'cancelled',
    start: atOffset(-4, 15, 0),
    durationMins: 30,
    reason: 'Follow-up question (demo)',
    location: 'Simulated video room',
    notes: 'Cancelled sample appointment.',
    isDemo: true,
  },
]

/* ------------------------------------------------------------------ */
/*  Health journey                                                     */
/* ------------------------------------------------------------------ */
export const journeySteps = [
  {
    id: 'js_1',
    title: 'Choose a doctor',
    description: 'Browse sample profiles and pick a specialty.',
    status: 'completed',
  },
  {
    id: 'js_2',
    title: 'Book a demo appointment',
    description: 'Pick a simulated date and time slot.',
    status: 'completed',
  },
  {
    id: 'js_3',
    title: 'Join simulated consultation',
    description: 'Enter the mock waiting room — no real video call occurs.',
    status: 'current',
  },
  {
    id: 'js_4',
    title: 'Review mock results',
    description: 'Sample laboratory results appear in Records.',
    status: 'upcoming',
  },
  {
    id: 'js_5',
    title: 'Demo prescription',
    description: 'Sample prescription details, never a real order.',
    status: 'upcoming',
  },
  {
    id: 'js_6',
    title: 'Care follow-up',
    description: 'A sample follow-up reminder closes the loop.',
    status: 'upcoming',
  },
]

/* ------------------------------------------------------------------ */
/*  Health stats (sample vitals)                                       */
/* ------------------------------------------------------------------ */
export const healthStats = [
  { id: 'hs_1', label: 'Resting heart rate', value: '72', unit: 'bpm', trend: 'steady', icon: 'heart', note: 'Sample reading' },
  { id: 'hs_2', label: 'Blood pressure', value: '118/76', unit: 'mmHg', trend: 'good', icon: 'activity', note: 'Sample reading' },
  { id: 'hs_3', label: 'Weight', value: '68.0', unit: 'kg', trend: 'down', icon: 'scale', note: 'Sample reading' },
  { id: 'hs_4', label: 'Steps today', value: '6,420', unit: 'steps', trend: 'up', icon: 'footprints', note: 'Sample reading' },
  { id: 'hs_5', label: 'Sleep', value: '7h 12m', unit: 'last night', trend: 'steady', icon: 'moon', note: 'Sample reading' },
  { id: 'hs_6', label: 'Water', value: '5', unit: 'of 8 glasses', trend: 'up', icon: 'droplet', note: 'Sample reading' },
]

export const vitalsTrend = [
  { day: 'Mon', systolic: 122, diastolic: 79, heartRate: 74 },
  { day: 'Tue', systolic: 120, diastolic: 78, heartRate: 72 },
  { day: 'Wed', systolic: 124, diastolic: 80, heartRate: 76 },
  { day: 'Thu', systolic: 119, diastolic: 77, heartRate: 71 },
  { day: 'Fri', systolic: 118, diastolic: 76, heartRate: 72 },
  { day: 'Sat', systolic: 121, diastolic: 78, heartRate: 73 },
  { day: 'Sun', systolic: 118, diastolic: 76, heartRate: 70 },
]

export const wellnessBalance = [
  { name: 'Movement', value: 78, fill: '#155EEF' },
  { name: 'Sleep', value: 84, fill: '#0E9F9A' },
  { name: 'Hydration', value: 62, fill: '#3B82F6' },
  { name: 'Check-ups', value: 90, fill: '#12B76A' },
]

/* ------------------------------------------------------------------ */
/*  Laboratory (demo)                                                  */
/* ------------------------------------------------------------------ */
export const labTests = [
  {
    id: 'lab_01',
    name: 'Full Blood Count (FBC)',
    category: 'Blood',
    lab: 'PathCare Laboratories (Sample)',
    city: 'Lagos',
    price: 8500,
    turnaround: 'Sample result in 24 hours',
    prep: 'No fasting required (sample guidance)',
    popular: true,
  },
  {
    id: 'lab_02',
    name: 'Lipid Profile',
    category: 'Blood',
    lab: 'Lancet Diagnostics (Sample)',
    city: 'Lagos',
    price: 12000,
    turnaround: 'Sample result in 24 hours',
    prep: 'Sample guidance: 9–12 hour fast',
    popular: true,
  },
  {
    id: 'lab_03',
    name: 'Fasting Blood Sugar',
    category: 'Blood',
    lab: 'PathCare Laboratories (Sample)',
    city: 'Abuja',
    price: 6000,
    turnaround: 'Sample result in 12 hours',
    prep: 'Sample guidance: 8 hour fast',
    popular: false,
  },
  {
    id: 'lab_04',
    name: 'Malaria Parasite (MP)',
    category: 'Blood',
    lab: 'Medicaid Laboratories (Sample)',
    city: 'Lagos',
    price: 4500,
    turnaround: 'Sample result in 3 hours',
    prep: 'No preparation required (sample)',
    popular: true,
  },
  {
    id: 'lab_05',
    name: 'Urine Routine Analysis',
    category: 'Urine',
    lab: 'Lancet Diagnostics (Sample)',
    city: 'Port Harcourt',
    price: 5500,
    turnaround: 'Sample result in 6 hours',
    prep: 'Sample guidance: first morning sample',
    popular: false,
  },
  {
    id: 'lab_06',
    name: 'Chest X-Ray (Single View)',
    category: 'Imaging',
    lab: 'Sky Radiology (Sample)',
    city: 'Lagos',
    price: 15000,
    turnaround: 'Sample report in 24 hours',
    prep: 'No preparation required (sample)',
    popular: false,
  },
]

export const testResults = [
  {
    id: 'tr_01',
    code: 'CL-DEMO-LAB-4471',
    name: 'Full Blood Count (FBC)',
    lab: 'PathCare Laboratories (Sample)',
    doctor: 'Dr. Tunde Bakare',
    collected: atOffset(-6, 8, 30),
    reported: atOffset(-5, 16, 0),
    status: 'ready',
    review: 'reviewed',
    summary:
      'Sample values fall within the reference windows shown below. Presented for interface demonstration only.',
    markers: [
      { name: 'Haemoglobin', value: '13.4', unit: 'g/dL', range: '12.0 – 15.5', flag: 'normal' },
      { name: 'White blood cells', value: '6.8', unit: '×10⁹/L', range: '4.0 – 11.0', flag: 'normal' },
      { name: 'Platelets', value: '248', unit: '×10⁹/L', range: '150 – 400', flag: 'normal' },
      { name: 'Neutrophils', value: '61', unit: '%', range: '40 – 75', flag: 'normal' },
    ],
    isDemo: true,
  },
  {
    id: 'tr_02',
    code: 'CL-DEMO-LAB-4472',
    name: 'Lipid Profile',
    lab: 'Lancet Diagnostics (Sample)',
    doctor: 'Dr. Chiamaka Eze',
    collected: atOffset(-6, 9, 0),
    reported: atOffset(-5, 17, 30),
    status: 'ready',
    review: 'needs-review',
    summary:
      'One sample marker sits outside its reference window in this demo. A qualified healthcare professional should interpret any real result.',
    markers: [
      { name: 'Total cholesterol', value: '5.6', unit: 'mmol/L', range: '< 5.0', flag: 'high' },
      { name: 'LDL cholesterol', value: '3.2', unit: 'mmol/L', range: '< 3.0', flag: 'high' },
      { name: 'HDL cholesterol', value: '1.4', unit: 'mmol/L', range: '> 1.0', flag: 'normal' },
      { name: 'Triglycerides', value: '1.1', unit: 'mmol/L', range: '< 1.7', flag: 'normal' },
    ],
    isDemo: true,
  },
  {
    id: 'tr_03',
    code: 'CL-DEMO-LAB-4473',
    name: 'Malaria Parasite (MP)',
    lab: 'Medicaid Laboratories (Sample)',
    doctor: 'Dr. Tunde Bakare',
    collected: atOffset(-1, 10, 15),
    reported: null,
    status: 'processing',
    review: 'pending',
    summary: 'This sample result is still being simulated and will appear shortly.',
    markers: [],
    isDemo: true,
  },
  {
    id: 'tr_04',
    code: 'CL-DEMO-LAB-4468',
    name: 'Fasting Blood Sugar',
    lab: 'PathCare Laboratories (Sample)',
    doctor: 'Dr. Chiamaka Eze',
    collected: atOffset(-40, 8, 0),
    reported: atOffset(-39, 12, 0),
    status: 'ready',
    review: 'reviewed',
    summary: 'Archived sample result retained for interface demonstration.',
    markers: [
      { name: 'Fasting glucose', value: '5.2', unit: 'mmol/L', range: '3.9 – 5.5', flag: 'normal' },
    ],
    isDemo: true,
  },
]

/* ------------------------------------------------------------------ */
/*  Prescriptions (demo)                                               */
/* ------------------------------------------------------------------ */
export const prescriptions = [
  {
    id: 'rx_01',
    code: 'CL-DEMO-RX-9021',
    doctor: 'Dr. Chiamaka Eze',
    issued: atOffset(-6, 14, 0),
    validUntil: atOffset(24, 14, 0),
    status: 'ready',
    pharmacy: 'HealthPlus Pharmacy, Lekki (Sample)',
    diagnosis: 'Sample entry — no real diagnosis is made in this prototype.',
    medications: [
      {
        name: 'Amlodipine 5mg',
        direction: 'Take one tablet once daily (sample text)',
        duration: '30 days (sample)',
        quantity: '30 tablets (sample)',
        refill: 'No refills in demo',
      },
      {
        name: 'Vitamin D 1000IU',
        direction: 'Take one capsule daily with food (sample text)',
        duration: '30 days (sample)',
        quantity: '30 capsules (sample)',
        refill: 'No refills in demo',
      },
    ],
    isDemo: true,
  },
  {
    id: 'rx_02',
    code: 'CL-DEMO-RX-9018',
    doctor: 'Dr. Tunde Bakare',
    issued: atOffset(-12, 10, 30),
    validUntil: atOffset(18, 10, 30),
    status: 'collected',
    pharmacy: 'MedPoint Pharmacy, Ikeja (Sample)',
    diagnosis: 'Sample entry — no real diagnosis is made in this prototype.',
    medications: [
      {
        name: 'Paracetamol 500mg',
        direction: 'Take two tablets up to four times daily when needed (sample text)',
        duration: '5 days (sample)',
        quantity: '40 tablets (sample)',
        refill: 'No refills in demo',
      },
    ],
    isDemo: true,
  },
  {
    id: 'rx_03',
    code: 'CL-DEMO-RX-9009',
    doctor: 'Dr. Amina Yusuf',
    issued: atOffset(-25, 9, 0),
    validUntil: atOffset(5, 9, 0),
    status: 'expiring',
    pharmacy: 'Cedar Pharmacy, Abuja (Sample)',
    diagnosis: 'Sample entry — no real diagnosis is made in this prototype.',
    medications: [
      {
        name: 'Cetirizine 10mg',
        direction: 'Take one tablet at night (sample text)',
        duration: '10 days (sample)',
        quantity: '10 tablets (sample)',
        refill: 'No refills in demo',
      },
    ],
    isDemo: true,
  },
]

/* ------------------------------------------------------------------ */
/*  Pharmacy (demo products & demo prices)                             */
/* ------------------------------------------------------------------ */
export const pharmacyProducts = [
  {
    id: 'ph_01',
    name: 'Digital Blood Pressure Monitor',
    category: 'Devices',
    price: 24500,
    rating: 4.7,
    reviews: 88,
    inStock: true,
    requiresRx: false,
    brand: 'Sample brand',
    image:
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=480&q=70',
    blurb: 'Sample listing for a home monitoring device.',
  },
  {
    id: 'ph_02',
    name: 'Vitamin C 1000mg (60 tablets)',
    category: 'Vitamins',
    price: 6500,
    rating: 4.6,
    reviews: 214,
    inStock: true,
    requiresRx: false,
    brand: 'Sample brand',
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=480&q=70',
    blurb: 'Sample listing — not a recommendation to buy or use.',
  },
  {
    id: 'ph_03',
    name: 'Hand Sanitiser 500ml',
    category: 'Personal care',
    price: 2800,
    rating: 4.8,
    reviews: 402,
    inStock: true,
    requiresRx: false,
    brand: 'Sample brand',
    image:
      'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=480&q=70',
    blurb: 'Sample listing for everyday hygiene.',
  },
  {
    id: 'ph_04',
    name: 'Surgical Face Masks (50 pack)',
    category: 'Personal care',
    price: 3500,
    rating: 4.5,
    reviews: 176,
    inStock: true,
    requiresRx: false,
    brand: 'Sample brand',
    image:
      'https://images.unsplash.com/photo-1586942593568-29361efcd571?auto=format&fit=crop&w=480&q=70',
    blurb: 'Sample listing for everyday protection.',
  },
  {
    id: 'ph_05',
    name: 'Digital Thermometer',
    category: 'Devices',
    price: 7900,
    rating: 4.4,
    reviews: 131,
    inStock: true,
    requiresRx: false,
    brand: 'Sample brand',
    image:
      'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=480&q=70',
    blurb: 'Sample listing for home temperature checks.',
  },
  {
    id: 'ph_06',
    name: 'Multivitamin Syrup 200ml',
    category: 'Vitamins',
    price: 5200,
    rating: 4.3,
    reviews: 96,
    inStock: false,
    requiresRx: false,
    brand: 'Sample brand',
    image:
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=480&q=70',
    blurb: 'Sample listing — restock simulated.',
  },
  {
    id: 'ph_07',
    name: 'First Aid Kit (40 pieces)',
    category: 'Devices',
    price: 12500,
    rating: 4.7,
    reviews: 64,
    inStock: true,
    requiresRx: false,
    brand: 'Sample brand',
    image:
      'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=480&q=70',
    blurb: 'Sample listing for a household kit.',
  },
  {
    id: 'ph_08',
    name: 'Prescription Item (demo)',
    category: 'Prescription',
    price: 9800,
    rating: 4.2,
    reviews: 21,
    inStock: true,
    requiresRx: true,
    brand: 'Sample brand',
    image:
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=480&q=70',
    blurb: 'Sample listing — a demo prescription check is simulated.',
  },
]

export const pharmacyCategories = [
  'All',
  ...Array.from(new Set(pharmacyProducts.map((p) => p.category))),
]

/* ------------------------------------------------------------------ */
/*  Health records (sample)                                            */
/* ------------------------------------------------------------------ */
export const healthRecords = [
  {
    id: 'rec_01',
    type: 'Consultation',
    title: 'Annual general check-up',
    provider: 'Wellness Point Medical, Ikeja',
    date: atOffset(-9, 9, 0),
    clinician: 'Dr. Tunde Bakare',
    summary: 'Sample consultation note: routine check-up recorded for interface demonstration.',
    attachment: 'sample-note.pdf',
  },
  {
    id: 'rec_02',
    type: 'Laboratory',
    title: 'Full Blood Count (FBC)',
    provider: 'PathCare Laboratories (Sample)',
    date: atOffset(-5, 16, 0),
    clinician: 'Dr. Tunde Bakare',
    summary: 'Sample laboratory report with reference windows. Not a diagnosis.',
    attachment: 'sample-fbc.pdf',
  },
  {
    id: 'rec_03',
    type: 'Imaging',
    title: 'Chest X-Ray (single view)',
    provider: 'Sky Radiology (Sample)',
    date: atOffset(-60, 11, 0),
    clinician: 'Dr. Ngozi Obi',
    summary: 'Sample imaging report entry retained for demonstration.',
    attachment: 'sample-xray.pdf',
  },
  {
    id: 'rec_04',
    type: 'Prescription',
    title: 'Amlodipine 5mg — 30 days',
    provider: 'HealthPlus Pharmacy, Lekki (Sample)',
    date: atOffset(-6, 14, 0),
    clinician: 'Dr. Chiamaka Eze',
    summary: 'Sample prescription record. No real medication was dispensed.',
    attachment: 'sample-rx.pdf',
  },
  {
    id: 'rec_05',
    type: 'Immunisation',
    title: 'Seasonal flu vaccination (sample)',
    provider: 'Lagos Community Clinic (Sample)',
    date: atOffset(-140, 10, 0),
    clinician: 'Nurse Bisi Adeyemo (Sample)',
    summary: 'Sample immunisation entry for interface demonstration.',
    attachment: 'sample-imm.pdf',
  },
  {
    id: 'rec_06',
    type: 'Consultation',
    title: 'Paediatric growth review',
    provider: "Cedarcrest Children's Clinic, Abuja",
    date: atOffset(-33, 10, 0),
    clinician: 'Dr. Amina Yusuf',
    summary: 'Sample consultation note recorded for interface demonstration.',
    attachment: 'sample-growth.pdf',
  },
]

export const recordTypes = ['All records', 'Consultation', 'Laboratory', 'Imaging', 'Prescription', 'Immunisation']

/* ------------------------------------------------------------------ */
/*  Consultation simulation                                            */
/* ------------------------------------------------------------------ */
export const consultationScript = [
  { id: 'cs_1', from: 'doctor', text: 'Hello Adaeze — welcome to this simulated consultation room.', time: 'Just now' },
  { id: 'cs_2', from: 'doctor', text: 'This is a scripted demo exchange. Nothing you see here is real medical advice.', time: 'Just now' },
  { id: 'cs_3', from: 'patient', text: 'Understood — I’m just exploring the prototype.', time: 'Just now' },
  { id: 'cs_4', from: 'doctor', text: 'Perfect. Use the controls below to experience the waiting-room flow.', time: 'Just now' },
]

export const demoNotifications = [
  { id: 'nt_1', title: 'Demo appointment confirmed', body: 'Your sample appointment with Dr. Chiamaka Eze is set for today.', time: '2h ago', tone: 'info' },
  { id: 'nt_2', title: 'Mock test result ready', body: 'A sample Full Blood Count report is available in Records.', time: '1d ago', tone: 'success' },
  { id: 'nt_3', title: 'Demo prescription expiring', body: 'Sample prescription CL-DEMO-RX-9009 expires soon.', time: '2d ago', tone: 'warning' },
]

export const quickLinks = [
  { id: 'ql_1', label: 'Book a demo appointment', to: '/doctors' },
  { id: 'ql_2', label: 'Open my sample records', to: '/health-records' },
  { id: 'ql_3', label: 'Browse demo pharmacy', to: '/pharmacy' },
]

export const homeHighlights = [
  {
    id: 'hh_1',
    title: 'One care timeline',
    body: 'Appointments, sample results and demo prescriptions in a single view.',
    image:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=70',
    alt: 'Sample hospital corridor photograph used for demonstration',
  },
  {
    id: 'hh_2',
    title: 'Nigerian doctors, sample profiles',
    body: 'Browse demo specialists across Lagos, Abuja, Kano and Port Harcourt.',
    image:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=70',
    alt: 'Sample medical professional photograph used for demonstration',
  },
  {
    id: 'hh_3',
    title: 'Simulated pharmacy & labs',
    body: 'Explore demo prices and mock results with no real transaction involved.',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=70',
    alt: 'Sample healthcare setting photograph used for demonstration',
  },
]

export const serviceHighlights = [
  { id: 'sv_1', title: 'Book & reschedule', body: 'Demo slots with instant simulated confirmation.', icon: 'calendar' },
  { id: 'sv_2', title: 'Simulated consults', body: 'A scripted waiting room — never a real video call.', icon: 'video' },
  { id: 'sv_3', title: 'Sample records', body: 'Filter and preview mock results and notes.', icon: 'folder' },
  { id: 'sv_4', title: 'Demo pharmacy', body: 'Browse sample products and a local cart.', icon: 'pill' },
]

export const dayLabelFor = dayLabel
