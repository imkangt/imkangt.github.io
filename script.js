document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '🌙';
    } else {
        document.body.removeAttribute('data-theme');
        themeToggle.textContent = '🌞';
    }

    themeToggle.addEventListener('click', () => {
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌞';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '🌙';
        }
    });

    // Envelope Logic
    const envelope = document.getElementById('envelope');
    let isOpen = false;
    let isAnimating = false;

    envelope.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        if (!isOpen) {
            envelope.classList.add('open');
            isOpen = true;
            
            // Fire confetti
            fireConfetti();
        } else {
            envelope.classList.remove('open');
            isOpen = false;
        }

        setTimeout(() => {
            isAnimating = false;
        }, 600);
    });

    // Confetti Function
    function fireConfetti() {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 },
            zIndex: 100
        };

        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    }

    // Lucky Charm Logic
    const charmBtn = document.getElementById('charm-btn');
    const charmMessage = document.getElementById('charm-message');
    
    const messages = [
        "야옹~ 넌 할 수 있어! 널 믿어! 🐱🌟",
        "힘들면 고양이처럼 꾹꾹이 하면서 쉬어! 🐾✨",
        "성적보다 너의 노력이 훨씬 중요해! 츄르 줄게! 🐟❤️",
        "크게 숨을 들이마셔봐... 다 잘 될 거야! 냥! 🍃",
        "시험 잘 보면 맛있는 거 사줄게 🧶🧋",
        "조금만 더 힘내자, 화이팅! 냥냥! 💪",
        "물 많이 마시고 푹 자는 거 잊지 마! 골골골~ 💧😴"
    ];

    charmBtn.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        
        charmMessage.textContent = messages[randomIndex];
        charmMessage.classList.remove('hidden');
        charmMessage.classList.remove('show');
        
        setTimeout(() => {
            charmMessage.classList.add('show');
        }, 50);

        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#f472b6', '#fbcfe8', '#db2777']
        });
    });
});
