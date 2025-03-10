// وظيفة تغيير وضع الداكن
function toggleDarkMode() {
    // التبديل بين الألوان باستخدام الـ class
    document.body.classList.toggle("dark-mode");

    // حفظ حالة الوضع باستخدام localStorage
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", "enabled");
    } else {
        localStorage.removeItem("dark-mode");
    }
}

// تطبيق وضع الدارك مود إذا كان تم تمكينه مسبقًا
if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
}


// وظيفة لتحميل الصورة الشخصية
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

// محاكاة تنبيهات Twitch
setInterval(function() {
    fetch('https://api.twitch.tv/helix/streams?user_login=your_twitch_username', {
        headers: {
            'Client-ID': 'your_twitch_client_id',
            'Authorization': 'Bearer your_oauth_token'
        }
    })
    .then(response => response.json())
    .then(data => {
        const twitchStatus = document.getElementById('twitch-status');
        if (data.data && data.data.length > 0) {
            twitchStatus.innerHTML = 'البث قيد التشغيل: ' + data.data[0].title;
        } else {
            twitchStatus.innerHTML = 'لا يوجد بث حالياً.';
        }
    })
    .catch(error => console.error(error));
}, 30000); // تحقق كل 30 ثانية
