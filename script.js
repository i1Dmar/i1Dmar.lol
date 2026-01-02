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

/** VISITOR COUNTER **/
async function updateVisitorCount() {
  const countElement = document.getElementById('visitor-count');

  try {
    // استخدام CountAPI - يحسب كل زيارة للموقع
    const response = await fetch('https://api.countapi.xyz/hit/dmar-website/visits');
    const data = await response.json();

    // تنسيق الرقم بفواصل عربية
    const formattedCount = data.value.toLocaleString('ar-SA');
    countElement.innerHTML = `<span style="color: var(--accent)">👁️</span> ${formattedCount} زائر`;

    // إضافة تأثير حركي للرقم
    countElement.style.animation = 'countUp 0.5s ease';
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    countElement.textContent = '∞ زائر';
  }
}

// تشغيل العداد عند تحميل الصفحة
if (document.getElementById('visitor-count')) {
  updateVisitorCount();
}