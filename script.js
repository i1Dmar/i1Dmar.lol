/** LOADER **/
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 500);
    }, 800);
  }
});

/** VISITOR COUNTER - محدث ومحسّن **/
async function updateVisitorCount() {
  const countElement = document.getElementById('visitor-count');

  if (!countElement) return;

  try {
    // استخدام CounterAPI.dev - أسرع وأحدث
    const namespace = 'dmar-lol';
    const key = 'visits';

    const response = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('API Error');
    }

    const data = await response.json();

    // تنسيق الرقم بفواصل عربية
    const formattedCount = data.count.toLocaleString('ar-SA');
    countElement.innerHTML = `<span style="color: var(--accent)">👁️</span> ${formattedCount} زائر`;

    // إضافة تأثير حركي للرقم
    countElement.style.animation = 'countUp 0.5s ease';

  } catch (error) {
    console.error('Error fetching visitor count:', error);

    // في حالة الخطأ، جرب CountAPI الأصلي كـ Fallback
    try {
      const fallbackResponse = await fetch('https://api.countapi.xyz/hit/dmar-website/visits');
      const fallbackData = await fallbackResponse.json();
      const formattedCount = fallbackData.value.toLocaleString('ar-SA');
      countElement.innerHTML = `<span style="color: var(--accent)">👁️</span> ${formattedCount} زائر`;
      countElement.style.animation = 'countUp 0.5s ease';
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      countElement.innerHTML = '<span style="color: var(--accent)">👁️</span> ∞ زائر';
    }
  }
}

// تشغيل العداد عند تحميل الصفحة
if (document.getElementById('visitor-count')) {
  updateVisitorCount();
}