/* ==========================================================================
   ملف الجافاسكريبت الرئيسي - موقع المختار للمقاولات
   الفكرة: إدارة التفاعلات الديناميكية (فلترة المشاريع، إرسال طلب واتساب،
           قائمة الجوال، نافذة تكبير الصور، حاسبة التكاليف، ومقارنة قبل وبعد).
   الربط: يعتمد على معرفات (id) وكلاسات موجودة في index.html ويبدّل كلاسات
          (.hide و .active و .show) المعرّفة في style.css.
   ملاحظة: التعليقات إرشادية فقط ولا تؤثر على سرعة أو أداء تشغيل الكود.
   ========================================================================== */

/* --------------------------------------------------------------------------
   اسم الجزء / الدالة: فلترة معرض الأعمال (filterPortfolioItems)
   الفكرة: إظهار المشاريع المطابقة للفئة المختارة وإخفاء غيرها دون إعادة تحميل الصفحة.
   الربط: يقرأ (.filter-btn و data-filter) و (.portfolio-item و data-category) من index.html،
          ويستخدم كلاس (.hide) من style.css.
   مناطق أمان للتعديل: إضافة مشاريع أو أزرار جديدة في HTML تعمل تلقائياً بشرط تطابق الفئات.
   --- بداية الدالة ---
   -------------------------------------------------------------------------- */
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

function filterPortfolioItems(filterValue) {
  if (!portfolioItems.length) return;

  portfolioItems.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    if (filterValue === 'all' || itemCategory === filterValue) {
      item.classList.remove('hide');
    } else {
      item.classList.add('hide');
    }
  });
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filterValue = button.getAttribute('data-filter') || 'all';
    filterPortfolioItems(filterValue);
  });
});
/* --- نهاية الدالة: فلترة معرض الأعمال --- */

/* --------------------------------------------------------------------------
   اسم الجزء / الدالة: إرسال نموذج المعاينة إلى واتساب (handleWhatsAppSubmit)
   الفكرة: منع إعادة تحميل الصفحة، جمع بيانات العميل، وفتح محادثة واتساب مجهزة بالرسالة.
   الربط: يرتبط بالنموذج (#whatsappForm) والحقول (#clientName و #serviceType و #projectDetails)
          في index.html.
   مناطق أمان للتعديل: يمكنك تعديل phoneNumber أو صياغة نص الرسالة؛ انتبه لعدم تغيير
          معرفات الحقول إلا مع تحديثها هنا.
   --- بداية الدالة ---
   -------------------------------------------------------------------------- */
const whatsappForm = document.getElementById('whatsappForm');

function handleWhatsAppSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('clientName');
  const serviceInput = document.getElementById('serviceType');
  const detailsInput = document.getElementById('projectDetails');

  const name = nameInput ? nameInput.value.trim() : '';
  const service = serviceInput ? serviceInput.value : '';
  const details = detailsInput ? detailsInput.value.trim() : '';

  const phoneNumber = '967770044255';

  const message = [
    'السلام عليكم شركة المختار للمقاولات،',
    `الاسم: ${name}`,
    `الخدمة المطلوبة: ${service}`,
    `تفاصيل المشروع: ${details}`
  ].join('\n');

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank', 'noopener,noreferrer');
}

if (whatsappForm) {
  whatsappForm.addEventListener('submit', handleWhatsAppSubmit);
}
/* --- نهاية الدالة: إرسال نموذج المعاينة إلى واتساب --- */
/* --------------------------------------------------------------------------
   اسم الجزء / الدالة: مقارنة قبل وبعد التفاعلية (initBeforeAfterComparison)
   الفكرة: تحريك فاصل المقارنة وطبقة (قبل) حسب قيمة شريط السحب، ومزامنة عرض
           صورة (قبل) مع عرض الإطار الكامل، والتبديل بين النماذج بأمان.
   الربط: يعتمد على (#baStage و #baBeforeClip و #baBeforeImg و #baAfterImg
          و #baDivider و #baRange و #baCaption و .ba-preset-btn) في index.html،
          وكلاس (.active) في style.css.
   مناطق أمان للتعديل: يمكنك إضافة أزرار نماذج جديدة بنفس بنية data-before و
          data-after و data-caption في HTML دون تعديل هذا الكود.
   --- بداية الدالة ---
   -------------------------------------------------------------------------- */
const baStageEl = document.getElementById('baStage');
const baBeforeClipEl = document.getElementById('baBeforeClip');
const baBeforeImgEl = document.getElementById('baBeforeImg');
const baAfterImgEl = document.getElementById('baAfterImg');
const baDividerEl = document.getElementById('baDivider');
const baRangeEl = document.getElementById('baRange');
const baCaptionEl = document.getElementById('baCaption');
const baPresetBtns = document.querySelectorAll('.ba-preset-btn');

function syncBeforeImageWidth() {
  if (!baStageEl || !baBeforeImgEl) return;
  const stageWidth = baStageEl.clientWidth;
  if (stageWidth > 0) {
    baBeforeImgEl.style.width = `${stageWidth}px`;
  }
}

function updateComparisonPosition(percentValue) {
  const numericValue = Number(percentValue);
  const clamped = Number.isNaN(numericValue) ? 50 : Math.max(0, Math.min(100, numericValue));

  if (baBeforeClipEl) {
    baBeforeClipEl.style.width = `${clamped}%`;
  }

  if (baDividerEl) {
    baDividerEl.style.right = `${clamped}%`;
  }

  if (baRangeEl && Number(baRangeEl.value) !== clamped) {
    baRangeEl.value = String(clamped);
  }
}

function initBeforeAfterComparison() {
  if (!baStageEl || !baRangeEl) return;

  syncBeforeImageWidth();
  updateComparisonPosition(baRangeEl.value || 50);

  baRangeEl.addEventListener('input', e => {
    updateComparisonPosition(e.target.value);
  });

  window.addEventListener('resize', syncBeforeImageWidth);
  window.addEventListener('load', syncBeforeImageWidth);

  if (typeof ResizeObserver === 'function') {
    const stageObserver = new ResizeObserver(() => {
      syncBeforeImageWidth();
    });
    stageObserver.observe(baStageEl);
  }

  baPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      baPresetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const beforeSrc = btn.getAttribute('data-before');
      const afterSrc = btn.getAttribute('data-after');
      const captionText = btn.getAttribute('data-caption');

      if (baBeforeImgEl && beforeSrc) baBeforeImgEl.src = beforeSrc;
      if (baAfterImgEl && afterSrc) baAfterImgEl.src = afterSrc;
      if (baCaptionEl && captionText) baCaptionEl.innerText = captionText;

      syncBeforeImageWidth();
      updateComparisonPosition(50);
    });
  });
}

initBeforeAfterComparison();
/* --- نهاية الدالة: مقارنة قبل وبعد التفاعلية --- */

/* --------------------------------------------------------------------------
   اسم الجزء / الدالة: قائمة التنقل للجوال
   الفكرة: فتح وإغلاق روابط التنقل في الشاشات الصغيرة وتحديث حالة زر القائمة.
   -------------------------------------------------------------------------- */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'إغلاق القائمة' : 'القائمة');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', event => {
    if (
      navLinks.classList.contains('active') &&
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
/* --- نهاية الدالة: قائمة التنقل للجوال --- */

/* --------------------------------------------------------------------------
   اسم الجزء / الدالة: نافذة تكبير صور الأعمال
   الفكرة: فتح الصورة وتفاصيل المشروع في نافذة منبثقة والإغلاق بالمؤشر أو Escape.
   -------------------------------------------------------------------------- */
const imageModal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.querySelector('.close-modal');

function closeImageModal() {
  if (imageModal) {
    imageModal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

portfolioItems.forEach(item => {
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');

  const openModal = () => {
    if (!imageModal || !modalImg) return;
    const image = item.querySelector('img');
    const title = item.querySelector('h3');
    const location = item.querySelector('p');

    modalImg.src = image ? image.src : '';
    modalImg.alt = image ? image.alt : 'صورة المشروع';
    if (modalCaption) {
      modalCaption.innerHTML = [
        title ? title.textContent : '',
        location ? location.textContent : ''
      ].filter(Boolean).join(' — ');
    }

    imageModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  item.addEventListener('click', openModal);
  item.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal();
    }
  });
});

if (closeModal) closeModal.addEventListener('click', closeImageModal);
if (imageModal) {
  imageModal.addEventListener('click', event => {
    if (event.target === imageModal) closeImageModal();
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeImageModal();
});
/* --- نهاية الدالة: نافذة تكبير صور الأعمال --- */

/* --------------------------------------------------------------------------
   اسم الجزء / الدالة: حاسبة التكلفة التقديرية
   الفكرة: تقدير نطاق التكلفة حسب نوع الخدمة والمساحة ومستوى الخامات،
           مع زر لإرسال النتيجة إلى واتساب.
   -------------------------------------------------------------------------- */
const calcService = document.getElementById('calcService');
const calcArea = document.getElementById('calcArea');
const calcQuality = document.getElementById('calcQuality');
const calcBtn = document.getElementById('calcBtn');
const calcResult = document.getElementById('calcResult');

const serviceRates = {
  renovation: 85,
  finishing: 250,
  decor: 180
};

const qualityMultipliers = {
  economy: 0.85,
  standard: 1,
  luxury: 1.45
};

const serviceNames = {
  renovation: 'ترميم وصيانة هندسية',
  finishing: 'تشطيبات متكاملة',
  decor: 'تصميم وديكور داخلي'
};

const qualityNames = {
  economy: 'اقتصادي عملي',
  standard: 'قياسي ممتاز',
  luxury: 'فاخر VIP'
};

let latestEstimate = null;

function formatYER(value) {
  return new Intl.NumberFormat('ar-YE').format(Math.round(value));
}

if (calcBtn && calcService && calcArea && calcQuality && calcResult) {
  calcBtn.addEventListener('click', () => {
    const area = Number(calcArea.value);

    if (!Number.isFinite(area) || area < 10 || area > 10000) {
      calcResult.innerHTML = '<p class="calc-hint calc-error">يرجى إدخال مساحة بين 10 و10000 متر مربع.</p>';
      return;
    }

    const service = calcService.value;
    const quality = calcQuality.value;
    const base = area * serviceRates[service] * qualityMultipliers[quality];
    const minimum = base * 0.9;
    const maximum = base * 1.15;

    latestEstimate = {
      area,
      service: serviceNames[service],
      quality: qualityNames[quality],
      minimum,
      maximum
    };

    calcResult.innerHTML = `
      <p class="calc-hint">التقدير المبدئي:</p>
      <h3>${formatYER(minimum)} - ${formatYER(maximum)} ر.ي</h3>
      <p>${latestEstimate.service} | ${area} م² | ${latestEstimate.quality}</p>
      <button type="button" id="sendCalcToWhatsapp" class="btn btn-gold full-width">
        <i class="fa-brands fa-whatsapp"></i> إرسال التفاصيل عبر واتساب
      </button>
      <small>هذا تقدير أولي ولا يشمل فحص الموقع أو المخاطر الإنشائية؛ السعر النهائي بعد المعاينة.</small>
    `;

    const sendEstimate = document.getElementById('sendCalcToWhatsapp');
    if (sendEstimate) {
      sendEstimate.addEventListener('click', () => {
        if (!latestEstimate) return;
        const estimateMessage = [
          'السلام عليكم شركة المختار للمقاولات،',
          'أرغب في الحصول على معاينة لمشروع بناء/تشطيب.',
          `الخدمة: ${latestEstimate.service}`,
          `المساحة: ${latestEstimate.area} م²`,
          `مستوى التنفيذ: ${latestEstimate.quality}`,
          `التكلفة التقديرية: ${formatYER(latestEstimate.minimum)} - ${formatYER(latestEstimate.maximum)} ر.ي`
        ].join('\n');

        window.open(
          `https://wa.me/967770044255?text=${encodeURIComponent(estimateMessage)}`,
          '_blank',
          'noopener,noreferrer'
        );
      });
    }
  });
}
/* --- نهاية الدالة: حاسبة التكلفة التقديرية --- */