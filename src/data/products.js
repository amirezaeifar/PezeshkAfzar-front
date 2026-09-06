const l = (en, fa) => ({ en, fa })

const product = ({
  id,
  number,
  type,
  icon,
  name,
  category,
  tagline,
  description,
  features,
  benefits,
  applications,
  specs,
  assurances,
  gallery,
  galleryAlt,
  faq,
  flagship = false,
}) => ({
  id,
  number,
  type,
  icon,
  name,
  category,
  tagline,
  description,
  features,
  benefits,
  applications,
  specs,
  certifications: assurances,
  gallery,
  galleryAlt,
  image: gallery[0],
  faq,
  flagship,
  span: 'normal',
  catalog: '/catalogs/pezeshk-afzar-product-catalog.pdf',
})

export const products = [
  product({
    id: 'todays-mom',
    number: '01',
    type: 'software',
    icon: 'mother',
    flagship: true,
    name: l("Today's Mom", 'مامان امروز'),
    category: l('Maternal & child health', 'سلامت مادر و کودک'),
    tagline: l(
      'AI-guided support from pregnancy through early childhood.',
      'همراه هوشمند مادر از بارداری تا سال‌های نخست کودکی.',
    ),
    description: l(
      "Today's Mom brings trusted education, daily check-ins, growth tracking, and timely care guidance into one calm experience. It helps mothers understand what matters today while giving care teams a clearer view of the questions and signals that need attention.",
      '«مامان امروز» آموزش معتبر، پیگیری روزانه، ثبت رشد و راهنمایی به‌موقع را در تجربه‌ای آرام کنار هم می‌آورد. مادر می‌داند امروز چه چیزی مهم است و تیم درمان هم نشانه‌ها و پرسش‌هایی را که نیاز به توجه دارند روشن‌تر می‌بیند.',
    ),
    features: {
      en: ['Pregnancy and child-development timeline', 'AI-assisted question routing', 'Daily wellbeing and symptom check-ins', 'Care-team education library'],
      fa: ['خط زمانی بارداری و رشد کودک', 'هدایت هوشمند پرسش‌ها', 'ثبت روزانه حال عمومی و علائم', 'کتابخانه آموزشی تیم درمان'],
    },
    benefits: {
      en: ['Clear next steps for mothers', 'Earlier visibility of concerning changes', 'More consistent education between visits'],
      fa: ['قدم بعدی روشن برای مادر', 'دید زودتر نسبت به تغییرات نگران‌کننده', 'آموزش یکدست‌تر میان ویزیت‌ها'],
    },
    applications: {
      en: ['Maternity clinics', 'Obstetrics practices', 'Pediatric follow-up programs', 'Community health networks'],
      fa: ['کلینیک‌های مادران', 'مطب‌های زنان و زایمان', 'برنامه‌های پیگیری کودکان', 'شبکه‌های بهداشت جامعه'],
    },
    specs: [
      { label: l('Experience', 'تجربه'), value: l('Responsive web platform', 'پلتفرم وب واکنش‌گرا') },
      { label: l('Access', 'دسترسی'), value: l('Mother and care-team roles', 'نقش‌های مادر و تیم درمان') },
      { label: l('Content', 'محتوا'), value: l('Stage-aware care pathways', 'مسیرهای مراقبتی متناسب با مرحله') },
      { label: l('Delivery', 'ارائه'), value: l('Cloud or private deployment', 'استقرار ابری یا خصوصی') },
    ],
    assurances: {
      en: ['Clinician-reviewed care content', 'Role-aware access controls', 'Privacy-first data handling'],
      fa: ['محتوای بازبینی‌شده توسط درمانگران', 'کنترل دسترسی مبتنی بر نقش', 'مدیریت داده با اولویت حریم خصوصی'],
    },
    gallery: [
      '/images/software/todays-mom-card.jpg',
      '/images/software/todays-mom-family.jpg',
      '/images/software/todays-mom-care.jpg',
    ],
    galleryAlt: {
      en: ['Golden-hour wildflowers rising through a calm summer meadow', 'Mount Fuji beneath a soft orange sunset', 'A natural limestone arch above clear blue water'],
      fa: ['گل‌های وحشی در نور طلایی یک چمنزار آرام تابستانی', 'کوه فوجی زیر غروب نرم و نارنجی', 'طاق طبیعی سنگی بر فراز آب‌های شفاف آبی'],
    },
    faq: [
      {
        question: l('Does the platform replace medical advice?', 'آیا این پلتفرم جایگزین توصیه پزشکی است؟'),
        answer: l('No. It supports education, check-ins, and care coordination; diagnosis and treatment decisions remain with qualified clinicians.', 'خیر. پلتفرم برای آموزش، پیگیری و هماهنگی مراقبت است و تشخیص و درمان همچنان بر عهده درمانگر واجد صلاحیت می‌ماند.'),
      },
      {
        question: l('Can a clinic tailor its care pathways?', 'آیا کلینیک می‌تواند مسیرهای مراقبتی را شخصی‌سازی کند؟'),
        answer: l('Yes. Content, check-ins, and escalation routes can be configured around the clinic’s approved workflow.', 'بله. محتوا، پیگیری‌ها و مسیر ارجاع می‌توانند مطابق گردش‌کار تأییدشده کلینیک تنظیم شوند.'),
      },
    ],
  }),
  product({
    id: 'skinapp',
    number: '02',
    type: 'software',
    icon: 'skin',
    name: l('SkinApp', 'اسکین‌اَپ'),
    category: l('AI dermatology support', 'پشتیبان هوشمند پوست'),
    tagline: l(
      'Structured skin screening and follow-up, with clinicians in control.',
      'غربالگری ساختاریافته پوست و پیگیری منظم، با کنترل کامل درمانگر.',
    ),
    description: l(
      'SkinApp helps people capture consistent skin images, answer guided questions, and reach the right clinical pathway sooner. For dermatology teams, it organizes longitudinal images and symptom context so review starts with a clearer picture.',
      'اسکین‌اَپ به افراد کمک می‌کند تصاویر پوستی یکدست ثبت کنند، به پرسش‌های هدایت‌شده پاسخ دهند و زودتر به مسیر درمانی درست برسند. برای تیم پوست، تصاویر طولی و زمینه علائم منظم می‌شود تا بررسی با تصویر روشن‌تری آغاز شود.',
    ),
    features: {
      en: ['Guided image capture', 'AI-assisted visual triage', 'Longitudinal skin-image timeline', 'Clinician review workspace'],
      fa: ['ثبت هدایت‌شده تصویر', 'تریاژ تصویری با کمک هوش مصنوعی', 'خط زمانی تصاویر پوست', 'فضای بررسی درمانگر'],
    },
    benefits: {
      en: ['More consistent intake images', 'Faster routing to appropriate care', 'Easier visual follow-up over time'],
      fa: ['تصاویر ورودی یکدست‌تر', 'هدایت سریع‌تر به مراقبت مناسب', 'پیگیری تصویری ساده‌تر در طول زمان'],
    },
    applications: {
      en: ['Dermatology clinics', 'Teledermatology services', 'Primary-care networks', 'Skin-health screening programs'],
      fa: ['کلینیک‌های پوست', 'خدمات پوست از راه دور', 'شبکه‌های مراقبت اولیه', 'برنامه‌های غربالگری سلامت پوست'],
    },
    specs: [
      { label: l('Input', 'ورودی'), value: l('Guided mobile photography', 'تصویربرداری هدایت‌شده با موبایل') },
      { label: l('Review', 'بررسی'), value: l('Clinician-in-the-loop workflow', 'گردش‌کار با نظارت درمانگر') },
      { label: l('History', 'سابقه'), value: l('Time-based image comparison', 'مقایسه تصویری در طول زمان') },
      { label: l('Delivery', 'ارائه'), value: l('Responsive web platform', 'پلتفرم وب واکنش‌گرا') },
    ],
    assurances: {
      en: ['Decision support, not autonomous diagnosis', 'Auditable review trail', 'Controlled clinical access'],
      fa: ['پشتیبان تصمیم، نه تشخیص خودکار', 'ردپای قابل ممیزی بررسی', 'دسترسی کنترل‌شده درمانی'],
    },
    gallery: [
      '/images/software/skinapp-card.jpg',
      '/images/software/skinapp-scan.jpg',
      '/images/software/skinapp-review.jpg',
    ],
    galleryAlt: {
      en: ['Soft morning light tracing minimalist sand dunes', 'Still blue water at Lake Tahoe in morning light', 'A sweeping glacier beneath a clean alpine sky'],
      fa: ['نور نرم صبحگاهی بر موج‌های مینیمال شن', 'آب آرام و آبی دریاچه تاهو در نور صبح', 'چشم‌انداز گسترده یخچال طبیعی زیر آسمان پاک آلپ'],
    },
    faq: [
      {
        question: l('Does SkinApp provide a final diagnosis?', 'آیا اسکین‌اَپ تشخیص نهایی ارائه می‌دهد؟'),
        answer: l('No. It organizes information and supports triage so a qualified clinician can review and decide the appropriate next step.', 'خیر. اطلاعات را منظم و تریاژ را پشتیبانی می‌کند تا درمانگر واجد صلاحیت قدم بعدی را تعیین کند.'),
      },
      {
        question: l('Can previous images be compared?', 'آیا تصاویر قبلی قابل مقایسه‌اند؟'),
        answer: l('Yes. Authorized users can review a time-based visual history to support follow-up conversations.', 'بله. کاربران مجاز می‌توانند سابقه تصویری زمان‌محور را برای پیگیری بهتر مرور کنند.'),
      },
    ],
  }),
  product({
    id: 'agingdrug',
    number: '04',
    type: 'software',
    icon: 'medication',
    name: l('AgingDrug', 'اِیجینگ‌دراگ'),
    category: l('Clinical drug reference', 'مرجع بالینی دارو'),
    tagline: l(
      'Medication knowledge shaped for safer decisions in older-adult care.',
      'دانش دارویی برای تصمیم‌های ایمن‌تر در مراقبت سالمندان.',
    ),
    description: l(
      'AgingDrug gives clinicians a focused reference for medication review in older adults. It brings age-related precautions, interaction context, dose considerations, and monitoring prompts into a fast, searchable clinical workspace.',
      'ایجینگ‌دراگ مرجعی متمرکز برای بازبینی دارو در سالمندان در اختیار درمانگر می‌گذارد. احتیاط‌های مرتبط با سن، زمینه تداخل‌ها، ملاحظات دوز و یادآورهای پایش در فضای بالینی سریع و قابل جست‌وجو کنار هم قرار می‌گیرند.',
    ),
    features: {
      en: ['Older-adult medication reference', 'Interaction and duplication review', 'Monitoring prompts', 'Fast clinical search'],
      fa: ['مرجع دارویی سالمندان', 'بررسی تداخل و مصرف تکراری', 'یادآورهای پایش', 'جست‌وجوی سریع بالینی'],
    },
    benefits: {
      en: ['More structured medication reviews', 'Important cautions surfaced sooner', 'A shared reference for multidisciplinary teams'],
      fa: ['بازبینی دارویی ساختاریافته‌تر', 'نمایش زودتر احتیاط‌های مهم', 'مرجع مشترک برای تیم چندتخصصی'],
    },
    applications: {
      en: ['Geriatric clinics', 'Hospital pharmacy', 'Primary care', 'Medication review services'],
      fa: ['کلینیک‌های سالمندی', 'داروخانه بیمارستانی', 'مراقبت اولیه', 'خدمات بازبینی دارو'],
    },
    specs: [
      { label: l('Reference', 'مرجع'), value: l('Age-aware medication profiles', 'پروفایل دارویی حساس به سن') },
      { label: l('Review', 'بازبینی'), value: l('Interactions and monitoring', 'تداخل‌ها و پایش') },
      { label: l('Users', 'کاربران'), value: l('Clinical and pharmacy teams', 'تیم‌های بالینی و داروسازی') },
      { label: l('Access', 'دسترسی'), value: l('Searchable responsive web app', 'وب‌اپ واکنش‌گرا و قابل جست‌وجو') },
    ],
    assurances: {
      en: ['Evidence-referenced content workflow', 'Versioned clinical entries', 'Clear decision-support boundaries'],
      fa: ['گردش‌کار محتوای مبتنی بر منابع', 'مدخل‌های بالینی نسخه‌بندی‌شده', 'مرز روشن پشتیبانی تصمیم'],
    },
    gallery: [
      '/images/software/agingdrug-hero.jpg',
      '/images/software/agingdrug-pharmacy.jpg',
      '/images/software/agingdrug-review.jpg',
    ],
    galleryAlt: {
      en: ['Cloud-softened forest ridges in gentle morning light', 'Vibrant green mountains above a deep blue lake', 'Sunlit Dolomite peaks above an open plateau'],
      fa: ['خط‌الرأس‌های جنگلی در میان ابرهای نرم', 'کوهستان سبز و درخشان بر فراز دریاچه آبی عمیق', 'قله‌های آفتابی دولومیت بر فراز دشتی باز'],
    },
    faq: [
      {
        question: l('Is AgingDrug a prescribing system?', 'آیا ایجینگ‌دراگ سامانه تجویز است؟'),
        answer: l('No. It is a focused reference and review aid; prescribing authority and clinical judgment remain with the treating professional.', 'خیر. این محصول مرجع و ابزار کمک‌بررسی است و اختیار تجویز و قضاوت بالینی با درمانگر باقی می‌ماند.'),
      },
      {
        question: l('Can content updates be tracked?', 'آیا تغییرات محتوا قابل پیگیری است؟'),
        answer: l('Yes. Clinical entries can be versioned so authorized teams can see when reviewed content changed.', 'بله. مدخل‌های بالینی نسخه‌بندی می‌شوند تا تیم مجاز زمان تغییر محتوای بازبینی‌شده را ببیند.'),
      },
    ],
  }),
  product({
    id: 'chemo-care',
    number: '05',
    type: 'software',
    icon: 'oncology',
    name: l('ChemoCare', 'مراقبت شیمی‌درمانی'),
    category: l('Oncology education', 'آموزش انکولوژی'),
    tagline: l(
      'Clear treatment education and between-visit support for chemotherapy patients.',
      'آموزش روشن درمان و همراهی بیمار شیمی‌درمانی میان جلسات.',
    ),
    description: l(
      'ChemoCare helps patients and families understand the treatment journey in manageable steps. Personalized education, appointment preparation, symptom check-ins, and care-team guidance reduce uncertainty without overwhelming people with information.',
      'مراقبت شیمی‌درمانی به بیمار و خانواده کمک می‌کند مسیر درمان را در قدم‌های قابل‌فهم بشناسند. آموزش شخصی‌سازی‌شده، آمادگی جلسه، ثبت علائم و راهنمایی تیم درمان، ابهام را بدون انباشت اطلاعات کم می‌کند.',
    ),
    features: {
      en: ['Treatment-stage education', 'Appointment preparation', 'Between-visit symptom check-ins', 'Care-team guidance and escalation'],
      fa: ['آموزش متناسب با مرحله درمان', 'آمادگی برای جلسه درمان', 'ثبت علائم میان جلسات', 'راهنمایی و ارجاع تیم درمان'],
    },
    benefits: {
      en: ['More confident treatment preparation', 'Clearer communication with care teams', 'Consistent support for patients and families'],
      fa: ['آمادگی مطمئن‌تر برای درمان', 'ارتباط روشن‌تر با تیم درمان', 'حمایت یکدست از بیمار و خانواده'],
    },
    applications: {
      en: ['Oncology centers', 'Day chemotherapy units', 'Patient education teams', 'Cancer-support programs'],
      fa: ['مراکز انکولوژی', 'بخش‌های شیمی‌درمانی روزانه', 'تیم‌های آموزش بیمار', 'برنامه‌های حمایت از سرطان'],
    },
    specs: [
      { label: l('Journey', 'مسیر'), value: l('Stage-based education', 'آموزش مرحله‌محور') },
      { label: l('Check-ins', 'پیگیری'), value: l('Configurable symptom prompts', 'پرسش‌های قابل تنظیم علائم') },
      { label: l('Audience', 'مخاطب'), value: l('Patients, families, care teams', 'بیمار، خانواده و تیم درمان') },
      { label: l('Delivery', 'ارائه'), value: l('Mobile-first web platform', 'پلتفرم وب موبایل‌محور') },
    ],
    assurances: {
      en: ['Clinician-approved education pathways', 'Clear urgent-care directions', 'Privacy-aware family access'],
      fa: ['مسیر آموزشی تأییدشده توسط درمانگر', 'راهنمای روشن مراقبت فوری', 'دسترسی خانواده با رعایت حریم خصوصی'],
    },
    gallery: [
      '/images/software/chemotherapy-care-hero.jpg',
      '/images/software/chemotherapy-care-oncology.jpg',
      '/images/software/chemotherapy-care-planning.jpg',
    ],
    galleryAlt: {
      en: ['A quiet alpine lake beneath a pastel sunrise', 'A bright waterfall flowing through green woodland', 'Layered forest mountains beneath soft natural light'],
      fa: ['دریاچه‌ای کوهستانی زیر آسمان صورتی طلوع', 'آبشاری روشن در میان جنگلی سرسبز', 'لایه‌های کوهستان جنگلی زیر نور نرم طبیعی'],
    },
    faq: [
      {
        question: l('Can each oncology unit use its own education plan?', 'آیا هر بخش انکولوژی می‌تواند برنامه آموزشی خودش را داشته باشد؟'),
        answer: l('Yes. Approved content and check-ins can be aligned with the unit’s protocols and patient pathways.', 'بله. محتوا و پیگیری‌های تأییدشده با پروتکل‌ها و مسیرهای بیمار هر بخش هماهنگ می‌شوند.'),
      },
      {
        question: l('How are urgent concerns handled?', 'نگرانی‌های فوری چگونه مدیریت می‌شوند؟'),
        answer: l('The experience presents clear, service-approved escalation instructions and never positions automated guidance as emergency care.', 'تجربه کاربری مسیر ارجاع تأییدشده خدمت را روشن نشان می‌دهد و راهنمای خودکار را جایگزین مراقبت فوری معرفی نمی‌کند.'),
      },
    ],
  }),
  product({
    id: 'gib',
    number: '06',
    type: 'software',
    icon: 'telecare',
    name: l('GIB', 'GIB'),
    category: l('Gastrointestinal telecare', 'مراقبت از راه دور گوارش'),
    tagline: l(
      'Structured remote follow-up for upper gastrointestinal bleeding pathways.',
      'پیگیری ساختاریافته از راه دور در مسیرهای خونریزی گوارشی فوقانی.',
    ),
    description: l(
      'GIB supports planned follow-up after assessment or discharge with guided check-ins, education, and care-team review. It gives patients a clear way to report changes and helps clinical services organize non-emergency follow-up around agreed pathways.',
      'GIB پیگیری برنامه‌ریزی‌شده پس از ارزیابی یا ترخیص را با ثبت هدایت‌شده، آموزش و بازبینی تیم درمان پشتیبانی می‌کند. بیمار راهی روشن برای گزارش تغییرات دارد و خدمت درمانی می‌تواند پیگیری غیراورژانسی را مطابق مسیر توافق‌شده منظم کند.',
    ),
    features: {
      en: ['Guided post-discharge check-ins', 'Care-pathway education', 'Clinical review queue', 'Escalation instructions'],
      fa: ['پیگیری هدایت‌شده پس از ترخیص', 'آموزش مسیر مراقبت', 'صف بررسی بالینی', 'دستورالعمل ارجاع'],
    },
    benefits: {
      en: ['Clearer follow-up after discharge', 'More organized non-emergency review', 'Better visibility of reported changes'],
      fa: ['پیگیری روشن‌تر پس از ترخیص', 'بازبینی غیراورژانسی منظم‌تر', 'دید بهتر نسبت به تغییرات گزارش‌شده'],
    },
    applications: {
      en: ['Gastroenterology units', 'Emergency follow-up services', 'Discharge teams', 'Telehealth programs'],
      fa: ['بخش‌های گوارش', 'خدمات پیگیری اورژانس', 'تیم‌های ترخیص', 'برنامه‌های سلامت از راه دور'],
    },
    specs: [
      { label: l('Workflow', 'گردش‌کار'), value: l('Pathway-based follow-up', 'پیگیری مبتنی بر مسیر') },
      { label: l('Review', 'بررسی'), value: l('Care-team queue', 'صف تیم درمان') },
      { label: l('Access', 'دسترسی'), value: l('Patient and clinician roles', 'نقش بیمار و درمانگر') },
      { label: l('Delivery', 'ارائه'), value: l('Secure responsive web app', 'وب‌اپ امن و واکنش‌گرا') },
    ],
    assurances: {
      en: ['Explicit emergency-care boundaries', 'Auditable check-in history', 'Configurable service pathways'],
      fa: ['مرز روشن مراقبت اورژانسی', 'سابقه قابل ممیزی پیگیری', 'مسیرهای خدمت قابل تنظیم'],
    },
    gallery: [
      '/images/software/gib-hero.jpg',
      '/images/software/gib-telecare.jpg',
      '/images/software/gib-nursing.jpg',
    ],
    galleryAlt: {
      en: ['Rolling green hills in warm, quiet sunlight', 'A forest waterfall surrounded by vivid green leaves', 'A wide volcanic landscape beneath a clear blue sky'],
      fa: ['تپه‌های سبز و آرام در نور گرم عصرگاهی', 'آبشاری جنگلی میان برگ‌های سبز و زنده', 'چشم‌انداز وسیع آتشفشانی زیر آسمان زلال آبی'],
    },
    faq: [
      {
        question: l('Is GIB an emergency-response service?', 'آیا GIB یک خدمت پاسخ اورژانسی است؟'),
        answer: l('No. It supports planned follow-up and clearly directs urgent symptoms to emergency services.', 'خیر. برای پیگیری برنامه‌ریزی‌شده است و علائم فوری را به‌روشنی به خدمات اورژانسی هدایت می‌کند.'),
      },
      {
        question: l('Can discharge teams configure follow-up timing?', 'آیا تیم ترخیص می‌تواند زمان پیگیری را تنظیم کند؟'),
        answer: l('Yes. Check-in timing and review routes can be configured around the approved discharge pathway.', 'بله. زمان پیگیری و مسیر بازبینی بر اساس روند تأییدشده ترخیص قابل تنظیم است.'),
      },
    ],
  }),
  product({
    id: 'desktop-autoclaves',
    number: '07',
    type: 'equipment',
    icon: 'autoclave',
    name: l('Desktop Autoclaves', 'اتوکلاوهای رومیزی'),
    category: l('Compact steam sterilization', 'استریلیزاسیون بخار فشرده'),
    tagline: l(
      'Professional tabletop sterilization for clinics and compact care settings.',
      'استریلیزاسیون حرفه‌ای رومیزی برای کلینیک‌ها و فضاهای درمانی کوچک.',
    ),
    description: l(
      'A compact sterilization range for practices that need dependable steam cycles without a large equipment footprint. Configurations are selected around load type, daily throughput, available utilities, and local service requirements.',
      'مجموعه‌ای فشرده برای مراکزی که به چرخه‌های بخار قابل‌اعتماد در فضای محدود نیاز دارند. پیکربندی بر اساس نوع بار، ظرفیت روزانه، زیرساخت موجود و نیاز خدمات محلی انتخاب می‌شود.',
    ),
    features: {
      en: ['Compact tabletop footprint', 'Programmed steam cycles', 'Cycle records and status display', 'Service-oriented installation'],
      fa: ['ابعاد فشرده رومیزی', 'چرخه‌های برنامه‌ریزی‌شده بخار', 'ثبت چرخه و نمایش وضعیت', 'نصب با رویکرد خدمات‌پذیر'],
    },
    benefits: {
      en: ['Efficient use of clinical space', 'Repeatable day-to-day workflows', 'Configuration matched to actual loads'],
      fa: ['استفاده بهینه از فضای کلینیک', 'گردش‌کار روزانه تکرارپذیر', 'پیکربندی متناسب با بار واقعی'],
    },
    applications: {
      en: ['Dental clinics', 'Outpatient practices', 'Laboratories', 'Minor-procedure rooms'],
      fa: ['کلینیک‌های دندان‌پزشکی', 'مراکز سرپایی', 'آزمایشگاه‌ها', 'اتاق‌های اقدامات کوچک'],
    },
    specs: [
      { label: l('Chamber', 'محفظه'), value: l('18–24 L configurations', 'پیکربندی‌های ۱۸ تا ۲۴ لیتر') },
      { label: l('Cycles', 'چرخه‌ها'), value: l('121–134 °C steam programs', 'برنامه‌های بخار ۱۲۱ تا ۱۳۴ درجه') },
      { label: l('Loads', 'بار'), value: l('Wrapped and unwrapped options', 'گزینه‌های بسته‌بندی‌شده و بدون بسته‌بندی') },
      { label: l('Records', 'سوابق'), value: l('Model-dependent cycle logging', 'ثبت چرخه وابسته به مدل') },
    ],
    assurances: {
      en: ['Site and utility assessment', 'Installation and user orientation', 'Planned service support'],
      fa: ['ارزیابی محل و زیرساخت', 'نصب و آموزش کاربر', 'پشتیبانی خدمات برنامه‌ریزی‌شده'],
    },
    gallery: [
      '/images/equipment/desktop-autoclave-hero.jpg',
      '/images/equipment/desktop-autoclave-chamber.jpg',
      '/images/equipment/desktop-autoclave-clinic.jpg',
    ],
    galleryAlt: {
      en: ['Professional tabletop autoclave in a bright sterilization setting', 'Open autoclave chamber and trays', 'Compact sterilization area in a clinic'],
      fa: ['اتوکلاو حرفه‌ای رومیزی', 'محفظه و سینی‌های باز اتوکلاو', 'فضای استریلیزاسیون فشرده در کلینیک'],
    },
    faq: [
      {
        question: l('Which chamber size is right for our clinic?', 'چه اندازه محفظه‌ای برای کلینیک ما مناسب است؟'),
        answer: l('Selection follows load dimensions, daily cycle volume, available space, and utility requirements. Our team reviews these before recommending a configuration.', 'انتخاب بر اساس ابعاد بار، تعداد چرخه روزانه، فضای موجود و زیرساخت انجام می‌شود و تیم ما پیش از پیشنهاد پیکربندی آن‌ها را بررسی می‌کند.'),
      },
      {
        question: l('Are installation and training included?', 'آیا نصب و آموزش ارائه می‌شود؟'),
        answer: l('Installation, commissioning scope, and user orientation are agreed for the selected model and site.', 'دامنه نصب، راه‌اندازی و آموزش کاربر بر اساس مدل و محل انتخاب‌شده توافق می‌شود.'),
      },
    ],
  }),
  product({
    id: 'hospital-autoclaves',
    number: '08',
    type: 'equipment',
    icon: 'sterilization',
    name: l('Industrial / Hospital Autoclaves', 'اتوکلاوهای صنعتی و بیمارستانی'),
    category: l('Central sterile processing', 'پردازش مرکزی استریل'),
    tagline: l(
      'High-capacity sterilization planned around hospital flow and throughput.',
      'استریلیزاسیون پرظرفیت، طراحی‌شده پیرامون جریان کار و توان عملیاتی بیمارستان.',
    ),
    description: l(
      'Hospital autoclave projects begin with workflow: loading patterns, clean and dirty zoning, utilities, traceability, and service access. The selected system is then matched to expected throughput and the facility’s central sterile processing plan.',
      'پروژه اتوکلاو بیمارستانی از گردش‌کار آغاز می‌شود: الگوی بارگذاری، تفکیک تمیز و آلوده، زیرساخت، رهگیری و دسترسی خدمات. سپس سامانه با ظرفیت مورد انتظار و برنامه واحد استریل مرکزی مرکز درمانی هماهنگ می‌شود.',
    ),
    features: {
      en: ['High-capacity chamber options', 'Single- or pass-through workflows', 'Cycle traceability options', 'Project-based installation planning'],
      fa: ['گزینه‌های محفظه پرظرفیت', 'گردش‌کار یک‌درب یا عبوری', 'گزینه‌های رهگیری چرخه', 'برنامه‌ریزی نصب پروژه‌محور'],
    },
    benefits: {
      en: ['Capacity aligned with hospital demand', 'Cleaner loading and unloading flow', 'Service access considered from day one'],
      fa: ['ظرفیت هماهنگ با نیاز بیمارستان', 'جریان تمیزتر بارگیری و تخلیه', 'توجه به دسترسی خدمات از روز نخست'],
    },
    applications: {
      en: ['Central sterile departments', 'Operating-theatre supply', 'Hospital laboratories', 'Medical manufacturing'],
      fa: ['واحدهای استریل مرکزی', 'تأمین اتاق عمل', 'آزمایشگاه‌های بیمارستانی', 'تولید تجهیزات پزشکی'],
    },
    specs: [
      { label: l('Capacity', 'ظرفیت'), value: l('Project-sized chambers', 'محفظه متناسب با پروژه') },
      { label: l('Workflow', 'گردش‌کار'), value: l('Single or pass-through', 'یک‌درب یا عبوری') },
      { label: l('Utilities', 'زیرساخت'), value: l('Site-specific steam and power', 'بخار و برق متناسب با محل') },
      { label: l('Traceability', 'رهگیری'), value: l('Configuration-dependent records', 'ثبت سوابق وابسته به پیکربندی') },
    ],
    assurances: {
      en: ['Workflow and utility survey', 'Commissioning plan', 'Service and maintenance planning'],
      fa: ['بررسی گردش‌کار و زیرساخت', 'برنامه راه‌اندازی', 'برنامه‌ریزی سرویس و نگهداری'],
    },
    gallery: [
      '/images/equipment/industrial-hospital-autoclave-hero.jpg',
      '/images/equipment/industrial-autoclave-room.jpg',
      '/images/equipment/industrial-autoclave-controls.jpg',
    ],
    galleryAlt: {
      en: ['Large stainless-steel steam autoclaves with open chambers and loading carts in a hospital CSSD', 'Installed industrial autoclave and transfer cart in a hospital sterilization room', 'Front view and control panel of a hospital steam autoclave'],
      fa: ['اتوکلاوهای بخار بزرگ استیل با محفظه‌های باز و ترولی بارگیری در واحد استریل مرکزی بیمارستان', 'اتوکلاو صنعتی نصب‌شده و ترولی انتقال در اتاق استریلیزاسیون بیمارستان', 'نمای روبه‌رو و پنل کنترل اتوکلاو بخار بیمارستانی'],
    },
    faq: [
      {
        question: l('How is capacity selected?', 'ظرفیت چگونه انتخاب می‌شود؟'),
        answer: l('Capacity planning considers load mix, peak demand, cycle assumptions, redundancy, zoning, and available utilities.', 'برنامه‌ریزی ظرفیت بر اساس ترکیب بار، اوج تقاضا، فرض چرخه، افزونگی، زون‌بندی و زیرساخت موجود انجام می‌شود.'),
      },
      {
        question: l('Can pass-through workflows be supported?', 'آیا گردش‌کار عبوری پشتیبانی می‌شود؟'),
        answer: l('Yes, where the selected system and facility layout support separation between loading and clean unloading zones.', 'بله، هرجا سامانه انتخابی و چیدمان مرکز امکان جداسازی زون بارگیری و تخلیه تمیز را فراهم کند.'),
      },
    ],
  }),
  product({
    id: 'blood-glucose-meters',
    number: '09',
    type: 'equipment',
    icon: 'glucose',
    name: l('Blood Glucose Meters', 'دستگاه‌های سنجش قند خون'),
    category: l('Personal glucose monitoring', 'پایش شخصی قند خون'),
    tagline: l(
      'Straightforward daily glucose checks with clear handling and support.',
      'اندازه‌گیری روزانه قند خون با کاربری روشن و پشتیبانی قابل‌اتکا.',
    ),
    description: l(
      'A selected range of portable glucose meters for personal monitoring and care programs. Product selection considers sample handling, display clarity, memory needs, strip availability, and the support model required by the care setting.',
      'مجموعه‌ای منتخب از دستگاه‌های قابل‌حمل سنجش قند برای پایش شخصی و برنامه‌های مراقبتی. انتخاب محصول با توجه به نمونه‌گیری، خوانایی نمایشگر، نیاز حافظه، دسترسی نوار و مدل پشتیبانی مرکز انجام می‌شود.',
    ),
    features: {
      en: ['Portable everyday format', 'Clear result display', 'Memory options by model', 'Matched strip and lancet ecosystem'],
      fa: ['فرم قابل‌حمل روزانه', 'نمایش روشن نتیجه', 'گزینه‌های حافظه بسته به مدل', 'اکوسیستم هماهنگ نوار و لانست'],
    },
    benefits: {
      en: ['Simple routine monitoring', 'Product and consumables selected together', 'Support suited to care programs'],
      fa: ['پایش ساده و روزمره', 'انتخاب هماهنگ دستگاه و اقلام مصرفی', 'پشتیبانی متناسب با برنامه مراقبت'],
    },
    applications: {
      en: ['Home monitoring', 'Diabetes education', 'Clinic screening', 'Community health programs'],
      fa: ['پایش خانگی', 'آموزش دیابت', 'غربالگری کلینیکی', 'برنامه‌های سلامت جامعه'],
    },
    specs: [
      { label: l('Sample', 'نمونه'), value: l('Small capillary blood sample', 'نمونه کوچک خون مویرگی') },
      { label: l('Display', 'نمایشگر'), value: l('Large result readout options', 'گزینه‌های نمایش بزرگ نتیجه') },
      { label: l('Memory', 'حافظه'), value: l('Model-dependent history', 'سابقه وابسته به مدل') },
      { label: l('Consumables', 'مصرفی'), value: l('Matched test strips', 'نوار تست سازگار') },
    ],
    assurances: {
      en: ['Product and strip matching', 'User handling guidance', 'Supply planning for care programs'],
      fa: ['تطبیق دستگاه و نوار', 'راهنمای کاربری', 'برنامه تأمین برای برنامه‌های مراقبتی'],
    },
    gallery: [
      '/images/equipment/glucose-meter-hero.jpg',
      '/images/equipment/glucose-meter-use.jpg',
      '/images/equipment/glucose-meter-display.jpg',
    ],
    galleryAlt: {
      en: ['Portable blood glucose meter with a clear result display', 'Blood glucose measurement in everyday use', 'Test strip being inserted into a glucose meter'],
      fa: ['دستگاه قابل‌حمل سنجش قند با نمایشگر خوانا', 'اندازه‌گیری قند خون در استفاده روزمره', 'قرار دادن نوار تست در دستگاه سنجش قند'],
    },
    faq: [
      {
        question: l('Are meters supplied with compatible strips?', 'آیا نوار سازگار همراه دستگاه تأمین می‌شود؟'),
        answer: l('Meter selection and strip supply are planned together so the recommended consumable matches the selected model.', 'انتخاب دستگاه و تأمین نوار با هم برنامه‌ریزی می‌شود تا قلم مصرفی پیشنهادی با مدل انتخابی سازگار باشد.'),
      },
      {
        question: l('Can you support a clinic education program?', 'آیا از برنامه آموزشی کلینیک پشتیبانی می‌کنید؟'),
        answer: l('Yes. Product handling guidance and supply planning can be shaped around the program’s audience and volume.', 'بله. راهنمای کاربری و برنامه تأمین بر اساس مخاطب و حجم برنامه قابل تنظیم است.'),
      },
    ],
  }),
  product({
    id: 'blood-glucose-test-strips',
    number: '10',
    type: 'equipment',
    icon: 'strips',
    name: l('Blood Glucose Test Strips', 'نوارهای تست قند خون'),
    category: l('Glucose monitoring consumables', 'اقلام مصرفی پایش قند'),
    tagline: l(
      'Professionally supplied test strips matched to supported meter systems.',
      'نوارهای تست با تأمین حرفه‌ای و سازگار با سامانه‌های سنجش پشتیبانی‌شده.',
    ),
    description: l(
      'Test strips are supplied as part of a complete monitoring plan, not as an isolated consumable. Compatibility, storage, pack size, expected usage, expiry management, and replenishment are considered with the meter and care program.',
      'نوار تست به‌عنوان بخشی از برنامه کامل پایش تأمین می‌شود، نه یک قلم مصرفی جدا. سازگاری، نگهداری، تعداد در بسته، مصرف مورد انتظار، مدیریت تاریخ و تأمین مجدد همراه دستگاه و برنامه مراقبت بررسی می‌شوند.',
    ),
    features: {
      en: ['Matched meter compatibility', 'Sealed pack options', 'Storage and handling guidance', 'Planned replenishment'],
      fa: ['سازگاری با دستگاه متناظر', 'گزینه‌های بسته‌بندی محافظت‌شده', 'راهنمای نگهداری و استفاده', 'تأمین مجدد برنامه‌ریزی‌شده'],
    },
    benefits: {
      en: ['Fewer compatibility errors', 'More predictable stock planning', 'Clear handling guidance for users'],
      fa: ['خطای کمتر در سازگاری', 'برنامه‌ریزی موجودی قابل پیش‌بینی‌تر', 'راهنمای روشن استفاده برای کاربر'],
    },
    applications: {
      en: ['Home glucose monitoring', 'Clinic screening', 'Diabetes programs', 'Pharmacy supply'],
      fa: ['پایش خانگی قند', 'غربالگری کلینیکی', 'برنامه‌های دیابت', 'تأمین داروخانه‌ای'],
    },
    specs: [
      { label: l('Compatibility', 'سازگاری'), value: l('Meter-specific', 'وابسته به مدل دستگاه') },
      { label: l('Pack sizes', 'تعداد بسته'), value: l('Model-dependent options', 'گزینه‌های وابسته به مدل') },
      { label: l('Storage', 'نگهداری'), value: l('Per manufacturer guidance', 'مطابق راهنمای سازنده') },
      { label: l('Supply', 'تأمین'), value: l('Planned replenishment', 'تأمین مجدد برنامه‌ریزی‌شده') },
    ],
    assurances: {
      en: ['Compatibility confirmation', 'Batch and expiry awareness', 'Storage guidance at handover'],
      fa: ['تأیید سازگاری', 'توجه به بچ و تاریخ مصرف', 'راهنمای نگهداری هنگام تحویل'],
    },
    gallery: [
      '/images/equipment/glucose-strips-hero.jpg',
      '/images/equipment/glucose-strips-pack.jpg',
      '/images/equipment/glucose-strips-meter.jpg',
    ],
    galleryAlt: {
      en: ['Professional glucose test strip photography', 'Sealed test strip packaging', 'Test strip inserted into a glucose meter'],
      fa: ['عکاسی حرفه‌ای نوار تست قند', 'بسته‌بندی محافظت‌شده نوار تست', 'نوار تست قرارگرفته در دستگاه قند'],
    },
    faq: [
      {
        question: l('Are test strips universal?', 'آیا نوارهای تست عمومی و قابل استفاده برای همه دستگاه‌ها هستند؟'),
        answer: l('No. Test strips are meter-specific. Compatibility is confirmed against the exact supported meter model before supply.', 'خیر. نوار تست وابسته به مدل دستگاه است و سازگاری پیش از تأمین با مدل دقیق دستگاه پشتیبانی‌شده تأیید می‌شود.'),
      },
      {
        question: l('How should strips be stored?', 'نوارها چگونه باید نگهداری شوند؟'),
        answer: l('Storage follows the manufacturer’s instructions for the selected product, including container closure, temperature, and expiry guidance.', 'نگهداری مطابق دستور سازنده محصول انتخابی، از جمله بسته‌بودن ظرف، دما و راهنمای تاریخ مصرف انجام می‌شود.'),
      },
    ],
  }),
]

export const softwareProducts = products.filter((item) => item.type === 'software')
export const equipmentProducts = products.filter((item) => item.type === 'equipment')

export function getProductById(id) {
  return products.find((item) => item.id === id) ?? null
}
