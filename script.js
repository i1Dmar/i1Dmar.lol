// Dark/White Mode Toggle
function toggleMode() {
    if (document.body.classList.contains("dark-mode")) {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("white-mode");
        localStorage.setItem("mode", "white");
    } else if (document.body.classList.contains("white-mode")) {
        document.body.classList.remove("white-mode");
        document.body.classList.add("dark-mode");
        localStorage.setItem("mode", "dark");
    } else {
        document.body.classList.add("dark-mode");
        localStorage.setItem("mode", "dark");
    }
}

if (localStorage.getItem("mode") === "white") {
    document.body.classList.add("white-mode");
} else {
    document.body.classList.add("dark-mode");
}

// Twitch API (فقط في صفحة twitch.html)
if (document.getElementById('twitch-status')) {
    function fetchTwitchData() {
        fetch('https://api.twitch.tv/helix/streams?user_login=i1dmar', {
            headers: {
                'Client-ID': 'f8ukqch3sggujn8co4dnua2tc1ku2a',
                'Authorization': 'Bearer rraem4oevyma46d3cc7fjro0l9admy'
            }
        })
        .then(response => response.ok ? response.json() : Promise.reject('خطأ في الـ API'))
        .then(data => {
            const twitchStatus = document.getElementById('twitch-status');
            const twitchTitle = document.getElementById('twitch-title');
            const twitchGame = document.getElementById('twitch-game');
            const twitchImage = document.getElementById('twitch-image');

            if (data.data && data.data.length > 0) {
                twitchStatus.innerHTML = 'البث شغال الآن';
                twitchTitle.innerHTML = 'العنوان: ' + data.data[0].title;
                twitchGame.innerHTML = 'اللعبة: ' + data.data[0].game_name;
                twitchImage.src = data.data[0].thumbnail_url.replace('{width}', '400').replace('{height}', '225');
                twitchImage.style.display = 'block';
            } else {
                twitchStatus.innerHTML = 'البث متوقف حاليًا';
                twitchTitle.innerHTML = '';
                twitchGame.innerHTML = '';
                twitchImage.src = 'https://via.placeholder.com/400x225?text=البث+متوقف';
                twitchImage.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('خطأ:', error);
            document.getElementById('twitch-status').innerHTML = 'خطأ في جلب بيانات Twitch';
        });
    }

    fetchTwitchData();
    setInterval(fetchTwitchData, 30000);
}

// Discord API (فقط في صفحة discord.html)
if (document.getElementById('discord-online')) {
    function fetchDiscordData() {
        fetch('https://discord.com/api/v10/invites/6WVqFCfVcW?with_counts=true', {
            headers: {
                'Authorization': 'Bot YOUR_BOT_TOKEN_HERE' // استبدل YOUR_BOT_TOKEN_HERE بتوكن البوت
            }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('discord-online').innerHTML = data.approximate_presence_count || 'غير متاح';
            document.getElementById('discord-voice').innerHTML = 'تحت التطوير';
        })
        .catch(error => {
            console.error('خطأ Discord:', error);
            document.getElementById('discord-online').innerHTML = 'غير متاح';
        });
    }

    fetchDiscordData();
}

// المقترحات (فقط في صفحة suggestions.html)
if (document.getElementById('submit-suggestion')) {
    document.getElementById('submit-suggestion').addEventListener('click', function() {
        const name = document.getElementById('suggestion-name').value.trim();
        const title = document.getElementById('suggestion-title').value.trim();
        const details = document.getElementById('suggestion-details').value.trim();
        const message = document.getElementById('suggestion-message');

        if (!name || !title || !details) {
            message.innerHTML = 'يرجى ملء جميع الحقول!';
            return;
        }

        const lastSubmit = localStorage.getItem(`suggestion_${name}`);
        const now = new Date().toDateString();

        if (lastSubmit === now) {
            message.innerHTML = 'لقد قدمت اقتراحًا اليوم، جرب غدًا!';
            return;
        }

        console.log('اسم:', name, 'عنوان:', title, 'تفاصيل:', details);
        localStorage.setItem(`suggestion_${name}`, now);
        message.innerHTML = 'تم إرسال اقتراحك بنجاح!';
        document.getElementById('suggestion-name').value = '';
        document.getElementById('suggestion-title').value = '';
        document.getElementById('suggestion-details').value = '';
    });
}

// إضافة زر لتغيير الوضع
const nav = document.getElementById('top-nav');
const modeBtn = document.createElement('button');
modeBtn.innerHTML = 'تغيير الوضع';
modeBtn.style.backgroundColor = '#48d9f6';
modeBtn.style.color = '#fff';
modeBtn.style.padding = '8px 20px';
modeBtn.style.border = 'none';
modeBtn.style.borderRadius = '5px';
modeBtn.style.cursor = 'pointer';
modeBtn.addEventListener('click', toggleMode);
nav.appendChild(modeBtn);