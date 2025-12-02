// ===============================
// 🔹 الزيارات
// ===============================
function getVisitorId() {
    let id = localStorage.getItem('visitor_id');
    if (!id) {
        id = `v_${crypto.randomUUID()}`;
        localStorage.setItem('visitor_id', id);
    }
    return id;
}

function updateVisitorCount() {
    if (!window.firebaseFunctions) return;

    const { getDatabase, ref, set, onValue } = window.firebaseFunctions;
    const db = getDatabase();
    const visitorId = getVisitorId();
    const visitorsRef = ref(db, "visitors");
    const visitorSlot = ref(db, `visitors/${visitorId}`);
    const countDisplay = document.getElementById("visitor-count");

    onValue(visitorSlot, (snap) => {
        if (!snap.exists()) {
            set(visitorSlot, { entered: Date.now() });
        }
    }, { onlyOnce: true });

    onValue(visitorsRef, (snap) => {
        const count = snap.val() ? Object.keys(snap.val()).length : 0;
        if (countDisplay) countDisplay.innerHTML = `📊 عدد الزوار: ${count}`;
    });
}

document.addEventListener("DOMContentLoaded", updateVisitorCount);


// ===============================
// 🔹 فلتر الكلمات الممنوعة
// ===============================
const badWords = ["fuck", "shit", "زق", "كلب", "عرص", "شرموط", "gay", "وسخ", "طيز", "خراء"];

function containsBadWords(text) {
    return badWords.some(word => text.includes(word));
}


// ===============================
// 🔹 إنشاء المقترحات
// ===============================
const submitBtn = document.getElementById("submit-suggestion");
if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const name = document.getElementById("suggestion-name").value.trim();
        const text = document.getElementById("suggestion-details").value.trim();
        const messageBox = document.getElementById("suggestion-message");

        if (!name || !text) {
            messageBox.innerHTML = "⚠️ يجب تعبئة الحقول.";
            messageBox.classList.add("error");
            return;
        }

        if (text.length > 150) {
            messageBox.innerHTML = "⚠️ الحد الأقصى 150 حرف.";
            return;
        }

        if (containsBadWords(text)) {
            messageBox.innerHTML = "🚫 تم منع الاقتراح بسبب كلمات غير مناسبة.";
            return;
        }

        const lastSubmit = localStorage.getItem(`s_${name}`);
        const today = new Date().toDateString();

        if (lastSubmit === today) {
            messageBox.innerHTML = "⚠️ يمكنك إرسال اقتراح واحد يوميًا.";
            return;
        }

        const stored = JSON.parse(localStorage.getItem("suggestions") || "[]");
        stored.push({ name, text, date: new Date().toLocaleString() });
        localStorage.setItem("suggestions", JSON.stringify(stored));
        localStorage.setItem(`s_${name}`, today);

        messageBox.innerHTML = `💙 تم إرسال اقتراحك يا ${name}!`;
        setTimeout(() => messageBox.innerHTML = "", 4000);

        document.getElementById("suggestion-name").value = "";
        document.getElementById("suggestion-details").value = "";
    });
}


// ===============================
// 🔹 لوحة الإدارة
// ===============================
if (document.getElementById("admin")) {

    const adminPassword = "i1Dmari1998"; // ← تقدر تغيرها لاحقًا

    function loadSuggestions() {
        const stored = JSON.parse(localStorage.getItem("suggestions") || "[]");
        const container = document.getElementById("suggestions-list");

        if (stored.length === 0) {
            container.innerHTML = "<p>🚫 لا يوجد اقتراحات حتى الآن</p>";
            return;
        }

        container.innerHTML = stored.map((s, i) => `
            <div class="suggestion-box">
                <p><strong>🧑‍💻 الاسم:</strong> ${s.name}</p>
                <p><strong>💬 الاقتراح:</strong> ${s.text}</p>
                <p><strong>📅 التاريخ:</strong> ${s.date}</p>
                <button class="delete" data-i="${i}">🗑 حذف</button>
            </div>
        `).join("");

        document.querySelectorAll(".delete").forEach(btn =>
            btn.addEventListener("click", () => {
                stored.splice(btn.dataset.i, 1);
                localStorage.setItem("suggestions", JSON.stringify(stored));
                loadSuggestions();
            })
        );
    }

    if (localStorage.getItem("adminLogged") === "true") {
        document.getElementById("admin-login").style.display = "none";
        document.getElementById("admin-content").style.display = "block";
        loadSuggestions();
    }

    document.getElementById("admin-login-btn")?.addEventListener("click", () => {
        const input = document.getElementById("admin-key").value;
        if (input === adminPassword) {
            localStorage.setItem("adminLogged", "true");
            location.reload();
        } else {
            document.getElementById("admin-error").innerHTML = "🚫 كلمة مرور خاطئة!";
        }
    });

    document.getElementById("admin-logout")?.addEventListener("click", () => {
        localStorage.removeItem("adminLogged");
        location.reload();
    });
}


// ===============================
// 🔹 الثيم الليلي
// ===============================
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    });

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
}
