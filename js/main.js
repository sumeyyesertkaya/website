(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var revealElements = document.querySelectorAll(".reveal");

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  function revealOnScroll() {
    var viewportHeight = window.innerHeight;
    var revealOffset = Math.min(120, viewportHeight * 0.15);

    revealElements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var top = rect.top;
      if (top < viewportHeight - revealOffset) {
        el.classList.add("visible");
      }
    });
  }

  /* Capabilities background – moving stars, slow drift only */
  function initCapabilitiesBg() {
    var section = document.getElementById("capabilities");
    var container = document.getElementById("capabilities-bg");
    if (!section || !container) return;

    var starCount = 75;
    var stars = [];
    var startTime = Date.now();

    function random(min, max) {
      return min + Math.random() * (max - min);
    }

    var w = section.offsetWidth || container.offsetWidth || 800;
    var h = section.offsetHeight || container.offsetHeight || 600;

    for (var i = 0; i < starCount; i++) {
      var star = document.createElement("span");
      star.className = "capabilities-bg-star";
      var size = random(1, 2);
      star.style.width = size + "px";
      star.style.height = size + "px";
      var homeX = random(0, w);
      var homeY = random(0, h);
      star.style.left = homeX + "px";
      star.style.top = homeY + "px";
      container.appendChild(star);
      stars.push({
        el: star,
        homeX: homeX,
        homeY: homeY,
        drift: random(0.2, 0.5),
        phase: random(0, 6),
        ampX: random(20, 35),
        ampY: random(15, 28)
      });
    }

    function tick() {
      var t = (Date.now() - startTime) * 0.001;
      stars.forEach(function (s) {
        var x = s.homeX + Math.sin(t * s.drift + s.phase) * s.ampX;
        var y = s.homeY + Math.cos(t * s.drift * 0.7 + s.phase * 1.3) * s.ampY;
        s.el.style.left = x + "px";
        s.el.style.top = y + "px";
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function init() {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", revealOnScroll, { passive: true });
    window.addEventListener("resize", revealOnScroll, { passive: true });
    onScroll();
    revealOnScroll();
    initCapabilitiesBg();
    initNavToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Mobile nav toggle */
  function initNavToggle() {
    var toggle = document.getElementById("nav-toggle");
    var navEl = document.getElementById("nav");
    var links = document.querySelectorAll(".nav-links a");
    if (!toggle || !navEl) return;

    function setOpen(open) {
      if (open) {
        navEl.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("nav-open");
        // create overlay element
        if (!document.querySelector('.nav-overlay')) {
          var overlay = document.createElement('div');
          overlay.className = 'nav-overlay';
          overlay.addEventListener('click', function () { setOpen(false); });
          document.body.appendChild(overlay);
        }
      } else {
        navEl.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
        var ov = document.querySelector('.nav-overlay');
        if (ov) ov.parentNode.removeChild(ov);
      }
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!navEl.classList.contains("open"));
    });

    // Close when clicking a link
    links.forEach(function (a) {
      a.addEventListener("click", function () {
        setOpen(false);
      });
    });

    // Close when clicking the nav background/overlay (pseudo-element targets the nav)
    navEl.addEventListener("click", function (ev) {
      if (!navEl.classList.contains("open")) return;
      var linksEl = navEl.querySelector(".nav-links");
      // If click happened outside the links area and not on the toggle, close
      if (linksEl && !linksEl.contains(ev.target) && ev.target !== toggle && !toggle.contains(ev.target)) {
        setOpen(false);
      }
    });

    // Close on Escape or clicking outside
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") setOpen(false);
    });
    document.addEventListener("click", function (ev) {
      if (!navEl.contains(ev.target)) setOpen(false);
    });
  }
})();
