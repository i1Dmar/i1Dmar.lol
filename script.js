// المقترحات
if (document.getElementById('submit-suggestion')) {
    document.getElementById('submit-suggestion').addEventListener('click', function(e) {
        e.preventDefault();
        const name = document.getElementById('suggestion-name').value.trim();
        const title = document.getElementById('suggestion-title').value.trim();
        const details = document.getElementById('suggestion-details').value.trim();
        const message = document.getElementById('suggestion-message');

        if (!name || !title || !details) {
            message.classList.add('error');
            message.innerHTML = 'يرجى ملء جميع الحقول!';
            return;
        }

        const lastSubmit = localStorage.getItem(`suggestion_${name}`);
        const now = new Date().toDateString();

        if (lastSubmit === now) {
            message.classList.add('error');
            message.innerHTML = 'لقد قدمت اقتراحًا اليوم، جرب غدًا!';
            return;
        }

        let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
        if (suggestions.length >= 100) {
            message.classList.add('error');
            message.innerHTML = 'تم الوصول للحد الأقصى للاقتراحات!';
            return;
        }

        suggestions.push({ name, title, details, date: new Date().toLocaleString() });
        localStorage.setItem('suggestions', JSON.stringify(suggestions));
        localStorage.setItem(`suggestion_${name}`, now);

        message.classList.remove('error');
        message.innerHTML = `شكرًا يا ${name} على اقتراحك! يمكنك رؤيته في صفحة الإدارة.`;
        setTimeout(() => message.innerHTML = '', 5000);

        document.getElementById('suggestion-name').value = '';
        document.getElementById('suggestion-title').value = '';
        document.getElementById('suggestion-details').value = '';
    });

    document.getElementById('clear-suggestion').addEventListener('click', () => {
        document.getElementById('suggestion-name').value = '';
        document.getElementById('suggestion-title').value = '';
        document.getElementById('suggestion-details').value = '';
        document.getElementById('suggestion-message').innerHTML = '';
    });
}

// الإدارة
if (document.getElementById('admin')) {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
        loadSuggestions();
    } else {
        document.getElementById('admin-login').style.display = 'block';
        document.getElementById('admin-content').style.display = 'none';
    }

    document.getElementById('admin-login-btn').addEventListener('click', function() {
        const key = document.getElementById('admin-key').value;
        const error = document.getElementById('admin-error');
        if (key === 'i1Dmari1998') {
            localStorage.setItem('adminLoggedIn', 'true');
            document.getElementById('admin-login').style.display = 'none';
            document.getElementById('admin-content').style.display = 'block';
            loadSuggestions();
        } else {
            error.innerHTML = 'المفتاح السري غير صحيح!';
        }
    });

    document.getElementById('admin-logout')?.addEventListener('click', () => {
        localStorage.removeItem('adminLoggedIn');
        location.reload();
    });
}

function loadSuggestions() {
    const suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
    const suggestionsList = document.getElementById('suggestions-list');
    const statsElement = document.getElementById('suggestions-stats');

    if (suggestions.length === 0) {
        suggestionsList.innerHTML = '<p>لا يوجد اقتراحات بعد.</p>';
        statsElement.innerHTML = 'الإحصائيات: لا يوجد اقتراحات';
    } else {
        const uniqueUsers = [...new Set(suggestions.map(s => s.name))].length;
        statsElement.innerHTML = `الإحصائيات: ${suggestions.length} اقتراحات من ${uniqueUsers} أشخاص`;
        suggestionsList.innerHTML = '';
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

// عداد الزوار
function updateVisitorCount() {
    let visitors = parseInt(localStorage.getItem('visitorCount')) || 0;
    visitors += 1;
    localStorage.setItem('visitorCount', visitors);
    const visitorCountElement = document.getElementById('visitor-count');
    if (visitorCountElement) {
        visitorCountElement.innerHTML = `عدد الزوار: ${visitors}`;
    }
}
document.addEventListener('DOMContentLoaded', updateVisitorCount);

// اللعبة
if (document.getElementById('start-game')) {
    const startButton = document.getElementById('start-game');
    const target = document.getElementById('target');
    const scoreDisplay = document.getElementById('score');
    const gameArea = document.getElementById('game-area');
    let score = 0;
    let gameActive = false;

    startButton.addEventListener('click', () => {
        if (!gameActive) {
            gameActive = true;
            score = 0;
            scoreDisplay.innerHTML = score;
            startButton.innerHTML = 'جاري اللعب...';
            moveTarget();
            setTimeout(() => {
                gameActive = false;
                startButton.innerHTML = 'ابدأ اللعبة';
                alert(`انتهت اللعبة! نقاطك: ${score}`);
            }, 30000);
        }
    });

    target.addEventListener('click', () => {
        if (gameActive) {
            score++;
            scoreDisplay.innerHTML = score;
            moveTarget();
        }
    });

    function moveTarget() {
        const maxX = gameArea.offsetWidth - target.offsetWidth;
        const maxY = gameArea.offsetHeight - target.offsetHeight;
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;
        target.style.left = `${newX}px`;
        target.style.top = `${newY}px`;
    }
}

// الثيم الغامق
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? 'تبديل الثيم ☀️' : 'تبديل الثيم 🌙';
    });
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = 'تبديل الثيم ☀️';
    }
}