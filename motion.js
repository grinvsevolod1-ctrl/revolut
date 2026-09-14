/* Scroll choreography. All distances come from the actual viewport; no wheel hijacking.
 * The motion is reconstructed, not extracted from Revolut's private source code.
 * Edit the phase ranges below to change when each movement starts and finishes.
 */
(() => {
  const $ = selector => document.querySelector(selector);
  const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
  const mix = (a, b, p) => a + (b - a) * p;
  const smooth = p => p * p * (3 - 2 * p);
  const phase = (p, start, end) => smooth(clamp((p - start) / (end - start)));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = $('#home'), stage = $('.hero-stage'), tile = $('.account-tile');
  const intro = $('.hero-copy'), overlay = $('.tile-overlay'), salary = $('.salary-copy');
  const leftTile = $('.satellite-left'), rightTile = $('.satellite-right');
  const cardStory = $('#cards'), cardStage = $('.card-stage'), ring = $('.cards-ring');
  const viewport = $('.cards-viewport');
  const awards = $('.awards-track');
  const themes = [
    ['platinum', 'Platinum'], ['graphite', 'Black Metal'], ['gold', 'Gold'],
    ['lavender', 'Lavender'], ['sage', 'Sage Green'], ['rose', 'Rose Gold'], ['blue', 'Midnight Blue'],
  ];
  themes.forEach(([theme, label], index) => {
    const card = document.createElement('div');
    card.className = `payment-card ${theme}`;
    card.innerHTML = `<div class="payment-edge"></div><div class="payment-face payment-front"><span class="card-wordmark">Revolut</span><span class="card-chip"></span><span class="contactless">)))</span><span class="card-tier">${label}</span><span class="card-network ${index % 3 === 1 ? 'mastercard' : ''}">${index % 3 === 1 ? '' : 'VISA'}</span></div><div class="payment-face payment-back"><span class="magnetic-strip"></span><span class="back-lines"></span><span class="back-wordmark">Revolut</span><span class="card-tier" style="left:auto;right:20px">${label}</span></div>`;
    ring.append(card);
  });
  const paymentCards = [...ring.children];
  // Duplicate only presentation, leaving the original award list accessible.
  [...awards.children].forEach(item => {
    const copy = item.cloneNode(true);
    copy.dataset.clone = '';
    copy.setAttribute('aria-hidden', 'true');
    awards.append(copy);
  });

  let dimensions, frame = 0, manualRotation = 0;
  let dragStart = null;
  let lastMaterial = '';
  const bounds = el => ({ top: el.getBoundingClientRect().top + scrollY, height: el.offsetHeight });
  function measure() {
    dimensions = {
      width: innerWidth, height: innerHeight, mobile: innerWidth <= 760,
      hero: bounds(hero), stageHeight: stage.offsetHeight,
      cards: bounds(cardStory), cardHeight: cardStage.offsetHeight,
      social: bounds($('#customers')), savings: bounds($('#savings')),
      air: bounds($('#air')), security: bounds($('#security')), invest: bounds($('#invest')),
      closing: bounds($('.closing')),
    };
    const radius = dimensions.mobile ? Math.min(240, innerWidth * .53) : Math.min(405, innerWidth * .27);
    paymentCards.forEach((card, index) => {
      card.style.transform = `rotateY(${index * 360 / themes.length}deg) translateZ(${radius}px) rotateZ(-8deg)`;
    });
    requestDraw();
  }
  function heroFrame(y) {
    const d = dimensions;
    const p = clamp((y - d.hero.top) / Math.max(1, d.hero.height - d.stageHeight));
    hero.dataset.progress = p.toFixed(3);
    if (reduced.matches) {
      intro.inert = false;
      salary.inert = false;
      salary.classList.add('is-visible');
      return;
    }
    // The opening is deliberately measured in pixels, not a long viewport timeline.
    // A tiny native scroll opens the centered tile; scrolling back closes it.
    const travel = Math.max(0, y - d.hero.top);
    const opening = 1 - Math.pow(1 - clamp(travel / 48), 3);
    const shrink = phase(travel, 140, 310);
    const turn = phase(travel, 320, 390);
    const settle = phase(travel, 340, 480);
    const h = d.mobile ? Math.min(d.stageHeight * .41, 365) : Math.min(d.stageHeight * .59, 510);
    const w = h * 720 / 1016;
    const x = d.mobile ? 0 : d.width * .205 * settle;
    const compactH = d.mobile ? Math.min(245, d.stageHeight * .29) : Math.min(390, d.stageHeight * .44);
    const compactW = compactH * 720 / 1016;
    const offsetY = (d.mobile ? d.stageHeight * .19 * settle : 20 * settle) + (1 - opening) * (d.mobile ? d.stageHeight * .21 : 45);
    const width = mix(mix(compactW, d.width, opening), w, shrink);
    tile.style.width = `${width}px`;
    tile.style.height = `${mix(mix(compactH, d.stageHeight, opening), h, shrink)}px`;
    const rounded = Math.max(1 - opening, shrink);
    tile.style.borderRadius = `${25 * rounded}px`;
    tile.style.transform = `translate(-50%,-50%) translate3d(${x}px,${offsetY}px,0) rotateY(${-180 * turn}deg) rotateX(${Math.sin(turn * Math.PI) * 14}deg) rotateZ(${Math.sin(turn * Math.PI) * -11}deg)`;
    tile.style.boxShadow = `0 ${rounded * 30}px ${rounded * 85}px rgba(0,0,0,${rounded * .18})`;
    overlay.style.opacity = Math.max(1 - opening, phase(travel, 195, 300));
    hero.dataset.opening = opening.toFixed(3);
    hero.dataset.fullscreen = width >= d.width * .92 ? 'true' : 'false';
    intro.style.color = width >= d.width * .80 ? '#fff' : '#191c1f';
    const fade = 1 - phase(travel, 140, 210);
    intro.style.opacity = fade;
    intro.style.transform = `translateY(${-80 * (1 - fade)}px)`;
    intro.inert = fade < .08;
    $('.scroll-cue').style.opacity = fade;
    $('.scroll-cue').style.color = intro.style.color;
    const salaryFade = phase(travel, 390, 480);
    salary.style.opacity = salaryFade;
    salary.style.transform = `translateY(${d.mobile ? 24 * (1 - salaryFade) : -50 + 24 * (1 - salaryFade)}%)`;
    salary.classList.toggle('is-visible', salaryFade > .5);
    salary.inert = salaryFade < .5;
    const spread = phase(travel, 350, 470);
    [leftTile, rightTile].forEach((item, i) => {
      const direction = i ? 1 : -1;
      const distance = (d.mobile ? w * .47 : w * .52) * spread;
      item.style.width = `${w * .78}px`;
      item.style.height = `${h * .78}px`;
      item.style.opacity = spread;
      item.style.transform = `translate(-50%,-50%) translate3d(${x + direction * distance}px,${offsetY + 16}px,-90px) rotateY(${direction * -24}deg) rotateZ(${direction * 12 * spread}deg)`;
    });
  }
  function cardsFrame(y) {
    const d = dimensions;
    const p = clamp((y - d.cards.top) / Math.max(1, d.cards.height - d.cardHeight));
    cardStory.dataset.progress = p.toFixed(3);
    const rotation = (reduced.matches ? -12 : -p * 440 - 12) + manualRotation;
    const scale = d.mobile ? clamp((d.cardHeight - 360) / 540, .64, 1) : clamp((d.cardHeight - 410) / 470, .55, 1);
    ring.style.transform = `scale3d(${scale},${scale},${scale}) rotateX(${reduced.matches ? -12 : mix(-15, 12, p)}deg) rotateZ(${reduced.matches ? -7 : mix(-9, 9, p)}deg) rotateY(${rotation}deg)`;
    paymentCards.forEach((card, index) => {
      const angle = (rotation + index * 360 / themes.length) * Math.PI / 180;
      card.style.setProperty('--shine', `${Math.sin(angle) * 35}%`);
    });
    const index = ((Math.round(-rotation / (360 / themes.length)) % themes.length) + themes.length) % themes.length;
    if (lastMaterial !== themes[index][1]) {
      lastMaterial = themes[index][1];
      $('#card-material').textContent = lastMaterial;
    }
    if (!reduced.matches) {
      $('.wallet-phone').style.transform = `translate(-50%,-50%) rotateY(${mix(-20,20,p)}deg) rotateX(${mix(10,-5,p)}deg) scale(${d.mobile ? .92 : 1})`;
    }
  }
  function secondaryFrame(y) {
    const d = dimensions;
    if (!reduced.matches) {
      const socialP = clamp((y - d.social.top + d.height) / (d.social.height + d.height));
      awards.style.transform = `translateX(${-socialP * (d.mobile ? 410 : 580)}px)`;
      const savingsP = clamp((y - d.savings.top + d.height) / (d.savings.height + d.height));
      $('.savings-backgrounds').style.transform = `translateY(${mix(-25,25,savingsP)}px)`;
      const airP = phase(clamp((y - d.air.top + d.height) / d.height), .08, .85);
      $('.air-demo').style.setProperty('--reveal', airP);
      $('.air-orb').style.transform = `translateY(${mix(40,-10,airP)}px) rotate(${mix(-25,12,airP)}deg)`;
      $('.user-bubble').style.transform = `translateY(${35 * (1 - airP)}px)`;
      $('.assistant-bubble').style.transform = `translateY(${65 * (1 - airP)}px)`;
      const securityP = clamp((y - d.security.top + d.height) / (d.security.height + d.height));
      $('.security-art').style.transform = `rotateY(${mix(-16,20,securityP)}deg)`;
      $('.orbit-one').style.transform = `translate(-50%,-50%) rotateX(65deg) rotateY(${mix(-20,80,securityP)}deg)`;
      const investP = clamp((y - d.invest.top + d.height) / (d.invest.height + d.height));
      document.querySelectorAll('.stock').forEach((stock, i) => {
        const direction = i % 2 ? 1 : -1;
        stock.style.transform = `translateY(${mix(45,-45,investP) * direction}px) rotate(${mix(-10,10,investP) * direction}deg)`;
      });
    }
    const point = scrollY + 44;
    const inRange = rect => point >= rect.top && point < rect.top + rect.height;
    const heroDark = point < d.hero.top + d.hero.height && (reduced.matches ? point < 620 : hero.dataset.fullscreen === 'true');
    $('header').classList.toggle('on-light', !(heroDark || inRange(d.savings) || inRange(d.cards) || inRange(d.security) || inRange(d.closing)));
  }
  function draw() {
    frame = 0;
    // Follow the current input in this frame, with no inertial catch-up afterwards.
    const y = scrollY;
    heroFrame(y); cardsFrame(y); secondaryFrame(y);
  }
  function requestDraw() { if (!frame) frame = requestAnimationFrame(draw); }
  function rotate(direction) { manualRotation += direction * 360 / themes.length; requestDraw(); }
  document.querySelectorAll('[data-turn]').forEach(button => button.addEventListener('click', () => rotate(Number(button.dataset.turn))));
  viewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); rotate(event.key === 'ArrowLeft' ? -1 : 1); }
  });
  viewport.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    dragStart = { x: event.clientX, rotation: manualRotation };
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointermove', event => {
    if (!dragStart) return;
    manualRotation = dragStart.rotation + (event.clientX - dragStart.x) * .35;
    requestDraw();
  });
  const stopDrag = () => { dragStart = null; };
  viewport.addEventListener('pointerup', stopDrag);
  viewport.addEventListener('pointercancel', stopDrag);
  document.querySelectorAll('[data-card-mode]').forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.cardMode;
    cardStage.dataset.mode = mode;
    document.querySelectorAll('[data-card-mode]').forEach(item => { item.classList.toggle('selected', item === button); item.setAttribute('aria-pressed', item === button); });
    const virtual = mode === 'virtual';
    $('#cards-title').textContent = virtual ? 'Go virtual' : 'Elevate your spend';
    $('#cards-description').innerHTML = virtual ? 'Your next card is already in your pocket.<br>Make room for a lighter everyday.' : 'Everyday spending. Extraordinary possibilities.<br>Find a card that feels like you.';
    $('#cards-cta').textContent = virtual ? 'Create a card' : 'Start earning';
    viewport.inert = virtual;
    requestDraw();
  }));
  // A hash into the salary copy must land at the final pose, not inside its sticky parent.
  document.querySelectorAll('a[href="#salary"]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const top = reduced.matches ? 720 : dimensions.hero.top + dimensions.hero.height - dimensions.stageHeight;
    window.scrollTo({ top, behavior: reduced.matches ? 'instant' : 'smooth' });
    history.replaceState(null, '', '#salary');
  }));
  addEventListener('scroll', requestDraw, { passive: true });
  addEventListener('resize', measure, { passive: true });
  reduced.addEventListener('change', measure);
  document.fonts.ready.then(measure);
  measure();
})();
