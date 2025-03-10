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
    fetch('https://api.twitch.tv/helix/streams?user_login=i1Dmar', {
        headers: {
            'Client-ID': 'f8ukqch3sggujn8co4dnua2tc1ku2a',
            'Authorization': 'Bearer rraem4oevyma46d3cc7fjro0l9admy'
        }
    })
    .then(response => response.json())
    .then(data => {
        const twitchStatus = document.getElementById('twitch-status');
        const twitchTitle = document.getElementById('twitch-title');
        const twitchGame = document.getElementById('twitch-game');
        const twitchImage = document.getElementById('twitch-image');

        if (data.data && data.data.length > 0) {
            twitchStatus.innerHTML = 'البث قيد التشغيل: ' + data.data[0].title;
            twitchTitle.innerHTML = data.data[0].title;
            twitchGame.innerHTML = 'اللعبة: ' + data.data[0].game_name;
            twitchImage.src = data.data[0].thumbnail_url.replace('{width}', '400').replace('{height}', '225'); // تغيير حجم الصورة
        } else {
            twitchStatus.innerHTML = 'لا يوجد بث حالياً.';
            twitchTitle.innerHTML = '';
            twitchGame.innerHTML = '';
            twitchImage.src = ''; // إزالة الصورة في حال عدم وجود بث
        }
    })
    .catch(error => console.error(error));
}, 30000); // تحقق كل 30 ثانية
