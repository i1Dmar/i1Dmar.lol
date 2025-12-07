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

class SuggestionSystem {
    constructor() {
        this.storageKey = "suggestions";
        this.badWords = ["قحب","وسخ","نيك","كلب","fuck","shit","sex","gay"];
    }

    load() {
        return JSON.parse(localStorage.getItem(this.storageKey) || "[]");
    }

    save(list) {
        localStorage.setItem(this.storageKey, JSON.stringify(list));
    }

    filter(text) {
        let x = text;
        this.badWords.forEach(w => {
            x = x.replace(new RegExp(w, "gi"), "****");
        });
        return x;
    }

    submit(name, content, anonymous) {
        const list = this.load();
        list.push({
            name: anonymous ? "🚀 مجهول" : name,
            content: this.filter(content),
            date: new Date().toLocaleString()
        });
        this.save(list);
    }
}

class AdminPanel extends SuggestionSystem {
    constructor() {
        super();
        this.password = "i1DmarSecure";
    }

    login(key) {
        return key === this.password;
    }

    render(container) {
        const list = this.load();
        container.innerHTML = "";

        list.forEach((s,i)=>{
            const div = document.createElement("div");
            div.className = "transparent-box";
            div.innerHTML = `
                <strong>${s.name}</strong>
                <p>${s.content}</p>
                <small>${s.date}</small><br><br>
                <button data-id="${i}" class="delete-btn">🗑 حذف</button>
            `;
            container.appendChild(div);
        });

        document.querySelectorAll(".delete-btn").forEach(btn=>{
            btn.addEventListener("click", ()=>{
                this.delete(btn.dataset.id, container);
                showToast("🗑 تم حذف اقتراح", "success");
            });
        });
    }

    delete(index, container) {
        const list = this.load();
        list.splice(index,1);
        this.save(list);
        this.render(container);
    }
}

class TwitchStatus {
    constructor() {
        this.channel = "i1dmar";
        this.clientId = "ue55rubpnnrmskmw9wvv413tupcemf";
        this.token = "pvtcqjheacogo7ewilfjwkquwdoxct";
    }

    async check() {
        const text = document.getElementById("stream-status");
        const box = document.getElementById("twitch-container");
        if (!text) return;
        try {
            const res = await fetch(`https://api.twitch.tv/helix/streams?user_login=${this.channel}`,{
                headers:{
                    "Client-ID": this.clientId,
                    "Authorization": `Bearer ${this.token}`
                }
            });
            const data = await res.json();
            if (data.data.length > 0){
                text.innerText = "🟢 البث شغال الآن!";
                box.style.display = "block";
                new Twitch.Embed("twitch-container", {
                    width:"100%", height:480, channel:this.channel
                });
            } else {
                text.innerText = "🔴 لا يوجد بث الآن";
            }
        } catch(e){ text.innerText="⚠ مشكلة في Twitch API"; }
    }
}

/** TOAST */
function showToast(msg,type="info"){
    const container = document.getElementById("toast-container");
    const div = document.createElement("div");
    div.classList.add("toast");
    if (type==="success") div.style.borderColor="#00ffae";
    if (type==="error") div.style.borderColor="var(--danger)";
    div.textContent = msg;
    container.appendChild(div);
    setTimeout(()=>{
        div.style.opacity=0;
        setTimeout(()=>div.remove(),500);
    },3000);
}

/** LOADER */
window.addEventListener("load",()=>{
    setTimeout(()=>{
        const l = document.getElementById("loader");
        l.style.opacity = 0;
        setTimeout(()=> l.remove(),500);
    },400);
});

/** INIT */
document.addEventListener("DOMContentLoaded",()=>{

    new VisitorCounter().init();

    const s = new SuggestionSystem();
    const btn = document.getElementById("submit-suggestion");

    if (btn){
        btn.addEventListener("click",()=>{
            const n = document.getElementById("suggestion-name").value;
            const c = document.getElementById("suggestion-details").value;
            const a = document.getElementById("anonymous-mode").checked;
            if (!c.trim()) return showToast("⚠ اكتب اقتراحك","error");

            s.submit(n,c,a);
            showToast("✨ تم الإرسال!","success");
            setTimeout(()=> location.reload(),1000);
        });
    }

    const login = document.getElementById("admin-login-btn");
    if (login){
        const admin = new AdminPanel();
        login.addEventListener("click",()=>{
            const key = document.getElementById("admin-key").value;
            const err = document.getElementById("admin-error");
            if (admin.login(key)){
                document.getElementById("admin-login").style.display="none";
                document.getElementById("admin-content").style.display="block";
                admin.render(document.getElementById("suggestions-list"));
            } else {
                showToast("❌ كلمة المرور خاطئة","error");
            }
        });
    }

    new TwitchStatus().check();
});