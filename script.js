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
                twitchImage.src = 'https://i.ibb.co/2yWqP1G/twitch-offline.jpg';
                twitchImage.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('خطأ:', error);
            document.getElementById('twitch-status').innerHTML = 'خطأ في جلب بيانات Twitch';
            document.getElementById('twitch-image').src = 'https://i.ibb.co/2yWqP1G/twitch-offline.jpg';
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

        let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
        suggestions.push({ name, title, details, date: new Date().toLocaleString() });
        localStorage.setItem('suggestions', JSON.stringify(suggestions));

        message.innerHTML = 'تم إرسال الاقتراح بنجاح! يمكنك رؤيته في صفحة الإدارة.';
        document.getElementById('suggestion-name').value = '';
        document.getElementById('suggestion-title').value = '';
        document.getElementById('suggestion-details').value = '';
    });
}

// التحقق من الدخول لصفحة الإدارة
if (document.getElementById('admin')) {
    const adminLogin = document.getElementById('admin-login');
    const adminContent = document.getElementById('admin-content');
    const adminKeyInput = document.getElementById('admin-key');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminError = document.getElementById('admin-error');
    const secretKey = 'i1Dmari1998';

    const isLoggedIn = localStorage.getItem('adminLoggedIn');

    if (isLoggedIn === 'true') {
        adminLogin.style.display = 'none';
        adminContent.style.display = 'block';
        loadSuggestions();
    } else {
        adminLogin.style.display = 'block';
        adminContent.style.display = 'none';
    }

    adminLoginBtn.addEventListener('click', function() {
        const enteredKey = adminKeyInput.value.trim();
        if (enteredKey === secretKey) {
            localStorage.setItem('adminLoggedIn', 'true');
            adminLogin.style.display = 'none';
            adminContent.style.display = 'block';
            loadSuggestions();
        } else {
            adminError.innerHTML = 'المفتاح السري غير صحيح!';
        }
    });

    function loadSuggestions() {
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

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
                    suggestions.splice(index, 1);
                    localStorage.setItem('suggestions', JSON.stringify(suggestions));
                    location.reload();
                });
            });
        }
    }
}