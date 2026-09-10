export type Language = 'en' | 'bn' | 'hi';

export interface Translations {
  common: {
    back: string;
    backHome: string;
    loading: string;
    save: string;
    saving: string;
    cancel: string;
    error: string;
    success: string;
    delete: string;
    edit: string;
    view: string;
    submit: string;
    refresh: string;
    brand: string;
    id: string;
    status: string;
    date: string;
  };
  nav: {
    home: string;
    about: string;
    research: string;
    dashboard: string;
    signOut: string;
    login: string;
    register: string;
    profile: string;
  };
  footer: {
    disclaimerTitle: string;
    disclaimerText: string;
    copyright: string;
    privacyPolicy: string;
    ethicsConsent: string;
    contact: string;
  };
  langModal: {
    title: string;
    subtitle: string;
    selectPrompt: string;
    continueBtn: string;
    english: string;
    bengali: string;
    hindi: string;
  };
  patientDashboard: {
    portalTitle: string;
    dashboardFor: string;
    loadingPortal: string;
    screeningHistory: string;
    noScreenings: string;
    risk: string;
    startNewScreening: string;
    prescriptions: string;
    therapyProgress: string;
    noTherapy: string;
    progressLabel: string;
    loadError: string;
  };
  prescriptions: {
    title: string;
    uploadBtn: string;
    emptyState: string;
    emptySubtext: string;
    loading: string;
    loadError: string;
    statusProcessing: string;
    statusProcessed: string;
    statusFailed: string;
    statusPending: string;
    prescriptionNumber: string;
    uploaded: string;
    viewDigital: string;
    hideDetails: string;
    retryParsing: string;
    viewOriginal: string;
    accessDetails: string;
    collapse: string;
    delete: string;
    confirmDelete: string;
    digitalRxTitle: string;
    date: string;
    doctor: string;
    license: string;
    clinicalNotes: string;
    medications: string;
    strength: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
    instructions: string;
    notes: string;
    confidence: string;
    disclaimer: string;
    accessTitle: string;
    authorizedPros: string;
    granted: string;
    revoke: string;
    noAccess: string;
    grantAccessTo: string;
    searchPlaceholder: string;
    uploadModalTitle: string;
    uploadModalSubtitle: string;
    dragDrop: string;
    or: string;
    browse: string;
    uploadSubmit: string;
    uploadingMsg: string;
    extractingMsg: string;
    successMsg: string;
  };
  doctorDashboard: {
    title: string;
    pendingReview: string;
    highRiskAlerts: string;
    refreshList: string;
    status: string;
    highRiskDetected: string;
    stableNoFlags: string;
    noPatients: string;
    rxRecordsTitle: string;
  };
  therapistDashboard: {
    title: string;
    subtitle: string;
    myPatients: string;
    sessionNotes: string;
    stage: string;
    notesPlaceholder: string;
    saveBtn: string;
    savingBtn: string;
    emptyState: string;
    rxRecordsTitle: string;
    saveSuccess: string;
    saveFailed: string;
    noActiveVisit: string;
  };
  counsellorDashboard: {
    title: string;
    subtitle: string;
    newRegistration: string;
    successGen: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    male: string;
    female: string;
    other: string;
    guardianInfo: string;
    guardianName: string;
    contactPhone: string;
    address: string;
    registerBtn: string;
    registeringBtn: string;
    pendingScreenings: string;
    noPending: string;
    quickStats: string;
    registeredToday: string;
    rxRecordsTitle: string;
  };
  aboutPage: {
    pageTitle: string;
    heroHeading: string;
    intro1: string;
    intro2: string;
    tagSocial: string;
    tagEngagement: string;
    tagCommunication: string;
    boxTitle: string;
    boxItem1: string;
    boxItem2: string;
    boxItem3: string;
    boxNote: string;
  };
  researchPage: {
    heading: string;
    introText: string;
    card1Title: string;
    card1Text: string;
    card2Title: string;
    card2Text: string;
    ethicsTitle: string;
    ethicsItem1Title: string;
    ethicsItem1Text: string;
    ethicsItem2Title: string;
    ethicsItem2Text: string;
    ethicsItem3Title: string;
    ethicsItem3Text: string;
    ethicsNote: string;
    citationTitle: string;
    citationText: string;
  };
  ethicsPage: {
    title: string;
    subtitle: string;
    sec1Title: string;
    sec1Text: string;
    sec1List: string[];
    sec2Title: string;
    sec2Text: string;
    sec2List: string[];
    sec3Title: string;
    sec3Subtitle: string;
    sec3List: string[];
    sec4Title: string;
    sec4Text: string;
    sec4List: string[];
    sec5Title: string;
    sec5Text: string;
    sec5List: string[];
    sec6Title: string;
    sec6RisksTitle: string;
    sec6RisksList: string[];
    sec6BenefitsTitle: string;
    sec6BenefitsList: string[];
    sec7Title: string;
    sec7Text: string;
    sec8Title: string;
    sec8Text: string;
    sec8EmailLabel: string;
  };
  contactPage: {
    title: string;
    subtitle: string;
    getInTouch: string;
    inquiriesText: string;
    emailLabel: string;
    responseNotice: string;
    aboutPlatformTitle: string;
    aboutPlatformText: string;
  };
  privacyPage: {
    title: string;
    updated: string;
    sec1Title: string;
    sec1Text: string;
    sec2Title: string;
    sec2PersonalTitle: string;
    sec2PersonalList: string[];
    sec2HealthTitle: string;
    sec2HealthList: string[];
    sec3Title: string;
    sec3Text: string;
    sec3List: string[];
    sec4Title: string;
    sec4Text: string;
    sec4List: string[];
    sec5Title: string;
    sec5Text: string;
    sec5List: string[];
    sec6Title: string;
    sec6Text: string;
    sec6List: string[];
    sec7Title: string;
    sec7Text: string;
    sec8Title: string;
    sec8Text: string;
    sec8EmailLabel: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    signInBtn: string;
    signingInBtn: string;
    newUserPrompt: string;
    registerLink: string;
    forgotPasswordLink: string;
    restrictedNotice: string;
    contactAt: string;
  };
  // Screening Module
  screening: {
    pageTitle: string;
    pageSubtitle: string;
    breadcrumbDashboard: string;
    breadcrumbScreening: string;
    step1Title: string;
    step1Subtitle: string;
    dragDropText: string;
    orBrowse: string;
    browseFiles: string;
    imageRequirements: string;
    fileSelected: string;
    changeImage: string;
    step2Title: string;
    step2Subtitle: string;
    submitScreening: string;
    analyzing: string;
    disclaimerNotice: string;
    validationError: string;
    errorPrefix: string;
  };
  // Questionnaire questions & hints
  questionnaire: {
    age: { label: string; placeholder: string; hint: string };
    gender: { label: string; male: string; female: string };
    hyperactive: { label: string; hint: string };
    responsive: { label: string; hint: string };
    epilepsy: { label: string; hint: string };
    diagnosed: { label: string; placeholder: string; hint: string };
    color_recognize: { label: string; hint: string };
    emotional_response: { label: string; hint: string };
    head_injury: { label: string; hint: string };
    speech: { label: string; hint: string };
    eye_contact: { label: string; hint: string };
    yes: string;
    no: string;
  };
  // Results
  results: {
    title: string;
    subtitle: string;
    patientLabel: string;
    patientId: string;
    facialTitle: string;
    facialModel: string;
    assessment: string;
    facialScore: string;
    facialConfidence: string;
    weightLabel: string;
    contributionLabel: string;
    threshold50: string;
    questionnaireTitle: string;
    questionnaireModel: string;
    isaaProfile: string;
    modelConfidence: string;
    probabilitiesTitle: string;
    mild: string;
    moderate: string;
    modelNote: string;
    combinedTitle: string;
    combinedFormula: string;
    finalScore: string;
    riskCategory: string;
    medicalDisclaimerTitle: string;
    medicalDisclaimer: string;
    downloadReport: string;
    newScreening: string;
    returnDashboard: string;
  };
  // Professional Profile
  professional: {
    patientProfileTitle: string;
    patientIdLookup: string;
    searchPlaceholder: string;
    lookupBtn: string;
    searching: string;
    noAccessGranted: string;
    accessDeniedTitle: string;
    patientInfo: string;
    age: string;
    gender: string;
    screeningsSection: string;
    facialSection: string;
    questionnaireSection: string;
    prescriptionsSection: string;
    facialImage: string;
    originalPrescription: string;
    viewDocument: string;
    medicinesPrescribed: string;
    dosage: string;
    frequency: string;
    instructions: string;
    questionsAnswers: string;
    question: string;
    patientResponse: string;
    noScreeningsYet: string;
    noPrescriptionsYet: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      back: '← Back',
      backHome: '← Home',
      loading: 'Loading...',
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      error: 'Error',
      success: 'Success',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      submit: 'Submit',
      refresh: 'Refresh',
      brand: 'ASD Research Platform',
      id: 'ID',
      status: 'Status',
      date: 'Date',
    },
    nav: {
      home: 'Home',
      about: 'About',
      research: 'Research',
      dashboard: 'Dashboard',
      signOut: 'Sign Out',
      login: 'Login',
      register: 'Register',
      profile: 'Profile',
    },
    footer: {
      disclaimerTitle: 'Research Use Only.',
      disclaimerText: 'This system does not diagnose Autism Spectrum Disorder. It supports structured behavioral observation only and does not replace professional evaluation.',
      copyright: 'ASD Research Platform',
      privacyPolicy: 'Privacy Policy',
      ethicsConsent: 'Ethics & Consent',
      contact: 'Contact Research Team',
    },
    langModal: {
      title: 'Welcome to SMART ASD Platform',
      subtitle: 'Please select your preferred language to continue.',
      selectPrompt: 'Choose your language',
      continueBtn: 'Continue',
      english: 'English',
      bengali: 'বাংলা (Bengali)',
      hindi: 'हिन्दी (Hindi)',
    },
    patientDashboard: {
      portalTitle: 'Verify ASD Patient Portal',
      dashboardFor: 'Secure Dashboard for',
      loadingPortal: 'Loading your secure portal...',
      screeningHistory: 'Screening History',
      noScreenings: 'No screenings recorded.',
      risk: 'Risk',
      startNewScreening: 'Start New Screening →',
      prescriptions: 'Prescriptions',
      therapyProgress: 'Therapy Progress',
      noTherapy: 'No therapy sessions found.',
      progressLabel: 'Progress:',
      loadError: 'Could not load your dashboard. Please try logging in again.',
    },
    prescriptions: {
      title: 'Prescriptions',
      uploadBtn: '+ Upload Prescription',
      emptyState: 'No prescriptions uploaded yet.',
      emptySubtext: 'Click "+ Upload Prescription" to digitalize your prescription.',
      loading: 'Loading prescriptions...',
      loadError: 'Could not load prescriptions. Please refresh the page.',
      statusProcessing: '⏳ Processing',
      statusProcessed: '✓ Digitalized',
      statusFailed: '⚠ Processing Failed',
      statusPending: '◷ Pending',
      prescriptionNumber: 'Prescription #',
      uploaded: 'Uploaded',
      viewDigital: 'View Digital Prescription',
      hideDetails: 'Hide Details',
      retryParsing: '🔄 Retry AI Parsing',
      viewOriginal: 'View Original',
      accessDetails: '▼ Access & Details',
      collapse: '▲ Collapse',
      delete: 'Delete',
      confirmDelete: 'Delete this prescription? This action cannot be undone.',
      digitalRxTitle: '⚕ Digital Prescription',
      date: 'Date:',
      doctor: 'Doctor:',
      license: 'License:',
      clinicalNotes: 'Clinical Notes:',
      medications: 'Medications',
      strength: 'Strength:',
      dosage: 'Dosage:',
      frequency: 'Frequency:',
      duration: 'Duration:',
      route: 'Route:',
      instructions: 'Instructions:',
      notes: 'Notes:',
      confidence: 'AI Confidence:',
      disclaimer: '⚠ AI-extracted information should be verified against the original prescription. This system does not replace professional medical judgment.',
      accessTitle: 'Prescription Access',
      authorizedPros: 'Currently authorized professionals:',
      granted: 'Granted',
      revoke: 'Revoke',
      noAccess: 'No professionals currently have access to this prescription.',
      grantAccessTo: 'Grant access to a professional:',
      searchPlaceholder: 'Search by professional name...',
      uploadModalTitle: 'Upload Prescription',
      uploadModalSubtitle: 'Upload a clear image of your prescription. Supported formats: JPG, PNG (max 10 MB)',
      dragDrop: 'Drag & drop your prescription here',
      or: 'or',
      browse: 'Browse Image',
      uploadSubmit: 'Upload & Digitalize Prescription',
      uploadingMsg: 'Uploading prescription securely...',
      extractingMsg: 'AI is extracting prescription information...',
      successMsg: '✓ Prescription uploaded successfully! Processing in background...',
    },
    doctorDashboard: {
      title: 'Clinical Review Dashboard',
      pendingReview: 'Pending Review:',
      highRiskAlerts: 'High Risk Alerts:',
      refreshList: 'Refresh List',
      status: 'Status:',
      highRiskDetected: '⚠️ H-RISK DETECTED',
      stableNoFlags: 'Stable / No Flags',
      noPatients: 'No patients assigned to your review queue.',
      rxRecordsTitle: 'Patient Prescription Records',
    },
    therapistDashboard: {
      title: 'Therapy Session Console',
      subtitle: 'Occupational Therapy & Intervention Log',
      myPatients: 'My Patients',
      sessionNotes: 'Session Notes:',
      stage: 'Stage:',
      notesPlaceholder: 'Enter detailed clinical observations, sensory profile updates, and intervention response...',
      saveBtn: 'Sign & Save Record',
      savingBtn: 'Saving Encrypted Log...',
      emptyState: 'Select a patient from the list to begin charting.',
      rxRecordsTitle: 'Patient Prescription Records',
      saveSuccess: 'Therapy notes saved successfully.',
      saveFailed: 'Failed to save notes.',
      noActiveVisit: 'No active visit found for this patient. Please ensure they are checked in.',
    },
    counsellorDashboard: {
      title: 'Counsellor Dashboard',
      subtitle: 'Patient Intake & Registration',
      newRegistration: 'New Patient Registration',
      successGen: 'Success! Patient ID Generated:',
      firstName: 'First Name',
      lastName: 'Last Name',
      dob: 'Date of Birth',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      guardianInfo: 'Guardian Information',
      guardianName: 'Guardian Name',
      contactPhone: 'Contact Phone',
      address: 'Address',
      registerBtn: 'Register Patient',
      registeringBtn: 'Registering...',
      pendingScreenings: 'Pending Screenings',
      noPending: 'No pending actions.',
      quickStats: 'Quick Stats',
      registeredToday: 'Patients Registered Today',
      rxRecordsTitle: 'Patient Prescription Records',
    },
    aboutPage: {
      pageTitle: 'About the Platform',
      heroHeading: 'Early Observation, Respected.',
      intro1: 'Early childhood is a critical window for understanding developmental patterns. However, traditional clinical environments can be stressful for young children, often affecting behavior.',
      intro2: 'This platform provides a bridge: structured, play-based observation that happens in a comfortable environment. We focus on recording natural behavioral indicators related to social attention, communication intent, and reciprocity.',
      tagSocial: 'Social Attention',
      tagEngagement: 'Joint Engagement',
      tagCommunication: 'Communication Intent',
      boxTitle: 'For Research & Screening Support',
      boxItem1: 'Designed for ages 18 months – 6 years',
      boxItem2: 'Data anonymized via local-first processing',
      boxItem3: 'Results meant for clinician review only',
      boxNote: 'Note: No automated diagnosis is provided to caregivers.',
    },
    researchPage: {
      heading: 'Research & Methodology',
      introText: 'This platform relies on a structured, multi-modal observation framework designed to capture natural behavioral indicators in early childhood. Our methodology prioritizes non-intrusive data collection and clinician-led interpretation.',
      card1Title: 'Methodology Overview',
      card1Text: 'Structured protocols for recording social attention and joint engagement.',
      card2Title: 'Observation Framework',
      card2Text: 'Key behavioral markers aligned with clinical diagnostic criteria.',
      ethicsTitle: 'Ethics & Data Handling',
      ethicsItem1Title: 'Local-First Processing:',
      ethicsItem1Text: 'Data remains on the device whenever possible.',
      ethicsItem2Title: 'Anonymized Metrics:',
      ethicsItem2Text: 'No PII is stored with behavioral metadata.',
      ethicsItem3Title: 'Clinician Access Only:',
      ethicsItem3Text: 'Raw data is restricted to authorized personnel.',
      ethicsNote: 'This platform adheres to strict distinct ethical guidelines for pediatric behavioral observation.',
      citationTitle: 'Detailed Publication Data',
      citationText: 'Full citations and peer-reviewed sources for the framework will be listed here upon release.',
    },
    ethicsPage: {
      title: 'Ethics & Consent',
      subtitle: 'Institutional Review Board Approved',
      sec1Title: '1. Ethical Framework',
      sec1Text: 'The SMART-ASD Platform operates under strict ethical guidelines approved by our Institutional Review Board (IRB). All research activities comply with:',
      sec1List: [
        'The Declaration of Helsinki',
        'Good Clinical Practice (GCP) guidelines',
        'National and international data protection regulations',
        'Ethical principles of beneficence, non-maleficence, and justice',
      ],
      sec2Title: '2. Informed Consent Process',
      sec2Text: "Before participating in any research activity, you (or your child's guardian) will receive:",
      sec2List: [
        'A detailed explanation of the study purpose and procedures',
        'Information about potential risks and benefits',
        'Assurance of voluntary participation and right to withdraw',
        'Contact information for questions or concerns',
        'Time to review and ask questions before signing',
      ],
      sec3Title: '3. Participant Rights',
      sec3Subtitle: 'You have the right to:',
      sec3List: [
        'Voluntary Participation: Participation is entirely voluntary',
        'Withdraw at Any Time: You may withdraw without penalty or loss of benefits',
        'Confidentiality: Your identity will be protected in all publications',
        'Access to Results: You may request a summary of research findings',
        'Ask Questions: Contact the research team at any time',
      ],
      sec4Title: '4. Vulnerable Populations',
      sec4Text: 'Special protections are in place for children and individuals with developmental disabilities:',
      sec4List: [
        'Parental/guardian consent required for minors',
        'Assent obtained from children when developmentally appropriate',
        'Additional safeguards for participants unable to provide consent',
        'Ongoing monitoring for signs of distress or discomfort',
      ],
      sec5Title: '5. Data Use & Anonymization',
      sec5Text: 'Research data is handled with the highest ethical standards:',
      sec5List: [
        'Personal identifiers removed from research datasets',
        'Data aggregated for statistical analysis',
        'No individual participants identifiable in publications',
        'Secure storage with restricted access',
      ],
      sec6Title: '6. Potential Risks & Benefits',
      sec6RisksTitle: 'Potential Risks:',
      sec6RisksList: [
        'Minimal psychological discomfort during assessments',
        'Time commitment for screening and follow-up',
        'Breach of confidentiality (mitigated by security measures)',
      ],
      sec6BenefitsTitle: 'Potential Benefits:',
      sec6BenefitsList: [
        'Access to structured behavioral assessments',
        'Contribution to autism research',
        'Potential early identification and intervention',
        'Connection to therapeutic resources',
      ],
      sec7Title: '7. Compensation',
      sec7Text: 'Participants may receive compensation for their time and travel expenses as outlined in the specific study protocol. Compensation is not contingent on study completion.',
      sec8Title: '8. Contact for Ethical Concerns',
      sec8Text: 'If you have concerns about the ethical conduct of this research or questions about participation:',
      sec8EmailLabel: 'Email:',
    },
    contactPage: {
      title: 'Contact Research Team',
      subtitle: "We're here to help",
      getInTouch: 'Get in Touch',
      inquiriesText: 'For research inquiries, technical support, or general questions about the SMART-ASD Platform:',
      emailLabel: 'Email:',
      responseNotice: 'We typically respond within 24-48 hours during business days.',
      aboutPlatformTitle: 'About This Platform',
      aboutPlatformText: 'The SMART-ASD Platform is a research initiative focused on supporting early understanding of autism spectrum disorders through structured behavioral observation and responsible AI technology.',
    },
    privacyPage: {
      title: 'Privacy Policy',
      updated: 'Last Updated: February 2026',
      sec1Title: '1. Introduction',
      sec1Text: 'The SMART-ASD Platform is committed to protecting the privacy and confidentiality of all participants in our autism spectrum disorder research. This privacy policy outlines how we collect, use, store, and protect your personal and health information.',
      sec2Title: '2. Information We Collect',
      sec2PersonalTitle: 'Personal Information:',
      sec2PersonalList: [
        'Name, date of birth, and contact information',
        'Guardian/parent information for minor participants',
        'Demographic data (age, gender)',
      ],
      sec2HealthTitle: 'Health Information:',
      sec2HealthList: [
        'Behavioral screening responses',
        'Clinical observations and assessments',
        'Therapy session notes and progress records',
        'Prescription and treatment information',
      ],
      sec3Title: '3. How We Use Your Information',
      sec3Text: 'Your information is used solely for:',
      sec3List: [
        'Research purposes: To advance understanding of autism spectrum disorders',
        'Clinical support: To provide appropriate therapeutic interventions',
        'Data analysis: To identify patterns and improve screening tools',
        'Institutional compliance: To meet regulatory and ethical requirements',
      ],
      sec4Title: '4. Data Protection & Security',
      sec4Text: 'We implement industry-standard security measures:',
      sec4List: [
        'End-to-end encryption for all sensitive data',
        'Role-based access control (only authorized personnel can access data)',
        'Regular security audits and compliance checks',
        'Secure database storage with encrypted backups',
        'Audit logging of all data access and modifications',
      ],
      sec5Title: '5. Data Sharing & Disclosure',
      sec5Text: 'We do NOT share your personal information with third parties except:',
      sec5List: [
        'With your explicit written consent',
        'When required by law or legal process',
        'For de-identified research publications (no personal identifiers)',
        'With institutional review boards for ethical oversight',
      ],
      sec6Title: '6. Your Rights',
      sec6Text: 'As a participant, you have the right to:',
      sec6List: [
        'Access your personal data at any time',
        'Request corrections to inaccurate information',
        'Withdraw from the study at any time',
        'Request deletion of your data (subject to legal requirements)',
        'Receive a copy of your data in a portable format',
      ],
      sec7Title: '7. Data Retention',
      sec7Text: 'Research data is retained for a minimum of 7 years as per institutional guidelines. After this period, data may be anonymized for long-term research or securely destroyed.',
      sec8Title: '8. Contact Us',
      sec8Text: 'For any questions, concerns, or to exercise your privacy rights, please contact us:',
      sec8EmailLabel: 'Email:',
    },
    auth: {
      loginTitle: 'Login',
      loginSubtitle: 'Please sign in with your credentials',
      emailLabel: 'Email',
      emailPlaceholder: 'Enter your email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      signInBtn: 'Sign In',
      signingInBtn: 'Signing in...',
      newUserPrompt: 'New user?',
      registerLink: 'Register',
      forgotPasswordLink: 'Forgot Password?',
      restrictedNotice: 'Restricted to authorized personnel only.',
      contactAt: 'Contact at :',
    },
    screening: {
      pageTitle: 'Dual-Model ASD Screening',
      pageSubtitle: 'Research-grade predictive analysis combining facial biomarkers and ISAA clinical questionnaire.',
      breadcrumbDashboard: 'Dashboard',
      breadcrumbScreening: 'ASD Screening',
      step1Title: 'Step 1: Facial Biomarker Analysis',
      step1Subtitle: 'Upload a clear, front-facing photograph of the child.',
      dragDropText: 'Drag & drop facial photograph here',
      orBrowse: 'or',
      browseFiles: 'Browse Computer',
      imageRequirements: 'Accepted formats: JPG, PNG · Maximum size: 5MB · Front-facing neutral lighting',
      fileSelected: 'Selected image',
      changeImage: 'Change photo',
      step2Title: 'Step 2: Behavioral & Clinical Questionnaire',
      step2Subtitle: 'Derived from the validated NILD 2026 ISAA clinical dataset.',
      submitScreening: 'Run Combined ASD Screening',
      analyzing: 'Running AI Models & Scoring...',
      disclaimerNotice: 'Screening results are predictive research outputs and must be validated by a clinical specialist.',
      validationError: 'Please complete all required fields correctly before submitting.',
      errorPrefix: 'Error',
    },
    questionnaire: {
      age: { label: 'Age (in years)', placeholder: 'e.g. 4.5', hint: 'Child current age in years (can be decimal, e.g. 3.5)' },
      gender: { label: 'Gender', male: 'Male', female: 'Female' },
      hyperactive: { label: 'Hyperactive Behaviour', hint: 'Does the child show persistent hyperactivity or restlessness?' },
      responsive: { label: 'Responsive to Name / Calls', hint: 'Does the child respond when their name is called or spoken to?' },
      epilepsy: { label: 'Epilepsy / Seizure History', hint: 'Any diagnosed history of convulsions or seizures?' },
      diagnosed: { label: 'Years Since First Concerns', placeholder: 'e.g. 2.0', hint: 'Years since behavioral differences were first noticed/suspected' },
      color_recognize: { label: 'Color Recognition', hint: 'Can the child distinguish and identify basic colors?' },
      emotional_response: { label: 'Appropriate Emotional Response', hint: 'Does the child express suitable emotional reactions in context?' },
      head_injury: { label: 'Head Injury History', hint: 'Any significant past head trauma or clinical head injury?' },
      speech: { label: 'Functional Speech', hint: 'Does the child use meaningful words or functional communication?' },
      eye_contact: { label: 'Maintains Eye Contact', hint: 'Does the child make and sustain eye contact naturally?' },
      yes: 'Yes',
      no: 'No',
    },
    results: {
      title: 'Screening Assessment Results',
      subtitle: 'Weighted multi-modal predictive analysis (40% Facial Biomarker + 60% Questionnaire)',
      patientLabel: 'Patient',
      patientId: 'Patient ID',
      facialTitle: 'Facial Biomarker Analysis',
      facialModel: 'EfficientNetB4 + ViT (Weight: 40%)',
      assessment: 'Assessment',
      facialScore: 'Facial ASD Risk',
      facialConfidence: 'Model Confidence',
      weightLabel: 'Assigned Weight',
      contributionLabel: 'Score Contribution',
      threshold50: '50% Diagnostic Threshold',
      questionnaireTitle: 'Questionnaire & Behavioral Analysis',
      questionnaireModel: 'Random Forest · NILD 2026 ISAA (Weight: 60%)',
      isaaProfile: 'Clinical Profile',
      modelConfidence: 'Model Confidence',
      probabilitiesTitle: 'Class Distribution',
      mild: 'Mild ASD Profile',
      moderate: 'Moderate ASD Profile',
      modelNote: 'Calibrated using NILD Kolkata ISAA clinical cohort dataset.',
      combinedTitle: 'Combined ASD Screening Assessment',
      combinedFormula: 'Combined Score = (Facial Score × 0.40) + (Questionnaire Score × 0.60)',
      finalScore: 'Final Weighted Score',
      riskCategory: 'Risk Level',
      medicalDisclaimerTitle: 'Medical & Regulatory Disclaimer',
      medicalDisclaimer: 'This AI-assisted screening provides predictive observational insights and is NOT a definitive clinical diagnosis. Results must be reviewed by a registered medical practitioner, clinical psychologist, or qualified therapist.',
      downloadReport: 'Print / Save Report',
      newScreening: 'Perform New Screening',
      returnDashboard: 'Return to Dashboard',
    },
    professional: {
      patientProfileTitle: 'Clinical Patient Record & Screening Profile',
      patientIdLookup: 'Look Up Patient Record',
      searchPlaceholder: 'Enter Patient ID (e.g. SMART-2026-XXXXXX)',
      lookupBtn: 'Retrieve Record',
      searching: 'Verifying permissions & loading...',
      noAccessGranted: 'No active access grant exists for this Patient ID.',
      accessDeniedTitle: 'Access Restricted',
      patientInfo: 'Patient Details',
      age: 'Age',
      gender: 'Gender',
      screeningsSection: 'Screening History & Multi-Modal Assessments',
      facialSection: 'Facial Image & Biomarker Analysis',
      questionnaireSection: 'Questionnaire Responses & Clinical Profile',
      prescriptionsSection: 'Prescriptions & Digitized Records',
      facialImage: 'Screening Facial Photograph',
      originalPrescription: 'Original Prescription Document',
      viewDocument: 'View Original Document',
      medicinesPrescribed: 'Digitized Medications',
      dosage: 'Dosage',
      frequency: 'Frequency',
      instructions: 'Instructions',
      questionsAnswers: 'Patient Questionnaire Responses',
      question: 'Question',
      patientResponse: 'Response',
      noScreeningsYet: 'No screening assessments recorded for this patient.',
      noPrescriptionsYet: 'No prescriptions uploaded or granted for review.',
    },
  },

  bn: {
    common: {
      back: '← পেছনে ফিরুন',
      backHome: '← হোম',
      loading: 'লোড হচ্ছে...',
      save: 'সংরক্ষণ করুন',
      saving: 'সংরক্ষণ করা হচ্ছে...',
      cancel: 'বাতিল',
      error: 'ত্রুটি',
      success: 'সফল',
      delete: 'মুছে ফেলুন',
      edit: 'সম্পাদনা',
      view: 'দেখুন',
      submit: 'জমা দিন',
      refresh: 'রিফ্রেশ করুন',
      brand: 'এএসডি গবেষণা প্ল্যাটফর্ম',
      id: 'আইডি',
      status: 'অবস্থা',
      date: 'তারিখ',
    },
    nav: {
      home: 'হোম',
      about: 'আমাদের সম্পর্কে',
      research: 'গবেষণা',
      dashboard: 'ড্যাশবোর্ড',
      signOut: 'সাইন আউট',
      login: 'লগইন',
      register: 'নিবন্ধন',
      profile: 'প্রোফাইল',
    },
    footer: {
      disclaimerTitle: 'কেবলমাত্র গবেষণার উদ্দেশ্যে।',
      disclaimerText: 'এই প্ল্যাটফর্মটি অটিজম স্পেকট্রাম ডিসঅর্ডার রোগ নির্ণয় করে না। এটি কেবলমাত্র কাঠামোগত আচরণ পর্যবেক্ষণে সহায়তা করে এবং কোনোভাবেই পেশাদার চিকিৎসকের মূল্যায়নের বিকল্প নয়।',
      copyright: 'এএসডি গবেষণা প্ল্যাটফর্ম',
      privacyPolicy: 'গোপনীয়তা নীতি',
      ethicsConsent: 'নৈতিকতা ও সম্মতি',
      contact: 'গবেষক দলের সাথে যোগাযোগ',
    },
    langModal: {
      title: 'SMART ASD প্ল্যাটফর্মে স্বাগতম',
      subtitle: 'অগ্রসর হতে অনুগ্রহ করে আপনার পছন্দের ভাষা নির্বাচন করুন।',
      selectPrompt: 'ভাষা নির্বাচন করুন',
      continueBtn: 'এগিয়ে যান',
      english: 'English (ইংরেজি)',
      bengali: 'বাংলা (Bengali)',
      hindi: 'हिन्दी (হিন্দি)',
    },
    patientDashboard: {
      portalTitle: 'ভেরিফাই এএসডি রোগী পোর্টাল',
      dashboardFor: 'সুরক্ষিত ড্যাশবোর্ড:',
      loadingPortal: 'আপনার সুরক্ষিত পোর্টাল লোড হচ্ছে...',
      screeningHistory: 'স্ক্রীনিং ইতিহাস',
      noScreenings: 'কোনো স্ক্রীনিং রেকর্ড নেই।',
      risk: 'ঝুঁকি',
      startNewScreening: 'নতুন স্ক্রীনিং শুরু করুন →',
      prescriptions: 'প্রেসক্রিপশন',
      therapyProgress: 'থেরাপির অগ্রগতি',
      noTherapy: 'কোনো থেরাপি সেশনের তথ্য পাওয়া যায়নি।',
      progressLabel: 'অগ্রগতি:',
      loadError: 'ড্যাশবোর্ড লোড করা যায়নি। অনুগ্রহ করে পুনরায় লগইন করার চেষ্টা করুন।',
    },
    prescriptions: {
      title: 'প্রেসক্রিপশন',
      uploadBtn: '+ প্রেসক্রিপশন আপলোড',
      emptyState: 'এখনও কোনো প্রেসক্রিপশন আপলোড করা হয়নি।',
      emptySubtext: 'আপনার প্রেসক্রিপশন ডিজিটালাইজ করতে "+ প্রেসক্রিপশন আপলোড"-এ ক্লিক করুন।',
      loading: 'প্রেসক্রিপশন লোড হচ্ছে...',
      loadError: 'প্রেসক্রিপশন লোড করা যায়নি। পৃষ্ঠাটি রিফ্রেশ করুন।',
      statusProcessing: '⏳ প্রসেসিং চলছে',
      statusProcessed: '✓ ডিজিটালাইজড',
      statusFailed: '⚠ প্রসেসিং ব্যর্থ',
      statusPending: '◷ অপেক্ষমাণ',
      prescriptionNumber: 'প্রেসক্রিপশন #',
      uploaded: 'আপলোড করা হয়েছে',
      viewDigital: 'ডিজিটাল প্রেসক্রিপশন দেখুন',
      hideDetails: 'বিবরণ লুকান',
      retryParsing: '🔄 পুনরায় এআই পার্সিং করুন',
      viewOriginal: 'মূল নথি দেখুন',
      accessDetails: '▼ অনুমতি ও বিবরণ',
      collapse: '▲ সংক্ষেপ করুন',
      delete: 'মুছুন',
      confirmDelete: 'এই প্রেসক্রিপশনটি মুছে ফেলতে চান? এই পদক্ষেপটি পূর্বাবস্থায় ফেরানো যাবে না।',
      digitalRxTitle: '⚕ ডিজিটাল প্রেসক্রিপশন',
      date: 'তারিখ:',
      doctor: 'চিকিৎসক:',
      license: 'লাইসেন্স:',
      clinicalNotes: 'ক্লিনিকাল নোট:',
      medications: 'ওষুধসমূহ',
      strength: 'মাত্রা / শক্তি:',
      dosage: 'ডোজ:',
      frequency: 'ব্যবধান:',
      duration: 'মেয়াদ:',
      route: 'প্রয়োগের মাধ্যম:',
      instructions: 'নির্দেশনা:',
      notes: 'নোট:',
      confidence: 'এআই নির্ভরযোগ্যতা:',
      disclaimer: '⚠ এআই দ্বারা আহরিত তথ্য মূল প্রেসক্রিপশনের সাথে যাচাই করা উচিত। এটি চিকিৎসকের পেশাদার মূল্যায়নের বিকল্প নয়।',
      accessTitle: 'প্রেসক্রিপশন অ্যাক্সেস অনুমতি',
      authorizedPros: 'বর্তমানে অনুমোদিত চিকিৎসক / পেশাদার:',
      granted: 'অনুমোদিত',
      revoke: 'প্রত্যাহার করুন',
      noAccess: 'বর্তমানে কোনো বিশেষজ্ঞকে এই প্রেসক্রিপশনে প্রবেশের অনুমতি দেওয়া নেই।',
      grantAccessTo: 'পেশাদার চিকিৎসককে অনুমতি দিন:',
      searchPlaceholder: 'পেশাদারের নাম দিয়ে অনুসন্ধান করুন...',
      uploadModalTitle: 'প্রেসক্রিপশন আপলোড করুন',
      uploadModalSubtitle: 'আপনার প্রেসক্রিপশনের পরিষ্কার ছবি আপলোড করুন। সমর্থিত ফরম্যাট: JPG, PNG (সর্বোচ্চ ১০ এমবি)',
      dragDrop: 'আপনার প্রেসক্রিপশনের ছবি এখানে টেনে এনে ফেলুন',
      or: 'অথবা',
      browse: 'ছবি বাছাই করুন',
      uploadSubmit: 'আপলোড ও ডিজিটালাইজ করুন',
      uploadingMsg: 'প্রেসক্রিপশন নিরাপদে আপলোড হচ্ছে...',
      extractingMsg: 'এআই প্রেসক্রিপশনের তথ্য ডিজিটালাইজ করছে...',
      successMsg: '✓ প্রেসক্রিপশন সফলভাবে আপলোড হয়েছে! ব্যাকগ্রাউন্ডে প্রসেস করা হচ্ছে...',
    },
    doctorDashboard: {
      title: 'ক্লিনিকাল পর্যালোচনা ড্যাশবোর্ড',
      pendingReview: 'পর্যালোচনা অপেক্ষমাণ:',
      highRiskAlerts: 'উচ্চ ঝুঁকির সতর্কবার্তা:',
      refreshList: 'তালিকা রিফ্রেশ করুন',
      status: 'অবস্থা:',
      highRiskDetected: '⚠️ উচ্চ ঝুঁকি শনাক্ত',
      stableNoFlags: 'স্থিতিশীল / কোনো ঝুঁকি নেই',
      noPatients: 'আপনার কিউতে কোনো রোগী বরাদ্দ নেই।',
      rxRecordsTitle: 'রোগীর প্রেসক্রিপশন রেকর্ড',
    },
    therapistDashboard: {
      title: 'থেরাপি সেশন কনসোল',
      subtitle: 'অকুপেশনাল থেরাপি এবং পর্যবেক্ষণ লগ',
      myPatients: 'আমার রোগী তালিকা',
      sessionNotes: 'সেশন নোট:',
      stage: 'পর্যায়:',
      notesPlaceholder: 'ক্লিনিকাল পর্যবেক্ষণ, সেন্সরি প্রোফাইল আপডেট ও থেরাপির অগ্রগতি বিস্তারিত লিখুন...',
      saveBtn: 'স্বাক্ষর ও সংরক্ষণ করুন',
      savingBtn: 'এনক্রিপ্ট করে সংরক্ষণ হচ্ছে...',
      emptyState: 'চার্টিং শুরু করতে তালিকা থেকে একজন রোগী নির্বাচন করুন।',
      rxRecordsTitle: 'রোগীর প্রেসক্রিপশন রেকর্ড',
      saveSuccess: 'থেরাপির নোট সফলভাবে সংরক্ষিত হয়েছে।',
      saveFailed: 'নোট সংরক্ষণ করা সম্ভব হয়নি।',
      noActiveVisit: 'এই রোগীর জন্য কোনো সক্রিয় ভিজিট পাওয়া যায়নি। রোগী চেক-ইন করেছেন কিনা নিশ্চিত করুন।',
    },
    counsellorDashboard: {
      title: 'কাউন্সেলর ড্যাশবোর্ড',
      subtitle: 'রোগী অন্তর্ভুক্তি ও নিবন্ধন',
      newRegistration: 'নতুন রোগী নিবন্ধন',
      successGen: 'সফল! তৈরি হওয়া রোগী আইডি:',
      firstName: 'নামের প্রথম অংশ',
      lastName: 'পদবি / শেষ অংশ',
      dob: 'জন্ম তারিখ',
      gender: 'লিঙ্গ',
      male: 'পুরুষ (ছেলে)',
      female: 'মহিলা (মেয়ে)',
      other: 'অন্যান্য',
      guardianInfo: 'অভিভাবকের তথ্য',
      guardianName: 'অভিভাবকের নাম',
      contactPhone: 'যোগাযোগের ফোন নম্বর',
      address: 'ঠিকানা',
      registerBtn: 'রোগী নিবন্ধন করুন',
      registeringBtn: 'নিবন্ধন করা হচ্ছে...',
      pendingScreenings: 'অপেক্ষমাণ স্ক্রীনিং',
      noPending: 'কোনো অপেক্ষমাণ পদক্ষেপ নেই।',
      quickStats: 'একনজরে পরিসংখ্যান',
      registeredToday: 'আজ নিবন্ধিত রোগী',
      rxRecordsTitle: 'রোগীর প্রেসক্রিপশন রেকর্ড',
    },
    aboutPage: {
      pageTitle: 'প্ল্যাটফর্ম সম্পর্কে',
      heroHeading: 'আচরণের প্রারম্ভিক পর্যবেক্ষণ, মর্যাদার সাথে।',
      intro1: 'শৈশবের প্রথম পর্যায়টি শিশুর বিকাশ ও আচরণ বোঝার জন্য অত্যন্ত গুরুত্বপূর্ণ একটি সময়। তবে প্রথাগত ক্লিনিকাল পরিবেশ শিশুদের জন্য ভীতিকর হতে পারে, যা তাদের আচরণে প্রভাব ফেলে।',
      intro2: 'এই প্ল্যাটফর্মটি একটি সেতু হিসেবে কাজ করে: একটি আরামদায়ক ও পরিচিত পরিবেশে খেলাধুলার মাধ্যমে পরিচালিত কাঠামোগত পর্যবেক্ষণ। আমরা সামাজিক মনোযোগ, যোগাযোগের উদ্দেশ্য এবং পারস্পরিক প্রতিক্রিয়ার মতো প্রাকৃতিক লক্ষণ রেকর্ড করি।',
      tagSocial: 'সামাজিক মনোযোগ',
      tagEngagement: 'যৌথ অংশগ্রহণ',
      tagCommunication: 'যোগাযোগের আগ্রহ',
      boxTitle: 'গবেষণা ও স্ক্রীনিং সহায়তার জন্য',
      boxItem1: '১৮ মাস থেকে ৬ বছর বয়সের শিশুদের জন্য ডিজাইন করা',
      boxItem2: 'লোকাল-ফার্স্ট প্রসেসিংয়ের মাধ্যমে নামহীন তথ্য প্রক্রিয়াকরণ',
      boxItem3: 'ফলাফল কেবলমাত্র চিকিৎসকের পর্যালোচনার উদ্দেশ্যে',
      boxNote: 'সতর্কতা: অভিভাবকদের কোনো স্বয়ংক্রিয় ক্লিনিকাল রোগ নির্ণয় প্রদান করা হয় না।',
    },
    researchPage: {
      heading: 'গবেষণা ও পদ্ধতি',
      introText: 'এই প্ল্যাটফর্মটি প্রাথমিক শৈশবে প্রাকৃতিক আচরণগত সূচকগুলি ক্যাপচার করার জন্য ডিজাইন করা একটি কাঠামোগত, বহু-মডেল পর্যবেক্ষণ কাঠামোর উপর নির্ভর করে। আমাদের কার্যপদ্ধতি অনধিকারচর্চাহীন ডেটা সংগ্রহ এবং চিকিৎসকের নেতৃত্বাধীন ব্যাখ্যার ওপর গুরুত্ব দেয়।',
      card1Title: 'কার্যপদ্ধতির সারসংক্ষেপ',
      card1Text: 'সামাজিক মনোযোগ ও যৌথ যোগাযোগ লিপিবদ্ধ করার কাঠামোগত প্রোটোকল।',
      card2Title: 'পর্যবেক্ষণ কাঠামো',
      card2Text: 'ক্লিনিকাল ডায়াগনস্টিক মানদণ্ডের সাথে সমন্বিত মূল আচরণগত মার্কার।',
      ethicsTitle: 'নৈতিকতা ও তথ্য পরিচালনা',
      ethicsItem1Title: 'ডিভাইসেই তথ্য প্রক্রিয়াকরণ:',
      ethicsItem1Text: 'সম্ভব হলে সমস্ত তথ্য সরাসরি ডিভাইসের মধ্যেই সংরক্ষিত থাকে।',
      ethicsItem2Title: 'পরিচয়হীন মেট্রিক্স:',
      ethicsItem2Text: 'আচরণগত মেটাডেটার সাথে কোনো ব্যক্তিগত শনাক্তকারী তথ্য রাখা হয় না।',
      ethicsItem3Title: 'কেবলমাত্র চিকিৎসকের প্রবেশাধিকার:',
      ethicsItem3Text: 'মূল তথ্যে প্রবেশাধিকার কেবল অনুমোদিত কর্মীদের মধ্যেই সীমাবদ্ধ।',
      ethicsNote: 'এই প্ল্যাটফর্মটি শিশু আচরণ পর্যবেক্ষণের ক্ষেত্রে নির্ধারিত কঠোর নৈতিক নিয়মাবলি মেনে চলে।',
      citationTitle: 'গবেষণা প্রকাশনার তথ্য',
      citationText: 'কাঠামোটির সমস্ত গবেষণাপত্র ও পিয়ার-রিভিউড সূত্রের বিস্তারিত তালিকা প্রকাশের পর এখানে যুক্ত হবে।',
    },
    ethicsPage: {
      title: 'নৈতিকতা ও সম্মতি',
      subtitle: 'প্রাতিষ্ঠানিক পর্যালোচনা পর্ষদ (IRB) কর্তৃক অনুমোদিত',
      sec1Title: '১. নৈতিক কাঠামো',
      sec1Text: 'SMART-ASD প্ল্যাটফর্মটি আমাদের প্রাতিষ্ঠানিক পর্যালোচনা পর্ষদ (IRB) অনুমোদিত কঠোর নীতিমালার অধীনে পরিচালিত হয়। সমস্ত গবেষণামূলক কার্যক্রম নিম্নলিখিত নীতিগুলির সাথে সংগতিপূর্ণ:',
      sec1List: [
        'হেলসিঙ্কি ঘোষণা (Declaration of Helsinki)',
        'গুড ক্লিনিকাল প্র্যাকটিস (GCP) নির্দেশিকা',
        'জাতীয় ও আন্তর্জাতিক ডেটা সুরক্ষা আইন',
        'কল্যাণসাধন, অপকারহীনতা এবং ন্যায়বিচারের নৈতিক মূলনীতি',
      ],
      sec2Title: '২. অবহিত সম্মতি প্রক্রিয়া',
      sec2Text: 'যেকোনো গবেষণা কার্যক্রমে অংশগ্রহণের পূর্বে আপনি (অথবা আপনার শিশুর অভিভাবক) পাবেন:',
      sec2List: [
        'অধ্যয়নের উদ্দেশ্য ও কার্যপ্রণালীর বিশদ ব্যাখ্যা',
        'সম্ভাব্য ঝুঁকি ও সুবিধা সংক্রান্ত তথ্য',
        'স্বেচ্ছায় অংশগ্রহণ এবং যেকোনো সময় প্রত্যাহারের নিশ্চয়তা',
        'প্রশ্ন বা উদ্বেগের জন্য যোগাযোগ করার তথ্য',
        'সম্মতি দেওয়ার আগে পর্যালোচনা ও প্রশ্ন করার পর্যাপ্ত সময়',
      ],
      sec3Title: '৩. অংশগ্রহণকারীর অধিকার',
      sec3Subtitle: 'আপনার নিম্নলিখিত অধিকারসমূহ সংরক্ষিত রয়েছে:',
      sec3List: [
        'স্বেচ্ছায় অংশগ্রহণ: অংশগ্রহণ সম্পূর্ণ ইচ্ছাধীন',
        'যেকোনো সময় প্রত্যাহার: কোনো শাস্তি বা সুবিধা হারানো ছাড়াই যেকোনো সময় নাম প্রত্যাহার সম্ভব',
        'গোপনীয়তা রক্ষা: প্রকাশনাগুলিতে আপনার পরিচয় সম্পূর্ণ সুরক্ষিত রাখা হবে',
        'ফলাফল জানার সুযোগ: আপনি গবেষণার ফলাফলের সারসংক্ষেপ চাইতে পারেন',
        'প্রশ্ন করার স্বাধীনতা: যেকোনো সময় গবেষণা দলের সাথে যোগাযোগ করতে পারেন',
      ],
      sec4Title: '৪. সংবেদনশীল জনগোষ্ঠী সুরক্ষা',
      sec4Text: 'শিশু এবং বিকাশজনিত ভিন্নতা থাকা ব্যক্তিদের সুরক্ষার জন্য বিশেষ ব্যবস্থা গ্রহণ করা হয়েছে:',
      sec4List: [
        'অপ্রাপ্তবয়স্কদের ক্ষেত্রে পিতামাতা বা অভিভাবকের লিখিত সম্মতি বাধ্যতামূলক',
        'বিকাশগত সামর্থ্য অনুযায়ী শিশুর সম্মতি গ্রহণ',
        'সম্মতি প্রদানে অক্ষম ব্যক্তিদের ক্ষেত্রে অতিরিক্ত সুরক্ষা ব্যবস্থা',
        'অস্বস্তি বা পীড়নের লক্ষণ পর্যবেক্ষণে সার্বক্ষণিক নজরদারি',
      ],
      sec5Title: '৫. তথ্যের ব্যবহার ও পরিচয়হীনকরণ',
      sec5Text: 'গবেষণার তথ্য সর্বোচ্চ নৈতিক মানদণ্ড বজায় রেখে সংরক্ষণ ও পরিচালনা করা হয়:',
      sec5List: [
        'গবেষণা ডেটাসেট থেকে সমস্ত ব্যক্তিগত শনাক্তকারী তথ্য মুছে ফেলা হয়',
        'পরিসংখ্যানগত বিশ্লেষণের জন্য তথ্য সম্মিলিত আকারে ব্যবহার করা হয়',
        'কোনো প্রকাশনায় কোনো অংশগ্রহণকারীর পরিচয় প্রকাশ করা হয় না',
        'সীমাবদ্ধ অ্যাক্সেসসহ অত্যন্ত সুরক্ষিত স্টোরেজ ব্যবহার করা হয়',
      ],
      sec6Title: '৬. সম্ভাব্য ঝুঁকি ও সুফল',
      sec6RisksTitle: 'সম্ভাব্য ঝুঁকি:',
      sec6RisksList: [
        'পর্যবেক্ষণের সময় সাময়িক মানসিক জড়তা বা অস্বস্তি',
        'স্ক্রীনিং ও ফলো-আপের জন্য প্রয়োজনীয় সময়ের বিনিয়োগ',
        'গোপনীয়তা লঙ্ঘনের ন্যূনতম সম্ভাবনা (উন্নত নিরাপত্তার মাধ্যমে সুরক্ষিত)',
      ],
      sec6BenefitsTitle: 'সম্ভাব্য সুফল:',
      sec6BenefitsList: [
        'কাঠামোগত আচরণগত পর্যবেক্ষণের সুযোগ',
        'অটিজম সম্পর্কিত গবেষণায় মূল্যবান অবদান রাখা',
        'সম্ভাব্য প্রারম্ভিক লক্ষণ শনাক্তকরণ ও প্রয়োজনীয় সহায়তার পথ তৈরি',
        'প্রয়োজনীয় থেরাপিউটিক পরামর্শ ও সহায়তার সংযোগ পাওয়া',
      ],
      sec7Title: '৭. ক্ষতিপূরণ ও সহায়তা',
      sec7Text: 'গবেষণার প্রোটোকল অনুযায়ী অংশগ্রহণকারীরা তাদের মূল্যবান সময় ও যাতায়াত খরচের জন্য সাম্মানিক পেতে পারেন। এটি কোনোভাবেই গবেষণা সম্পন্ন করার ওপর নির্ভরশীল নয়।',
      sec8Title: '৮. নৈতিক বিষয়ে যোগাযোগের ঠিকানা',
      sec8Text: 'গবেষণার নৈতিক দিক বা অংশগ্রহণের বিষয়ে কোনো প্রশ্ন বা উদ্বেগ থাকলে আমাদের সাথে যোগাযোগ করুন:',
      sec8EmailLabel: 'ইমেইল:',
    },
    contactPage: {
      title: 'গবেষক দলের সাথে যোগাযোগ',
      subtitle: 'আমরা আপনাকে সহায়তা করতে প্রস্তুত',
      getInTouch: 'যোগাযোগের মাধ্যম',
      inquiriesText: 'গবেষণামূলক অনুসন্ধান, প্রযুক্তিগত সহায়তা বা প্ল্যাটফর্ম সম্পর্কিত যেকোনো প্রশ্নের জন্য:',
      emailLabel: 'ইমেইল:',
      responseNotice: 'আমরা সাধারণত কর্মদিবসে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে উত্তর দিয়ে থাকি।',
      aboutPlatformTitle: 'এই প্ল্যাটফর্ম সম্পর্কে',
      aboutPlatformText: 'SMART-ASD প্ল্যাটফর্মটি দায়িত্বশীল কৃত্রিম বুদ্ধিমত্তা প্রযুক্তি ও আচরণগত পর্যবেক্ষণের মাধ্যমে অটিজম স্পেকট্রাম ডিসঅর্ডার সম্পর্কে প্রাথমিক বোঝাপড়া গড়ে তোলার একটি গবেষণা উদ্যোগ।',
    },
    privacyPage: {
      title: 'গোপনীয়তা নীতি',
      updated: 'সর্বশেষ আপডেট: ফেব্রুয়ারি ২০২৬',
      sec1Title: '১. ভূমিকা',
      sec1Text: 'SMART-ASD প্ল্যাটফর্মটি আমাদের অটিজম গবেষণায় অংশগ্রহণকারী প্রত্যেকের তথ্যের গোপনীয়তা ও সুরক্ষা নিশ্চিত করতে বদ্ধপরিকর। এই নীতিতে আমরা কীভাবে তথ্য সংগ্রহ, ব্যবহার ও সুরক্ষিত করি তা ব্যাখ্যা করা হয়েছে।',
      sec2Title: '২. সংগৃহীত তথ্যাবলি',
      sec2PersonalTitle: 'ব্যক্তিগত তথ্য:',
      sec2PersonalList: [
        'নাম, জন্ম তারিখ এবং যোগাযোগের বিশদ বিবরণ',
        'অপ্রাপ্তবয়স্কদের জন্য অভিভাবক বা পিতামাতার তথ্য',
        'জনসংখ্যাতাত্ত্বিক উপাত্ত (বয়স, লিঙ্গ)',
      ],
      sec2HealthTitle: 'স্বাস্থ্য সংক্রান্ত তথ্য:',
      sec2HealthList: [
        'আচরণগত স্ক্রীনিং প্রশ্নাবলীর উত্তর',
        'ক্লিনিকাল পর্যবেক্ষণ ও মূল্যায়ন',
        'থেরাপি সেশনের নোট ও অগ্রগতির রেকর্ড',
        'প্রেসক্রিপশন ও চিকিৎসার তথ্য',
      ],
      sec3Title: '৩. তথ্যের ব্যবহার',
      sec3Text: 'আপনার তথ্য কেবল নিম্নলিখিত উদ্দেশ্যে ব্যবহৃত হয়:',
      sec3List: [
        'গবেষণার উদ্দেশ্য: অটিজম স্পেকট্রাম ডিসঅর্ডার সম্পর্কে গবেষণা সমৃদ্ধ করা',
        'ক্লিনিকাল সহায়তা: যথোপযুক্ত থেরাপিউটিক সহায়তা প্রদান',
        'উপাত্ত বিশ্লেষণ: প্যাটার্ন শনাক্তকরণ এবং স্ক্রীনিং মডেল উন্নত করা',
        'প্রাতিষ্ঠানিক সম্মতি: আইনগত ও নৈতিক মানদণ্ড পূরণ করা',
      ],
      sec4Title: '৪. ডেটা সুরক্ষা ও নিরাপত্তা',
      sec4Text: 'আমরা শিল্পমানের সর্বোচ্চ স্তরের সুরক্ষা ব্যবস্থা নিশ্চিত করি:',
      sec4List: [
        'সমস্ত সংবেদনশীল তথ্যের জন্য এন্ড-টু-এন্ড এনক্রিপশন',
        'ভূমিকাভিত্তিক অ্যাক্সেস নিয়ন্ত্রণ (অনুমোদিত কর্মী ব্যতীত প্রবেশাধিকার নিষিদ্ধ)',
        'নিয়মিত নিরাপত্তা অডিট এবং সুরক্ষা পরীক্ষা',
        'এনক্রিপ্টেড ব্যাকআপসহ ক্লাউড ও সার্ভার নিরাপত্তা',
        'ডেটা প্রবেশের প্রতিটি পদক্ষেপের সম্পূর্ণ অডিট লগ সংরক্ষণ',
      ],
      sec5Title: '৫. তথ্য আদান-প্রদান',
      sec5Text: 'আমরা কোনো অবস্থাতেই আপনার তথ্য তৃতীয় পক্ষের সাথে শেয়ার করি না, কেবল নিম্নলিখিত ক্ষেত্রে ব্যতীত:',
      sec5List: [
        'আপনার সুস্পষ্ট লিখিত সম্মতি সাপেক্ষে',
        'আইনগত বা আদালতের নির্দেশ অনুযায়ী প্রয়োজনীয় হলে',
        'পরিচয়হীন গবেষণাপত্র প্রকাশনার জন্য',
        'প্রাতিষ্ঠানিক নৈতিক পর্ষদের পর্যালোচনার জন্য',
      ],
      sec6Title: '৬. আপনার অধিকারসমূহ',
      sec6Text: 'অংশগ্রহণকারী হিসেবে আপনার অধিকার রয়েছে:',
      sec6List: [
        'যেকোনো সময় নিজের ডেটা পর্যালোচনা করার অধিকার',
        'ভুল তথ্য সংশোধনের অনুরোধ করার অধিকার',
        'গবেষণা থেকে যেকোনো সময় নাম প্রত্যাহার করার অধিকার',
        'তথ্য মুছে ফেলার অনুরোধ জানানোর অধিকার (আইন সাপেক্ষে)',
        'বহনযোগ্য ফরম্যাটে তথ্যের অনুলিপি পাওয়ার অধিকার',
      ],
      sec7Title: '৭. ডেটা সংরক্ষণের মেয়াদ',
      sec7Text: 'মেডিকেল গবেষণা নির্দেশিকা অনুযায়ী তথ্য ন্যূনতম ৭ বছর সুরক্ষিত রাখা হয়। এর পর তথ্য স্থায়ীভাবে পরিচয়হীন করা হয় অথবা নিরাপদে ধ্বংস করা হয়।',
      sec8Title: '৮. আমাদের সাথে যোগাযোগ',
      sec8Text: 'গোপনীয়তা অধিকার বা ডেটা সম্পর্কিত যেকোনো প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করতে পারেন:',
      sec8EmailLabel: 'ইমেইল:',
    },
    auth: {
      loginTitle: 'লগইন করুন',
      loginSubtitle: 'অনুগ্রহ করে আপনার শংসাপত্র দিয়ে সাইন ইন করুন',
      emailLabel: 'ইমেইল',
      emailPlaceholder: 'আপনার ইমেইল লিখুন',
      passwordLabel: 'পাসওয়ার্ড',
      passwordPlaceholder: 'আপনার পাসওয়ার্ড লিখুন',
      signInBtn: 'সাইন ইন',
      signingInBtn: 'সাইন ইন হচ্ছে...',
      newUserPrompt: 'নতুন ব্যবহারকারী?',
      registerLink: 'নিবন্ধন করুন',
      forgotPasswordLink: 'পাসওয়ার্ড ভুলে গেছেন?',
      restrictedNotice: 'কেবলমাত্র অনুমোদিত কর্মীদের জন্য সীমাবদ্ধ।',
      contactAt: 'যোগাযোগের ঠিকানা :',
    },
    screening: {
      pageTitle: 'যৌথ এএসডি স্ক্রীনিং (দ্বৈত মডেল)',
      pageSubtitle: 'মুখমণ্ডলের বায়োমার্কার ও আইএসএএ প্রশ্নাবলীর সমন্বয়ে গবেষণালব্ধ পূর্বাভাস বিশ্লেষণ।',
      breadcrumbDashboard: 'ড্যাশবোর্ড',
      breadcrumbScreening: 'এএসডি স্ক্রীনিং',
      step1Title: 'ধাপ ১: মুখের ছবির বায়োমার্কার বিশ্লেষণ',
      step1Subtitle: 'শিশুর একটি স্পষ্ট, সামনের দিকের মুখমণ্ডলের ছবি আপলোড করুন।',
      dragDropText: 'এখানে মুখমণ্ডলের ছবি টেনে এনে ফেলুন',
      orBrowse: 'অথবা',
      browseFiles: 'ফাইল বাছাই করুন',
      imageRequirements: 'গ্রহণযোগ্য ফরম্যাট: JPG, PNG · সর্বোচ্চ আকার: ৫ এমবি · ভালো আলো এবং সরাসরি মুখের দিক',
      fileSelected: 'নির্বাচিত ছবি',
      changeImage: 'ছবি পরিবর্তন করুন',
      step2Title: 'ধাপ ২: আচরণ ও ক্লিনিকাল প্রশ্নাবলী',
      step2Subtitle: 'NILD 2026 ISAA ক্লিনিকাল ডেটাসেটের ভিত্তিতে প্রস্তুত।',
      submitScreening: 'যৌথ এএসডি স্ক্রীনিং শুরু করুন',
      analyzing: 'এআই মডেল বিশ্লেষণ করছে...',
      disclaimerNotice: 'স্ক্রীনিং ফলাফল প্রাথমিক গবেষণালব্ধ তথ্য; কোনো চূড়ান্ত রোগ নির্ণয় নয়। চিকিৎসকের পরামর্শ আবশ্যক।',
      validationError: 'জমা দেওয়ার আগে অনুগ্রহ করে সমস্ত প্রশ্নের সঠিক উত্তর দিন।',
      errorPrefix: 'ত্রুটি',
    },
    questionnaire: {
      age: { label: 'বয়স (বছরে)', placeholder: 'যেমন ৪.৫', hint: 'শিশুর বর্তমান বয়স (দশমিকে হতে পারে, যেমন ৩.৫)' },
      gender: { label: 'লিঙ্গ', male: 'পুরুষ (ছেলে)', female: 'মহিলা (মেয়ে)' },
      hyperactive: { label: 'অতিসক্রিয় আচরণ (Hyperactive)', hint: 'শিশু কি অতিরিক্ত অস্থির বা অতিসক্রিয় আচরণ প্রদর্শন করে?' },
      responsive: { label: 'নাম ধরে ডাকলে সাড়া দেয় (Responsive)', hint: 'নাম ধরে ডাকলে বা নির্দেশনা দিলে শিশু কি স্বাভাবিক সাড়া দেয়?' },
      epilepsy: { label: 'মৃগীরোগ / খিঁচুনির ইতিহাস (Epilepsy)', hint: 'খিঁচুনি বা মৃগীরোগের কোনো পূর্ব ইতিহাস আছে কি?' },
      diagnosed: { label: 'প্রথম লক্ষণ দেখার পর অতিবাহিত সময় (বছর)', placeholder: 'যেমন ২.০', hint: 'আচরণে ভিন্নতা প্রথম লক্ষ্য করার পর কত বছর অতিবাহিত হয়েছে' },
      color_recognize: { label: 'রঙ চিনতে পারা (Color Recognition)', hint: 'শিশু কি সাধারণ রঙগুলি শনাক্ত ও চিহ্নিত করতে পারে?' },
      emotional_response: { label: 'উপযুক্ত আবেগের প্রকাশ (Emotional Response)', hint: 'পরিস্থিতি অনুযায়ী কি শিশু স্বাভাবিক আবেগ ও প্রতিক্রিয়া প্রকাশ করে?' },
      head_injury: { label: 'মাথায় আঘাতের ইতিহাস (Head Injury)', hint: 'পূর্বে মাথায় কোনো গুরুতর আঘাত পাওয়ার ইতিহাস আছে কি?' },
      speech: { label: 'কথা বলার ক্ষমতা (Functional Speech)', hint: 'শিশু কি প্রয়োজনীয় বা অর্থপূর্ণ ভাষায় কথা বলতে পারে?' },
      eye_contact: { label: 'চোখে চোখ রাখা (Eye Contact)', hint: 'শিশু কি অন্যদের সাথে স্বাভাবিকভাবে দৃষ্টি বিনিময় বা আই-কন্ট্যাক্ট রাখে?' },
      yes: 'হ্যাঁ',
      no: 'না',
    },
    results: {
      title: 'স্ক্রীনিং মূল্যায়ন ফলাফল',
      subtitle: 'ভারযুক্ত যৌথ বিশ্লেষণ (৪০% মুখের বায়োমার্কার + ৬০% ক্লিনিকাল প্রশ্নাবলী)',
      patientLabel: 'রোগী',
      patientId: 'রোগী আইডি (Patient ID)',
      facialTitle: 'মুখমণ্ডলের বায়োমার্কার বিশ্লেষণ',
      facialModel: 'EfficientNetB4 + ViT (ভার: ৪০%)',
      assessment: 'মূল্যায়ন',
      facialScore: 'মুখের এএসডি ঝুঁকি',
      facialConfidence: 'মডেল আত্মবিশ্বাস',
      weightLabel: 'নির্ধারিত ভার (Weight)',
      contributionLabel: 'স্কোরে অবদান (Contribution)',
      threshold50: '৫০% ডায়াগনস্টিক মাত্রা',
      questionnaireTitle: 'প্রশ্নাবলী ও আচরণ বিশ্লেষণ',
      questionnaireModel: 'Random Forest · NILD 2026 ISAA (ভার: ৬০%)',
      isaaProfile: 'ক্লিনিকাল প্রোফাইল',
      modelConfidence: 'মডেল আত্মবিশ্বাস',
      probabilitiesTitle: 'সম্ভাবনা বন্টন',
      mild: 'মাইল্ড এএসডি প্রোফাইল',
      moderate: 'মডারেট এএসডি প্রোফাইল',
      modelNote: 'এনআইএলডি কলকাতা আইএসএএ ক্লিনিকাল ডেটাসেটে ক্রমাঙ্কিত।',
      combinedTitle: 'যৌথ এএসডি স্ক্রীনিং মূল্যায়ন',
      combinedFormula: 'যৌথ স্কোর = (মুখের স্কোর × ০.৪০) + (প্রশ্নাবলীর স্কোর × ০.৬০)',
      finalScore: 'সর্বশেষ ভারযুক্ত স্কোর',
      riskCategory: 'ঝুঁকির মাত্রা (Risk Level)',
      medicalDisclaimerTitle: 'চিকিৎসা ও আইনগত সতর্কতা',
      medicalDisclaimer: 'এই এআই-ভিত্তিক স্ক্রীনিং কেবল পর্যবেক্ষণমূলক অন্তর্দৃষ্টি প্রদান করে এবং এটি কোনো চূড়ান্ত ক্লিনিকাল ডায়াগনোসিস নয়। ফলাফল অবশ্যই একজন নিবন্ধিত বিশেষজ্ঞ চিকিৎসক বা মনোবিজ্ঞানীর দ্বারা পর্যালোচনা করতে হবে।',
      downloadReport: 'রিপোর্ট প্রিন্ট / সংরক্ষণ করুন',
      newScreening: 'নতুন স্ক্রীনিং করুন',
      returnDashboard: 'ড্যাশবোর্ডে ফিরুন',
    },
    professional: {
      patientProfileTitle: 'ক্লিনিকাল রোগীর রেকর্ড ও স্ক্রীনিং প্রোফাইল',
      patientIdLookup: 'রোগীর রেকর্ড অনুসন্ধান করুন',
      searchPlaceholder: 'রোগীর আইডি দিন (যেমন SMART-2026-XXXXXX)',
      lookupBtn: 'রেকর্ড দেখুন',
      searching: 'অনুমতি যাচাই এবং লোড হচ্ছে...',
      noAccessGranted: 'এই রোগী আইডির জন্য কোনো সক্রিয় অনুমতি পাওয়া যায়নি।',
      accessDeniedTitle: 'অনুমোদন সীমাবদ্ধ',
      patientInfo: 'রোগীর বিবরণ',
      age: 'বয়স',
      gender: 'লিঙ্গ',
      screeningsSection: 'স্ক্রীনিং ইতিহাস ও যৌথ মূল্যায়ন',
      facialSection: 'মুখের ছবি ও বায়োমার্কার বিশ্লেষণ',
      questionnaireSection: 'প্রশ্নাবলীর উত্তর ও ক্লিনিকাল প্রোফাইল',
      prescriptionsSection: 'প্রেসক্রিপশন ও ডিজিটালাইজড তথ্য',
      facialImage: 'স্ক্রীনিংয়ে ব্যবহৃত মুখের ছবি',
      originalPrescription: 'মূল প্রেসক্রিপশন নথি',
      viewDocument: 'মূল নথি দেখুন',
      medicinesPrescribed: 'ডিজিটালাইজড ওষুধসমূহ',
      dosage: 'মাত্রা (Dosage)',
      frequency: 'ব্যবহারের ব্যবধান (Frequency)',
      instructions: 'নির্দেশনা',
      questionsAnswers: 'প্রশ্নাবলীর রোগীর প্রদত্ত উত্তর',
      question: 'প্রশ্ন',
      patientResponse: 'উত্তর',
      noScreeningsYet: 'এই রোগীর কোনো স্ক্রীনিং রেকর্ড নেই।',
      noPrescriptionsYet: 'পর্যালোচনার জন্য কোনো প্রেসক্রিপশন সংরক্ষিত নেই।',
    },
  },

  hi: {
    common: {
      back: '← पीछे जाएं',
      backHome: '← होम',
      loading: 'लोड हो रहा है...',
      save: 'सहेजें',
      saving: 'सहेजा जा रहा है...',
      cancel: 'रद्द करें',
      error: 'त्रुटि',
      success: 'सफल',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      view: 'देखें',
      submit: 'जमा करें',
      refresh: 'रिफ्रेश करें',
      brand: 'एएसडी अनुसंधान प्लेटफ़ॉर्म',
      id: 'आईडी',
      status: 'स्थिति',
      date: 'दिनांक',
    },
    nav: {
      home: 'होम',
      about: 'हमारे बारे में',
      research: 'अनुसंधान',
      dashboard: 'डैशबोर्ड',
      signOut: 'साइन आउट',
      login: 'लॉगिन',
      register: 'पंजीकरण',
      profile: 'प्रोफ़ाइल',
    },
    footer: {
      disclaimerTitle: 'केवल अनुसंधान हेतु।',
      disclaimerText: 'यह प्रणाली ऑटिज्म स्पेक्ट्रम डिसऑर्डर का निदान नहीं करती है। यह केवल संरचित व्यवहार अवलोकन में सहायता करती है और किसी भी प्रकार से पेशेवर चिकित्सीय मूल्यांकन का विकल्प नहीं है।',
      copyright: 'एएसडी अनुसंधान प्लेटफ़ॉर्म',
      privacyPolicy: 'गोपनीयता नीति',
      ethicsConsent: 'नैतिकता एवं सहमति',
      contact: 'अनुसंधान दल से संपर्क',
    },
    langModal: {
      title: 'SMART ASD प्लेटफ़ॉर्म में आपका स्वागत है',
      subtitle: 'कृपया आगे बढ़ने के लिए अपनी पसंदीदा भाषा चुनें।',
      selectPrompt: 'अपनी भाषा चुनें',
      continueBtn: 'आगे बढ़ें',
      english: 'English (अंग्रेज़ी)',
      bengali: 'বাংলা (बंगाली)',
      hindi: 'हिन्दी (Hindi)',
    },
    patientDashboard: {
      portalTitle: 'वेरीफाई एएसडी मरीज़ पोर्टल',
      dashboardFor: 'सुरक्षित डैशबोर्ड:',
      loadingPortal: 'आपका सुरक्षित पोर्टल लोड हो रहा है...',
      screeningHistory: 'स्क्रीनिंग इतिहास',
      noScreenings: 'कोई स्क्रीनिंग दर्ज नहीं है।',
      risk: 'जोखिम',
      startNewScreening: 'नई स्क्रीनिंग शुरू करें →',
      prescriptions: 'प्रिस्क्रिप्शन',
      therapyProgress: 'थेरेपी प्रगति',
      noTherapy: 'कोई थेरेपी सत्र नहीं मिला।',
      progressLabel: 'प्रगति:',
      loadError: 'डैशबोर्ड लोड नहीं हो सका। कृपया पुनः लॉगिन करने का प्रयास करें।',
    },
    prescriptions: {
      title: 'प्रिस्क्रिप्शन',
      uploadBtn: '+ प्रिस्क्रिप्शन अपलोड करें',
      emptyState: 'अभी तक कोई प्रिस्क्रिप्शन अपलोड नहीं किया गया है।',
      emptySubtext: 'अपने प्रिस्क्रिप्शन को डिजिटाइज़ करने के लिए "+ प्रिस्क्रिप्शन अपलोड करें" पर क्लिक करें।',
      loading: 'प्रिस्क्रिप्शन लोड हो रहे हैं...',
      loadError: 'प्रिस्क्रिप्शन लोड नहीं हो सके। कृपया पेज रीफ़्रेश करें।',
      statusProcessing: '⏳ प्रोसेसिंग जारी',
      statusProcessed: '✓ डिजिटाइज़्ड',
      statusFailed: '⚠ प्रोसेसिंग विफल',
      statusPending: '◷ लंबित',
      prescriptionNumber: 'प्रिस्क्रिप्शन #',
      uploaded: 'अपलोड तिथि',
      viewDigital: 'डिजिटल प्रिस्क्रिप्शन देखें',
      hideDetails: 'विवरण छुपाएं',
      retryParsing: '🔄 पुनः एआई विश्लेषण करें',
      viewOriginal: 'मूल दस्तावेज़ देखें',
      accessDetails: '▼ अनुमति एवं विवरण',
      collapse: '▲ संक्षेप करें',
      delete: 'हटाएं',
      confirmDelete: 'क्या आप इस प्रिस्क्रिप्शन को हटाना चाहते हैं? इसे पूर्ववत नहीं किया जा सकता।',
      digitalRxTitle: '⚕ डिजिटल प्रिस्क्रिप्शन',
      date: 'दिनांक:',
      doctor: 'चिकित्सक:',
      license: 'लाइसेंस:',
      clinicalNotes: 'क्लिनिकल नोट्स:',
      medications: 'दवाइयां',
      strength: 'मात्रा / शक्ति:',
      dosage: 'खुराक:',
      frequency: 'आवृत्ति:',
      duration: 'अवधि:',
      route: 'लेने का तरीका:',
      instructions: 'निर्देश:',
      notes: 'नोट्स:',
      confidence: 'एआई विश्वसनीयता:',
      disclaimer: '⚠ एआई द्वारा निकाली गई जानकारी को मूल प्रिस्क्रिप्शन से सत्यापित किया जाना चाहिए। यह चिकित्सीय निर्णय का विकल्प नहीं है।',
      accessTitle: 'प्रिस्क्रिप्शन पहुंच नियंत्रण',
      authorizedPros: 'वर्तमान में अधिकृत चिकित्सक / विशेषज्ञ:',
      granted: 'अनुमत',
      revoke: 'हटाएं',
      noAccess: 'वर्तमान में किसी भी विशेषज्ञ को इस प्रिस्क्रिप्शन की अनुमति नहीं दी गई है।',
      grantAccessTo: 'किसी चिकित्सक को पहुंच की अनुमति दें:',
      searchPlaceholder: 'चिकित्सक के नाम से खोजें...',
      uploadModalTitle: 'प्रिस्क्रिप्शन अपलोड करें',
      uploadModalSubtitle: 'अपने प्रिस्क्रिप्शन की स्पष्ट तस्वीर अपलोड करें। समर्थित प्रारूप: JPG, PNG (अधिकतम 10 MB)',
      dragDrop: 'प्रिस्क्रिप्शन की तस्वीर यहाँ खींचकर छोड़ें',
      or: 'या',
      browse: 'तस्वीर चुनें',
      uploadSubmit: 'अपलोड और डिजिटाइज़ करें',
      uploadingMsg: 'प्रिस्क्रिप्शन सुरक्षित रूप से अपलोड हो रहा है...',
      extractingMsg: 'एआई प्रिस्क्रिप्शन विवरण निकाल रहा है...',
      successMsg: '✓ प्रिस्क्रिप्शन सफलतापूर्वक अपलोड हुआ! बैकग्राउंड में प्रोसेसिंग जारी है...',
    },
    doctorDashboard: {
      title: 'क्लिनिकल समीक्षा डैशबोर्ड',
      pendingReview: 'समीक्षा लंबित:',
      highRiskAlerts: 'उच्च जोखिम अलर्ट:',
      refreshList: 'सूची ताज़ा करें',
      status: 'स्थिति:',
      highRiskDetected: '⚠️ उच्च जोखिम पाया गया',
      stableNoFlags: 'स्थिर / कोई जोखिम नहीं',
      noPatients: 'आपकी कतार में कोई मरीज़ असाइन नहीं है।',
      rxRecordsTitle: 'मरीज़ प्रिस्क्रिप्शन रिकॉर्ड',
    },
    therapistDashboard: {
      title: 'थेरेपी सत्र कंसोल',
      subtitle: 'ऑक्यूपेशनल थेरेपी एवं हस्तक्षेप लॉग',
      myPatients: 'मेरे मरीज़',
      sessionNotes: 'सत्र नोट्स:',
      stage: 'चरण:',
      notesPlaceholder: 'विस्तृत क्लिनिकल अवलोकन, संवेदी प्रोफ़ाइल अपडेट और प्रतिक्रिया दर्ज करें...',
      saveBtn: 'हस्ताक्षर एवं सहेजें',
      savingBtn: 'एन्क्रिप्टेड लॉग सहेजा जा रहा है...',
      emptyState: 'चार्टिंग शुरू करने के लिए सूची से एक मरीज़ चुनें।',
      rxRecordsTitle: 'मरीज़ प्रिस्क्रिप्शन रिकॉर्ड',
      saveSuccess: 'थेरेपी नोट्स सफलतापूर्वक सहेजे गए।',
      saveFailed: 'नोट्स सहेजने में विफल।',
      noActiveVisit: 'इस मरीज़ के लिए कोई सक्रिय विज़िट नहीं मिली। कृपया सुनिश्चित करें कि वे चेक-इन हैं।',
    },
    counsellorDashboard: {
      title: 'काउंसलर डैशबोर्ड',
      subtitle: 'मरीज़ इनटेक एवं पंजीकरण',
      newRegistration: 'नया मरीज़ पंजीकरण',
      successGen: 'सफलता! जनरेट की गई मरीज़ आईडी:',
      firstName: 'पहला नाम',
      lastName: 'अंतिम नाम',
      dob: 'जन्म तिथि',
      gender: 'लिंग',
      male: 'पुरुष (लड़का)',
      female: 'महिला (लड़की)',
      other: 'अन्य',
      guardianInfo: 'अभिभावक की जानकारी',
      guardianName: 'अभिभावक का नाम',
      contactPhone: 'संपर्क फ़ोन',
      address: 'पता',
      registerBtn: 'मरीज़ पंजीकृत करें',
      registeringBtn: 'पंजीकरण हो रहा है...',
      pendingScreenings: 'लंबित स्क्रीनिंग',
      noPending: 'कोई लंबित कार्य नहीं।',
      quickStats: 'त्वरित आँकड़े',
      registeredToday: 'आज पंजीकृत मरीज़',
      rxRecordsTitle: 'मरीज़ प्रिस्क्रिप्शन रिकॉर्ड',
    },
    aboutPage: {
      pageTitle: 'प्लेटफ़ॉर्म के बारे में',
      heroHeading: 'प्रारंभिक अवलोकन, संवेदनशीलता के साथ।',
      intro1: 'प्रारंभिक बचपन विकासात्मक पैटर्न को समझने के लिए एक महत्वपूर्ण समय है। हालांकि, पारंपरिक क्लिनिकल वातावरण छोटे बच्चों के लिए तनावपूर्ण हो सकता है, जिससे उनके व्यवहार पर असर पड़ता है।',
      intro2: 'यह प्लेटफ़ॉर्म एक सेतु का काम करता है: संरचित, खेल-आधारित अवलोकन जो एक सहज वातावरण में होता है। हम सामाजिक ध्यान, संचार के इरादे और पारस्परिकता से संबंधित प्राकृतिक व्यवहार संकेतकों को रिकॉर्ड करने पर ध्यान केंद्रित करते हैं।',
      tagSocial: 'सामाजिक ध्यान',
      tagEngagement: 'संयुक्त जुड़ाव',
      tagCommunication: 'संचार का इरादा',
      boxTitle: 'अनुसंधान एवं स्क्रीनिंग सहायता हेतु',
      boxItem1: '18 महीने से 6 वर्ष की आयु के लिए डिज़ाइन किया गया',
      boxItem2: 'लोकल-फ़र्स्ट प्रोसेसिंग द्वारा डेटा का अनामीकरण',
      boxItem3: 'परिणाम केवल विशेषज्ञ समीक्षा के लिए हैं',
      boxNote: 'नोट: अभिभावकों को कोई स्वचालित क्लिनिकल निदान नहीं दिया जाता है।',
    },
    researchPage: {
      heading: 'अनुसंधान एवं कार्यप्रणाली',
      introText: 'यह प्लेटफ़ॉर्म प्रारंभिक बचपन में प्राकृतिक व्यवहार संकेतकों को कैप्चर करने के लिए डिज़ाइन किए गए एक संरचित, बहु-मॉडल अवलोकन ढांचे पर निर्भर करता है। हमारी कार्यप्रणाली सहज डेटा संग्रह और विशेषज्ञ-आधारित व्याख्या को प्राथमिकता देती है।',
      card1Title: 'कार्यप्रणाली अवलोकन',
      card1Text: 'सामाजिक ध्यान और संयुक्त जुड़ाव रिकॉर्ड करने के लिए संरचित प्रोटोकॉल।',
      card2Title: 'अवलोकन ढांचा',
      card2Text: 'क्लिनिकल नैदानिक मानदंडों के साथ संरेखित प्रमुख व्यवहार मार्कर।',
      ethicsTitle: 'नैतिकता एवं डेटा प्रबंधन',
      ethicsItem1Title: 'लोकल-फ़र्स्ट प्रोसेसिंग:',
      ethicsItem1Text: 'डेटा यथासंभव डिवाइस पर ही सुरक्षित रहता है।',
      ethicsItem2Title: 'अनाम मेट्रिक्स:',
      ethicsItem2Text: 'व्यवहार मेटाडेटा के साथ कोई व्यक्तिगत पहचान जानकारी संग्रहीत नहीं की जाती।',
      ethicsItem3Title: 'केवल विशेषज्ञ पहुंच:',
      ethicsItem3Text: 'मूल डेटा केवल अधिकृत कर्मियों तक ही सीमित है।',
      ethicsNote: 'यह प्लेटफ़ॉर्म बाल व्यवहार अवलोकन के लिए सख्त नैतिक दिशानिर्देशों का पालन करता है।',
      citationTitle: 'विस्तृत प्रकाशन डेटा',
      citationText: 'ढांचे के लिए पूर्ण संदर्भ और सहकर्मी-समीक्षित स्रोत प्रकाशन के बाद यहाँ सूचीबद्ध किए जाएंगे।',
    },
    ethicsPage: {
      title: 'नैतिकता एवं सहमति',
      subtitle: 'संस्थागत समीक्षा बोर्ड (IRB) द्वारा अनुमोदित',
      sec1Title: '१. नैतिक ढांचा',
      sec1Text: 'SMART-ASD प्लेटफ़ॉर्म हमारे संस्थागत समीक्षा बोर्ड (IRB) द्वारा अनुमोदित सख्त नैतिक दिशानिर्देशों के तहत संचालित होता है। सभी अनुसंधान गतिविधियां निम्नलिखित के अनुरूप हैं:',
      sec1List: [
        'हेलसिंकी घोषणा (Declaration of Helsinki)',
        'गुड क्लिनिकल प्रैक्टिस (GCP) दिशानिर्देश',
        'राष्ट्रीय और अंतर्राष्ट्रीय डेटा सुरक्षा नियम',
        'हितकारिता, अहिंसा और न्याय के नैतिक सिद्धांत',
      ],
      sec2Title: '२. सूचित सहमति प्रक्रिया',
      sec2Text: 'किसी भी शोध गतिविधि में भाग लेने से पहले, आपको (या आपके बच्चे के अभिभावक को) प्राप्त होगा:',
      sec2List: [
        'अध्ययन के उद्देश्य और प्रक्रियाओं की विस्तृत व्याख्या',
        'संभावित जोखिमों और लाभों की जानकारी',
        'स्वैच्छिक भागीदारी और किसी भी समय हटने का अधिकार',
        'सवालों या चिंताओं के लिए संपर्क जानकारी',
        'हस्ताक्षर करने से पहले समीक्षा और प्रश्न पूछने का पर्याप्त समय',
      ],
      sec3Title: '३. प्रतिभागी अधिकार',
      sec3Subtitle: 'आपको निम्नलिखित अधिकार प्राप्त हैं:',
      sec3List: [
        'स्वैच्छिक भागीदारी: भागीदारी पूरी तरह से स्वैच्छिक है',
        'किसी भी समय हटने का अधिकार: आप बिना किसी नुकसान के कभी भी हट सकते हैं',
        'गोपनीयता: सभी प्रकाशनों में आपकी पहचान सुरक्षित रखी जाएगी',
        'परिणामों तक पहुंच: आप शोध निष्कर्षों का सारांश मांग सकते हैं',
        'प्रश्न पूछने की स्वतंत्रता: किसी भी समय शोध दल से संपर्क करें',
      ],
      sec4Title: '४. संवेदनशील जनसंख्या सुरक्षा',
      sec4Text: 'बच्चों और विकासात्मक भिन्नता वाले व्यक्तियों के लिए विशेष सुरक्षा उपाय हैं:',
      sec4List: [
        'नाबालिगों के लिए माता-पिता/अभिभावक की सहमति अनिवार्य',
        'विकासात्मक रूप से उपयुक्त होने पर बच्चों से स्वीकृति प्राप्त करना',
        'सहमति देने में असमर्थ प्रतिभागियों के लिए अतिरिक्त सुरक्षा उपाय',
        'तनाव या असुविधा के संकेतों की निरंतर निगरानी',
      ],
      sec5Title: '५. डेटा उपयोग और अनामीकरण',
      sec5Text: 'अनुसंधान डेटा को उच्चतम नैतिक मानकों के साथ संभाला जाता है:',
      sec5List: [
        'शोध डेटासेट से व्यक्तिगत पहचानकर्ता हटा दिए जाते हैं',
        'सांख्यिकीय विश्लेषण के लिए डेटा एकत्रित किया जाता है',
        'प्रकाशनों में किसी भी प्रतिभागी की पहचान नहीं की जा सकती',
        'प्रतिबंधित पहुंच के साथ अत्यधिक सुरक्षित भंडारण',
      ],
      sec6Title: '६. संभावित जोखिम एवं लाभ',
      sec6RisksTitle: 'संभावित जोखिम:',
      sec6RisksList: [
        'मूल्यांकन के दौरान न्यूनतम मनोवैज्ञानिक असुविधा',
        'स्क्रीनिंग और फॉलो-अप के लिए आवश्यक समय',
        'गोपनीयता के उल्लंघन की न्यूनतम संभावना (सख्त सुरक्षा द्वारा नियंत्रित)',
      ],
      sec6BenefitsTitle: 'संभावित लाभ:',
      sec6BenefitsList: [
        'संरचित व्यवहार मूल्यांकन तक पहुंच',
        'ऑटिज्म अनुसंधान में मूल्यवान योगदान',
        'संभावित प्रारंभिक पहचान और समय पर सहायता',
        'आवश्यक चिकित्सीय संसाधनों से जुड़ाव',
      ],
      sec7Title: '७. क्षतिपूर्ति एवं सहायता',
      sec7Text: 'प्रतिभागियों को अध्ययन प्रोटोकॉल के अनुसार उनके समय और यात्रा खर्च के लिए मानदेय मिल सकता है। यह अध्ययन पूरा करने पर निर्भर नहीं है।',
      sec8Title: '८. नैतिक चिंताओं के लिए संपर्क',
      sec8Text: 'यदि आपके पास इस शोध के नैतिक आचरण के बारे में चिंताएं हैं या भागीदारी के बारे में प्रश्न हैं:',
      sec8EmailLabel: 'ईमेल:',
    },
    contactPage: {
      title: 'अनुसंधान दल से संपर्क करें',
      subtitle: 'हम आपकी सहायता के लिए यहाँ हैं',
      getInTouch: 'संपर्क करें',
      inquiriesText: 'शोध संबंधी पूछताछ, तकनीकी सहायता या SMART-ASD प्लेटफ़ॉर्म के बारे में सामान्य प्रश्नों के लिए:',
      emailLabel: 'ईमेल:',
      responseNotice: 'हम आमतौर पर कार्य दिवसों के दौरान 24-48 घंटों के भीतर उत्तर देते हैं।',
      aboutPlatformTitle: 'इस प्लेटफ़ॉर्म के बारे में',
      aboutPlatformText: 'SMART-ASD प्लेटफ़ॉर्म एक अनुसंधान पहल है जो संरचित व्यवहार अवलोकन और जिम्मेदार एआई तकनीक के माध्यम से ऑटिज्म स्पेक्ट्रम विकारों की प्रारंभिक समझ का समर्थन करने पर केंद्रित है।',
    },
    privacyPage: {
      title: 'गोपनीयता नीति',
      updated: 'अंतिम अपडेट: फरवरी 2026',
      sec1Title: '१. परिचय',
      sec1Text: 'SMART-ASD प्लेटफ़ॉर्म हमारे ऑटिज्म स्पेक्ट्रम अनुसंधान में सभी प्रतिभागियों की गोपनीयता और सुरक्षा बनाए रखने के लिए प्रतिबद्ध है। यह नीति बताती है कि हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित रखते हैं।',
      sec2Title: '२. हमारे द्वारा एकत्र की जाने वाली जानकारी',
      sec2PersonalTitle: 'व्यक्तिगत जानकारी:',
      sec2PersonalList: [
        'नाम, जन्म तिथि और संपर्क विवरण',
        'नाबालिग प्रतिभागियों के लिए अभिभावक/माता-पिता की जानकारी',
        'जनसांख्यिकीय डेटा (आयु, लिंग)',
      ],
      sec2HealthTitle: 'स्वास्थ्य संबंधी जानकारी:',
      sec2HealthList: [
        'व्यवहार स्क्रीनिंग प्रश्नावली प्रतिक्रियाएं',
        'क्लिनिकल अवलोकन और मूल्यांकन',
        'थेरेपी सत्र नोट्स और प्रगति रिकॉर्ड',
        'प्रिस्क्रिप्शन और उपचार संबंधी जानकारी',
      ],
      sec3Title: '३. हम आपकी जानकारी का उपयोग कैसे करते हैं',
      sec3Text: 'आपकी जानकारी का उपयोग केवल निम्नलिखित उद्देश्यों के लिए किया जाता है:',
      sec3List: [
        'अनुसंधान उद्देश्य: ऑटिज्म स्पेक्ट्रम विकारों की समझ को आगे बढ़ाना',
        'क्लिनिकल सहायता: उपयुक्त उपचारात्मक हस्तक्षेप प्रदान करना',
        'डेटा विश्लेषण: पैटर्न की पहचान करना और स्क्रीनिंग मॉडल में सुधार करना',
        'संस्थागत अनुपालन: नियामक और नैतिक आवश्यकताओं को पूरा करना',
      ],
      sec4Title: '४. डेटा सुरक्षा एवं संरक्षण',
      sec4Text: 'हम उद्योग-मानक सुरक्षा उपाय लागू करते हैं:',
      sec4List: [
        'सभी संवेदनशील डेटा के लिए एंड-टू-एंड एन्क्रिप्शन',
        'भूमिका-आधारित पहुंच नियंत्रण (केवल अधिकृत कर्मियों को ही पहुंच)',
        'नियमित सुरक्षा ऑडिट और अनुपालन जांच',
        'एन्क्रिप्टेड बैकअप के साथ सुरक्षित डेटाबेस भंडारण',
        'डेटा पहुंच और संशोधनों का ऑडिट लॉगिंग',
      ],
      sec5Title: '५. डेटा साझाकरण एवं प्रकटीकरण',
      sec5Text: 'हम आपकी व्यक्तिगत जानकारी को तीसरे पक्ष के साथ साझा नहीं करते हैं, सिवाय:',
      sec5List: [
        'आपकी स्पष्ट लिखित सहमति के साथ',
        'जब कानून या कानूनी प्रक्रिया द्वारा आवश्यक हो',
        'अनाम शोध प्रकाशनों के लिए (कोई व्यक्तिगत पहचानकर्ता नहीं)',
        'नैतिक निगरानी के लिए संस्थागत समीक्षा बोर्डों के साथ',
      ],
      sec6Title: '६. आपके अधिकार',
      sec6Text: 'एक प्रतिभागी के रूप में, आपको अधिकार है:',
      sec6List: [
        'किसी भी समय अपने व्यक्तिगत डेटा तक पहुंच प्राप्त करना',
        'गलत जानकारी में सुधार का अनुरोध करना',
        'किसी भी समय अध्ययन से अपना नाम वापस लेना',
        'डेटा हटाने का अनुरोध करना (कानूनी आवश्यकताओं के अधीन)',
        'पोर्टेबल प्रारूप में अपने डेटा की प्रति प्राप्त करना',
      ],
      sec7Title: '७. डेटा प्रतिधारण',
      sec7Text: 'संस्थागत दिशानिर्देशों के अनुसार शोध डेटा न्यूनतम 7 वर्षों के लिए रखा जाता है। इसके बाद डेटा को अनाम कर दिया जाता है या सुरक्षित रूप से नष्ट कर दिया जाता है।',
      sec8Title: '८. हमसे संपर्क करें',
      sec8Text: 'किसी भी प्रश्न, चिंता या अपने गोपनीयता अधिकारों का प्रयोग करने के लिए, कृपया संपर्क करें:',
      sec8EmailLabel: 'ईमेल:',
    },
    auth: {
      loginTitle: 'लॉगिन करें',
      loginSubtitle: 'कृपया अपने क्रेडेंशियल्स के साथ साइन इन करें',
      emailLabel: 'ईमेल',
      emailPlaceholder: 'अपना ईमेल दर्ज करें',
      passwordLabel: 'पासवर्ड',
      passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
      signInBtn: 'साइन इन',
      signingInBtn: 'साइन इन हो रहा है...',
      newUserPrompt: 'नए उपयोगकर्ता?',
      registerLink: 'पंजीकरण करें',
      forgotPasswordLink: 'पासवर्ड भूल गए?',
      restrictedNotice: 'केवल अधिकृत कर्मियों तक ही सीमित।',
      contactAt: 'संपर्क करें :',
    },
    screening: {
      pageTitle: 'संयुक्त एएसडी स्क्रीनिंग (दोहरी मॉडल)',
      pageSubtitle: 'चेहरे के बायोमार्कर और आईएसएए प्रश्नावली के संयोजन से शोध-आधारित विश्लेषण।',
      breadcrumbDashboard: 'डैशबोर्ड',
      breadcrumbScreening: 'एएसडी स्क्रीनिंग',
      step1Title: 'चरण १: चेहरे के बायोमार्कर का विश्लेषण',
      step1Subtitle: 'बच्चे का स्पष्ट, सामने की ओर देखने वाला फ़ोटो अपलोड करें।',
      dragDropText: 'चेहरे की तस्वीर यहाँ खींचकर छोड़ें',
      orBrowse: 'या',
      browseFiles: 'फ़ाइल चुनें',
      imageRequirements: 'स्वीकृत प्रारूप: JPG, PNG · अधिकतम आकार: 5MB · सीधी रोशनी और स्पष्ट चेहरा',
      fileSelected: 'चयनित फ़ोटो',
      changeImage: 'फ़ोटो बदलें',
      step2Title: 'चरण २: व्यवहार एवं नैदानिक प्रश्नावली',
      step2Subtitle: 'प्रमाणित NILD 2026 ISAA क्लिनिकल डेटासेट पर आधारित।',
      submitScreening: 'संयुक्त एएसडी स्क्रीनिंग शुरू करें',
      analyzing: 'एआई मॉडल विश्लेषण कर रहा है...',
      disclaimerNotice: 'स्क्रीनिंग परिणाम भविष्यसूचक अनुसंधान विश्लेषण हैं, यह अंतिम निदान नहीं है। चिकित्सकीय परामर्श आवश्यक है।',
      validationError: 'जमा करने से पहले कृपया सभी आवश्यक प्रश्नों के सही उत्तर दें।',
      errorPrefix: 'त्रुटि',
    },
    questionnaire: {
      age: { label: 'आयु (वर्षों में)', placeholder: 'जैसे 4.5', hint: 'बच्चे की वर्तमान आयु (दशमलव में भी, जैसे 3.5)' },
      gender: { label: 'लिंग', male: 'पुरुष (लड़का)', female: 'महिला (लड़की)' },
      hyperactive: { label: 'अतिसक्रिय व्यवहार (Hyperactive)', hint: 'क्या बच्चा अत्यधिक बेचैन या अतिसक्रिय व्यवहार प्रदर्शित करता है?' },
      responsive: { label: 'नाम पुकारने पर प्रतिक्रिया (Responsive)', hint: 'क्या बच्चा नाम पुकारने या निर्देश देने पर प्रतिक्रिया देता है?' },
      epilepsy: { label: 'मिर्गी / दौरे का इतिहास (Epilepsy)', hint: 'क्या मिर्गी या दौरे का कोई पूर्व इतिहास है?' },
      diagnosed: { label: 'लक्षण दिखने के बाद बीता समय (वर्ष)', placeholder: 'जैसे 2.0', hint: 'व्यवहार में भिन्नता सबसे पहले देखने के बाद से बीते वर्ष' },
      color_recognize: { label: 'रंग पहचानना (Color Recognition)', hint: 'क्या बच्चा बुनियादी रंगों को पहचान सकता है?' },
      emotional_response: { label: 'उचित भावनात्मक प्रतिक्रिया (Emotional Response)', hint: 'क्या बच्चा परिस्थिति के अनुसार उचित भावनाएं व्यक्त करता है?' },
      head_injury: { label: 'सिर में चोट का इतिहास (Head Injury)', hint: 'क्या अतीत में सिर में कोई गंभीर चोट लगी थी?' },
      speech: { label: 'बोलने की क्षमता (Functional Speech)', hint: 'क्या बच्चा अर्थपूर्ण शब्दों या भाषा का उपयोग करता है?' },
      eye_contact: { label: 'आई-कॉन्टैक्ट (Eye Contact)', hint: 'क्या बच्चा दूसरों से बात करते समय सामान्य रूप से आंखें मिलाता है?' },
      yes: 'हाँ',
      no: 'नहीं',
    },
    results: {
      title: 'स्क्रीनिंग मूल्यांकन परिणाम',
      subtitle: 'भारित बहु-मॉडल विश्लेषण (40% चेहरे का बायोमार्कर + 60% प्रश्नावली)',
      patientLabel: 'मरीज़',
      patientId: 'मरीज़ आईडी (Patient ID)',
      facialTitle: 'चेहरे के बायोमार्कर का विश्लेषण',
      facialModel: 'EfficientNetB4 + ViT (भार: 40%)',
      assessment: 'मूल्यांकन',
      facialScore: 'चेहरे का एएसडी जोखिम',
      facialConfidence: 'मॉडल का विश्वास',
      weightLabel: 'निर्धारित भार (Weight)',
      contributionLabel: 'स्कोर में योगदान (Contribution)',
      threshold50: '50% नैदानिक सीमा',
      questionnaireTitle: 'प्रश्नावली एवं व्यवहार विश्लेषण',
      questionnaireModel: 'Random Forest · NILD 2026 ISAA (भार: 60%)',
      isaaProfile: 'क्लिनिकल प्रोफ़ाइल',
      modelConfidence: 'मॉडल का विश्वास',
      probabilitiesTitle: 'संभावना वितरण',
      mild: 'माइल्ड एएसडी प्रोफ़ाइल',
      moderate: 'मॉडरेट एएसडी प्रोफ़ाइल',
      modelNote: 'एनआईएलডি कोलकाता आईएसएए क्लिनिकल डेटासेट पर कैलिब्रेटेड।',
      combinedTitle: 'संयुक्त एएसडी स्क्रीनिंग मूल्यांकन',
      combinedFormula: 'संयुक्त स्कोर = (चेहरे का स्कोर × 0.40) + (प्रश्नावली स्कोर × 0.60)',
      finalScore: 'अंतिम भारित स्कोर',
      riskCategory: 'जोखिम स्तर (Risk Level)',
      medicalDisclaimerTitle: 'चिकित्सीय एवं कानूनी अस्वीकरण',
      medicalDisclaimer: 'यह एआई-सहायता प्राप्त स्क्रीनिंग केवल अवलोकन संबंधी अंतर्दृष्टि प्रदान करती है और यह कोई निश्चित चिकित्सीय निदान नहीं है। परिणाम की समीक्षा पंजीकृत चिकित्सक या योग्य मनोवैज्ञानिक द्वारा की जानी चाहिए।',
      downloadReport: 'रिपोर्ट प्रिंट / सहेजें',
      newScreening: 'नई स्क्रीनिंग करें',
      returnDashboard: 'डैशबोर्ड पर लौटें',
    },
    professional: {
      patientProfileTitle: 'क्लिनिकल मरीज़ रिकॉर्ड और स्क्रीनिंग प्रोफ़ाइल',
      patientIdLookup: 'मरीज़ रिकॉर्ड खोजें',
      searchPlaceholder: 'मरीज़ आईडी दर्ज करें (जैसे SMART-2026-XXXXXX)',
      lookupBtn: 'रिकॉर्ड प्राप्त करें',
      searching: 'अनुमति सत्यापन एवं लोड हो रहा है...',
      noAccessGranted: 'इस मरीज़ आईडी के लिए कोई सक्रिय अनुमति नहीं मिली।',
      accessDeniedTitle: 'पहुंच प्रतिबंधित',
      patientInfo: 'मरीज़ विवरण',
      age: 'आयु',
      gender: 'लिंग',
      screeningsSection: 'स्क्रीनिंग इतिहास एवं बहु-मॉडल मूल्यांकन',
      facialSection: 'चेहरे का फ़ोटो और बायोमार्कर विश्लेषण',
      questionnaireSection: 'प्रश्नावली उत्तर और क्लिनिकल प्रोफ़ाइल',
      prescriptionsSection: 'प्रिस्क्रिप्शन और डिजीटल रिकॉर्ड',
      facialImage: 'स्क्रीनिंग में प्रयुक्त चेहरे का फ़ोटो',
      originalPrescription: 'मूल प्रिस्क्रिप्शन दस्तावेज़',
      viewDocument: 'मूल दस्तावेज़ देखें',
      medicinesPrescribed: 'डिजिटाइज़्ड दवाएं',
      dosage: 'मात्रा (Dosage)',
      frequency: 'आवृत्ति (Frequency)',
      instructions: 'निर्देश',
      questionsAnswers: 'मरीज़ के प्रश्नावली उत्तर',
      question: 'प्रश्न',
      patientResponse: 'उत्तर',
      noScreeningsYet: 'इस मरीज़ के लिए कोई स्क्रीनिंग रिकॉर्ड दर्ज नहीं है।',
      noPrescriptionsYet: 'समीक्षा के लिए कोई प्रिस्क्रिप्शन उपलब्ध नहीं है।',
    },
  },
};
