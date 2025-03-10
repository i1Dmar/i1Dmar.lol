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

// إضافة حدث لزر الـ Dark Mode
document.addEventListener('DOMContentLoaded', function() {
    const modeBtn = document.getElementById('mode-toggle');
    if (modeBtn) {
        modeBtn.addEventListener('click', toggleMode);
    }
});

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
                'Authorization': 'Bot YOUR_BOT_TOKEN_HERE'
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

// المقترحات (يخزن في localStorage)
if (document.getElementById('submit-suggestion')) {
    document.getElementById('submit-suggestion').addEventListener('click', function(e) {
        e.preventDefault();
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

        // تخزين الاقتراح في localStorage
        let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
        suggestions.push({ name, title, details, date: new Date().toLocaleString() });
        localStorage.setItem('suggestions', JSON.stringify(suggestions));

        message.innerHTML = 'تم إرسال الاقتراح بنجاح! يمكنك رؤيته في صفحة الإدارة.';
        document.getElementById('suggestion-name').value = '';
        document.getElementById('suggestion-title').value = '';
        document.getElementById('suggestion-details').value = '';
    });
}

// عرض الاقتراحات في صفحة الإدارة مع زر الحذف
if (document.getElementById('admin')) {
    const urlParams = new URLSearchParams(window.location.search);
    const adminKey = urlParams.get('key'); // مفتاح سري للوصول
    const secretKey = 'i1Dmari1998'; // المفتاح السري الخاص بيك

    if (adminKey !== secretKey) {
        document.body.innerHTML = '<h2 class="section-title">غير مصرح لك بالدخول!</h2>';
        return;
    }

    const suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
    const suggestionsList = document.getElementById('suggestions-list');

    if (suggestions.length === 0) {
        suggestionsList.innerHTML = '<p>لا يوجد اقتراحات بعد.</p>';
    } else {
        suggestions.forEach((suggestion, index) => {
            const suggestionBox = document.createElement('div');
            suggestionBox.className = 'suggestion-box';
            suggestionBox.innerHTML = `
                <div class="suggestion-item"><strong>اسم الشخص المرسل:</strong> ${suggestion.name}</div>
                <div class="suggestion-item"><strong>الموضوع:</strong> ${suggestion.title}</div>
                <div class="suggestion-item"><strong>اقتراحه:</strong> ${suggestion.details}</div>
                <div class="suggestion-item"><strong>التاريخ:</strong> ${suggestion.date}</div>
                <button class="delete-btn" data-index="${index}">حذف الاقتراح</button>
                <hr>
            `;
            suggestionsList.appendChild(suggestionBox);
        });

        // إضافة حدث الحذف لكل زر
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
                suggestions.splice(index, 1); // حذف الاقتراح
                localStorage.setItem('suggestions', JSON.stringify(suggestions));
                location.reload(); // تحديث الصفحة
            });
        });
    }
}