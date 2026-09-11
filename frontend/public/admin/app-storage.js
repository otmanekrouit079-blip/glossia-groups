(function () {
  const DATA_KEY = "salonManagerData";
  const USER_KEY = "salonCurrentUser";
  const SAVE_EVENT = "salon-storage-saved";
  const API_BASE_KEY = "salonApiBaseUrl";
  const API_DEFAULT_BASE = "http://localhost:4000";

  let hasBootstrappedRemote = false;
  let remotePushTimer = null;

  function safeParse(rawValue) {
    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue);
    } catch (error) {
      console.warn("Impossible de lire les donnees sauvegardees.", error);
      return null;
    }
  }

  function getApiBaseUrl() {
    const globalValue = typeof window.SALON_API_BASE === "string"
      ? window.SALON_API_BASE.trim()
      : "";

    if (globalValue) {
      return globalValue.replace(/\/+$/, "");
    }

    const localValue = String(localStorage.getItem(API_BASE_KEY) || "").trim();
    if (localValue) {
      return localValue.replace(/\/+$/, "");
    }

    if (typeof window.location?.origin === "string" && /^https?:/i.test(window.location.origin)) {
      return window.location.origin.replace(/\/+$/, "");
    }

    return API_DEFAULT_BASE;
  }

  function setApiBaseUrl(url) {
    const sanitized = String(url || "").trim().replace(/\/+$/, "");
    if (!sanitized) {
      localStorage.removeItem(API_BASE_KEY);
      return API_DEFAULT_BASE;
    }

    localStorage.setItem(API_BASE_KEY, sanitized);
    return sanitized;
  }

  function createDefaultData() {
    return {
      meta: {
        version: 1,
        updatedAt: null
      },
      employees: [
        { id: 1, name: "Ahmed", post: "منصب 1" },
        { id: 2, name: "Youssef", post: "منصب 2" }
      ],
      authUsers: [
        {
          role: "manager",
          username: "gerant1",
          password: "1234"
        },
        {
          role: "employee",
          username: "emp1",
          password: "1234",
          employeeId: 1
        },
        {
          role: "employee",
          username: "emp2",
          password: "1234",
          employeeId: 2
        },
        {
          role: "owner",
          username: "osmane Barber",
          password: "otmankrouit199811"
        }
      ],
      employeeData: {},
      ownerCampaignTarget: {},
      ownerDailyTaxDh: 0,
      serviceCatalog: ["قصة", "تقشير", "حلاقة اللحية"],
      productSales: [],
      ownerProducts: [],
      ownerTaxRates: {},
      inventoryProducts: [],
      fixedCosts: [],
      variableCosts: [],
      employeeSalaries: {}
    };
  }

  function normalizeData(input) {
    const defaults = createDefaultData();
    const source = input && typeof input === "object" ? input : {};

    const normalizedAuthUsers = Array.isArray(source.authUsers)
      ? source.authUsers
      : defaults.authUsers;

    const normalized = {
      ...defaults,
      ...source,
      meta: {
        ...defaults.meta,
        ...(source.meta && typeof source.meta === "object" ? source.meta : {})
      },
      employees: Array.isArray(source.employees) ? source.employees : defaults.employees,
      authUsers: normalizedAuthUsers
        .map(function (user) {
          const role = String(user?.role || "").trim();
          const username = String(user?.username || "").trim();
          const password = String(user?.password || "");
          const employeeId = Number(user?.employeeId);

          if (!role || !username || !password) {
            return null;
          }

          if (role !== "manager" && role !== "employee" && role !== "owner") {
            return null;
          }

          if (role === "employee") {
            if (!Number.isFinite(employeeId) || employeeId <= 0) {
              return null;
            }

            return {
              role: "employee",
              username: username,
              password: password,
              employeeId: employeeId
            };
          }

          return {
            role: role,
            username: username,
            password: password
          };
        })
        .filter(Boolean),
      employeeData: source.employeeData && typeof source.employeeData === "object" ? source.employeeData : {},
      ownerCampaignTarget: source.ownerCampaignTarget && typeof source.ownerCampaignTarget === "object"
        ? source.ownerCampaignTarget
        : {},
      ownerDailyTaxDh: Number.isFinite(Number(source.ownerDailyTaxDh)) && Number(source.ownerDailyTaxDh) >= 0
        ? Number(source.ownerDailyTaxDh)
        : 0,
      serviceCatalog: Array.isArray(source.serviceCatalog)
        ? source.serviceCatalog.filter(function (entry) {
          return typeof entry === "string" && entry.trim().length > 0;
        })
        : defaults.serviceCatalog,
      productSales: Array.isArray(source.productSales) ? source.productSales : [],
      ownerProducts: Array.isArray(source.ownerProducts) ? source.ownerProducts : [],
      ownerTaxRates: source.ownerTaxRates && typeof source.ownerTaxRates === "object" ? source.ownerTaxRates : {},
      inventoryProducts: Array.isArray(source.inventoryProducts) ? source.inventoryProducts : [],
      fixedCosts: Array.isArray(source.fixedCosts) ? source.fixedCosts : [],
      variableCosts: Array.isArray(source.variableCosts) ? source.variableCosts : [],
      employeeSalaries: source.employeeSalaries && typeof source.employeeSalaries === "object" ? source.employeeSalaries : {}
    };

    normalized.employees.forEach(function (employee) {
      if (!normalized.employeeData[employee.id]) {
        normalized.employeeData[employee.id] = {
          salesHistory: [],
          tasks: [],
          scheduleByDate: {}
        };
      }

      if (typeof normalized.ownerTaxRates[employee.id] !== "number") {
        normalized.ownerTaxRates[employee.id] = 0;
      }

      if (typeof normalized.employeeSalaries[employee.id] !== "number") {
        normalized.employeeSalaries[employee.id] = 0;
      }
    });

    const hasManagerAccount = normalized.authUsers.some(function (user) {
      return user.role === "manager";
    });

    if (!hasManagerAccount) {
      normalized.authUsers.push({
        role: "manager",
        username: "gerant1",
        password: "1234"
      });
    }

    const hasOwnerAccount = normalized.authUsers.some(function (user) {
      return user.role === "owner";
    });

    if (!hasOwnerAccount) {
      normalized.authUsers.push({
        role: "owner",
        username: "osmane Barber",
        password: "otmankrouit199811"
      });
    }

    normalized.employees.forEach(function (employee) {
      const hasEmployeeAccount = normalized.authUsers.some(function (user) {
        return user.role === "employee" && Number(user.employeeId) === Number(employee.id);
      });

      if (!hasEmployeeAccount) {
        normalized.authUsers.push({
          role: "employee",
          username: "emp" + employee.id,
          password: "1234",
          employeeId: Number(employee.id)
        });
      }
    });

    normalized.authUsers = normalized.authUsers.filter(function (user, index, list) {
      const key = user.role === "employee"
        ? "employee:" + String(user.employeeId)
        : user.role;

      return list.findIndex(function (item) {
        const itemKey = item.role === "employee"
          ? "employee:" + String(item.employeeId)
          : item.role;
        return itemKey === key;
      }) === index;
    });

    return normalized;
  }

  function dispatchSavedEvent(data) {
    window.dispatchEvent(new CustomEvent(SAVE_EVENT, {
      detail: {
        updatedAt: data?.meta?.updatedAt || null
      }
    }));
  }

  function persistLocalData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
    sessionStorage.setItem(DATA_KEY, JSON.stringify(data));
  }

  async function fetchRemoteState() {
    const response = await fetch(getApiBaseUrl() + "/api/state", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    if (!payload || payload.ok !== true || !payload.payload) {
      return null;
    }

    return normalizeData(payload.payload);
  }

  async function pushRemoteState(data) {
    const response = await fetch(getApiBaseUrl() + "/api/state", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Remote save failed with status " + response.status);
    }

    return response.json();
  }

  function scheduleRemotePush(data) {
    if (remotePushTimer) {
      clearTimeout(remotePushTimer);
    }

    remotePushTimer = setTimeout(function () {
      pushRemoteState(data).catch(function (error) {
        console.warn("Echec de sauvegarde distante.", error);
      });
    }, 300);
  }

  function bootstrapRemoteSync(localData) {
    if (hasBootstrappedRemote) {
      return;
    }

    hasBootstrappedRemote = true;

    fetchRemoteState()
      .then(function (remoteData) {
        if (!remoteData) {
          scheduleRemotePush(localData);
          return;
        }

        const remoteUpdatedAt = Date.parse(remoteData?.meta?.updatedAt || "") || 0;
        const localUpdatedAt = Date.parse(localData?.meta?.updatedAt || "") || 0;

        if (remoteUpdatedAt > localUpdatedAt) {
          persistLocalData(remoteData);
          dispatchSavedEvent(remoteData);
          return;
        }

        scheduleRemotePush(localData);
      })
      .catch(function (error) {
        console.warn("Synchronisation distante indisponible.", error);
      });
  }

  function loadData() {
    const localData = safeParse(localStorage.getItem(DATA_KEY));
    if (localData) {
      const normalizedLocal = normalizeData(localData);
      bootstrapRemoteSync(normalizedLocal);
      return normalizedLocal;
    }

    const legacySessionData = safeParse(sessionStorage.getItem(DATA_KEY));
    if (legacySessionData) {
      const normalizedLegacy = normalizeData(legacySessionData);
      saveData(normalizedLegacy);
      bootstrapRemoteSync(normalizedLegacy);
      return normalizedLegacy;
    }

    const defaults = normalizeData(createDefaultData());
    saveData(defaults);
    bootstrapRemoteSync(defaults);
    return defaults;
  }

  function saveData(data) {
    const normalized = normalizeData(data);
    normalized.meta.updatedAt = new Date().toISOString();

    persistLocalData(normalized);
    scheduleRemotePush(normalized);

    dispatchSavedEvent(normalized);
    return normalized;
  }

  function syncDataNow() {
    const localData = normalizeData(loadData());
    return pushRemoteState(localData);
  }

  function loadUser() {
    const localUser = safeParse(localStorage.getItem(USER_KEY));
    if (localUser) {
      return localUser;
    }

    const sessionUser = safeParse(sessionStorage.getItem(USER_KEY));
    if (sessionUser) {
      saveUser(sessionUser);
      return sessionUser;
    }

    return null;
  }

  function saveUser(user) {
    if (!user || typeof user !== "object") {
      return null;
    }

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  }

  function clearUser() {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  function getLastSavedAt() {
    const data = safeParse(localStorage.getItem(DATA_KEY));
    return data?.meta?.updatedAt || null;
  }

  function formatLastSavedAt() {
    const updatedAt = getLastSavedAt();
    if (!updatedAt) {
      return "عمرو ما";
    }

    const date = new Date(updatedAt);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  window.SalonStorage = {
    DATA_KEY: DATA_KEY,
    USER_KEY: USER_KEY,
    SAVE_EVENT: SAVE_EVENT,
    API_BASE_KEY: API_BASE_KEY,
    createDefaultData: createDefaultData,
    normalizeData: normalizeData,
    loadData: loadData,
    saveData: saveData,
    getApiBaseUrl: getApiBaseUrl,
    setApiBaseUrl: setApiBaseUrl,
    syncDataNow: syncDataNow,
    loadUser: loadUser,
    saveUser: saveUser,
    clearUser: clearUser,
    getLastSavedAt: getLastSavedAt,
    formatLastSavedAt: formatLastSavedAt
  };
})();
