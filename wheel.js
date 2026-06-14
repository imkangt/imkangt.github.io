// ---- Constants and Config ----
const PRIZES = [
    { name: "소원 하나 들어주기", prob: 0.05, color: "#fca5a5" },
    { name: "올리브영 같이 가기", prob: 1.0, color: "#fcd34d" },
    { name: "롯데마트 같이 가기", prob: 1.0, color: "#86efac" },
    { name: "맛있는 거 사주기", prob: 2.0, color: "#93c5fd" },
    { name: "밀크티 사주기", prob: 3.0, color: "#c4b5fd" },
    { name: "뽀뽀 한 번", prob: 5.0, color: "#f9a8d4" },
    { name: "안아주기", prob: 10.0, color: "#fdba74" },
    { name: "다음 기회에", prob: 77.95, color: "#d1d5db" }
];

const CODES = {
    "오빠 사랑해": 20,
    "오빠 보고 싶다": 10,
    "정소율": 2,
    "김강": 2,
    "강승한": 2,
    "소율이": 2
};

const DAILY_FREE_SPINS = 10;
const MAX_CODE_USE_PER_DAY = 2;

// ---- DOM Elements ----
const canvas = document.getElementById('wheel-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const spinBtn = document.getElementById('spin-btn');
const spinsLeftSpan = document.getElementById('spins-left');
const totalSpinsSpan = document.getElementById('total-spins');
const totalWinsSpan = document.getElementById('total-wins');

const secretCodeInput = document.getElementById('secret-code');
const submitCodeBtn = document.getElementById('submit-code');
const codeMessage = document.getElementById('code-message');

// ---- State Management ----
let currentRotation = 0;
let isSpinning = false;
let state = loadState();

function loadState() {
    const today = new Date().toDateString();
    let savedState = null;
    
    try {
        const raw = localStorage.getItem('luckyWheelState');
        if (raw) savedState = JSON.parse(raw);
    } catch (e) {
        console.error("localStorage read error:", e);
    }

    if (!savedState || savedState.lastDate !== today) {
        // New day or first time
        savedState = {
            lastDate: today,
            spinsLeft: DAILY_FREE_SPINS,
            totalSpins: savedState ? savedState.totalSpins : 0,
            totalWins: savedState ? savedState.totalWins : 0,
            codeUsages: {}
        };
        saveState(savedState);
    }
    return savedState;
}

function saveState(newState) {
    state = newState;
    try {
        localStorage.setItem('luckyWheelState', JSON.stringify(state));
    } catch (e) {
        console.error("localStorage write error:", e);
    }
    updateUI();
}

function updateUI() {
    if (spinsLeftSpan) spinsLeftSpan.textContent = state.spinsLeft;
    if (totalSpinsSpan) totalSpinsSpan.textContent = state.totalSpins;
    if (totalWinsSpan) totalWinsSpan.textContent = state.totalWins;
    if (spinBtn) spinBtn.disabled = state.spinsLeft <= 0 || isSpinning;
}

// ---- Canvas Drawing (High-DPI support) ----
function setupCanvasHiDPI() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const displaySize = 310;
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    ctx.scale(dpr, dpr);
}

function drawWheel() {
    if (!ctx) return;
    const displaySize = 310;
    const numSectors = PRIZES.length;
    const arc = (2 * Math.PI) / numSectors;
    const centerX = displaySize / 2;
    const centerY = displaySize / 2;
    const radius = (displaySize / 2) - 5;

    ctx.clearRect(0, 0, displaySize, displaySize);

    for (let i = 0; i < numSectors; i++) {
        const angle = i * arc;
        
        // Draw sector
        ctx.beginPath();
        ctx.fillStyle = PRIZES[i].color;
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arc);
        ctx.lineTo(centerX, centerY);
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(
            centerX + Math.cos(angle + arc / 2) * (radius * 0.7),
            centerY + Math.sin(angle + arc / 2) * (radius * 0.7)
        );
        ctx.rotate(angle + arc / 2);
        
        ctx.fillStyle = "#333";
        ctx.font = "bold 14px 'Quicksand', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Handle long text wrapping
        let text = PRIZES[i].name;
        if (text.length > 7) {
            const parts = text.split(' ');
            if (parts.length > 1) {
                const mid = Math.floor(parts.length / 2);
                ctx.fillText(parts.slice(0, mid).join(' '), 0, -8);
                ctx.fillText(parts.slice(mid).join(' '), 0, 8);
            } else {
                ctx.font = "bold 11px 'Quicksand', sans-serif";
                ctx.fillText(text, 0, 0);
            }
        } else {
            ctx.fillText(text, 0, 0);
        }
        
        ctx.restore();
    }
}

// ---- Spinning Logic ----
function getRandomPrizeIndex() {
    const rand = Math.random() * 100;
    let cumulative = 0;
    for (let i = 0; i < PRIZES.length; i++) {
        cumulative += PRIZES[i].prob;
        if (rand <= cumulative) {
            return i;
        }
    }
    return PRIZES.length - 1; // Fallback
}

if (spinBtn) {
    spinBtn.addEventListener('click', () => {
        if (state.spinsLeft <= 0 || isSpinning) return;

        state.spinsLeft--;
        state.totalSpins++;
        saveState(state);

        isSpinning = true;
        spinBtn.disabled = true;

        const targetIndex = getRandomPrizeIndex();
        const numSectors = PRIZES.length;
        const arcDegrees = 360 / numSectors;
        
        const sectorMiddleAngle = targetIndex * arcDegrees + (arcDegrees / 2);
        const offset = (Math.random() - 0.5) * (arcDegrees * 0.8); 
        const baseTargetRotation = 270 - (sectorMiddleAngle + offset);
        const spins = 5 * 360; 
        
        const normalizedTarget = (baseTargetRotation % 360 + 360) % 360;
        const currentMod = currentRotation % 360;
        
        let rotationDiff = normalizedTarget - currentMod;
        if (rotationDiff < 0) {
            rotationDiff += 360; 
        }
        
        const finalRotation = currentRotation + spins + rotationDiff;
        
        canvas.style.transform = `rotate(${finalRotation}deg)`;
        currentRotation = finalRotation;

        setTimeout(() => {
            isSpinning = false;
            handleResult(targetIndex);
        }, 4000); 
    });
}

function handleResult(index) {
    const prize = PRIZES[index];
    const isWin = index !== (PRIZES.length - 1);

    if (isWin) {
        state.totalWins++;
        saveState(state);
        fireConfetti();
        
        if (window.Swal) {
            Swal.fire({
                title: '🎉 축하합니다! 🎉',
                html: `<strong>${prize.name}</strong> 당첨!`,
                icon: 'success',
                confirmButtonText: '확인',
                confirmButtonColor: '#f472b6'
            });
        } else {
            alert(`🎉 축하합니다! 🎉\n${prize.name} 당첨!`);
        }
    } else {
        if (window.Swal) {
            Swal.fire({
                title: '아쉽네요 😢',
                text: prize.name,
                icon: 'error',
                confirmButtonText: '확인',
                confirmButtonColor: '#9d174d'
            });
        } else {
            alert(`아쉽네요 😢\n${prize.name}`);
        }
    }
    
    updateUI(); 
}

// ---- Secret Code Logic ----
if (submitCodeBtn && secretCodeInput) {
    submitCodeBtn.addEventListener('click', () => {
        const code = secretCodeInput.value.trim();
        if (!code) return;

        if (CODES[code]) {
            const currentUses = state.codeUsages[code] || 0;
            if (currentUses >= MAX_CODE_USE_PER_DAY) {
                showMessage(`이 코드는 오늘 이미 ${MAX_CODE_USE_PER_DAY}번 모두 사용했습니다. 내일 다시 시도하세요!`, 'error');
            } else {
                const bonus = CODES[code];
                state.spinsLeft += bonus;
                state.codeUsages[code] = currentUses + 1;
                saveState(state);
                
                showMessage(`성공! ${bonus}회의 룰렛 기회가 추가되었습니다! 🎉`, 'success');
                secretCodeInput.value = '';
                fireConfettiSmall();
            }
        } else {
            showMessage('유효하지 않은 코드입니다.', 'error');
        }
    });
}

function showMessage(msg, type) {
    if (!codeMessage) return;
    codeMessage.textContent = msg;
    codeMessage.className = `code-message ${type}`;
    setTimeout(() => {
        codeMessage.textContent = '';
    }, 4000);
}

// ---- Confetti Effects ----
function fireConfetti() {
    if (typeof confetti !== 'function') return;
    const count = 200;
    const defaults = { origin: { y: 0.7 }, zIndex: 1000 };

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

function fireConfettiSmall() {
    if (typeof confetti !== 'function') return;
    confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f472b6', '#fbcfe8', '#db2777']
    });
}

// ---- Init ----
setupCanvasHiDPI();
drawWheel();
updateUI();
