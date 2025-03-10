// وظيفة تغيير وضع الداكن
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", "enabled");
    } else {
        localStorage.removeItem("dark-mode");
    }
}

// تطبيق الوضع الداكن إذا كان مفعل مسبقًا
if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
}

// وظيفة تحميل الصورة الشخصية
document.getElementById('upload-image').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-image').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// وظيفة جلب بيانات Twitch
function fetchTwitchData() {
    fetch('https://api.twitch.tv/helix/streams?user_login=i1dmar', {
        headers: {
            'Client-ID': 'f8ukqch3sggujn8co4dnua2tc1ku2a', // تأكد من الـ Client-ID
            'Authorization': 'Bearer rraem4oevyma46d3cc7fjro0l9admy' // تأكد من الـ Token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('خطأ في جلب بيانات Twitch: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        const twitchStatus = document.getElementById('twitch-status');
        const twitchTitle = document.getElementById('twitch-title');
        const twitchGame = document.getElementById('twitch-game');
        const twitchImage = document.getElementById('twitch-image');

        if (data.data && data.data.length > 0) {
            twitchStatus.innerHTML = 'البث قيد التشغيل';
            twitchTitle.innerHTML = 'العنوان: ' + data.data[0].title;
            twitchGame.innerHTML = 'اللعبة: ' + data.data[0].game_name;
            twitchImage.src = data.data[0].thumbnail_url.replace('{width}', '400').replace('{height}', '225');
        } else {
            twitchStatus.innerHTML = 'لا يوجد بث حاليًا';
            twitchTitle.innerHTML = '';
            twitchGame.innerHTML = '';
            twitchImage.src = 'default-twitch-placeholder.png'; // صورة افتراضية لو ما في بث
        }
    })
    .catch(error => {
        console.error('خطأ:', error);
        document.getElementById('twitch-status').innerHTML = 'خطأ في الاتصال بـ Twitch';
    });
}

// تشغيل التحقق من Twitch عند تحميل الصفحة
fetchTwitchData();
// تحديث كل 30 ثانية
setInterval(fetchTwitchData, 30000);