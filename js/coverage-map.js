(function () {
  "use strict";

  /**
   * Worldwide Coverage map – site uyarlaması.
   * - SVG ve noktalar HTML içinde; burada programatik olarak yeniden oluşturulur.
   * - IntersectionObserver ile görünürdeyken animasyon başlatılır.
   * - prefers-reduced-motion varsa animasyon kapatılır.
   */
  function initCoverageMap() {
    var container = document.getElementById("coverage-map");
    if (!container) return;
    var svg = container.querySelector("svg");
    if (!svg) return;

    var dotsGroup = svg.querySelector(".coverage-map__dots");
    if (!dotsGroup) {
      dotsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      dotsGroup.setAttribute("class", "coverage-map__dots");
      svg.appendChild(dotsGroup);
    } else {
      // Mevcut daireleri temizle (statik HTML ile çakışmayı önlemek için)
      var existing = dotsGroup.querySelectorAll("circle.coverage-map__dot");
      existing.forEach(function (node) { dotsGroup.removeChild(node); });
    }

    // Mevcut tasarımla uyumlu konumlar (viewBox: 0 0 673 343 koordinatları)
    var DOTS = [
      { cx: 200, cy: 100, r: 4 },
      { cx: 350, cy: 120, r: 4 },
      { cx: 500, cy: 150, r: 4 },
      { cx: 280, cy: 200, r: 4 },
      { cx: 420, cy: 220, r: 4 },
      { cx: 150, cy: 180, r: 4 }
    ];

    DOTS.forEach(function (d) {
      var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("class", "coverage-map__dot");
      circle.setAttribute("cx", d.cx);
      circle.setAttribute("cy", d.cy);
      circle.setAttribute("r", d.r);
      circle.setAttribute("aria-hidden", "true");
      dotsGroup.appendChild(circle);
    });

    // Tercih edilen azaltılmış hareket için sınıf uygula
    try {
      var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq && mq.matches) {
        container.classList.add("coverage-map--static");
      }
      if (mq) {
        if (mq.addEventListener) {
          mq.addEventListener("change", function (e) {
            if (e.matches) {
              container.classList.add("coverage-map--static");
              container.classList.remove("active");
            } else {
              container.classList.remove("coverage-map--static");
            }
          });
        } else if (mq.addListener) {
          mq.addListener(function (e) {
            if (e.matches) {
              container.classList.add("coverage-map--static");
              container.classList.remove("active");
            } else {
              container.classList.remove("coverage-map--static");
            }
          });
        }
      }
    } catch (err) { /* noop */ }

    // Görünürlük tabanlı animasyon kontrolü
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!container.classList.contains("coverage-map--static")) {
              container.classList.add("active");
            }
          } else {
            container.classList.remove("active");
          }
        });
      }, { rootMargin: "0px 0px -20% 0px", threshold: 0.2 });
      io.observe(container);
    } else {
      // Geriye dönük uyumluluk: hemen aktif
      if (!container.classList.contains("coverage-map--static")) {
        container.classList.add("active");
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCoverageMap);
  } else {
    initCoverageMap();
  }
})();
