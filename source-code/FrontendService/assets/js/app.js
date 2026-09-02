/**
 * SMARTIFY TECH — GAMIFIED CYBERPUNK CLIENT CONTROLLER
 * Audio Engine, XP Toast Notifications, Loadout Sync, Flash Countdowns, & Checkout Stepper
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. CYBER AUDIO ENGINE (Web Audio API Synthesizer)
  // =========================================================================
  class CyberAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = localStorage.getItem('smartify_sfx_muted') === 'true';
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem('smartify_sfx_muted', this.isMuted ? 'true' : 'false');
      this.updateBtnUI();
      if (!this.isMuted) {
        this.playBeep(880, 0.1);
      }
    }

    updateBtnUI() {
      const btn = document.getElementById('audioToggleBtn');
      if (btn) {
        btn.innerHTML = this.isMuted ? '🔇 SFX OFF' : '🔊 SFX ON';
        btn.style.borderColor = this.isMuted ? '#64748b' : '#00f0ff';
        btn.style.color = this.isMuted ? '#94a3b8' : '#00f0ff';
      }
    }

    playBeep(freq = 600, duration = 0.08, type = 'sine') {
      if (this.isMuted) return;
      try {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playItemAcquired() {
      if (this.isMuted) return;
      try {
        this.init();
        const now = this.ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
        freqs.forEach((f, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + (i * 0.06));
          gain.gain.setValueAtTime(0.2, now + (i * 0.06));
          gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.06) + 0.15);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + (i * 0.06));
          osc.stop(now + (i * 0.06) + 0.16);
        });
      } catch (e) {}
    }

    playLevelUp() {
      if (this.isMuted) return;
      try {
        this.init();
        const now = this.ctx.currentTime;
        const chords = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
        chords.forEach((f, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f, now + (i * 0.07));
          gain.gain.setValueAtTime(0.15, now + (i * 0.07));
          gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.07) + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + (i * 0.07));
          osc.stop(now + (i * 0.07) + 0.32);
        });
      } catch (e) {}
    }
  }

  const audio = new CyberAudioEngine();
  window.cyberAudio = audio;

  // =========================================================================
  // 2. XP & LOADOUT FLOATING TOAST NOTIFICATIONS
  // =========================================================================
  function showXPToast(title, message, xp = 50) {
    let container = document.getElementById('xpToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'xpToastContainer';
      container.className = 'xp-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'xp-toast';
    toast.innerHTML = `
      <div class="toast-icon">⚡</div>
      <div class="toast-body">
        <h4>+ ITEM ACQUIRED // XP +${xp}</h4>
        <p><strong>${title}</strong> added to Loadout!</p>
      </div>
    `;

    container.appendChild(toast);
    audio.playItemAcquired();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }

  window.showXPToast = showXPToast;

  // =========================================================================
  // 3. ADD TO LOADOUT (AJAX / Form Handling)
  // =========================================================================
  function initLoadoutButtons() {
    document.querySelectorAll('.btn-add-loadout, .btn-add-detail-loadout').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const productId = this.getAttribute('data-product-id');
        const productTitle = this.getAttribute('data-product-title') || 'Gaming Gear';
        const qtyInput = document.getElementById('detailQtyInput');
        const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

        if (!productId) return;

        // Perform AJAX request to update session loadout
        const formData = new FormData();
        formData.append('action', 'add');
        formData.append('product_id', productId);
        formData.append('quantity', qty);

        fetch('ajax/loadout.php', {
          method: 'POST',
          body: formData
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              // Update badge counter
              const badge = document.querySelector('.loadout-counter-badge');
              if (badge) badge.textContent = data.total_items;

              // Update loadout price display if present
              const navPrice = document.querySelector('.loadout-nav-price');
              if (navPrice) navPrice.textContent = data.formatted_total;

              // Show gamified toast
              showXPToast(productTitle, 'Loadout Updated', 50 * qty);
            }
          })
          .catch(err => {
            // Fallback redirect if ajax fails
            window.location.href = `cart.php?action=add&id=${productId}&qty=${qty}`;
          });
      });
    });
  }

  // =========================================================================
  // 4. REAL-TIME FLASH DEALS COUNTDOWN TIMER
  // =========================================================================
  function initFlashCountdown() {
    const hoursEl = document.getElementById('flashHours');
    const minsEl = document.getElementById('flashMins');
    const secsEl = document.getElementById('flashSecs');

    if (!hoursEl || !minsEl || !secsEl) return;

    // Set countdown for next 6-hour cycle
    let remainingSeconds = (2 * 3600) + (14 * 60) + 36;

    const timer = setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds < 0) remainingSeconds = 6 * 3600;

      const h = Math.floor(remainingSeconds / 3600);
      const m = Math.floor((remainingSeconds % 3600) / 60);
      const s = remainingSeconds % 60;

      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent = String(m).padStart(2, '0');
      secsEl.textContent = String(s).padStart(2, '0');
    }, 1000);
  }

  // =========================================================================
  // 5. SYSTEM ONLINE INTRO MODAL SEQUENCE
  // =========================================================================
  function initIntroModal() {
    const modal = document.getElementById('systemIntroModal');
    if (!modal) return;

    const hasSeenIntro = localStorage.getItem('smartify_intro_seen');
    if (hasSeenIntro) {
      modal.style.display = 'none';
      return;
    }

    const startBtn = document.getElementById('btnStartMission');
    const skipBtn = document.getElementById('btnSkipIntro');
    const terminalText = document.getElementById('introTerminalOutput');

    let step = 0;
    const lines = [
      '⚡ SMARTIFY TECH // SYSTEM BOOT v2.6',
      'INITIALIZING QUANTUM ENCRYPTION...',
      'PLAYER 01 READY TO DEPLOY...',
      'LEVEL UP YOUR GEAR // 3... 2... 1... 🚀'
    ];

    const typeInterval = setInterval(() => {
      if (step < lines.length && terminalText) {
        terminalText.innerHTML += `<div>> ${lines[step]}</div>`;
        audio.playBeep(400 + (step * 200), 0.05);
        step++;
      } else {
        clearInterval(typeInterval);
      }
    }, 500);

    const closeIntro = () => {
      localStorage.setItem('smartify_intro_seen', 'true');
      modal.style.opacity = '0';
      modal.style.transition = 'opacity 0.4s ease';
      setTimeout(() => modal.remove(), 400);
      audio.playLevelUp();
    };

    if (startBtn) startBtn.addEventListener('click', closeIntro);
    if (skipBtn) skipBtn.addEventListener('click', closeIntro);
  }

  // =========================================================================
  // 6. CHECKOUT QUEST STEPPER (4-Step Frictionless Flow)
  // =========================================================================
  function initCheckoutQuest() {
    const stepperItems = document.querySelectorAll('.step-indicator-item');
    const stepPanes = document.querySelectorAll('.checkout-step-pane');
    const nextButtons = document.querySelectorAll('.btn-next-step');
    const prevButtons = document.querySelectorAll('.btn-prev-step');

    if (!stepperItems.length || !stepPanes.length) return;

    let currentStep = 1;

    function goToStep(stepNum) {
      if (stepNum < 1 || stepNum > 4) return;
      currentStep = stepNum;

      // Update panes
      stepPanes.forEach(pane => {
        const paneStep = parseInt(pane.getAttribute('data-step'), 10);
        if (paneStep === currentStep) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });

      // Update indicators
      stepperItems.forEach(item => {
        const itemStep = parseInt(item.getAttribute('data-step'), 10);
        if (itemStep === currentStep) {
          item.classList.add('active');
          item.classList.remove('completed');
        } else if (itemStep < currentStep) {
          item.classList.remove('active');
          item.classList.add('completed');
        } else {
          item.classList.remove('active', 'completed');
        }
      });

      audio.playBeep(600 + (currentStep * 100), 0.08);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }

    nextButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const targetStep = parseInt(this.getAttribute('data-next'), 10);
        // Validate required inputs in current pane
        const currentPane = document.querySelector(`.checkout-step-pane[data-step="${currentStep}"]`);
        if (currentPane) {
          const requiredInputs = currentPane.querySelectorAll('input[required], select[required]');
          let valid = true;
          requiredInputs.forEach(input => {
            if (!input.value.trim()) {
              valid = false;
              input.style.borderColor = '#ff0055';
              input.focus();
            } else {
              input.style.borderColor = '#1f1d3d';
            }
          });
          if (!valid) return;
        }

        goToStep(targetStep);
      });
    });

    prevButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const targetStep = parseInt(this.getAttribute('data-prev'), 10);
        goToStep(targetStep);
      });
    });

    // Payment Option Selectors
    document.querySelectorAll('.payment-option-card').forEach(card => {
      card.addEventListener('click', function () {
        document.querySelectorAll('.payment-option-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        const radio = this.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        audio.playBeep(750, 0.05);
      });
    });
  }

  // =========================================================================
  // 7. INITIALIZE ALL COMPONENTS ON DOM READY
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // Audio toggle button
    const audioBtn = document.getElementById('audioToggleBtn');
    if (audioBtn) {
      audio.updateBtnUI();
      audioBtn.addEventListener('click', () => audio.toggleMute());
    }

    // Interactive button audio effects
    document.querySelectorAll('.btn-cyber, .category-card, .product-card').forEach(el => {
      el.addEventListener('mouseenter', () => audio.playBeep(500, 0.03));
    });

    initLoadoutButtons();
    initFlashCountdown();
    initIntroModal();
    initCheckoutQuest();
  });

})();
