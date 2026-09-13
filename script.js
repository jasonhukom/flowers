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
     Malika's real bouquet flowers (photographed/illustrated
     assets) stand in for the old hand-drawn SVG petals.
     Every call returns a fresh {svg, w, h} — "svg" here is an
     <img> element, kept under that key so the rest of the file
     (placeItem, scatterHero, etc.) doesn't need to change.
     ========================================================= */

  var FLOWER_IMG = {
    peony:    { src: 'assets/flower-peony.png',    w: 225, h: 384 },
    daisy:    { src: 'assets/flower-daisy.png',     w: 225, h: 384 },
    lily:     { src: 'assets/flower-lily.png',      w: 225, h: 384 },
    marigold: { src: 'assets/flower-marigold.png',  w: 225, h: 384 },
    anemone:  { src: 'assets/flower-anemone.png',   w: 225, h: 384 }
  };

  function makeImageFlower(kind) {
    var def = FLOWER_IMG[kind] || FLOWER_IMG.peony;
    var img = document.createElement('img');
    img.src = def.src;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.draggable = false;
    img.width = def.w;
    img.height = def.h;
    return { svg: img, w: def.w, h: def.h };
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
      case 'peony': return makeImageFlower('peony');
      case 'daisy': return makeImageFlower('daisy');
      case 'lily': return makeImageFlower('lily');
      case 'marigold': return makeImageFlower('marigold');
      case 'anemone': return makeImageFlower('anemone');
      case 'grass': return makeGrass();
      default: return makeImageFlower('peony');
    }
  }

  var WEIGHTED_TYPES = [
    'peony', 'peony', 'peony',
    'daisy', 'daisy', 'daisy',
    'marigold', 'marigold',
    'lily', 'anemone', 'anemone'
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
    var plantLayer = document.getElementById('meadowPlant');

    if (!plantLayer) return;

    // One flower layer only. The grass is a single background layer behind it.
    var count = reduceMotion ? 14 : 24;

    for (var i = 0; i < count; i++) {
      var type = Math.random() < 0.12 ? 'grass' : weightedType();

      placeItem(
        plantLayer,
        rand(4, 96),
        rand(68, 96),
        type,
        {
          width: rand(52, 92),
          settled: true,
          hazy: Math.random() < 0.08
        }
      );
    }
  }

  function scatterHero() {
    var container = document.getElementById('heroFlowers');
    var count = reduceMotion ? 4 : 6;
    var types = ['peony', 'daisy', 'marigold', 'lily', 'anemone'];
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
        var mini = buildFlower(pick(['daisy', 'anemone', 'lily']));
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
    if (!meadow || meadow.dataset.initialized === 'true') return;
    meadow.dataset.initialized = 'true';
    var plantLayer = document.getElementById('meadowPlant');
    var garden = loadGarden();

    // Load existing saved plants
    garden.forEach(function (item) {
      var safeY = Math.max(64, Math.min(96, Number(item.y) || 64));
      item.y = safeY;
      placeItem(plantLayer, item.x, safeY, item.type, { 
        width: getFlowerSize(), 
        settled: true 
      });
    });
    saveGarden(garden);

    // Tap/Click Event Handler optimized for Mobile and Desktop
    function handlePlantEvent(e) {
      if (e.target.closest('#favoriteFlower') || e.target.closest('#meadowReset')) return;

      var rect = meadow.getBoundingClientRect();
      
      // Support both Touch and Mouse coordinates
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;

      // Green grass occupies the bottom 43% of the meadow.
      // Taps in grass stay exactly where the user touched.
      // Taps in blue sky land at the top edge of the grass, keeping the flower grounded.
      var x = ((clientX - rect.left) / rect.width) * 100;
      var y = ((clientY - rect.top) / rect.height) * 100;
      var grassTop = 57;
      /* Sky clicks land near the top of the grass; grass clicks remain exact. */
      if (y < grassTop) y = 64;

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
    if (!btn || btn.dataset.initialized === 'true') return;
    btn.dataset.initialized = 'true';
    
    var sway = document.createElement('span');
    sway.className = 'favorite-sway';
    
    if (typeof makeImageFlower === 'function') {
      var built = makeImageFlower('peony');
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

  /* =========================================================
     BOUQUET BUILDER
     A small drag-and-drop corner between the letter and the
     meadow — tap a bloom to add it, drag it into place.
     ========================================================= */

  var BUILDER_FLOWERS = {
    'peony-pink': 'assets/bouquet-peony-pink.png',
    'rose-red': 'assets/bouquet-rose-red.png',
    'peony-red': 'assets/bouquet-peony-red.png',
    'anemone-mint': 'assets/bouquet-anemone-mint.png',
    'daisy-cream': 'assets/bouquet-daisy-cream.png'
  };

  function initBouquetBuilder() {
    var canvas = document.getElementById('builderCanvas');
    var picker = document.getElementById('builderPicker');
    var resetBtn = document.getElementById('builderReset');
    if (!canvas || !picker) return;

    var stack = 0;

    function makeDraggable(el) {
      var dragging = false;
      var pointerId = null;

      el.addEventListener('pointerdown', function (e) {
        dragging = true;
        pointerId = e.pointerId;
        try { el.setPointerCapture(pointerId); } catch (err) {}
        el.style.zIndex = String(1000 + (stack++));
        e.preventDefault();
      });

      el.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var rect = canvas.getBoundingClientRect();
        var x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        var y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
        el.style.left = x + 'px';
        el.style.top = y + 'px';
      });

      function release() {
        if (pointerId !== null && el.hasPointerCapture && el.hasPointerCapture(pointerId)) {
          el.releasePointerCapture(pointerId);
        }
        dragging = false;
        pointerId = null;
      }
      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', release);
    }

    function addFlower(kind, x, y) {
      var src = BUILDER_FLOWERS[kind];
      if (!src) return;

      var el = document.createElement('div');
      el.className = 'builder-flower';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.zIndex = String(1000 + (stack++));
      el.style.transform = 'translate(-50%,-50%) rotate(' + rand(-8, 8) + 'deg)';

      var img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.draggable = false;
      el.appendChild(img);

      canvas.appendChild(el);
      canvas.classList.add('has-flowers');
      makeDraggable(el);
    }

    picker.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.builder-pick') : null;
      if (!btn || !picker.contains(btn)) return;
      var kind = btn.getAttribute('data-flower');
      var rect = canvas.getBoundingClientRect();
      var x = rect.width / 2 + rand(-70, 70);
      var y = rect.height / 2 + rand(-50, 50);
      addFlower(kind, x, y);
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        var flowers = canvas.querySelectorAll('.builder-flower');
        for (var i = 0; i < flowers.length; i++) { flowers[i].remove(); }
        canvas.classList.remove('has-flowers');
      });
    }
  }

  /* =========================================================
     INIT
     ========================================================= */

  document.addEventListener('DOMContentLoaded', function () {
    spawnPetals();
    scatterHero();
    scatterMeadow();
    typeSubtitle();
    initLetter();
    initMeadowClicks();
    initBouquetBuilder();

    document.getElementById('scrollCue').addEventListener('click', function () {
      document.getElementById('letterScene').scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth', block: 'start'
      });
    });
  });
})();
