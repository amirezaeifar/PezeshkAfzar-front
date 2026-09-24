const l = (en, fa) => ({ en, fa })

export const journalCategories = [
  { key: 'clinicalAI', label: l('Clinical AI', 'هوش مصنوعی بالینی') },
  { key: 'medicalSoftware', label: l('Medical Software', 'نرم‌افزار پزشکی') },
  { key: 'responsibleAI', label: l('Responsible AI', 'هوش مصنوعی مسئولانه') },
  { key: 'digitalCare', label: l('Digital Care', 'مراقبت دیجیتال') },
  { key: 'dataPrivacy', label: l('Data & Privacy', 'داده و حریم خصوصی') },
]

const editorialAuthor = l('Editorial desk', 'تحریریه')
const clinicalReviewer = l('Clinical review desk', 'گروه بازبینی بالینی')
const governanceReviewer = l('Data and AI governance desk', 'گروه راهبری داده و هوش مصنوعی')

const allJournalArticles = [
  {
    slug: 'where-clinical-ai-helps-and-where-it-must-stop',
    category: 'clinicalAI',
    featured: true,
    title: l('Where clinical AI helps—and where it must stop', 'هوش مصنوعی بالینی کجا کمک می‌کند و کجا باید متوقف شود'),
    summary: l('A practical way to separate useful decision support from claims a model cannot safely make.', 'روشی عملی برای جداکردن پشتیبانی مفید از تصمیم، از ادعاهایی که یک مدل نمی‌تواند با اطمینان مطرح کند.'),
    author: editorialAuthor,
    reviewer: governanceReviewer,
    datePublished: '2026-09-04',
    dateModified: '2026-09-14',
    readingMinutes: 7,
    medical: true,
    image: '/images/home-clinical/journal-care-plan-800.webp',
    imageWidth: 800,
    imageHeight: 600,
    alt: l('A clinician and patient coordinating a care plan beside a laptop', 'پزشک و بیمار در حال هماهنگی برنامه مراقبت کنار لپ‌تاپ'),
    sections: [
      {
        id: 'start-with-the-decision',
        heading: l('Start with the decision, not the model', 'از تصمیم شروع کنید، نه از مدل'),
        paragraphs: [
          l('A useful clinical AI project begins by naming the decision, the person responsible for it, and the harm that could follow from a wrong or delayed output. Only then does it make sense to ask what data and model might help.', 'یک پروژه مفید هوش مصنوعی بالینی با مشخص‌کردن تصمیم، فرد مسئول آن و آسیبی که ممکن است از خروجی اشتباه یا دیرهنگام ایجاد شود آغاز می‌شود. تازه پس از آن می‌توان پرسید چه داده و مدلی کمک‌کننده است.'),
          l('This framing keeps an alert, score, or suggested priority in its proper role: information for a qualified person, not a replacement for professional judgment.', 'این چارچوب هشدار، امتیاز یا اولویت پیشنهادی را در جای درست نگه می‌دارد: اطلاعاتی برای فرد واجد صلاحیت، نه جایگزینی برای قضاوت حرفه‌ای.'),
        ],
      },
      {
        id: 'define-the-boundary',
        heading: l('Write the boundary as carefully as the capability', 'مرزها را به اندازه قابلیت‌ها دقیق بنویسید'),
        paragraphs: [
          l('Model documentation should say what the system observes, what it outputs, where it was evaluated, and which conclusions it cannot support. Uncertainty should be visible to the reviewer rather than hidden behind a confident interface.', 'مستندات مدل باید روشن کنند سامانه چه چیزی را مشاهده می‌کند، چه خروجی‌ای می‌دهد، کجا ارزیابی شده و از چه نتیجه‌گیری‌هایی پشتیبانی نمی‌کند. عدم‌قطعیت باید برای بازبین قابل‌دیدن باشد، نه اینکه پشت رابطی مطمئن پنهان شود.'),
        ],
        bullets: [
          l('Name the intended user and the exact moment of use.', 'کاربر هدف و لحظه دقیق استفاده را مشخص کنید.'),
          l('Document known failure modes and untested settings.', 'حالت‌های خطای شناخته‌شده و محیط‌های آزموده‌نشده را ثبت کنید.'),
          l('Provide a clear route to disagree, override, and report problems.', 'راهی روشن برای مخالفت، نادیده‌گرفتن پیشنهاد و گزارش مشکل فراهم کنید.'),
        ],
      },
      {
        id: 'monitor-after-release',
        heading: l('Validation does not end at release', 'اعتبارسنجی با انتشار تمام نمی‌شود'),
        paragraphs: [
          l('Clinical populations, workflows, devices, and data pipelines change. Monitoring should look for performance drift, uneven errors, workflow side effects, and situations in which people begin to rely on the output differently than intended.', 'جمعیت‌های بالینی، گردش‌کارها، دستگاه‌ها و مسیرهای داده تغییر می‌کنند. پایش باید افت عملکرد، خطاهای نامتوازن، پیامدهای جانبی در جریان کار و موقعیت‌هایی را بررسی کند که افراد به شکلی متفاوت از هدف اولیه به خروجی تکیه می‌کنند.'),
        ],
      },
    ],
    sources: [
      { label: l('WHO — Ethics and governance of artificial intelligence for health', 'سازمان جهانی بهداشت — اخلاق و راهبری هوش مصنوعی برای سلامت'), url: 'https://www.who.int/publications/i/item/9789240029200' },
      { label: l('NIST — AI Risk Management Framework', 'مؤسسه ملی استانداردها و فناوری — چارچوب مدیریت ریسک هوش مصنوعی'), url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
    ],
  },
  {
    slug: 'human-review-is-part-of-the-system',
    category: 'responsibleAI',
    title: l('Human review is part of the system', 'بازبینی انسانی بخشی از خود سامانه است'),
    summary: l('Human oversight works only when reviewers have context, authority, time, and a way to challenge the machine.', 'نظارت انسانی فقط زمانی کار می‌کند که بازبین زمینه، اختیار، زمان و راهی برای به‌چالش‌کشیدن ماشین داشته باشد.'),
    author: editorialAuthor,
    reviewer: governanceReviewer,
    datePublished: '2026-08-21',
    dateModified: '2026-09-12',
    readingMinutes: 6,
    medical: true,
    image: '/images/home-clinical/journal-records-800.webp',
    imageWidth: 800,
    imageHeight: 600,
    alt: l('A medical professional completing patient documentation', 'متخصص درمان در حال تکمیل مستندات بیمار'),
    sections: [
      {
        id: 'more-than-a-checkbox',
        heading: l('Oversight is more than a checkbox', 'نظارت انسانی بیشتر از یک تیک ساده است'),
        paragraphs: [
          l('Putting a person after an algorithm does not automatically make a workflow safe. The reviewer needs enough original context to judge the output and enough authority to reject it without friction.', 'قرار دادن یک انسان پس از الگوریتم، گردش‌کار را خودبه‌خود ایمن نمی‌کند. بازبین به زمینه اصلی کافی برای سنجش خروجی و اختیار کافی برای ردکردن بی‌دردسر آن نیاز دارد.'),
        ],
      },
      {
        id: 'design-the-review-queue',
        heading: l('Design the review queue', 'صف بازبینی را طراحی کنید'),
        paragraphs: [
          l('A review interface should show why an item entered the queue, what source material supports it, how uncertain the result is, and what happens after each reviewer action. It should also prevent a low-quality queue from becoming invisible workload.', 'رابط بازبینی باید نشان دهد چرا یک مورد وارد صف شده، چه محتوای اصلی از آن پشتیبانی می‌کند، نتیجه چقدر نامطمئن است و پس از هر اقدام بازبین چه رخ می‌دهد. همچنین نباید اجازه دهد صف کم‌کیفیت به بار کاری نامرئی تبدیل شود.'),
        ],
        bullets: [
          l('Preserve the unedited source context.', 'زمینه و محتوای اصلی و ویرایش‌نشده را حفظ کنید.'),
          l('Make uncertainty and missing data obvious.', 'عدم‌قطعیت و دادهٔ گمشده را آشکار کنید.'),
          l('Record overrides without punishing the reviewer.', 'نادیده‌گرفتن پیشنهاد را بدون تنبیه بازبین ثبت کنید.'),
        ],
      },
      {
        id: 'learn-from-disagreement',
        heading: l('Treat disagreement as safety data', 'اختلاف‌نظر را دادهٔ ایمنی بدانید'),
        paragraphs: [
          l('When reviewers disagree with a model—or with each other—the pattern can reveal ambiguous definitions, missing context, and performance gaps. Those cases deserve structured review rather than being discarded as noise.', 'وقتی بازبینان با مدل یا با یکدیگر اختلاف‌نظر دارند، الگو می‌تواند تعریف مبهم، زمینه گمشده و شکاف عملکرد را نشان دهد. این موارد باید ساختاریافته بررسی شوند، نه اینکه به‌عنوان نویز کنار گذاشته شوند.'),
        ],
      },
    ],
    sources: [
      { label: l('WHO — Ethics and governance of AI for health', 'سازمان جهانی بهداشت — اخلاق و راهبری هوش مصنوعی برای سلامت'), url: 'https://www.who.int/publications/i/item/9789240029200' },
      { label: l('FDA — Transparency for machine learning-enabled medical devices', 'سازمان غذا و داروی آمریکا — شفافیت در تجهیزات پزشکی مبتنی بر یادگیری ماشین'), url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/transparency-machine-learning-enabled-medical-devices-guiding-principles' },
    ],
  },
  {
    slug: 'designing-medical-software-around-clinical-workflows',
    category: 'medicalSoftware',
    title: l('Designing medical software around clinical workflows', 'طراحی نرم‌افزار پزشکی حول گردش‌کار بالینی'),
    summary: l('A screen can be efficient while the complete clinical task remains slow, fragmented, or unsafe.', 'ممکن است یک صفحه سریع باشد، اما کل کار بالینی همچنان کند، پراکنده یا ناایمن بماند.'),
    author: editorialAuthor,
    reviewer: clinicalReviewer,
    datePublished: '2026-08-08',
    dateModified: '2026-09-10',
    readingMinutes: 6,
    medical: true,
    image: '/images/home-clinical/journal-consultation-800.jpg',
    imageWidth: 800,
    imageHeight: 600,
    alt: l('A doctor and patient reviewing a radiograph in a warm consultation room', 'پزشک و بیمار در حال بررسی تصویر رادیولوژی در اتاق مشاوره'),
    sections: [
      {
        id: 'map-the-whole-task',
        heading: l('Map the whole task', 'تمام کار را ترسیم کنید'),
        paragraphs: [
          l('Clinical work crosses rooms, roles, devices, and shifts. Research should follow the task from the first signal through documentation, communication, action, and handoff—not stop at the boundaries of one screen.', 'کار بالینی از اتاق‌ها، نقش‌ها، دستگاه‌ها و شیفت‌ها عبور می‌کند. پژوهش باید کار را از نخستین نشانه تا ثبت، ارتباط، اقدام و تحویل دنبال کند و در مرز یک صفحه متوقف نشود.'),
        ],
      },
      {
        id: 'design-for-interruption',
        heading: l('Design for interruption and return', 'برای وقفه و بازگشت طراحی کنید'),
        paragraphs: [
          l('A safe interface preserves context, saves progress predictably, and makes unfinished work visible. The person returning after an interruption should be able to answer three questions quickly: where was I, what changed, and what remains?', 'رابط ایمن زمینه را حفظ می‌کند، پیشرفت را قابل‌پیش‌بینی ذخیره می‌کند و کار ناتمام را آشکار نگه می‌دارد. فردی که پس از وقفه برمی‌گردد باید سریع به سه پرسش پاسخ دهد: کجا بودم، چه چیزی تغییر کرده و چه چیزی باقی مانده است؟'),
        ],
      },
      {
        id: 'measure-work-not-clicks',
        heading: l('Measure completed work, not isolated clicks', 'کار کامل‌شده را بسنجید، نه کلیک‌های جداگانه را'),
        paragraphs: [
          l('Useful measures include completion time, repeated entry, recovery after interruption, handoff quality, and unresolved work at the end of a shift. These reveal costs that page-level speed alone misses.', 'زمان تکمیل، ثبت تکراری، بازیابی پس از وقفه، کیفیت تحویل و کار حل‌نشده در پایان شیفت معیارهای مفیدی‌اند. این‌ها هزینه‌هایی را آشکار می‌کنند که سرعت یک صفحه به‌تنهایی نمی‌بیند.'),
        ],
      },
    ],
    sources: [
      { label: l('ONC — Usability and provider burden', 'دفتر هماهنگ‌کننده ملی فناوری اطلاعات سلامت — کاربردپذیری و بار کاری ارائه‌دهنده'), url: 'https://healthit.gov/usability-and-provider-burden/' },
      { label: l('WHO — Digital health', 'سازمان جهانی بهداشت — سلامت دیجیتال'), url: 'https://www.who.int/health-topics/digital-health' },
    ],
  },
  {
    slug: 'privacy-by-design-for-clinical-computer-vision',
    category: 'dataPrivacy',
    title: l('Privacy by design for clinical computer vision', 'حریم خصوصی از ابتدا در بینایی ماشین بالینی'),
    summary: l('Video can reveal far more than a model needs. Safer systems begin by reducing collection, identity, access, and retention.', 'ویدئو می‌تواند بسیار بیشتر از نیاز مدل آشکار کند. سامانه ایمن‌تر با کاهش جمع‌آوری، هویت، دسترسی و زمان نگه‌داری آغاز می‌شود.'),
    author: editorialAuthor,
    reviewer: governanceReviewer,
    datePublished: '2026-07-24',
    dateModified: '2026-09-09',
    readingMinutes: 7,
    medical: true,
    image: '/images/journal/clinical-privacy-1600.webp',
    imageSrcset: '/images/journal/clinical-privacy-800.webp 800w, /images/journal/clinical-privacy-1600.webp 1600w',
    alt: l('A real care scene with orange anonymous computer-vision review boxes', 'صحنه واقعی مراقبت با کادرهای نارنجی و ناشناس بازبینی بینایی ماشین'),
    sections: [
      {
        id: 'collect-less',
        heading: l('Collect only what the task needs', 'فقط دادهٔ لازم برای کار را جمع کنید'),
        paragraphs: [
          l('Before storing clinical video, define the precise purpose and test whether the same goal can be met with less sensitive data, a shorter clip, lower resolution, or processing that does not retain the source.', 'پیش از ذخیره ویدئوی بالینی، هدف دقیق را تعریف کنید و بسنجید آیا همان هدف با داده حساس کمتر، کلیپ کوتاه‌تر، وضوح پایین‌تر یا پردازشی که منبع را نگه نمی‌دارد قابل دستیابی است یا نه.'),
        ],
      },
      {
        id: 'separate-tracking-from-identity',
        heading: l('Separate temporary tracking from identity', 'رهگیری موقت را از هویت جدا کنید'),
        paragraphs: [
          l('A system may need to follow motion across adjacent frames without knowing who a person is. Session-scoped anonymous identifiers can support that narrow function while avoiding facial recognition and identity matching.', 'ممکن است سامانه برای دنبال‌کردن حرکت میان فریم‌های نزدیک به رهگیری نیاز داشته باشد، بدون اینکه بداند فرد چه کسی است. شناسه‌های ناشناس و محدود به نشست می‌توانند این کار محدود را بدون تشخیص چهره و تطبیق هویت انجام دهند.'),
        ],
        bullets: [
          l('Reset temporary identifiers between sessions.', 'شناسه‌های موقت را میان نشست‌ها از نو آغاز کنید.'),
          l('Restrict access to source video and review clips.', 'دسترسی به ویدئوی اصلی و کلیپ‌های بازبینی را محدود کنید.'),
          l('Set short, explicit retention periods and audit exceptions.', 'دوره نگه‌داری کوتاه و صریح تعیین و استثناها را ممیزی کنید.'),
        ],
      },
      {
        id: 'make-governance-operational',
        heading: l('Turn governance into daily controls', 'راهبری را به کنترل روزمره تبدیل کنید'),
        paragraphs: [
          l('Policy becomes meaningful when it appears in access rules, deletion jobs, audit logs, reviewer training, incident procedures, and visible notices for the people affected by data collection.', 'سیاست زمانی معنا پیدا می‌کند که در قواعد دسترسی، حذف زمان‌بندی‌شده، گزارش ممیزی، آموزش بازبین، فرایند رخداد و اطلاع‌رسانی آشکار به افراد تحت‌تأثیر جمع‌آوری داده دیده شود.'),
        ],
      },
    ],
    sources: [
      { label: l('NIST — AI Risk Management Framework', 'مؤسسه ملی استانداردها و فناوری — چارچوب مدیریت ریسک هوش مصنوعی'), url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
      { label: l('WHO — Ethics and governance of AI for health', 'سازمان جهانی بهداشت — اخلاق و راهبری هوش مصنوعی برای سلامت'), url: 'https://www.who.int/publications/i/item/9789240029200' },
    ],
  },
  {
    slug: 'validation-before-real-world-deployment',
    category: 'responsibleAI',
    title: l('Validation before real-world deployment', 'اعتبارسنجی پیش از استقرار در دنیای واقعی'),
    summary: l('A promising model result is not the same as evidence that a complete clinical workflow is ready for use.', 'نتیجه امیدوارکننده یک مدل، همان شواهد آماده‌بودن کل گردش‌کار بالینی برای استفاده نیست.'),
    author: editorialAuthor,
    reviewer: clinicalReviewer,
    datePublished: '2026-07-11',
    dateModified: '2026-09-06',
    readingMinutes: 7,
    medical: true,
    image: '/images/journal/real-world-validation-1600.webp',
    imageSrcset: '/images/journal/real-world-validation-800.webp 800w, /images/journal/real-world-validation-1600.webp 1600w',
    alt: l('A clinician demonstrating a dental model inside an orange review frame', 'متخصص درمان در حال نمایش مدل دندان داخل کادر نارنجی بازبینی'),
    sections: [
      {
        id: 'three-levels-of-evidence',
        heading: l('Test the model, the interface, and the workflow', 'مدل، رابط و گردش‌کار را بیازمایید'),
        paragraphs: [
          l('Model performance describes only one layer. Reviewers also need to understand the output correctly, and the surrounding workflow must route cases, record decisions, recover from failures, and avoid harmful delays.', 'عملکرد مدل فقط یک لایه را توصیف می‌کند. بازبینان نیز باید خروجی را درست بفهمند و گردش‌کار پیرامون باید موارد را هدایت کند، تصمیم‌ها را ثبت کند، از خطا بازیابی شود و از تأخیر آسیب‌زا جلوگیری کند.'),
        ],
      },
      {
        id: 'represent-the-setting',
        heading: l('Represent the intended setting', 'محیط هدف را نمایندگی کنید'),
        paragraphs: [
          l('Evaluation data should reflect the devices, conditions, populations, and workflows in which the system is intended to operate. Gaps should be named explicitly; a result from one setting should not silently become a claim about another.', 'داده ارزیابی باید دستگاه‌ها، شرایط، جمعیت‌ها و گردش‌کارهای محیط هدف را بازتاب دهد. شکاف‌ها باید صریح بیان شوند و نتیجه یک محیط نباید بی‌سروصدا به ادعایی درباره محیط دیگر تبدیل شود.'),
        ],
      },
      {
        id: 'plan-the-monitoring',
        heading: l('Plan monitoring before launch', 'پیش از راه‌اندازی برای پایش برنامه داشته باشید'),
        paragraphs: [
          l('Define which changes trigger investigation, who can pause the system, how incidents are reviewed, and how users learn about updates. Monitoring is part of the product, not an afterthought.', 'مشخص کنید چه تغییرهایی بررسی را فعال می‌کنند، چه کسی می‌تواند سامانه را متوقف کند، رخدادها چگونه مرور می‌شوند و کاربران چطور از به‌روزرسانی آگاه می‌شوند. پایش بخشی از محصول است، نه کاری برای بعد.'),
        ],
      },
    ],
    sources: [
      { label: l('FDA — Good Machine Learning Practice guiding principles', 'سازمان غذا و داروی آمریکا — اصول راهنمای عملکرد خوب یادگیری ماشین'), url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development-guiding-principles' },
      { label: l('FDA — Transparency for machine learning-enabled medical devices', 'سازمان غذا و داروی آمریکا — شفافیت در تجهیزات پزشکی مبتنی بر یادگیری ماشین'), url: 'https://www.fda.gov/medical-devices/software-medical-device-samd/transparency-machine-learning-enabled-medical-devices-guiding-principles' },
    ],
  },
  {
    slug: 'interoperability-without-losing-clinical-context',
    category: 'digitalCare',
    title: l('Interoperability without losing clinical context', 'یکپارچگی بدون ازدست‌دادن زمینه بالینی'),
    summary: l('Moving data is only the beginning; useful exchange preserves meaning, timing, provenance, and responsibility.', 'جابه‌جایی داده فقط آغاز کار است؛ تبادل مفید، معنا، زمان، منشأ و مسئولیت را حفظ می‌کند.'),
    author: editorialAuthor,
    reviewer: clinicalReviewer,
    datePublished: '2026-06-27',
    dateModified: '2026-09-03',
    readingMinutes: 6,
    medical: true,
    image: '/images/journal/transparent-ai-1600.webp',
    imageSrcset: '/images/journal/transparent-ai-800.webp 800w, /images/journal/transparent-ai-1600.webp 1600w',
    alt: l('A person using a connected medical device beside an orange data timeline', 'فردی در حال استفاده از دستگاه پزشکی متصل کنار خط زمانی نارنجی داده'),
    sections: [
      {
        id: 'meaning-before-movement',
        heading: l('Preserve meaning, not just values', 'معنا را حفظ کنید، نه فقط مقدارها را'),
        paragraphs: [
          l('A number without its unit, method, time, source, and status can be misleading. Exchange design should preserve the context a clinician needs to interpret the information safely.', 'یک عدد بدون واحد، روش، زمان، منبع و وضعیت می‌تواند گمراه‌کننده باشد. طراحی تبادل باید زمینه‌ای را حفظ کند که درمانگر برای تفسیر ایمن اطلاعات نیاز دارد.'),
        ],
      },
      {
        id: 'show-provenance',
        heading: l('Make provenance visible', 'منشأ داده را قابل‌دیدن کنید'),
        paragraphs: [
          l('Users should be able to distinguish patient-reported information, device measurements, imported records, and algorithm-generated summaries. Each may deserve a different level of trust and a different confirmation step.', 'کاربران باید بتوانند اطلاعات گزارش‌شده توسط بیمار، اندازه‌گیری دستگاه، پرونده واردشده و خلاصه تولیدشده توسط الگوریتم را از هم تشخیص دهند. هرکدام ممکن است سطح اعتماد و گام تأیید متفاوتی لازم داشته باشند.'),
        ],
      },
      {
        id: 'design-the-handoff',
        heading: l('Design who receives the next step', 'مشخص کنید قدم بعدی به چه کسی می‌رسد'),
        paragraphs: [
          l('Successful delivery is not the same as completed care. The workflow needs ownership, acknowledgement, escalation, and a way to close the loop when information crosses organizational boundaries.', 'تحویل موفق داده همان تکمیل مراقبت نیست. وقتی اطلاعات از مرز سازمان عبور می‌کند، گردش‌کار به مالک مشخص، تأیید دریافت، مسیر ارجاع و راهی برای بستن حلقه نیاز دارد.'),
        ],
      },
    ],
    sources: [
      { label: l('WHO — Digital health', 'سازمان جهانی بهداشت — سلامت دیجیتال'), url: 'https://www.who.int/health-topics/digital-health' },
      { label: l('AHRQ — TeamSTEPPS communication tools', 'AHRQ — ابزارهای ارتباطی تیم‌استپس'), url: 'https://www.ahrq.gov/teamstepps-program/curriculum/communication/teach/two-day.html' },
    ],
  },
]

// The public journal intentionally launches with the same three stories shown on Home.
// New stories are added and managed through the admin API.
export const journalArticles = allJournalArticles.slice(0, 3)

export function getJournalArticle(slug) {
  return journalArticles.find((article) => article.slug === slug)
}

export function getJournalCategory(key) {
  return journalCategories.find((category) => category.key === key)
}
