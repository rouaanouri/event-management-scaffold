const BASE_URL = "https://events-management-api-847aeb3c849e.hosted.ghaymah.systems";
const REQUEST_TIMEOUT_MS = 30000;
const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 4000;
const DELAY_BETWEEN_EVENTS_MS = 500;

const events = [
  {
    name: "مؤتمر الذكاء الاصطناعي 2026",
    description: "مؤتمر سنوي يستعرض أحدث تطورات الذكاء الاصطناعي وتطبيقاته العملية في الصناعات المختلفة.",
    max_attendees: 500,
    event_date: "2026-09-15T09:00:00Z",
    event_type: "CONFERENCE",
  },
  {
    name: "مؤتمر ريادة الأعمال الرقمية",
    description: "ملتقى رواد الأعمال ومستثمري التقنية لمناقشة فرص النمو في السوق الرقمي.",
    max_attendees: 300,
    event_date: "2026-10-02T09:00:00Z",
    event_type: "CONFERENCE",
  },
  {
    name: "القمة العربية للتحول الرقمي",
    description: "قمة إقليمية تجمع خبراء التحول الرقمي في القطاعين العام والخاص.",
    max_attendees: 450,
    event_date: "2026-11-20T09:00:00Z",
    event_type: "CONFERENCE",
  },
  {
    name: "ندوة مقدمة إلى React وTypeScript",
    description: "ندوة عبر الإنترنت تغطي أساسيات بناء تطبيقات الويب الحديثة باستخدام React وTypeScript.",
    max_attendees: 200,
    event_date: "2026-09-05T18:00:00Z",
    event_type: "WEBINAR",
  },
  {
    name: "ندوة أمن المعلومات للمطورين",
    description: "جلسة تعريفية بأهم الممارسات الآمنة عند تطوير تطبيقات الويب والحماية من الثغرات الشائعة.",
    max_attendees: 250,
    event_date: "2026-09-25T18:00:00Z",
    event_type: "WEBINAR",
  },
  {
    name: "ندوة تصميم واجهات المستخدم",
    description: "استعراض مبادئ تصميم واجهات المستخدم الحديثة وتجربة المستخدم الفعّالة.",
    max_attendees: 180,
    event_date: "2026-10-15T18:00:00Z",
    event_type: "WEBINAR",
  },
  {
    name: "ندوة إدارة المشاريع التقنية",
    description: "ندوة تفاعلية حول منهجيات إدارة المشاريع البرمجية الحديثة مثل Agile وScrum.",
    max_attendees: 220,
    event_date: "2026-12-01T18:00:00Z",
    event_type: "WEBINAR",
  },
  {
    name: "ورشة عمل بناء واجهات برمجة التطبيقات",
    description: "ورشة عملية لبناء واجهات برمجة تطبيقات RESTful باستخدام Node.js وExpress.",
    max_attendees: 60,
    event_date: "2026-09-10T10:00:00Z",
    event_type: "WORKSHOP",
  },
  {
    name: "ورشة عمل إدارة الحالة في React",
    description: "ورشة تطبيقية عملية حول إدارة حالة التطبيق باستخدام Zustand وContext API.",
    max_attendees: 50,
    event_date: "2026-09-20T10:00:00Z",
    event_type: "WORKSHOP",
  },
  {
    name: "ورشة عمل اختبار البرمجيات الآلي",
    description: "تعلّم كتابة اختبارات آلية لتطبيقات الويب باستخدام Vitest وTesting Library.",
    max_attendees: 45,
    event_date: "2026-10-08T10:00:00Z",
    event_type: "WORKSHOP",
  },
  {
    name: "ورشة عمل تحسين الأداء في تطبيقات الويب",
    description: "ورشة عملية حول قياس وتحسين أداء تطبيقات React في بيئة الإنتاج.",
    max_attendees: 55,
    event_date: "2026-11-05T10:00:00Z",
    event_type: "WORKSHOP",
  },
  {
    name: "ورشة عمل النشر والتوزيع المستمر",
    description: "ورشة عملية حول إعداد خطوط النشر الآلي CI/CD للمشاريع البرمجية.",
    max_attendees: 40,
    event_date: "2026-12-12T10:00:00Z",
    event_type: "WORKSHOP",
  },
  {
    name: "مؤتمر الأمن السيبراني الإقليمي",
    description: "مؤتمر متخصص في قضايا الأمن السيبراني وحماية البنية التحتية الرقمية.",
    max_attendees: 400,
    event_date: "2027-01-18T09:00:00Z",
    event_type: "CONFERENCE",
  },
  {
    name: "ندوة مستقبل العمل عن بعد",
    description: "نقاش حول تحولات سوق العمل الرقمي وأدوات التعاون عن بعد.",
    max_attendees: 260,
    event_date: "2027-01-25T18:00:00Z",
    event_type: "WEBINAR",
  },
  {
    name: "ورشة عمل تطوير تطبيقات الجوال",
    description: "مقدمة عملية لتطوير تطبيقات الجوال متعددة المنصات باستخدام React Native.",
    max_attendees: 50,
    event_date: "2027-02-01T10:00:00Z",
    event_type: "WORKSHOP",
  },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, label) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      console.warn(
        `محاولة ${attempt} من ${MAX_RETRIES} فشلت لـ ${label}: ${error.message ?? error}`,
      );
      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY_MS);
      }
    }
  }

  throw lastError;
}

async function main() {
  console.log("جارٍ محاولة الاتصال بالخادم، قد يستغرق الأمر وقتاً أطول من المعتاد إذا كان الخادم في وضع سكون...");

  const loginResponse = await fetchWithRetry(
    `${BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "admin123" }),
    },
    "تسجيل الدخول",
  );

  if (!loginResponse.ok) {
    console.error("فشل تسجيل الدخول:", loginResponse.status, await loginResponse.text());
    process.exit(1);
  }

  const { access_token: token } = await loginResponse.json();
  console.log("تم تسجيل الدخول بنجاح كحساب إدارة.");

  let successCount = 0;
  let failureCount = 0;

  for (const event of events) {
    try {
      const response = await fetchWithRetry(
        `${BASE_URL}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(event),
        },
        event.name,
      );

      if (response.ok) {
        successCount += 1;
        console.log(`تمت إضافة الفعالية: ${event.name}`);
      } else {
        failureCount += 1;
        console.error(`فشلت إضافة الفعالية: ${event.name}`, response.status, await response.text());
      }
    } catch (error) {
      failureCount += 1;
      console.error(`تعذّر الاتصال بالخادم لإضافة الفعالية: ${event.name}`, error.message ?? error);
    }

    await delay(DELAY_BETWEEN_EVENTS_MS);
  }

  console.log(`اكتملت العملية. نجحت إضافة ${successCount} فعالية، وفشلت ${failureCount} من أصل ${events.length}.`);
}

main().catch((error) => {
  console.error("حدث خطأ غير متوقع:", error);
  process.exit(1);
});
