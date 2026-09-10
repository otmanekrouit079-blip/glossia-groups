// The manager page saves its temporary data here so other dashboard pages can read it.
const ownerRequiredDailyMinutes = 12 * 60;

const ownerPeriodButtons = document.querySelectorAll(".owner-period-tab");
const ownerPrevDayButton = document.getElementById("owner-prev-day");
const ownerNextDayButton = document.getElementById("owner-next-day");
const ownerReferenceDateInput = document.getElementById("owner-reference-date");
const ownerSummaryGrid = document.getElementById("owner-summary-grid");
const ownerAlertBanner = document.getElementById("owner-alert-banner");
const ownerSalesChart = document.getElementById("owner-sales-chart");
const ownerPeriodLabel = document.getElementById("owner-period-label");
const ownerPresenceHeading = document.getElementById("owner-presence-heading");
const ownerSalesHeading = document.getElementById("owner-sales-heading");
const ownerEmployeeBody = document.getElementById("owner-employee-body");
const ownerEmployeeCards = document.getElementById("owner-employee-cards");
const ownerLogoutButton = document.getElementById("owner-logout");
const ownerTargetSummary = document.getElementById("owner-target-summary");
const ownerTargetIndicators = document.getElementById("owner-target-indicators");
const ownerTargetPeriodButtons = document.querySelectorAll(".owner-target-period-btn");
const ownerOpenTargetModalButton = document.getElementById("owner-open-target-modal");
const ownerDetailModal = document.getElementById("owner-detail-modal");
const ownerModalTitle = document.getElementById("owner-modal-title");
const ownerModalSubtitle = document.getElementById("owner-modal-subtitle");
const ownerModalTimeGrid = document.getElementById("owner-modal-time-grid");
const ownerModalSalesGrid = document.getElementById("owner-modal-sales-grid");
const ownerModalTargetGrid = document.getElementById("owner-modal-target-grid");
const ownerModalTaskCount = document.getElementById("owner-modal-task-count");
const ownerModalTaskList = document.getElementById("owner-modal-task-list");
const ownerModalCloseButton = document.getElementById("owner-modal-close");
const ownerModalCloseIconButton = document.getElementById("owner-modal-close-icon");
const ownerOpenProductsPopupButton = document.getElementById("owner-open-products-popup");
const ownerOpenProductsManagementButton = document.getElementById("owner-open-products-management");
const ownerProductsPopupModal = document.getElementById("owner-products-popup-modal");
const ownerProductsPopupCloseButton = document.getElementById("owner-products-popup-close");
const ownerProductsPopupCloseIconButton = document.getElementById("owner-products-popup-close-icon");
const ownerProductsPopupForm = document.getElementById("owner-products-popup-form");
const ownerProductsPopupNameInput = document.getElementById("owner-products-popup-name");
const ownerProductsPopupPurchaseInput = document.getElementById("owner-products-popup-purchase");
const ownerProductsPopupSellingInput = document.getElementById("owner-products-popup-selling");
const ownerProductsPopupEmployeeShareInput = document.getElementById("owner-products-popup-employee-share");
const ownerProductsPopupNetInput = document.getElementById("owner-products-popup-net");
const ownerProductsPopupFeedback = document.getElementById("owner-products-popup-feedback");
const ownerProductsPopupList = document.getElementById("owner-products-popup-list");
const ownerTargetModal = document.getElementById("owner-target-modal");
const ownerTargetModalTitle = document.getElementById("owner-target-modal-title");
const ownerTargetModalSubtitle = document.getElementById("owner-target-modal-subtitle");
const ownerTargetModalCloseButton = document.getElementById("owner-target-modal-close");
const ownerTargetModalCloseIconButton = document.getElementById("owner-target-modal-close-icon");
const ownerTargetForm = document.getElementById("owner-target-form");
const ownerTargetFeedback = document.getElementById("owner-target-feedback");
const ownerTargetStartDateInput = document.getElementById("owner-target-start-date");
const ownerTargetEndDateInput = document.getElementById("owner-target-end-date");
const ownerTargetDailyInput = document.getElementById("owner-target-daily");
const ownerTargetGlobalInput = document.getElementById("owner-target-global");
const ownerLastSavedLabel = document.getElementById("owner-last-saved");
const ownerExportDataButton = document.getElementById("owner-export-data");
const ownerImportDataButton = document.getElementById("owner-import-data");
const ownerImportFileInput = document.getElementById("owner-import-file");
const ownerTopPeriodButtons = document.querySelectorAll(".owner-top-period-btn");
const ownerTopKpiRevenue = document.getElementById("owner-top-kpi-revenue");
const ownerTopKpiExpenses = document.getElementById("owner-top-kpi-expenses");
const ownerTopKpiProfit = document.getElementById("owner-top-kpi-profit");
const ownerTopKpiGlossiaProductNet = document.getElementById("owner-top-kpi-glossia-product-net");
const ownerTopKpiObjectiveCard = document.getElementById("owner-top-kpi-objective-card");
const ownerTopKpiObjectiveLabel = document.getElementById("owner-top-kpi-objective-label");
const ownerTopKpiObjectiveValue = document.getElementById("owner-top-kpi-objective-value");
const ownerTopFinanceTrend = document.getElementById("owner-top-finance-trend");
const ownerCompactNavButtons = document.querySelectorAll(".owner-compact-nav-btn");
const ownerFocusTitle = document.getElementById("owner-focus-title");
const ownerFocusSubtitle = document.getElementById("owner-focus-subtitle");
const ownerFocusPills = document.getElementById("owner-focus-pills");
const ownerFocusList = document.getElementById("owner-focus-list");
const ownerToggleAccessButton = document.getElementById("owner-toggle-access");
const ownerSectionsModal = document.getElementById("owner-sections-modal");
const ownerSectionsModalBody = document.getElementById("owner-sections-modal-body");
const ownerSectionsTitle = document.getElementById("owner-sections-title");
const ownerSectionsSubtitle = document.getElementById("owner-sections-subtitle");
const ownerSectionsCloseButton = document.getElementById("owner-sections-close");
const ownerSectionsCloseIconButton = document.getElementById("owner-sections-close-icon");
const ownerAccessModal = document.getElementById("owner-access-modal");
const ownerAccessCloseButton = document.getElementById("owner-access-close");
const ownerAccessCloseIconButton = document.getElementById("owner-access-close-icon");
const ownerAccessForm = document.getElementById("owner-access-form");
const ownerAccessBody = document.getElementById("owner-access-body");
const ownerAccessFeedback = document.getElementById("owner-access-feedback");

const ownerSections = {
  overview: document.getElementById("owner-section-overview"),
  targets: document.getElementById("owner-section-targets"),
  accounting: document.getElementById("owner-section-accounting"),
  operations: [
    document.getElementById("owner-section-bi-nav"),
    document.getElementById("owner-section-bi-details"),
    document.getElementById("owner-section-sales-chart")
  ],
  team: [
    document.getElementById("owner-section-employees"),
    document.getElementById("owner-section-details")
  ]
};

let ownerActivePeriod = "day";
let ownerReferenceDate = new Date();
let ownerActiveCompactView = "overview";
let ownerTopFinancePeriod = "day";
let ownerTargetStatsPeriod = "day";
let ownerOperationsSnapshot = {
  services: "0,00 DH",
  products: "0,00 DH",
  tasksRate: "0%",
  hours: "0 / 0",
  consumed: "0 unités",
  ruptureCount: 0
};
let ownerFinanceSnapshot = {
  revenue: "0,00 DH",
  expenses: "0,00 DH",
  profit: "0,00 DH",
  fixedTotal: "0,00 DH",
  variableTotal: "0,00 DH",
  payrollNetTotal: "0,00 DH"
};

function getOwnerAllDashboardSections() {
  return [
    ownerSections.overview,
    ownerSections.targets,
    ownerSections.accounting,
    ownerSections.operations[0],
    ownerSections.operations[1],
    ownerSections.operations[2],
    ownerSections.team[0],
    ownerSections.team[1]
  ].filter(Boolean);
}

function mountOwnerSectionsInPopup() {
  if (!ownerSectionsModalBody) {
    return;
  }

  getOwnerAllDashboardSections().forEach(function (section) {
    ownerSectionsModalBody.appendChild(section);
  });
}

function getOwnerViewMeta(viewName) {
  if (viewName === "overview") {
    return {
      title: "Aperçu",
      subtitle: "Indicateurs clés, objectifs et comptabilité en vue rapide."
    };
  }

  if (viewName === "targets") {
    return {
      title: "Objectifs",
      subtitle: "Pilotage des objectifs et suivi fiscalité équipe."
    };
  }

  if (viewName === "accounting") {
    return {
      title: "Compta",
      subtitle: "Suivi des charges, produits, rémunérations et bénéfice net."
    };
  }

  if (viewName === "operations") {
    return {
      title: "Opérations",
      subtitle: "Navigation opérationnelle et analyses détaillées."
    };
  }

  if (viewName === "team") {
    return {
      title: "Équipe",
      subtitle: "Vue employé et fiches détaillées de l'équipe."
    };
  }

  return {
    title: "Tout afficher",
    subtitle: "Vue complète du dashboard propriétaire."
  };
}

function openOwnerSectionsModal(viewName) {
  if (!ownerSectionsModal) {
    return;
  }

  const meta = getOwnerViewMeta(viewName || "all");

  if (ownerSectionsTitle) {
    ownerSectionsTitle.textContent = meta.title;
  }

  if (ownerSectionsSubtitle) {
    ownerSectionsSubtitle.textContent = meta.subtitle;
  }

  ownerSectionsModal.classList.remove("hidden");
}

function closeOwnerSectionsModal() {
  if (!ownerSectionsModal) {
    return;
  }

  ownerSectionsModal.classList.add("hidden");
}

function openOwnerProductsAccountingPanel() {
  setOwnerCompactView("accounting");
  scrollOwnerSectionIntoView("owner-accounting-title");

  setTimeout(function () {
    const firstInput = document.querySelector("#owner-products-list .owner-target-input");
    if (firstInput) {
      firstInput.focus();
    }
  }, 220);
}

function readOwnerSessionData() {
  if (window.SalonStorage) {
    return window.SalonStorage.loadData();
  }

  return {
    employees: [
      { id: 1, name: "Ahmed", post: "Post 1" },
      { id: 2, name: "Youssef", post: "Post 2" }
    ],
    employeeData: {}
  };
}

const ownerSharedData = readOwnerSessionData();
const ownerEmployees = Array.isArray(ownerSharedData.employees)
  ? ownerSharedData.employees
  : [];
const ownerEmployeeData = ownerSharedData.employeeData || {};
let ownerCampaignTarget = ownerSharedData.ownerCampaignTarget || {};

function syncOwnerCampaignTargetState() {
  if (!ownerSharedData.ownerCampaignTarget || typeof ownerSharedData.ownerCampaignTarget !== "object") {
    ownerSharedData.ownerCampaignTarget = {};
  }

  ownerCampaignTarget = ownerSharedData.ownerCampaignTarget;
  return ownerCampaignTarget;
}

function getOwnerAuthUsers() {
  if (!Array.isArray(ownerSharedData.authUsers)) {
    ownerSharedData.authUsers = [];
  }

  return ownerSharedData.authUsers;
}

function findOwnerAuthEntry(role, employeeId) {
  return getOwnerAuthUsers().find(function (user) {
    if (role === "employee") {
      return user.role === "employee" && Number(user.employeeId) === Number(employeeId);
    }

    return user.role === role;
  });
}

function createOwnerAccessInputCell(config) {
  const cell = document.createElement("td");
  const input = document.createElement("input");

  input.type = config.type || "text";
  input.className = "owner-target-input";
  input.value = config.value || "";
  input.required = true;
  input.dataset.role = config.role;
  input.dataset.field = config.field;

  if (config.employeeId != null) {
    input.dataset.employeeId = String(config.employeeId);
  }

  cell.appendChild(input);
  return cell;
}

function createOwnerAccessRow(config) {
  const row = document.createElement("tr");
  const roleCell = document.createElement("td");
  const nameCell = document.createElement("td");

  roleCell.textContent = config.roleLabel;
  nameCell.textContent = config.nameLabel;

  row.appendChild(roleCell);
  row.appendChild(nameCell);
  row.appendChild(createOwnerAccessInputCell({
    role: config.role,
    employeeId: config.employeeId,
    field: "username",
    value: config.username,
    type: "text"
  }));
  row.appendChild(createOwnerAccessInputCell({
    role: config.role,
    employeeId: config.employeeId,
    field: "password",
    value: config.password,
    type: "text"
  }));

  return row;
}

function renderOwnerAccessManager() {
  if (!ownerAccessBody) {
    return;
  }

  ownerAccessBody.innerHTML = "";

  const ownerEntry = findOwnerAuthEntry("owner");
  const managerEntry = findOwnerAuthEntry("manager");

  ownerAccessBody.appendChild(createOwnerAccessRow({
    role: "owner",
    roleLabel: "Propriétaire",
    nameLabel: "Compte principal",
    username: ownerEntry?.username || "owner1",
    password: ownerEntry?.password || "1234"
  }));

  ownerAccessBody.appendChild(createOwnerAccessRow({
    role: "manager",
    roleLabel: "Gérant",
    nameLabel: "Compte gérant",
    username: managerEntry?.username || "gerant1",
    password: managerEntry?.password || "1234"
  }));

  ownerEmployees.forEach(function (employee) {
    const employeeEntry = findOwnerAuthEntry("employee", employee.id);
    ownerAccessBody.appendChild(createOwnerAccessRow({
      role: "employee",
      roleLabel: "Employé",
      nameLabel: employee.name,
      employeeId: employee.id,
      username: employeeEntry?.username || ("emp" + employee.id),
      password: employeeEntry?.password || "1234"
    }));
  });
}

function saveOwnerAccessManagerFromForm() {
  if (!ownerAccessForm) {
    return false;
  }

  if (ownerAccessFeedback) {
    ownerAccessFeedback.textContent = "";
  }

  const fields = Array.from(ownerAccessForm.querySelectorAll("input[data-field]"));
  const grouped = {};

  fields.forEach(function (field) {
    const role = field.dataset.role || "";
    const employeeId = field.dataset.employeeId || "";
    const groupKey = role === "employee" ? ("employee:" + employeeId) : role;

    if (!grouped[groupKey]) {
      grouped[groupKey] = {
        role: role,
        employeeId: role === "employee" ? Number(employeeId) : undefined,
        username: "",
        password: ""
      };
    }

    grouped[groupKey][field.dataset.field] = field.value.trim();
  });

  const entries = Object.values(grouped);
  const usernames = entries.map(function (entry) {
    return entry.username.toLowerCase();
  });

  const hasEmpty = entries.some(function (entry) {
    return !entry.username || !entry.password;
  });

  if (hasEmpty) {
    if (ownerAccessFeedback) {
      ownerAccessFeedback.textContent = "Username et mot de passe sont obligatoires pour tous les comptes.";
    }
    return false;
  }

  const duplicateUsername = usernames.some(function (username, index) {
    return usernames.indexOf(username) !== index;
  });

  if (duplicateUsername) {
    if (ownerAccessFeedback) {
      ownerAccessFeedback.textContent = "Chaque compte doit avoir un username unique.";
    }
    return false;
  }

  ownerSharedData.authUsers = entries.map(function (entry) {
    if (entry.role === "employee") {
      return {
        role: "employee",
        employeeId: Number(entry.employeeId),
        username: entry.username,
        password: entry.password
      };
    }

    return {
      role: entry.role,
      username: entry.username,
      password: entry.password
    };
  });

  if (window.SalonStorage) {
    window.SalonStorage.saveData(ownerSharedData);
  }

  if (ownerAccessFeedback) {
    ownerAccessFeedback.textContent = "Comptes mis a jour avec succes.";
  }

  renderOwnerAccessManager();
  renderOwnerLastSavedIndicator();
  return true;
}

function formatOwnerMinutes(totalMinutes) {
  const safeMinutes = Math.max(0, Math.round(totalMinutes || 0));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  return hours + "h" + String(minutes).padStart(2, "0");
}

function formatOwnerAmount(amount) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0) + " DH";
}

function formatOwnerEuro(amount) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0) + " DH";
}

function formatOwnerPercent(value) {
  const safeValue = Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
  return safeValue.toFixed(1) + "%";
}

function parseOwnerDisplayedAmount(value) {
  const normalized = String(value || "")
    .replace(/\s|\u202f|\u00a0/g, "")
    .replace("DH", "")
    .replace(/,/g, ".")
    .trim();

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function ensureOwnerProductsCollection() {
  if (!Array.isArray(ownerSharedData.ownerProducts)) {
    ownerSharedData.ownerProducts = [];
  }

  return ownerSharedData.ownerProducts;
}

function getOwnerProductsPopupPreview() {
  const purchasePrice = Number(ownerProductsPopupPurchaseInput?.value || 0);
  const sellingPrice = Number(ownerProductsPopupSellingInput?.value || 0);
  const employeeProfit = Number(ownerProductsPopupEmployeeShareInput?.value || 0);

  const safePurchase = Number.isFinite(purchasePrice) ? Math.max(0, purchasePrice) : 0;
  const safeSelling = Number.isFinite(sellingPrice) ? Math.max(0, sellingPrice) : 0;
  const safeEmployeeProfit = Number.isFinite(employeeProfit)
    ? Math.max(0, employeeProfit)
    : 0;

  const grossMargin = safeSelling - safePurchase;
  const employeePercent = safeSelling > 0 ? (safeEmployeeProfit / safeSelling) * 100 : 0;
  const glossiaNet = grossMargin - safeEmployeeProfit;

  return {
    purchasePrice: safePurchase,
    sellingPrice: safeSelling,
    employeePercent: employeePercent,
    employeeProfit: safeEmployeeProfit,
    glossiaNet: glossiaNet
  };
}

function updateOwnerProductsPopupPreview() {
  if (!ownerProductsPopupNetInput) {
    return;
  }

  const preview = getOwnerProductsPopupPreview();
  ownerProductsPopupNetInput.value = formatOwnerAmount(preview.glossiaNet);
}

function renderOwnerProductsPopupList() {
  if (!ownerProductsPopupList) {
    return;
  }

  const products = ensureOwnerProductsCollection();
  ownerProductsPopupList.innerHTML = "";

  if (products.length === 0) {
    ownerProductsPopupList.innerHTML = '<tr><td colspan="6" class="employee-empty-cell">Aucun produit ajouté.</td></tr>';
    return;
  }

  products.forEach(function (product, index) {
    const row = document.createElement("tr");
    const employeeProfit = Number(product.employeeProfit || 0);
    const sellingPrice = Number(product.sellingPrice || 0);
    const purchasePrice = Number(product.purchasePrice || 0);
    const employeePercent = Number.isFinite(Number(product.employeePercent))
      ? Number(product.employeePercent)
      : (sellingPrice > 0 ? (employeeProfit / sellingPrice) * 100 : 0);
    const glossiaNet = (sellingPrice - purchasePrice) - employeeProfit;

    row.innerHTML = "" +
      "<td>" + (product.name || "-") + "</td>" +
      "<td>" + formatOwnerAmount(purchasePrice) + "</td>" +
      "<td>" + formatOwnerAmount(sellingPrice) + "</td>" +
      "<td>" + formatOwnerAmount(employeeProfit) + "</td>" +
      "<td>" + formatOwnerAmount(glossiaNet) + "</td>" +
      "<td><button type=\"button\" class=\"manager-btn manager-btn-muted\" data-product-index=\"" + index + "\">Supprimer</button></td>";

    ownerProductsPopupList.appendChild(row);
  });
}

function openOwnerProductsPopupModal() {
  if (!ownerProductsPopupModal) {
    return;
  }

  if (ownerProductsPopupFeedback) {
    ownerProductsPopupFeedback.textContent = "";
  }

  if (ownerProductsPopupForm) {
    ownerProductsPopupForm.reset();
  }

  updateOwnerProductsPopupPreview();
  renderOwnerProductsPopupList();
  ownerProductsPopupModal.classList.remove("hidden");
}

function closeOwnerProductsPopupModal() {
  if (!ownerProductsPopupModal) {
    return;
  }

  ownerProductsPopupModal.classList.add("hidden");
}

function saveOwnerProductsData() {
  if (window.SalonStorage) {
    window.SalonStorage.saveData(ownerSharedData);
  }
}

function addOwnerProductFromPopup() {
  const name = ownerProductsPopupNameInput?.value.trim() || "";
  const preview = getOwnerProductsPopupPreview();

  if (!name) {
    if (ownerProductsPopupFeedback) {
      ownerProductsPopupFeedback.textContent = "Veuillez entrer le nom du produit.";
    }
    return;
  }

  if (preview.sellingPrice <= 0) {
    if (ownerProductsPopupFeedback) {
      ownerProductsPopupFeedback.textContent = "Veuillez saisir un prix de vente valide (> 0).";
    }
    return;
  }

  if (preview.employeeProfit < 0) {
    if (ownerProductsPopupFeedback) {
      ownerProductsPopupFeedback.textContent = "Le bénéfice personnel doit être supérieur ou égal à 0 DH.";
    }
    return;
  }

  const products = ensureOwnerProductsCollection();
  products.push({
    id: Date.now(),
    name: name,
    purchasePrice: Math.round(preview.purchasePrice * 100) / 100,
    sellingPrice: Math.round(preview.sellingPrice * 100) / 100,
    employeePercent: Math.round(preview.employeePercent * 100) / 100,
    employeeProfit: Math.round(preview.employeeProfit * 100) / 100
  });

  saveOwnerProductsData();
  if (ownerProductsPopupFeedback) {
    ownerProductsPopupFeedback.textContent = "Produit ajouté avec succès.";
  }

  if (ownerProductsPopupForm) {
    ownerProductsPopupForm.reset();
  }
  updateOwnerProductsPopupPreview();
  renderOwnerProductsPopupList();
}

function deleteOwnerProductFromPopup(index) {
  const products = ensureOwnerProductsCollection();
  if (!Number.isInteger(index) || index < 0 || index >= products.length) {
    return;
  }

  products.splice(index, 1);
  saveOwnerProductsData();
  renderOwnerProductsPopupList();
}

function saveOwnerTargetSettingsToSession() {
  syncOwnerCampaignTargetState();
  ownerSharedData.ownerCampaignTarget = ownerCampaignTarget;
  delete ownerSharedData.ownerSalesTargets;

  if (window.SalonStorage) {
    window.SalonStorage.saveData(ownerSharedData);
  }
}

function renderOwnerLastSavedIndicator() {
  if (!ownerLastSavedLabel) {
    return;
  }

  const label = window.SalonStorage
    ? window.SalonStorage.formatLastSavedAt()
    : "--";
  ownerLastSavedLabel.textContent = "Derniere sauvegarde: " + label;
}

function exportOwnerDataBackup() {
  if (!window.SalonStorage) {
    return;
  }

  const data = window.SalonStorage.loadData();
  const payload = {
    exportedAt: new Date().toISOString(),
    data: data
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "salon-backup-" + getWorkDateKeyFromDate(new Date()) + ".json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function importOwnerDataBackup(file) {
  if (!file || !window.SalonStorage) {
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      const data = parsed?.data && typeof parsed.data === "object" ? parsed.data : parsed;
      const normalized = window.SalonStorage.normalizeData(data);
      window.SalonStorage.saveData(normalized);
      window.location.reload();
    } catch (error) {
      alert("Fichier JSON invalide.");
    }
  };

  reader.readAsText(file);
}

function ownerDateFromISO(isoDate) {
  return new Date(isoDate + "T12:00:00");
}

function formatDateForOwnerDisplay(isoDate) {
  return ownerDateFromISO(isoDate).toLocaleDateString("fr-FR");
}

function getDayCountBetweenInclusive(startISO, endISO) {
  const start = ownerDateFromISO(startISO);
  const end = ownerDateFromISO(endISO);
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.floor((end.getTime() - start.getTime()) / dayMs) + 1;
}

function countOverlapDays(startDate, endDate, rangeStartDate, rangeEndDate) {
  const start = Math.max(startDate.getTime(), rangeStartDate.getTime());
  const end = Math.min(endDate.getTime(), rangeEndDate.getTime());
  if (end < start) {
    return 0;
  }

  const dayMs = 24 * 60 * 60 * 1000;
  return Math.floor((end - start) / dayMs) + 1;
}

function getOwnerCampaignTargets() {
  syncOwnerCampaignTargetState();

  if (!ownerCampaignTarget) {
    return null;
  }

  const dailyTarget = Number(ownerCampaignTarget.dailyTarget);
  const startDateISO = ownerCampaignTarget.startDate;
  const endDateISO = ownerCampaignTarget.endDate;
  if (!startDateISO || !endDateISO || !Number.isFinite(dailyTarget) || dailyTarget <= 0) {
    return null;
  }

  const startDate = ownerDateFromISO(startDateISO);
  const endDate = ownerDateFromISO(endDateISO);
  if (endDate < startDate) {
    return null;
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 12, 0, 0, 0);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 12, 0, 0, 0);
  const daysThisMonth = countOverlapDays(startDate, endDate, monthStart, monthEnd);
  const campaignDays = getDayCountBetweenInclusive(startDateISO, endDateISO);
  const globalTargetInput = Number(ownerCampaignTarget.globalTarget);
  const computedCampaignTarget = dailyTarget * campaignDays;
  const globalTarget = Number.isFinite(globalTargetInput) && globalTargetInput > 0
    ? globalTargetInput
    : computedCampaignTarget;

  return {
    startDateISO: startDateISO,
    endDateISO: endDateISO,
    dailyTarget: dailyTarget,
    weekTarget: dailyTarget * 7,
    monthTarget: dailyTarget * daysThisMonth,
    campaignTarget: computedCampaignTarget,
    globalTarget: globalTarget,
    monthDaysInCampaign: daysThisMonth,
    campaignDays: campaignDays
  };
}

function getOwnerTargetProgress(achieved, target) {
  if (!target) {
    return null;
  }

  const percentage = target > 0 ? (achieved / target) * 100 : 0;
  const safePercentage = Math.max(0, percentage);
  const remaining = Math.max(0, target - achieved);
  let className = "danger";

  if (safePercentage >= 100) {
    className = "success";
  } else if (safePercentage >= 50) {
    className = "warning";
  }

  return {
    percentage: safePercentage,
    fillWidth: Math.min(100, safePercentage),
    remaining: remaining,
    className: className
  };
}

function getWorkDateKeyFromDate(date) {
  const workDate = new Date(date);

  // Activity shortly after midnight belongs to the shift that started the day before.
  if (workDate.getHours() < 6) {
    workDate.setDate(workDate.getDate() - 1);
  }

  const year = workDate.getFullYear();
  const month = String(workDate.getMonth() + 1).padStart(2, "0");
  const day = String(workDate.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

function dateFromWorkDateKey(dateKey) {
  return new Date(dateKey + "T12:00:00");
}

function syncOwnerReferenceDateInput() {
  if (!ownerReferenceDateInput) {
    return;
  }

  ownerReferenceDateInput.value = getWorkDateKeyFromDate(ownerReferenceDate);
}

function setOwnerReferenceDate(nextDate) {
  ownerReferenceDate = new Date(nextDate);
  syncOwnerReferenceDateInput();
  renderOwnerDashboard(ownerActivePeriod);
}

function setOwnerCompactView(viewName, options) {
  const shouldOpenPopup = options?.openPopup !== false;
  ownerActiveCompactView = viewName || "overview";

  ownerCompactNavButtons.forEach(function (item) {
    item.classList.toggle("active", item.dataset.ownerSection === ownerActiveCompactView);
  });

  const allSections = getOwnerAllDashboardSections();

  function showOnly(visibleSections) {
    allSections.forEach(function (section) {
      section.classList.toggle("hidden", visibleSections.indexOf(section) === -1);
    });
  }

  if (viewName === "all") {
    showOnly(allSections);
    updateOwnerFocusPanel("all");
    if (shouldOpenPopup) {
      openOwnerSectionsModal("all");
    }
    return;
  }

  if (viewName === "overview") {
    showOnly([ownerSections.overview, ownerSections.targets, ownerSections.accounting]);
    updateOwnerFocusPanel("overview");
    if (shouldOpenPopup) {
      openOwnerSectionsModal("overview");
    }
    return;
  }

  if (viewName === "targets") {
    showOnly([ownerSections.targets]);
    updateOwnerFocusPanel("targets");
    if (shouldOpenPopup) {
      openOwnerSectionsModal("targets");
    }
    return;
  }

  if (viewName === "accounting") {
    showOnly([ownerSections.overview, ownerSections.accounting]);
    updateOwnerFocusPanel("accounting");
    if (shouldOpenPopup) {
      openOwnerSectionsModal("accounting");
    }
    return;
  }

  if (viewName === "operations") {
    showOnly([ownerSections.overview].concat(ownerSections.operations.filter(Boolean)));
    updateOwnerFocusPanel("operations");
    if (shouldOpenPopup) {
      openOwnerSectionsModal("operations");
    }
    return;
  }

  if (viewName === "team") {
    showOnly([ownerSections.overview].concat(ownerSections.team.filter(Boolean)));
    updateOwnerFocusPanel("team");
    if (shouldOpenPopup) {
      openOwnerSectionsModal("team");
    }
    return;
  }

  updateOwnerFocusPanel("overview");
  if (shouldOpenPopup) {
    openOwnerSectionsModal("overview");
  }
}

function openOwnerAccessModal() {
  if (!ownerAccessModal) {
    return;
  }

  if (ownerAccessFeedback) {
    ownerAccessFeedback.textContent = "";
  }

  renderOwnerAccessManager();
  ownerAccessModal.classList.remove("hidden");

  if (ownerToggleAccessButton) {
    ownerToggleAccessButton.textContent = "Masquer sécurité";
    ownerToggleAccessButton.setAttribute("aria-expanded", "true");
  }
}

function closeOwnerAccessModal() {
  if (!ownerAccessModal) {
    return;
  }

  ownerAccessModal.classList.add("hidden");

  if (ownerToggleAccessButton) {
    ownerToggleAccessButton.textContent = "Afficher sécurité";
    ownerToggleAccessButton.setAttribute("aria-expanded", "false");
  }
}

function renderOwnerFocusPills(items) {
  if (!ownerFocusPills) {
    return;
  }

  ownerFocusPills.innerHTML = "";
  items.forEach(function (item) {
    const pill = document.createElement("span");
    pill.className = "owner-focus-pill" + (item.className ? " " + item.className : "");
    pill.textContent = item.label + " : " + item.value;
    ownerFocusPills.appendChild(pill);
  });
}

function renderOwnerFocusChecklist(items) {
  if (!ownerFocusList) {
    return;
  }

  ownerFocusList.innerHTML = "";
  items.forEach(function (item) {
    const row = document.createElement("li");
    row.className = "owner-focus-item" + (item.className ? " " + item.className : "");

    const label = document.createElement("strong");
    const value = document.createElement("span");
    label.textContent = item.label;
    value.textContent = item.value;

    row.appendChild(label);
    row.appendChild(value);
    ownerFocusList.appendChild(row);
  });
}

function getOwnerTopSellerSummary() {
  const employeeHealth = getSortedOwnerEmployeeHealth();
  const topSellerId = getOwnerTopSellerId(employeeHealth);
  if (!topSellerId) {
    return "Aucune vente aujourd'hui";
  }

  const topSeller = employeeHealth.find(function (entry) {
    return entry.employee.id === topSellerId;
  });

  if (!topSeller) {
    return "Aucune vente aujourd'hui";
  }

  return topSeller.employee.name + " · " + formatOwnerAmount(topSeller.today.salesTotal);
}

function updateOwnerFocusPanel(viewName) {
  if (!ownerFocusTitle || !ownerFocusSubtitle || !ownerFocusPills || !ownerFocusList) {
    return;
  }

  const summary = getFixedOwnerSummary();
  const needsHours = Math.max(0, summary.expectedToday - summary.completedToday);
  const targetSummaryText = ownerTargetSummary ? ownerTargetSummary.textContent : "Aucun objectif défini.";
  const finance = ownerFinanceSnapshot;
  const operations = ownerOperationsSnapshot;

  if (viewName === "targets") {
    ownerFocusTitle.textContent = "Objectifs et fiscalité";
    ownerFocusSubtitle.textContent = "Progression campagne et impact des taxes en un coup d'oeil.";
    renderOwnerFocusPills([
      { label: "Objectif 12h", value: summary.completedToday + " / " + summary.expectedToday, className: needsHours === 0 ? "success" : "warning" },
      { label: "Tâches restantes", value: String(summary.pendingTasks), className: summary.pendingTasks === 0 ? "success" : "warning" },
      { label: "Top vendeur", value: getOwnerTopSellerSummary() }
    ]);
    renderOwnerFocusChecklist([
      { label: "Campagne", value: targetSummaryText || "Aucun objectif défini" },
      { label: "Action prioritaire", value: needsHours > 0 ? needsHours + " employé(s) à relancer pour les 12h" : "Objectif horaire validé" },
      { label: "Risque du jour", value: summary.pendingTasks > 0 ? summary.pendingTasks + " tâche(s) à finaliser" : "Aucun retard tâches" }
    ]);
    return;
  }

  if (viewName === "accounting") {
    const revenueValue = parseOwnerDisplayedAmount(finance.revenue);
    const fixedValue = parseOwnerDisplayedAmount(finance.fixedTotal);
    const variableValue = parseOwnerDisplayedAmount(finance.variableTotal);
    const payrollValue = parseOwnerDisplayedAmount(finance.payrollNetTotal);
    const fullChargesValue = fixedValue + variableValue + payrollValue;
    const glossiaNetValue = revenueValue - fullChargesValue;

    ownerFocusTitle.textContent = "Comptabilité essentielle";
    ownerFocusSubtitle.textContent = "CA - (charges fixes + variables + rémunération équipe) = bénéfice net Glossia.";
    renderOwnerFocusPills([
      { label: "CA", value: finance.revenue },
      { label: "Charges complètes", value: formatOwnerAmount(fullChargesValue) },
      { label: "Bénéfice net Glossia", value: formatOwnerAmount(glossiaNetValue), className: glossiaNetValue < 0 ? "danger" : "success" }
    ]);
    renderOwnerFocusChecklist([
      { label: "Charges fixes", value: finance.fixedTotal },
      { label: "Charges variables", value: finance.variableTotal },
      { label: "Rémunération équipe", value: finance.payrollNetTotal },
      { label: "Formule", value: formatOwnerAmount(revenueValue) + " - " + formatOwnerAmount(fullChargesValue) + " = " + formatOwnerAmount(glossiaNetValue) }
    ]);
    return;
  }

  if (viewName === "operations") {
    ownerFocusTitle.textContent = "Pilotage opérationnel";
    ownerFocusSubtitle.textContent = "Suivi ventes, exécution et stock pour agir rapidement.";
    renderOwnerFocusPills([
      { label: "Services", value: operations.services },
      { label: "Produits", value: operations.products },
      { label: "Ruptures", value: String(operations.ruptureCount), className: operations.ruptureCount > 0 ? "warning" : "success" }
    ]);
    renderOwnerFocusChecklist([
      { label: "Taux tâches", value: operations.tasksRate },
      { label: "Conformité horaires", value: operations.hours },
      { label: "Produits consommés", value: operations.consumed }
    ]);
    return;
  }

  if (viewName === "team") {
    ownerFocusTitle.textContent = "Performance équipe";
    ownerFocusSubtitle.textContent = "Les signaux humains et commerciaux les plus importants.";
    renderOwnerFocusPills([
      { label: "Effectif", value: String(ownerEmployees.length) },
      { label: "Objectif 12h", value: summary.completedToday + " / " + summary.expectedToday, className: needsHours === 0 ? "success" : "warning" },
      { label: "Top vendeur", value: getOwnerTopSellerSummary() }
    ]);
    renderOwnerFocusChecklist([
      { label: "Tâches en attente", value: String(summary.pendingTasks) },
      { label: "Tâches terminées", value: summary.completedTasks + " / " + summary.totalTasks },
      { label: "Point critique", value: needsHours > 0 ? needsHours + " employé(s) en retard sur les 12h" : "Aucun retard horaire" }
    ]);
    return;
  }

  if (viewName === "all") {
    ownerFocusTitle.textContent = "Vue globale CEO";
    ownerFocusSubtitle.textContent = "Business complet avec priorités de pilotage immédiat.";
    renderOwnerFocusPills([
      { label: "CA jour", value: formatOwnerAmount(summary.todaySales) },
      { label: "Bénéfice net", value: finance.profit, className: finance.profit.startsWith("-") ? "danger" : "success" },
      { label: "Ruptures", value: String(operations.ruptureCount), className: operations.ruptureCount > 0 ? "warning" : "success" }
    ]);
    renderOwnerFocusChecklist([
      { label: "Objectifs 12h", value: summary.completedToday + " / " + summary.expectedToday },
      { label: "Tâches en attente", value: String(summary.pendingTasks) },
      { label: "Campagne", value: targetSummaryText || "Aucun objectif défini" }
    ]);
    return;
  }

  ownerFocusTitle.textContent = "Pilotage essentiel";
  ownerFocusSubtitle.textContent = "Indicateurs clés et actions immédiates de la journée.";
  renderOwnerFocusPills([
    { label: "CA jour", value: formatOwnerAmount(summary.todaySales) },
    { label: "CA semaine", value: formatOwnerAmount(summary.weekSales) },
    { label: "Bénéfice net", value: finance.profit, className: finance.profit.startsWith("-") ? "danger" : "success" }
  ]);
  renderOwnerFocusChecklist([
    { label: "Objectifs 12h", value: summary.completedToday + " / " + summary.expectedToday },
    { label: "Tâches en attente", value: String(summary.pendingTasks) },
    { label: "Top vendeur", value: getOwnerTopSellerSummary() }
  ]);
}

function ownerDateFromKey(dateKey) {
  return new Date(dateKey + "T12:00:00");
}

function getOwnerWeekStart(date) {
  const start = new Date(date);
  const weekday = start.getDay();
  const daysSinceMonday = weekday === 0 ? 6 : weekday - 1;

  start.setDate(start.getDate() - daysSinceMonday);
  start.setHours(0, 0, 0, 0);
  return start;
}

function isOwnerDateInPeriod(date, period) {
  const currentWorkDate = ownerDateFromKey(getWorkDateKeyFromDate(ownerReferenceDate));
  const entryWorkDate = ownerDateFromKey(getWorkDateKeyFromDate(date));

  if (period === "day") {
    return getWorkDateKeyFromDate(entryWorkDate) === getWorkDateKeyFromDate(ownerReferenceDate);
  }

  if (period === "week") {
    const weekStart = getOwnerWeekStart(currentWorkDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return entryWorkDate >= weekStart && entryWorkDate < weekEnd;
  }

  if (period === "quarter") {
    const currentQuarter = Math.floor(currentWorkDate.getMonth() / 3);
    const entryQuarter = Math.floor(entryWorkDate.getMonth() / 3);
    return (
      entryWorkDate.getFullYear() === currentWorkDate.getFullYear() &&
      entryQuarter === currentQuarter
    );
  }

  if (period === "year") {
    return entryWorkDate.getFullYear() === currentWorkDate.getFullYear();
  }

  return (
    entryWorkDate.getFullYear() === currentWorkDate.getFullYear() &&
    entryWorkDate.getMonth() === currentWorkDate.getMonth()
  );
}

function calculateOwnerSchedule(schedule) {
  if (!schedule) {
    return null;
  }

  if (schedule.restDay) {
    return {
      restDay: true,
      workedMinutes: 0,
      missingMinutes: 0,
      meetsTarget: true
    };
  }

  const stamps = [schedule.arrival, schedule.lunch, schedule.returnTime, schedule.departure];
  if (stamps.some(function (stamp) { return !stamp; })) {
    return null;
  }

  const arrival = new Date(schedule.arrival.iso).getTime();
  const lunch = new Date(schedule.lunch.iso).getTime();
  const returnTime = new Date(schedule.returnTime.iso).getTime();
  const departure = new Date(schedule.departure.iso).getTime();

  if (!(arrival <= lunch && lunch <= returnTime && returnTime <= departure)) {
    return null;
  }

  const totalMinutes = Math.round((departure - arrival) / 60000);
  const breakMinutes = Math.round((returnTime - lunch) / 60000);
  const workedMinutes = Math.max(0, totalMinutes - breakMinutes);

  return {
    workedMinutes: workedMinutes,
    missingMinutes: Math.max(0, ownerRequiredDailyMinutes - workedMinutes),
    meetsTarget: workedMinutes >= ownerRequiredDailyMinutes
  };
}

function getOwnerEmployeeState(employeeId) {
  return ownerEmployeeData[employeeId] || {
    salesHistory: [],
    tasks: [],
    scheduleByDate: {}
  };
}

function getOwnerEmployeeProductSales(employeeId) {
  return (ownerSharedData.productSales || []).filter(function (record) {
    return Number(record.employeeId) === Number(employeeId);
  });
}

function getOwnerGlossiaProductNetForPeriod(period) {
  const products = Array.isArray(ownerSharedData.ownerProducts) ? ownerSharedData.ownerProducts : [];
  const productsById = new Map(products.map(function (product) {
    return [Number(product.id), product];
  }));

  function getMatchedProduct(sale) {
    const byId = Number.isFinite(Number(sale.productId))
      ? productsById.get(Number(sale.productId))
      : null;
    if (byId) {
      return byId;
    }

    const saleLabel = String(sale.label || "").trim().toLowerCase();
    if (!saleLabel) {
      return null;
    }

    return products.find(function (product) {
      return String(product?.name || "").trim().toLowerCase() === saleLabel;
    }) || null;
  }

  return (ownerSharedData.productSales || []).reduce(function (total, sale) {
    if (!sale?.dateISO) {
      return total;
    }

    const saleDate = new Date(sale.dateISO);
    if (!Number.isFinite(saleDate.getTime()) || !isOwnerDateInPeriod(saleDate, period)) {
      return total;
    }

    const quantity = Math.max(1, Number(sale.quantity || 1));
    const saleAmount = Number(sale.amount || 0);
    const matchedProduct = getMatchedProduct(sale);
    const purchaseUnit = Number(matchedProduct?.purchasePrice || matchedProduct?.costPrice || 0);
    const employeeUnit = Number.isFinite(Number(sale.unitMargin))
      ? Number(sale.unitMargin)
      : Number(matchedProduct?.employeeProfit || matchedProduct?.profitMargin || 0);

    const safeSaleAmount = Number.isFinite(saleAmount) ? saleAmount : 0;
    const safePurchaseCost = Number.isFinite(purchaseUnit) && purchaseUnit > 0 ? purchaseUnit * quantity : 0;
    const safeEmployeeProfit = Number.isFinite(employeeUnit) && employeeUnit > 0 ? employeeUnit * quantity : 0;
    const netGlossia = safeSaleAmount - safeEmployeeProfit - safePurchaseCost;

    return total + netGlossia;
  }, 0);
}

function getOwnerGlossiaProductNetForSale(sale, products, productsById) {
  if (!sale || !sale.dateISO) {
    return 0;
  }

  const byId = Number.isFinite(Number(sale.productId))
    ? productsById.get(Number(sale.productId))
    : null;

  const matchedProduct = byId || products.find(function (product) {
    const saleLabel = String(sale.label || "").trim().toLowerCase();
    return saleLabel && String(product?.name || "").trim().toLowerCase() === saleLabel;
  }) || null;

  const quantity = Math.max(1, Number(sale.quantity || 1));
  const saleAmount = Number(sale.amount || 0);
  const purchaseUnit = Number(matchedProduct?.purchasePrice || matchedProduct?.costPrice || 0);
  const employeeUnit = Number.isFinite(Number(sale.unitMargin))
    ? Number(sale.unitMargin)
    : Number(matchedProduct?.employeeProfit || matchedProduct?.profitMargin || 0);

  const safeSaleAmount = Number.isFinite(saleAmount) ? saleAmount : 0;
  const safePurchaseCost = Number.isFinite(purchaseUnit) && purchaseUnit > 0 ? purchaseUnit * quantity : 0;
  const safeEmployeeProfit = Number.isFinite(employeeUnit) && employeeUnit > 0 ? employeeUnit * quantity : 0;

  return safeSaleAmount - safeEmployeeProfit - safePurchaseCost;
}

function getOwnerServiceBenefitForPeriod(period) {
  const totalServiceSales = ownerEmployees.reduce(function (total, employee) {
    const state = getOwnerEmployeeState(employee.id);
    const serviceSales = (state.salesHistory || []).filter(function (sale) {
      if (!sale?.dateISO) {
        return false;
      }

      const saleDate = new Date(sale.dateISO);
      return Number.isFinite(saleDate.getTime()) && isOwnerDateInPeriod(saleDate, period);
    });

    const serviceTotal = serviceSales.reduce(function (sum, sale) {
      const amount = Number(sale.amount || 0);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    return total + serviceTotal;
  }, 0);

  // Team works on 50/50 for services, so owner's service benefit is 50%.
  return totalServiceSales * 0.5;
}

function getOwnerPayrollForPeriod(period) {
  const salaries = ownerSharedData.employeeSalaries && typeof ownerSharedData.employeeSalaries === "object"
    ? ownerSharedData.employeeSalaries
    : {};
  const monthlyPayroll = Object.values(salaries).reduce(function (total, value) {
    const amount = Number(value || 0);
    return total + (Number.isFinite(amount) && amount > 0 ? amount : 0);
  }, 0);

  const baseDate = ownerReferenceDate instanceof Date ? ownerReferenceDate : new Date();
  const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();
  const safeDaysInMonth = Math.max(28, Number(daysInMonth || 30));

  if (period === "day") {
    return monthlyPayroll / safeDaysInMonth;
  }

  if (period === "week") {
    return (monthlyPayroll * 7) / safeDaysInMonth;
  }

  return monthlyPayroll;
}

function getOwnerGlobalNetProfitForPeriod(period) {
  const serviceBenefit = getOwnerServiceBenefitForPeriod(period);
  const glossiaProductNet = getOwnerGlossiaProductNetForPeriod(period);

  return serviceBenefit + glossiaProductNet;
}

function getOwnerFinanceTrendBuckets(period) {
  const baseDate = new Date(ownerReferenceDate || new Date());
  baseDate.setHours(12, 0, 0, 0);
  const buckets = [];

  if (period === "week") {
    const currentWeekStart = getOwnerWeekStart(baseDate);
    for (let index = 7; index >= 0; index -= 1) {
      const start = new Date(currentWeekStart);
      start.setDate(start.getDate() - (index * 7));
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      buckets.push({
        label: "S" + (8 - index),
        start: start,
        end: end
      });
    }
    return buckets;
  }

  if (period === "month") {
    for (let index = 5; index >= 0; index -= 1) {
      const start = new Date(baseDate.getFullYear(), baseDate.getMonth() - index, 1, 0, 0, 0, 0);
      const end = new Date(baseDate.getFullYear(), baseDate.getMonth() - index + 1, 0, 23, 59, 59, 999);
      buckets.push({
        label: start.toLocaleDateString("fr-FR", { month: "short" }),
        start: start,
        end: end
      });
    }
    return buckets;
  }

  for (let index = 6; index >= 0; index -= 1) {
    const start = new Date(baseDate);
    start.setDate(start.getDate() - index);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    buckets.push({
      label: start.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
      start: start,
      end: end
    });
  }

  return buckets;
}

function renderOwnerTopFinanceTrend(period) {
  if (!ownerTopFinanceTrend) {
    return;
  }

  const products = Array.isArray(ownerSharedData.ownerProducts) ? ownerSharedData.ownerProducts : [];
  const productsById = new Map(products.map(function (product) {
    return [Number(product.id), product];
  }));
  const buckets = getOwnerFinanceTrendBuckets(period);

  const points = buckets.map(function (bucket) {
    const serviceSales = ownerEmployees.reduce(function (total, employee) {
      const state = getOwnerEmployeeState(employee.id);
      const sum = (state.salesHistory || []).reduce(function (inner, sale) {
        const saleDate = new Date(sale.dateISO);
        if (!Number.isFinite(saleDate.getTime()) || saleDate < bucket.start || saleDate > bucket.end) {
          return inner;
        }
        return inner + Number(sale.amount || 0);
      }, 0);

      return total + sum;
    }, 0);

    const serviceBenefit = serviceSales * 0.5;

    const productNet = (ownerSharedData.productSales || []).reduce(function (total, sale) {
      const saleDate = new Date(sale.dateISO);
      if (!Number.isFinite(saleDate.getTime()) || saleDate < bucket.start || saleDate > bucket.end) {
        return total;
      }

      return total + getOwnerGlossiaProductNetForSale(sale, products, productsById);
    }, 0);

    return {
      label: bucket.label,
      value: serviceBenefit + productNet
    };
  });

  if (points.length === 0) {
    ownerTopFinanceTrend.innerHTML = "";
    return;
  }

  const values = points.map(function (point) {
    return point.value;
  });
  const minValue = Math.min.apply(null, values);
  const maxValue = Math.max.apply(null, values);
  const span = Math.max(1, maxValue - minValue);

  const width = 700;
  const height = 170;
  const paddingLeft = 16;
  const paddingRight = 16;
  const paddingTop = 14;
  const paddingBottom = 30;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const pathPoints = points.map(function (point, index) {
    const x = paddingLeft + (points.length === 1 ? 0 : (index * chartWidth) / (points.length - 1));
    const y = paddingTop + (maxValue - point.value) / span * chartHeight;
    return { x: x, y: y, value: point.value, label: point.label };
  });

  const linePath = pathPoints.map(function (point, index) {
    return (index === 0 ? "M" : "L") + point.x.toFixed(1) + " " + point.y.toFixed(1);
  }).join(" ");

  const areaPath = linePath + " L " + pathPoints[pathPoints.length - 1].x.toFixed(1) + " " + (paddingTop + chartHeight).toFixed(1) +
    " L " + pathPoints[0].x.toFixed(1) + " " + (paddingTop + chartHeight).toFixed(1) + " Z";

  const dots = pathPoints.map(function (point) {
    return '<circle cx="' + point.x.toFixed(1) + '" cy="' + point.y.toFixed(1) + '" r="3" fill="#6be0b8" />';
  }).join("");

  const labels = points.map(function (point) {
    return '<span>' + point.label + '</span>';
  }).join("");

  const lastValue = points[points.length - 1].value;
  const prevValue = points.length > 1 ? points[points.length - 2].value : lastValue;
  const delta = lastValue - prevValue;
  const deltaSign = delta >= 0 ? "+" : "";

  ownerTopFinanceTrend.innerHTML =
    '<div class="owner-top-finance-trend-head">' +
    '<strong>Tendance bénéfice global</strong>' +
    '<span>Dernier point: ' + formatOwnerAmount(lastValue) + ' (' + deltaSign + formatOwnerAmount(delta) + ')</span>' +
    '</div>' +
    '<svg class="owner-top-finance-trend-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Courbe du bénéfice global Glossia">' +
    '<defs><linearGradient id="ownerFinanceTrendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(91, 209, 162, 0.35)" /><stop offset="100%" stop-color="rgba(91, 209, 162, 0.03)" /></linearGradient></defs>' +
    '<line x1="' + paddingLeft + '" y1="' + (paddingTop + chartHeight).toFixed(1) + '" x2="' + (paddingLeft + chartWidth).toFixed(1) + '" y2="' + (paddingTop + chartHeight).toFixed(1) + '" stroke="rgba(255,255,255,0.18)" stroke-width="1" />' +
    '<path d="' + areaPath + '" fill="url(#ownerFinanceTrendFill)" />' +
    '<path d="' + linePath + '" fill="none" stroke="#7deac2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />' +
    dots +
    '</svg>' +
    '<div class="owner-top-finance-trend-labels">' + labels + '</div>';
}

function getOwnerSalesForPeriod(state, period, employeeId) {
  const serviceSales = (state.salesHistory || []).filter(function (sale) {
    return isOwnerDateInPeriod(new Date(sale.dateISO), period);
  });

  const productSales = getOwnerEmployeeProductSales(employeeId).filter(function (sale) {
    return isOwnerDateInPeriod(new Date(sale.dateISO), period);
  }).map(function (sale) {
    return {
      amount: Number(sale.amount || 0),
      dateISO: sale.dateISO
    };
  });

  return serviceSales.concat(productSales);
}

function getOwnerSalesForDateRange(state, startISO, endISO, employeeId) {
  if (!startISO || !endISO) {
    return [];
  }

  const serviceSales = (state.salesHistory || []).filter(function (sale) {
    const saleWorkDate = getWorkDateKeyFromDate(new Date(sale.dateISO));
    return saleWorkDate >= startISO && saleWorkDate <= endISO;
  });

  const productSales = getOwnerEmployeeProductSales(employeeId).filter(function (sale) {
    const saleWorkDate = getWorkDateKeyFromDate(new Date(sale.dateISO));
    return saleWorkDate >= startISO && saleWorkDate <= endISO;
  }).map(function (sale) {
    return {
      amount: Number(sale.amount || 0),
      dateISO: sale.dateISO
    };
  });

  return serviceSales.concat(productSales);
}

function sumOwnerSales(sales) {
  return sales.reduce(function (total, sale) {
    return total + Number(sale.amount || 0);
  }, 0);
}

function getOwnerScheduleEntries(state, period) {
  return Object.entries(state.scheduleByDate || {})
    .map(function (entry) {
      return {
        dateKey: entry[0],
        date: ownerDateFromKey(entry[0]),
        schedule: entry[1],
        calculation: calculateOwnerSchedule(entry[1])
      };
    })
    .filter(function (entry) {
      return (
        isOwnerDateInPeriod(entry.date, period) &&
        Boolean(entry.schedule.arrival || entry.schedule.restDay)
      );
    });
}

function getOwnerEmployeePeriodMetrics(employee, period) {
  const state = getOwnerEmployeeState(employee.id);
  const scheduleEntries = getOwnerScheduleEntries(state, period);
  const periodSales = getOwnerSalesForPeriod(state, period, employee.id);
  const workedMinutes = scheduleEntries.reduce(function (total, entry) {
    return total + (entry.calculation?.workedMinutes || 0);
  }, 0);
  const targetDays = scheduleEntries.filter(function (entry) {
    return !entry.schedule.restDay;
  }).length;
  const targetMinutes = targetDays * ownerRequiredDailyMinutes;

  return {
    state: state,
    scheduleEntries: scheduleEntries,
    salesTotal: sumOwnerSales(periodSales),
    weekSalesTotal: sumOwnerSales(getOwnerSalesForPeriod(state, "week", employee.id)),
    workedMinutes: workedMinutes,
    targetMinutes: targetMinutes,
    missingMinutes: Math.max(0, targetMinutes - workedMinutes),
    complete: scheduleEntries.length > 0 && scheduleEntries.every(function (entry) {
      return entry.schedule.restDay || Boolean(entry.calculation);
    })
  };
}

function createOwnerSummaryCard(icon, label, value, detail, className, periodName, drilldown) {
  const card = document.createElement("article");
  card.className = "owner-summary-card" + (className ? " " + className : "");

  if (periodName) {
    card.dataset.summaryPeriod = periodName;
  }

  if (drilldown && typeof drilldown === "object") {
    if (drilldown.view) {
      card.dataset.drilldownView = drilldown.view;
    }
    if (drilldown.range) {
      card.dataset.drilldownRange = drilldown.range;
    }
    if (drilldown.scrollTargetId) {
      card.dataset.scrollTargetId = drilldown.scrollTargetId;
    }

    card.classList.add("is-clickable");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", label + " · Voir le détail");
  }

  const iconElement = document.createElement("span");
  iconElement.className = "owner-summary-icon";
  iconElement.innerHTML = icon;

  const content = document.createElement("div");
  const labelElement = document.createElement("span");
  const valueElement = document.createElement("strong");
  const detailElement = document.createElement("small");

  labelElement.textContent = label;
  valueElement.textContent = value;
  detailElement.textContent = detail;

  content.appendChild(labelElement);
  content.appendChild(valueElement);
  content.appendChild(detailElement);
  card.appendChild(iconElement);
  card.appendChild(content);

  return card;
}

function getOwnerSummaryIcon(kind) {
  const icons = {
    team: '<svg class="app-icon" viewBox="0 0 24 24"><path d="M16 19a4 4 0 0 1 4 4M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 0c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Zm6-4a3 3 0 1 0 0-6"/></svg>',
    sun: '<svg class="app-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v3m0 16v3m11-11h-3M4 12H1m18.78 7.78-2.12-2.12M6.34 6.34 4.22 4.22m15.56 0-2.12 2.12M6.34 17.66l-2.12 2.12"/></svg>',
    trend: '<svg class="app-icon" viewBox="0 0 24 24"><path d="M3 17h18M5 15l5-5 4 4 5-6"/></svg>',
    calendar: '<svg class="app-icon" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4m-5 4h18"/></svg>',
    money: '<svg class="app-icon" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 10h.01M18 14h.01"/></svg>',
    receipt: '<svg class="app-icon" viewBox="0 0 24 24"><path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3Z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
    clock: '<svg class="app-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>',
    check: '<svg class="app-icon" viewBox="0 0 24 24"><path d="m4 12 5 5L20 6"/></svg>',
    list: '<svg class="app-icon" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>'
  };

  return icons[kind] || icons.list;
}

function getFixedOwnerSummary() {
  const todayKey = getWorkDateKeyFromDate(ownerReferenceDate);
  let todaySales = 0;
  let weekSales = 0;
  let monthSales = 0;
  let completedToday = 0;
  let expectedToday = 0;
  let pendingTasks = 0;
  let completedTasks = 0;
  let totalTasks = 0;

  ownerEmployees.forEach(function (employee) {
    const state = getOwnerEmployeeState(employee.id);
    todaySales += sumOwnerSales(getOwnerSalesForPeriod(state, "day", employee.id));
    weekSales += sumOwnerSales(getOwnerSalesForPeriod(state, "week", employee.id));
    monthSales += sumOwnerSales(getOwnerSalesForPeriod(state, "month", employee.id));

    const todaySchedule = state.scheduleByDate?.[todayKey] || {};
    const todayCalculation = calculateOwnerSchedule(todaySchedule);
    if (!todaySchedule.restDay) {
      expectedToday += 1;
    }

    if (todayCalculation?.meetsTarget && !todaySchedule.restDay) {
      completedToday += 1;
    }

    const tasks = state.tasks || [];
    const employeeCompletedTasks = tasks.filter(function (task) {
      if (!task.done) {
        return false;
      }

      // Older in-memory tasks have no timestamp, so keep them visible as completed.
      return !task.completedAtISO || isOwnerDateInPeriod(new Date(task.completedAtISO), "day");
    }).length;

    completedTasks += employeeCompletedTasks;
    totalTasks += tasks.length;
    pendingTasks += tasks.filter(function (task) {
      return !task.done;
    }).length;
  });

  return {
    todaySales: todaySales,
    weekSales: weekSales,
    monthSales: monthSales,
    completedToday: completedToday,
    expectedToday: expectedToday,
    missingToday: Math.max(0, expectedToday - completedToday),
    pendingTasks: pendingTasks,
    completedTasks: completedTasks,
    totalTasks: totalTasks
  };
}

function syncOwnerTopPeriodButtons(period) {
  ownerTopPeriodButtons.forEach(function (button) {
    const isActive = button.dataset.period === period;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function syncOwnerAccountingPeriod(period) {
  const accountingButton = document.querySelector('.owner-accounting-period-btn[data-period="' + period + '"]');
  if (!accountingButton || accountingButton.classList.contains("active")) {
    return;
  }

  accountingButton.click();
}

function getOwnerObjectiveTopStatus(period, summary) {
  const targets = getOwnerCampaignTargets();
  const labelMap = {
    day: "Objectif Jour",
    week: "Objectif Semaine",
    month: "Objectif Mois"
  };

  if (!targets) {
    return {
      className: "danger",
      label: labelMap[period] || "Objectif",
      value: "Non défini"
    };
  }

  const target = period === "day"
    ? targets.dailyTarget
    : period === "week"
      ? targets.weekTarget
      : targets.monthTarget;
  const achieved = period === "day"
    ? summary.todaySales
    : period === "week"
      ? summary.weekSales
      : summary.monthSales;

  if (!Number.isFinite(target) || target <= 0) {
    return {
      className: "danger",
      label: labelMap[period] || "Objectif",
      value: "Non défini"
    };
  }

  const ratio = achieved / target;
  let className = "danger";

  if (ratio >= 1.9) {
    className = "gold";
  } else if (ratio >= 1.5) {
    className = "success";
  } else if (ratio >= 1) {
    className = "warning";
  }

  return {
    className: className,
    label: labelMap[period] || "Objectif",
    value: (ratio * 100).toFixed(1) + "%"
  };
}

function renderOwnerTopFinanceStrip() {
  if (!ownerTopKpiRevenue || !ownerTopKpiExpenses || !ownerTopKpiProfit) {
    return;
  }

  const summary = getFixedOwnerSummary();
  const objectiveStatus = getOwnerObjectiveTopStatus(ownerTopFinancePeriod, summary);
  const periodRevenue = ownerTopFinancePeriod === "day"
    ? formatOwnerAmount(summary.todaySales)
    : ownerTopFinancePeriod === "week"
      ? formatOwnerAmount(summary.weekSales)
      : formatOwnerAmount(summary.monthSales);

  ownerTopKpiRevenue.textContent = periodRevenue;
  ownerTopKpiExpenses.textContent = ownerFinanceSnapshot.expenses;
  ownerTopKpiProfit.textContent = formatOwnerAmount(getOwnerGlobalNetProfitForPeriod(ownerTopFinancePeriod));
  if (ownerTopKpiGlossiaProductNet) {
    ownerTopKpiGlossiaProductNet.textContent = formatOwnerAmount(getOwnerGlossiaProductNetForPeriod(ownerTopFinancePeriod));
  }

  renderOwnerTopFinanceTrend(ownerTopFinancePeriod);

  if (ownerTopKpiObjectiveLabel) {
    ownerTopKpiObjectiveLabel.textContent = objectiveStatus.label;
  }

  if (ownerTopKpiObjectiveValue) {
    ownerTopKpiObjectiveValue.textContent = objectiveStatus.value;
  }

  if (ownerTopKpiObjectiveCard) {
    ownerTopKpiObjectiveCard.classList.remove("danger", "warning", "success", "gold");
    ownerTopKpiObjectiveCard.classList.add(objectiveStatus.className);
  }

  syncOwnerTopPeriodButtons(ownerTopFinancePeriod);
}

function setOwnerTopFinancePeriod(period) {
  ownerTopFinancePeriod = period;
  renderOwnerDashboard(period);
  syncOwnerAccountingPeriod(period);
  renderOwnerTopFinanceStrip();
}

function renderOwnerSummary(activePeriod) {
  const summary = getFixedOwnerSummary();
  const finance = ownerFinanceSnapshot;
  const periodRevenue = activePeriod === "day"
    ? summary.todaySales
    : activePeriod === "week"
      ? summary.weekSales
      : summary.monthSales;

  const chargesDetail = "Fixes " + finance.fixedTotal + " · Variables " + finance.variableTotal + " · Paie " + finance.payrollNetTotal;
  ownerSummaryGrid.innerHTML = "";

  const cards = [
    createOwnerSummaryCard(
      getOwnerSummaryIcon("team"),
      "Employés",
      String(ownerEmployees.length),
      "Équipe totale",
      "",
      "",
      { scrollTargetId: "owner-employees-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("sun"),
      "Ventes aujourd'hui",
      formatOwnerAmount(summary.todaySales),
      "Cumul de l'équipe",
      "",
      "day",
      { view: "services", range: "day", scrollTargetId: "owner-bi-details-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("trend"),
      "Ventes semaine",
      formatOwnerAmount(summary.weekSales),
      "Depuis lundi",
      "",
      "week",
      { view: "services", range: "week", scrollTargetId: "owner-bi-details-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("calendar"),
      "Ventes mois",
      formatOwnerAmount(summary.monthSales),
      "Mois en cours",
      "",
      "month",
      { view: "services", range: "month", scrollTargetId: "owner-bi-details-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("money"),
      "Chiffre d'affaires",
      formatOwnerAmount(periodRevenue),
      "Période sélectionnée",
      "",
      activePeriod,
      { scrollTargetId: "owner-accounting-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("receipt"),
      "Charges totales",
      finance.expenses,
      chargesDetail,
      "warning",
      "",
      { scrollTargetId: "owner-accounting-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("trend"),
      "Bénéfice net",
      finance.profit,
      "CA - charges",
      String(finance.profit || "").trim().startsWith("-") ? "danger" : "success",
      "",
      { scrollTargetId: "owner-accounting-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("clock"),
      "Objectif 12h aujourd'hui",
      summary.completedToday + " / " + summary.expectedToday,
      summary.missingToday + " à compléter",
      summary.missingToday === 0 ? "success" : "warning",
      "",
      { view: "hours", range: "day", scrollTargetId: "owner-bi-details-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("check"),
      "Tâches en attente",
      String(summary.pendingTasks),
      "Toutes équipes",
      summary.pendingTasks === 0 ? "success" : "warning",
      "",
      { view: "tasks", range: "day", scrollTargetId: "owner-bi-details-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("list"),
      "Tâches terminées aujourd'hui",
      summary.completedTasks + " / " + summary.totalTasks,
      "Total assigné à l'équipe",
      summary.pendingTasks === 0 ? "success" : "",
      "",
      { view: "tasks", range: "day", scrollTargetId: "owner-bi-details-title" }
    )
  ];

  cards.forEach(function (card) {
    if (card.dataset.summaryPeriod === activePeriod) {
      card.classList.add("active-period");
    }
    ownerSummaryGrid.appendChild(card);
  });
}

function getOwnerPeriodLabels(period) {
  if (period === "day") {
    return {
      badge: "Aujourd'hui",
      presence: "Pointage aujourd'hui",
      sales: "Ventes aujourd'hui"
    };
  }

  if (period === "week") {
    return {
      badge: "Cette semaine",
      presence: "Jours pointés",
      sales: "Ventes semaine"
    };
  }

  return {
    badge: "Ce mois",
    presence: "Jours pointés",
    sales: "Ventes mois"
  };
}

function getOwnerStatusText(metrics) {
  const hasRestDay = metrics.scheduleEntries.some(function (entry) {
    return entry.schedule.restDay;
  });

  if (metrics.scheduleEntries.length === 1 && hasRestDay) {
    return { text: "Repos", className: "pending" };
  }

  if (metrics.scheduleEntries.length === 0) {
    return { text: "Aucun pointage", className: "pending" };
  }

  if (!metrics.complete) {
    return {
      text: "Incomplet · Manque " + formatOwnerMinutes(metrics.missingMinutes),
      className: "warning"
    };
  }

  if (metrics.missingMinutes === 0) {
    return {
      text: formatOwnerMinutes(metrics.workedMinutes),
      className: "success"
    };
  }

  return {
    text: "Manque " + formatOwnerMinutes(metrics.missingMinutes),
    className: "warning"
  };
}

function appendOwnerCell(row, content, className) {
  const cell = document.createElement("td");

  if (typeof content === "string") {
    cell.textContent = content;
  } else {
    cell.appendChild(content);
  }

  if (className) {
    cell.className = className;
  }

  row.appendChild(cell);
}

function createOwnerEmployeeIdentity(employee) {
  const wrapper = document.createElement("div");
  wrapper.className = "owner-employee-identity";

  const avatar = document.createElement("span");
  avatar.textContent = employee.name.charAt(0).toUpperCase();

  const text = document.createElement("div");
  const name = document.createElement("strong");
  const post = document.createElement("small");

  name.textContent = employee.name;
  post.textContent = employee.post;
  text.appendChild(name);
  text.appendChild(post);
  wrapper.appendChild(avatar);
  wrapper.appendChild(text);

  return wrapper;
}

function createOwnerTrend(weekTotal, maxWeekTotal) {
  const wrapper = document.createElement("div");
  wrapper.className = "owner-trend";

  const amount = document.createElement("strong");
  const track = document.createElement("span");
  const fill = document.createElement("i");
  const percentage = maxWeekTotal > 0 ? (weekTotal / maxWeekTotal) * 100 : 0;

  amount.textContent = formatOwnerAmount(weekTotal);
  track.className = "owner-trend-track";
  fill.style.width = percentage + "%";
  track.appendChild(fill);
  wrapper.appendChild(amount);
  wrapper.appendChild(track);

  return wrapper;
}

function getOwnerPresenceText(metrics, period) {
  if (period !== "day") {
    return metrics.scheduleEntries.length + " jour(s)";
  }

  const todayEntry = metrics.scheduleEntries[0];
  if (!todayEntry) {
    return "Non pointé";
  }

  if (todayEntry.schedule.restDay) {
    return "Repos";
  }

  const arrival = todayEntry.schedule.arrival?.time || "--:--";
  const departure = todayEntry.schedule.departure?.time || "--:--";
  return arrival + " → " + departure;
}

function renderOwnerEmployeeTable(period) {
  const employeeMetrics = ownerEmployees.map(function (employee) {
    return {
      employee: employee,
      metrics: getOwnerEmployeePeriodMetrics(employee, period)
    };
  });
  const maxWeekTotal = employeeMetrics.reduce(function (highest, entry) {
    return Math.max(highest, entry.metrics.weekSalesTotal);
  }, 0);

  ownerEmployeeBody.innerHTML = "";

  if (employeeMetrics.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.className = "employee-empty-cell";
    cell.textContent = "Aucun employé enregistré.";
    row.appendChild(cell);
    ownerEmployeeBody.appendChild(row);
    return;
  }

  employeeMetrics.forEach(function (entry) {
    const row = document.createElement("tr");
    const metrics = entry.metrics;
    const status = getOwnerStatusText(metrics);
    const tasks = metrics.state.tasks || [];
    const completedTasks = tasks.filter(function (task) { return task.done; }).length;

    appendOwnerCell(row, createOwnerEmployeeIdentity(entry.employee));
    appendOwnerCell(row, getOwnerPresenceText(metrics, period));
    appendOwnerCell(row, status.text, "history-status " + status.className);
    appendOwnerCell(row, formatOwnerAmount(metrics.salesTotal), "owner-sales-cell");
    appendOwnerCell(row, completedTasks + " / " + tasks.length + " terminées");
    appendOwnerCell(row, createOwnerTrend(metrics.weekSalesTotal, maxWeekTotal));
    ownerEmployeeBody.appendChild(row);
  });
}

function formatOwnerMinutesWithWords(totalMinutes) {
  const safeMinutes = Math.max(0, Math.round(totalMinutes || 0));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  return hours + "h " + String(minutes).padStart(2, "0") + "min";
}

function getOwnerTodayDetails(state, employeeId) {
  const todayKey = getWorkDateKeyFromDate(ownerReferenceDate);
  const schedule = state.scheduleByDate?.[todayKey] || {};
  const calculation = calculateOwnerSchedule(schedule);

  return {
    schedule: schedule,
    calculation: calculation,
    salesTotal: sumOwnerSales(getOwnerSalesForPeriod(state, "day", employeeId))
  };
}

function getOwnerEmployeeTodayHealth(employee) {
  const state = getOwnerEmployeeState(employee.id);
  const today = getOwnerTodayDetails(state, employee.id);
  const daySales = today.salesTotal;
  const weekSales = sumOwnerSales(getOwnerSalesForPeriod(state, "week", employee.id));
  const monthSales = sumOwnerSales(getOwnerSalesForPeriod(state, "month", employee.id));
  const campaignTargets = getOwnerCampaignTargets();
  const campaignSales = campaignTargets
    ? sumOwnerSales(getOwnerSalesForDateRange(state, campaignTargets.startDateISO, campaignTargets.endDateISO, employee.id))
    : 0;

  const activeTarget = campaignTargets
    ? (ownerActivePeriod === "day"
      ? campaignTargets.dailyTarget
      : ownerActivePeriod === "week"
        ? campaignTargets.weekTarget
        : campaignTargets.monthTarget)
    : null;

  const activeSales = ownerActivePeriod === "day"
    ? daySales
    : ownerActivePeriod === "week"
      ? weekSales
      : monthSales;

  const targetProgress = campaignTargets
    ? getOwnerTargetProgress(activeSales, activeTarget)
    : null;

  const tasks = state.tasks || [];
  const completedTasks = tasks.filter(function (task) { return task.done; }).length;
  const incompleteTasks = tasks.length - completedTasks;
  const meetsHours = Boolean(today.calculation?.meetsTarget);

  return {
    employee: employee,
    state: state,
    today: today,
    daySales: daySales,
    weekSales: weekSales,
    monthSales: monthSales,
    campaignSales: campaignSales,
    campaignTargets: campaignTargets,
    activeTarget: activeTarget,
    activeSales: activeSales,
    targetProgress: targetProgress,
    completedTasks: completedTasks,
    totalTasks: tasks.length,
    incompleteTasks: incompleteTasks,
    missingMinutes: today.calculation
      ? today.calculation.missingMinutes
      : ownerRequiredDailyMinutes,
    meetsHours: meetsHours,
    hasIssue: !meetsHours || incompleteTasks > 0,
    isCompliant: meetsHours && incompleteTasks === 0
  };
}

function getSortedOwnerEmployeeHealth() {
  return ownerEmployees
    .map(getOwnerEmployeeTodayHealth)
    .sort(function (first, second) {
      if (first.hasIssue !== second.hasIssue) {
        return first.hasIssue ? -1 : 1;
      }

      if (first.missingMinutes !== second.missingMinutes) {
        return second.missingMinutes - first.missingMinutes;
      }

      if (first.incompleteTasks !== second.incompleteTasks) {
        return second.incompleteTasks - first.incompleteTasks;
      }

      return first.employee.name.localeCompare(second.employee.name, "fr");
    });
}

function getOwnerTopSellerId(employeeHealth) {
  const highestSales = employeeHealth.reduce(function (highest, health) {
    return Math.max(highest, health.today.salesTotal);
  }, 0);

  if (highestSales <= 0) {
    return null;
  }

  return employeeHealth.find(function (health) {
    return health.today.salesTotal === highestSales;
  })?.employee.id || null;
}

function renderOwnerAlerts() {
  const employeeHealth = getSortedOwnerEmployeeHealth();
  const missingHours = employeeHealth.filter(function (health) {
    return !health.meetsHours;
  });
  const employeesWithTasks = employeeHealth.filter(function (health) {
    return health.incompleteTasks > 0;
  });
  const totalIncompleteTasks = employeesWithTasks.reduce(function (total, health) {
    return total + health.incompleteTasks;
  }, 0);
  const hasIssues = missingHours.length > 0 || totalIncompleteTasks > 0;

  ownerAlertBanner.innerHTML = "";
  ownerAlertBanner.className = "owner-alert-banner " + (hasIssues ? "warning" : "success");

  const heading = document.createElement("strong");
  heading.textContent = hasIssues ? "Alertes du jour" : "Tout est en ordre aujourd'hui";
  ownerAlertBanner.appendChild(heading);

  if (!hasIssues) {
    return;
  }

  const list = document.createElement("ul");

  if (missingHours.length > 0) {
    const item = document.createElement("li");
    item.textContent =
      missingHours.length +
      " employé" + (missingHours.length > 1 ? "s n'ont" : " n'a") +
      " pas complété " + (missingHours.length > 1 ? "leurs" : "ses") + " 12h";
    list.appendChild(item);
  }

  if (totalIncompleteTasks > 0) {
    const item = document.createElement("li");
    const breakdown = employeesWithTasks.map(function (health) {
      return health.employee.name + ": " + health.incompleteTasks;
    }).join(", ");

    item.textContent =
      totalIncompleteTasks + " tâche" + (totalIncompleteTasks > 1 ? "s non terminées" : " non terminée") +
      " (" + breakdown + ")";
    list.appendChild(item);
  }

  ownerAlertBanner.appendChild(list);
}

function getOwnerStampText(stamp) {
  return stamp?.dateTime || stamp?.time || "Non pointé";
}

function getOwnerDetailedStatus(calculation) {
  if (calculation?.restDay) {
    return {
      text: "Jour de repos",
      className: "pending"
    };
  }

  if (!calculation) {
    return {
      text: "Manque 12h 00min · pointages incomplets",
      className: "warning"
    };
  }

  if (calculation.meetsTarget) {
    return {
      text: formatOwnerMinutesWithWords(calculation.workedMinutes) + " effectuées",
      className: "success"
    };
  }

  return {
    text: "Manque " + formatOwnerMinutesWithWords(calculation.missingMinutes),
    className: "warning"
  };
}

function getOwnerCompactStatus(health) {
  if (health.today?.calculation?.restDay) {
    return {
      text: "Repos",
      className: "pending"
    };
  }

  if (health.meetsHours) {
    return {
      text: "Objectif 12h00",
      className: "success"
    };
  }

  const missing = health.missingMinutes || ownerRequiredDailyMinutes;
  return {
    text: "Manque " + formatOwnerMinutesWithWords(missing),
    className: "warning"
  };
}

function getOwnerPeriodBadge(period) {
  if (period === "day") {
    return "Jour";
  }

  if (period === "week") {
    return "Semaine";
  }

  return "Mois";
}

function createOwnerTargetProgressBlock(activeSales, activeTarget, targetProgress, period) {
  const block = document.createElement("div");
  block.className = "owner-target-progress";

  if (!targetProgress || activeTarget == null) {
    const empty = document.createElement("p");
    empty.className = "owner-target-empty";
    empty.textContent = "Aucun objectif défini";
    block.appendChild(empty);
    return block;
  }

  const top = document.createElement("div");
  top.className = "owner-target-progress-top";

  const label = document.createElement("span");
  label.textContent = "Objectif " + getOwnerPeriodBadge(period);

  const value = document.createElement("strong");
  value.textContent = formatOwnerEuro(activeSales) + " / " + formatOwnerEuro(activeTarget);

  top.appendChild(label);
  top.appendChild(value);

  const track = document.createElement("div");
  track.className = "owner-target-track";

  const fill = document.createElement("i");
  fill.className = "owner-target-fill " + targetProgress.className;
  fill.style.width = targetProgress.fillWidth + "%";
  track.appendChild(fill);

  const status = document.createElement("p");
  status.className = "owner-target-progress-status " + targetProgress.className;
  if (activeTarget === 0) {
    status.textContent = "0 jour dans la période de campagne";
    status.className = "owner-target-progress-status warning";
  } else {
    status.textContent =
      Math.round(targetProgress.percentage) + "% atteint · Reste " + formatOwnerEuro(targetProgress.remaining);
  }

  block.appendChild(top);
  block.appendChild(track);
  block.appendChild(status);
  return block;
}

function createOwnerCompactCard(health, topSellerId) {
  const compactStatus = getOwnerCompactStatus(health);
  const card = document.createElement("button");
  card.type = "button";
  card.className = "owner-compact-card " + (health.isCompliant ? "compliant" : "issue");
  card.dataset.employeeId = String(health.employee.id);

  const titleRow = document.createElement("div");
  titleRow.className = "owner-compact-top";

  const identity = document.createElement("div");
  identity.className = "owner-compact-identity";
  const name = document.createElement("strong");
  const post = document.createElement("small");
  name.textContent = health.employee.name;
  post.textContent = health.employee.post;
  identity.appendChild(name);
  identity.appendChild(post);

  titleRow.appendChild(identity);

  if (health.employee.id === topSellerId) {
    const bestBadge = document.createElement("span");
    bestBadge.className = "owner-best-employee-badge";
    bestBadge.textContent = "Top vendeur";
    titleRow.appendChild(bestBadge);
  }

  const badges = document.createElement("div");
  badges.className = "owner-compact-badges";

  const statusBadge = document.createElement("span");
  statusBadge.className = "owner-compact-badge " + compactStatus.className;
  statusBadge.textContent = compactStatus.text;

  const tasksBadge = document.createElement("span");
  tasksBadge.className =
    "owner-compact-badge " + (health.incompleteTasks > 0 ? "warning" : "success");
  tasksBadge.textContent = health.completedTasks + "/" + health.totalTasks + " tâches";

  badges.appendChild(statusBadge);
  badges.appendChild(tasksBadge);

  const footer = document.createElement("p");
  footer.className = "owner-compact-footer";
  footer.textContent = "Aujourd'hui: " + formatOwnerAmount(health.today.salesTotal);

  const targetProgress = createOwnerTargetProgressBlock(
    health.activeSales,
    health.activeTarget,
    health.targetProgress,
    ownerActivePeriod
  );

  card.appendChild(titleRow);
  card.appendChild(badges);
  card.appendChild(targetProgress);
  card.appendChild(footer);
  return card;
}

function createOwnerDetailItem(label, value, className) {
  const item = document.createElement("div");
  item.className = "owner-detail-item" + (className ? " " + className : "");

  const labelElement = document.createElement("span");
  const valueElement = document.createElement("strong");
  labelElement.textContent = label;
  valueElement.textContent = value;

  item.appendChild(labelElement);
  item.appendChild(valueElement);
  return item;
}

function fillOwnerTaskChecklist(tasks) {
  const completedTasks = tasks.filter(function (task) { return task.done; }).length;
  ownerModalTaskCount.textContent = completedTasks + "/" + tasks.length + " tâches terminées";
  ownerModalTaskList.innerHTML = "";

  if (tasks.length === 0) {
    const item = document.createElement("li");
    item.className = "empty";
    item.textContent = "Aucune tâche assignée.";
    ownerModalTaskList.appendChild(item);
  } else {
    tasks.forEach(function (task) {
      const item = document.createElement("li");
      const icon = document.createElement("span");
      const text = document.createElement("span");

      item.className = task.done ? "done" : "pending";
      icon.textContent = task.done ? "OK" : "A faire";
      text.textContent = task.text;
      item.appendChild(icon);
      item.appendChild(text);
      ownerModalTaskList.appendChild(item);
    });
  }
}

function renderOwnerTargetIndicators(items) {
  if (!ownerTargetIndicators) {
    return;
  }

  ownerTargetIndicators.innerHTML = "";

  items.forEach(function (item) {
    const card = document.createElement("article");
    const label = document.createElement("span");
    const value = document.createElement("strong");

    card.className = "owner-target-indicator" + (item.className ? " " + item.className : "");
    label.className = "owner-target-indicator-label";
    label.textContent = item.label;
    value.className = "owner-target-indicator-value";
    value.textContent = item.value;

    card.appendChild(label);
    card.appendChild(value);
    ownerTargetIndicators.appendChild(card);
  });
}

function getOwnerTargetPeriodLabel(period) {
  if (period === "day") {
    return "Jour";
  }

  if (period === "week") {
    return "Semaine";
  }

  if (period === "month") {
    return "Mois";
  }

  if (period === "quarter") {
    return "Trimestre";
  }

  return "Année";
}

function getOwnerTargetPeriodDays(period) {
  const reference = ownerDateFromKey(getWorkDateKeyFromDate(ownerReferenceDate));

  if (period === "day") {
    return 1;
  }

  if (period === "week") {
    return 7;
  }

  if (period === "month") {
    return new Date(reference.getFullYear(), reference.getMonth() + 1, 0).getDate();
  }

  if (period === "quarter") {
    const startMonth = Math.floor(reference.getMonth() / 3) * 3;
    return (
      new Date(reference.getFullYear(), startMonth + 1, 0).getDate() +
      new Date(reference.getFullYear(), startMonth + 2, 0).getDate() +
      new Date(reference.getFullYear(), startMonth + 3, 0).getDate()
    );
  }

  const year = reference.getFullYear();
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return isLeap ? 366 : 365;
}

function getOwnerTargetAchievedForPeriod(period) {
  return ownerEmployees.reduce(function (total, employee) {
    const state = getOwnerEmployeeState(employee.id);
    return total + sumOwnerSales(getOwnerSalesForPeriod(state, period, employee.id));
  }, 0);
}

function getOwnerGlobalCampaignAchieved(startDateISO, endDateISO) {
  return ownerEmployees.reduce(function (total, employee) {
    const state = getOwnerEmployeeState(employee.id);
    return total + sumOwnerSales(getOwnerSalesForDateRange(state, startDateISO, endDateISO, employee.id));
  }, 0);
}

function syncOwnerTargetPeriodButtons(activePeriod) {
  ownerTargetPeriodButtons.forEach(function (button) {
    const isActive = button.dataset.period === activePeriod;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function renderOwnerTargetSummary() {
  const selectedPeriod = ownerTargetStatsPeriod || "day";
  const selectedLabel = getOwnerTargetPeriodLabel(selectedPeriod);
  syncOwnerTargetPeriodButtons(selectedPeriod);

  const targets = getOwnerCampaignTargets();
  if (!targets) {
    ownerTargetSummary.textContent = "Aucun objectif défini pour " + selectedLabel + ".";
    renderOwnerTargetIndicators([
      { label: "Réalisé " + selectedLabel, value: "0,00 DH" },
      { label: "Objectif " + selectedLabel, value: "0,00 DH" },
      { label: "Taux " + selectedLabel, value: "0.0%", className: "danger" },
      { label: "Reste " + selectedLabel, value: "0,00 DH" },
      {
        label: "Glossia global (campagne)",
        value: "0,00 DH / 0,00 DH",
        className: "owner-target-indicator-global danger"
      }
    ]);
    return;
  }

  const achieved = getOwnerTargetAchievedForPeriod(selectedPeriod);
  const target = targets.dailyTarget * getOwnerTargetPeriodDays(selectedPeriod);
  const progress = getOwnerTargetProgress(achieved, target);
  const remaining = Math.max(0, target - achieved);
  const globalAchieved = getOwnerGlobalCampaignAchieved(targets.startDateISO, targets.endDateISO);
  const globalReached = globalAchieved >= targets.globalTarget;
  const globalClassName = "owner-target-indicator-global " + (globalReached ? "success" : "danger");

  renderOwnerTargetIndicators([
    {
      label: "Réalisé " + selectedLabel,
      value: formatOwnerEuro(achieved)
    },
    {
      label: "Objectif " + selectedLabel,
      value: formatOwnerEuro(target)
    },
    {
      label: "Taux " + selectedLabel,
      value: formatOwnerPercent(progress.percentage),
      className: progress.className
    },
    {
      label: "Reste " + selectedLabel,
      value: formatOwnerEuro(remaining),
      className: remaining === 0 ? "success" : ""
    },
    {
      label: "Glossia global (campagne)",
      value: formatOwnerEuro(globalAchieved) + " / " + formatOwnerEuro(targets.globalTarget),
      className: globalClassName
    }
  ]);

  ownerTargetSummary.textContent =
    "Objectif " + selectedLabel + ": " + formatOwnerEuro(achieved) + " / " + formatOwnerEuro(target) +
    " (" + formatOwnerPercent(progress.percentage) + ") · Reste: " + formatOwnerEuro(remaining) + ".";
}

function renderOwnerTargetForm() {
  syncOwnerCampaignTargetState();
  ownerTargetStartDateInput.value = ownerCampaignTarget?.startDate || "";
  ownerTargetEndDateInput.value = ownerCampaignTarget?.endDate || "";
  ownerTargetDailyInput.value = ownerCampaignTarget?.dailyTarget
    ? String(ownerCampaignTarget.dailyTarget)
    : "";
  ownerTargetGlobalInput.value = ownerCampaignTarget?.globalTarget
    ? String(ownerCampaignTarget.globalTarget)
    : "";
}

function openOwnerTargetModal() {
  ownerTargetFeedback.textContent = "";
  ownerTargetFeedback.classList.remove("is-error");
  renderOwnerTargetForm();

  if (ownerTargetModalTitle) {
    ownerTargetModalTitle.textContent = "Objectifs personnel et global";
  }

  if (ownerTargetModalSubtitle) {
    ownerTargetModalSubtitle.textContent = "Renseignez l'objectif journalier du personnel et l'objectif global de Glossia sur la période.";
  }

  ownerTargetModal.classList.remove("hidden");
}

function closeOwnerTargetModal() {
  ownerTargetModal.classList.add("hidden");
}

function saveOwnerTargetsFromForm() {
  syncOwnerCampaignTargetState();
  const startDate = ownerTargetStartDateInput.value;
  const endDate = ownerTargetEndDateInput.value;
  const dailyTarget = Number(ownerTargetDailyInput.value);
  const globalTarget = Number(ownerTargetGlobalInput.value);

  if (!startDate || !endDate) {
    ownerTargetFeedback.textContent = "Veuillez renseigner une date de début et une date de fin.";
    ownerTargetFeedback.classList.add("is-error");
    return false;
  }

  if (!Number.isFinite(dailyTarget) || dailyTarget <= 0) {
    ownerTargetFeedback.textContent = "Veuillez saisir un objectif journalier valide (> 0).";
    ownerTargetFeedback.classList.add("is-error");
    return false;
  }

  if (!Number.isFinite(globalTarget) || globalTarget <= 0) {
    ownerTargetFeedback.textContent = "Veuillez saisir un objectif global Glossia valide (> 0).";
    ownerTargetFeedback.classList.add("is-error");
    return false;
  }

  if (ownerDateFromISO(endDate) < ownerDateFromISO(startDate)) {
    ownerTargetFeedback.textContent = "La date de fin doit être égale ou après la date de début.";
    ownerTargetFeedback.classList.add("is-error");
    return false;
  }

  ownerCampaignTarget.startDate = startDate;
  ownerCampaignTarget.endDate = endDate;
  ownerCampaignTarget.dailyTarget = Math.round(dailyTarget * 100) / 100;
  ownerCampaignTarget.globalTarget = Math.round(globalTarget * 100) / 100;

  saveOwnerTargetSettingsToSession();
  ownerTargetFeedback.textContent = "Objectifs enregistrés.";
  ownerTargetFeedback.classList.remove("is-error");
  renderOwnerDashboard(ownerActivePeriod);
  return true;
}

function openOwnerDetailModal(employeeHealth, period) {
  const employee = employeeHealth.employee;
  const state = employeeHealth.state;
  const today = employeeHealth.today;
  const todayStatus = getOwnerDetailedStatus(today.calculation);
  const periodMetrics = getOwnerEmployeePeriodMetrics(employee, period);
  const periodStatus = getOwnerStatusText(periodMetrics);
  const weekSales = sumOwnerSales(getOwnerSalesForPeriod(state, "week", employee.id));
  const monthSales = sumOwnerSales(getOwnerSalesForPeriod(state, "month", employee.id));

  ownerModalTitle.textContent = "Détails · " + employee.name;
  ownerModalSubtitle.textContent = employee.post;

  ownerModalTimeGrid.innerHTML = "";
  ownerModalTimeGrid.appendChild(createOwnerDetailItem("Arrivée", getOwnerStampText(today.schedule.arrival)));
  ownerModalTimeGrid.appendChild(createOwnerDetailItem("Pause déjeuner", getOwnerStampText(today.schedule.lunch)));
  ownerModalTimeGrid.appendChild(createOwnerDetailItem("Retour", getOwnerStampText(today.schedule.returnTime)));
  ownerModalTimeGrid.appendChild(createOwnerDetailItem("Départ", getOwnerStampText(today.schedule.departure)));
  ownerModalTimeGrid.appendChild(createOwnerDetailItem("Heures travaillées", todayStatus.text, todayStatus.className));

  ownerModalSalesGrid.innerHTML = "";
  ownerModalSalesGrid.appendChild(createOwnerDetailItem("Ventes aujourd'hui", formatOwnerAmount(today.salesTotal)));
  ownerModalSalesGrid.appendChild(createOwnerDetailItem("Ventes cette semaine", formatOwnerAmount(weekSales)));
  ownerModalSalesGrid.appendChild(createOwnerDetailItem("Ventes ce mois", formatOwnerAmount(monthSales)));
  ownerModalSalesGrid.appendChild(
    createOwnerDetailItem(
      "Période sélectionnée · " + getOwnerPeriodLabels(period).badge,
      formatOwnerMinutes(periodMetrics.workedMinutes) + " · " + periodStatus.text,
      periodStatus.className
    )
  );

  ownerModalTargetGrid.innerHTML = "";
  if (!employeeHealth.campaignTargets) {
    ownerModalTargetGrid.appendChild(
      createOwnerDetailItem("Objectif", "Aucun objectif défini", "warning")
    );
  } else {
    const dayProgress = getOwnerTargetProgress(employeeHealth.daySales, employeeHealth.campaignTargets.dailyTarget);
    const weekProgress = getOwnerTargetProgress(employeeHealth.weekSales, employeeHealth.campaignTargets.weekTarget);
    const monthProgress = getOwnerTargetProgress(employeeHealth.monthSales, employeeHealth.campaignTargets.monthTarget);
    const campaignProgress = getOwnerTargetProgress(employeeHealth.campaignSales, employeeHealth.campaignTargets.campaignTarget);

    ownerModalTargetGrid.appendChild(
      createOwnerDetailItem(
        "Objectif jour",
        formatOwnerEuro(employeeHealth.daySales) + " / " + formatOwnerEuro(employeeHealth.campaignTargets.dailyTarget) +
        " (" + Math.round(dayProgress.percentage) + "%)",
        dayProgress.className
      )
    );
    ownerModalTargetGrid.appendChild(
      createOwnerDetailItem(
        "Objectif semaine",
        formatOwnerEuro(employeeHealth.weekSales) + " / " + formatOwnerEuro(employeeHealth.campaignTargets.weekTarget) +
        " (" + Math.round(weekProgress.percentage) + "%)",
        weekProgress.className
      )
    );
    ownerModalTargetGrid.appendChild(
      createOwnerDetailItem(
        "Objectif mois",
        formatOwnerEuro(employeeHealth.monthSales) + " / " + formatOwnerEuro(employeeHealth.campaignTargets.monthTarget) +
        " (" + Math.round(monthProgress.percentage) + "%)",
        monthProgress.className
      )
    );
    ownerModalTargetGrid.appendChild(
      createOwnerDetailItem(
        "Objectif campagne",
        formatOwnerEuro(employeeHealth.campaignSales) + " / " + formatOwnerEuro(employeeHealth.campaignTargets.campaignTarget) +
        " (" + Math.round(campaignProgress.percentage) + "%)",
        campaignProgress.className
      )
    );
    ownerModalTargetGrid.appendChild(
      createOwnerDetailItem(
        "Période campagne",
        formatDateForOwnerDisplay(employeeHealth.campaignTargets.startDateISO) +
        " → " + formatDateForOwnerDisplay(employeeHealth.campaignTargets.endDateISO)
      )
    );
  }

  fillOwnerTaskChecklist(state.tasks || []);
  ownerDetailModal.classList.remove("hidden");
}

function closeOwnerDetailModal() {
  ownerDetailModal.classList.add("hidden");
}

function renderOwnerEmployeeDetails(period) {
  ownerEmployeeCards.innerHTML = "";

  if (ownerEmployees.length === 0) {
    const emptyText = document.createElement("p");
    emptyText.className = "employee-list-empty";
    emptyText.textContent = "Aucun employé enregistré.";
    ownerEmployeeCards.appendChild(emptyText);
    return;
  }

  const employeeHealth = getSortedOwnerEmployeeHealth();
  const topSellerId = getOwnerTopSellerId(employeeHealth);

  employeeHealth.forEach(function (health) {
    ownerEmployeeCards.appendChild(createOwnerCompactCard(health, topSellerId));
  });
}

function renderOwnerSalesChart(period) {
  const data = ownerEmployees.map(function (employee) {
    const state = getOwnerEmployeeState(employee.id);
    return {
      employee: employee,
      total: sumOwnerSales(getOwnerSalesForPeriod(state, period, employee.id))
    };
  });
  const maxTotal = data.reduce(function (highest, entry) {
    return Math.max(highest, entry.total);
  }, 0);

  ownerSalesChart.innerHTML = "";

  if (data.length === 0) {
    const emptyText = document.createElement("p");
    emptyText.className = "employee-list-empty";
    emptyText.textContent = "Aucune donnée disponible.";
    ownerSalesChart.appendChild(emptyText);
    return;
  }

  data.forEach(function (entry) {
    const row = document.createElement("div");
    row.className = "owner-chart-row";

    const label = document.createElement("strong");
    const track = document.createElement("div");
    const fill = document.createElement("span");
    const amount = document.createElement("b");
    const percentage = maxTotal > 0 ? (entry.total / maxTotal) * 100 : 0;

    label.textContent = entry.employee.name;
    track.className = "owner-chart-track";
    fill.style.width = percentage + "%";
    track.appendChild(fill);
    amount.textContent = formatOwnerAmount(entry.total);

    row.appendChild(label);
    row.appendChild(track);
    row.appendChild(amount);
    ownerSalesChart.appendChild(row);
  });
}

function renderOwnerDashboard(period) {
  ownerActivePeriod = period;
  ownerTopFinancePeriod = period;
  const labels = getOwnerPeriodLabels(period);

  ownerPeriodLabel.textContent = labels.badge;
  ownerPresenceHeading.textContent = labels.presence;
  ownerSalesHeading.textContent = labels.sales;

  renderOwnerSummary(period);
  renderOwnerTargetSummary();
  renderOwnerAlerts();
  renderOwnerSalesChart(period);
  renderOwnerEmployeeTable(period);
  renderOwnerEmployeeDetails(period);
  renderOwnerAccessManager();
  syncOwnerAccountingPeriod(period);
  renderOwnerTopFinanceStrip();
  updateOwnerFocusPanel(ownerActiveCompactView);
}

function scrollOwnerSectionIntoView(sectionId) {
  if (!sectionId) {
    return;
  }

  const sectionTitle = document.getElementById(sectionId);
  if (!sectionTitle) {
    return;
  }

  sectionTitle.scrollIntoView({ behavior: "smooth", block: "start" });
}

function activateOwnerBiViewFromSummary(view, range) {
  if (view) {
    const viewButton = document.querySelector('.owner-bi-nav-card[data-view="' + view + '"]');
    if (viewButton) {
      viewButton.click();
    }
  }

  if (range) {
    const rangeButton = document.querySelector('.owner-bi-range-btn[data-range="' + range + '"]');
    if (rangeButton) {
      rangeButton.click();
    }
  }
}

function handleOwnerSummaryDrilldown(card) {
  if (!card || !card.classList.contains("is-clickable")) {
    return;
  }

  activateOwnerBiViewFromSummary(card.dataset.drilldownView, card.dataset.drilldownRange);
  scrollOwnerSectionIntoView(card.dataset.scrollTargetId);
}

ownerSummaryGrid.addEventListener("click", function (event) {
  const card = event.target.closest(".owner-summary-card");
  if (!card) {
    return;
  }

  handleOwnerSummaryDrilldown(card);
});

ownerSummaryGrid.addEventListener("keydown", function (event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const card = event.target.closest(".owner-summary-card");
  if (!card) {
    return;
  }

  event.preventDefault();
  handleOwnerSummaryDrilldown(card);
});

ownerEmployeeCards.addEventListener("click", function (event) {
  const card = event.target.closest(".owner-compact-card");
  if (!card) {
    return;
  }

  const employeeId = Number(card.dataset.employeeId);
  const employee = ownerEmployees.find(function (item) {
    return item.id === employeeId;
  });
  if (!employee) {
    return;
  }

  openOwnerDetailModal(getOwnerEmployeeTodayHealth(employee), ownerActivePeriod);
});

ownerModalCloseButton.addEventListener("click", function () {
  closeOwnerDetailModal();
});

ownerModalCloseIconButton.addEventListener("click", function () {
  closeOwnerDetailModal();
});

ownerDetailModal.addEventListener("click", function (event) {
  if (event.target === ownerDetailModal) {
    closeOwnerDetailModal();
  }
});

ownerOpenTargetModalButton.addEventListener("click", function () {
  openOwnerTargetModal();
});

if (ownerOpenProductsManagementButton) {
  ownerOpenProductsManagementButton.addEventListener("click", function () {
    openOwnerProductsAccountingPanel();
  });
}

if (ownerOpenProductsPopupButton) {
  ownerOpenProductsPopupButton.addEventListener("click", function () {
    openOwnerProductsPopupModal();
  });
}

if (ownerProductsPopupCloseButton) {
  ownerProductsPopupCloseButton.addEventListener("click", function () {
    closeOwnerProductsPopupModal();
  });
}

if (ownerProductsPopupCloseIconButton) {
  ownerProductsPopupCloseIconButton.addEventListener("click", function () {
    closeOwnerProductsPopupModal();
  });
}

if (ownerProductsPopupModal) {
  ownerProductsPopupModal.addEventListener("click", function (event) {
    if (event.target === ownerProductsPopupModal) {
      closeOwnerProductsPopupModal();
    }
  });
}

[ownerProductsPopupPurchaseInput, ownerProductsPopupSellingInput, ownerProductsPopupEmployeeShareInput].forEach(function (input) {
  if (input) {
    input.addEventListener("input", function () {
      updateOwnerProductsPopupPreview();
    });
  }
});

if (ownerProductsPopupForm) {
  ownerProductsPopupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addOwnerProductFromPopup();
  });
}

if (ownerProductsPopupList) {
  ownerProductsPopupList.addEventListener("click", function (event) {
    const deleteButton = event.target.closest("button[data-product-index]");
    if (!deleteButton) {
      return;
    }

    deleteOwnerProductFromPopup(Number(deleteButton.dataset.productIndex));
  });
}

ownerCompactNavButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    setOwnerCompactView(button.dataset.ownerSection || "overview");
  });
});

if (ownerSectionsCloseButton) {
  ownerSectionsCloseButton.addEventListener("click", function () {
    closeOwnerSectionsModal();
  });
}

if (ownerSectionsCloseIconButton) {
  ownerSectionsCloseIconButton.addEventListener("click", function () {
    closeOwnerSectionsModal();
  });
}

if (ownerSectionsModal) {
  ownerSectionsModal.addEventListener("click", function (event) {
    if (event.target === ownerSectionsModal) {
      closeOwnerSectionsModal();
    }
  });
}

if (ownerToggleAccessButton) {
  ownerToggleAccessButton.addEventListener("click", function () {
    if (ownerAccessModal && ownerAccessModal.classList.contains("hidden")) {
      openOwnerAccessModal();
      return;
    }

    closeOwnerAccessModal();
  });
}

if (ownerAccessCloseButton) {
  ownerAccessCloseButton.addEventListener("click", function () {
    closeOwnerAccessModal();
  });
}

if (ownerAccessCloseIconButton) {
  ownerAccessCloseIconButton.addEventListener("click", function () {
    closeOwnerAccessModal();
  });
}

if (ownerAccessModal) {
  ownerAccessModal.addEventListener("click", function (event) {
    if (event.target === ownerAccessModal) {
      closeOwnerAccessModal();
    }
  });
}

ownerTargetModalCloseButton.addEventListener("click", function () {
  closeOwnerTargetModal();
});

ownerTargetModalCloseIconButton.addEventListener("click", function () {
  closeOwnerTargetModal();
});

ownerTargetModal.addEventListener("click", function (event) {
  if (event.target === ownerTargetModal) {
    closeOwnerTargetModal();
  }
});

ownerTargetForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const saved = saveOwnerTargetsFromForm();
  if (saved) {
    closeOwnerTargetModal();
  }
});

if (ownerAccessForm) {
  ownerAccessForm.addEventListener("submit", function (event) {
    event.preventDefault();
    saveOwnerAccessManagerFromForm();
  });
}

ownerPeriodButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    ownerPeriodButtons.forEach(function (periodButton) {
      const isActive = periodButton === button;
      periodButton.classList.toggle("active", isActive);
      periodButton.setAttribute("aria-selected", String(isActive));
    });

    renderOwnerDashboard(button.dataset.period);
  });
});

ownerTargetPeriodButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    ownerTargetStatsPeriod = button.dataset.period || "day";
    renderOwnerTargetSummary();
  });
});

ownerTopPeriodButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    setOwnerTopFinancePeriod(button.dataset.period || "day");
  });
});

if (ownerReferenceDateInput) {
  ownerReferenceDateInput.addEventListener("change", function () {
    if (!ownerReferenceDateInput.value) {
      return;
    }

    setOwnerReferenceDate(dateFromWorkDateKey(ownerReferenceDateInput.value));
  });
}

if (ownerPrevDayButton) {
  ownerPrevDayButton.addEventListener("click", function () {
    const nextDate = new Date(ownerReferenceDate);
    nextDate.setDate(nextDate.getDate() - 1);
    setOwnerReferenceDate(nextDate);
  });
}

if (ownerNextDayButton) {
  ownerNextDayButton.addEventListener("click", function () {
    const nextDate = new Date(ownerReferenceDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setOwnerReferenceDate(nextDate);
  });
}

if (ownerExportDataButton) {
  ownerExportDataButton.addEventListener("click", function () {
    exportOwnerDataBackup();
  });
}

if (ownerImportDataButton && ownerImportFileInput) {
  ownerImportDataButton.addEventListener("click", function () {
    ownerImportFileInput.click();
  });

  ownerImportFileInput.addEventListener("change", function () {
    const file = ownerImportFileInput.files?.[0];
    importOwnerDataBackup(file);
    ownerImportFileInput.value = "";
  });
}

ownerLogoutButton.addEventListener("click", function () {
  if (window.SalonStorage) {
    window.SalonStorage.clearUser();
  }
});

window.addEventListener("salon-storage-saved", function () {
  if (window.SalonStorage) {
    const latest = window.SalonStorage.loadData();
    if (latest && typeof latest === "object") {
      Object.assign(ownerSharedData, latest);

      ownerEmployees.splice(0, ownerEmployees.length, ...(Array.isArray(latest.employees) ? latest.employees : []));

      Object.keys(ownerEmployeeData).forEach(function (key) {
        delete ownerEmployeeData[key];
      });
      Object.assign(ownerEmployeeData, latest.employeeData && typeof latest.employeeData === "object" ? latest.employeeData : {});

      ownerSharedData.ownerCampaignTarget = latest.ownerCampaignTarget || {};
      syncOwnerCampaignTargetState();
    }
  }

  renderOwnerDashboard(ownerActivePeriod);
  renderOwnerTopFinanceStrip();
  renderOwnerLastSavedIndicator();
});

window.addEventListener("storage", function (event) {
  const dataKey = window.SalonStorage?.DATA_KEY || "salonManagerData";
  if (event.key !== dataKey) {
    return;
  }

  if (window.SalonStorage) {
    const latest = window.SalonStorage.loadData();
    if (latest && typeof latest === "object") {
      Object.assign(ownerSharedData, latest);

      ownerEmployees.splice(0, ownerEmployees.length, ...(Array.isArray(latest.employees) ? latest.employees : []));

      Object.keys(ownerEmployeeData).forEach(function (key) {
        delete ownerEmployeeData[key];
      });
      Object.assign(ownerEmployeeData, latest.employeeData && typeof latest.employeeData === "object" ? latest.employeeData : {});

      ownerSharedData.ownerCampaignTarget = latest.ownerCampaignTarget || {};
      syncOwnerCampaignTargetState();
    }
  }

  renderOwnerDashboard(ownerActivePeriod);
  renderOwnerTopFinanceStrip();
  renderOwnerLastSavedIndicator();
});

window.addEventListener("owner:operations-updated", function (event) {
  const detail = event?.detail || {};
  ownerOperationsSnapshot = {
    services: detail.services || ownerOperationsSnapshot.services,
    products: detail.products || ownerOperationsSnapshot.products,
    tasksRate: detail.tasksRate || ownerOperationsSnapshot.tasksRate,
    hours: detail.hours || ownerOperationsSnapshot.hours,
    consumed: detail.consumed || ownerOperationsSnapshot.consumed,
    ruptureCount: Number.isFinite(Number(detail.ruptureCount))
      ? Number(detail.ruptureCount)
      : ownerOperationsSnapshot.ruptureCount
  };

  updateOwnerFocusPanel(ownerActiveCompactView);
});

window.addEventListener("owner:finance-updated", function (event) {
  const detail = event?.detail || {};
  ownerFinanceSnapshot = {
    revenue: detail.revenue || ownerFinanceSnapshot.revenue,
    expenses: detail.expenses || ownerFinanceSnapshot.expenses,
    profit: detail.profit || ownerFinanceSnapshot.profit,
    fixedTotal: detail.fixedTotal || ownerFinanceSnapshot.fixedTotal,
    variableTotal: detail.variableTotal || ownerFinanceSnapshot.variableTotal,
    payrollNetTotal: detail.payrollNetTotal || ownerFinanceSnapshot.payrollNetTotal
  };

  renderOwnerSummary(ownerActivePeriod);
  renderOwnerTopFinanceStrip();
  updateOwnerFocusPanel(ownerActiveCompactView);
});

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("pageshow", function () {
  window.scrollTo(0, 0);
  setTimeout(function () {
    window.scrollTo(0, 0);
  }, 80);
});

renderOwnerDashboard("day");
mountOwnerSectionsInPopup();
setOwnerCompactView("overview", { openPopup: false });
closeOwnerSectionsModal();
syncOwnerReferenceDateInput();
renderOwnerLastSavedIndicator();
window.scrollTo(0, 0);
