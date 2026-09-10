// In-memory list of employees shown as room/post cards.
const employees = [
  { id: 1, name: "Ahmed", post: "Post 1" },
  { id: 2, name: "Youssef", post: "Post 2" }
];

const defaultTasks = [
  "Nettoyer le miroir",
  "Nettoyer la chaise",
  "Nettoyer les toilettes"
];

// Per-employee in-memory storage for sales, tasks, and schedules.
const employeeData = {};
let sharedSalonData = {};

function loadSharedData() {
  if (!window.SalonStorage) {
    return;
  }

  const parsedData = window.SalonStorage.loadData();
  sharedSalonData = parsedData && typeof parsedData === "object" ? parsedData : {};

  if (Array.isArray(parsedData.employees)) {
    employees.splice(0, employees.length, ...parsedData.employees);
  }

  if (parsedData.employeeData && typeof parsedData.employeeData === "object") {
    Object.assign(employeeData, parsedData.employeeData);
  }
}

function saveSharedData() {
  const pendingChanges = sharedSalonData && typeof sharedSalonData === "object"
    ? { ...sharedSalonData }
    : {};

  const latestData = window.SalonStorage ? window.SalonStorage.loadData() : {};
  sharedSalonData = { ...latestData, ...pendingChanges };

  const payload = {
    ...sharedSalonData,
    employees: employees,
    employeeData: employeeData
  };

  if (window.SalonStorage) {
    window.SalonStorage.saveData(payload);
  }
}

loadSharedData();

let selectedEmployeeId = null;
let nextEmployeeId = employees.reduce(function (highestId, employee) {
  return Math.max(highestId, employee.id);
}, 0) + 1;
let activeSection = "employes";
let activeModalTab = "ventes";
let activeScheduleDateKey = getCurrentDateKey();
let activeProductsPeriod = "all";

const salesHistoryExpandedDays = new Set();
const navButtons = document.querySelectorAll(".nav-card");
const contentSections = document.querySelectorAll(".content-section");

const employeeList = document.getElementById("employee-list");
const toggleAddFormButton = document.getElementById("toggle-add-form");
const addEmployeeForm = document.getElementById("add-employee-form");
const employeeNameField = document.getElementById("employee-name");
const employeePostField = document.getElementById("employee-post");
const dashboardMessage = document.getElementById("dashboard-message");
const openAccessModalButton = document.getElementById("open-access-modal");

const salesModal = document.getElementById("sales-modal");
const selectedEmployeeLabel = document.getElementById("selected-employee-label");
const closeModalButton = document.getElementById("close-modal");
const modalFeedback = document.getElementById("modal-feedback");
const managerAccessModal = document.getElementById("manager-access-modal");
const managerAccessForm = document.getElementById("manager-access-form");
const managerAccessBody = document.getElementById("manager-access-body");
const managerAccessFeedback = document.getElementById("manager-access-feedback");
const closeAccessModalButton = document.getElementById("close-access-modal");

const modalTabButtons = document.querySelectorAll(".modal-tab-btn");
const modalTabPanels = document.querySelectorAll(".modal-tab-panel");

const salesForm = document.getElementById("sales-form");
const salesServiceRow = document.getElementById("sales-service-row");
const salesProductRow = document.getElementById("sales-product-row");
const salesServiceAmountField = document.getElementById("sales-service-amount");
const salesProductUnitAmountField = document.getElementById("sales-product-unit-amount");
const salesTotalAmountField = document.getElementById("sales-total-amount");
const salesTodayList = document.getElementById("sales-today-list");
const salesHistoryList = document.getElementById("sales-history-list");
const managerObjectiveOverview = document.getElementById("manager-objective-overview");

const taskList = document.getElementById("task-list");

const scheduleStampContainer = document.getElementById("schedule-stamp-buttons");
const scheduleStampButtons = document.querySelectorAll(".stamp-btn");
const workHoursSummary = document.getElementById("work-hours-summary");
const todayScheduleDisplay = document.getElementById("today-schedule-display");
const scheduleDatePicker = document.getElementById("schedule-date-picker");
const schedulePrevDayButton = document.getElementById("schedule-prev-day");
const scheduleNextDayButton = document.getElementById("schedule-next-day");
const scheduleToggleRestButton = document.getElementById("schedule-toggle-rest");
const scheduleDayTitle = document.getElementById("schedule-day-title");

const managerServicesSummary = document.getElementById("manager-services-summary");
const managerServicesTable = document.getElementById("manager-services-table");
const managerProductsTable = document.getElementById("manager-products-table");
const managerConsumedTable = document.getElementById("manager-consumed-table");
const managerRuptureTable = document.getElementById("manager-rupture-table");
const managerTasksTable = document.getElementById("manager-tasks-table");
const managerTimeTable = document.getElementById("manager-time-table");

const requiredWorkMinutes = 12 * 60;

const scheduleFieldLabels = {
  arrival: "Arrivée",
  lunch: "Pause déjeuner",
  returnTime: "Retour",
  departure: "Départ"
};

function createDefaultEmployeeState() {
  return {
    salesHistory: [],
    tasks: defaultTasks.map(function (taskText) {
      return { text: taskText, done: false, completedAtISO: null };
    }),
    scheduleByDate: {}
  };
}

function ensureEmployeeData(employeeId) {
  if (!employeeData[employeeId]) {
    employeeData[employeeId] = createDefaultEmployeeState();
  }

  return employeeData[employeeId];
}

function ensureAuthUsersCollection() {
  if (!Array.isArray(sharedSalonData.authUsers)) {
    sharedSalonData.authUsers = [];
  }

  return sharedSalonData.authUsers;
}

function getEmployeeAuthRecord(employeeId) {
  const authUsers = ensureAuthUsersCollection();

  return authUsers.find(function (user) {
    return user.role === "employee" && Number(user.employeeId) === Number(employeeId);
  });
}

function ensureEmployeeAuthRecord(employee) {
  let authRecord = getEmployeeAuthRecord(employee.id);
  if (authRecord) {
    return authRecord;
  }

  authRecord = {
    role: "employee",
    employeeId: Number(employee.id),
    username: "emp" + employee.id,
    password: "1234"
  };

  ensureAuthUsersCollection().push(authRecord);
  return authRecord;
}

function renderManagerAccessRows() {
  if (!managerAccessBody) {
    return;
  }

  managerAccessBody.innerHTML = "";

  if (employees.length === 0) {
    managerAccessBody.innerHTML = '<tr><td colspan="3" class="employee-empty-cell">Aucun employé disponible.</td></tr>';
    return;
  }

  employees.forEach(function (employee) {
    const authRecord = ensureEmployeeAuthRecord(employee);
    const row = document.createElement("tr");
    const employeeCell = document.createElement("td");
    const usernameCell = document.createElement("td");
    const passwordCell = document.createElement("td");
    const passwordInput = document.createElement("input");

    employeeCell.textContent = employee.name;
    usernameCell.textContent = authRecord.username || ("emp" + employee.id);

    passwordInput.type = "text";
    passwordInput.className = "owner-target-input";
    passwordInput.required = true;
    passwordInput.value = authRecord.password || "1234";
    passwordInput.dataset.employeeId = String(employee.id);

    passwordCell.appendChild(passwordInput);

    row.appendChild(employeeCell);
    row.appendChild(usernameCell);
    row.appendChild(passwordCell);
    managerAccessBody.appendChild(row);
  });
}

function openManagerAccessModal() {
  if (!managerAccessModal) {
    return;
  }

  if (managerAccessFeedback) {
    managerAccessFeedback.textContent = "";
  }

  renderManagerAccessRows();
  managerAccessModal.classList.remove("hidden");
}

function closeManagerAccessModal() {
  if (!managerAccessModal) {
    return;
  }

  managerAccessModal.classList.add("hidden");
}

function saveManagerEmployeePasswords() {
  if (!managerAccessForm) {
    return;
  }

  if (managerAccessFeedback) {
    managerAccessFeedback.textContent = "";
  }

  const inputs = Array.from(managerAccessForm.querySelectorAll("input[data-employee-id]"));
  const hasEmptyField = inputs.some(function (input) {
    return !input.value.trim();
  });

  if (hasEmptyField) {
    if (managerAccessFeedback) {
      managerAccessFeedback.textContent = "Chaque employé doit avoir un mot de passe.";
    }
    return;
  }

  inputs.forEach(function (input) {
    const employeeId = Number(input.dataset.employeeId);
    const employee = employees.find(function (entry) {
      return Number(entry.id) === employeeId;
    });

    if (!employee) {
      return;
    }

    const authRecord = ensureEmployeeAuthRecord(employee);
    authRecord.password = input.value.trim();
  });

  saveSharedData();
  renderManagerAccessRows();

  if (managerAccessFeedback) {
    managerAccessFeedback.textContent = "Mots de passe employés mis à jour.";
  }
}

function getCurrentDateKey() {
  const now = new Date();

  // A departure shortly after midnight belongs to the shift that began the day before.
  if (now.getHours() < 6) {
    now.setDate(now.getDate() - 1);
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

function createDateTimeStamp() {
  const now = new Date();
  const date = now.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  const time = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return {
    date: date,
    time: time,
    dateTime: date + " - " + time,
    iso: now.toISOString()
  };
}

function dateFromDateKey(dateKey) {
  return new Date(dateKey + "T12:00:00");
}

function dateKeyFromDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

function formatDateKeyForHeading(dateKey) {
  return dateFromDateKey(dateKey).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function formatMinutes(totalMinutes) {
  const safeMinutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  return hours + "h" + String(minutes).padStart(2, "0");
}

function calculateDailyWork(schedule) {
  if (schedule?.restDay) {
    schedule.calculation = {
      restDay: true,
      totalMinutes: 0,
      breakMinutes: 0,
      workedMinutes: 0,
      missingMinutes: 0,
      meetsTarget: true,
      calculatedAtISO: new Date().toISOString()
    };
    return;
  }

  const requiredStamps = [
    schedule.arrival,
    schedule.lunch,
    schedule.returnTime,
    schedule.departure
  ];

  if (requiredStamps.some(function (stamp) { return !stamp; })) {
    schedule.calculation = null;
    return;
  }

  const arrivalTime = new Date(schedule.arrival.iso).getTime();
  const lunchTime = new Date(schedule.lunch.iso).getTime();
  const returnTime = new Date(schedule.returnTime.iso).getTime();
  const departureTime = new Date(schedule.departure.iso).getTime();

  if (!(arrivalTime <= lunchTime && lunchTime <= returnTime && returnTime <= departureTime)) {
    schedule.calculation = {
      error: "Les pointages ne sont pas dans l'ordre chronologique.",
      calculatedAtISO: new Date().toISOString()
    };
    return;
  }

  const totalMinutes = Math.round((departureTime - arrivalTime) / 60000);
  const breakMinutes = Math.round((returnTime - lunchTime) / 60000);
  const workedMinutes = Math.max(0, totalMinutes - breakMinutes);
  const missingMinutes = Math.max(0, requiredWorkMinutes - workedMinutes);

  // Stored per employee and workday for future owner-dashboard summaries.
  schedule.calculation = {
    totalMinutes: totalMinutes,
    breakMinutes: breakMinutes,
    workedMinutes: workedMinutes,
    missingMinutes: missingMinutes,
    meetsTarget: workedMinutes >= requiredWorkMinutes,
    calculatedAtISO: new Date().toISOString()
  };
}

function renderWorkHoursSummary(schedule) {
  const calculation = schedule.calculation;

  if (schedule?.restDay || calculation?.restDay) {
    workHoursSummary.className = "work-hours-summary pending";
    workHoursSummary.innerHTML =
      "<strong>Repos / Absent</strong>" +
      "<span>Cette journee est marquee comme repos. Aucune alerte d'heures manquantes.</span>";
    return;
  }

  if (!calculation) {
    workHoursSummary.className = "work-hours-summary pending";
    workHoursSummary.innerHTML =
      "<strong>Horaire officiel: 11:00 - 00:00 · Objectif: 12h00</strong>" +
      "<span>Complétez les 4 pointages pour calculer les heures travaillées.</span>";
    return;
  }

  if (calculation.error) {
    workHoursSummary.className = "work-hours-summary warning";
    workHoursSummary.innerHTML = "<strong>Calcul impossible</strong><span>" + calculation.error + "</span>";
    return;
  }

  const details =
    "Présence: " + formatMinutes(calculation.totalMinutes) +
    " · Pause: " + formatMinutes(calculation.breakMinutes) +
    " · Travail réel: " + formatMinutes(calculation.workedMinutes);

  if (calculation.meetsTarget) {
    workHoursSummary.className = "work-hours-summary success";
    workHoursSummary.innerHTML =
      "<strong>" + formatMinutes(calculation.workedMinutes) + " effectuées</strong>" +
      "<span>" + details + "</span>";
    return;
  }

  workHoursSummary.className = "work-hours-summary warning";
  workHoursSummary.innerHTML =
    "<strong>Manque " + formatMinutes(calculation.missingMinutes) + "</strong>" +
    "<span>" + details + "</span>";
}

function renderScheduleDisplay(schedule) {
  if (schedule?.restDay) {
    todayScheduleDisplay.innerHTML =
      '<div class="schedule-status-row rest">' +
      '<strong>🌙 Repos / Absent</strong>' +
      "<span>Les pointages sont desactives pour cette journee.</span>" +
      "</div>";
    return;
  }

  const points = [
    { key: "arrival", icon: "🟢", label: "Arrivee" },
    { key: "lunch", icon: "🍽️", label: "Pause dejeuner" },
    { key: "returnTime", icon: "🔁", label: "Retour" },
    { key: "departure", icon: "🌙", label: "Depart" }
  ];

  const rows = points.map(function (point) {
    const stamp = schedule?.[point.key];
    const statusClass = stamp ? "done" : "pending";
    const value = stamp ? (stamp.time || stamp.dateTime) : "--:--";
    const meta = stamp ? stamp.date : "Non enregistre";

    return '<div class="schedule-point-row ' + statusClass + '">' +
      '<span class="schedule-point-icon">' + point.icon + "</span>" +
      '<div class="schedule-point-content">' +
      "<strong>" + point.label + "</strong>" +
      "<small>" + meta + "</small>" +
      "</div>" +
      '<span class="schedule-point-time">' + value + "</span>" +
      "</div>";
  }).join("");

  todayScheduleDisplay.innerHTML =
    '<div class="schedule-status-row">' +
    "<strong>Recap du jour</strong>" +
    "<span>4 etapes claires pour verifier rapidement.</span>" +
    "</div>" +
    '<div class="schedule-point-list">' + rows + "</div>";
}

function showDashboardMessage(text, isError) {
  dashboardMessage.textContent = text;
  dashboardMessage.classList.toggle("is-error", Boolean(isError));
}

function showModalFeedback(text, isError) {
  modalFeedback.textContent = text;
  modalFeedback.classList.toggle("is-error", Boolean(isError));
}

function setActiveSection(sectionName) {
  activeSection = sectionName;

  navButtons.forEach(function (button) {
    const isActive = button.dataset.section === sectionName;
    button.classList.toggle("active", isActive);
  });

  contentSections.forEach(function (section) {
    const shouldShow = section.id === "section-" + sectionName;
    section.classList.toggle("hidden", !shouldShow);
    section.setAttribute("aria-hidden", String(!shouldShow));
  });

  renderManagerSectionDetails();
}

function setActiveModalTab(tabName) {
  activeModalTab = tabName;

  modalTabButtons.forEach(function (button) {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  modalTabPanels.forEach(function (panel) {
    const shouldShow = panel.id === "tab-" + tabName;
    panel.classList.toggle("hidden", !shouldShow);
    panel.setAttribute("aria-hidden", String(!shouldShow));
  });
}

function getSelectedEmployee() {
  return employees.find(function (employee) {
    return employee.id === selectedEmployeeId;
  });
}

function createSaleId(prefix) {
  return prefix + "-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
}

function getWorkDateKeyFromISO(isoDate) {
  const date = new Date(isoDate);

  if (date.getHours() < 6) {
    date.setDate(date.getDate() - 1);
  }

  return dateKeyFromDate(date);
}

function ensureSaleEntryId(entry, prefix) {
  if (entry.id) {
    return entry.id;
  }

  entry.id = createSaleId(prefix);
  return entry.id;
}

function buildEmployeeSalesEntries() {
  const employee = getSelectedEmployee();
  if (!employee) {
    return [];
  }

  const state = ensureEmployeeData(employee.id);
  let needsSave = false;

  const serviceEntries = (state.salesHistory || []).map(function (entry) {
    const hadId = Boolean(entry.id);
    const id = ensureSaleEntryId(entry, "srv");
    if (!hadId) {
      needsSave = true;
    }

    return {
      id: id,
      type: "service",
      amount: Number(entry.amount || 0),
      dateISO: entry.dateISO,
      label: String(entry.serviceName || entry.label || "Service"),
      quantity: 1,
      source: entry
    };
  });

  const productEntries = (sharedSalonData.productSales || []).filter(function (entry) {
    return Number(entry.employeeId) === Number(employee.id);
  }).map(function (entry) {
    const hadId = Boolean(entry.id);
    const id = ensureSaleEntryId(entry, "prd");
    if (!hadId) {
      needsSave = true;
    }

    return {
      id: id,
      type: "product",
      amount: Number(entry.amount || 0),
      dateISO: entry.dateISO,
      label: entry.label || "Produit",
      quantity: Math.max(1, Number(entry.quantity || 1)),
      source: entry
    };
  });

  if (needsSave) {
    saveSharedData();
  }

  return serviceEntries.concat(productEntries).sort(function (a, b) {
    return new Date(b.dateISO) - new Date(a.dateISO);
  });
}

function renderSalesHistory() {
  const entries = buildEmployeeSalesEntries();

  if (salesTodayList) {
    const todayKey = getCurrentDateKey();
    const todayEntries = entries.filter(function (entry) {
      return getWorkDateKeyFromISO(entry.dateISO) === todayKey;
    });

    salesTodayList.innerHTML = "";

    if (todayEntries.length === 0) {
      const emptyToday = document.createElement("li");
      emptyToday.className = "modal-list-item muted";
      emptyToday.textContent = "Aucune entrée enregistrée aujourd'hui.";
      salesTodayList.appendChild(emptyToday);
    } else {
      todayEntries.forEach(function (entry) {
        const item = document.createElement("li");
        item.className = "modal-list-item";

        const iconTag = entry.type === "product" ? "📦 Produit" : "🛠️ Service";
        const detail = entry.type === "product"
          ? entry.label
          : entry.label;
        const saleDateTime = formatDateTime(entry.dateISO);

        item.innerHTML =
          '<div class="history-entry-content">' +
          "<span>" + saleDateTime + " · " + iconTag + ": " + detail + "</span>" +
          "<strong>" + formatEuroAmount(entry.amount) + "</strong>" +
          "</div>";

        salesTodayList.appendChild(item);
      });
    }
  }

  salesHistoryList.innerHTML = "";

  if (entries.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "modal-list-item muted";
    emptyItem.textContent = "Aucune vente enregistrée pour cet employé.";
    salesHistoryList.appendChild(emptyItem);
    return;
  }

  const groupedByDay = {};
  entries.forEach(function (entry) {
    const dayKey = getWorkDateKeyFromISO(entry.dateISO);
    if (!groupedByDay[dayKey]) {
      groupedByDay[dayKey] = [];
    }
    groupedByDay[dayKey].push(entry);
  });

  const dayKeys = Object.keys(groupedByDay).sort(function (a, b) {
    return new Date(b + "T12:00:00") - new Date(a + "T12:00:00");
  });

  dayKeys.forEach(function (dayKey) {
    const dayEntries = groupedByDay[dayKey];
    const dayTotal = dayEntries.reduce(function (total, entry) {
      return total + Number(entry.amount || 0);
    }, 0);

    const groupItem = document.createElement("li");
    groupItem.className = "modal-list-item sales-day-group";

    const dayDate = new Date(dayKey + "T12:00:00");
    const dayLabel = dayDate.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "sales-day-toggle";
    toggleButton.dataset.dayKey = dayKey;

    const isExpanded = salesHistoryExpandedDays.has(dayKey);
    toggleButton.setAttribute("aria-expanded", String(isExpanded));
    toggleButton.innerHTML =
      "<span>" + dayLabel + "</span>" +
      "<strong>" + dayEntries.length + " vente(s) · " + formatEuroAmount(dayTotal) + "</strong>";

    const dayDetails = document.createElement("div");
    dayDetails.className = "sales-day-details" + (isExpanded ? "" : " hidden");

    dayEntries.forEach(function (entry) {
      const row = document.createElement("div");
      row.className = "sales-day-entry";

      const dateText = new Date(entry.dateISO).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const content = document.createElement("div");
      content.className = "history-entry-content";
      const label = document.createElement("span");
      const amount = document.createElement("strong");

      const entryPrefix = entry.type === "product" ? "📦 Produit: " : "🛠️ Service: ";
      label.textContent = dateText + " · " + entryPrefix + entry.label;
      amount.textContent = formatEuroAmount(entry.amount);

      content.appendChild(label);
      content.appendChild(amount);

      row.appendChild(content);
      dayDetails.appendChild(row);
    });

    groupItem.appendChild(toggleButton);
    groupItem.appendChild(dayDetails);
    salesHistoryList.appendChild(groupItem);
  });
}

function findServiceSaleById(state, saleId) {
  return (state.salesHistory || []).find(function (entry) {
    return entry.id === saleId;
  });
}

function findProductSaleById(employeeId, saleId) {
  return (sharedSalonData.productSales || []).find(function (entry) {
    return Number(entry.employeeId) === Number(employeeId) && entry.id === saleId;
  });
}

function handleEditSaleEntry(saleType, saleId) {
  const employee = getSelectedEmployee();
  if (!employee) {
    return;
  }

  const state = ensureEmployeeData(employee.id);
  const entry = saleType === "product"
    ? findProductSaleById(employee.id, saleId)
    : findServiceSaleById(state, saleId);

  if (!entry) {
    showModalFeedback("Vente introuvable.", true);
    return;
  }

  const nextAmountRaw = window.prompt("Nouveau montant (DH)", String(Number(entry.amount || 0)));
  if (nextAmountRaw == null) {
    return;
  }

  const nextAmount = Number(nextAmountRaw);
  if (!Number.isFinite(nextAmount) || nextAmount < 0) {
    showModalFeedback("Montant invalide.", true);
    return;
  }

  entry.amount = nextAmount;

  saveSharedData();
  renderManagerObjectiveOverview();
  renderSalesHistory();
  renderManagerSectionDetails();
  showModalFeedback("Vente mise a jour.", false);
}

function handleDeleteSaleEntry(saleType, saleId) {
  const employee = getSelectedEmployee();
  if (!employee) {
    return;
  }

  const confirmed = window.confirm("Supprimer cette vente ?");
  if (!confirmed) {
    return;
  }

  const state = ensureEmployeeData(employee.id);
  if (saleType === "product") {
    sharedSalonData.productSales = (sharedSalonData.productSales || []).filter(function (entry) {
      return !(Number(entry.employeeId) === Number(employee.id) && entry.id === saleId);
    });
  } else {
    state.salesHistory = (state.salesHistory || []).filter(function (entry) {
      return entry.id !== saleId;
    });
  }

  saveSharedData();
  renderManagerObjectiveOverview();
  renderSalesHistory();
  renderManagerSectionDetails();
  showModalFeedback("Vente supprimee.", false);
}

function formatEuroAmount(amount) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0) + " DH";
}

function updateSalesTotalAmount() {
  const serviceAmount = Number(salesServiceAmountField.value || 0);
  const productUnitAmount = Number(salesProductUnitAmountField.value || 0);

  const safeServiceAmount = Number.isFinite(serviceAmount) && serviceAmount > 0 ? serviceAmount : 0;
  const safeProductUnitAmount = Number.isFinite(productUnitAmount) && productUnitAmount > 0 ? productUnitAmount : 0;
  const totalAmount = safeServiceAmount + safeProductUnitAmount;

  if (salesTotalAmountField) {
    salesTotalAmountField.value = totalAmount > 0 ? totalAmount.toFixed(2) : "";
  }
}

function readLiveSharedData() {
  const parsed = window.SalonStorage ? window.SalonStorage.loadData() : null;

  return {
    employees: Array.isArray(parsed?.employees) ? parsed.employees : employees,
    employeeData: parsed?.employeeData && typeof parsed.employeeData === "object" ? parsed.employeeData : employeeData,
    productSales: Array.isArray(parsed?.productSales) ? parsed.productSales : [],
    inventoryProducts: Array.isArray(parsed?.inventoryProducts) ? parsed.inventoryProducts : [],
    ownerProducts: Array.isArray(parsed?.ownerProducts) ? parsed.ownerProducts : []
  };
}

function formatDateTime(isoDate) {
  return new Date(isoDate).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getManagerAllSalesRecords(liveData) {
  const employeeMap = new Map((liveData.employees || []).map(function (employee) {
    return [employee.id, employee.name];
  }));
  const records = [];

  Object.entries(liveData.employeeData || {}).forEach(function (entry) {
    const employeeId = Number(entry[0]);
    const state = entry[1] || {};
    const employeeName = employeeMap.get(employeeId) || "Employé inconnu";

    (state.salesHistory || []).forEach(function (sale) {
      records.push({
        employeeId: employeeId,
        employeeName: employeeName,
        type: "service",
        amount: Number(sale.amount || 0),
        label: sale.serviceName || "Service",
        dateISO: sale.dateISO
      });
    });
  });

  (liveData.productSales || []).forEach(function (sale) {
    records.push({
      employeeId: Number(sale.employeeId),
      employeeName: employeeMap.get(Number(sale.employeeId)) || "Employé inconnu",
      type: "product",
      amount: Number(sale.amount || 0),
      label: sale.label || "Produit",
      dateISO: sale.dateISO
    });
  });

  return records;
}

function sumRecordAmounts(records) {
  return records.reduce(function (total, record) {
    return total + Number(record.amount || 0);
  }, 0);
}

function getRecordsForPeriod(records, period) {
  return records.filter(function (record) {
    return isInCurrentRange(record.dateISO, period);
  });
}

function isInCurrentRange(dateISO, range) {
  const saleWorkDateKey = getWorkDateKeyFromISO(dateISO);
  const currentWorkDateKey = getCurrentDateKey();
  const saleWorkDate = dateFromDateKey(saleWorkDateKey);
  const currentWorkDate = dateFromDateKey(currentWorkDateKey);

  if (range === "day") {
    return saleWorkDateKey === currentWorkDateKey;
  }

  if (range === "week") {
    const weekStart = new Date(currentWorkDate);
    const weekday = weekStart.getDay();
    const daysSinceMonday = weekday === 0 ? 6 : weekday - 1;
    weekStart.setDate(weekStart.getDate() - daysSinceMonday);
    weekStart.setHours(0, 0, 0, 0);
    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    return saleWorkDate >= weekStart && saleWorkDate < nextWeekStart;
  }

  return (
    saleWorkDate.getFullYear() === currentWorkDate.getFullYear() &&
    saleWorkDate.getMonth() === currentWorkDate.getMonth()
  );
}

function renderServicesDetail(liveData) {
  if (!managerServicesSummary || !managerServicesTable) {
    return;
  }

  const records = getManagerAllSalesRecords(liveData);
  const dayTotal = sumRecordAmounts(getRecordsForPeriod(records, "day"));
  const weekTotal = sumRecordAmounts(getRecordsForPeriod(records, "week"));
  const monthTotal = sumRecordAmounts(getRecordsForPeriod(records, "month"));
  const settings = readCampaignTargetSettings();
  let dayObjectiveText = "Aucun objectif";
  let weekObjectiveText = "Aucun objectif";
  let monthObjectiveText = "Aucun objectif";

  if (settings) {
    const campaignStartDate = new Date(settings.startDate + "T12:00:00");
    const campaignEndDate = new Date(settings.endDate + "T12:00:00");
    const now = new Date();
    const monthDays = getMonthOverlapDays(campaignStartDate, campaignEndDate, now);
    const weekTarget = settings.dailyTarget * 7;
    const monthTarget = settings.dailyTarget * monthDays;

    dayObjectiveText = formatEuroAmount(dayTotal) + " / " + formatEuroAmount(settings.dailyTarget);
    weekObjectiveText = formatEuroAmount(weekTotal) + " / " + formatEuroAmount(weekTarget);
    monthObjectiveText = formatEuroAmount(monthTotal) + " / " + formatEuroAmount(monthTarget);
  }

  managerServicesSummary.innerHTML =
    '<article class="employee-metric-card"><span>Aujourd\'hui</span><strong>' + formatEuroAmount(dayTotal) + "</strong></article>" +
    '<article class="employee-metric-card"><span>Cette semaine</span><strong>' + formatEuroAmount(weekTotal) + "</strong></article>" +
    '<article class="employee-metric-card"><span>Ce mois</span><strong>' + formatEuroAmount(monthTotal) + "</strong></article>" +
    '<article class="employee-metric-card"><span>Objectif jour Glossia</span><strong>' + dayObjectiveText + "</strong></article>" +
    '<article class="employee-metric-card"><span>Objectif semaine Glossia</span><strong>' + weekObjectiveText + "</strong></article>" +
    '<article class="employee-metric-card"><span>Objectif mois Glossia</span><strong>' + monthObjectiveText + "</strong></article>";

  if (records.length === 0) {
    managerServicesTable.innerHTML = '<p class="placeholder-text">Aucune vente globale enregistrée.</p>';
    return;
  }

  const grouped = {};
  records.forEach(function (record) {
    if (!grouped[record.employeeId]) {
      grouped[record.employeeId] = {
        name: record.employeeName,
        services: 0,
        products: 0,
        total: 0,
        day: 0,
        week: 0,
        month: 0
      };
    }

    if (record.type === "service") {
      grouped[record.employeeId].services += record.amount;
    } else {
      grouped[record.employeeId].products += record.amount;
    }
    grouped[record.employeeId].total += record.amount;
    if (isInCurrentRange(record.dateISO, "day")) {
      grouped[record.employeeId].day += record.amount;
    }
    if (isInCurrentRange(record.dateISO, "week")) {
      grouped[record.employeeId].week += record.amount;
    }
    if (isInCurrentRange(record.dateISO, "month")) {
      grouped[record.employeeId].month += record.amount;
    }
  });

  const rows = Object.values(grouped).sort(function (a, b) {
    return b.total - a.total;
  }).map(function (entry) {
    return "<tr>" +
      "<td>" + entry.name + "</td>" +
      "<td>" + formatEuroAmount(entry.services) + "</td>" +
      "<td>" + formatEuroAmount(entry.products) + "</td>" +
      "<td>" + formatEuroAmount(entry.total) + "</td>" +
      "<td>" + formatEuroAmount(entry.day) + "</td>" +
      "<td>" + formatEuroAmount(entry.week) + "</td>" +
      "<td>" + formatEuroAmount(entry.month) + "</td>" +
      "</tr>";
  }).join("");

  managerServicesTable.innerHTML =
    '<div class="employee-table-wrap"><table class="employee-history-table">' +
    "<thead><tr><th>Employé</th><th>Services</th><th>Produits</th><th>Total</th><th>Jour</th><th>Semaine</th><th>Mois</th></tr></thead>" +
    "<tbody>" + rows + "</tbody></table></div>";
}

function renderProductsDetail(liveData) {
  if (!managerProductsTable) {
    return;
  }

  const employeeMap = new Map((liveData.employees || []).map(function (employee) {
    return [employee.id, employee.name];
  }));
  const ownerProducts = Array.isArray(liveData.ownerProducts) ? liveData.ownerProducts : [];
  const productsById = new Map(ownerProducts.map(function (product) {
    return [Number(product.id), product];
  }));

  function getOwnerProductForSale(record) {
    const byId = Number.isFinite(Number(record.productId))
      ? productsById.get(Number(record.productId))
      : null;
    if (byId) {
      return byId;
    }

    const saleLabel = String(record.label || "").trim().toLowerCase();
    if (!saleLabel) {
      return null;
    }

    return ownerProducts.find(function (product) {
      return String(product?.name || "").trim().toLowerCase() === saleLabel;
    }) || null;
  }
  const allRecords = (liveData.productSales || []).slice().sort(function (a, b) {
    return new Date(b.dateISO) - new Date(a.dateISO);
  });

  if (allRecords.length === 0) {
    managerProductsTable.innerHTML = '<p class="placeholder-text">Aucun produit vendu enregistré.</p>';
    return;
  }

  const periodOptions = [
    { key: "all", label: "Tout" },
    { key: "day", label: "Jour" },
    { key: "week", label: "Semaine" },
    { key: "month", label: "Mois" }
  ];
  const periodTabs = periodOptions.map(function (period) {
    const isActive = period.key === activeProductsPeriod;
    return '<button type="button" class="period-tab' + (isActive ? ' active' : '') + '" data-product-period="' + period.key + '" aria-pressed="' + (isActive ? 'true' : 'false') + '">' + period.label + '</button>';
  }).join("");

  const records = activeProductsPeriod === "all"
    ? allRecords
    : allRecords.filter(function (record) {
      return isInCurrentRange(record.dateISO, activeProductsPeriod);
    });

  const periodLabelMap = {
    all: "toutes périodes",
    day: "aujourd'hui",
    week: "cette semaine",
    month: "ce mois"
  };
  const periodLabel = periodLabelMap[activeProductsPeriod] || periodLabelMap.all;

  if (records.length === 0) {
    managerProductsTable.innerHTML =
      '<div class="manager-products-period-bar"><div class="period-tabs manager-products-period-tabs" role="tablist" aria-label="Période produits vendus">' + periodTabs + "</div></div>" +
      '<p class="placeholder-text">Aucune vente produit enregistrée pour ' + periodLabel + '.</p>';
    return;
  }

  const sellerStatsMap = {};
  let totalRevenue = 0;
  let totalUnits = 0;
  let totalEmployeeProfit = 0;
  let totalPurchaseCost = 0;
  let totalNetGlossia = 0;

  records.forEach(function (record) {
    const seller = employeeMap.get(record.employeeId) || "Non assigné";
    const qty = Math.max(1, Number(record.quantity || 1));
    const amount = Number(record.amount || 0);
    const ownerProduct = getOwnerProductForSale(record);
    const unitPurchasePrice = Number(ownerProduct?.purchasePrice || ownerProduct?.costPrice || 0);
    const employeeUnitProfitFallback = Number(ownerProduct?.employeeProfit || ownerProduct?.profitMargin || 0);
    const employeeUnitProfit = Number.isFinite(Number(record.unitMargin))
      ? Number(record.unitMargin)
      : employeeUnitProfitFallback;

    const purchaseCost = Math.max(0, unitPurchasePrice) * qty;
    const employeeProfit = Math.max(0, employeeUnitProfit) * qty;
    const glossiaNet = amount - employeeProfit - purchaseCost;

    if (!sellerStatsMap[seller]) {
      sellerStatsMap[seller] = {
        seller: seller,
        salesCount: 0,
        units: 0,
        revenue: 0,
        employeeProfit: 0,
        purchaseCost: 0,
        glossiaNet: 0
      };
    }

    sellerStatsMap[seller].salesCount += 1;
    sellerStatsMap[seller].units += qty;
    sellerStatsMap[seller].revenue += amount;
    sellerStatsMap[seller].employeeProfit += employeeProfit;
    sellerStatsMap[seller].purchaseCost += purchaseCost;
    sellerStatsMap[seller].glossiaNet += glossiaNet;

    totalRevenue += amount;
    totalUnits += qty;
    totalEmployeeProfit += employeeProfit;
    totalPurchaseCost += purchaseCost;
    totalNetGlossia += glossiaNet;
  });

  const sellerStats = Object.values(sellerStatsMap).sort(function (a, b) {
    if (b.glossiaNet !== a.glossiaNet) {
      return b.glossiaNet - a.glossiaNet;
    }

    if (b.revenue !== a.revenue) {
      return b.revenue - a.revenue;
    }

    if (b.units !== a.units) {
      return b.units - a.units;
    }

    if (b.salesCount !== a.salesCount) {
      return b.salesCount - a.salesCount;
    }

    return a.seller.localeCompare(b.seller, "fr");
  });

  const topSeller = sellerStats[0];
  const averageTicket = records.length > 0 ? totalRevenue / records.length : 0;

  const rankingRows = sellerStats.map(function (entry, index) {
    return "<tr>" +
      "<td>#" + (index + 1) + "</td>" +
      "<td>" + entry.seller + "</td>" +
      "<td>" + entry.salesCount + "</td>" +
      "<td>" + entry.units + "</td>" +
      "<td>" + formatEuroAmount(entry.revenue) + "</td>" +
      "<td>" + formatEuroAmount(entry.employeeProfit) + "</td>" +
      "<td>" + formatEuroAmount(entry.purchaseCost) + "</td>" +
      "<td>" + formatEuroAmount(entry.glossiaNet) + "</td>" +
      "</tr>";
  }).join("");

  const rows = records.map(function (record) {
    const seller = employeeMap.get(record.employeeId) || "Non assigné";
    const qty = Math.max(1, Number(record.quantity || 1));
    const amount = Number(record.amount || 0);
    const ownerProduct = getOwnerProductForSale(record);
    const unitPurchasePrice = Number(ownerProduct?.purchasePrice || ownerProduct?.costPrice || 0);
    const employeeUnitProfitFallback = Number(ownerProduct?.employeeProfit || ownerProduct?.profitMargin || 0);
    const employeeUnitProfit = Number.isFinite(Number(record.unitMargin))
      ? Number(record.unitMargin)
      : employeeUnitProfitFallback;
    const purchaseCost = Math.max(0, unitPurchasePrice) * qty;
    const employeeProfit = Math.max(0, employeeUnitProfit) * qty;
    const glossiaNet = amount - employeeProfit - purchaseCost;

    return "<tr>" +
      "<td>" + formatDateTime(record.dateISO) + "</td>" +
      "<td>" + (record.label || "Produit") + "</td>" +
      "<td>" + qty + "</td>" +
      "<td>" + seller + "</td>" +
      "<td>" + formatEuroAmount(amount) + "</td>" +
      "<td>" + formatEuroAmount(employeeProfit) + "</td>" +
      "<td>" + formatEuroAmount(purchaseCost) + "</td>" +
      "<td>" + formatEuroAmount(glossiaNet) + "</td>" +
      "</tr>";
  }).join("");

  managerProductsTable.innerHTML =
    '<div class="manager-products-period-bar"><div class="period-tabs manager-products-period-tabs" role="tablist" aria-label="Période produits vendus">' + periodTabs + "</div></div>" +
    '<div class="manager-insight-grid manager-products-insight-grid">' +
    '<article class="employee-metric-card success"><span>Top vendeur</span><strong>' +
    (topSeller ? topSeller.seller : "-") +
    "</strong><small>" +
    (topSeller ? "Net Glossia: " + formatEuroAmount(topSeller.glossiaNet) + " | " + topSeller.units + " article(s)" : "-") +
    "</small></article>" +
    '<article class="employee-metric-card"><span>Total ventes produits</span><strong>' +
    formatEuroAmount(totalRevenue) +
    "</strong><small>" + records.length + " vente(s) | " + totalUnits + " article(s)</small></article>" +
    '<article class="employee-metric-card warning"><span>Ticket moyen produit</span><strong>' +
    formatEuroAmount(averageTicket) +
    "</strong><small>Net Glossia: " + formatEuroAmount(totalNetGlossia) + "</small></article>" +
    '<article class="employee-metric-card"><span>Bénéfice employé cumulé</span><strong>' +
    formatEuroAmount(totalEmployeeProfit) +
    "</strong><small>Somme part employé sur ventes produit</small></article>" +
    '<article class="employee-metric-card"><span>Prix d\'achat cumulé</span><strong>' +
    formatEuroAmount(totalPurchaseCost) +
    "</strong><small>Somme coûts d\'achat des produits vendus</small></article>" +
    '<article class="employee-metric-card success"><span>Bénéfice net Glossia</span><strong>' +
    formatEuroAmount(totalNetGlossia) +
    "</strong><small>Vente - bénéfice employé - achat</small></article>" +
    "</div>" +
    '<div class="manager-products-ranking-wrap">' +
    '<h4 class="modal-block-title manager-products-block-title">Classement vendeurs produits · ' + periodLabel + '</h4>' +
    '<div class="employee-table-wrap"><table class="employee-history-table">' +
    "<thead><tr><th>Rang</th><th>Employé</th><th>Ventes</th><th>Articles</th><th>Montant</th><th>Bénéfice employé</th><th>Prix d'achat</th><th>Net Glossia</th></tr></thead>" +
    "<tbody>" + rankingRows + "</tbody></table></div></div>" +
    '<h4 class="modal-block-title manager-products-block-title">Détail chronologique des ventes · ' + periodLabel + '</h4>' +
    '<div class="employee-table-wrap"><table class="employee-history-table">' +
    "<thead><tr><th>Date</th><th>Produit</th><th>Qté</th><th>Vendu par</th><th>Prix vente</th><th>Bénéfice employé</th><th>Prix d'achat</th><th>Net Glossia</th></tr></thead>" +
    "<tbody>" + rows + "</tbody></table></div>";
}

function renderConsumedDetail(liveData) {
  if (!managerConsumedTable) {
    return;
  }

  const products = liveData.inventoryProducts || [];
  if (products.length === 0) {
    managerConsumedTable.innerHTML = '<p class="placeholder-text">Aucun stock produit configuré.</p>';
    return;
  }

  const rows = products.map(function (product) {
    return "<tr>" +
      "<td>" + product.name + "</td>" +
      "<td>" + Number(product.consumedToday || 0) + "</td>" +
      "<td>" + Number(product.stock || 0) + "</td>" +
      "<td>" + Number(product.threshold || 0) + "</td>" +
      "</tr>";
  }).join("");

  managerConsumedTable.innerHTML =
    '<div class="employee-table-wrap"><table class="employee-history-table">' +
    "<thead><tr><th>Produit</th><th>Consommé (jour)</th><th>Stock</th><th>Seuil</th></tr></thead>" +
    "<tbody>" + rows + "</tbody></table></div>";
}

function renderRuptureDetail(liveData) {
  if (!managerRuptureTable) {
    return;
  }

  const lowStock = (liveData.inventoryProducts || []).filter(function (product) {
    return Number(product.stock || 0) <= Number(product.threshold || 0);
  });

  if (lowStock.length === 0) {
    managerRuptureTable.innerHTML = '<p class="placeholder-text">Aucun produit en rupture actuellement.</p>';
    return;
  }

  const rows = lowStock.map(function (product) {
    return "<tr>" +
      "<td>" + product.name + "</td>" +
      "<td>" + Number(product.stock || 0) + "</td>" +
      "<td>" + Number(product.threshold || 0) + "</td>" +
      "<td>À réapprovisionner</td>" +
      "</tr>";
  }).join("");

  managerRuptureTable.innerHTML =
    '<div class="employee-table-wrap"><table class="employee-history-table">' +
    "<thead><tr><th>Produit</th><th>Stock actuel</th><th>Seuil</th><th>Action</th></tr></thead>" +
    "<tbody>" + rows + "</tbody></table></div>";
}

function renderTasksDetail(liveData) {
  if (!managerTasksTable) {
    return;
  }

  const entries = (liveData.employees || []).map(function (employee) {
    const state = liveData.employeeData?.[employee.id] || {};
    const tasks = state.tasks || [];
    const doneTotal = tasks.filter(function (task) { return task.done; }).length;
    const pendingTotal = tasks.length - doneTotal;

    const doneDay = tasks.filter(function (task) {
      return task.done && task.completedAtISO && isInCurrentRange(task.completedAtISO, "day");
    }).length;

    const doneWeek = tasks.filter(function (task) {
      return task.done && task.completedAtISO && isInCurrentRange(task.completedAtISO, "week");
    }).length;

    const doneMonth = tasks.filter(function (task) {
      return task.done && task.completedAtISO && isInCurrentRange(task.completedAtISO, "month");
    }).length;

    const monthRate = tasks.length > 0 ? Math.round((doneMonth / tasks.length) * 100) : 0;
    let statusClass = "pending";
    let statusLabel = "A faire";

    if (tasks.length === 0) {
      statusClass = "pending";
      statusLabel = "A planifier";
    } else if (pendingTotal === 0) {
      statusClass = "done";
      statusLabel = "Tout fait";
    }

    return {
      employeeName: employee.name,
      doneTotal: doneTotal,
      pendingTotal: pendingTotal,
      doneDay: doneDay,
      doneWeek: doneWeek,
      doneMonth: doneMonth,
      monthRate: monthRate,
      statusClass: statusClass,
      statusLabel: statusLabel
    };
  });

  entries.sort(function (a, b) {
    if (a.statusClass !== b.statusClass) {
      return a.statusClass === "done" ? -1 : 1;
    }

    if (a.monthRate !== b.monthRate) {
      return b.monthRate - a.monthRate;
    }

    return a.employeeName.localeCompare(b.employeeName, "fr");
  });

  const rows = entries.map(function (entry) {
    return "<tr class=\"manager-task-row " + entry.statusClass + "\">" +
      "<td>" + entry.employeeName + "</td>" +
      "<td>" + entry.doneTotal + "</td>" +
      "<td>" + entry.pendingTotal + "</td>" +
      "<td>" + entry.doneDay + "</td>" +
      "<td>" + entry.doneWeek + "</td>" +
      "<td>" + entry.doneMonth + "</td>" +
      "<td><span class=\"manager-task-rate " + entry.statusClass + "\">" + entry.monthRate + "%</span></td>" +
      "<td><span class=\"manager-task-status " + entry.statusClass + "\">" + entry.statusLabel + "</span></td>" +
      "</tr>";
  }).join("");

  const totalCols = 8;

  managerTasksTable.innerHTML =
    '<div class="employee-table-wrap"><table class="employee-history-table">' +
    "<thead><tr><th>Employé</th><th>Faites</th><th>Non faites</th><th>Jour</th><th>Semaine</th><th>Mois</th><th>% Mois</th><th>Statut</th></tr></thead>" +
    "<tbody>" + (rows || '<tr><td colspan="' + totalCols + '" class="employee-empty-cell">Aucune tâche disponible.</td></tr>') + "</tbody></table></div>";
}

function renderTimeDetail(liveData) {
  if (!managerTimeTable) {
    return;
  }

  const rows = (liveData.employees || []).map(function (employee) {
    const state = liveData.employeeData?.[employee.id] || {};
    const entries = Object.entries(state.scheduleByDate || {}).sort(function (a, b) {
      return new Date(b[0]) - new Date(a[0]);
    });

    if (entries.length === 0) {
      return "<tr><td>" + employee.name + "</td><td colspan=\"5\">Aucun horaire enregistré</td></tr>";
    }

    const latest = entries[0][1] || {};
    const calc = latest.calculation;
    const worked = calc?.workedMinutes != null ? formatMinutes(calc.workedMinutes) : "-";
    const status = latest.restDay
      ? "Repos"
      : (calc?.meetsTarget ? "Objectif atteint" : (calc ? "Incomplet" : "En attente"));

    return "<tr>" +
      "<td>" + employee.name + "</td>" +
      "<td>" + (latest.arrival?.time || "-") + "</td>" +
      "<td>" + (latest.lunch?.time || "-") + "</td>" +
      "<td>" + (latest.returnTime?.time || "-") + "</td>" +
      "<td>" + (latest.departure?.time || "-") + "</td>" +
      "<td>" + worked + " · " + status + "</td>" +
      "</tr>";
  }).join("");

  managerTimeTable.innerHTML =
    '<div class="employee-table-wrap"><table class="employee-history-table">' +
    "<thead><tr><th>Employé</th><th>Arrivée</th><th>Pause</th><th>Retour</th><th>Départ</th><th>Résumé</th></tr></thead>" +
    "<tbody>" + rows + "</tbody></table></div>";
}

function renderManagerSectionDetails() {
  const liveData = readLiveSharedData();
  renderServicesDetail(liveData);
  renderProductsDetail(liveData);
  renderConsumedDetail(liveData);
  renderRuptureDetail(liveData);
  renderTasksDetail(liveData);
  renderTimeDetail(liveData);
}

function readCampaignTargetSettings() {
  const parsedData = window.SalonStorage ? window.SalonStorage.loadData() : null;
  if (!parsedData) {
    return null;
  }

  const settings = parsedData?.ownerCampaignTarget;
  const dailyTarget = Number(settings?.dailyTarget);
  if (!settings?.startDate || !settings?.endDate || !Number.isFinite(dailyTarget) || dailyTarget <= 0) {
    return null;
  }

  const startDate = new Date(settings.startDate + "T12:00:00");
  const endDate = new Date(settings.endDate + "T12:00:00");
  if (endDate < startDate) {
    return null;
  }

  return {
    startDate: settings.startDate,
    endDate: settings.endDate,
    dailyTarget: dailyTarget
  };
}

function countDaysInclusive(startDate, endDate) {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.floor((endDate.getTime() - startDate.getTime()) / dayMs) + 1;
}

function getMonthOverlapDays(campaignStartDate, campaignEndDate, now) {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 12, 0, 0, 0);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 12, 0, 0, 0);
  const overlapStart = new Date(Math.max(campaignStartDate.getTime(), monthStart.getTime()));
  const overlapEnd = new Date(Math.min(campaignEndDate.getTime(), monthEnd.getTime()));

  if (overlapEnd < overlapStart) {
    return 0;
  }

  return countDaysInclusive(overlapStart, overlapEnd);
}

function getSalesForPeriod(state, period) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  const weekday = todayStart.getDay();
  const daysSinceMonday = weekday === 0 ? 6 : weekday - 1;
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - daysSinceMonday);
  const nextWeekStart = new Date(weekStart);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);

  return (state.salesHistory || []).filter(function (sale) {
    const saleDate = new Date(sale.dateISO);

    if (period === "day") {
      return saleDate >= todayStart && saleDate < tomorrowStart;
    }

    if (period === "week") {
      return saleDate >= weekStart && saleDate < nextWeekStart;
    }

    return saleDate >= monthStart && saleDate < nextMonthStart;
  });
}

function sumSales(sales) {
  return sales.reduce(function (total, sale) {
    return total + Number(sale.amount || 0);
  }, 0);
}

function getCampaignSalesTotal(state, campaignStartDate, campaignEndDate) {
  return sumSales((state.salesHistory || []).filter(function (sale) {
    const saleDate = new Date(sale.dateISO);
    return saleDate >= campaignStartDate && saleDate <= campaignEndDate;
  }));
}

function getCombinedEmployeeSales(liveData, employeeId) {
  const state = liveData.employeeData?.[employeeId] || { salesHistory: [] };
  const serviceRecords = (state.salesHistory || []).map(function (sale) {
    return { amount: Number(sale.amount || 0), dateISO: sale.dateISO };
  });
  const productRecords = (liveData.productSales || []).filter(function (sale) {
    return Number(sale.employeeId) === Number(employeeId);
  }).map(function (sale) {
    return { amount: Number(sale.amount || 0), dateISO: sale.dateISO };
  });

  return serviceRecords.concat(productRecords);
}

function sumCombinedSalesForPeriod(records, period) {
  return sumRecordAmounts(getRecordsForPeriod(records, period));
}

function getCombinedCampaignSalesTotal(records, campaignStartDate, campaignEndDate) {
  return sumRecordAmounts(records.filter(function (sale) {
    const saleDate = new Date(sale.dateISO);
    return saleDate >= campaignStartDate && saleDate <= campaignEndDate;
  }));
}

function getProgressMeta(actual, target) {
  const percentage = target > 0 ? (actual / target) * 100 : 0;
  const remaining = Math.max(0, target - actual);
  let className = "danger";

  if (percentage >= 100) {
    className = "success";
  } else if (percentage >= 50) {
    className = "warning";
  }

  return {
    percentage: Math.max(0, percentage),
    fillWidth: Math.min(100, Math.max(0, percentage)),
    remaining: remaining,
    className: className
  };
}

function createObjectiveRow(label, actual, target) {
  const progress = getProgressMeta(actual, target);
  const row = document.createElement("article");
  row.className = "manager-objective-item";

  const title = document.createElement("strong");
  title.textContent = label;

  const metrics = document.createElement("p");
  metrics.className = "manager-objective-metrics";
  metrics.textContent =
    "Objectif: " + formatEuroAmount(target) +
    " | Réalisé: " + formatEuroAmount(actual) +
    " | Reste: " + formatEuroAmount(progress.remaining);

  const track = document.createElement("div");
  track.className = "manager-objective-track";

  const fill = document.createElement("span");
  fill.className = "manager-objective-fill " + progress.className;
  fill.style.width = progress.fillWidth + "%";
  track.appendChild(fill);

  const percentage = document.createElement("small");
  percentage.className = "manager-objective-percentage " + progress.className;
  percentage.textContent = Math.round(progress.percentage) + "% atteint";

  row.appendChild(title);
  row.appendChild(metrics);
  row.appendChild(track);
  row.appendChild(percentage);
  return row;
}

function renderManagerObjectiveOverview() {
  const employee = getSelectedEmployee();
  const settings = readCampaignTargetSettings();
  managerObjectiveOverview.innerHTML = "";

  if (!employee || !settings) {
    const empty = document.createElement("p");
    empty.className = "manager-objective-empty";
    empty.textContent = "Aucun objectif partagé défini par le propriétaire.";
    managerObjectiveOverview.appendChild(empty);
    return;
  }

  const liveData = readLiveSharedData();
  const campaignStartDate = new Date(settings.startDate + "T12:00:00");
  const campaignEndDate = new Date(settings.endDate + "T12:00:00");
  const now = new Date();
  const monthDays = getMonthOverlapDays(campaignStartDate, campaignEndDate, now);
  const campaignDays = countDaysInclusive(campaignStartDate, campaignEndDate);

  const allRecords = getManagerAllSalesRecords(liveData);
  const employeeRecords = getCombinedEmployeeSales(liveData, employee.id);

  const daySales = sumCombinedSalesForPeriod(employeeRecords, "day");
  const weekSales = sumCombinedSalesForPeriod(employeeRecords, "week");
  const monthSales = sumCombinedSalesForPeriod(employeeRecords, "month");
  const campaignSales = getCombinedCampaignSalesTotal(employeeRecords, campaignStartDate, campaignEndDate);

  const globalDaySales = sumCombinedSalesForPeriod(allRecords, "day");
  const globalWeekSales = sumCombinedSalesForPeriod(allRecords, "week");
  const globalMonthSales = sumCombinedSalesForPeriod(allRecords, "month");
  const globalCampaignSales = getCombinedCampaignSalesTotal(allRecords, campaignStartDate, campaignEndDate);

  const targets = {
    day: settings.dailyTarget,
    week: settings.dailyTarget * 7,
    month: settings.dailyTarget * monthDays,
    campaign: settings.dailyTarget * campaignDays
  };

  const globalTitle = document.createElement("h5");
  globalTitle.className = "manager-objective-group-title";
  globalTitle.textContent = "Glossia global";
  managerObjectiveOverview.appendChild(globalTitle);
  managerObjectiveOverview.appendChild(createObjectiveRow("Objectif du jour", globalDaySales, targets.day));
  managerObjectiveOverview.appendChild(createObjectiveRow("Objectif semaine", globalWeekSales, targets.week));
  managerObjectiveOverview.appendChild(createObjectiveRow("Objectif mois", globalMonthSales, targets.month));
  managerObjectiveOverview.appendChild(createObjectiveRow("Objectif campagne", globalCampaignSales, targets.campaign));

  const employeeTitle = document.createElement("h5");
  employeeTitle.className = "manager-objective-group-title";
  employeeTitle.textContent = employee.name + " · Réalisé personnel";
  managerObjectiveOverview.appendChild(employeeTitle);
  managerObjectiveOverview.appendChild(createObjectiveRow("Ventes du jour", daySales, targets.day));
  managerObjectiveOverview.appendChild(createObjectiveRow("Ventes semaine", weekSales, targets.week));
  managerObjectiveOverview.appendChild(createObjectiveRow("Ventes mois", monthSales, targets.month));
  managerObjectiveOverview.appendChild(createObjectiveRow("Ventes campagne", campaignSales, targets.campaign));
}

function renderTaskList() {
  const state = ensureEmployeeData(selectedEmployeeId);

  taskList.innerHTML = "";

  if (state.tasks.length === 0) {
    const emptyText = document.createElement("p");
    emptyText.className = "muted";
    emptyText.textContent = "Aucune tâche pour le moment.";
    taskList.appendChild(emptyText);
    return;
  }

  state.tasks.forEach(function (task, index) {
    const row = document.createElement("label");
    row.className = "task-item";
    row.classList.toggle("is-done", Boolean(task.done));

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.dataset.taskIndex = String(index);

    const text = document.createElement("span");
    text.textContent = task.text;
    text.className = task.done ? "task-done" : "";

    row.appendChild(checkbox);
    row.appendChild(text);
    taskList.appendChild(row);
  });
}

function renderTodaySchedule() {
  const state = ensureEmployeeData(selectedEmployeeId);
  const dateKey = activeScheduleDateKey || getCurrentDateKey();
  const todaySchedule = state.scheduleByDate[dateKey] || {};
  todaySchedule.restDay = Boolean(todaySchedule.restDay);

  calculateDailyWork(todaySchedule);

  if (scheduleDatePicker) {
    scheduleDatePicker.value = dateKey;
  }

  if (scheduleDayTitle) {
    scheduleDayTitle.textContent = "Horaires · " + formatDateKeyForHeading(dateKey);
  }

  if (scheduleToggleRestButton) {
    scheduleToggleRestButton.textContent = todaySchedule.restDay
      ? "Retirer repos"
      : "Marquer repos";
  }

  scheduleStampButtons.forEach(function (button) {
    const stampKey = button.dataset.stampKey;
    const stamp = todaySchedule[stampKey];
    const timeSpan = button.querySelector(".stamp-time");

    if (timeSpan) {
      timeSpan.textContent = stamp ? stamp.dateTime : "--/--/---- - --:--";
    }

    button.classList.toggle("is-done", Boolean(stamp));
    button.disabled = todaySchedule.restDay || Boolean(stamp);
  });

  renderScheduleDisplay(todaySchedule);

  renderWorkHoursSummary(todaySchedule);
}

function setActiveScheduleDate(dateKey) {
  activeScheduleDateKey = dateKey;
  renderTodaySchedule();
}

function openEmployeeModal(employee) {
  selectedEmployeeId = employee.id;
  ensureEmployeeData(selectedEmployeeId);
  activeScheduleDateKey = getCurrentDateKey();

  selectedEmployeeLabel.textContent = employee.name + " - " + employee.post;
  salesServiceAmountField.value = "";
  salesProductUnitAmountField.value = "";
  salesProductUnitAmountField.readOnly = false;
  updateSalesTotalAmount();
  showModalFeedback("", false);

  setActiveModalTab("ventes");
  renderManagerObjectiveOverview();
  renderSalesHistory();
  renderTaskList();
  renderTodaySchedule();

  salesModal.classList.remove("hidden");
}

function closeEmployeeModal() {
  salesModal.classList.add("hidden");
}

function refreshManagerFromSharedStorage() {
  if (window.SalonStorage) {
    const latestData = window.SalonStorage.loadData();
    if (latestData && typeof latestData === "object") {
      sharedSalonData = latestData;

      const latestEmployees = Array.isArray(latestData.employees)
        ? latestData.employees
        : [];
      employees.splice(0, employees.length, ...latestEmployees);

      Object.keys(employeeData).forEach(function (key) {
        delete employeeData[key];
      });

      if (latestData.employeeData && typeof latestData.employeeData === "object") {
        Object.assign(employeeData, latestData.employeeData);
      }

      nextEmployeeId = employees.reduce(function (highestId, employee) {
        return Math.max(highestId, Number(employee.id) || 0);
      }, 0) + 1;
    }
  }

  renderEmployees();
  renderManagerSectionDetails();
  renderManagerAccessRows();

  if (!salesModal.classList.contains("hidden") && getSelectedEmployee()) {
    renderManagerObjectiveOverview();
    renderSalesHistory();
    renderTaskList();
    renderTodaySchedule();
  }
}

function renderEmployees() {
  employeeList.innerHTML = "";

  employees.forEach(function (employee) {
    const employeeButton = document.createElement("button");
    employeeButton.type = "button";
    employeeButton.className = "employee-card";
    employeeButton.setAttribute(
      "aria-label",
      "Ouvrir la fiche de " + employee.name + ", " + employee.post
    );

    const avatar = document.createElement("span");
    avatar.className = "employee-avatar";
    avatar.textContent = employee.name.charAt(0).toUpperCase();

    const status = document.createElement("span");
    status.className = "employee-status";
    status.textContent = "Disponible";

    const name = document.createElement("strong");
    name.className = "employee-name";
    name.textContent = employee.name;

    const post = document.createElement("span");
    post.className = "employee-post";
    post.textContent = employee.post;

    employeeButton.appendChild(avatar);
    employeeButton.appendChild(status);
    employeeButton.appendChild(name);
    employeeButton.appendChild(post);

    employeeButton.addEventListener("click", function () {
      openEmployeeModal(employee);
    });

    employeeList.appendChild(employeeButton);
  });
}

employees.forEach(function (employee) {
  ensureEmployeeData(employee.id);
});
saveSharedData();

navButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    setActiveSection(button.dataset.section);
  });
});

modalTabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    setActiveModalTab(button.dataset.tab);
  });
});

toggleAddFormButton.addEventListener("click", function () {
  addEmployeeForm.classList.toggle("hidden");
});

addEmployeeForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = employeeNameField.value.trim();
  const postRaw = employeePostField.value.trim();

  if (!name || !postRaw) {
    showDashboardMessage("Veuillez remplir le nom et le numéro du poste.", true);
    return;
  }

  const normalizedPost = postRaw.toLowerCase().startsWith("post")
    ? postRaw
    : "Post " + postRaw;

  const newEmployee = {
    id: nextEmployeeId,
    name: name,
    post: normalizedPost
  };

  employees.push(newEmployee);
  ensureEmployeeData(newEmployee.id);

  nextEmployeeId += 1;
  saveSharedData();
  renderEmployees();
  renderManagerSectionDetails();
  addEmployeeForm.reset();
  addEmployeeForm.classList.add("hidden");
  showDashboardMessage("Employé ajouté avec succès.");
});

salesForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const employee = getSelectedEmployee();
  if (!employee) {
    showModalFeedback("Employé introuvable.", true);
    return;
  }

  const state = ensureEmployeeData(employee.id);
  const dateISO = new Date().toISOString();

  const serviceAmount = Number(salesServiceAmountField.value || 0);

  const productUnitAmount = Number(salesProductUnitAmountField.value || 0);

  const wantsService = Number.isFinite(serviceAmount) && serviceAmount > 0;
  const wantsProduct = Number.isFinite(productUnitAmount) && productUnitAmount > 0;

  if (!wantsService && !wantsProduct) {
    showModalFeedback("Saisissez au moins un montant: service ou produit.", true);
    return;
  }

  if (wantsService) {
    state.salesHistory.push({
      id: createSaleId("srv"),
      serviceName: "Service",
      amount: serviceAmount,
      dateISO: dateISO
    });
  }

  if (wantsProduct) {
    if (!Array.isArray(sharedSalonData.productSales)) {
      sharedSalonData.productSales = [];
    }

    sharedSalonData.productSales.push({
      id: createSaleId("prd"),
      employeeId: employee.id,
      productId: null,
      label: "Produit",
      quantity: 1,
      unitMargin: 0,
      unitPrice: productUnitAmount,
      amount: productUnitAmount,
      dateISO: dateISO
    });
  }

  saveSharedData();
  salesServiceAmountField.value = "";
  salesProductUnitAmountField.value = "";
  salesProductUnitAmountField.readOnly = false;
  updateSalesTotalAmount();
  renderManagerObjectiveOverview();
  renderSalesHistory();
  renderManagerSectionDetails();
  showModalFeedback("Vente enregistrée pour " + employee.name + ".", false);
});

if (salesServiceAmountField) {
  salesServiceAmountField.addEventListener("input", function () {
    updateSalesTotalAmount();
  });
}

if (salesProductUnitAmountField) {
  salesProductUnitAmountField.addEventListener("input", function () {
    updateSalesTotalAmount();
  });
}

if (managerProductsTable) {
  managerProductsTable.addEventListener("click", function (event) {
    const periodButton = event.target.closest("[data-product-period]");
    if (!periodButton) {
      return;
    }

    const nextPeriod = periodButton.dataset.productPeriod;
    if (!nextPeriod || nextPeriod === activeProductsPeriod) {
      return;
    }

    activeProductsPeriod = nextPeriod;
    renderProductsDetail(readLiveSharedData());
  });
}

salesHistoryList.addEventListener("click", function (event) {
  const dayToggle = event.target.closest(".sales-day-toggle");
  if (dayToggle) {
    const dayKey = dayToggle.dataset.dayKey;
    if (dayKey) {
      if (salesHistoryExpandedDays.has(dayKey)) {
        salesHistoryExpandedDays.delete(dayKey);
      } else {
        salesHistoryExpandedDays.add(dayKey);
      }
      renderSalesHistory();
    }
    return;
  }
});

taskList.addEventListener("change", function (event) {
  const target = event.target;

  if (target.tagName !== "INPUT" || target.type !== "checkbox") {
    return;
  }

  const taskIndex = Number(target.dataset.taskIndex);
  if (Number.isNaN(taskIndex)) {
    return;
  }

  const state = ensureEmployeeData(selectedEmployeeId);
  const task = state.tasks[taskIndex];
  if (!task) {
    return;
  }

  task.done = target.checked;
  task.completedAtISO = target.checked ? new Date().toISOString() : null;
  saveSharedData();
  renderTaskList();
  renderManagerSectionDetails();
});

scheduleStampContainer.addEventListener("click", function (event) {
  const button = event.target.closest(".stamp-btn");
  if (!button) {
    return;
  }

  const stampKey = button.dataset.stampKey;
  if (!stampKey) {
    return;
  }

  const employee = getSelectedEmployee();
  if (!employee) {
    showModalFeedback("Employé introuvable.", true);
    return;
  }

  const state = ensureEmployeeData(employee.id);
  const dateKey = activeScheduleDateKey || getCurrentDateKey();
  if (!state.scheduleByDate[dateKey]) {
    state.scheduleByDate[dateKey] = {};
  }

  if (state.scheduleByDate[dateKey].restDay) {
    showModalFeedback("Cette journee est marquee comme repos.", true);
    return;
  }

  if (state.scheduleByDate[dateKey][stampKey]) {
    showModalFeedback("Horaire déjà enregistré pour " + scheduleFieldLabels[stampKey] + ".", true);
    return;
  }

  const stamp = createDateTimeStamp();
  state.scheduleByDate[dateKey][stampKey] = stamp;
  state.scheduleByDate[dateKey].savedAtISO = stamp.iso;

  renderTodaySchedule();
  saveSharedData();
  renderManagerSectionDetails();
  showModalFeedback(scheduleFieldLabels[stampKey] + " enregistré le " + stamp.dateTime + ".", false);
});

if (scheduleDatePicker) {
  scheduleDatePicker.addEventListener("change", function () {
    if (!scheduleDatePicker.value) {
      return;
    }

    setActiveScheduleDate(scheduleDatePicker.value);
  });
}

if (schedulePrevDayButton) {
  schedulePrevDayButton.addEventListener("click", function () {
    const baseDate = dateFromDateKey(activeScheduleDateKey || getCurrentDateKey());
    baseDate.setDate(baseDate.getDate() - 1);
    setActiveScheduleDate(dateKeyFromDate(baseDate));
  });
}

if (scheduleNextDayButton) {
  scheduleNextDayButton.addEventListener("click", function () {
    const baseDate = dateFromDateKey(activeScheduleDateKey || getCurrentDateKey());
    baseDate.setDate(baseDate.getDate() + 1);
    setActiveScheduleDate(dateKeyFromDate(baseDate));
  });
}

if (scheduleToggleRestButton) {
  scheduleToggleRestButton.addEventListener("click", function () {
    const employee = getSelectedEmployee();
    if (!employee) {
      return;
    }

    const state = ensureEmployeeData(employee.id);
    const dateKey = activeScheduleDateKey || getCurrentDateKey();
    if (!state.scheduleByDate[dateKey]) {
      state.scheduleByDate[dateKey] = {};
    }

    const schedule = state.scheduleByDate[dateKey];
    schedule.restDay = !schedule.restDay;

    if (schedule.restDay) {
      delete schedule.arrival;
      delete schedule.lunch;
      delete schedule.returnTime;
      delete schedule.departure;
      schedule.calculation = {
        restDay: true,
        totalMinutes: 0,
        breakMinutes: 0,
        workedMinutes: 0,
        missingMinutes: 0,
        meetsTarget: true,
        calculatedAtISO: new Date().toISOString()
      };
      showModalFeedback("Journee marquee comme repos.", false);
    } else {
      schedule.calculation = null;
      showModalFeedback("Repos retire pour cette journee.", false);
    }

    saveSharedData();
    renderTodaySchedule();
    renderManagerSectionDetails();
  });
}

closeModalButton.addEventListener("click", function () {
  closeEmployeeModal();
});

if (openAccessModalButton) {
  openAccessModalButton.addEventListener("click", function () {
    openManagerAccessModal();
  });
}

if (closeAccessModalButton) {
  closeAccessModalButton.addEventListener("click", function () {
    closeManagerAccessModal();
  });
}

if (managerAccessForm) {
  managerAccessForm.addEventListener("submit", function (event) {
    event.preventDefault();
    saveManagerEmployeePasswords();
  });
}

if (managerAccessModal) {
  managerAccessModal.addEventListener("click", function (event) {
    if (event.target === managerAccessModal) {
      closeManagerAccessModal();
    }
  });
}

salesModal.addEventListener("click", function (event) {
  if (event.target === salesModal) {
    closeEmployeeModal();
  }
});

window.addEventListener("salon-storage-saved", function () {
  refreshManagerFromSharedStorage();
});

window.addEventListener("storage", function (event) {
  if (event.key && event.key !== "salonData") {
    return;
  }

  refreshManagerFromSharedStorage();
});

setActiveSection(activeSection);
renderEmployees();
renderManagerSectionDetails();

function setupPricePresetGrids() {
  document.querySelectorAll(".price-preset-grid").forEach(function (grid) {
    const input = document.getElementById(grid.getAttribute("data-preset-for"));
    if (!input) {
      return;
    }

    for (let amount = 5; amount <= 100; amount += 5) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "price-preset-btn";
      btn.textContent = amount + " DH";
      btn.dataset.amount = String(amount);
      btn.addEventListener("click", function () {
        input.value = amount;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      grid.appendChild(btn);
    }
  });
}

function syncPricePresetActiveStates() {
  document.querySelectorAll(".price-preset-grid").forEach(function (grid) {
    const input = document.getElementById(grid.getAttribute("data-preset-for"));
    if (!input) {
      return;
    }

    const current = String(Number(input.value || 0));
    grid.querySelectorAll(".price-preset-btn").forEach(function (btn) {
      btn.classList.toggle("active", input.value !== "" && btn.dataset.amount === current);
    });
  });
}

setupPricePresetGrids();

const baseUpdateSalesTotalAmount = updateSalesTotalAmount;
updateSalesTotalAmount = function () {
  baseUpdateSalesTotalAmount.apply(this, arguments);
  syncPricePresetActiveStates();
};
