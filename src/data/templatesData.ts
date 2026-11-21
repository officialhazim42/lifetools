/**
 * Comprehensive Templates & Document Catalog for LifeTools
 * 40 Complete, Functional Templates across Business, Student, Personal & Professional.
 */

import { TemplateDefinition } from '../types/templates';

export const TEMPLATES_DATA: TemplateDefinition[] = [
  // ==========================================
  // SECTION A: BUSINESS TEMPLATES (10)
  // ==========================================
  {
    id: 'invoice-generator',
    name: 'Invoice Generator',
    category: 'business',
    shortDescription: 'Professional commercial sales invoice with tax, discount, itemized billing, and banking terms.',
    iconName: 'Receipt',
    tags: ['invoice', 'billing', 'tax', 'gst', 'business'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#059669', // Emerald
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'TAX INVOICE',
      footerNote: 'Thank you for your business. Payment is due within 15 days of invoice date.'
    },
    defaultData: {
      documentNo: 'INV-2026-001',
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      senderName: '',
      senderAddress: '',
      clientName: '',
      clientAddress: '',
      taxRate: 18,
      discountAmount: 0,
      currency: '₹',
      bankDetails: ''
    },
    sections: [
      {
        id: 'items',
        title: 'Line Items',
        items: [
          { id: '1', description: 'Web Application UI/UX Design & Architecture', quantity: 1, rate: 45000, amount: 45000 },
          { id: '2', description: 'Frontend React & TypeScript Implementation', quantity: 1, rate: 65000, amount: 65000 },
          { id: '3', description: 'Offline PWA & Service Worker Configuration', quantity: 1, rate: 15000, amount: 15000 }
        ]
      }
    ]
  },
  {
    id: 'quotation-generator',
    name: 'Quotation Generator',
    category: 'business',
    shortDescription: 'Formal price quote and project estimate with validity terms and itemized pricing.',
    iconName: 'BadgePercent',
    tags: ['quote', 'quotation', 'estimate', 'pricing', 'proposal'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#2563eb', // Blue
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'PRICE QUOTATION',
      footerNote: 'This quotation is valid for 30 calendar days from the date of issue.'
    },
    defaultData: {
      documentNo: 'QUO-2026-088',
      date: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      senderName: '',
      senderAddress: '',
      clientName: '',
      clientAddress: '',
      taxRate: 18,
      currency: '₹',
      terms: '50% advance upon contract signing. Remaining 50% upon project delivery.'
    },
    sections: [
      {
        id: 'items',
        title: 'Proposed Scope & Pricing',
        items: [
          { id: '1', description: 'Brand Identity & Vector Logo Suite', quantity: 1, rate: 25000, amount: 25000 },
          { id: '2', description: 'Responsive Corporate Website (5 Pages)', quantity: 1, rate: 40000, amount: 40000 },
          { id: '3', description: 'Search Engine Optimization Setup', quantity: 1, rate: 12000, amount: 12000 }
        ]
      }
    ]
  },
  {
    id: 'receipt-generator',
    name: 'Receipt Generator',
    category: 'business',
    shortDescription: 'Cash, UPI, or bank payment acknowledgment receipt with digital signature line.',
    iconName: 'CreditCard',
    tags: ['receipt', 'payment', 'cash', 'acknowledgment'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#0d9488', // Teal
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'PAYMENT RECEIPT',
      footerNote: 'This is a computer-generated receipt requiring no physical stamp.'
    },
    defaultData: {
      documentNo: 'REC-2026-442',
      date: new Date().toISOString().slice(0, 10),
      senderName: '',
      senderAddress: '',
      receivedFrom: '',
      amountInWords: 'Thirty-Five Thousand Rupees Only',
      paymentMethod: 'UPI / Online Transfer',
      referenceNo: '',
      paymentFor: 'Building construction materials & electrical fixtures',
      totalAmount: 35000,
      currency: '₹'
    },
    sections: []
  },
  {
    id: 'purchase-order-generator',
    name: 'Purchase Order Generator',
    category: 'business',
    shortDescription: 'Official commercial purchase order (PO) authorizing vendor delivery and terms.',
    iconName: 'FileSpreadsheet',
    tags: ['purchase', 'order', 'po', 'procurement', 'vendor'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#4f46e5', // Indigo
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'PURCHASE ORDER',
      footerNote: 'Please acknowledge acceptance of this order by return email.'
    },
    defaultData: {
      documentNo: 'PO-2026-104',
      date: new Date().toISOString().slice(0, 10),
      deliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      buyerName: '',
      buyerAddress: '',
      vendorName: '',
      vendorAddress: '',
      shippingMethod: 'Express Freight Delivery',
      taxRate: 12,
      currency: '₹'
    },
    sections: [
      {
        id: 'items',
        title: 'Ordered Products',
        items: [
          { id: '1', description: 'Ergonomic Mesh Office Chairs (Grade A)', quantity: 10, rate: 8500, amount: 85000 },
          { id: '2', description: 'Motorized Height-Adjustable Standing Desks', quantity: 5, rate: 22000, amount: 110000 }
        ]
      }
    ]
  },
  {
    id: 'business-letter-generator',
    name: 'Business Letter Generator',
    category: 'business',
    shortDescription: 'Official corporate correspondence letterhead with formal layout and sign-off.',
    iconName: 'FileText',
    tags: ['letter', 'formal', 'corporate', 'memo', 'correspondence'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'merriweather',
      fontSize: 'standard',
      accentColor: '#1e293b',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'OFFICIAL CORRESPONDENCE',
      footerNote: 'Confidential corporate communication.'
    },
    defaultData: {
      senderCompany: '',
      senderAddress: '',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      recipientName: '',
      recipientTitle: '',
      recipientCompany: '',
      recipientAddress: '',
      subject: 'Proposal for Annual Software Maintenance Agreement (2026–2027)',
      salutation: 'Dear Mr. Sharma,',
      bodyParagraphs: `We are writing to formally submit our proposal for the renewal of our Annual Software Maintenance and Technical Support Agreement for the upcoming fiscal cycle.

Over the past two years, our engineering team has maintained a 99.98% platform uptime across your cloud infrastructure, successfully preventing downtime incidents while delivering proactive security patches.

Under the updated terms attached, we will be expanding our SLA to provide round-the-clock priority incident response alongside bi-weekly automated database performance tuning.

We look forward to continuing our productive partnership. Please let us know if you would like to schedule a review discussion this week.`,
      signOff: 'Sincerely,',
      signatoryName: '',
      signatoryTitle: ''
    },
    sections: []
  },
  {
    id: 'payment-voucher-generator',
    name: 'Payment Voucher',
    category: 'business',
    shortDescription: 'Accounting disbursement voucher recording debits, payment approvals, and authorization.',
    iconName: 'Coins',
    tags: ['voucher', 'debit', 'finance', 'accounting'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#d97706', // Amber
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'PAYMENT VOUCHER',
      footerNote: 'Passed for payment. Retain signed voucher for internal audit.'
    },
    defaultData: {
      voucherNo: 'PV-2026-902',
      date: new Date().toISOString().slice(0, 10),
      paidTo: '',
      amount: 14500,
      currency: '₹',
      amountInWords: 'Fourteen Thousand Five Hundred Rupees Only',
      accountHead: 'Office Utilities & High-Speed Internet',
      paymentMode: 'NEFT Bank Transfer',
      chequeOrUpiRef: '',
      preparedBy: '',
      authorizedBy: ''
    },
    sections: []
  },
  {
    id: 'delivery-challan-generator',
    name: 'Delivery Challan',
    category: 'business',
    shortDescription: 'Goods dispatch note for warehouse transport and consignee delivery verification.',
    iconName: 'Boxes',
    tags: ['challan', 'delivery', 'dispatch', 'shipping', 'transport'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#2563eb',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'DELIVERY CHALLAN',
      footerNote: 'Goods once dispatched should be inspected upon arrival. Report shortages within 24 hours.'
    },
    defaultData: {
      challanNo: 'DC-2026-512',
      date: new Date().toISOString().slice(0, 10),
      dispatchFrom: '',
      consigneeName: '',
      consigneeAddress: '',
      vehicleNo: '',
      driverName: '',
      driverContact: ''
    },
    sections: [
      {
        id: 'items',
        title: 'Dispatched Goods',
        items: [
          { id: '1', description: 'Desktop Computer Units (Core i5, 16GB, 512GB SSD)', quantity: 20, note: 'Sealed Cartons' },
          { id: '2', description: '24-Inch IPS Full HD Monitors', quantity: 20, note: 'Fragile Glass' },
          { id: '3', description: 'Gigabit Network Switches (24 Ports)', quantity: 2, note: 'Rack Mounted' }
        ]
      }
    ]
  },
  {
    id: 'business-card-maker',
    name: 'Business Card Maker',
    category: 'business',
    shortDescription: 'Clean executive visiting card with printable A4 multi-card grid layout.',
    iconName: 'CreditCard',
    tags: ['business card', 'visiting card', 'contact', 'networking'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#0284c7', // Sky
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'EXECUTIVE BUSINESS CARDS',
      footerNote: 'Cut along standard guidelines. Printable 8-up on heavy cardstock (300 GSM).'
    },
    defaultData: {
      fullName: '',
      urduName: '',
      jobTitle: '',
      company: '',
      phone: '',
      email: '',
      website: '',
      location: '',
      tagline: 'Professional Digital Utilities'
    },
    sections: []
  },
  {
    id: 'price-list-generator',
    name: 'Price List Generator',
    category: 'business',
    shortDescription: 'Product price tariff sheet with SKU codes, unit categories, and wholesale rates.',
    iconName: 'ListOrdered',
    tags: ['price list', 'catalog', 'pricing', 'retail', 'wholesale'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#059669',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'OFFICIAL PRODUCT PRICE LIST',
      footerNote: 'Prices are subject to revision with 15 days prior notice. All taxes applicable as per law.'
    },
    defaultData: {
      companyName: '',
      effectiveDate: 'November 2026',
      currency: '₹',
      contactInfo: ''
    },
    sections: [
      {
        id: 'items',
        title: 'Available Products & Rates',
        items: [
          { id: '1', description: 'Product / Service Package A', rate: 250, note: 'Standard unit' },
          { id: '2', description: 'Product / Service Package B', rate: 750, note: 'Business tier' },
          { id: '3', description: 'Product / Service Package C', rate: 1500, note: 'Enterprise tier' },
          { id: '4', description: 'Support & Maintenance Add-on', rate: 500, note: 'Annual coverage' }
        ]
      }
    ]
  },
  {
    id: 'product-catalogue-generator',
    name: 'Product Catalogue Generator',
    category: 'business',
    shortDescription: 'Multi-item product showcase catalogue with descriptions, specifications, and images.',
    iconName: 'Boxes',
    tags: ['catalogue', 'products', 'inventory', 'showcase'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#7c3aed', // Purple
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'PRODUCT SHOWCASE CATALOGUE',
      footerNote: 'For bulk enterprise orders, contact corporate sales for custom contract rates.'
    },
    defaultData: {
      brandName: '',
      season: 'Winter 2026 Collection',
      currency: '₹',
      intro: 'Crafted with sustainable plantation timber and hand-finished for minimalist living spaces.'
    },
    sections: [
      {
        id: 'items',
        title: 'Featured Collection',
        items: [
          { id: '1', description: 'Solid Walnut Coffee Table', rate: 18500, note: 'Dimensions: 110 x 60 x 45 cm. Matte poly-lacquer finish.' },
          { id: '2', description: 'Minimalist Oak Bookshelf', rate: 24000, note: '5 Open Shelves. Heavy-duty concealed wall brackets.' },
          { id: '3', description: 'Ergonomic Lounge Armchair', rate: 32000, note: 'Boucle fabric upholstery with natural ash wood legs.' }
        ]
      }
    ]
  },

  // ==========================================
  // SECTION B: STUDENT TEMPLATES (10)
  // ==========================================
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    category: 'student',
    shortDescription: 'Clean, ATS-friendly curriculum vitae with education, work history, and skills.',
    iconName: 'GraduationCap',
    tags: ['resume', 'cv', 'career', 'job', 'bio'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#2563eb',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'CURRICULUM VITAE',
      footerNote: 'References available upon request.'
    },
    defaultData: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      portfolio: '',
      summary: 'Experienced and results-oriented professional specializing in software architecture, modern web development, and client-side systems.',
      education: 'Bachelor of Technology in Computer Science Engineering\nUniversity / Institute Name | 2020 – 2024',
      experience: `Software Engineer | Technology Company (2022 – Present)\n• Designed and maintained performant web applications with responsive user interfaces.\n• Implemented secure client-side data storage and optimized asset delivery pipelines.\n• Collaborated with cross-functional teams to deliver scalable features.`,
      skills: 'TypeScript, React 18, Vite, Tailwind CSS, IndexedDB, Web Crypto API, Node.js, Python, Git'
    },
    sections: []
  },
  {
    id: 'cover-letter-generator',
    name: 'Cover Letter Generator',
    category: 'student',
    shortDescription: 'Persuasive job or internship application letter tailored for company hiring teams.',
    iconName: 'FileText',
    tags: ['cover letter', 'job application', 'hiring', 'career'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'merriweather',
      fontSize: 'standard',
      accentColor: '#1e293b',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'COVER LETTER',
      footerNote: 'Thank you for your time and consideration.'
    },
    defaultData: {
      applicantName: '',
      applicantContact: '',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      hiringManager: 'Hiring Team',
      companyName: '',
      companyAddress: '',
      targetRole: 'Software Engineer',
      letterBody: `I am writing to express my strong enthusiasm for the Software Engineer position at [Company Name]. Having followed your company's innovative work, I am eager to contribute my technical background and problem-solving skills to your engineering roadmap.\n\nThroughout my experience, I have developed modern, reliable web applications with a focus on code quality, performance, and user experience. My background aligns well with your team's focus on scalable systems and high-quality software architecture.\n\nI welcome the opportunity to discuss how my experience and dedication will deliver immediate value to your organization.`,
      signOff: 'Sincerely,',
      signature: ''
    },
    sections: []
  },
  {
    id: 'assignment-cover-page',
    name: 'Assignment Cover Page',
    category: 'student',
    shortDescription: 'Formal academic front sheet with course title, roll number, and faculty submission fields.',
    iconName: 'GraduationCap',
    tags: ['assignment', 'cover page', 'university', 'college', 'homework'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'merriweather',
      fontSize: 'standard',
      accentColor: '#1e3a8a', // Deep Blue
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'ACADEMIC SUBMISSION',
      footerNote: 'Submitted in partial fulfillment of course requirements.'
    },
    defaultData: {
      universityName: 'UNIVERSITY / COLLEGE NAME',
      department: 'Department of Computer Science & Information Technology',
      courseCode: 'CS-502: Advanced Algorithms & Data Structures',
      assignmentTitle: 'Design and Analysis of Self-Balancing Binary Trees & Asymptotic Bounds',
      studentName: '',
      rollNumber: '',
      semester: 'Semester V (Autumn 2026)',
      submittedTo: 'Faculty Instructor Name',
      submissionDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    sections: []
  },
  {
    id: 'project-report-cover',
    name: 'Project Report Cover',
    category: 'student',
    shortDescription: 'Professional engineering or thesis report title page with institutional credentials.',
    iconName: 'FileCode2',
    tags: ['report', 'thesis', 'project', 'capstone', 'cover'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'playfair',
      fontSize: 'standard',
      accentColor: '#0f172a',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'MAJOR CAPSTONE PROJECT REPORT',
      footerNote: 'National Institute of Technology | Academic Year 2025–2026'
    },
    defaultData: {
      projectTitle: 'MAJOR CAPSTONE PROJECT REPORT',
      subtitle: 'A Major Project Dissertation submitted in partial fulfillment of the degree of Bachelor of Technology in Computer Science',
      institutionName: 'INSTITUTE / UNIVERSITY NAME',
      submittedBy: '',
      projectGuide: 'Under the guidance of [Faculty Guide Name]',
      academicSession: 'Session 2025 – 2026'
    },
    sections: []
  },
  {
    id: 'study-timetable-template',
    name: 'Study Timetable',
    category: 'student',
    shortDescription: 'Weekly academic revision schedule with subject blocks, breaks, and study goals.',
    iconName: 'Clock',
    tags: ['study', 'timetable', 'schedule', 'revision', 'exams'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#6366f1', // Indigo
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'WEEKLY STUDY & REVISION TIMETABLE',
      footerNote: 'Consistency beats intensity. Take a 10-minute break after every 50-minute study block.'
    },
    defaultData: {
      studentName: '',
      examTarget: 'Semester Final Examinations (Dec 2026)',
      weeklyGoal: 'Complete 30 hours of focused revision and solve 5 past year question papers.'
    },
    sections: [
      {
        id: 'days',
        title: 'Weekly Time Blocks',
        items: [
          { id: '1', description: 'Monday (06:00 - 08:30)', note: 'Data Structures & Algorithms: Graphs & Trees' },
          { id: '2', description: 'Tuesday (06:00 - 08:30)', note: 'Operating Systems: Virtual Memory & Concurrency' },
          { id: '3', description: 'Wednesday (06:00 - 08:30)', note: 'Database Management Systems: Normalization & Indexing' },
          { id: '4', description: 'Thursday (06:00 - 08:30)', note: 'Computer Networks: TCP/IP Stack & Cryptography' },
          { id: '5', description: 'Friday (06:00 - 08:30)', note: 'Software Engineering: System Design & Testing Patterns' },
          { id: '6', description: 'Saturday (10:00 - 14:00)', note: 'Past Papers Mock Exam & Self-Evaluation' },
          { id: '7', description: 'Sunday (10:00 - 12:00)', note: 'Weekly Weak Areas Review & Formula Flashcards' }
        ]
      }
    ]
  },
  {
    id: 'class-timetable-template',
    name: 'Class Timetable',
    category: 'student',
    shortDescription: 'School or university course timetable with periods, room numbers, and professors.',
    iconName: 'Calendar',
    tags: ['class', 'timetable', 'periods', 'schedule', 'college'],
    defaultPageFormat: 'a4-landscape',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#0891b2', // Cyan
      textColor: '#0f172a',
      pageFormat: 'a4-landscape',
      showLogo: false,
      headerTitle: 'ACADEMIC CLASS SCHEDULE',
      footerNote: 'Attendance is mandatory for all lab practical sessions.'
    },
    defaultData: {
      institution: 'School of Engineering & Technology',
      departmentClass: 'B.Tech CSE — 5th Semester (Section A)',
      academicRoom: 'Lecture Hall 302 / Software Lab 4'
    },
    sections: [
      {
        id: 'periods',
        title: 'Schedule Matrix',
        items: [
          { id: '1', description: '09:00 – 10:00 AM', note: 'Mon: Algorithms | Tue: OS | Wed: DBMS | Thu: Networks | Fri: SE' },
          { id: '2', description: '10:00 – 11:00 AM', note: 'Mon: OS | Tue: Networks | Wed: Algorithms | Thu: DBMS | Fri: Math' },
          { id: '3', description: '11:15 – 12:15 PM', note: 'Mon: DBMS | Tue: Algorithms | Wed: OS | Thu: Math | Fri: Networks' },
          { id: '4', description: '01:30 – 04:30 PM', note: 'Mon: OS Lab | Tue: Web Tech Lab | Wed: Networks Lab | Thu: Project Work' }
        ]
      }
    ]
  },
  {
    id: 'attendance-sheet-template',
    name: 'Attendance Sheet',
    category: 'student',
    shortDescription: 'Classroom roll call sheet tracking daily attendance and monthly percentages.',
    iconName: 'Users',
    tags: ['attendance', 'roll call', 'students', 'teacher', 'roster'],
    defaultPageFormat: 'a4-landscape',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#16a34a', // Green
      textColor: '#0f172a',
      pageFormat: 'a4-landscape',
      showLogo: false,
      headerTitle: 'STUDENT ATTENDANCE RECORD',
      footerNote: 'Minimum 75% attendance required to qualify for end-semester examinations.'
    },
    defaultData: {
      courseName: 'CS-401: Advanced Data Structures Lab',
      monthYear: 'November 2026',
      instructorName: 'Prof. Tariq Ahmad Mir'
    },
    sections: [
      {
        id: 'students',
        title: 'Student Roster',
        items: [
          { id: '1', description: 'Roll 01: Aamir Hussain', note: 'Present: 22 / 24 (91.6%)' },
          { id: '2', description: 'Roll 02: Basit Bilal', note: 'Present: 24 / 24 (100.0%)' },
          { id: '3', description: 'Roll 03: Danish Qadir', note: 'Present: 20 / 24 (83.3%)' },
          { id: '4', description: 'Student 04', note: 'Present: 24 / 24 (100.0%)' },
          { id: '5', description: 'Roll 05: Ishfaq Ahmad', note: 'Present: 21 / 24 (87.5%)' }
        ]
      }
    ]
  },
  {
    id: 'study-notes-template',
    name: 'Study Notes Template',
    category: 'student',
    shortDescription: 'Cornell note-taking method layout with cues, detailed notes, and bottom summary.',
    iconName: 'AlignLeft',
    tags: ['cornell', 'notes', 'study', 'lecture', 'summary'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#9333ea', // Purple
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'CORNELL LECTURE NOTES',
      footerNote: 'Review notes within 24 hours to maximize retention according to the forgetting curve.'
    },
    defaultData: {
      topicTitle: 'Asymptotic Analysis & Big-O Notation',
      courseName: 'CS-301: Algorithms',
      date: new Date().toISOString().slice(0, 10),
      cueQuestions: `• What is Big-O notation?
• Difference between Big-O, Big-Omega & Big-Theta?
• Why do constant factors get dropped?
• Space vs Time complexity tradeoffs?`,
      lectureNotes: `1. Big-O ($O(n)$) represents the tight upper bound on execution steps as input size $n$ approaches infinity.
2. Big-Omega ($\Omega(n)$) represents the lower bound (best-case performance).
3. Big-Theta ($\Theta(n)$) represents tight bound where upper and lower growth rates coincide.
4. Rules of Dominance:
   $O(1) < O(\log n) < O(n) < O(n \log n) < O(n^2) < O(2^n) < O(n!)$
5. Always state space complexity for recursive stacks ($O(d)$ where $d$ is recursion tree depth).`,
      summary: 'Asymptotic notation provides a hardware-independent mathematical framework to evaluate algorithm scalability. In practice, focus on average-case $\Theta$ while bounding worst-case $O$.'
    },
    sections: []
  },
  {
    id: 'certificate-template',
    name: 'Certificate Template',
    category: 'student',
    shortDescription: 'Formal Certificate of Completion or Achievement with elegant borders and signatures.',
    iconName: 'Sparkles',
    tags: ['certificate', 'award', 'completion', 'diploma', 'achievement'],
    defaultPageFormat: 'a4-landscape',
    defaultStyling: {
      font: 'playfair',
      fontSize: 'standard',
      accentColor: '#b45309', // Gold / Amber
      textColor: '#0f172a',
      pageFormat: 'a4-landscape',
      showLogo: false,
      headerTitle: 'CERTIFICATE OF ACHIEVEMENT',
      footerNote: 'Issued under the authority of the certifying board.'
    },
    defaultData: {
      institution: 'LIFETOOLS DIGITAL ACADEMY',
      awardPreamble: 'This is proudly presented to',
      recipientName: '',
      citation: 'for successfully completing the comprehensive advanced program in Client-Side Web Architecture, Web Crypto Security, and Offline Progressive Web Application Development with distinction.',
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      instructorSign: 'Director of Academic Affairs',
      authoritySign: 'Program Coordinator'
    },
    sections: []
  },
  {
    id: 'exam-preparation-planner',
    name: 'Exam Preparation Planner',
    category: 'student',
    shortDescription: 'Countdown planner with subject chapters, priority ratings, and mock test scores.',
    iconName: 'Hourglass',
    tags: ['exam', 'planner', 'test', 'preparation', 'countdown'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#e11d48', // Rose
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'EXAM READINESS PLANNER',
      footerNote: 'Master high-weightage topics first before moving to low-priority chapters.'
    },
    defaultData: {
      examTitle: 'University Semester Finals — December 2026',
      totalDaysLeft: '24 Days Remaining',
      strategyNote: 'Daily target: Complete 2 theory chapters and 1 past paper problem set.'
    },
    sections: [
      {
        id: 'chapters',
        title: 'High-Priority Syllabus Checklist',
        items: [
          { id: '1', description: 'Data Structures: Dynamic Programming & Memoization', status: 'Completed (Confidence: 5/5)' },
          { id: '2', description: 'Operating Systems: Deadlock Detection & Paging', status: 'In Progress (Confidence: 4/5)' },
          { id: '3', description: 'Computer Networks: Routing Protocols (OSPF/BGP)', status: 'Pending (Confidence: 2/5)' },
          { id: '4', description: 'Database Systems: B-Trees & ACID Transactions', status: 'Completed (Confidence: 5/5)' }
        ]
      }
    ]
  },

  // ==========================================
  // SECTION C: PERSONAL TEMPLATES (10)
  // ==========================================
  {
    id: 'daily-planner-template',
    name: 'Daily Planner',
    category: 'personal',
    shortDescription: 'Productive single-day schedule with top 3 priorities, hourly timebox, and habit tracker.',
    iconName: 'CalendarDays',
    tags: ['daily', 'planner', 'schedule', 'todo', 'habits'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#059669',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'DAILY PRODUCTIVITY PLANNER',
      footerNote: 'Focus on what matters most. Win the day one hour at a time.'
    },
    defaultData: {
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      topPriority1: 'Complete Templates & Document Creator implementation',
      topPriority2: 'Run full Vitest test suite and resolve edge cases',
      topPriority3: 'Evening 45-minute fitness walk',
      waterTracker: '8 Glasses (● ● ● ● ● ○ ○ ○)',
      notesGratitude: 'Grateful for clean code, fast compiler feedback, and productive morning energy.'
    },
    sections: [
      {
        id: 'hourly',
        title: 'Hourly Timebox Schedule',
        items: [
          { id: '1', description: '07:00 AM – 08:30 AM', note: 'Morning routine, reading & quick healthy breakfast' },
          { id: '2', description: '09:00 AM – 01:00 PM', note: 'Deep Work: Core feature engineering & architecture' },
          { id: '3', description: '01:00 PM – 02:00 PM', note: 'Lunch break, relaxation & recharge' },
          { id: '4', description: '02:00 PM – 05:30 PM', note: 'Secondary tasks, unit testing & documentation' },
          { id: '5', description: '06:00 PM – 07:30 PM', note: 'Outdoor exercise, walk & family time' },
          { id: '6', description: '08:30 PM – 10:00 PM', note: 'Dinner, reading & next day preparation' }
        ]
      }
    ]
  },
  {
    id: 'weekly-planner-template',
    name: 'Weekly Planner',
    category: 'personal',
    shortDescription: 'Monday to Sunday weekly overview with weekly targets and reflection notes.',
    iconName: 'Calendar',
    tags: ['weekly', 'planner', 'overview', 'goals'],
    defaultPageFormat: 'a4-landscape',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#2563eb',
      textColor: '#0f172a',
      pageFormat: 'a4-landscape',
      showLogo: false,
      headerTitle: 'WEEKLY MASTER PLANNER',
      footerNote: 'Review weekly progress every Sunday evening to recalibrate goals.'
    },
    defaultData: {
      weekRange: 'Week 47 — November 2026',
      weeklyFocus: 'Launch LifeTools Templates & Document Creator Suite'
    },
    sections: [
      {
        id: 'days',
        title: 'Daily Milestones',
        items: [
          { id: '1', description: 'Monday', note: 'Design document types, template catalog schema & interfaces' },
          { id: '2', description: 'Tuesday', note: 'Build reusable DocumentEditor component with live A4 preview' },
          { id: '3', description: 'Wednesday', note: 'Implement 40 templates across Business, Student, Personal & Professional' },
          { id: '4', description: 'Thursday', note: 'Integrate local storage drafts, PDF printing & backup export' },
          { id: '5', description: 'Friday', note: 'Write comprehensive automated test suite in Vitest' },
          { id: '6', description: 'Saturday', note: 'Verify responsiveness across mobile, tablet, and desktop' },
          { id: '7', description: 'Sunday', note: 'Code audit, production build validation & release documentation' }
        ]
      }
    ]
  },
  {
    id: 'monthly-planner-template',
    name: 'Monthly Planner',
    category: 'personal',
    shortDescription: 'Month-at-a-glance planning grid with important dates, habit milestones, and reviews.',
    iconName: 'CalendarClock',
    tags: ['monthly', 'planner', 'month', 'calendar', 'goals'],
    defaultPageFormat: 'a4-landscape',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#7c3aed',
      textColor: '#0f172a',
      pageFormat: 'a4-landscape',
      showLogo: false,
      headerTitle: 'MONTHLY HORIZON PLANNER',
      footerNote: 'A month of consistent small steps creates lasting yearly achievements.'
    },
    defaultData: {
      monthYear: 'November 2026',
      majorObjective: 'Complete LifeTools v1.3.0 release with 256 operational client-side utilities.',
      habitTarget: '30 consecutive days of habit tracker logging.'
    },
    sections: [
      {
        id: 'weeks',
        title: 'Weekly Milestones',
        items: [
          { id: '1', description: 'Week 1 (Nov 01 - 07)', note: 'Everyday Digital Utility Expansion (15 new tools)' },
          { id: '2', description: 'Week 2 (Nov 08 - 14)', note: 'My Workspace Integrated Personal Productivity Hub' },
          { id: '3', description: 'Week 3 (Nov 15 - 21)', note: 'Smart Settings Center & Universal Backup System' },
          { id: '4', description: 'Week 4 (Nov 22 - 30)', note: 'Templates & Document Creator Suite Launch' }
        ]
      }
    ]
  },
  {
    id: 'personal-budget-sheet',
    name: 'Personal Budget Sheet',
    category: 'personal',
    shortDescription: 'Income and monthly expense tracking sheet with categorized budgeting limits.',
    iconName: 'Wallet',
    tags: ['budget', 'expenses', 'finance', 'money', 'savings'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#059669',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'MONTHLY PERSONAL BUDGET',
      footerNote: 'Rule of thumb: 50% Needs, 30% Wants, 20% Savings & Debt Reduction.'
    },
    defaultData: {
      monthYear: 'November 2026',
      monthlyIncome: 85000,
      currency: '₹',
      targetSavings: 25000
    },
    sections: [
      {
        id: 'expenses',
        title: 'Budget Allocation by Category',
        items: [
          { id: '1', description: 'Housing & Utilities (Electricity, Fiber Internet)', rate: 18000, note: 'Fixed Essential' },
          { id: '2', description: 'Groceries, Fresh Produce & Dairy', rate: 15000, note: 'Fixed Essential' },
          { id: '3', description: 'Vehicle Fuel & Transportation', rate: 6500, note: 'Variable Essential' },
          { id: '4', description: 'Healthcare, Wellness & Fitness', rate: 4500, note: 'Essential' },
          { id: '5', description: 'Discretionary, Dining & Books', rate: 8000, note: 'Lifestyle' },
          { id: '6', description: 'Emergency Fund & SIP Investments', rate: 25000, note: 'Savings Target' }
        ]
      }
    ]
  },
  {
    id: 'grocery-list-template',
    name: 'Grocery List',
    category: 'personal',
    shortDescription: 'Categorized grocery shopping sheet organized by produce, dairy, bakery, and pantry.',
    iconName: 'Utensils',
    tags: ['grocery', 'food', 'supermarket', 'shopping', 'pantry'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#16a34a',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'WEEKLY GROCERY CHECKLIST',
      footerNote: 'Stick to the list to prevent impulsive grocery purchases.'
    },
    defaultData: {
      date: new Date().toISOString().slice(0, 10),
      storeName: ''
    },
    sections: [
      {
        id: 'produce',
        title: 'Fresh Produce & Fruit',
        items: [
          { id: '1', description: 'Fresh Apples & Bananas', quantity: 2, note: 'Kg' },
          { id: '2', description: 'Spinach & Salad Greens', quantity: 2, note: 'Bunches' },
          { id: '3', description: 'Tomatoes & Onions', quantity: 3, note: 'Kg' },
          { id: '4', description: 'Citrus & Fresh Herbs', quantity: 1, note: 'Pack' }
        ]
      },
      {
        id: 'pantry',
        title: 'Dairy & Pantry Essentials',
        items: [
          { id: '5', description: 'Fresh Milk & Yogurt', quantity: 2, note: 'Litres' },
          { id: '6', description: 'Whole Wheat Flour', quantity: 5, note: 'Kg' },
          { id: '7', description: 'Olive / Cooking Oil', quantity: 1, note: 'Litre' },
          { id: '8', description: 'Rice & Grains', quantity: 3, note: 'Kg' }
        ]
      }
    ]
  },
  {
    id: 'shopping-list-template',
    name: 'Shopping List',
    category: 'personal',
    shortDescription: 'General shopping list with estimated prices, priority stars, and store tags.',
    iconName: 'Boxes',
    tags: ['shopping', 'items', 'store', 'buy', 'retail'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#d97706',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'PRIORITY SHOPPING LIST',
      footerNote: 'Verify discount coupons and warranty terms before final checkout.'
    },
    defaultData: {
      budgetCap: 15000,
      currency: '₹',
      targetDate: new Date().toISOString().slice(0, 10)
    },
    sections: [
      {
        id: 'items',
        title: 'Planned Purchases',
        items: [
          { id: '1', description: 'Mechanical Keyboard (Brown Switches)', rate: 4500, note: '★ High Priority (Work)' },
          { id: '2', description: 'Winter Thermal Fleece Jacket', rate: 3200, note: '★ High Priority (Clothing)' },
          { id: '3', description: 'USB-C Fast Charging Multiport Hub (100W)', rate: 2400, note: '● Medium Priority' },
          { id: '4', description: 'Hardcover Programming Notebooks (Grid)', rate: 800, note: '● Medium Priority' }
        ]
      }
    ]
  },
  {
    id: 'travel-planner-template',
    name: 'Travel Planner',
    category: 'personal',
    shortDescription: 'Trip itinerary planner with flights, hotel bookings, places to visit, and budget.',
    iconName: 'Compass',
    tags: ['travel', 'vacation', 'itinerary', 'trip', 'flight'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#0284c7',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'TRAVEL ITINERARY PLANNER',
      footerNote: 'Keep digital and physical copies of passport, boarding passes, and hotel reservations.'
    },
    defaultData: {
      destination: '',
      travelDates: '',
      transportMode: '',
      hotelBooking: '',
      emergencyContact: ''
    },
    sections: [
      {
        id: 'itinerary',
        title: 'Day-by-Day Schedule',
        items: [
          { id: '1', description: 'Day 1: Arrival & Hotel Check-in', note: 'Flight arrival, transfer to hotel, evening city walk' },
          { id: '2', description: 'Day 2: City Landmarks & Guided Tour', note: 'Morning museum tour, historic district exploration' },
          { id: '3', description: 'Day 3: Outdoor Excursion & Activities', note: 'Scenic day trip and photography' },
          { id: '4', description: 'Day 4: Free Day & Local Cuisine', note: 'Local market shopping and dining' },
          { id: '5', description: 'Day 5: Hotel Check-out & Departure', note: 'Morning packing, airport transfer and flight home' }
        ]
      }
    ]
  },
  {
    id: 'packing-checklist-template',
    name: 'Packing Checklist',
    category: 'personal',
    shortDescription: 'Travel packing checklist organized by clothing, electronics, documents, and toiletries.',
    iconName: 'Boxes',
    tags: ['packing', 'checklist', 'luggage', 'travel', 'suitcase'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#0d9488',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'TRAVEL PACKING CHECKLIST',
      footerNote: 'Check airline baggage weight limits (15kg check-in / 7kg cabin) prior to departure.'
    },
    defaultData: {
      tripName: 'Winter Alpine Expedition',
      departureDate: '12 Dec 2026'
    },
    sections: [
      {
        id: 'docs',
        title: 'Essential Documents & Money',
        items: [
          { id: '1', description: 'Govt Issued Photo ID (Aadhaar / Passport / Driving License)', status: 'Packed' },
          { id: '2', description: 'Flight Boarding Passes & Hotel Reservation PDFs', status: 'Packed' },
          { id: '3', description: 'Emergency Cash (₹10,000) & Debit/Credit Cards', status: 'Packed' }
        ]
      },
      {
        id: 'clothing',
        title: 'Winter Warm Clothing',
        items: [
          { id: '4', description: 'Heavy Down Jacket (-15°C rated) & Waterproof Windbreaker', status: 'Packed' },
          { id: '5', description: 'Thermal Baselayer Tops & Bottoms (3 Sets)', status: 'Packed' },
          { id: '6', description: 'Waterproof Snow Boots with Rugged Grip & Woolen Socks', status: 'Packed' },
          { id: '7', description: 'Woolen Beanie, Thermal Gloves & Polarized Sunglasses', status: 'Packed' }
        ]
      },
      {
        id: 'tech',
        title: 'Electronics & Gadgets',
        items: [
          { id: '8', description: 'Laptop, Charger & High-Capacity 20,000mAh Power Bank', status: 'Packed' },
          { id: '9', description: 'Mirrorless Camera, Spare Batteries & High-Speed SD Cards', status: 'Packed' }
        ]
      }
    ]
  },
  {
    id: 'habit-tracker-sheet',
    name: 'Habit Tracker Sheet',
    category: 'personal',
    shortDescription: 'Monthly 31-day printable habit streak matrix with daily progress checkmarks.',
    iconName: 'Activity',
    tags: ['habits', 'tracker', 'streak', 'routine', 'discipline'],
    defaultPageFormat: 'a4-landscape',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#10b981', // Emerald
      textColor: '#0f172a',
      pageFormat: 'a4-landscape',
      showLogo: false,
      headerTitle: 'MONTHLY HABIT TRACKING MATRIX',
      footerNote: 'Don’t break the chain. 21 days builds a habit; 90 days builds a lifestyle.'
    },
    defaultData: {
      monthYear: 'November 2026',
      targetStreak: 'Goal: 25+ days per habit'
    },
    sections: [
      {
        id: 'habits',
        title: 'Tracked Habits',
        items: [
          { id: '1', description: '1. Wake up at 06:00 AM without snoozing', note: 'Target: 28 Days' },
          { id: '2', description: '2. 30 Minutes of Focused Physical Exercise / Walking', note: 'Target: 25 Days' },
          { id: '3', description: '3. Drink 3 Litres of Water', note: 'Target: 30 Days' },
          { id: '4', description: '4. Read 20 Pages of Non-Fiction / Technical Literature', note: 'Target: 28 Days' },
          { id: '5', description: '5. Zero Junk Sugar / Processed Fast Food', note: 'Target: 25 Days' },
          { id: '6', description: '6. Review Day & Write Gratitude Journal before sleep', note: 'Target: 28 Days' }
        ]
      }
    ]
  },
  {
    id: 'goal-planning-sheet',
    name: 'Goal Planning Sheet',
    category: 'personal',
    shortDescription: 'SMART goal planning worksheet with actionable steps, deadlines, and milestone reviews.',
    iconName: 'Target',
    tags: ['goals', 'planning', 'smart', 'milestones', 'targets'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#4f46e5',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'S.M.A.R.T. GOAL BLUEPRINT',
      footerNote: 'A goal without a timeline and written action steps is merely a wish.'
    },
    defaultData: {
      goalStatement: 'Launch LifeTools v1.3.0 as a complete 256-tool offline utility suite with 40 interactive document templates.',
      targetDeadline: 'December 31, 2026',
      whyItMatters: 'Empower users worldwide with a free, completely private, registration-free productivity environment running 100% on their own devices.',
      potentialObstacles: 'Scope creep, edge cases in PDF rendering, performance regressions in large data archives.',
      mitigationPlan: 'Maintain strict automated testing (85+ Vitest tests), code-split lazy bundles, and zero-dependency PKWARE ZIP engines.'
    },
    sections: [
      {
        id: 'actionSteps',
        title: 'Action Steps & Milestones',
        items: [
          { id: '1', description: 'Implement DocumentEditor with live responsive A4 preview', status: 'Done' },
          { id: '2', description: 'Publish all 40 verified business, student, personal and professional templates', status: 'In Progress' },
          { id: '3', description: 'Integrate template drafts with Universal Backup & Restore System', status: 'In Progress' },
          { id: '4', description: 'Complete rigorous production builds and test suites with zero failures', status: 'Pending' }
        ]
      }
    ]
  },

  // ==========================================
  // SECTION D: PROFESSIONAL DOCUMENTS (10)
  // ==========================================
  {
    id: 'professional-email-generator',
    name: 'Professional Email Generator',
    category: 'professional',
    shortDescription: 'Formal workplace email composer with subject lines, body structure, and sign-offs.',
    iconName: 'FileText',
    tags: ['email', 'business email', 'professional', 'communication'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#1e293b',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'PROFESSIONAL EMAIL TEMPLATE',
      footerNote: 'Copy into your preferred email client or export as a formatted memo.'
    },
    defaultData: {
      subject: 'Project Status Update: LifeTools Templates & Document Creator Feature Rollout',
      salutation: 'Hi Team,',
      body: `I am writing to share the latest progress update regarding our feature roadmap.

Key Milestones Achieved This Week:
1. Architecture & Design: Completed the data contracts and UI layout for 40 functional templates across Business, Student, Personal, and Professional domains.
2. In-Browser PDF & Print Engine: Implemented zero-overflow A4 portrait and landscape formatting with instantaneous print previews.
3. Local Storage & Privacy: Integrated template draft persistence with our existing Universal Backup & Restore system.

Next Steps:
Our engineering team is finalizing comprehensive automated test suites in Vitest to verify data binding, template resetting, and production compilation.

Please feel free to reply with feedback or test observations.`,
      signOff: 'Best regards,',
      senderName: '',
      senderTitle: 'Software Architect | LifeTools Project'
    },
    sections: []
  },
  {
    id: 'resignation-letter-generator',
    name: 'Resignation Letter Generator',
    category: 'professional',
    shortDescription: 'Formal, polite employment resignation notice with last working day and transition commitment.',
    iconName: 'Briefcase',
    tags: ['resignation', 'job', 'quitting', 'career', 'notice'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'merriweather',
      fontSize: 'standard',
      accentColor: '#334155',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'FORMAL NOTICE OF RESIGNATION',
      footerNote: 'Private and confidential personnel record.'
    },
    defaultData: {
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      recipientName: 'Mr. Vikram Malhotra',
      recipientTitle: 'Vice President of Engineering',
      companyName: 'CloudScale Technologies Ltd.',
      employeeName: '',
      employeeTitle: 'Senior Software Engineer',
      lastWorkingDay: 'December 15, 2026',
      letterBody: `Please accept this letter as formal notification that I am resigning from my position as Senior Software Engineer at CloudScale Technologies Ltd. In accordance with my employment contract, my last working day will be December 15, 2026.

I want to express my sincere gratitude for the opportunities I have had during my tenure with the company. I have deeply enjoyed collaborating with our talented engineering team and take great pride in the scalable software systems we delivered together.

During my remaining notice period, I am fully committed to ensuring a seamless knowledge transfer. I will document all current architectural workflows, complete outstanding code reviews, and assist in onboarding team members to take over my active responsibilities.

I wish CloudScale Technologies continued success, and I hope we can stay in touch in the future.`,
      signOff: 'Respectfully yours,',
      signature: ''
    },
    sections: []
  },
  {
    id: 'leave-application-generator',
    name: 'Leave Application Generator',
    category: 'professional',
    shortDescription: 'Workplace or college leave request for sick leave, casual leave, or annual vacation.',
    iconName: 'Clock',
    tags: ['leave', 'vacation', 'sick leave', 'absence', 'hr'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#2563eb',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'FORMAL LEAVE REQUEST',
      footerNote: 'Human Resources & Department Record'
    },
    defaultData: {
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      managerName: 'Ms. Priya Nambiar, Engineering Manager',
      companyOrCollege: 'TechCorp Digital Solutions',
      applicantName: '',
      employeeId: 'EMP-4029',
      leaveType: 'Casual & Personal Leave',
      startDate: 'November 26, 2026',
      endDate: 'November 28, 2026',
      totalDays: '3 Working Days',
      reason: 'I am writing to formally request leave from [Start Date] to [End Date] due to urgent personal and family commitments.',
      workHandover: 'Prior to my departure, I will complete all scheduled sprint deliverables. My colleague Tariq Mir has kindly agreed to provide primary coverage for emergency system triage.',
      emergencyContact: '+91 98765 43210'
    },
    sections: []
  },
  {
    id: 'experience-letter-template',
    name: 'Experience Letter Template',
    category: 'professional',
    shortDescription: 'Formal employer service certificate confirming designation, tenure, and conduct.',
    iconName: 'FileCheck',
    tags: ['experience', 'certificate', 'employment', 'relieving', 'service'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'merriweather',
      fontSize: 'standard',
      accentColor: '#1e3a8a',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'SERVICE EXPERIENCE CERTIFICATE',
      footerNote: 'Issued on company letterhead without physical alteration.'
    },
    defaultData: {
      companyName: 'Apex Innovations Software Private Limited',
      companyAddress: 'Cyber Heights, Electronic City, Bangalore, 560100',
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      employeeName: '',
      designation: 'Senior Frontend Architect',
      tenureStart: 'June 01, 2023',
      tenureEnd: 'November 15, 2026',
      certificateBody: `TO WHOMSOEVER IT MAY CONCERN

This is to certify that Mr.  was employed with Apex Innovations Software Private Limited from June 01, 2023 to November 15, 2026. At the time of his departure, he was serving as Senior Frontend Architect in the Core Product Engineering division.

During his tenure with our organization, Mr.  demonstrated outstanding technical competence, leadership, and integrity. He played a pivotal role in modernizing our client-side software architecture, championing TypeScript best practices, and ensuring exceptional application responsiveness.

His professional conduct was exemplary, and he maintained excellent working relationships with colleagues and clients alike. We thank him for his valuable contributions and wish him all the best in his future professional endeavors.`,
      signatoryName: 'Sanjay Deshmukh',
      signatoryTitle: 'Head of Human Resources'
    },
    sections: []
  },
  {
    id: 'internship-application-template',
    name: 'Internship Application',
    category: 'professional',
    shortDescription: 'Structured student internship request showcasing academic strengths and project skills.',
    iconName: 'GraduationCap',
    tags: ['internship', 'student', 'application', 'trainee'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#4f46e5',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'INTERNSHIP APPLICATION',
      footerNote: 'Curriculum Vitae and GitHub repositories attached for reference.'
    },
    defaultData: {
      studentName: '',
      studentEmail: '',
      studentPhone: '',
      university: 'National Institute of Technology (NIT)',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      companyTarget: '[Target Organization Name]',
      roleTarget: 'Summer Software Engineering Intern (Web Systems)',
      letterContent: `I am writing to formally submit my application for the Software Engineering Internship position at [Company Name]. As a Computer Science undergraduate with a passion for high-performance client-side architectures, I am eager to contribute to your engineering workflows.\n\nMy practical engineering experience includes designing responsive, client-side web applications using React, TypeScript, and modern browser APIs. I am eager to apply my strong foundation in algorithms, modern JavaScript, and web design to your development team while learning from experienced engineers.`,
      signOff: 'Sincerely,',
      signature: ''
    },
    sections: []
  },
  {
    id: 'meeting-agenda-template',
    name: 'Meeting Agenda',
    category: 'professional',
    shortDescription: 'Structured corporate meeting schedule with discussion items, timeboxes, and presenters.',
    iconName: 'Clock',
    tags: ['meeting', 'agenda', 'minutes', 'discussion', 'schedule'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#0891b2',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'FORMAL MEETING AGENDA',
      footerNote: 'Attendees are requested to review briefing materials prior to the session.'
    },
    defaultData: {
      meetingTitle: 'Quarterly Product Architecture & Security Review (Q4 2026)',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      timeLocation: '10:00 AM – 11:30 AM IST | Virtual Conference Room A',
      meetingLeader: '',
      objective: 'Review v1.3.0 feature readiness, browser crypto benchmarks, and offline reliability.'
    },
    sections: [
      {
        id: 'agenda',
        title: 'Session Schedule & Topics',
        items: [
          { id: '1', description: '10:00 – 10:15 AM: Welcome & Feature Overview', note: 'Presenter: Lead Architect | High-level summary of 40 new templates' },
          { id: '2', description: '10:15 – 10:45 AM: Technical Deep Dive & Web Crypto', note: 'Presenter: Security Engineer | PBKDF2 iterations & AES-GCM audit' },
          { id: '3', description: '10:45 – 11:15 AM: QA Testing Report & Vitest Metrics', note: 'Presenter: QA Lead | Review of 85+ passing unit and integration tests' },
          { id: '4', description: '11:15 – 11:30 AM: Open Q&A & Release Sign-Off', note: 'Open Floor | Action item assignments and target release date' }
        ]
      }
    ]
  },
  {
    id: 'meeting-minutes-template',
    name: 'Meeting Minutes',
    category: 'professional',
    shortDescription: 'Official record of meeting proceedings, key decisions made, and assigned action items.',
    iconName: 'FileSpreadsheet',
    tags: ['minutes', 'mom', 'meeting', 'decisions', 'notes'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#059669',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'MINUTES OF MEETING (MoM)',
      footerNote: 'Minutes recorded and distributed for stakeholder sign-off.'
    },
    defaultData: {
      meetingTitle: 'Sprint 24 Planning & Technical Review',
      date: new Date().toISOString().slice(0, 10),
      attendees: 'Project Lead (Chair), Technical Lead, Quality Analyst',
      keyDecisions: `1. Approved adoption of pure TypeScript PKWARE ZIP archive engine to maintain zero external dependencies.
2. Verified that all 40 document templates will be registered individually in toolsRegistry for direct URL deep-linking.
3. Confirmed full integration with the Universal Backup & Restore System for template draft preservation.`
    },
    sections: [
      {
        id: 'actionItems',
        title: 'Assigned Action Items & Owners',
        items: [
          { id: '1', description: 'Finalize DocumentEditor CSS @media print styling for A4 export', status: 'Owner: Engineering Lead | Due: Friday' },
          { id: '2', description: 'Verify responsive viewports down to 320px mobile screens', status: 'Owner: QA Team | Due: Nov 22' },
          { id: '3', description: 'Generate updated XML sitemap with 258 platform routes', status: 'Owner: DevOps | Due: Nov 23' }
        ]
      }
    ]
  },
  {
    id: 'project-proposal-template',
    name: 'Project Proposal',
    category: 'professional',
    shortDescription: 'Comprehensive client project pitch outlining problem statement, scope, timeline, and cost.',
    iconName: 'Briefcase',
    tags: ['proposal', 'project', 'pitch', 'scope', 'contract'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#4f46e5',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'STRATEGIC PROJECT PROPOSAL',
      footerNote: 'Proprietary proposal submitted for client review.'
    },
    defaultData: {
      projectTitle: 'Modernization of Enterprise Client Portal & Offline Data Suite',
      preparedFor: '',
      preparedBy: '',
      executiveSummary: `This proposal outlines our turnkey strategy to modernize your internal operational tools into a high-performance, offline-capable Progressive Web Application. By transitioning from legacy desktop software to modern React 18, TypeScript, and client-side IndexedDB caching, your field operators will achieve instantaneous data access even in low-bandwidth transit environments.`,
      estimatedBudget: '₹2,45,000 (Inclusive of Architecture, UI Design, QA Testing & 6 Months Maintenance)',
      timeline: '8 Weeks from Contract Execution'
    },
    sections: [
      {
        id: 'phases',
        title: 'Project Phases & Deliverables',
        items: [
          { id: '1', description: 'Phase 1: Architecture, Wireframes & Component Design', note: 'Weeks 1–2 | Delivery of interactive Figma prototype & data schema' },
          { id: '2', description: 'Phase 2: Core React Frontend & Offline Storage Engine', note: 'Weeks 3–5 | IndexedDB integration & Service Worker offline caching' },
          { id: '3', description: 'Phase 3: Security Audits & Client-Side Encryption', note: 'Weeks 6–7 | Web Crypto API integration & cross-browser verification' },
          { id: '4', description: 'Phase 4: User Acceptance Testing, Deployment & Training', note: 'Week 8 | Production release & staff handover documentation' }
        ]
      }
    ]
  },
  {
    id: 'work-report-template',
    name: 'Work Report',
    category: 'professional',
    shortDescription: 'Weekly or monthly executive accomplishments report detailing deliverables and blockers.',
    iconName: 'FileText',
    tags: ['report', 'work report', 'status', 'accomplishments', 'weekly report'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#0d9488',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'EXECUTIVE WORK REPORT',
      footerNote: 'Internal engineering productivity report.'
    },
    defaultData: {
      reportPeriod: 'Monthly Engineering Report — November 2026',
      employeeName: '',
      roleTeam: 'Lead Full-Stack Engineer | LifeTools Project',
      summary: 'Delivered major platform upgrades including the Universal Backup & Restore System and the brand new Templates & Document Creator category comprising 40 fully operational utilities.'
    },
    sections: [
      {
        id: 'accomplishments',
        title: 'Key Achievements & Completed Deliverables',
        items: [
          { id: '1', description: 'Engineered universal backup architecture supporting JSON, ZIP, CSV, and TXT exports', note: 'Achieved 100% test coverage with zero external dependencies' },
          { id: '2', description: 'Built client-side AES-256-GCM encryption with 100,000 rounds of PBKDF2 hashing', note: 'Verified security standards using W3C Web Crypto API' },
          { id: '3', description: 'Designed and implemented 40 interactive document templates with live A4 preview', note: 'Full support for custom fonts, accent palettes, and local draft saving' },
          { id: '4', description: 'Maintained 85 passing Vitest automated tests and code-split production build', note: 'Zero TypeScript warnings and optimized lazy chunk bundles' }
        ]
      }
    ]
  },
  {
    id: 'recommendation-letter-template',
    name: 'Recommendation Letter',
    category: 'professional',
    shortDescription: 'Formal academic or employment letter of endorsement highlighting character and capability.',
    iconName: 'FileCheck',
    tags: ['recommendation', 'letter', 'reference', 'endorsement', 'student'],
    defaultPageFormat: 'a4-portrait',
    defaultStyling: {
      font: 'merriweather',
      fontSize: 'standard',
      accentColor: '#1e293b',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false,
      headerTitle: 'LETTER OF RECOMMENDATION',
      footerNote: 'Confidential academic & professional endorsement.'
    },
    defaultData: {
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      recommenderName: 'Prof. Dr. Farooq Ahmad Bhat',
      recommenderTitle: 'Professor & Dean of Computer Science',
      institution: 'Faculty of Engineering & Technology',
      recipientTitle: 'Admissions Committee / Hiring Committee',
      candidateName: '',
      letterBody: `It is my distinct privilege to write this letter of recommendation for [Candidate Name]. Having known the candidate in my capacity as Professor of Computer Science, I have observed exceptional dedication, intellectual curiosity, and disciplined work ethic.\n\nThe candidate demonstrates an uncommon combination of deep technical insight, architectural curiosity, and disciplined work ethic. Beyond technical acumen, the candidate is an articulate communicator and natural team collaborator who approaches complex engineering challenges with humility, persistence, and creativity.\n\nI give [Candidate Name] my highest recommendation without reservation for advanced graduate studies or senior engineering roles. I am confident they will make significant contributions wherever they go.`,
      signOff: 'Warmest regards,',
      signature: 'Dr. Farooq Ahmad Bhat'
    },
    sections: []
  }
];

export function getTemplateById(id: string): TemplateDefinition | undefined {
  return TEMPLATES_DATA.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: import('../types/templates').TemplateSectionCategory): TemplateDefinition[] {
  return TEMPLATES_DATA.filter((t) => t.category === category);
}

export const TEMPLATES_CATALOG = TEMPLATES_DATA;
export const getTemplatesBySection = getTemplatesByCategory;
