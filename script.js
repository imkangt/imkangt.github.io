/* ═══════════════════════════════════════════
   🎀 SOYOL - Date Confirmation Logic
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ── State ──
  const state = {
    noClickCount: 0,
    selectedActivities: [],
    selectedDate: '',
    selectedTime: '',
    message: '',
    currentStep: 1,
    theme: localStorage.getItem('soyol-theme') || 'light',
  };

  // ── DOM Elements ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const themeToggle = $('.theme-toggle');
  const btnYes = $('#btn-yes');
  const btnNo = $('#btn-no');
  const sections = $$('.section');
  const progressBar = $('.progress-bar');
  const activityChips = $$('.activity-chip');
  const dateInput = $('#date-input');
  const timeInput = $('#time-input');
  const messageInput = $('#message-input');
  const charCount = $('.char-count');

  // ── Init ──
  initTheme();
  createFloatingHearts();
  setMinDate();

  // ══════════════════════════════
  // 🌙 Theme Toggle
  // ══════════════════════════════
  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
  }

  themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('soyol-theme', state.theme);
  });

  // ══════════════════════════════
  // 💕 Floating Hearts
  // ══════════════════════════════
  function createFloatingHearts() {
    const container = $('.floating-hearts');
    const hearts = ['💕', '💖', '💗', '💝', '🩷', '✨', '🌸', '💫', '🦋', '🎀'];

    function spawnHeart() {
      const heart = document.createElement('span');
      heart.className = 'heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.animationDuration = (8 + Math.random() * 12) + 's';
      heart.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
      heart.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(heart);

      heart.addEventListener('animationend', () => heart.remove());
    }

    // Initial burst
    for (let i = 0; i < 8; i++) {
      setTimeout(() => spawnHeart(), i * 300);
    }

    // Continuous spawning
    setInterval(spawnHeart, 2500);
  }

  // ══════════════════════════════
  // 📅 Set Minimum Date
  // ══════════════════════════════
  function setMinDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
  }

  // ══════════════════════════════
  // ❌ No Button Behavior
  // ══════════════════════════════
  const noMessages = [
    '어? 어디 갔지...? 🤔',
    '다시 눌러봐~ 💦',
    '안 돼~! 💔',
  ];

  btnNo.addEventListener('click', (e) => {
    state.noClickCount++;

    if (state.noClickCount <= 3) {
      // Move to random position
      moveNoButton();

      // Shrink the button
      btnNo.className = 'btn btn-no';
      void btnNo.offsetWidth; // Force reflow
      btnNo.classList.add(`shrink-${state.noClickCount}`);

      // Show tooltip
      showNoTooltip(noMessages[state.noClickCount - 1]);

      if (state.noClickCount === 3) {
        // After third click, hide No and grow Yes
        setTimeout(() => {
          btnNo.style.display = 'none';
          btnYes.classList.add('super-big');
          showToast('이제 "응" 밖에 없어~ 💖');
        }, 600);
      }
    }
  });

  function moveNoButton() {
    const container = btnNo.parentElement;
    const containerRect = container.getBoundingClientRect();

    // Random offset within reasonable bounds
    const maxX = 100;
    const maxY = 60;
    const randomX = (Math.random() - 0.5) * maxX * 2;
    const randomY = (Math.random() - 0.5) * maxY * 2;

    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }

  function showNoTooltip(text) {
    // Remove existing tooltip
    const existing = document.querySelector('.no-tooltip');
    if (existing) existing.remove();

    const tooltip = document.createElement('div');
    tooltip.className = 'no-tooltip';
    tooltip.textContent = text;
    btnNo.parentElement.appendChild(tooltip);

    setTimeout(() => tooltip.remove(), 2500);
  }

  // ══════════════════════════════
  // ✅ Yes Button
  // ══════════════════════════════
  btnYes.addEventListener('click', () => {
    createConfettiBurst();
    showToast('좋아! 날짜를 골라줘~ 📅');
    setTimeout(() => {
      goToSection(2);
    }, 800);
  });

  // ══════════════════════════════
  // 🎊 Confetti Burst
  // ══════════════════════════════
  function createConfettiBurst() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff6b9d', '#c084fc', '#ff9ec4', '#818cf8', '#fb7185', '#fbbf24', '#34d399'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 5,
        size: Math.random() * 8 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.15,
        opacity: 1,
        shape: Math.random() > 0.5 ? 'circle' : 'rect',
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.012;
        p.vx *= 0.99;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          }
          ctx.restore();
        }
      });

      frame++;
      if (alive && frame < 200) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animate();
  }

  // ══════════════════════════════
  // 🎯 Activity Selection
  // ══════════════════════════════
  activityChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const activity = chip.dataset.activity;
      chip.classList.toggle('selected');

      if (chip.classList.contains('selected')) {
        state.selectedActivities.push(activity);
      } else {
        state.selectedActivities = state.selectedActivities.filter((a) => a !== activity);
      }

      updateNextButton();
    });
  });

  // ══════════════════════════════
  // 📝 Message Input
  // ══════════════════════════════
  messageInput.addEventListener('input', () => {
    state.message = messageInput.value;
    charCount.textContent = `${messageInput.value.length} / 500`;
  });

  // ══════════════════════════════
  // 🔄 Navigation
  // ══════════════════════════════
  function goToSection(sectionNum) {
    state.currentStep = sectionNum;
    sections.forEach((s) => s.classList.remove('active'));

    const target = $(`#section-${sectionNum}`);
    if (target) {
      target.classList.add('active');
      // Re-trigger animation
      target.style.animation = 'none';
      void target.offsetWidth;
      target.style.animation = '';
    }

    // Update progress
    updateProgress();
    updateStepIndicator();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateProgress() {
    const totalSteps = 4;
    const width = (state.currentStep / totalSteps) * 100;
    progressBar.style.width = width + '%';
  }

  function updateStepIndicator() {
    $$('.step-dot').forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i + 1 === state.currentStep) {
        dot.classList.add('active');
      } else if (i + 1 < state.currentStep) {
        dot.classList.add('done');
      }
    });
  }

  function updateNextButton() {
    const btnNext2 = $('#btn-next-2');
    if (btnNext2) {
      const hasDate = dateInput.value;
      const hasTime = timeInput.value;
      const hasActivity = state.selectedActivities.length > 0;
      btnNext2.disabled = !(hasDate && hasTime && hasActivity);
    }
  }

  // Date & time input listeners
  dateInput.addEventListener('change', updateNextButton);
  timeInput.addEventListener('change', updateNextButton);

  // ══════════════════════════════
  // 📋 Build Summary
  // ══════════════════════════════
  function buildSummary() {
    state.selectedDate = dateInput.value;
    state.selectedTime = timeInput.value;

    // Format date nicely
    const dateObj = new Date(state.selectedDate + 'T00:00:00');
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const formattedDate = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${dayNames[dateObj.getDay()]})`;

    // Format time
    const [hours, minutes] = state.selectedTime.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? '오후' : '오전';
    const hour12 = hour % 12 || 12;
    const formattedTime = `${ampm} ${hour12}시 ${minutes}분`;

    // Activity labels
    const activityMap = {
      'olive-young': '🛍️ 올리브영 쇼핑',
      'clothes': '👗 옷 쇼핑',
      'food': '🍽️ 맛있는 거 먹기',
      'movie': '🎬 영화 보기',
      'cafe': '☕ 카페 가기',
      'walk': '🚶‍♀️ 산책하기',
      'karaoke': '🎤 노래방',
      'photo': '📸 사진 찍기',
    };

    $('#summary-date').textContent = formattedDate;
    $('#summary-time').textContent = formattedTime;

    // Activities
    const activitiesContainer = $('#summary-activities');
    activitiesContainer.innerHTML = '';
    state.selectedActivities.forEach((act) => {
      const tag = document.createElement('span');
      tag.className = 'summary-tag';
      tag.textContent = activityMap[act] || act;
      activitiesContainer.appendChild(tag);
    });

    // Message
    const msgEl = $('#summary-message');
    msgEl.textContent = state.message || '(메시지 없음)';

    return { formattedDate, formattedTime, activityMap };
  }

  // ══════════════════════════════
  // 📧 Build Send Template
  // ══════════════════════════════
  function buildEmailTemplate() {
    const { formattedDate, formattedTime, activityMap } = buildSummary();

    const activitiesText = state.selectedActivities
      .map((a) => activityMap[a] || a)
      .join(', ');

    const subject = `💕 데이트 확정! - ${formattedDate}`;

    const body = `안녕~ 💖

데이트 확정되었어!

━━━━━━━━━━━━━━━━━

📅 날짜: ${formattedDate}
⏰ 시간: ${formattedTime}
🎯 하고 싶은 것: ${activitiesText}

💌 메시지:
${state.message || '(메시지 없음)'}

━━━━━━━━━━━━━━━━━

기대된다~ 빨리 만나자! 💕`;

    return { subject, body, formattedDate, formattedTime, activitiesText };
  }

  // ══════════════════════════════
  // 📤 Send Functions
  // ══════════════════════════════

  // Email via mailto
  window.sendEmail = () => {
    const { subject, body } = buildEmailTemplate();
    const mailto = `mailto:imkangt@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, '_blank');
    showToast('이메일 앱이 열렸어! 📧');
    setTimeout(() => goToSection(5), 1500);
  };

  // SMS
  window.sendSMS = () => {
    const { body } = buildEmailTemplate();
    // sms: URI scheme works on mobile
    const smsUri = `sms:?body=${encodeURIComponent(body)}`;
    window.open(smsUri, '_blank');
    showToast('문자 메시지 앱이 열렸어! 💬');
    setTimeout(() => goToSection(5), 1500);
  };

  // KakaoTalk share via Web Share API or clipboard
  window.sendKakao = () => {
    const { body } = buildEmailTemplate();

    // Try Kakao scheme first (mobile)
    if (navigator.userAgent.match(/Android|iPhone|iPad/i)) {
      // Try Web Share API
      if (navigator.share) {
        navigator.share({
          title: '💕 데이트 확인',
          text: body,
        }).then(() => {
          showToast('공유 완료! 💛');
          setTimeout(() => goToSection(5), 1500);
        }).catch(() => {
          copyToClipboard(body);
        });
        return;
      }
    }

    // Fallback: copy to clipboard
    copyToClipboard(body);
  };

  // Web Share API (general)
  window.shareGeneral = () => {
    const { body } = buildEmailTemplate();

    if (navigator.share) {
      navigator.share({
        title: '💕 데이트 확인',
        text: body,
      }).then(() => {
        showToast('공유 완료! ✨');
        setTimeout(() => goToSection(5), 1500);
      }).catch(() => {
        copyToClipboard(body);
      });
    } else {
      copyToClipboard(body);
    }
  };

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('클립보드에 복사됐어! 카카오톡에 붙여넣기 해줘~ 📋');
      setTimeout(() => goToSection(5), 2000);
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('클립보드에 복사됐어! 📋');
      setTimeout(() => goToSection(5), 2000);
    });
  }

  // ══════════════════════════════
  // 🔔 Toast Notification
  // ══════════════════════════════
  function showToast(message) {
    let toast = $('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // ══════════════════════════════
  // 🔗 Global Navigation Functions
  // ══════════════════════════════
  window.goToSection = goToSection;

  window.goToSummary = () => {
    buildSummary();
    goToSection(4);
  };

  window.restartApp = () => {
    // Reset state
    state.noClickCount = 0;
    state.selectedActivities = [];
    state.selectedDate = '';
    state.selectedTime = '';
    state.message = '';
    state.currentStep = 1;

    // Reset UI
    btnNo.style.display = '';
    btnNo.className = 'btn btn-no';
    btnNo.style.transform = '';
    btnYes.className = 'btn btn-yes';

    dateInput.value = '';
    timeInput.value = '';
    messageInput.value = '';
    charCount.textContent = '0 / 500';

    activityChips.forEach((c) => c.classList.remove('selected'));

    goToSection(1);
  };

  // Init first section
  goToSection(1);
});
