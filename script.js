(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function svgEl(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) { el.setAttribute(k, attrs[k]); }
    return el;
  }

  /* =========================================================
     FLOWER FACTORY
     every call returns a fresh {svg, w, h} — no two identical
     ========================================================= */

  function makeTulip(color) {
    var petalGrad = color === 'pink' ? 'url(#gradPetalPink)' : 'url(#gradPetalWhite)';
    var vb = { w: 120, h: 205 };
    var svg = svgEl('svg', { viewBox: '0 0 ' + vb.w + ' ' + vb.h });
    var jitter = function () { return rand(-3, 3); };
    var curve = rand(-6, 6);

    svg.appendChild(svgEl('path', {
      d: 'M60,118 C' + (56 + curve) + ',150 ' + (64 - curve) + ',180 60,198',
      fill: 'none', stroke: 'url(#gradLeaf)', 'stroke-width': 5, 'stroke-linecap': 'round'
    }));
    svg.appendChild(svgEl('path', {
      d: 'M60,148 C34,144 18,162 12,186 C38,188 56,176 60,148 Z',
      fill: 'url(#gradLeaf)', transform: 'rotate(' + jitter() + ' 60 148)'
    }));
    svg.appendChild(svgEl('path', {
      d: 'M60,166 C88,158 106,174 112,196 C86,200 64,188 60,166 Z',
      fill: 'url(#gradLeaf)', transform: 'rotate(' + jitter() + ' 60 166)'
    }));

    var backD = 'M60,120 C42,120 36,92 42,64 C46,44 54,30 60,22 C66,30 74,44 78,64 C84,92 78,120 60,120 Z';
    [-24, 24].forEach(function (a) {
      svg.appendChild(svgEl('path', {
        d: backD, fill: petalGrad, opacity: '0.96',
        transform: 'rotate(' + (a + jitter() * 0.4) + ' 60 120)'
      }));
    });
    var frontD = 'M60,120 C44,118 38,90 44,60 C48,40 55,27 60,19 C65,27 72,40 76,60 C82,90 76,118 60,118 Z';
    [-11, 11, 0].forEach(function (a) {
      svg.appendChild(svgEl('path', {
        d: frontD, fill: petalGrad,
        transform: 'rotate(' + (a + jitter() * 0.4) + ' 60 120)'
      }));
    });

    svg.appendChild(svgEl('ellipse', { cx: 60, cy: 120, rx: 14, ry: 6, fill: 'rgba(80,30,55,.18)' }));
    svg.appendChild(svgEl('path', {
      d: 'M58,100 C56,82 58,56 62,36', fill: 'none', stroke: 'rgba(255,255,255,.55)',
      'stroke-width': 3, 'stroke-linecap': 'round', opacity: '.6'
    }));

    return { svg: svg, w: vb.w, h: vb.h };
  }

  function makeDaisy() {
    var vb = { w: 200, h: 230 };
    var svg = svgEl('svg', { viewBox: '0 0 ' + vb.w + ' ' + vb.h });
    var cx = 100, cy = 92;

    svg.appendChild(svgEl('path', {
      d: 'M' + cx + ',' + (cy + 20) + ' C' + (cx - 4 + rand(-4, 4)) + ',' + (cy + 58) + ' ' + (cx + 4 + rand(-4, 4)) + ',' + (cy + 96) + ' ' + cx + ',' + (cy + 132),
      fill: 'none', stroke: 'url(#gradLeaf)', 'stroke-width': 5, 'stroke-linecap': 'round'
    }));
    svg.appendChild(svgEl('path', {
      d: 'M' + cx + ',' + (cy + 50) + ' C' + (cx - 28) + ',' + (cy + 46) + ' ' + (cx - 44) + ',' + (cy + 64) + ' ' + (cx - 50) + ',' + (cy + 88) + ' C' + (cx - 24) + ',' + (cy + 90) + ' ' + (cx - 6) + ',' + (cy + 78) + ' ' + cx + ',' + (cy + 50) + ' Z',
      fill: 'url(#gradLeaf)'
    }));
    svg.appendChild(svgEl('path', {
      d: 'M' + cx + ',' + (cy + 70) + ' C' + (cx + 28) + ',' + (cy + 62) + ' ' + (cx + 46) + ',' + (cy + 80) + ' ' + (cx + 52) + ',' + (cy + 104) + ' C' + (cx + 26) + ',' + (cy + 108) + ' ' + (cx + 4) + ',' + (cy + 96) + ' ' + cx + ',' + (cy + 70) + ' Z',
      fill: 'url(#gradLeaf)'
    }));

    svg.appendChild(svgEl('ellipse', { cx: cx, cy: cy + 2, rx: 34, ry: 10, fill: 'rgba(80,30,55,.10)' }));

    var back = svgEl('g', { transform: 'translate(' + cx + ',' + cy + ')' });
    for (var i = 0; i < 12; i++) {
      var ry = rand(27, 33), rx = rand(9, 12);
      back.appendChild(svgEl('ellipse', {
        cx: 0, cy: -(ry * 0.62) - 10, rx: rx, ry: ry,
        fill: 'url(#gradPetalWhite)', opacity: '0.95',
        transform: 'rotate(' + (i * 30 + rand(-4, 4)) + ')'
      }));
    }
    svg.appendChild(back);

    var front = svgEl('g', { transform: 'translate(' + cx + ',' + cy + ')' });
    for (var j = 0; j < 12; j++) {
      var ry2 = rand(20, 25), rx2 = rand(7, 9.5);
      front.appendChild(svgEl('ellipse', {
        cx: 0, cy: -(ry2 * 0.6) - 9, rx: rx2, ry: ry2,
        fill: 'url(#gradPetalWhite)',
        transform: 'rotate(' + (j * 30 + 15 + rand(-4, 4)) + ')'
      }));
    }
    svg.appendChild(front);

    svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: 20, fill: 'url(#gradCenterGold)' }));
    svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: 20, fill: 'none', stroke: 'rgba(150,100,20,.25)', 'stroke-width': 1.5 }));
    for (var s = 0; s < 7; s++) {
      var a = rand(0, Math.PI * 2), r = rand(2, 14);
      svg.appendChild(svgEl('circle', {
        cx: cx + Math.cos(a) * r, cy: cy + Math.sin(a) * r, r: rand(.8, 1.6),
        fill: 'rgba(150,95,15,.4)'
      }));
    }

    return { svg: svg, w: vb.w, h: vb.h };
  }

  function makeCherryBlossom() {
    var vb = { w: 140, h: 170 };
    var svg = svgEl('svg', { viewBox: '0 0 ' + vb.w + ' ' + vb.h });
    var cx = 70, cy = 72;

    svg.appendChild(svgEl('path', {
      d: 'M' + cx + ',' + (cy + 26) + ' C' + (cx - 6) + ',' + (cy + 66) + ' ' + (cx + 8) + ',' + (cy + 106) + ' ' + cx + ',' + (cy + 134),
      fill: 'none', stroke: 'url(#gradLeaf)', 'stroke-width': 4, 'stroke-linecap': 'round'
    }));
    svg.appendChild(svgEl('path', {
      d: 'M' + cx + ',' + (cy + 58) + ' C' + (cx - 22) + ',' + (cy + 54) + ' ' + (cx - 34) + ',' + (cy + 68) + ' ' + (cx - 38) + ',' + (cy + 88) + ' C' + (cx - 18) + ',' + (cy + 90) + ' ' + (cx - 4) + ',' + (cy + 80) + ' ' + cx + ',' + (cy + 58) + ' Z',
      fill: 'url(#gradLeaf)'
    }));

    svg.appendChild(svgEl('ellipse', { cx: cx, cy: cy + 2, rx: 24, ry: 7, fill: 'rgba(80,30,55,.08)' }));

    var petalD = 'M0,0 C-10,-6 -12,-16 -8,-22 L-4,-24 Q0,-20 4,-24 L8,-22 C12,-16 10,-6 0,0 Z';
    var group = svgEl('g', { transform: 'translate(' + cx + ',' + cy + ')' });
    for (var i = 0; i < 5; i++) {
      group.appendChild(svgEl('path', {
        d: petalD, fill: 'url(#gradPetalRose)',
        transform: 'rotate(' + (i * 72 + rand(-5, 5)) + ')'
      }));
    }
    svg.appendChild(group);

    for (var k = 0; k < 6; k++) {
      var a = (k / 6) * Math.PI * 2;
      svg.appendChild(svgEl('line', {
        x1: cx, y1: cy, x2: cx + Math.cos(a) * 7, y2: cy + Math.sin(a) * 7,
        stroke: 'rgba(214,51,108,.7)', 'stroke-width': 1.2, 'stroke-linecap': 'round'
      }));
    }
    svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: 3.2, fill: 'url(#gradCenterGold)' }));

    return { svg: svg, w: vb.w, h: vb.h };
  }

  function makeRanunculus() {
    var vb = { w: 150, h: 190 };
    var svg = svgEl('svg', { viewBox: '0 0 ' + vb.w + ' ' + vb.h });
    var cx = 75, cy = 78;

    svg.appendChild(svgEl('path', {
      d: 'M' + cx + ',' + (cy + 36) + ' C' + (cx - 5) + ',' + (cy + 72) + ' ' + (cx + 5) + ',' + (cy + 110) + ' ' + cx + ',' + (cy + 146),
      fill: 'none', stroke: 'url(#gradLeaf)', 'stroke-width': 5, 'stroke-linecap': 'round'
    }));
    svg.appendChild(svgEl('path', {
      d: 'M' + cx + ',' + (cy + 66) + ' C' + (cx - 26) + ',' + (cy + 60) + ' ' + (cx - 40) + ',' + (cy + 76) + ' ' + (cx - 46) + ',' + (cy + 98) + ' C' + (cx - 22) + ',' + (cy + 100) + ' ' + (cx - 4) + ',' + (cy + 90) + ' ' + cx + ',' + (cy + 66) + ' Z',
      fill: 'url(#gradLeaf)'
    }));

    svg.appendChild(svgEl('ellipse', { cx: cx, cy: cy + 6, rx: 30, ry: 9, fill: 'rgba(80,30,55,.1)' }));

    var petalUnit = 'M0,0 C-7,-4 -8,-12 -2,-15 C-1,-15.6 1,-15.6 2,-15 C8,-12 7,-4 0,0 Z';
    var rings = [
      { count: 8, distance: 7, scale: 0.55, grad: 'url(#gradPetalWhite)' },
      { count: 11, distance: 14, scale: 0.85, grad: 'url(#gradPetalPink)' },
      { count: 14, distance: 21, scale: 1.1, grad: 'url(#gradPetalRose)' }
    ];
    var group = svgEl('g', { transform: 'translate(' + cx + ',' + cy + ')' });
    rings.forEach(function (ring, ri) {
      for (var i = 0; i < ring.count; i++) {
        var angle = (i / ring.count) * 360 + ri * 9 + rand(-4, 4);
        group.appendChild(svgEl('path', {
          d: petalUnit, fill: ring.grad,
          transform: 'rotate(' + angle + ') translate(0,' + (-ring.distance) + ') scale(' + ring.scale + ')'
        }));
      }
    });
    svg.appendChild(group);
    svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: 4.5, fill: 'rgba(120,60,40,.55)' }));

    return { svg: svg, w: vb.w, h: vb.h };
  }

  function makeWildflower(color) {
    var vb = { w: 60, h: 80 };
    var svg = svgEl('svg', { viewBox: '0 0 ' + vb.w + ' ' + vb.h });
    var cx = 30, cy = 30;
    svg.appendChild(svgEl('path', {
      d: 'M' + cx + ',' + (cy + 8) + ' C' + (cx - 3) + ',' + (cy + 28) + ' ' + (cx + 3) + ',' + (cy + 50) + ' ' + cx + ',' + (cy + 78),
      fill: 'none', stroke: 'url(#gradLeaf)', 'stroke-width': 2.4, 'stroke-linecap': 'round'
    }));
    var grad = color === 'rose' ? 'url(#gradPetalRose)' : (color === 'pink' ? 'url(#gradPetalPink)' : 'url(#gradPetalWhite)');
    var petalUnit = 'M0,0 C-4,-3 -4,-9 0,-12 C4,-9 4,-3 0,0 Z';
    var group = svgEl('g', { transform: 'translate(' + cx + ',' + cy + ')' });
    var count = 6;
    for (var i = 0; i < count; i++) {
      group.appendChild(svgEl('path', {
        d: petalUnit, fill: grad,
        transform: 'rotate(' + ((i / count) * 360 + rand(-6, 6)) + ')'
      }));
    }
    svg.appendChild(group);
    svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r: 3.4, fill: 'url(#gradCenterGold)' }));
    return { svg: svg, w: vb.w, h: vb.h };
  }

  function makeGrass() {
    var vb = { w: 60, h: 70 };
    var svg = svgEl('svg', { viewBox: '0 0 ' + vb.w + ' ' + vb.h });
    var blades = 4;
    for (var i = 0; i < blades; i++) {
      var x = 12 + i * 10 + rand(-3, 3);
      var lean = rand(-14, 14);
      var h = rand(38, 64);
      svg.appendChild(svgEl('path', {
        d: 'M' + x + ',70 C' + (x + lean * 0.3) + ',' + (70 - h * 0.5) + ' ' + (x + lean) + ',' + (70 - h * 0.85) + ' ' + (x + lean * 1.3) + ',' + (70 - h),
        fill: 'none', stroke: 'url(#gradLeaf)', 'stroke-width': 3, 'stroke-linecap': 'round',
        opacity: (0.75 + i * 0.06).toFixed(2)
      }));
    }
    return { svg: svg, w: vb.w, h: vb.h };
  }

  function buildFlower(type) {
    switch (type) {
      case 'tulip-white': return makeTulip('white');
      case 'tulip-pink': return makeTulip('pink');
      case 'daisy': return makeDaisy();
      case 'cherry': return makeCherryBlossom();
      case 'ranunculus': return makeRanunculus();
      case 'wildflower': return makeWildflower(pick(['white', 'pink', 'rose']));
      case 'grass': return makeGrass();
      default: return makeTulip('white');
    }
  }

  var WEIGHTED_TYPES = [
    'tulip-white', 'tulip-white', 'tulip-white',
    'daisy', 'daisy', 'daisy',
    'tulip-pink', 'tulip-pink',
    'cherry', 'ranunculus', 'wildflower'
  ];
  function weightedType() { return pick(WEIGHTED_TYPES); }

  /* =========================================================
     PLACEMENT
     ========================================================= */

  function placeItem(container, x, y, type, opts) {
    opts = opts || {};
    var built = buildFlower(type);
    built.svg.setAttribute('class', 'flower-instance');
    built.svg.style.setProperty('--sway-dur', rand(4.5, 7.5).toFixed(2) + 's');
    built.svg.style.setProperty('--sway-delay', (-rand(0, 6)).toFixed(2) + 's');
    built.svg.style.setProperty('--base-rot', rand(-6, 6).toFixed(1) + 'deg');

    var wrap = document.createElement('div');
    wrap.className = 'meadow-item' + (opts.hazy ? ' is-hazy' : '') + (opts.settled ? ' is-settled' : '');
    wrap.style.left = x + '%';
    wrap.style.top = y + '%';
    wrap.style.width = (opts.width || 70) + 'px';

    var mask = document.createElement('div');
    mask.className = 'grow-mask';
    mask.appendChild(built.svg);
    wrap.appendChild(mask);

    container.appendChild(wrap);
    return wrap;
  }

  function spawnAmbientSparkle(container, x, y) {
    var el = document.createElement('div');
    el.className = 'ambient-sparkle';
    el.style.left = x + '%';
    el.style.top = y + '%';
    el.style.setProperty('--twinkle-delay', rand(0, 4).toFixed(2) + 's');
    container.appendChild(el);
  }

  function scatterMeadow() {
    var far = document.getElementById('meadowFar');
    var mid = document.getElementById('meadowMid');
    var near = document.getElementById('meadowNear');

    var farCount = reduceMotion ? 8 : 11;
    for (var i = 0; i < farCount; i++) {
      var t1 = Math.random() < 0.25 ? 'grass' : weightedType();
      placeItem(far, rand(2, 98), rand(8, 42), t1, { width: rand(34, 52), settled: true });
    }

    var midCount = reduceMotion ? 10 : 15;
    for (var j = 0; j < midCount; j++) {
      if (Math.random() < 0.12) {
        spawnAmbientSparkle(mid, rand(5, 95), rand(20, 60));
        continue;
      }
      var t2 = Math.random() < 0.2 ? 'grass' : weightedType();
      placeItem(mid, rand(2, 98), rand(30, 68), t2, { width: rand(52, 78), settled: true });
    }

    var nearCount = reduceMotion ? 12 : 17;
    for (var k = 0; k < nearCount; k++) {
      var t3 = Math.random() < 0.15 ? 'grass' : weightedType();
      placeItem(near, rand(0, 100), rand(62, 100), t3, {
        width: rand(78, 128), settled: true, hazy: Math.random() < 0.14
      });
    }
  }

  function scatterHero() {
    var container = document.getElementById('heroFlowers');
    var count = reduceMotion ? 4 : 6;
    var types = ['tulip-white', 'daisy', 'tulip-pink', 'wildflower'];
    for (var i = 0; i < count; i++) {
      var built = buildFlower(pick(types));
      built.svg.setAttribute('class', 'flower-instance');
      built.svg.style.setProperty('--sway-dur', rand(5, 8).toFixed(2) + 's');
      built.svg.style.setProperty('--sway-delay', (-rand(0, 6)).toFixed(2) + 's');
      built.svg.style.setProperty('--base-rot', rand(-5, 5).toFixed(1) + 'deg');

      var wrap = document.createElement('div');
      wrap.className = 'meadow-item';
      var x = 8 + (i / (count - 1)) * 84 + rand(-4, 4);
      wrap.style.left = x + '%';
      wrap.style.bottom = '0';
      wrap.style.top = 'auto';
      wrap.style.transform = 'translate(-50%,0)';
      wrap.style.width = rand(64, 108) + 'px';
      wrap.appendChild(built.svg);
      container.appendChild(wrap);
    }
  }

  /* =========================================================
     AMBIENT PETALS + ONE-OFF PARTICLE BURSTS
     ========================================================= */

  function spawnPetals() {
    if (reduceMotion) return;
    var field = document.getElementById('petalField');
    var kinds = ['petal--white', 'petal--white', 'petal--pink', 'petal--pink', 'petal--rose'];
    for (var i = 0; i < 18; i++) {
      var p = document.createElement('div');
      p.className = 'petal ' + pick(kinds);
      var size = rand(10, 20);
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = rand(0, 100) + '%';
      p.style.setProperty('--dur', rand(11, 20).toFixed(1) + 's');
      p.style.setProperty('--delay', (-rand(0, 20)).toFixed(1) + 's');
      p.style.setProperty('--drift', rand(-46, 46).toFixed(0) + 'px');
      field.appendChild(p);
    }
  }

  function spawnParticles(x, y, count) {
    if (reduceMotion || !count) return;
    var layer = document.getElementById('burstLayer');
    var kinds = ['petal', 'petal', 'petal', 'sparkle', 'flower'];
    for (var i = 0; i < count; i++) {
      var kind = pick(kinds);
      var el = document.createElement('div');
      var angle = rand(0, Math.PI * 2);
      var dist = rand(50, 130);
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.setProperty('--dx', (Math.cos(angle) * dist).toFixed(0) + 'px');
      el.style.setProperty('--dy', (Math.sin(angle) * dist).toFixed(0) + 'px');
      el.style.setProperty('--rot', rand(-200, 200).toFixed(0) + 'deg');
      el.style.setProperty('--dur', rand(.6, 1.1).toFixed(2) + 's');

      if (kind === 'sparkle') {
        el.className = 'burst-particle bp-sparkle';
      } else if (kind === 'flower') {
        el.className = 'burst-particle bp-flower';
        var mini = buildFlower(pick(['wildflower', 'cherry']));
        mini.svg.style.width = '100%';
        mini.svg.style.height = '100%';
        mini.svg.style.display = 'block';
        el.appendChild(mini.svg);
      } else {
        el.className = 'burst-particle bp-petal ' + pick(['', 'c2', 'c3']);
      }

      layer.appendChild(el);
      el.addEventListener('animationend', function () { this.remove(); });
    }
  }

  /* =========================================================
     HERO TYPEWRITER
     ========================================================= */

  function typeSubtitle() {
    var el = document.getElementById('heroTyped');
    var text = 'for my one and only and most favorite home girl in the entire universe.';
    if (reduceMotion) { el.textContent = text; return; }
    var i = 0;
    setTimeout(function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, 38);
      }
    }, 1300);
  }

  /* =========================================================
     LETTER — hidden until unlocked
     ========================================================= */

  function initLetter() {
    var scene = document.getElementById('letterScene');
    var btn = document.getElementById('openLetterBtn');
    btn.addEventListener('click', function () {
      if (scene.classList.contains('is-open')) return;
      scene.classList.add('is-open');
      var r = btn.getBoundingClientRect();
      spawnParticles(r.left + r.width / 2, r.top + r.height / 2, reduceMotion ? 0 : 16);
      setTimeout(function () {
        document.getElementById('letterContent').scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth', block: 'center'
        });
      }, reduceMotion ? 0 : 450);
    });
  }
  /* =========================================================
    MEADOW — Garden interaction & Touch logic
    ========================================================= */

  var STORAGE_KEY = 'malikaGarden';
  var MAX_SAVED = 60;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Helper function for random values
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function loadGarden() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveGarden(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  function initMeadowClicks() {
    var meadow = document.getElementById('meadow');
    var plantLayer = document.getElementById('meadowPlant');
    var garden = loadGarden();

    // Load existing saved plants
    garden.forEach(function (item) {
      placeItem(plantLayer, item.x, item.y, item.type, { 
        width: getFlowerSize(), 
        settled: true 
      });
    });

    // Tap/Click Event Handler optimized for Mobile and Desktop
    function handlePlantEvent(e) {
      if (e.target.closest('#favoriteFlower') || e.target.closest('#meadowReset')) return;

      var rect = meadow.getBoundingClientRect();
      
      // Support both Touch and Mouse coordinates
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;

      // Restrict planting mostly to the lower 60% ground region for natural look
      var x = ((clientX - rect.left) / rect.width) * 100;
      var y = ((clientY - rect.top) / rect.height) * 100;

      // If tapped sky, automatically place plant slightly lower into the ground field
      if (y < 35) y = rand(38, 45);

      var type = typeof weightedType === 'function' ? weightedType() : 'default';
      var flowerSize = getFlowerSize();

      placeItem(plantLayer, x, y, type, { width: flowerSize });
      spawnParticles(clientX, clientY, reduceMotion ? 0 : 8);

      garden.push({ x: +x.toFixed(2), y: +y.toFixed(2), type: type });
      if (garden.length > MAX_SAVED) {
        garden = garden.slice(garden.length - MAX_SAVED);
        var first = plantLayer.querySelector('.meadow-item');
        if (first) first.remove();
      }
      saveGarden(garden);
    }

    // Use Pointer events if available (handles touch and click seamlessly)
    if (window.PointerEvent) {
      meadow.addEventListener('pointerdown', function(e) {
        if (e.isPrimary) handlePlantEvent(e);
      });
    } else {
      meadow.addEventListener('click', handlePlantEvent);
    }

    // Reset button action
    document.getElementById('meadowReset').addEventListener('click', function (e) {
      e.stopPropagation();
      if (!window.confirm('Clear everything planted in the field?')) return;
      garden = [];
      saveGarden(garden);
      plantLayer.innerHTML = '';
    });
  }

  // Adjust flower size according to screen width (Smaller on phone screens)
  function getFlowerSize() {
    var isMobile = window.innerWidth <= 600;
    return isMobile ? rand(45, 70) : rand(66, 100);
  }

  // Dynamic particle bursting on touch
  function spawnParticles(x, y, count) {
    if (count <= 0) return;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'ambient-sparkle';
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      
      // Randomize movement vector
      var dx = (Math.random() - 0.5) * 100;
      var dy = (Math.random() - 0.8) * 100;
      p.style.setProperty('--dx', 'calc(-50% + ' + dx + 'px)');
      p.style.setProperty('--dy', 'calc(-50% + ' + dy + 'px)');

      document.body.appendChild(p);
      setTimeout(function(el) { el.remove(); }, 800, p);
    }
  }

  function initFavoriteFlower() {
    var btn = document.getElementById('favoriteFlower');
    if (!btn) return;
    
    var sway = document.createElement('span');
    sway.className = 'favorite-sway';
    
    if (typeof makeTulip === 'function') {
      var built = makeTulip('white');
      built.svg.setAttribute('class', 'favorite-svg');
      sway.appendChild(built.svg);
    }
    btn.appendChild(sway);

    var exploding = false;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (exploding) return;
      exploding = true;
      btn.classList.add('is-awake');

      setTimeout(function () {
        btn.classList.remove('is-awake');
        btn.classList.add('is-bursting');
        var r = btn.getBoundingClientRect();
        spawnParticles(r.left + r.width / 2, r.top + r.height / 2, reduceMotion ? 0 : 20);

        setTimeout(function () {
          btn.classList.remove('is-bursting');
          btn.classList.add('is-reblooming');
          setTimeout(function () {
            btn.classList.remove('is-reblooming');
            exploding = false;
          }, 850);
        }, 380);
      }, reduceMotion ? 0 : 650);
    });
  }

  // Initialize on document ready
  document.addEventListener('DOMContentLoaded', function() {
    initMeadowClicks();
    initFavoriteFlower();
  });

  /* =========================================================
     INIT
     ========================================================= */

  document.addEventListener('DOMContentLoaded', function () {
    spawnPetals();
    scatterHero();
    scatterMeadow();
    typeSubtitle();
    initLetter();
    initFavoriteFlower();
    initMeadowClicks();

    document.getElementById('scrollCue').addEventListener('click', function () {
      document.getElementById('letterScene').scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth', block: 'start'
      });
    });
  });
})();
