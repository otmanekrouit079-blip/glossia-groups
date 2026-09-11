// In-memory list of employees shown as room/post cards.
const employees = [
  { id: 1, name: "Ahmed", post: "منصب 1" },
  { id: 2, name: "Youssef", post: "منصب 2" }
];

const defaultTasks = [
  "نظف المرايا",
  "نظف الكرسي",
  "نظف المراحيض"
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
const scheduleToggleRestButton = document.getElementById("schedule-toggle-rest");
const scheduleDayTitle = document.getElementById("schedule-day-title");

const managerServicesSummary = document.getElementById("manager-services-summary");
const managerServicesTable = document.getElementById("manager-services-table");

const accountsDetailModal = document.getElementById("accounts-detail-modal");
const accountsDetailTitle = document.getElementById("accounts-detail-title");
const accountsDetailSubtitle = document.getElementById("accounts-detail-subtitle");
const accountsDetailSummary = document.getElementById("accounts-detail-summary");
const accountsDetailStart = document.getElementById("accounts-detail-start");
const accountsDetailEnd = document.getElementById("accounts-detail-end");
const accountsDetailApply = document.getElementById("accounts-detail-apply");
const accountsDetailRangeTotal = document.getElementById("accounts-detail-range-total");
const accountsDetailList = document.getElementById("accounts-detail-list");
const accountsDetailClose = document.getElementById("accounts-detail-close");
const accountsDetailCloseIcon = document.getElementById("accounts-detail-close-icon");
let accountsDetailEmployeeId = null;
const managerProductsTable = document.getElementById("manager-products-table");
const managerConsumedTable = document.getElementById("manager-consumed-table");

const stockRequestForm = document.getElementById("stock-request-form");
const stockRequestPhotoInput = document.getElementById("stock-request-photo");
const stockRequestPreview = document.getElementById("stock-request-preview");
const stockRequestPreviewImg = document.getElementById("stock-request-preview-img");
const stockRequestTypeToggle = document.getElementById("stock-request-type-toggle");
const stockRequestNameInput = document.getElementById("stock-request-name");
const stockRequestQuantityInput = document.getElementById("stock-request-quantity");
const stockRequestFeedback = document.getElementById("stock-request-feedback");
let stockRequestPhotoDataUrl = null;
let stockRequestType = "salle";
const managerRuptureTable = document.getElementById("manager-rupture-table");
const managerTasksTable = document.getElementById("manager-tasks-table");
const managerTimeTable = document.getElementById("manager-time-table");

const requiredWorkMinutes = 12 * 60;

const scheduleFieldLabels = {
  arrival: "الوصول",
  lunch: "وقفة الغدا",
  returnTime: "الرجوع",
  departure: "المغادرة"
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
    managerAccessBody.innerHTML = '<tr><td colspan="3" class="employee-empty-cell">ماكاين حتى موظف متوفر.</td></tr>';
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
      managerAccessFeedback.textContent = "خاص كل موظف يكون عندو كلمة سر.";
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
    managerAccessFeedback.textContent = "كلمات السر ديال الموظفين تبدلات.";
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
      error: "التسجيلات ماشي فترتيب الوقت الصحيح.",
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
      "<strong>راحة / غايب</strong>" +
      "<span>هاد اليوم معلم كراحة. ماكاين حتى تنبيه ديال الساعات الناقصة.</span>";
    return;
  }

  if (!calculation) {
    workHoursSummary.className = "work-hours-summary pending";
    workHoursSummary.innerHTML =
      "<strong>التوقيت الرسمي: 11:00 - 00:00 · الهدف: 12h00</strong>" +
      "<span>كمل الـ4 تسجيلات باش تتحسب الساعات المشتغلة.</span>";
    return;
  }

  if (calculation.error) {
    workHoursSummary.className = "work-hours-summary warning";
    workHoursSummary.innerHTML = "<strong>ماقدرش يتحسب</strong><span>" + calculation.error + "</span>";
    return;
  }

  const details =
    "الحضور: " + formatMinutes(calculation.totalMinutes) +
    " · الوقفة: " + formatMinutes(calculation.breakMinutes) +
    " · الخدمة الحقيقية: " + formatMinutes(calculation.workedMinutes);

  if (calculation.meetsTarget) {
    workHoursSummary.className = "work-hours-summary success";
    workHoursSummary.innerHTML =
      "<strong>" + formatMinutes(calculation.workedMinutes) + " كاملة</strong>" +
      "<span>" + details + "</span>";
    return;
  }

  workHoursSummary.className = "work-hours-summary warning";
  workHoursSummary.innerHTML =
    "<strong>باقي " + formatMinutes(calculation.missingMinutes) + "</strong>" +
    "<span>" + details + "</span>";
}

function renderScheduleDisplay(schedule) {
  if (schedule?.restDay) {
    todayScheduleDisplay.innerHTML =
      '<div class="schedule-status-row rest">' +
      '<strong>🌙 راحة / غايب</strong>' +
      "<span>التسجيلات معطلة لهاد اليوم.</span>" +
      "</div>";
    return;
  }

  const points = [
    { key: "arrival", icon: "🟢", label: "الوصول" },
    { key: "lunch", icon: "🍽️", label: "وقفة الغدا" },
    { key: "returnTime", icon: "🔁", label: "الرجوع" },
    { key: "departure", icon: "🌙", label: "المغادرة" }
  ];

  const rows = points.map(function (point) {
    const stamp = schedule?.[point.key];
    const statusClass = stamp ? "done" : "pending";
    const value = stamp ? (stamp.time || stamp.dateTime) : "--:--";
    const meta = stamp ? stamp.date : "ماتسجلتش";

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
    "<strong>ملخص اليوم</strong>" +
    "<span>4 مراحل واضحة باش تتأكد بسرعة.</span>" +
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
      label: String(entry.serviceName || entry.label || "خدمة"),
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
      label: entry.label || "منتوج",
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
      emptyToday.textContent = "ماكاين حتى إدخال مسجل اليوم.";
      salesTodayList.appendChild(emptyToday);
    } else {
      todayEntries.forEach(function (entry) {
        const item = document.createElement("li");
        item.className = "modal-list-item";

        const iconTag = entry.type === "product" ? "📦 منتوج" : "🛠️ خدمة";
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
    emptyItem.textContent = "ماكاين حتى بيعة مسجلة لهاد الموظف.";
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
      "<strong>" + dayEntries.length + " بيعة · " + formatEuroAmount(dayTotal) + "</strong>";

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

      const entryPrefix = entry.type === "product" ? "📦 منتوج: " : "🛠️ خدمة: ";
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
    showModalFeedback("البيعة ماتلقاتش.", true);
    return;
  }

  const nextAmountRaw = window.prompt("المبلغ الجديد (DH)", String(Number(entry.amount || 0)));
  if (nextAmountRaw == null) {
    return;
  }

  const nextAmount = Number(nextAmountRaw);
  if (!Number.isFinite(nextAmount) || nextAmount < 0) {
    showModalFeedback("المبلغ ماشي صحيح.", true);
    return;
  }

  entry.amount = nextAmount;

  saveSharedData();
  renderManagerObjectiveOverview();
  renderSalesHistory();
  renderManagerSectionDetails();
  showModalFeedback("البيعة تبدلات.", false);
}

function handleDeleteSaleEntry(saleType, saleId) {
  const employee = getSelectedEmployee();
  if (!employee) {
    return;
  }

  const confirmed = window.confirm("تمسح هاد البيعة؟");
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
  showModalFeedback("البيعة تمسحات.", false);
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
    ownerProducts: Array.isArray(parsed?.ownerProducts) ? parsed.ownerProducts : [],
    stockRequests: Array.isArray(parsed?.stockRequests) ? parsed.stockRequests : (sharedSalonData.stockRequests || [])
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
    const employeeName = employeeMap.get(employeeId) || "موظف مجهول";

    (state.salesHistory || []).forEach(function (sale) {
      records.push({
        employeeId: employeeId,
        employeeName: employeeName,
        type: "service",
        amount: Number(sale.amount || 0),
        label: sale.serviceName || "خدمة",
        dateISO: sale.dateISO
      });
    });
  });

  (liveData.productSales || []).forEach(function (sale) {
    records.push({
      employeeId: Number(sale.employeeId),
      employeeName: employeeMap.get(Number(sale.employeeId)) || "موظف مجهول",
      type: "product",
      amount: Number(sale.amount || 0),
      label: sale.label || "منتوج",
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
  let dayObjectiveText = "ماكاين حتى هدف";
  let weekObjectiveText = "ماكاين حتى هدف";
  let monthObjectiveText = "ماكاين حتى هدف";

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
    '<article class="employee-metric-card"><span>اليوم</span><strong>' + formatEuroAmount(dayTotal) + "</strong></article>" +
    '<article class="employee-metric-card"><span>هاد السيمانة</span><strong>' + formatEuroAmount(weekTotal) + "</strong></article>" +
    '<article class="employee-metric-card"><span>هاد الشهر</span><strong>' + formatEuroAmount(monthTotal) + "</strong></article>" +
    '<article class="employee-metric-card"><span>هدف اليوم Glossia</span><strong>' + dayObjectiveText + "</strong></article>" +
    '<article class="employee-metric-card"><span>هدف السيمانة Glossia</span><strong>' + weekObjectiveText + "</strong></article>" +
    '<article class="employee-metric-card"><span>هدف الشهر Glossia</span><strong>' + monthObjectiveText + "</strong></article>";

  if (records.length === 0) {
    managerServicesTable.innerHTML = '<p class="placeholder-text">ماكاين حتى بيعة شاملة مسجلة.</p>';
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

  const rows = Object.entries(grouped).sort(function (a, b) {
    return b[1].total - a[1].total;
  }).map(function (pair) {
    const employeeId = pair[0];
    const entry = pair[1];
    return "<tr>" +
      "<td>" + entry.name + "</td>" +
      "<td>" + formatEuroAmount(entry.services) + "</td>" +
      "<td>" + formatEuroAmount(entry.products) + "</td>" +
      "<td>" + formatEuroAmount(entry.total) + "</td>" +
      "<td>" + formatEuroAmount(entry.day) + "</td>" +
      "<td>" + formatEuroAmount(entry.week) + "</td>" +
      "<td>" + formatEuroAmount(entry.month) + "</td>" +
      "<td><button type=\"button\" class=\"manager-btn manager-btn-muted accounts-detail-btn\" data-employee-id=\"" + employeeId + "\">التفاصيل</button></td>" +
      "</tr>";
  }).join("");

  managerServicesTable.innerHTML =
    '<div class="employee-table-wrap"><table class="employee-history-table">' +
    "<thead><tr><th>الموظف</th><th>الخدمات</th><th>المنتوجات</th><th>المجموع</th><th>اليوم</th><th>السيمانة</th><th>الشهر</th><th></th></tr></thead>" +
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
    managerProductsTable.innerHTML = '<p class="placeholder-text">ماكاين حتى منتوج مبيع مسجل.</p>';
    return;
  }

  const periodOptions = [
    { key: "all", label: "الكل" },
    { key: "day", label: "اليوم" },
    { key: "week", label: "السيمانة" },
    { key: "month", label: "الشهر" }
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
    all: "جميع الفترات",
    day: "اليوم",
    week: "هاد السيمانة",
    month: "هاد الشهر"
  };
  const periodLabel = periodLabelMap[activeProductsPeriod] || periodLabelMap.all;

  if (records.length === 0) {
    managerProductsTable.innerHTML =
      '<div class="manager-products-period-bar"><div class="period-tabs manager-products-period-tabs" role="tablist" aria-label="فترة المنتوجات المبيعة">' + periodTabs + "</div></div>" +
      '<p class="placeholder-text">ماكاين حتى بيعة منتوج مسجلة ل' + periodLabel + '.</p>';
    return;
  }

  const sellerStatsMap = {};
  let totalRevenue = 0;
  let totalUnits = 0;
  let totalEmployeeProfit = 0;
  let totalPurchaseCost = 0;
  let totalNetGlossia = 0;

  records.forEach(function (record) {
    const seller = employeeMap.get(record.employeeId) || "ماشي معيّن";
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
    const seller = employeeMap.get(record.employeeId) || "ماشي معيّن";
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
      "<td>" + (record.label || "منتوج") + "</td>" +
      "<td>" + qty + "</td>" +
      "<td>" + seller + "</td>" +
      "<td>" + formatEuroAmount(amount) + "</td>" +
      "<td>" + formatEuroAmount(employeeProfit) + "</td>" +
      "<td>" + formatEuroAmount(purchaseCost) + "</td>" +
      "<td>" + formatEuroAmount(glossiaNet) + "</td>" +
      "</tr>";
  }).join("");

  managerProductsTable.innerHTML =
    '<div class="manager-products-period-bar"><div class="period-tabs manager-products-period-tabs" role="tablist" aria-label="فترة المنتوجات المبيعة">' + periodTabs + "</div></div>" +
    '<div class="manager-insight-grid manager-products-insight-grid">' +
    '<article class="employee-metric-card success"><span>البائع الأول</span><strong>' +
    (topSeller ? topSeller.seller : "-") +
    "</strong><small>" +
    (topSeller ? "صافي Glossia: " + formatEuroAmount(topSeller.glossiaNet) + " | " + topSeller.units + " قطعة" : "-") +
    "</small></article>" +
    '<article class="employee-metric-card"><span>مجموع بيوعات المنتوجات</span><strong>' +
    formatEuroAmount(totalRevenue) +
    "</strong><small>" + records.length + " بيعة | " + totalUnits + " قطعة</small></article>" +
    '<article class="employee-metric-card warning"><span>متوسط تذكرة المنتوج</span><strong>' +
    formatEuroAmount(averageTicket) +
    "</strong><small>صافي Glossia: " + formatEuroAmount(totalNetGlossia) + "</small></article>" +
    '<article class="employee-metric-card"><span>بنفيس الموظفين المجموع</span><strong>' +
    formatEuroAmount(totalEmployeeProfit) +
    "</strong><small>مجموع حصة الموظف من بيوعات المنتوجات</small></article>" +
    '<article class="employee-metric-card"><span>تمن الشراء المجموع</span><strong>' +
    formatEuroAmount(totalPurchaseCost) +
    "</strong><small>مجموع تكاليف شراء المنتوجات المبيعة</small></article>" +
    '<article class="employee-metric-card success"><span>البنفيس الصافي ديال Glossia</span><strong>' +
    formatEuroAmount(totalNetGlossia) +
    "</strong><small>البيع - بنفيس الموظف - الشراء</small></article>" +
    "</div>" +
    '<div class="manager-products-ranking-wrap">' +
    '<h4 class="modal-block-title manager-products-block-title">ترتيب بائعي المنتوجات · ' + periodLabel + '</h4>' +
    '<div class="employee-table-wrap"><table class="employee-history-table">' +
    "<thead><tr><th>الرتبة</th><th>الموظف</th><th>البيوعات</th><th>القطع</th><th>المبلغ</th><th>بنفيس الموظف</th><th>تمن الشراء</th><th>صافي Glossia</th></tr></thead>" +
    "<tbody>" + rankingRows + "</tbody></table></div></div>" +
    '<h4 class="modal-block-title manager-products-block-title">تفاصيل البيوعات بالتاريخ · ' + periodLabel + '</h4>' +
    '<div class="employee-table-wrap"><table class="employee-history-table">' +
    "<thead><tr><th>التاريخ</th><th>المنتوج</th><th>الكمية</th><th>باعها</th><th>تمن البيع</th><th>بنفيس الموظف</th><th>تمن الشراء</th><th>صافي Glossia</th></tr></thead>" +
    "<tbody>" + rows + "</tbody></table></div>";
}

function renderConsumedDetail(liveData) {
  if (!managerConsumedTable) {
    return;
  }

  const requests = (liveData.stockRequests || []).slice().sort(function (a, b) {
    return new Date(b.dateISO) - new Date(a.dateISO);
  });

  if (requests.length === 0) {
    managerConsumedTable.innerHTML = '<p class="placeholder-text">ماكاين حتى حاجة ديال التزويد متبلغ عليها.</p>';
    return;
  }

  const cards = requests.map(function (request) {
    const photo = request.photo
      ? '<div class="stock-request-card-photo"><img src="' + request.photo + '" alt="' + (request.name || "منتوج") + '" /></div>'
      : '<div class="stock-request-card-photo no-photo">بلا صورة</div>';

    const typeLabel = request.type === "vente" ? "منتوج بيع" : "منتوج صالة";

    return '<div class="stock-request-card" data-request-id="' + request.id + '">' +
      photo +
      '<div class="stock-request-card-body">' +
      '<span class="stock-request-badge ' + request.type + '">' + typeLabel + "</span>" +
      '<span class="stock-request-card-name">' + (request.name || "منتوج بلا سمية") + "</span>" +
      '<div class="stock-request-card-meta">' +
      '<span class="stock-request-card-qty">الكمية: ' + Number(request.quantity || 0) + "</span>" +
      '<span class="stock-request-card-date">' + formatDateTime(request.dateISO) + "</span>" +
      "</div>" +
      '<button type="button" class="manager-btn manager-btn-muted stock-request-remove" data-request-id="' + request.id + '">توصل / مسح</button>' +
      "</div>" +
      "</div>";
  }).join("");

  managerConsumedTable.innerHTML = '<div class="stock-request-list">' + cards + "</div>";
}

function renderRuptureDetail(liveData) {
  if (!managerRuptureTable) {
    return;
  }

  const lowStock = (liveData.inventoryProducts || []).filter(function (product) {
    return Number(product.stock || 0) <= Number(product.threshold || 0);
  });

  if (lowStock.length === 0) {
    managerRuptureTable.innerHTML = '<p class="placeholder-text">ماكاين حتى منتوج ناقص دابا.</p>';
    return;
  }

  const rows = lowStock.map(function (product) {
    return "<tr>" +
      "<td>" + product.name + "</td>" +
      "<td>" + Number(product.stock || 0) + "</td>" +
      "<td>" + Number(product.threshold || 0) + "</td>" +
      "<td>خاصو يتزود</td>" +
      "</tr>";
  }).join("");

  managerRuptureTable.innerHTML =
    '<div class="employee-table-wrap"><table class="employee-history-table">' +
    "<thead><tr><th>المنتوج</th><th>الستوك الحالي</th><th>السقف</th><th>الإجراء</th></tr></thead>" +
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
    let statusLabel = "باقي يتدار";

    if (tasks.length === 0) {
      statusClass = "pending";
      statusLabel = "خاصو يتخطط";
    } else if (pendingTotal === 0) {
      statusClass = "done";
      statusLabel = "كولشي تدار";
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
    "<thead><tr><th>الموظف</th><th>تدارت</th><th>مادارتش</th><th>اليوم</th><th>السيمانة</th><th>الشهر</th><th>% الشهر</th><th>الحالة</th></tr></thead>" +
    "<tbody>" + (rows || '<tr><td colspan="' + totalCols + '" class="employee-empty-cell">ماكاين حتى تاش متوفرة.</td></tr>') + "</tbody></table></div>";
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
      return "<tr><td>" + employee.name + "</td><td colspan=\"5\">ماكاين حتى توقيت مسجل</td></tr>";
    }

    const latest = entries[0][1] || {};
    const calc = latest.calculation;
    const worked = calc?.workedMinutes != null ? formatMinutes(calc.workedMinutes) : "-";
    const status = latest.restDay
      ? "راحة"
      : (calc?.meetsTarget ? "الهدف تحقق" : (calc ? "ناقص" : "فالانتظار"));

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
    "<thead><tr><th>الموظف</th><th>الوصول</th><th>الوقفة</th><th>الرجوع</th><th>المغادرة</th><th>الملخص</th></tr></thead>" +
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
    "الهدف: " + formatEuroAmount(target) +
    " | تحقق: " + formatEuroAmount(actual) +
    " | باقي: " + formatEuroAmount(progress.remaining);

  const track = document.createElement("div");
  track.className = "manager-objective-track";

  const fill = document.createElement("span");
  fill.className = "manager-objective-fill " + progress.className;
  fill.style.width = progress.fillWidth + "%";
  track.appendChild(fill);

  const percentage = document.createElement("small");
  percentage.className = "manager-objective-percentage " + progress.className;
  percentage.textContent = Math.round(progress.percentage) + "% تحقق";

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
    empty.textContent = "ماكاين حتى هدف مشترك محدد من طرف المالك.";
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
  globalTitle.textContent = "Glossia الشامل";
  managerObjectiveOverview.appendChild(globalTitle);
  managerObjectiveOverview.appendChild(createObjectiveRow("هدف اليوم", globalDaySales, targets.day));
  managerObjectiveOverview.appendChild(createObjectiveRow("هدف السيمانة", globalWeekSales, targets.week));
  managerObjectiveOverview.appendChild(createObjectiveRow("هدف الشهر", globalMonthSales, targets.month));
  managerObjectiveOverview.appendChild(createObjectiveRow("هدف الحملة", globalCampaignSales, targets.campaign));

  const employeeTitle = document.createElement("h5");
  employeeTitle.className = "manager-objective-group-title";
  employeeTitle.textContent = employee.name + " · تحقق شخصي";
  managerObjectiveOverview.appendChild(employeeTitle);
  managerObjectiveOverview.appendChild(createObjectiveRow("بيوعات اليوم", daySales, targets.day));
  managerObjectiveOverview.appendChild(createObjectiveRow("بيوعات السيمانة", weekSales, targets.week));
  managerObjectiveOverview.appendChild(createObjectiveRow("بيوعات الشهر", monthSales, targets.month));
  managerObjectiveOverview.appendChild(createObjectiveRow("بيوعات الحملة", campaignSales, targets.campaign));
}

function renderTaskList() {
  const state = ensureEmployeeData(selectedEmployeeId);

  taskList.innerHTML = "";

  if (state.tasks.length === 0) {
    const emptyText = document.createElement("p");
    emptyText.className = "muted";
    emptyText.textContent = "ماكاين حتى تاش دابا.";
    taskList.appendChild(emptyText);
    return;
  }

  state.tasks.forEach(function (task, index) {
    const row = document.createElement("div");
    row.className = "task-item task-status-item";
    row.classList.toggle("is-done", task.status === "done");

    const text = document.createElement("span");
    text.textContent = task.text;
    text.className = task.status === "done" ? "task-done" : "";

    const actions = document.createElement("div");
    actions.className = "task-status-actions";
    actions.appendChild(createTaskStatusButton(index, "done", "دارها", task.status));
    actions.appendChild(createTaskStatusButton(index, "notdone", "مادارهاش", task.status));
    actions.appendChild(createTaskStatusButton(index, "excuse", "معذور", task.status));

    row.appendChild(text);
    row.appendChild(actions);
    taskList.appendChild(row);

    if (task.status === "excuse") {
      const reason = document.createElement("p");
      reason.className = "task-excuse-reason";
      reason.textContent = task.excuseReason
        ? "المبرر ديال الموظف: " + task.excuseReason
        : "فالانتظار للمبرر ديال الموظف.";
      taskList.appendChild(reason);
    }
  });
}

function createTaskStatusButton(index, status, label, currentStatus) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "task-status-btn task-status-" + status;
  button.classList.toggle("active", currentStatus === status);
  button.dataset.taskIndex = String(index);
  button.dataset.status = status;
  button.textContent = label;
  return button;
}

function renderTodaySchedule() {
  const state = ensureEmployeeData(selectedEmployeeId);
  const dateKey = activeScheduleDateKey || getCurrentDateKey();
  const todaySchedule = state.scheduleByDate[dateKey] || {};
  todaySchedule.restDay = Boolean(todaySchedule.restDay);

  calculateDailyWork(todaySchedule);

  if (scheduleDayTitle) {
    scheduleDayTitle.textContent = "التوقيت · " + formatDateKeyForHeading(dateKey);
  }

  if (scheduleToggleRestButton) {
    scheduleToggleRestButton.textContent = todaySchedule.restDay
      ? "حيد الراحة"
      : "علم راحة";
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
      "حل بطاقة " + employee.name + "، " + employee.post
    );

    const avatar = document.createElement("span");
    avatar.className = "employee-avatar";
    avatar.textContent = employee.name.charAt(0).toUpperCase();

    const status = document.createElement("span");
    status.className = "employee-status";
    status.textContent = "متوفر";

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
    showDashboardMessage("عمر السمية ورقم المنصب.", true);
    return;
  }

  const normalizedPost = postRaw.toLowerCase().startsWith("post") || postRaw.startsWith("منصب")
    ? postRaw
    : "منصب " + postRaw;

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
  showDashboardMessage("الموظف تزاد بنجاح.");
});

salesForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const employee = getSelectedEmployee();
  if (!employee) {
    showModalFeedback("الموظف ماتلقاش.", true);
    return;
  }

  const state = ensureEmployeeData(employee.id);
  const dateISO = new Date().toISOString();

  const serviceAmount = Number(salesServiceAmountField.value || 0);

  const productUnitAmount = Number(salesProductUnitAmountField.value || 0);

  const wantsService = Number.isFinite(serviceAmount) && serviceAmount > 0;
  const wantsProduct = Number.isFinite(productUnitAmount) && productUnitAmount > 0;

  if (!wantsService && !wantsProduct) {
    showModalFeedback("دخل على الأقل مبلغ وحد: خدمة ولا منتوج.", true);
    return;
  }

  if (wantsService) {
    state.salesHistory.push({
      id: createSaleId("srv"),
      serviceName: "خدمة",
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
      label: "منتوج",
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
  showModalFeedback("البيعة تسجلات ل" + employee.name + ".", false);
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

taskList.addEventListener("click", function (event) {
  const button = event.target.closest(".task-status-btn");
  if (!button) {
    return;
  }

  const taskIndex = Number(button.dataset.taskIndex);
  const state = ensureEmployeeData(selectedEmployeeId);
  const task = state.tasks[taskIndex];
  if (!task) {
    return;
  }

  const status = button.dataset.status;
  task.status = status;
  task.done = status === "done";
  task.completedAtISO = status === "done" ? new Date().toISOString() : null;
  if (status !== "excuse") {
    task.excuseReason = "";
  }

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
    showModalFeedback("الموظف ماتلقاش.", true);
    return;
  }

  const state = ensureEmployeeData(employee.id);
  const dateKey = activeScheduleDateKey || getCurrentDateKey();
  if (!state.scheduleByDate[dateKey]) {
    state.scheduleByDate[dateKey] = {};
  }

  if (state.scheduleByDate[dateKey].restDay) {
    showModalFeedback("هاد اليوم معلم كراحة.", true);
    return;
  }

  if (state.scheduleByDate[dateKey][stampKey]) {
    showModalFeedback("التوقيت تسجل ديجا ل" + scheduleFieldLabels[stampKey] + ".", true);
    return;
  }

  const stamp = createDateTimeStamp();
  state.scheduleByDate[dateKey][stampKey] = stamp;
  state.scheduleByDate[dateKey].savedAtISO = stamp.iso;

  renderTodaySchedule();
  saveSharedData();
  renderManagerSectionDetails();
  showModalFeedback(scheduleFieldLabels[stampKey] + " تسجل فـ " + stamp.dateTime + ".", false);
});

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
      showModalFeedback("اليوم معلم كراحة.", false);
    } else {
      schedule.calculation = null;
      showModalFeedback("الراحة تحيدات لهاد اليوم.", false);
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

function formatAccountsRecordType(record) {
  return record.type === "product" ? "منتوج" : "خدمة";
}

function renderAccountsDetailRange() {
  if (accountsDetailEmployeeId == null) {
    return;
  }

  const liveData = readLiveSharedData();
  const records = getManagerAllSalesRecords(liveData).filter(function (record) {
    return Number(record.employeeId) === Number(accountsDetailEmployeeId);
  });

  const startValue = accountsDetailStart.value;
  const endValue = accountsDetailEnd.value;

  const filtered = records.filter(function (record) {
    const workDateKey = getWorkDateKeyFromISO(record.dateISO);
    if (startValue && workDateKey < startValue) {
      return false;
    }
    if (endValue && workDateKey > endValue) {
      return false;
    }
    return true;
  }).sort(function (a, b) {
    return new Date(b.dateISO) - new Date(a.dateISO);
  });

  const rangeTotal = sumRecordAmounts(filtered);
  accountsDetailRangeTotal.textContent =
    filtered.length + " بيعة · المجموع: " + formatEuroAmount(rangeTotal);

  accountsDetailList.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "ماكاين حتى بيعة فهاد الفترة.";
    accountsDetailList.appendChild(empty);
    return;
  }

  filtered.forEach(function (record) {
    const item = document.createElement("li");
    item.className = "modal-list-item";

    const line = document.createElement("div");
    line.className = "history-entry-content";

    const label = document.createElement("span");
    label.textContent = formatDateTime(record.dateISO) + " · " + formatAccountsRecordType(record);

    const amount = document.createElement("strong");
    amount.textContent = formatEuroAmount(record.amount);

    line.appendChild(label);
    line.appendChild(amount);
    item.appendChild(line);
    accountsDetailList.appendChild(item);
  });
}

function openAccountsDetailModal(employeeId) {
  const liveData = readLiveSharedData();
  const employee = (liveData.employees || []).find(function (item) {
    return Number(item.id) === Number(employeeId);
  });

  if (!employee) {
    return;
  }

  accountsDetailEmployeeId = employeeId;
  accountsDetailTitle.textContent = "الحساب · " + employee.name;
  accountsDetailSubtitle.textContent = employee.post;

  const records = getManagerAllSalesRecords(liveData).filter(function (record) {
    return Number(record.employeeId) === Number(employeeId);
  });

  const dayTotal = sumRecordAmounts(getRecordsForPeriod(records, "day"));
  const weekTotal = sumRecordAmounts(getRecordsForPeriod(records, "week"));
  const monthTotal = sumRecordAmounts(getRecordsForPeriod(records, "month"));

  accountsDetailSummary.innerHTML =
    '<div class="employee-metric-card"><span>اليوم</span><strong>' + formatEuroAmount(dayTotal) + "</strong></div>" +
    '<div class="employee-metric-card"><span>هاد السيمانة</span><strong>' + formatEuroAmount(weekTotal) + "</strong></div>" +
    '<div class="employee-metric-card"><span>هاد الشهر</span><strong>' + formatEuroAmount(monthTotal) + "</strong></div>";

  const today = getCurrentDateKey();
  accountsDetailStart.value = today;
  accountsDetailEnd.value = today;
  renderAccountsDetailRange();

  accountsDetailModal.classList.remove("hidden");
}

function closeAccountsDetailModal() {
  accountsDetailEmployeeId = null;
  accountsDetailModal.classList.add("hidden");
}

if (managerServicesTable) {
  managerServicesTable.addEventListener("click", function (event) {
    const button = event.target.closest(".accounts-detail-btn");
    if (!button) {
      return;
    }

    openAccountsDetailModal(Number(button.dataset.employeeId));
  });
}

if (accountsDetailApply) {
  accountsDetailApply.addEventListener("click", renderAccountsDetailRange);
}

if (accountsDetailClose) {
  accountsDetailClose.addEventListener("click", closeAccountsDetailModal);
}

if (accountsDetailCloseIcon) {
  accountsDetailCloseIcon.addEventListener("click", closeAccountsDetailModal);
}

if (accountsDetailModal) {
  accountsDetailModal.addEventListener("click", function (event) {
    if (event.target === accountsDetailModal) {
      closeAccountsDetailModal();
    }
  });
}

function resizeImageFileToDataUrl(file, maxSize, callback) {
  const reader = new FileReader();
  reader.onload = function () {
    const image = new Image();
    image.onload = function () {
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL("image/jpeg", 0.6));
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

if (stockRequestPhotoInput) {
  stockRequestPhotoInput.addEventListener("change", function () {
    const file = stockRequestPhotoInput.files && stockRequestPhotoInput.files[0];
    if (!file) {
      return;
    }

    resizeImageFileToDataUrl(file, 480, function (dataUrl) {
      stockRequestPhotoDataUrl = dataUrl;
      stockRequestPreviewImg.src = dataUrl;
      stockRequestPreview.classList.remove("hidden");
    });
  });
}

if (stockRequestTypeToggle) {
  stockRequestTypeToggle.addEventListener("click", function (event) {
    const button = event.target.closest(".stock-type-btn");
    if (!button) {
      return;
    }

    stockRequestType = button.dataset.type;
    stockRequestTypeToggle.querySelectorAll(".stock-type-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn === button);
    });
  });
}

if (stockRequestForm) {
  stockRequestForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const quantity = Number(stockRequestQuantityInput.value);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      stockRequestFeedback.textContent = "دخل كمية صحيحة.";
      stockRequestFeedback.classList.add("is-error");
      return;
    }

    if (!Array.isArray(sharedSalonData.stockRequests)) {
      sharedSalonData.stockRequests = [];
    }

    sharedSalonData.stockRequests.push({
      id: createSaleId("stock"),
      name: stockRequestNameInput.value.trim(),
      type: stockRequestType,
      quantity: quantity,
      photo: stockRequestPhotoDataUrl,
      dateISO: new Date().toISOString()
    });

    saveSharedData();

    stockRequestForm.reset();
    stockRequestPhotoDataUrl = null;
    stockRequestPreview.classList.add("hidden");
    stockRequestType = "salle";
    stockRequestTypeToggle.querySelectorAll(".stock-type-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.type === "salle");
    });
    stockRequestFeedback.classList.remove("is-error");
    stockRequestFeedback.textContent = "الحاجة تبلغ عليها بنجاح.";

    renderManagerSectionDetails();
  });
}

if (managerConsumedTable) {
  managerConsumedTable.addEventListener("click", function (event) {
    const button = event.target.closest(".stock-request-remove");
    if (!button) {
      return;
    }

    const requestId = button.dataset.requestId;
    sharedSalonData.stockRequests = (sharedSalonData.stockRequests || []).filter(function (request) {
      return request.id !== requestId;
    });

    saveSharedData();
    renderManagerSectionDetails();
  });
}
