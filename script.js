/* ============================================
   이별의 편지 — Script
   Handles: Intersection Observer animations,
   floating particles, scroll progress
   ============================================ */

(function () {
    'use strict';

    // ─── Intersection Observer: Fade-in text ───
    function initFadeAnimations() {
        const fadeElements = document.querySelectorAll('.fade-text');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.getAttribute('data-delay') || '0', 10);

                    setTimeout(() => {
                        el.classList.add('is-visible');
                    }, delay);

                    // Once visible, stop observing
                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        fadeElements.forEach((el) => {
            observer.observe(el);
        });
    }

    // ─── Scene Active State (ambient glow) ───
    function initSceneObserver() {
        const scenes = document.querySelectorAll('.scene--letter, .scene--closing');

        const sceneObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scene--active');
                } else {
                    entry.target.classList.remove('scene--active');
                }
            });
        }, {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.1
        });

        scenes.forEach((scene) => {
            sceneObserver.observe(scene);
        });
    }

    // ─── Scroll Progress Bar ───
    function initScrollProgress() {
        const progressBar = document.getElementById('scrollProgress');
        if (!progressBar) return;

        let ticking = false;

        function updateProgress() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            progressBar.style.width = progress + '%';
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });

        updateProgress();
    }

    // ─── Floating Particles (Canvas) ───
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animFrameId;
        let width, height;

        // Determine particle count based on screen size
        function getParticleCount() {
            const area = window.innerWidth * window.innerHeight;
            if (area < 400000) return 25;   // Mobile
            if (area < 800000) return 40;   // Tablet
            return 60;                       // Desktop
        }

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.2 - 0.1; // Slight upward drift
                this.opacity = Math.random() * 0.4 + 0.1;
                this.opacitySpeed = (Math.random() - 0.5) * 0.003;
                this.maxOpacity = this.opacity + 0.2;
                this.minOpacity = Math.max(0.05, this.opacity - 0.15);

                // Color variation: bluish to purplish
                const hue = 210 + Math.random() * 70; // 210–280
                const sat = 20 + Math.random() * 30;
                const light = 50 + Math.random() * 20;
                this.color = `hsla(${hue}, ${sat}%, ${light}%,`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.opacitySpeed;

                if (this.opacity >= this.maxOpacity || this.opacity <= this.minOpacity) {
                    this.opacitySpeed *= -1;
                }

                // Wrap around edges
                if (this.x < -10) this.x = width + 10;
                if (this.x > width + 10) this.x = -10;
                if (this.y < -10) this.y = height + 10;
                if (this.y > height + 10) this.y = -10;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.fill();

                // Soft glow
                if (this.size > 1.2) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = this.color + (this.opacity * 0.15) + ')';
                    ctx.fill();
                }
            }
        }

        function initParticleArray() {
            particles = [];
            const count = getParticleCount();
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            animFrameId = requestAnimationFrame(animate);
        }

        // Handle resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resize();
                initParticleArray();
            }, 250);
        });

        resize();
        initParticleArray();
        animate();
    }

    // ─── Smooth page entrance ───
    function initPageEntrance() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 1.5s ease';

        // Use requestAnimationFrame to ensure styles are applied before transition
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.body.style.opacity = '1';
            });
        });
    }

    // ─── Initialize Everything ───
    function init() {
        initPageEntrance();
        initParticles();
        initFadeAnimations();
        initSceneObserver();
        initScrollProgress();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
