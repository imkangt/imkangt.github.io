document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    // Use <html> (documentElement) for data-theme for better iOS Safari compatibility
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlEl.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '🌙';
        } else {
            htmlEl.removeAttribute('data-theme');
            themeToggle.textContent = '🌞';
        }
        // Force iOS Safari to repaint gradients
        document.body.style.display = 'none';
        document.body.offsetHeight; // trigger reflow
        document.body.style.display = '';
    }

    applyTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        if (htmlEl.getAttribute('data-theme') === 'dark') {
            localStorage.setItem('theme', 'light');
            applyTheme('light');
        } else {
            localStorage.setItem('theme', 'dark');
            applyTheme('dark');
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

});
