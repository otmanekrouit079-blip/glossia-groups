(function () {
  function formatClock(date) {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function setStatus(statusEl, text, stateClass) {
    if (!statusEl) {
      return;
    }

    statusEl.textContent = text;
    statusEl.classList.remove("is-online", "is-offline", "is-pending");

    if (stateClass) {
      statusEl.classList.add(stateClass);
    }
  }

  function setLastSync(lastEl, label) {
    if (!lastEl) {
      return;
    }

    lastEl.textContent = label;
  }

  async function checkHealth(baseUrl) {
    const response = await fetch(baseUrl + "/api/health", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const payload = await response.json().catch(function () {
      return null;
    });

    return {
      ok: response.ok,
      payload: payload
    };
  }

  function initSyncToolbar(root) {
    const storage = window.SalonStorage;
    if (!storage) {
      return;
    }

    const statusEl = root.querySelector("[data-sync-status]");
    const lastEl = root.querySelector("[data-sync-last]");
    const syncBtn = root.querySelector("[data-sync-now]");

    if (!statusEl || !lastEl || !syncBtn) {
      return;
    }

    async function refreshStatus() {
      setStatus(statusEl, "القاعدة: كنتأكد...", "is-pending");
      const baseUrl = storage.getApiBaseUrl ? storage.getApiBaseUrl() : "http://localhost:4000";
      root.title = "API: " + baseUrl;

      try {
        const health = await checkHealth(baseUrl);
        if (health.ok) {
          if (health.payload?.database === "file-fallback") {
            setStatus(statusEl, "القاعدة: محلية", "is-online");
            return;
          }

          setStatus(statusEl, "القاعدة: متصلة", "is-online");
          return;
        }

        setStatus(statusEl, "القاعدة: مقطوعة", "is-offline");
      } catch (error) {
        setStatus(statusEl, "القاعدة: مقطوعة", "is-offline");
      }
    }

    syncBtn.addEventListener("click", function () {
      setStatus(statusEl, "القاعدة: كتزامن...", "is-pending");

      storage.syncDataNow()
        .then(function () {
          setStatus(statusEl, "القاعدة: متصلة", "is-online");
          setLastSync(lastEl, "آخر مزامنة: " + formatClock(new Date()));
        })
        .catch(function () {
          setStatus(statusEl, "القاعدة: مقطوعة", "is-offline");
          setLastSync(lastEl, "آخر مزامنة: فشلات");
        });
    });

    const lastSavedAt = storage.getLastSavedAt ? storage.getLastSavedAt() : null;
    if (lastSavedAt) {
      const date = new Date(lastSavedAt);
      if (!Number.isNaN(date.getTime())) {
        setLastSync(lastEl, "آخر حفظ محلي: " + formatClock(date));
      }
    }

    refreshStatus();
    setInterval(refreshStatus, 20000);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-sync-toolbar]").forEach(initSyncToolbar);
  });
})();
