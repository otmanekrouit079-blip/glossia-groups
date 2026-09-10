(function () {
  function parseLocalizedNumber(text) {
    if (!text) {
      return null;
    }

    const cleaned = text
      .replace(/\u202f|\u00a0/g, "")
      .replace(/,/g, ".")
      .replace(/[^0-9.\-]/g, "");

    if (!cleaned || cleaned === "-" || cleaned === ".") {
      return null;
    }

    const value = Number(cleaned);
    return Number.isFinite(value) ? value : null;
  }

  function formatLikeSource(value, sourceText) {
    const hasDh = /\bDH\b/i.test(sourceText);
    const hasPercent = /%/.test(sourceText);

    if (hasPercent) {
      return Math.round(value) + "%";
    }

    const formatted = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

    if (hasDh) {
      return formatted + " DH";
    }

    return formatted;
  }

  function animateKpi(el) {
    if (el.dataset.counted === "true") {
      return;
    }

    const sourceText = (el.textContent || "").trim();
    const isNumericOnly = /^-?\d[\d\s.,]*$/.test(sourceText);
    const isDh = /\bDH\b/i.test(sourceText);
    const isPercent = /%/.test(sourceText);
    if (!isNumericOnly && !isDh && !isPercent) {
      return;
    }

    const target = parseLocalizedNumber(sourceText);
    if (target == null) {
      return;
    }

    const duration = 900;
    const start = performance.now();
    const from = 0;

    function frame(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = from + (target - from) * eased;
      el.textContent = formatLikeSource(value, sourceText);

      if (progress < 1) {
        requestAnimationFrame(frame);
        return;
      }

      el.textContent = sourceText;
      el.dataset.counted = "true";
    }

    requestAnimationFrame(frame);
  }

  function runKpiAnimations() {
    const selectors = [
      ".owner-summary-card strong",
      ".owner-bi-summary strong",
      ".owner-profit-strip strong",
      ".employee-metric-card strong",
      ".sales-total-grid strong",
      ".manager-objective-item strong",
      ".owner-bi-nav-card strong"
    ];

    document.querySelectorAll(selectors.join(",")).forEach(function (el) {
      animateKpi(el);
    });
  }

  function applyStaggerReveal() {
    const groups = [
      ".owner-summary-card",
      ".owner-bi-nav-card",
      ".owner-compact-card",
      ".employee-metric-card",
      ".nav-card",
      ".manager-objective-item"
    ];

    groups.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el, index) {
        el.style.setProperty("--stagger-index", String(index));
        el.classList.add("stagger-enter");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyStaggerReveal();
    runKpiAnimations();

    // Lightweight refresh hooks instead of a full-page mutation observer.
    document.addEventListener("click", function (event) {
      const trigger = event.target.closest(
        ".period-tab, .owner-bi-nav-card, .nav-card, .modal-tab-btn, .owner-accounting-period-btn"
      );

      if (!trigger) {
        return;
      }

      setTimeout(function () {
        runKpiAnimations();
      }, 0);
    });
  });
})();
