/** CORE CLASSES **/

class FirebaseService {
  constructor() {
    const fb = window.firebaseFunctions;
    if (!fb) return;
    this.db = fb.getDatabase();
    this.ref = fb.ref;
    this.set = fb.set;
    this.onValue = fb.onValue;
  }
}

class VisitorCounter extends FirebaseService {
  constructor() {
    super();
    this.countRef = this.ref("visitorCount");
  }

  init() {
    if (!this.onValue) return;
    this.onValue(this.countRef, snapshot => {
      const count = snapshot.val() || 0;
      document.getElementById("visitor-count").innerText =
        `📊 عدد الزوار: ${count}`;
      this.set(this.countRef, count + 1);
    });
  }
}

/** PAGE HANDLERS **/

// Home Page
if (document.getElementById("visitor-count")) {
  new VisitorCounter().init();
}

// Twitch Page
if (document.getElementById("twitch-status")) {
  checkTwitchStatus();
}

function checkTwitchStatus() {
  const statusEl = document.getElementById("twitch-status");
  const channelName = "i1dmar";

  // استخدام Twitch API (يحتاج Client ID)
  // هنا مثال بسيط - يمكنك تحسينه باستخدام API حقيقي
  setTimeout(() => {
    const isLive = Math.random() > 0.5; // مثال عشوائي

    if (isLive) {
      statusEl.innerHTML = `
        <div style="color: #00ff00;">
          🔴 البث مباشر الآن!
        </div>
      `;
    } else {
      statusEl.innerHTML = `
        <div style="color: #ff4d6d;">
          ⚫ القناة غير مباشرة حالياً
        </div>
      `;
    }
  }, 1000);
}

/** UTILITIES **/

function showToast(msg) {
  const container = document.getElementById("toast-container") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function createToastContainer() {
  const div = document.createElement("div");
  div.id = "toast-container";
  document.body.appendChild(div);
  return div;
}

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