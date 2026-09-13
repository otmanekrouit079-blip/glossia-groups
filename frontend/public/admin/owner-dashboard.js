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
const ownerAddTaskForm = document.getElementById("owner-add-task-form");
const ownerNewTaskInput = document.getElementById("owner-new-task-input");
let ownerDetailEmployeeId = null;
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

const ownerTaxServiceList = document.getElementById("owner-tax-service-list");
const ownerTaxServiceThreshold = document.getElementById("owner-tax-service-threshold");
const ownerTaxServiceAmount = document.getElementById("owner-tax-service-amount");
const ownerTaxServiceAddButton = document.getElementById("owner-tax-service-add");
const ownerTaxProductList = document.getElementById("owner-tax-product-list");
const ownerTaxProductThreshold = document.getElementById("owner-tax-product-threshold");
const ownerTaxProductAmount = document.getElementById("owner-tax-product-amount");
const ownerTaxProductAddButton = document.getElementById("owner-tax-product-add");

const ownerBriefingModal = document.getElementById("owner-briefing-modal");
const ownerBriefingSubtitle = document.getElementById("owner-briefing-subtitle");
const ownerBriefingBody = document.getElementById("owner-briefing-body");
const ownerBriefingCloseButton = document.getElementById("owner-briefing-close");
const ownerBriefingCloseIconButton = document.getElementById("owner-briefing-close-icon");
const ownerTargetFeedback = document.getElementById("owner-target-feedback");
const ownerTargetStartDateInput = document.getElementById("owner-target-start-date");
const ownerTargetEndDateInput = document.getElementById("owner-target-end-date");
const ownerTargetDailyInput = document.getElementById("owner-target-daily");
const ownerTargetGlobalComputed = document.getElementById("owner-target-global-computed");
const ownerTargetGlobalDetail = document.getElementById("owner-target-global-detail");
const ownerLastSavedLabel = document.getElementById("owner-last-saved");
const ownerExportDataButton = document.getElementById("owner-export-data");
const ownerImportDataButton = document.getElementById("owner-import-data");
const ownerImportFileInput = document.getElementById("owner-import-file");
const ownerNetCaServicesBox = document.getElementById("owner-net-ca-services-box");
const ownerNetCaProductsBox = document.getElementById("owner-net-ca-products-box");
const ownerNetBreakdownModal = document.getElementById("owner-net-breakdown-modal");
const ownerNetBreakdownTitle = document.getElementById("owner-net-breakdown-title");
const ownerNetBreakdownSubtitle = document.getElementById("owner-net-breakdown-subtitle");
const ownerNetBreakdownList = document.getElementById("owner-net-breakdown-list");
const ownerNetBreakdownCloseButton = document.getElementById("owner-net-breakdown-close");
const ownerNetBreakdownCloseIconButton = document.getElementById("owner-net-breakdown-close-icon");
const ownerBackendAuthModal = document.getElementById("owner-backend-auth-modal");
const ownerBackendAuthCloseIconButton = document.getElementById("owner-backend-auth-close-icon");
const ownerBackendAuthCloseButton = document.getElementById("owner-backend-auth-close");
const ownerBackendAuthForm = document.getElementById("owner-backend-auth-form");
const ownerBackendAuthUsername = document.getElementById("owner-backend-auth-username");
const ownerBackendAuthPassword = document.getElementById("owner-backend-auth-password");
const ownerBackendAuthFeedback = document.getElementById("owner-backend-auth-feedback");

const ownerTasksModal = document.getElementById("owner-tasks-modal");
const ownerTasksCloseIconButton = document.getElementById("owner-tasks-close-icon");
const ownerTasksCloseButton = document.getElementById("owner-tasks-close");
const ownerTasksBroadcastForm = document.getElementById("owner-tasks-broadcast-form");
const ownerTasksBroadcastInput = document.getElementById("owner-tasks-broadcast-input");
const ownerTasksBroadcastFeedback = document.getElementById("owner-tasks-broadcast-feedback");
const ownerTasksTrackingList = document.getElementById("owner-tasks-tracking-list");

const ownerBookingsModal = document.getElementById("owner-bookings-modal");
const ownerBookingsCloseIconButton = document.getElementById("owner-bookings-close-icon");
const ownerBookingsCloseButton = document.getElementById("owner-bookings-close");
const ownerBookingsRefreshButton = document.getElementById("owner-bookings-refresh");
const ownerBookingsList = document.getElementById("owner-bookings-list");
const ownerBookingsFeedback = document.getElementById("owner-bookings-feedback");

const ownerStoreModal = document.getElementById("owner-store-modal");
const ownerStoreCloseIconButton = document.getElementById("owner-store-close-icon");
const ownerStoreCloseButton = document.getElementById("owner-store-close");
const ownerStoreTabButtons = document.querySelectorAll(".modal-tab-btn[data-store-tab]");

const ownerStoreAddStaffToggle = document.getElementById("owner-store-add-staff-toggle");
const ownerStoreStaffForm = document.getElementById("owner-store-staff-form");
const ownerStoreStaffId = document.getElementById("owner-store-staff-id");
const ownerStoreStaffName = document.getElementById("owner-store-staff-name");
const ownerStoreStaffPhoto = document.getElementById("owner-store-staff-photo");
const ownerStoreStaffPhotoPreview = document.getElementById("owner-store-staff-photo-preview");
const ownerStoreStaffActive = document.getElementById("owner-store-staff-active");
const ownerStoreStaffFeedback = document.getElementById("owner-store-staff-feedback");
const ownerStoreStaffCancel = document.getElementById("owner-store-staff-cancel");
const ownerStoreStaffList = document.getElementById("owner-store-staff-list");

const ownerStoreAddCouponToggle = document.getElementById("owner-store-add-coupon-toggle");
const ownerStoreCouponForm = document.getElementById("owner-store-coupon-form");
const ownerStoreCouponId = document.getElementById("owner-store-coupon-id");
const ownerStoreCouponCode = document.getElementById("owner-store-coupon-code");
const ownerStoreCouponType = document.getElementById("owner-store-coupon-type");
const ownerStoreCouponValue = document.getElementById("owner-store-coupon-value");
const ownerStoreCouponMaxUses = document.getElementById("owner-store-coupon-max-uses");
const ownerStoreCouponActive = document.getElementById("owner-store-coupon-active");
const ownerStoreCouponFeedback = document.getElementById("owner-store-coupon-feedback");
const ownerStoreCouponCancel = document.getElementById("owner-store-coupon-cancel");
const ownerStoreCouponsList = document.getElementById("owner-store-coupons-list");

const ownerStoreAddPackageToggle = document.getElementById("owner-store-add-package-toggle");
const ownerStorePackageForm = document.getElementById("owner-store-package-form");
const ownerStorePackageId = document.getElementById("owner-store-package-id");
const ownerStorePackageName = document.getElementById("owner-store-package-name");
const ownerStorePackageDesc = document.getElementById("owner-store-package-desc");
const ownerStorePackagePrice = document.getElementById("owner-store-package-price");
const ownerStorePackageServicesChecks = document.getElementById("owner-store-package-services-checks");
const ownerStorePackageProductsChecks = document.getElementById("owner-store-package-products-checks");
const ownerStorePackagePhoto = document.getElementById("owner-store-package-photo");
const ownerStorePackagePhotoPreview = document.getElementById("owner-store-package-photo-preview");
const ownerStorePackageFeedback = document.getElementById("owner-store-package-feedback");
const ownerStorePackageCancel = document.getElementById("owner-store-package-cancel");
const ownerStorePackagesList = document.getElementById("owner-store-packages-list");

const ownerStoreAddProductToggle = document.getElementById("owner-store-add-product-toggle");
const ownerStoreProductForm = document.getElementById("owner-store-product-form");
const ownerStoreProductId = document.getElementById("owner-store-product-id");
const ownerStoreProductName = document.getElementById("owner-store-product-name");
const ownerStoreProductShortDesc = document.getElementById("owner-store-product-short-desc");
const ownerStoreProductLongDesc = document.getElementById("owner-store-product-long-desc");
const ownerStoreProductCategory = document.getElementById("owner-store-product-category");
const ownerStoreProductPrice1 = document.getElementById("owner-store-product-price1");
const ownerStoreProductPrice2 = document.getElementById("owner-store-product-price2");
const ownerStoreProductPrice3 = document.getElementById("owner-store-product-price3");
const ownerStoreProductStock = document.getElementById("owner-store-product-stock");
const ownerStoreProductPhoto = document.getElementById("owner-store-product-photo");
const ownerStoreProductPhotoPreview = document.getElementById("owner-store-product-photo-preview");
const ownerStoreProductFeedback = document.getElementById("owner-store-product-feedback");
const ownerStoreProductCancel = document.getElementById("owner-store-product-cancel");
const ownerStoreProductsList = document.getElementById("owner-store-products-list");

const ownerStoreAddServiceToggle = document.getElementById("owner-store-add-service-toggle");
const ownerStoreServiceForm = document.getElementById("owner-store-service-form");
const ownerStoreServiceId = document.getElementById("owner-store-service-id");
const ownerStoreServiceName = document.getElementById("owner-store-service-name");
const ownerStoreServiceDesc = document.getElementById("owner-store-service-desc");
const ownerStoreServicePrice = document.getElementById("owner-store-service-price");
const ownerStoreServiceDuration = document.getElementById("owner-store-service-duration");
const ownerStoreServicePhoto = document.getElementById("owner-store-service-photo");
const ownerStoreServicePhotoPreview = document.getElementById("owner-store-service-photo-preview");
const ownerStoreServiceFeedback = document.getElementById("owner-store-service-feedback");
const ownerStoreServiceCancel = document.getElementById("owner-store-service-cancel");
const ownerStoreServicesList = document.getElementById("owner-store-services-list");

const ownerNetOverviewPeriodButtons = document.querySelectorAll(".owner-net-overview-period-btn");
const ownerNetOverviewChart = document.getElementById("owner-net-overview-chart");
const ownerNetCaTotal = document.getElementById("owner-net-ca-total");
const ownerNetCaServices = document.getElementById("owner-net-ca-services");
const ownerNetCaProducts = document.getElementById("owner-net-ca-products");
const ownerNetChargesFixed = document.getElementById("owner-net-charges-fixed");
const ownerNetChargesVariable = document.getElementById("owner-net-charges-variable");
const ownerNetCreditInput = document.getElementById("owner-net-credit-input");
const ownerCleanlinessTaxInput = document.getElementById("owner-cleanliness-tax-input");
const ownerNetBenefitServices = document.getElementById("owner-net-benefit-services");
const ownerNetBenefitProducts = document.getElementById("owner-net-benefit-products");
const ownerNetBenefitTotal = document.getElementById("owner-net-benefit-total");
const ownerNetBenefitGlossia = document.getElementById("owner-net-benefit-glossia");
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

let ownerNetOverviewPeriod = "day";
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
  consumed: "0 وحدة",
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
      title: "نظرة عامة",
      subtitle: "المؤشرات المهمة، الأهداف والمحاسبة فنظرة سريعة."
    };
  }

  if (viewName === "targets") {
    return {
      title: "الأهداف",
      subtitle: "تسيير الأهداف ومتابعة الضريبة ديال الفريق."
    };
  }

  if (viewName === "accounting") {
    return {
      title: "المحاسبة",
      subtitle: "متابعة المصاريف، المنتوجات، الأجور والربح الصافي."
    };
  }

  if (viewName === "operations") {
    return {
      title: "العمليات",
      subtitle: "التنقل بين العمليات والتحليلات المفصلة."
    };
  }

  if (viewName === "team") {
    return {
      title: "الفريق",
      subtitle: "نظرة على الموظفين والبطاقات المفصلة ديال الفريق."
    };
  }

  return {
    title: "عرض الكل",
    subtitle: "نظرة شاملة على الداشبورد ديال المالك."
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
      { id: 1, name: "Ahmed", post: "منصب 1" },
      { id: 2, name: "Youssef", post: "منصب 2" }
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
    roleLabel: "المالك",
    nameLabel: "الحساب الرئيسي",
    username: ownerEntry?.username || "owner1",
    password: ownerEntry?.password || "1234"
  }));

  ownerAccessBody.appendChild(createOwnerAccessRow({
    role: "manager",
    roleLabel: "الگيرانت",
    nameLabel: "حساب الگيرانت",
    username: managerEntry?.username || "gerant1",
    password: managerEntry?.password || "1234"
  }));

  ownerEmployees.forEach(function (employee) {
    const employeeEntry = findOwnerAuthEntry("employee", employee.id);
    ownerAccessBody.appendChild(createOwnerAccessRow({
      role: "employee",
      roleLabel: "الموظف",
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
      ownerAccessFeedback.textContent = "اسم المستخدم وكلمة السر خاصهم يكونو معمرين لجميع الحسابات.";
    }
    return false;
  }

  const duplicateUsername = usernames.some(function (username, index) {
    return usernames.indexOf(username) !== index;
  });

  if (duplicateUsername) {
    if (ownerAccessFeedback) {
      ownerAccessFeedback.textContent = "كل حساب خاصو يكون عندو اسم مستخدم وحيد.";
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
    ownerAccessFeedback.textContent = "الحسابات تبدلات بنجاح.";
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
    ownerProductsPopupList.innerHTML = '<tr><td colspan="6" class="employee-empty-cell">ماكاين حتى منتوج مزيد.</td></tr>';
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
      "<td><button type=\"button\" class=\"manager-btn manager-btn-muted\" data-product-index=\"" + index + "\">مسح</button></td>";

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
      ownerProductsPopupFeedback.textContent = "خاصك دخل سمية المنتوج.";
    }
    return;
  }

  if (preview.sellingPrice <= 0) {
    if (ownerProductsPopupFeedback) {
      ownerProductsPopupFeedback.textContent = "خاصك دخل تمن بيع صحيح (> 0).";
    }
    return;
  }

  if (preview.employeeProfit < 0) {
    if (ownerProductsPopupFeedback) {
      ownerProductsPopupFeedback.textContent = "البنفيس الشخصي خاصو يكون كبر ولا يساوي 0 DH.";
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
    ownerProductsPopupFeedback.textContent = "المنتوج تزاد بنجاح.";
  }

  if (ownerProductsPopupForm) {
    ownerProductsPopupForm.reset();
  }
  updateOwnerProductsPopupPreview();
  renderOwnerProductsPopupList();

  closeOwnerProductsPopupModal();
  openOwnerStoreProductFormPrefilled(name, preview.sellingPrice);
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
  ownerLastSavedLabel.textContent = "آخر حفظ: " + label;
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
      alert("الملف JSON ماشي صحيح.");
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
  const employeeCount = Math.max(1, ownerEmployees.length);
  const computedCampaignTarget = dailyTarget * campaignDays * employeeCount;

  return {
    startDateISO: startDateISO,
    endDateISO: endDateISO,
    dailyTarget: dailyTarget,
    weekTarget: dailyTarget * 7,
    monthTarget: dailyTarget * daysThisMonth,
    campaignTarget: computedCampaignTarget,
    globalTarget: computedCampaignTarget,
    monthDaysInCampaign: daysThisMonth,
    campaignDays: campaignDays,
    employeeCount: employeeCount
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
    ownerToggleAccessButton.textContent = "خبي الأمان";
    ownerToggleAccessButton.setAttribute("aria-expanded", "true");
  }
}

function closeOwnerAccessModal() {
  if (!ownerAccessModal) {
    return;
  }

  ownerAccessModal.classList.add("hidden");

  if (ownerToggleAccessButton) {
    ownerToggleAccessButton.textContent = "بيّن الأمان";
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
    return "ماكاين حتى بيع اليوم";
  }

  const topSeller = employeeHealth.find(function (entry) {
    return entry.employee.id === topSellerId;
  });

  if (!topSeller) {
    return "ماكاين حتى بيع اليوم";
  }

  return topSeller.employee.name + " · " + formatOwnerAmount(topSeller.today.salesTotal);
}

function updateOwnerFocusPanel(viewName) {
  if (!ownerFocusTitle || !ownerFocusSubtitle || !ownerFocusPills || !ownerFocusList) {
    return;
  }

  const summary = getFixedOwnerSummary();
  const needsHours = Math.max(0, summary.expectedToday - summary.completedToday);
  const targetSummaryText = ownerTargetSummary ? ownerTargetSummary.textContent : "ماكاين حتى هدف محدد.";
  const finance = ownerFinanceSnapshot;
  const operations = ownerOperationsSnapshot;

  if (viewName === "targets") {
    ownerFocusTitle.textContent = "الأهداف والضريبة";
    ownerFocusSubtitle.textContent = "تقدم الحملة وتأثير الضرائب فنظرة وحدة.";
    renderOwnerFocusPills([
      { label: "الهدف 12 سا", value: summary.completedToday + " / " + summary.expectedToday, className: needsHours === 0 ? "success" : "warning" },
      { label: "التاش لي باقيين", value: String(summary.pendingTasks), className: summary.pendingTasks === 0 ? "success" : "warning" },
      { label: "أحسن بائع", value: getOwnerTopSellerSummary() }
    ]);
    renderOwnerFocusChecklist([
      { label: "الحملة", value: targetSummaryText || "ماكاين حتى هدف محدد" },
      { label: "الأولوية", value: needsHours > 0 ? needsHours + " موظف(ين) خاصهم يكملو 12 سا" : "الهدف ديال الساعات تحقق" },
      { label: "خطر اليوم", value: summary.pendingTasks > 0 ? summary.pendingTasks + " تاش خاصهم يكملو" : "ماكاين تأخير فالتاش" }
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

    ownerFocusTitle.textContent = "المحاسبة الأساسية";
    ownerFocusSubtitle.textContent = "رقم المعاملات - (المصاريف الثابتة + المتغيرة + أجور الفريق) = الربح الصافي ديال Glossia.";
    renderOwnerFocusPills([
      { label: "رقم المعاملات", value: finance.revenue },
      { label: "المصاريف الكاملة", value: formatOwnerAmount(fullChargesValue) },
      { label: "الربح الصافي ديال Glossia", value: formatOwnerAmount(glossiaNetValue), className: glossiaNetValue < 0 ? "danger" : "success" }
    ]);
    renderOwnerFocusChecklist([
      { label: "المصاريف الثابتة", value: finance.fixedTotal },
      { label: "المصاريف المتغيرة", value: finance.variableTotal },
      { label: "أجور الفريق", value: finance.payrollNetTotal },
      { label: "المعادلة", value: formatOwnerAmount(revenueValue) + " - " + formatOwnerAmount(fullChargesValue) + " = " + formatOwnerAmount(glossiaNetValue) }
    ]);
    return;
  }

  if (viewName === "operations") {
    ownerFocusTitle.textContent = "تسيير العمليات";
    ownerFocusSubtitle.textContent = "متابعة المبيعات، التنفيذ والمخزون باش نتحركو بسرعة.";
    renderOwnerFocusPills([
      { label: "الخدمات", value: operations.services },
      { label: "المنتوجات", value: operations.products },
      { label: "نقص فالمخزون", value: String(operations.ruptureCount), className: operations.ruptureCount > 0 ? "warning" : "success" }
    ]);
    renderOwnerFocusChecklist([
      { label: "نسبة التاش", value: operations.tasksRate },
      { label: "احترام التوقيت", value: operations.hours },
      { label: "المنتوجات المستهلكة", value: operations.consumed }
    ]);
    return;
  }

  if (viewName === "team") {
    ownerFocusTitle.textContent = "أداء الفريق";
    ownerFocusSubtitle.textContent = "أهم الإشارات البشرية والتجارية.";
    renderOwnerFocusPills([
      { label: "عدد الموظفين", value: String(ownerEmployees.length) },
      { label: "الهدف 12 سا", value: summary.completedToday + " / " + summary.expectedToday, className: needsHours === 0 ? "success" : "warning" },
      { label: "أحسن بائع", value: getOwnerTopSellerSummary() }
    ]);
    renderOwnerFocusChecklist([
      { label: "التاش فالانتظار", value: String(summary.pendingTasks) },
      { label: "التاش لي كملات", value: summary.completedTasks + " / " + summary.totalTasks },
      { label: "النقطة الحرجة", value: needsHours > 0 ? needsHours + " موظف(ين) متأخرين على 12 سا" : "ماكاين تأخير فالتوقيت" }
    ]);
    return;
  }

  if (viewName === "all") {
    ownerFocusTitle.textContent = "نظرة شاملة للمدير";
    ownerFocusSubtitle.textContent = "البيزنس كامل مع الأولويات ديال التسيير الفوري.";
    renderOwnerFocusPills([
      { label: "رقم المعاملات ديال اليوم", value: formatOwnerAmount(summary.todaySales) },
      { label: "الربح الصافي", value: finance.profit, className: finance.profit.startsWith("-") ? "danger" : "success" },
      { label: "نقص فالمخزون", value: String(operations.ruptureCount), className: operations.ruptureCount > 0 ? "warning" : "success" }
    ]);
    renderOwnerFocusChecklist([
      { label: "الأهداف 12 سا", value: summary.completedToday + " / " + summary.expectedToday },
      { label: "التاش فالانتظار", value: String(summary.pendingTasks) },
      { label: "الحملة", value: targetSummaryText || "ماكاين حتى هدف محدد" }
    ]);
    return;
  }

  ownerFocusTitle.textContent = "التسيير الأساسي";
  ownerFocusSubtitle.textContent = "المؤشرات المهمة والإجراءات الفورية ديال النهار.";
  renderOwnerFocusPills([
    { label: "رقم المعاملات ديال اليوم", value: formatOwnerAmount(summary.todaySales) },
    { label: "رقم المعاملات ديال السيمانة", value: formatOwnerAmount(summary.weekSales) },
    { label: "الربح الصافي", value: finance.profit, className: finance.profit.startsWith("-") ? "danger" : "success" }
  ]);
  renderOwnerFocusChecklist([
    { label: "الأهداف 12 سا", value: summary.completedToday + " / " + summary.expectedToday },
    { label: "التاش فالانتظار", value: String(summary.pendingTasks) },
    { label: "أحسن بائع", value: getOwnerTopSellerSummary() }
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

function getOwnerServiceSalesTotalForPeriod(period) {
  return ownerEmployees.reduce(function (total, employee) {
    const state = getOwnerEmployeeState(employee.id);
    const serviceSales = (state.salesHistory || []).filter(function (sale) {
      return sale?.dateISO && isOwnerDateInPeriod(new Date(sale.dateISO), period);
    });

    return total + sumOwnerSales(serviceSales);
  }, 0);
}

function getOwnerProductSalesTotalForPeriod(period) {
  return (ownerSharedData.productSales || []).reduce(function (total, sale) {
    if (!sale?.dateISO || !isOwnerDateInPeriod(new Date(sale.dateISO), period)) {
      return total;
    }

    return total + Number(sale.amount || 0);
  }, 0);
}

function getOwnerNetOverviewPeriodFactor(period) {
  const now = new Date();
  const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  if (period === "day") {
    return 1 / daysInCurrentMonth;
  }

  if (period === "week") {
    return 7 / daysInCurrentMonth;
  }

  if (period === "quarter") {
    return 3;
  }

  if (period === "year") {
    return 12;
  }

  return 1;
}

function getOwnerCleanlinessTaxAmount() {
  const value = Number(ownerSharedData.ownerCleanlinessTax || 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function setOwnerCleanlinessTaxAmount(value) {
  const safeValue = Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : 0;
  ownerSharedData.ownerCleanlinessTax = safeValue;
  saveOwnerProductsData();
}

function getOwnerFixedCostsTotalForPeriod(period) {
  const factor = getOwnerNetOverviewPeriodFactor(period);
  const manualFixedTotal = (ownerSharedData.fixedCosts || []).reduce(function (total, cost) {
    return total + Number(cost.monthlyAmount || 0);
  }, 0) * factor;

  const cleanlinessTotal = getOwnerCleanlinessTaxAmount() * getOwnerTargetPeriodDays(period);

  return manualFixedTotal + cleanlinessTotal;
}

function getOwnerVariableCostsTotalForPeriod(period) {
  const factor = getOwnerNetOverviewPeriodFactor(period);
  return (ownerSharedData.variableCosts || []).reduce(function (total, cost) {
    return total + Number(cost.monthlyAmount || 0);
  }, 0) * factor;
}

function getOwnerCreditAmount() {
  const value = Number(ownerSharedData.ownerCredit || 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function setOwnerCreditAmount(value) {
  const safeValue = Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : 0;
  ownerSharedData.ownerCredit = safeValue;
  saveOwnerProductsData();
}

function setOwnerNetOverviewPeriod(period) {
  ownerNetOverviewPeriod = period || "day";
  ownerNetOverviewPeriodButtons.forEach(function (button) {
    button.classList.toggle("active", button.dataset.period === ownerNetOverviewPeriod);
  });
  renderOwnerNetOverview();
}

function renderOwnerNetOverviewChart(caTotal, chargesTotal, benefitGlossia) {
  if (!ownerNetOverviewChart) {
    return;
  }

  const maxValue = Math.max(caTotal, chargesTotal, Math.abs(benefitGlossia), 1);

  function buildBarRow(label, value, className) {
    const row = document.createElement("div");
    row.className = "owner-net-bar-row";

    const labelEl = document.createElement("span");
    labelEl.className = "owner-net-bar-label";
    labelEl.textContent = label;

    const track = document.createElement("div");
    track.className = "owner-net-bar-track";

    const fill = document.createElement("span");
    fill.className = "owner-net-bar-fill" + (className ? " " + className : "");
    const percentage = maxValue > 0 ? Math.min(100, (Math.abs(value) / maxValue) * 100) : 0;
    fill.style.width = percentage + "%";
    track.appendChild(fill);

    const amount = document.createElement("strong");
    amount.className = "owner-net-bar-amount";
    amount.textContent = formatOwnerAmount(value);

    row.appendChild(labelEl);
    row.appendChild(track);
    row.appendChild(amount);
    return row;
  }

  ownerNetOverviewChart.innerHTML = "";
  ownerNetOverviewChart.appendChild(buildBarRow("رقم المعاملات", caTotal, ""));
  ownerNetOverviewChart.appendChild(buildBarRow("المصاريف", chargesTotal, "charges"));
  ownerNetOverviewChart.appendChild(buildBarRow("البنفيس الصافي", benefitGlossia, "benefit" + (benefitGlossia < 0 ? " negative" : "")));
}

function getOwnerServiceSalesByEmployeeForPeriod(period) {
  return ownerEmployees.map(function (employee) {
    const state = getOwnerEmployeeState(employee.id);
    const serviceSales = (state.salesHistory || []).filter(function (sale) {
      return sale?.dateISO && isOwnerDateInPeriod(new Date(sale.dateISO), period);
    });

    return {
      employee: employee,
      amount: sumOwnerSales(serviceSales)
    };
  });
}

function getOwnerProductSalesByEmployeeForPeriod(period) {
  return ownerEmployees.map(function (employee) {
    const productSales = getOwnerEmployeeProductSales(employee.id).filter(function (sale) {
      return sale?.dateISO && isOwnerDateInPeriod(new Date(sale.dateISO), period);
    });

    return {
      employee: employee,
      amount: productSales.reduce(function (total, sale) {
        return total + Number(sale.amount || 0);
      }, 0)
    };
  });
}

function openOwnerNetBreakdownModal(kind) {
  if (!ownerNetBreakdownModal) {
    return;
  }

  const period = ownerNetOverviewPeriod;
  const isServices = kind === "services";
  const entries = (isServices
    ? getOwnerServiceSalesByEmployeeForPeriod(period)
    : getOwnerProductSalesByEmployeeForPeriod(period))
    .slice()
    .sort(function (first, second) { return second.amount - first.amount; });

  const topAmount = entries.length ? entries[0].amount : 0;

  ownerNetBreakdownTitle.textContent = isServices
    ? "توزيع رقم معاملات الخدمات"
    : "توزيع رقم معاملات المنتوجات";
  ownerNetBreakdownSubtitle.textContent = "حسب الموظف · " + getOwnerPeriodLabels(period).badge;

  ownerNetBreakdownList.innerHTML = "";

  if (entries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "ماكاين حتى موظف مسجل.";
    ownerNetBreakdownList.appendChild(empty);
  } else {
    entries.forEach(function (entry) {
      const item = document.createElement("li");

      const nameWrap = document.createElement("span");
      nameWrap.textContent = entry.employee.name;

      if (topAmount > 0 && entry.amount === topAmount) {
        const badge = document.createElement("span");
        badge.className = "owner-best-employee-badge";
        badge.textContent = "أحسن بائع";
        nameWrap.appendChild(document.createTextNode(" "));
        nameWrap.appendChild(badge);
      }

      const amount = document.createElement("strong");
      amount.textContent = formatOwnerAmount(entry.amount);

      item.appendChild(nameWrap);
      item.appendChild(amount);
      ownerNetBreakdownList.appendChild(item);
    });
  }

  ownerNetBreakdownModal.classList.remove("hidden");
}

function closeOwnerNetBreakdownModal() {
  if (ownerNetBreakdownModal) {
    ownerNetBreakdownModal.classList.add("hidden");
  }
}

function renderOwnerNetOverview() {
  if (!ownerNetCaTotal) {
    return;
  }

  const period = ownerNetOverviewPeriod;

  const caServices = getOwnerServiceSalesTotalForPeriod(period);
  const caProducts = getOwnerProductSalesTotalForPeriod(period);
  const caTotal = caServices + caProducts;

  const chargesFixed = getOwnerFixedCostsTotalForPeriod(period);
  const chargesVariable = getOwnerVariableCostsTotalForPeriod(period);
  const credit = getOwnerCreditAmount();

  const benefitServices = getOwnerServiceBenefitForPeriod(period);
  const benefitProducts = getOwnerGlossiaProductNetForPeriod(period);
  const benefitTotal = benefitServices + benefitProducts;

  const benefitGlossia = benefitTotal - chargesFixed - chargesVariable - credit;

  ownerNetCaTotal.textContent = formatOwnerAmount(caTotal);
  ownerNetCaServices.textContent = formatOwnerAmount(caServices);
  ownerNetCaProducts.textContent = formatOwnerAmount(caProducts);

  ownerNetChargesFixed.textContent = formatOwnerAmount(chargesFixed);
  ownerNetChargesVariable.textContent = formatOwnerAmount(chargesVariable);

  if (ownerNetCreditInput && document.activeElement !== ownerNetCreditInput) {
    ownerNetCreditInput.value = credit > 0 ? credit : "";
  }

  ownerNetBenefitServices.textContent = formatOwnerAmount(benefitServices);
  ownerNetBenefitProducts.textContent = formatOwnerAmount(benefitProducts);
  ownerNetBenefitTotal.textContent = formatOwnerAmount(benefitTotal);

  ownerNetBenefitGlossia.textContent = formatOwnerAmount(benefitGlossia);
  ownerNetBenefitGlossia.classList.toggle("profit-positive", benefitGlossia >= 0);
  ownerNetBenefitGlossia.classList.toggle("profit-negative", benefitGlossia < 0);

  renderOwnerNetOverviewChart(caTotal, chargesFixed + chargesVariable + credit, benefitGlossia);
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
    '<strong>اتجاه الربح الشامل</strong>' +
    '<span>آخر نقطة: ' + formatOwnerAmount(lastValue) + ' (' + deltaSign + formatOwnerAmount(delta) + ')</span>' +
    '</div>' +
    '<svg class="owner-top-finance-trend-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="المنحنى ديال الربح الشامل ديال Glossia">' +
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
    day: "الهدف ديال اليوم",
    week: "الهدف ديال السيمانة",
    month: "الهدف ديال الشهر"
  };

  if (!targets) {
    return {
      className: "danger",
      label: labelMap[period] || "الهدف",
      value: "ماشي محدد"
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
      label: labelMap[period] || "الهدف",
      value: "ماشي محدد"
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
    label: labelMap[period] || "الهدف",
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

  const chargesDetail = "ثابتة " + finance.fixedTotal + " · متغيرة " + finance.variableTotal + " · أجور " + finance.payrollNetTotal;
  ownerSummaryGrid.innerHTML = "";

  const cards = [
    createOwnerSummaryCard(
      getOwnerSummaryIcon("team"),
      "الموظفين",
      String(ownerEmployees.length),
      "مجموع الفريق",
      "",
      "",
      { scrollTargetId: "owner-employees-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("sun"),
      "مبيعات اليوم",
      formatOwnerAmount(summary.todaySales),
      "مجموع الفريق",
      "",
      "day",
      { view: "services", range: "day", scrollTargetId: "owner-bi-details-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("trend"),
      "مبيعات السيمانة",
      formatOwnerAmount(summary.weekSales),
      "من نهار الإتنين",
      "",
      "week",
      { view: "services", range: "week", scrollTargetId: "owner-bi-details-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("calendar"),
      "مبيعات الشهر",
      formatOwnerAmount(summary.monthSales),
      "الشهر الجاري",
      "",
      "month",
      { view: "services", range: "month", scrollTargetId: "owner-bi-details-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("money"),
      "رقم المعاملات",
      formatOwnerAmount(periodRevenue),
      "المدة المختارة",
      "",
      activePeriod,
      { scrollTargetId: "owner-accounting-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("receipt"),
      "مجموع المصاريف",
      finance.expenses,
      chargesDetail,
      "warning",
      "",
      { scrollTargetId: "owner-accounting-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("trend"),
      "الربح الصافي",
      finance.profit,
      "رقم المعاملات - المصاريف",
      String(finance.profit || "").trim().startsWith("-") ? "danger" : "success",
      "",
      { scrollTargetId: "owner-accounting-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("clock"),
      "الهدف 12 سا اليوم",
      summary.completedToday + " / " + summary.expectedToday,
      summary.missingToday + " باقي يكملو",
      summary.missingToday === 0 ? "success" : "warning",
      "",
      { view: "hours", range: "day", scrollTargetId: "owner-bi-details-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("check"),
      "التاش فالانتظار",
      String(summary.pendingTasks),
      "جميع الفرق",
      summary.pendingTasks === 0 ? "success" : "warning",
      "",
      { view: "tasks", range: "day", scrollTargetId: "owner-bi-details-title" }
    ),
    createOwnerSummaryCard(
      getOwnerSummaryIcon("list"),
      "التاش لي كملات اليوم",
      summary.completedTasks + " / " + summary.totalTasks,
      "المجموع المسند للفريق",
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
      badge: "اليوم",
      presence: "التسجيل ديال اليوم",
      sales: "مبيعات اليوم"
    };
  }

  if (period === "week") {
    return {
      badge: "هاد السيمانة",
      presence: "الأيام المسجلة",
      sales: "مبيعات السيمانة"
    };
  }

  return {
    badge: "هاد الشهر",
    presence: "الأيام المسجلة",
    sales: "مبيعات الشهر"
  };
}

function getOwnerStatusText(metrics) {
  const hasRestDay = metrics.scheduleEntries.some(function (entry) {
    return entry.schedule.restDay;
  });

  if (metrics.scheduleEntries.length === 1 && hasRestDay) {
    return { text: "راحة", className: "pending" };
  }

  if (metrics.scheduleEntries.length === 0) {
    return { text: "ماكاين تسجيل", className: "pending" };
  }

  if (!metrics.complete) {
    return {
      text: "ناقص · باقي " + formatOwnerMinutes(metrics.missingMinutes),
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
    text: "باقي " + formatOwnerMinutes(metrics.missingMinutes),
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
    return metrics.scheduleEntries.length + " نهار";
  }

  const todayEntry = metrics.scheduleEntries[0];
  if (!todayEntry) {
    return "ماتسجلش";
  }

  if (todayEntry.schedule.restDay) {
    return "راحة";
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
    cell.textContent = "ماكاين حتى موظف مسجل.";
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
    appendOwnerCell(row, completedTasks + " / " + tasks.length + " كملات");
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
  heading.textContent = hasIssues ? "التنبيهات ديال اليوم" : "كلشي مزيان اليوم";
  ownerAlertBanner.appendChild(heading);

  if (!hasIssues) {
    return;
  }

  const list = document.createElement("ul");

  if (missingHours.length > 0) {
    const item = document.createElement("li");
    item.textContent =
      missingHours.length +
      " موظف(ين) مازال ماكملوش الـ 12 سا";
    list.appendChild(item);
  }

  if (totalIncompleteTasks > 0) {
    const item = document.createElement("li");
    const breakdown = employeesWithTasks.map(function (health) {
      return health.employee.name + ": " + health.incompleteTasks;
    }).join(", ");

    item.textContent =
      totalIncompleteTasks + " تاش ماكملاتش" +
      " (" + breakdown + ")";
    list.appendChild(item);
  }

  ownerAlertBanner.appendChild(list);
}

function getOwnerStampText(stamp) {
  return stamp?.dateTime || stamp?.time || "ماتسجلش";
}

function getOwnerDetailedStatus(calculation) {
  if (calculation?.restDay) {
    return {
      text: "نهار الراحة",
      className: "pending"
    };
  }

  if (!calculation) {
    return {
      text: "باقي 12 سا 00د · التسجيل ناقص",
      className: "warning"
    };
  }

  if (calculation.meetsTarget) {
    return {
      text: formatOwnerMinutesWithWords(calculation.workedMinutes) + " مخدومة",
      className: "success"
    };
  }

  return {
    text: "باقي " + formatOwnerMinutesWithWords(calculation.missingMinutes),
    className: "warning"
  };
}

function getOwnerCompactStatus(health) {
  if (health.today?.calculation?.restDay) {
    return {
      text: "راحة",
      className: "pending"
    };
  }

  if (health.meetsHours) {
    return {
      text: "الهدف 12سا00",
      className: "success"
    };
  }

  const missing = health.missingMinutes || ownerRequiredDailyMinutes;
  return {
    text: "باقي " + formatOwnerMinutesWithWords(missing),
    className: "warning"
  };
}

function getOwnerPeriodBadge(period) {
  if (period === "day") {
    return "نهار";
  }

  if (period === "week") {
    return "سيمانة";
  }

  return "شهر";
}

function createOwnerTargetProgressBlock(activeSales, activeTarget, targetProgress, period) {
  const block = document.createElement("div");
  block.className = "owner-target-progress";

  if (!targetProgress || activeTarget == null) {
    const empty = document.createElement("p");
    empty.className = "owner-target-empty";
    empty.textContent = "ماكاين حتى هدف محدد";
    block.appendChild(empty);
    return block;
  }

  const top = document.createElement("div");
  top.className = "owner-target-progress-top";

  const label = document.createElement("span");
  label.textContent = "الهدف " + getOwnerPeriodBadge(period);

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
    status.textContent = "0 نهار فمدة الحملة";
    status.className = "owner-target-progress-status warning";
  } else {
    status.textContent =
      Math.round(targetProgress.percentage) + "% تحقق · باقي " + formatOwnerEuro(targetProgress.remaining);
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
    bestBadge.textContent = "أحسن بائع";
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
  tasksBadge.textContent = health.completedTasks + "/" + health.totalTasks + " تاش";

  badges.appendChild(statusBadge);
  badges.appendChild(tasksBadge);

  const footer = document.createElement("p");
  footer.className = "owner-compact-footer";
  footer.textContent = "اليوم: " + formatOwnerAmount(health.today.salesTotal);

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
  ownerModalTaskCount.textContent = completedTasks + "/" + tasks.length + " تاش كملات";
  ownerModalTaskList.innerHTML = "";

  if (tasks.length === 0) {
    const item = document.createElement("li");
    item.className = "empty";
    item.textContent = "ماكاين حتى تاش مسندة.";
    ownerModalTaskList.appendChild(item);
  } else {
    tasks.forEach(function (task, index) {
      const item = document.createElement("li");
      item.className = "task-item" + (task.done ? " is-done" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Boolean(task.done);
      checkbox.dataset.taskIndex = String(index);

      const text = document.createElement("span");
      text.textContent = task.text;

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "owner-task-remove";
      removeButton.dataset.taskIndex = String(index);
      removeButton.setAttribute("aria-label", "مسح التاش");
      removeButton.textContent = "✕";

      item.appendChild(checkbox);
      item.appendChild(text);

      if (task.status === "excuse") {
        const badge = document.createElement("span");
        badge.className = "task-status-badge task-status-excuse";
        badge.textContent = "معذور";
        item.appendChild(badge);
      }

      item.appendChild(removeButton);
      ownerModalTaskList.appendChild(item);

      if (task.status === "excuse") {
        const reason = document.createElement("p");
        reason.className = "task-excuse-reason";
        reason.textContent = task.excuseReason
          ? "المبرر: " + task.excuseReason
          : "فالانتظار ديال المبرر ديال الموظف.";
        ownerModalTaskList.appendChild(reason);
      }
    });
  }
}

function refreshOwnerDetailTasks() {
  if (ownerDetailEmployeeId == null) {
    return;
  }

  const state = getOwnerEmployeeState(ownerDetailEmployeeId);
  fillOwnerTaskChecklist(state.tasks || []);
  saveOwnerProductsData();
  renderOwnerDashboard(ownerActivePeriod);
}

if (ownerModalTaskList) {
  ownerModalTaskList.addEventListener("change", function (event) {
    const target = event.target;
    if (target.tagName !== "INPUT" || target.type !== "checkbox") {
      return;
    }

    const taskIndex = Number(target.dataset.taskIndex);
    const state = getOwnerEmployeeState(ownerDetailEmployeeId);
    const task = state.tasks?.[taskIndex];
    if (!task) {
      return;
    }

    task.done = target.checked;
    task.completedAtISO = target.checked ? new Date().toISOString() : null;
    refreshOwnerDetailTasks();
  });

  ownerModalTaskList.addEventListener("click", function (event) {
    const button = event.target.closest(".owner-task-remove");
    if (!button) {
      return;
    }

    const taskIndex = Number(button.dataset.taskIndex);
    const state = getOwnerEmployeeState(ownerDetailEmployeeId);
    if (!Number.isInteger(taskIndex) || !state.tasks?.[taskIndex]) {
      return;
    }

    state.tasks.splice(taskIndex, 1);
    refreshOwnerDetailTasks();
  });
}

if (ownerAddTaskForm) {
  ownerAddTaskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = ownerNewTaskInput.value.trim();
    if (!taskText) {
      return;
    }

    const state = getOwnerEmployeeState(ownerDetailEmployeeId);
    state.tasks = state.tasks || [];
    state.tasks.push({
      text: taskText,
      done: false,
      completedAtISO: null
    });

    ownerNewTaskInput.value = "";
    refreshOwnerDetailTasks();
  });
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
    return "نهار";
  }

  if (period === "week") {
    return "سيمانة";
  }

  if (period === "month") {
    return "شهر";
  }

  if (period === "quarter") {
    return "الثلاثي";
  }

  return "العام";
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
    ownerTargetSummary.textContent = "ماكاين حتى هدف محدد ل " + selectedLabel + ".";
    renderOwnerTargetIndicators([
      { label: "لي تحقق " + selectedLabel, value: "0,00 DH" },
      { label: "الهدف " + selectedLabel, value: "0,00 DH" },
      { label: "النسبة " + selectedLabel, value: "0.0%", className: "danger" },
      { label: "الباقي " + selectedLabel, value: "0,00 DH" },
      {
        label: "Glossia الشامل (الحملة)",
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
      label: "لي تحقق " + selectedLabel,
      value: formatOwnerEuro(achieved)
    },
    {
      label: "الهدف " + selectedLabel,
      value: formatOwnerEuro(target)
    },
    {
      label: "النسبة " + selectedLabel,
      value: formatOwnerPercent(progress.percentage),
      className: progress.className
    },
    {
      label: "الباقي " + selectedLabel,
      value: formatOwnerEuro(remaining),
      className: remaining === 0 ? "success" : ""
    },
    {
      label: "Glossia الشامل (الحملة)",
      value: formatOwnerEuro(globalAchieved) + " / " + formatOwnerEuro(targets.globalTarget),
      className: globalClassName
    }
  ]);

  ownerTargetSummary.textContent =
    "الهدف " + selectedLabel + ": " + formatOwnerEuro(achieved) + " / " + formatOwnerEuro(target) +
    " (" + formatOwnerPercent(progress.percentage) + ") · الباقي: " + formatOwnerEuro(remaining) + ".";
}

function updateOwnerTargetComputedPreview() {
  if (!ownerTargetGlobalComputed) {
    return;
  }

  const startDate = ownerTargetStartDateInput.value;
  const endDate = ownerTargetEndDateInput.value;
  const dailyTarget = Number(ownerTargetDailyInput.value);
  const employeeCount = Math.max(1, ownerEmployees.length);

  if (!startDate || !endDate || !Number.isFinite(dailyTarget) || dailyTarget <= 0 ||
    ownerDateFromISO(endDate) < ownerDateFromISO(startDate)) {
    ownerTargetGlobalComputed.textContent = "0,00 DH";
    if (ownerTargetGlobalDetail) {
      ownerTargetGlobalDetail.textContent = "عمر تاريخ البداية والنهاية والهدف اليومي باش يتحسب.";
    }
    return;
  }

  const campaignDays = getDayCountBetweenInclusive(startDate, endDate);
  const globalTarget = dailyTarget * campaignDays * employeeCount;

  ownerTargetGlobalComputed.textContent = formatOwnerAmount(globalTarget);
  if (ownerTargetGlobalDetail) {
    ownerTargetGlobalDetail.textContent =
      formatOwnerAmount(dailyTarget) + " × " + employeeCount + " موظف × " + campaignDays + " نهار";
  }
}

function renderOwnerTargetForm() {
  syncOwnerCampaignTargetState();
  ownerTargetStartDateInput.value = ownerCampaignTarget?.startDate || "";
  ownerTargetEndDateInput.value = ownerCampaignTarget?.endDate || "";
  ownerTargetDailyInput.value = ownerCampaignTarget?.dailyTarget
    ? String(ownerCampaignTarget.dailyTarget)
    : "";

  if (ownerCleanlinessTaxInput) {
    const cleanlinessTax = getOwnerCleanlinessTaxAmount();
    ownerCleanlinessTaxInput.value = cleanlinessTax > 0 ? cleanlinessTax : "";
  }

  updateOwnerTargetComputedPreview();
}

[ownerTargetStartDateInput, ownerTargetEndDateInput, ownerTargetDailyInput].forEach(function (input) {
  if (input) {
    input.addEventListener("input", updateOwnerTargetComputedPreview);
  }
});

function openOwnerTargetModal() {
  ownerTargetFeedback.textContent = "";
  ownerTargetFeedback.classList.remove("is-error");
  renderOwnerTargetForm();
  renderOwnerTaxBrackets();

  if (ownerTargetModalTitle) {
    ownerTargetModalTitle.textContent = "الأهداف الشخصية والعامة";
  }

  if (ownerTargetModalSubtitle) {
    ownerTargetModalSubtitle.textContent = "دخل الهدف اليومي ديال كل موظف، والهدف الشامل ديال Glossia غادي يتحسب أوتوماتيك.";
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

  if (!startDate || !endDate) {
    ownerTargetFeedback.textContent = "خاصك دخل تاريخ البداية وتاريخ النهاية.";
    ownerTargetFeedback.classList.add("is-error");
    return false;
  }

  if (!Number.isFinite(dailyTarget) || dailyTarget <= 0) {
    ownerTargetFeedback.textContent = "خاصك دخل هدف يومي صحيح (> 0).";
    ownerTargetFeedback.classList.add("is-error");
    return false;
  }

  if (ownerDateFromISO(endDate) < ownerDateFromISO(startDate)) {
    ownerTargetFeedback.textContent = "تاريخ النهاية خاصو يكون بعد ولا نفس تاريخ البداية.";
    ownerTargetFeedback.classList.add("is-error");
    return false;
  }

  ownerCampaignTarget.startDate = startDate;
  ownerCampaignTarget.endDate = endDate;
  ownerCampaignTarget.dailyTarget = Math.round(dailyTarget * 100) / 100;
  delete ownerCampaignTarget.globalTarget;

  saveOwnerTargetSettingsToSession();
  ownerTargetFeedback.textContent = "تسجلات الأهداف.";
  ownerTargetFeedback.classList.remove("is-error");
  renderOwnerDashboard(ownerActivePeriod);
  return true;
}

function openOwnerDetailModal(employeeHealth, period) {
  const employee = employeeHealth.employee;
  const state = employeeHealth.state;
  ownerDetailEmployeeId = employee.id;
  const today = employeeHealth.today;
  const todayStatus = getOwnerDetailedStatus(today.calculation);
  const periodMetrics = getOwnerEmployeePeriodMetrics(employee, period);
  const periodStatus = getOwnerStatusText(periodMetrics);
  const weekSales = sumOwnerSales(getOwnerSalesForPeriod(state, "week", employee.id));
  const monthSales = sumOwnerSales(getOwnerSalesForPeriod(state, "month", employee.id));

  ownerModalTitle.textContent = "التفاصيل · " + employee.name;
  ownerModalSubtitle.textContent = employee.post;

  ownerModalTimeGrid.innerHTML = "";
  ownerModalTimeGrid.appendChild(createOwnerDetailItem("الوصول", getOwnerStampText(today.schedule.arrival)));
  ownerModalTimeGrid.appendChild(createOwnerDetailItem("وقفة الغدا", getOwnerStampText(today.schedule.lunch)));
  ownerModalTimeGrid.appendChild(createOwnerDetailItem("الرجوع", getOwnerStampText(today.schedule.returnTime)));
  ownerModalTimeGrid.appendChild(createOwnerDetailItem("الخروج", getOwnerStampText(today.schedule.departure)));
  ownerModalTimeGrid.appendChild(createOwnerDetailItem("الساعات المخدومة", todayStatus.text, todayStatus.className));

  ownerModalSalesGrid.innerHTML = "";
  ownerModalSalesGrid.appendChild(createOwnerDetailItem("المبيعات ديال اليوم", formatOwnerAmount(today.salesTotal)));
  ownerModalSalesGrid.appendChild(createOwnerDetailItem("المبيعات ديال هاد السيمانة", formatOwnerAmount(weekSales)));
  ownerModalSalesGrid.appendChild(createOwnerDetailItem("المبيعات ديال هاد الشهر", formatOwnerAmount(monthSales)));
  ownerModalSalesGrid.appendChild(
    createOwnerDetailItem(
      "المدة المختارة · " + getOwnerPeriodLabels(period).badge,
      formatOwnerMinutes(periodMetrics.workedMinutes) + " · " + periodStatus.text,
      periodStatus.className
    )
  );

  ownerModalTargetGrid.innerHTML = "";
  if (!employeeHealth.campaignTargets) {
    ownerModalTargetGrid.appendChild(
      createOwnerDetailItem("الهدف", "ماكاين حتى هدف محدد", "warning")
    );
  } else {
    const dayProgress = getOwnerTargetProgress(employeeHealth.daySales, employeeHealth.campaignTargets.dailyTarget);
    const weekProgress = getOwnerTargetProgress(employeeHealth.weekSales, employeeHealth.campaignTargets.weekTarget);
    const monthProgress = getOwnerTargetProgress(employeeHealth.monthSales, employeeHealth.campaignTargets.monthTarget);
    const campaignProgress = getOwnerTargetProgress(employeeHealth.campaignSales, employeeHealth.campaignTargets.campaignTarget);

    ownerModalTargetGrid.appendChild(
      createOwnerDetailItem(
        "الهدف ديال اليوم",
        formatOwnerEuro(employeeHealth.daySales) + " / " + formatOwnerEuro(employeeHealth.campaignTargets.dailyTarget) +
        " (" + Math.round(dayProgress.percentage) + "%)",
        dayProgress.className
      )
    );
    ownerModalTargetGrid.appendChild(
      createOwnerDetailItem(
        "الهدف ديال السيمانة",
        formatOwnerEuro(employeeHealth.weekSales) + " / " + formatOwnerEuro(employeeHealth.campaignTargets.weekTarget) +
        " (" + Math.round(weekProgress.percentage) + "%)",
        weekProgress.className
      )
    );
    ownerModalTargetGrid.appendChild(
      createOwnerDetailItem(
        "الهدف ديال الشهر",
        formatOwnerEuro(employeeHealth.monthSales) + " / " + formatOwnerEuro(employeeHealth.campaignTargets.monthTarget) +
        " (" + Math.round(monthProgress.percentage) + "%)",
        monthProgress.className
      )
    );
    ownerModalTargetGrid.appendChild(
      createOwnerDetailItem(
        "الهدف ديال الحملة",
        formatOwnerEuro(employeeHealth.campaignSales) + " / " + formatOwnerEuro(employeeHealth.campaignTargets.campaignTarget) +
        " (" + Math.round(campaignProgress.percentage) + "%)",
        campaignProgress.className
      )
    );
    ownerModalTargetGrid.appendChild(
      createOwnerDetailItem(
        "مدة الحملة",
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
    emptyText.textContent = "ماكاين حتى موظف مسجل.";
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
    emptyText.textContent = "ماكاين حتى معطيات.";
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
  renderOwnerNetOverview();
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

function createOwnerBriefingSection(title, items) {
  if (items.length === 0) {
    return null;
  }

  const section = document.createElement("section");
  section.className = "owner-briefing-section";

  const heading = document.createElement("h4");
  heading.className = "modal-block-title";
  heading.textContent = title + " (" + items.length + ")";
  section.appendChild(heading);

  const list = document.createElement("ul");
  list.className = "owner-briefing-list";
  items.forEach(function (itemText) {
    const li = document.createElement("li");
    li.textContent = itemText;
    list.appendChild(li);
  });
  section.appendChild(list);
  return section;
}

function openOwnerBriefingModal() {
  if (!ownerBriefingModal) {
    return;
  }

  const employeeHealth = getSortedOwnerEmployeeHealth();

  const missingHoursItems = employeeHealth
    .filter(function (health) { return !health.meetsHours; })
    .map(function (health) {
      return health.employee.name + ": " + formatOwnerMinutes(health.missingMinutes) + " ناقصة اليوم";
    });

  const notDoneItems = [];
  const excuseItems = [];
  employeeHealth.forEach(function (health) {
    (health.state.tasks || []).forEach(function (task) {
      if (task.status === "notdone") {
        notDoneItems.push(health.employee.name + ": " + task.text);
      } else if (task.status === "excuse") {
        excuseItems.push(
          health.employee.name + ": " + task.text +
          (task.excuseReason ? " — " + task.excuseReason : " (فالانتظار ديال المبرر)")
        );
      }
    });
  });

  const stockItems = (ownerSharedData.stockRequests || []).map(function (request) {
    const typeLabel = request.type === "vente" ? "منتوج البيع" : "منتوج الصالون";
    return (request.name || "منتوج بلا اسم") + " — الكمية: " + request.quantity + " (" + typeLabel + ")";
  });

  ownerBriefingBody.innerHTML = "";
  const sections = [
    createOwnerBriefingSection("الساعات الناقصة", missingHoursItems),
    createOwnerBriefingSection("التاش لي ماكملاتش", notDoneItems),
    createOwnerBriefingSection("التاش المعذورة", excuseItems),
    createOwnerBriefingSection("احتياجات التموين", stockItems)
  ].filter(Boolean);

  const totalIssues = missingHoursItems.length + notDoneItems.length + excuseItems.length + stockItems.length;

  if (sections.length === 0) {
    ownerBriefingSubtitle.textContent = "كلشي مزيان اليوم.";
    const okMessage = document.createElement("p");
    okMessage.className = "owner-briefing-ok";
    okMessage.textContent = "ماكاين حتى مشكل: الساعات، التاش والمخزون كلشي مزيان.";
    ownerBriefingBody.appendChild(okMessage);
  } else {
    ownerBriefingSubtitle.textContent = totalIssues + " نقطة خاصها تتفقد اليوم.";
    sections.forEach(function (section) {
      ownerBriefingBody.appendChild(section);
    });
  }

  ownerBriefingModal.classList.remove("hidden");
}

function closeOwnerBriefingModal() {
  if (ownerBriefingModal) {
    ownerBriefingModal.classList.add("hidden");
  }
}

if (ownerBriefingCloseButton) {
  ownerBriefingCloseButton.addEventListener("click", closeOwnerBriefingModal);
}

if (ownerBriefingCloseIconButton) {
  ownerBriefingCloseIconButton.addEventListener("click", closeOwnerBriefingModal);
}

if (ownerBriefingModal) {
  ownerBriefingModal.addEventListener("click", function (event) {
    if (event.target === ownerBriefingModal) {
      closeOwnerBriefingModal();
    }
  });
}

const OWNER_BACKEND_TOKEN_KEY = "ownerBackendToken";
let ownerBackendAuthPendingAction = null;
let ownerStoreEditingProductId = null;
let ownerStoreEditingServiceId = null;
let ownerStoreEditingPackageId = null;
let ownerStoreEditingStaffId = null;
let ownerStoreEditingCouponId = null;

function getOwnerApiBase() {
  return window.SalonStorage ? window.SalonStorage.getApiBaseUrl() : "";
}

function getOwnerBackendToken() {
  return sessionStorage.getItem(OWNER_BACKEND_TOKEN_KEY) || "";
}

function setOwnerBackendToken(token) {
  if (token) {
    sessionStorage.setItem(OWNER_BACKEND_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(OWNER_BACKEND_TOKEN_KEY);
  }
}

function resolveOwnerStoreImageUrl(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  return getOwnerApiBase() + imageUrl;
}

async function ownerAuthorizedFetch(path, options) {
  const finalOptions = options || {};
  finalOptions.headers = Object.assign({}, finalOptions.headers, {
    Authorization: "Bearer " + getOwnerBackendToken()
  });

  return fetch(getOwnerApiBase() + path, finalOptions);
}

function openOwnerBackendAuthModal(onSuccess) {
  if (!ownerBackendAuthModal) {
    return;
  }

  ownerBackendAuthPendingAction = onSuccess || null;

  if (ownerBackendAuthFeedback) {
    ownerBackendAuthFeedback.textContent = "";
    ownerBackendAuthFeedback.classList.remove("is-error");
  }

  if (ownerBackendAuthForm) {
    ownerBackendAuthForm.reset();
  }

  ownerBackendAuthModal.classList.remove("hidden");
}

function closeOwnerBackendAuthModal() {
  if (ownerBackendAuthModal) {
    ownerBackendAuthModal.classList.add("hidden");
  }

  ownerBackendAuthPendingAction = null;
}

function ensureOwnerBackendAuth(onReady) {
  if (getOwnerBackendToken()) {
    onReady();
    return;
  }

  openOwnerBackendAuthModal(onReady);
}

if (ownerBackendAuthForm) {
  ownerBackendAuthForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = ownerBackendAuthUsername.value.trim();
    const password = ownerBackendAuthPassword.value;

    if (ownerBackendAuthFeedback) {
      ownerBackendAuthFeedback.textContent = "";
      ownerBackendAuthFeedback.classList.remove("is-error");
    }

    fetch(getOwnerApiBase() + "/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("bad-credentials");
        }
        return response.json();
      })
      .then(function (payload) {
        setOwnerBackendToken(payload.access_token);
        const action = ownerBackendAuthPendingAction;
        closeOwnerBackendAuthModal();
        if (action) {
          action();
        }
      })
      .catch(function () {
        if (ownerBackendAuthFeedback) {
          ownerBackendAuthFeedback.textContent = "المعلومات خاطئة ولا كاين مشكل فالاتصال.";
          ownerBackendAuthFeedback.classList.add("is-error");
        }
      });
  });
}

if (ownerBackendAuthCloseButton) {
  ownerBackendAuthCloseButton.addEventListener("click", closeOwnerBackendAuthModal);
}

if (ownerBackendAuthCloseIconButton) {
  ownerBackendAuthCloseIconButton.addEventListener("click", closeOwnerBackendAuthModal);
}

if (ownerBackendAuthModal) {
  ownerBackendAuthModal.addEventListener("click", function (event) {
    if (event.target === ownerBackendAuthModal) {
      closeOwnerBackendAuthModal();
    }
  });
}

function getOwnerTaskCompletionPercent(tasks) {
  if (!tasks.length) {
    return null;
  }

  const completed = tasks.filter(function (task) { return task.done; }).length;
  return Math.round((completed / tasks.length) * 100);
}

function renderOwnerTasksTracking() {
  if (!ownerTasksTrackingList) {
    return;
  }

  ownerTasksTrackingList.innerHTML = "";

  if (!ownerEmployees.length) {
    ownerTasksTrackingList.innerHTML = '<p class="owner-bi-empty">ماكاين حتى موظف مسجل.</p>';
    return;
  }

  ownerEmployees.forEach(function (employee) {
    const state = getOwnerEmployeeState(employee.id);
    const tasks = state.tasks || [];
    const percent = getOwnerTaskCompletionPercent(tasks);

    const card = document.createElement("div");
    card.className = "owner-tasks-employee-card";

    const head = document.createElement("div");
    head.className = "owner-tasks-employee-head";

    const name = document.createElement("strong");
    name.textContent = employee.name;

    const badge = document.createElement("span");
    badge.className = "owner-tasks-percentage" + (percent === null ? "" : percent >= 100 ? " complete" : " incomplete");
    badge.textContent = percent === null ? "ماكاين حتى تاش" : percent + "%";

    head.appendChild(name);
    head.appendChild(badge);
    card.appendChild(head);

    if (!tasks.length) {
      const empty = document.createElement("p");
      empty.className = "owner-bi-empty";
      empty.textContent = "ماكاين حتى تاش مسندة.";
      card.appendChild(empty);
      ownerTasksTrackingList.appendChild(card);
      return;
    }

    const list = document.createElement("ul");
    list.className = "owner-modal-task-list";

    tasks.forEach(function (task, index) {
      const item = document.createElement("li");
      item.className = "task-item" + (task.done ? " is-done" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Boolean(task.done);
      checkbox.addEventListener("change", function () {
        task.done = checkbox.checked;
        task.completedAtISO = checkbox.checked ? new Date().toISOString() : null;
        saveOwnerProductsData();
        renderOwnerTasksTracking();
        renderOwnerDashboard(ownerActivePeriod);
      });

      const text = document.createElement("span");
      text.textContent = task.text;

      item.appendChild(checkbox);
      item.appendChild(text);

      if (task.status === "excuse") {
        const statusBadge = document.createElement("span");
        statusBadge.className = "task-status-badge task-status-excuse";
        statusBadge.textContent = "معذور";
        item.appendChild(statusBadge);
      }

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "owner-task-remove";
      removeButton.textContent = "✕";
      removeButton.setAttribute("aria-label", "مسح التاش");
      removeButton.addEventListener("click", function () {
        tasks.splice(index, 1);
        saveOwnerProductsData();
        renderOwnerTasksTracking();
        renderOwnerDashboard(ownerActivePeriod);
      });

      item.appendChild(removeButton);
      list.appendChild(item);

      if (task.status === "excuse") {
        const reason = document.createElement("li");
        reason.className = "task-excuse-reason";
        reason.textContent = task.excuseReason
          ? "المبرر: " + task.excuseReason
          : "فالانتظار ديال المبرر ديال الموظف.";
        list.appendChild(reason);
      }
    });

    card.appendChild(list);
    ownerTasksTrackingList.appendChild(card);
  });
}

function openOwnerTasksModal() {
  if (!ownerTasksModal) {
    return;
  }

  if (ownerTasksBroadcastFeedback) {
    ownerTasksBroadcastFeedback.textContent = "";
  }

  renderOwnerTasksTracking();
  ownerTasksModal.classList.remove("hidden");
}

function closeOwnerTasksModal() {
  if (ownerTasksModal) {
    ownerTasksModal.classList.add("hidden");
  }
}

if (ownerTasksBroadcastForm) {
  ownerTasksBroadcastForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = ownerTasksBroadcastInput.value.trim();
    if (!text) {
      return;
    }

    ownerEmployees.forEach(function (employee) {
      const state = getOwnerEmployeeState(employee.id);
      state.tasks = state.tasks || [];
      state.tasks.push({
        text: text,
        done: false,
        completedAtISO: null
      });
    });

    saveOwnerProductsData();
    ownerTasksBroadcastInput.value = "";

    if (ownerTasksBroadcastFeedback) {
      ownerTasksBroadcastFeedback.textContent = "التاش تزادت لجميع الموظفين (" + ownerEmployees.length + ").";
      ownerTasksBroadcastFeedback.classList.remove("is-error");
    }

    renderOwnerTasksTracking();
    renderOwnerDashboard(ownerActivePeriod);
  });
}

if (ownerTasksCloseButton) {
  ownerTasksCloseButton.addEventListener("click", closeOwnerTasksModal);
}

if (ownerTasksCloseIconButton) {
  ownerTasksCloseIconButton.addEventListener("click", closeOwnerTasksModal);
}

if (ownerTasksModal) {
  ownerTasksModal.addEventListener("click", function (event) {
    if (event.target === ownerTasksModal) {
      closeOwnerTasksModal();
    }
  });
}

const OWNER_BOOKING_STATUSES = ["pending", "confirmed", "in_store", "paid_in_store", "cancelled", "no_show"];

function formatOwnerBookingStatus(status) {
  const map = {
    pending: "فالانتظار",
    confirmed: "مؤكد",
    in_store: "وصل للمحل",
    paid_in_store: "خلص فالمحل",
    cancelled: "ملغي",
    no_show: "ماجاش"
  };

  return map[status] || status;
}

function updateOwnerBookingStatus(bookingId, status) {
  ownerAuthorizedFetch("/admin/bookings/" + bookingId, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: status })
  }).then(function (response) {
    if (response.status === 401) {
      setOwnerBackendToken("");
      openOwnerBackendAuthModal(function () {
        updateOwnerBookingStatus(bookingId, status);
      });
    }
  }).catch(function () {});
}

function renderOwnerBookingCard(booking) {
  const card = document.createElement("div");
  card.className = "owner-booking-card";

  const head = document.createElement("div");
  head.className = "owner-booking-head";

  const nameEl = document.createElement("strong");
  nameEl.textContent = booking.client_name + " · " + booking.client_phone;

  const dateEl = document.createElement("span");
  dateEl.textContent = booking.booking_date + " · " + String(booking.booking_time || "").slice(0, 5);

  head.appendChild(nameEl);
  head.appendChild(dateEl);

  const items = document.createElement("div");
  items.className = "owner-booking-items";

  const serviceNames = (booking.services || []).map(function (row) { return row.name; });
  const productNames = (booking.products || []).map(function (row) { return row.name + " ×" + row.quantity; });
  const parts = [];
  if (serviceNames.length) {
    parts.push("الخدمات: " + serviceNames.join("، "));
  }
  if (productNames.length) {
    parts.push("المنتوجات: " + productNames.join("، "));
  }
  if (booking.note) {
    parts.push("ملاحظة: " + booking.note);
  }
  items.textContent = parts.join(" — ") || "بلا تفاصيل";

  const foot = document.createElement("div");
  foot.className = "owner-booking-foot";

  const totalEl = document.createElement("span");
  totalEl.className = "owner-booking-total";
  totalEl.textContent = formatOwnerAmount(Number(booking.total_amount || 0));

  const statusSelect = document.createElement("select");
  statusSelect.className = "owner-booking-status-select";
  OWNER_BOOKING_STATUSES.forEach(function (status) {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = formatOwnerBookingStatus(status);
    if (status === booking.status) {
      option.selected = true;
    }
    statusSelect.appendChild(option);
  });
  statusSelect.addEventListener("change", function () {
    updateOwnerBookingStatus(booking.id, statusSelect.value);
  });

  foot.appendChild(totalEl);
  foot.appendChild(statusSelect);

  card.appendChild(head);
  card.appendChild(items);
  card.appendChild(foot);
  return card;
}

function loadOwnerBookings() {
  if (!ownerBookingsList) {
    return;
  }

  if (ownerBookingsFeedback) {
    ownerBookingsFeedback.textContent = "كنحمل...";
    ownerBookingsFeedback.classList.remove("is-error");
  }

  ownerAuthorizedFetch("/admin/bookings")
    .then(function (response) {
      if (response.status === 401) {
        setOwnerBackendToken("");
        openOwnerBackendAuthModal(loadOwnerBookings);
        return null;
      }
      if (!response.ok) {
        throw new Error("failed");
      }
      return response.json();
    })
    .then(function (bookings) {
      if (bookings === null) {
        return;
      }

      ownerBookingsList.innerHTML = "";
      if (!bookings.length) {
        const empty = document.createElement("p");
        empty.className = "owner-bi-empty";
        empty.textContent = "ماكاين حتى موعد دابا.";
        ownerBookingsList.appendChild(empty);
      } else {
        bookings.forEach(function (booking) {
          ownerBookingsList.appendChild(renderOwnerBookingCard(booking));
        });
      }

      if (ownerBookingsFeedback) {
        ownerBookingsFeedback.textContent = "";
      }
    })
    .catch(function () {
      if (ownerBookingsFeedback) {
        ownerBookingsFeedback.textContent = "تعذر تحميل المواعيد. تأكد من الاتصال.";
        ownerBookingsFeedback.classList.add("is-error");
      }
    });
}

function openOwnerBookingsModal() {
  if (!ownerBookingsModal) {
    return;
  }

  ownerBookingsModal.classList.remove("hidden");
  loadOwnerBookings();
}

function closeOwnerBookingsModal() {
  if (ownerBookingsModal) {
    ownerBookingsModal.classList.add("hidden");
  }
}

if (ownerBookingsCloseButton) {
  ownerBookingsCloseButton.addEventListener("click", closeOwnerBookingsModal);
}

if (ownerBookingsCloseIconButton) {
  ownerBookingsCloseIconButton.addEventListener("click", closeOwnerBookingsModal);
}

if (ownerBookingsRefreshButton) {
  ownerBookingsRefreshButton.addEventListener("click", loadOwnerBookings);
}

if (ownerBookingsModal) {
  ownerBookingsModal.addEventListener("click", function (event) {
    if (event.target === ownerBookingsModal) {
      closeOwnerBookingsModal();
    }
  });
}

function uploadOwnerStoreImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  return ownerAuthorizedFetch("/admin/upload", {
    method: "POST",
    body: formData
  }).then(function (response) {
    if (!response.ok) {
      throw new Error("upload-failed");
    }
    return response.json();
  }).then(function (payload) {
    return payload.url;
  });
}

function setOwnerStoreTab(tabName) {
  ownerStoreTabButtons.forEach(function (button) {
    button.classList.toggle("active", button.dataset.storeTab === tabName);
  });

  ["packages", "products", "services", "staff", "coupons"].forEach(function (name) {
    const panel = document.getElementById("owner-store-tab-" + name);
    if (panel) {
      panel.classList.toggle("hidden", tabName !== name);
    }
  });
}

ownerStoreTabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    setOwnerStoreTab(button.dataset.storeTab);
    if (button.dataset.storeTab === "coupons") {
      loadOwnerStoreCoupons();
    }
  });
});

function openOwnerStoreProductForm(product) {
  if (!ownerStoreProductForm) {
    return;
  }

  ownerStoreProductForm.classList.remove("hidden");
  if (ownerStoreProductFeedback) {
    ownerStoreProductFeedback.textContent = "";
    ownerStoreProductFeedback.classList.remove("is-error");
  }
  ownerStoreProductPhoto.value = "";

  if (product) {
    ownerStoreEditingProductId = product.id;
    ownerStoreProductId.value = product.id;
    ownerStoreProductName.value = product.name;
    ownerStoreProductShortDesc.value = product.short_description || "";
    ownerStoreProductLongDesc.value = product.long_description || "";
    ownerStoreProductCategory.value = product.category || "";
    ownerStoreProductPrice1.value = product.price_1;
    ownerStoreProductPrice2.value = product.price_2;
    ownerStoreProductPrice3.value = product.price_3;
    ownerStoreProductStock.value = product.stock;
    ownerStoreProductForm.dataset.imageUrl = product.image_url || "";
    ownerStoreProductPhotoPreview.src = resolveOwnerStoreImageUrl(product.image_url);
    ownerStoreProductPhotoPreview.classList.remove("hidden");
  } else {
    ownerStoreEditingProductId = null;
    ownerStoreProductForm.reset();
    ownerStoreProductId.value = "";
    ownerStoreProductForm.dataset.imageUrl = "";
    ownerStoreProductPhotoPreview.classList.add("hidden");
  }
}

function closeOwnerStoreProductForm() {
  if (!ownerStoreProductForm) {
    return;
  }

  ownerStoreProductForm.classList.add("hidden");
  ownerStoreProductForm.reset();
  ownerStoreEditingProductId = null;
}

if (ownerStoreAddProductToggle) {
  ownerStoreAddProductToggle.addEventListener("click", function () {
    openOwnerStoreProductForm(null);
  });
}

if (ownerStoreProductCancel) {
  ownerStoreProductCancel.addEventListener("click", closeOwnerStoreProductForm);
}

if (ownerStoreProductPhoto) {
  ownerStoreProductPhoto.addEventListener("change", function () {
    const file = ownerStoreProductPhoto.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      ownerStoreProductPhotoPreview.src = reader.result;
      ownerStoreProductPhotoPreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });
}

function renderOwnerStoreProducts(products) {
  if (!ownerStoreProductsList) {
    return;
  }

  ownerStoreProductsList.innerHTML = "";

  if (!products.length) {
    ownerStoreProductsList.innerHTML = '<p class="owner-bi-empty">ماكاين حتى منتوج فالستور.</p>';
    return;
  }

  products.forEach(function (product) {
    const card = document.createElement("div");
    card.className = "owner-store-item-card";

    const img = document.createElement("img");
    img.className = "owner-store-item-photo";
    img.src = resolveOwnerStoreImageUrl(product.image_url);
    img.alt = product.name;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "owner-store-item-body";

    const name = document.createElement("strong");
    name.textContent = product.name;

    const price = document.createElement("span");
    price.textContent =
      formatOwnerAmount(Number(product.price_1)) + " / " +
      formatOwnerAmount(Number(product.price_2)) + " / " +
      formatOwnerAmount(Number(product.price_3));

    const actions = document.createElement("div");
    actions.className = "owner-store-item-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "manager-btn manager-btn-muted";
    editButton.textContent = "تعديل";
    editButton.addEventListener("click", function () {
      openOwnerStoreProductForm(product);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "manager-btn manager-btn-muted";
    deleteButton.textContent = "مسح";
    deleteButton.addEventListener("click", function () {
      deleteOwnerStoreProduct(product.id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    body.appendChild(name);
    body.appendChild(price);
    body.appendChild(actions);

    card.appendChild(img);
    card.appendChild(body);
    ownerStoreProductsList.appendChild(card);
  });
}

let ownerStoreProductsCache = [];
let ownerStoreServicesCache = [];

function loadOwnerStoreProducts() {
  if (!ownerStoreProductsList) {
    return;
  }

  fetch(getOwnerApiBase() + "/api/products/")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("failed");
      }
      return response.json();
    })
    .then(function (products) {
      ownerStoreProductsCache = products;
      renderOwnerStoreProducts(products);
      renderOwnerStorePackageChecklists();
    })
    .catch(function () {
      ownerStoreProductsList.innerHTML = '<p class="owner-bi-empty">تعذر تحميل المنتوجات.</p>';
    });
}

function deleteOwnerStoreProduct(productId) {
  if (!window.confirm("واش متأكد بغيتي تمسح هاد المنتوج؟")) {
    return;
  }

  ownerAuthorizedFetch("/admin/products/" + productId, { method: "DELETE" })
    .then(function (response) {
      if (response.status === 401) {
        setOwnerBackendToken("");
        openOwnerBackendAuthModal(function () { deleteOwnerStoreProduct(productId); });
        return;
      }
      if (!response.ok) {
        throw new Error("delete-failed");
      }
      loadOwnerStoreProducts();
    })
    .catch(function () {
      alert("تعذر مسح المنتوج.");
    });
}

if (ownerStoreProductForm) {
  ownerStoreProductForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (ownerStoreProductFeedback) {
      ownerStoreProductFeedback.textContent = "كنسجل...";
      ownerStoreProductFeedback.classList.remove("is-error");
    }

    const file = ownerStoreProductPhoto.files[0];
    const uploadPromise = file
      ? uploadOwnerStoreImage(file)
      : Promise.resolve(ownerStoreProductForm.dataset.imageUrl || "/images/placeholders/product.jpg");

    uploadPromise
      .then(function (imageUrl) {
        const payload = {
          name: ownerStoreProductName.value.trim(),
          short_description: ownerStoreProductShortDesc.value.trim(),
          long_description: ownerStoreProductLongDesc.value.trim(),
          image_url: imageUrl,
          category: ownerStoreProductCategory.value.trim() || "hair-care",
          price_1: Number(ownerStoreProductPrice1.value),
          price_2: Number(ownerStoreProductPrice2.value),
          price_3: Number(ownerStoreProductPrice3.value),
          stock: Number(ownerStoreProductStock.value || 0),
          rating: 4.8,
          review_count: 0
        };

        const isEdit = Boolean(ownerStoreEditingProductId);
        return ownerAuthorizedFetch(
          isEdit ? "/admin/products/" + ownerStoreEditingProductId : "/admin/products",
          {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }
        );
      })
      .then(function (response) {
        if (response.status === 401) {
          setOwnerBackendToken("");
          openOwnerBackendAuthModal(function () { ownerStoreProductForm.requestSubmit(); });
          return null;
        }
        if (!response.ok) {
          throw new Error("save-failed");
        }
        return response.json();
      })
      .then(function (result) {
        if (result === null) {
          return;
        }
        closeOwnerStoreProductForm();
        loadOwnerStoreProducts();
      })
      .catch(function () {
        if (ownerStoreProductFeedback) {
          ownerStoreProductFeedback.textContent = "تعذر التسجيل. عاود حاول.";
          ownerStoreProductFeedback.classList.add("is-error");
        }
      });
  });
}

function openOwnerStoreServiceForm(service) {
  if (!ownerStoreServiceForm) {
    return;
  }

  ownerStoreServiceForm.classList.remove("hidden");
  if (ownerStoreServiceFeedback) {
    ownerStoreServiceFeedback.textContent = "";
    ownerStoreServiceFeedback.classList.remove("is-error");
  }
  ownerStoreServicePhoto.value = "";

  if (service) {
    ownerStoreEditingServiceId = service.id;
    ownerStoreServiceId.value = service.id;
    ownerStoreServiceName.value = service.name;
    ownerStoreServiceDesc.value = service.description || "";
    ownerStoreServicePrice.value = service.price;
    ownerStoreServiceDuration.value = service.duration_minutes;
    ownerStoreServiceForm.dataset.imageUrl = service.image_url || "";
    ownerStoreServicePhotoPreview.src = resolveOwnerStoreImageUrl(service.image_url);
    ownerStoreServicePhotoPreview.classList.remove("hidden");
  } else {
    ownerStoreEditingServiceId = null;
    ownerStoreServiceForm.reset();
    ownerStoreServiceId.value = "";
    ownerStoreServiceForm.dataset.imageUrl = "";
    ownerStoreServicePhotoPreview.classList.add("hidden");
  }
}

function closeOwnerStoreServiceForm() {
  if (!ownerStoreServiceForm) {
    return;
  }

  ownerStoreServiceForm.classList.add("hidden");
  ownerStoreServiceForm.reset();
  ownerStoreEditingServiceId = null;
}

if (ownerStoreAddServiceToggle) {
  ownerStoreAddServiceToggle.addEventListener("click", function () {
    openOwnerStoreServiceForm(null);
  });
}

if (ownerStoreServiceCancel) {
  ownerStoreServiceCancel.addEventListener("click", closeOwnerStoreServiceForm);
}

if (ownerStoreServicePhoto) {
  ownerStoreServicePhoto.addEventListener("change", function () {
    const file = ownerStoreServicePhoto.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      ownerStoreServicePhotoPreview.src = reader.result;
      ownerStoreServicePhotoPreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });
}

function renderOwnerStoreServices(services) {
  if (!ownerStoreServicesList) {
    return;
  }

  ownerStoreServicesList.innerHTML = "";

  if (!services.length) {
    ownerStoreServicesList.innerHTML = '<p class="owner-bi-empty">ماكاين حتى خدمة فالستور.</p>';
    return;
  }

  services.forEach(function (service) {
    const card = document.createElement("div");
    card.className = "owner-store-item-card";

    const img = document.createElement("img");
    img.className = "owner-store-item-photo";
    img.src = resolveOwnerStoreImageUrl(service.image_url);
    img.alt = service.name;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "owner-store-item-body";

    const name = document.createElement("strong");
    name.textContent = service.name;

    const price = document.createElement("span");
    price.textContent = formatOwnerAmount(Number(service.price)) + " · " + service.duration_minutes + " د";

    const actions = document.createElement("div");
    actions.className = "owner-store-item-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "manager-btn manager-btn-muted";
    editButton.textContent = "تعديل";
    editButton.addEventListener("click", function () {
      openOwnerStoreServiceForm(service);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "manager-btn manager-btn-muted";
    deleteButton.textContent = "مسح";
    deleteButton.addEventListener("click", function () {
      deleteOwnerStoreService(service.id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    body.appendChild(name);
    body.appendChild(price);
    body.appendChild(actions);

    card.appendChild(img);
    card.appendChild(body);
    ownerStoreServicesList.appendChild(card);
  });
}

function loadOwnerStoreServices() {
  if (!ownerStoreServicesList) {
    return;
  }

  fetch(getOwnerApiBase() + "/api/services/")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("failed");
      }
      return response.json();
    })
    .then(function (services) {
      ownerStoreServicesCache = services;
      renderOwnerStoreServices(services);
      renderOwnerStorePackageChecklists();
    })
    .catch(function () {
      ownerStoreServicesList.innerHTML = '<p class="owner-bi-empty">تعذر تحميل الخدمات.</p>';
    });
}

function deleteOwnerStoreService(serviceId) {
  if (!window.confirm("واش متأكد بغيتي تمسح هاد الخدمة؟")) {
    return;
  }

  ownerAuthorizedFetch("/admin/services/" + serviceId, { method: "DELETE" })
    .then(function (response) {
      if (response.status === 401) {
        setOwnerBackendToken("");
        openOwnerBackendAuthModal(function () { deleteOwnerStoreService(serviceId); });
        return;
      }
      if (!response.ok) {
        throw new Error("delete-failed");
      }
      loadOwnerStoreServices();
    })
    .catch(function () {
      alert("تعذر مسح الخدمة.");
    });
}

if (ownerStoreServiceForm) {
  ownerStoreServiceForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (ownerStoreServiceFeedback) {
      ownerStoreServiceFeedback.textContent = "كنسجل...";
      ownerStoreServiceFeedback.classList.remove("is-error");
    }

    const file = ownerStoreServicePhoto.files[0];
    const uploadPromise = file
      ? uploadOwnerStoreImage(file)
      : Promise.resolve(ownerStoreServiceForm.dataset.imageUrl || "/images/placeholders/service.jpg");

    uploadPromise
      .then(function (imageUrl) {
        const payload = {
          name: ownerStoreServiceName.value.trim(),
          description: ownerStoreServiceDesc.value.trim(),
          price: Number(ownerStoreServicePrice.value),
          duration_minutes: Number(ownerStoreServiceDuration.value),
          image_url: imageUrl
        };

        const isEdit = Boolean(ownerStoreEditingServiceId);
        return ownerAuthorizedFetch(
          isEdit ? "/admin/services/" + ownerStoreEditingServiceId : "/admin/services",
          {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }
        );
      })
      .then(function (response) {
        if (response.status === 401) {
          setOwnerBackendToken("");
          openOwnerBackendAuthModal(function () { ownerStoreServiceForm.requestSubmit(); });
          return null;
        }
        if (!response.ok) {
          throw new Error("save-failed");
        }
        return response.json();
      })
      .then(function (result) {
        if (result === null) {
          return;
        }
        closeOwnerStoreServiceForm();
        loadOwnerStoreServices();
      })
      .catch(function () {
        if (ownerStoreServiceFeedback) {
          ownerStoreServiceFeedback.textContent = "تعذر التسجيل. عاود حاول.";
          ownerStoreServiceFeedback.classList.add("is-error");
        }
      });
  });
}

let ownerStorePackagesCache = [];

function renderOwnerStorePackageChecklists(selectedServiceIds, selectedProductIds) {
  if (ownerStorePackageServicesChecks) {
    ownerStorePackageServicesChecks.innerHTML = "";
    if (!ownerStoreServicesCache.length) {
      ownerStorePackageServicesChecks.innerHTML = '<span class="empty">ماكاين حتى خدمة بعد.</span>';
    } else {
      ownerStoreServicesCache.forEach(function (service) {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = service.id;
        checkbox.checked = Boolean(selectedServiceIds && selectedServiceIds.indexOf(service.id) !== -1);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(service.name));
        ownerStorePackageServicesChecks.appendChild(label);
      });
    }
  }

  if (ownerStorePackageProductsChecks) {
    ownerStorePackageProductsChecks.innerHTML = "";
    if (!ownerStoreProductsCache.length) {
      ownerStorePackageProductsChecks.innerHTML = '<span class="empty">ماكاين حتى منتوج بعد.</span>';
    } else {
      ownerStoreProductsCache.forEach(function (product) {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = product.id;
        checkbox.checked = Boolean(selectedProductIds && selectedProductIds.indexOf(product.id) !== -1);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(product.name));
        ownerStorePackageProductsChecks.appendChild(label);
      });
    }
  }
}

function getOwnerStoreCheckedValues(container) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(function (input) {
    return input.value;
  });
}

function openOwnerStorePackageForm(pkg) {
  if (!ownerStorePackageForm) {
    return;
  }

  ownerStorePackageForm.classList.remove("hidden");
  if (ownerStorePackageFeedback) {
    ownerStorePackageFeedback.textContent = "";
    ownerStorePackageFeedback.classList.remove("is-error");
  }
  ownerStorePackagePhoto.value = "";

  if (pkg) {
    ownerStoreEditingPackageId = pkg.id;
    ownerStorePackageId.value = pkg.id;
    ownerStorePackageName.value = pkg.name;
    ownerStorePackageDesc.value = pkg.description || "";
    ownerStorePackagePrice.value = pkg.price;
    ownerStorePackageForm.dataset.imageUrl = pkg.image_url || "";
    ownerStorePackagePhotoPreview.src = resolveOwnerStoreImageUrl(pkg.image_url);
    ownerStorePackagePhotoPreview.classList.remove("hidden");
    renderOwnerStorePackageChecklists(pkg.service_ids || [], pkg.product_ids || []);
  } else {
    ownerStoreEditingPackageId = null;
    ownerStorePackageForm.reset();
    ownerStorePackageId.value = "";
    ownerStorePackageForm.dataset.imageUrl = "";
    ownerStorePackagePhotoPreview.classList.add("hidden");
    renderOwnerStorePackageChecklists([], []);
  }
}

function closeOwnerStorePackageForm() {
  if (!ownerStorePackageForm) {
    return;
  }

  ownerStorePackageForm.classList.add("hidden");
  ownerStorePackageForm.reset();
  ownerStoreEditingPackageId = null;
}

if (ownerStoreAddPackageToggle) {
  ownerStoreAddPackageToggle.addEventListener("click", function () {
    openOwnerStorePackageForm(null);
  });
}

if (ownerStorePackageCancel) {
  ownerStorePackageCancel.addEventListener("click", closeOwnerStorePackageForm);
}

if (ownerStorePackagePhoto) {
  ownerStorePackagePhoto.addEventListener("change", function () {
    const file = ownerStorePackagePhoto.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      ownerStorePackagePhotoPreview.src = reader.result;
      ownerStorePackagePhotoPreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });
}

function renderOwnerStorePackages(packages) {
  if (!ownerStorePackagesList) {
    return;
  }

  ownerStorePackagesList.innerHTML = "";

  if (!packages.length) {
    ownerStorePackagesList.innerHTML = '<p class="owner-bi-empty">ماكاين حتى باقة فالستور.</p>';
    return;
  }

  packages.forEach(function (pkg) {
    const card = document.createElement("div");
    card.className = "owner-store-item-card";

    const img = document.createElement("img");
    img.className = "owner-store-item-photo";
    img.src = resolveOwnerStoreImageUrl(pkg.image_url);
    img.alt = pkg.name;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "owner-store-item-body";

    const name = document.createElement("strong");
    name.textContent = pkg.name;

    const price = document.createElement("span");
    price.textContent = formatOwnerAmount(Number(pkg.price));

    const contents = document.createElement("span");
    const parts = [];
    if ((pkg.service_names || []).length) {
      parts.push((pkg.service_names || []).join("، "));
    }
    if ((pkg.product_names || []).length) {
      parts.push((pkg.product_names || []).join("، "));
    }
    contents.textContent = parts.join(" + ") || "بلا محتوى";

    const actions = document.createElement("div");
    actions.className = "owner-store-item-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "manager-btn manager-btn-muted";
    editButton.textContent = "تعديل";
    editButton.addEventListener("click", function () {
      openOwnerStorePackageForm(pkg);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "manager-btn manager-btn-muted";
    deleteButton.textContent = "مسح";
    deleteButton.addEventListener("click", function () {
      deleteOwnerStorePackage(pkg.id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    body.appendChild(name);
    body.appendChild(price);
    body.appendChild(contents);
    body.appendChild(actions);

    card.appendChild(img);
    card.appendChild(body);
    ownerStorePackagesList.appendChild(card);
  });
}

function loadOwnerStorePackages() {
  if (!ownerStorePackagesList) {
    return;
  }

  fetch(getOwnerApiBase() + "/api/packages/")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("failed");
      }
      return response.json();
    })
    .then(function (packages) {
      ownerStorePackagesCache = packages;
      renderOwnerStorePackages(packages);
    })
    .catch(function () {
      ownerStorePackagesList.innerHTML = '<p class="owner-bi-empty">تعذر تحميل الباقات.</p>';
    });
}

function deleteOwnerStorePackage(packageId) {
  if (!window.confirm("واش متأكد بغيتي تمسح هاد الباقة؟")) {
    return;
  }

  ownerAuthorizedFetch("/admin/packages/" + packageId, { method: "DELETE" })
    .then(function (response) {
      if (response.status === 401) {
        setOwnerBackendToken("");
        openOwnerBackendAuthModal(function () { deleteOwnerStorePackage(packageId); });
        return;
      }
      if (!response.ok) {
        throw new Error("delete-failed");
      }
      loadOwnerStorePackages();
    })
    .catch(function () {
      alert("تعذر مسح الباقة.");
    });
}

if (ownerStorePackageForm) {
  ownerStorePackageForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (ownerStorePackageFeedback) {
      ownerStorePackageFeedback.textContent = "كنسجل...";
      ownerStorePackageFeedback.classList.remove("is-error");
    }

    const file = ownerStorePackagePhoto.files[0];
    const uploadPromise = file
      ? uploadOwnerStoreImage(file)
      : Promise.resolve(ownerStorePackageForm.dataset.imageUrl || "/images/placeholders/package.jpg");

    uploadPromise
      .then(function (imageUrl) {
        const payload = {
          name: ownerStorePackageName.value.trim(),
          description: ownerStorePackageDesc.value.trim(),
          image_url: imageUrl,
          price: Number(ownerStorePackagePrice.value),
          service_ids: getOwnerStoreCheckedValues(ownerStorePackageServicesChecks),
          product_ids: getOwnerStoreCheckedValues(ownerStorePackageProductsChecks)
        };

        const isEdit = Boolean(ownerStoreEditingPackageId);
        return ownerAuthorizedFetch(
          isEdit ? "/admin/packages/" + ownerStoreEditingPackageId : "/admin/packages",
          {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }
        );
      })
      .then(function (response) {
        if (response.status === 401) {
          setOwnerBackendToken("");
          openOwnerBackendAuthModal(function () { ownerStorePackageForm.requestSubmit(); });
          return null;
        }
        if (!response.ok) {
          throw new Error("save-failed");
        }
        return response.json();
      })
      .then(function (result) {
        if (result === null) {
          return;
        }
        closeOwnerStorePackageForm();
        loadOwnerStorePackages();
      })
      .catch(function () {
        if (ownerStorePackageFeedback) {
          ownerStorePackageFeedback.textContent = "تعذر التسجيل. عاود حاول.";
          ownerStorePackageFeedback.classList.add("is-error");
        }
      });
  });
}

function openOwnerStoreStaffForm(staffMember) {
  if (!ownerStoreStaffForm) {
    return;
  }

  ownerStoreStaffForm.classList.remove("hidden");
  if (ownerStoreStaffFeedback) {
    ownerStoreStaffFeedback.textContent = "";
    ownerStoreStaffFeedback.classList.remove("is-error");
  }
  ownerStoreStaffPhoto.value = "";

  if (staffMember) {
    ownerStoreEditingStaffId = staffMember.id;
    ownerStoreStaffId.value = staffMember.id;
    ownerStoreStaffName.value = staffMember.name;
    ownerStoreStaffActive.checked = Boolean(staffMember.active);
    ownerStoreStaffForm.dataset.imageUrl = staffMember.photo_url || "";
    ownerStoreStaffPhotoPreview.src = resolveOwnerStoreImageUrl(staffMember.photo_url);
    ownerStoreStaffPhotoPreview.classList.remove("hidden");
  } else {
    ownerStoreEditingStaffId = null;
    ownerStoreStaffForm.reset();
    ownerStoreStaffId.value = "";
    ownerStoreStaffActive.checked = true;
    ownerStoreStaffForm.dataset.imageUrl = "";
    ownerStoreStaffPhotoPreview.classList.add("hidden");
  }
}

function closeOwnerStoreStaffForm() {
  if (!ownerStoreStaffForm) {
    return;
  }

  ownerStoreStaffForm.classList.add("hidden");
  ownerStoreStaffForm.reset();
  ownerStoreEditingStaffId = null;
}

if (ownerStoreAddStaffToggle) {
  ownerStoreAddStaffToggle.addEventListener("click", function () {
    openOwnerStoreStaffForm(null);
  });
}

if (ownerStoreStaffCancel) {
  ownerStoreStaffCancel.addEventListener("click", closeOwnerStoreStaffForm);
}

if (ownerStoreStaffPhoto) {
  ownerStoreStaffPhoto.addEventListener("change", function () {
    const file = ownerStoreStaffPhoto.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      ownerStoreStaffPhotoPreview.src = reader.result;
      ownerStoreStaffPhotoPreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });
}

function renderOwnerStoreStaff(staffMembers) {
  if (!ownerStoreStaffList) {
    return;
  }

  ownerStoreStaffList.innerHTML = "";

  if (!staffMembers.length) {
    ownerStoreStaffList.innerHTML = '<p class="owner-bi-empty">ماكاين حتى موظف للحجز بعد.</p>';
    return;
  }

  staffMembers.forEach(function (staffMember) {
    const card = document.createElement("div");
    card.className = "owner-store-item-card";

    const img = document.createElement("img");
    img.className = "owner-store-item-photo";
    img.src = resolveOwnerStoreImageUrl(staffMember.photo_url);
    img.alt = staffMember.name;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "owner-store-item-body";

    const name = document.createElement("strong");
    name.textContent = staffMember.name;

    const status = document.createElement("span");
    status.textContent = staffMember.active ? "ظاهر للزبناء" : "مخبي";

    const actions = document.createElement("div");
    actions.className = "owner-store-item-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "manager-btn manager-btn-muted";
    editButton.textContent = "تعديل";
    editButton.addEventListener("click", function () {
      openOwnerStoreStaffForm(staffMember);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "manager-btn manager-btn-muted";
    deleteButton.textContent = "مسح";
    deleteButton.addEventListener("click", function () {
      deleteOwnerStoreStaff(staffMember.id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    body.appendChild(name);
    body.appendChild(status);
    body.appendChild(actions);

    card.appendChild(img);
    card.appendChild(body);
    ownerStoreStaffList.appendChild(card);
  });
}

function loadOwnerStoreStaff() {
  if (!ownerStoreStaffList) {
    return;
  }

  fetch(getOwnerApiBase() + "/api/staff/")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("failed");
      }
      return response.json();
    })
    .then(renderOwnerStoreStaff)
    .catch(function () {
      ownerStoreStaffList.innerHTML = '<p class="owner-bi-empty">تعذر تحميل الموظفين.</p>';
    });
}

function deleteOwnerStoreStaff(staffId) {
  if (!window.confirm("واش متأكد بغيتي تمسح هاد الموظف؟")) {
    return;
  }

  ownerAuthorizedFetch("/admin/staff/" + staffId, { method: "DELETE" })
    .then(function (response) {
      if (response.status === 401) {
        setOwnerBackendToken("");
        openOwnerBackendAuthModal(function () { deleteOwnerStoreStaff(staffId); });
        return;
      }
      if (!response.ok) {
        throw new Error("delete-failed");
      }
      loadOwnerStoreStaff();
    })
    .catch(function () {
      alert("تعذر مسح الموظف.");
    });
}

if (ownerStoreStaffForm) {
  ownerStoreStaffForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (ownerStoreStaffFeedback) {
      ownerStoreStaffFeedback.textContent = "كنسجل...";
      ownerStoreStaffFeedback.classList.remove("is-error");
    }

    const file = ownerStoreStaffPhoto.files[0];
    const uploadPromise = file
      ? uploadOwnerStoreImage(file)
      : Promise.resolve(ownerStoreStaffForm.dataset.imageUrl || "/images/placeholders/staff.jpg");

    uploadPromise
      .then(function (photoUrl) {
        const payload = {
          name: ownerStoreStaffName.value.trim(),
          photo_url: photoUrl,
          active: Boolean(ownerStoreStaffActive.checked)
        };

        const isEdit = Boolean(ownerStoreEditingStaffId);
        return ownerAuthorizedFetch(
          isEdit ? "/admin/staff/" + ownerStoreEditingStaffId : "/admin/staff",
          {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }
        );
      })
      .then(function (response) {
        if (response.status === 401) {
          setOwnerBackendToken("");
          openOwnerBackendAuthModal(function () { ownerStoreStaffForm.requestSubmit(); });
          return null;
        }
        if (!response.ok) {
          throw new Error("save-failed");
        }
        return response.json();
      })
      .then(function (result) {
        if (result === null) {
          return;
        }
        closeOwnerStoreStaffForm();
        loadOwnerStoreStaff();
      })
      .catch(function () {
        if (ownerStoreStaffFeedback) {
          ownerStoreStaffFeedback.textContent = "تعذر التسجيل. عاود حاول.";
          ownerStoreStaffFeedback.classList.add("is-error");
        }
      });
  });
}

function openOwnerStoreCouponForm(coupon) {
  if (!ownerStoreCouponForm) {
    return;
  }

  ownerStoreCouponForm.classList.remove("hidden");
  if (ownerStoreCouponFeedback) {
    ownerStoreCouponFeedback.textContent = "";
    ownerStoreCouponFeedback.classList.remove("is-error");
  }

  if (coupon) {
    ownerStoreEditingCouponId = coupon.id;
    ownerStoreCouponId.value = coupon.id;
    ownerStoreCouponCode.value = coupon.code;
    ownerStoreCouponType.value = coupon.discount_type;
    ownerStoreCouponValue.value = coupon.discount_value;
    ownerStoreCouponMaxUses.value = coupon.max_uses;
    ownerStoreCouponActive.checked = Boolean(coupon.active);
  } else {
    ownerStoreEditingCouponId = null;
    ownerStoreCouponForm.reset();
    ownerStoreCouponId.value = "";
    ownerStoreCouponMaxUses.value = "0";
    ownerStoreCouponActive.checked = true;
  }
}

function closeOwnerStoreCouponForm() {
  if (!ownerStoreCouponForm) {
    return;
  }

  ownerStoreCouponForm.classList.add("hidden");
  ownerStoreCouponForm.reset();
  ownerStoreEditingCouponId = null;
}

if (ownerStoreAddCouponToggle) {
  ownerStoreAddCouponToggle.addEventListener("click", function () {
    openOwnerStoreCouponForm(null);
  });
}

if (ownerStoreCouponCancel) {
  ownerStoreCouponCancel.addEventListener("click", closeOwnerStoreCouponForm);
}

function formatOwnerCouponDiscount(coupon) {
  return coupon.discount_type === "percent"
    ? Number(coupon.discount_value) + "%"
    : formatOwnerAmount(Number(coupon.discount_value));
}

function renderOwnerStoreCoupons(coupons) {
  if (!ownerStoreCouponsList) {
    return;
  }

  ownerStoreCouponsList.innerHTML = "";

  if (!coupons.length) {
    ownerStoreCouponsList.innerHTML = '<p class="owner-bi-empty">ماكاين حتى كوبون بعد.</p>';
    return;
  }

  coupons.forEach(function (coupon) {
    const row = document.createElement("div");
    row.className = "owner-cost-row";

    const label = document.createElement("span");
    const usesText = coupon.max_uses > 0 ? (coupon.used_count + "/" + coupon.max_uses) : (coupon.used_count + "/∞");
    label.textContent =
      coupon.code + " — " + formatOwnerCouponDiscount(coupon) +
      " — " + (coupon.active ? "فعال" : "موقف") + " — " + usesText;

    const actions = document.createElement("div");
    actions.className = "owner-store-item-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "manager-btn manager-btn-muted";
    editButton.textContent = "تعديل";
    editButton.addEventListener("click", function () {
      openOwnerStoreCouponForm(coupon);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "manager-btn manager-btn-muted";
    deleteButton.textContent = "مسح";
    deleteButton.addEventListener("click", function () {
      deleteOwnerStoreCoupon(coupon.id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    row.appendChild(label);
    row.appendChild(actions);
    ownerStoreCouponsList.appendChild(row);
  });
}

function loadOwnerStoreCoupons() {
  if (!ownerStoreCouponsList) {
    return;
  }

  ownerAuthorizedFetch("/admin/coupons")
    .then(function (response) {
      if (response.status === 401) {
        setOwnerBackendToken("");
        openOwnerBackendAuthModal(loadOwnerStoreCoupons);
        return null;
      }
      if (!response.ok) {
        throw new Error("failed");
      }
      return response.json();
    })
    .then(function (coupons) {
      if (coupons === null) {
        return;
      }
      renderOwnerStoreCoupons(coupons);
    })
    .catch(function () {
      ownerStoreCouponsList.innerHTML = '<p class="owner-bi-empty">تعذر تحميل الكوبونات.</p>';
    });
}

function deleteOwnerStoreCoupon(couponId) {
  if (!window.confirm("واش متأكد بغيتي تمسح هاد الكوبون؟")) {
    return;
  }

  ownerAuthorizedFetch("/admin/coupons/" + couponId, { method: "DELETE" })
    .then(function (response) {
      if (response.status === 401) {
        setOwnerBackendToken("");
        openOwnerBackendAuthModal(function () { deleteOwnerStoreCoupon(couponId); });
        return;
      }
      if (!response.ok) {
        throw new Error("delete-failed");
      }
      loadOwnerStoreCoupons();
    })
    .catch(function () {
      alert("تعذر مسح الكوبون.");
    });
}

if (ownerStoreCouponForm) {
  ownerStoreCouponForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (ownerStoreCouponFeedback) {
      ownerStoreCouponFeedback.textContent = "كنسجل...";
      ownerStoreCouponFeedback.classList.remove("is-error");
    }

    const payload = {
      code: ownerStoreCouponCode.value.trim(),
      discount_type: ownerStoreCouponType.value,
      discount_value: Number(ownerStoreCouponValue.value),
      active: Boolean(ownerStoreCouponActive.checked),
      max_uses: Number(ownerStoreCouponMaxUses.value || 0)
    };

    const isEdit = Boolean(ownerStoreEditingCouponId);
    ownerAuthorizedFetch(
      isEdit ? "/admin/coupons/" + ownerStoreEditingCouponId : "/admin/coupons",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    )
      .then(function (response) {
        if (response.status === 401) {
          setOwnerBackendToken("");
          openOwnerBackendAuthModal(function () { ownerStoreCouponForm.requestSubmit(); });
          return null;
        }
        if (!response.ok) {
          return response.json().then(function (errorBody) {
            throw new Error(errorBody?.detail || "save-failed");
          });
        }
        return response.json();
      })
      .then(function (result) {
        if (result === null) {
          return;
        }
        closeOwnerStoreCouponForm();
        loadOwnerStoreCoupons();
      })
      .catch(function (error) {
        if (ownerStoreCouponFeedback) {
          ownerStoreCouponFeedback.textContent = error?.message && error.message !== "save-failed"
            ? error.message
            : "تعذر التسجيل. عاود حاول.";
          ownerStoreCouponFeedback.classList.add("is-error");
        }
      });
  });
}

function openOwnerStoreModal() {
  if (!ownerStoreModal) {
    return;
  }

  ownerStoreModal.classList.remove("hidden");
  loadOwnerStoreProducts();
  loadOwnerStoreServices();
  loadOwnerStorePackages();
  loadOwnerStoreStaff();
}

function openOwnerStoreProductFormPrefilled(name, sellingPrice) {
  openOwnerStoreModal();
  setOwnerStoreTab("products");
  openOwnerStoreProductForm(null);

  if (ownerStoreProductName) {
    ownerStoreProductName.value = name || "";
  }
  if (ownerStoreProductPrice1 && Number(sellingPrice) > 0) {
    ownerStoreProductPrice1.value = sellingPrice;
  }
  if (ownerStoreProductFeedback) {
    ownerStoreProductFeedback.textContent = "زيد التصويرة والوصف باش المنتوج ينشر فالستور.";
  }
}

function closeOwnerStoreModal() {
  if (ownerStoreModal) {
    ownerStoreModal.classList.add("hidden");
  }
}

if (ownerStoreCloseButton) {
  ownerStoreCloseButton.addEventListener("click", closeOwnerStoreModal);
}

if (ownerStoreCloseIconButton) {
  ownerStoreCloseIconButton.addEventListener("click", closeOwnerStoreModal);
}

if (ownerStoreModal) {
  ownerStoreModal.addEventListener("click", function (event) {
    if (event.target === ownerStoreModal) {
      closeOwnerStoreModal();
    }
  });
}

const ownerActionBookingsButton = document.getElementById("owner-action-bookings");
if (ownerActionBookingsButton) {
  ownerActionBookingsButton.addEventListener("click", function () {
    ensureOwnerBackendAuth(openOwnerBookingsModal);
  });
}

const ownerActionStoreButton = document.getElementById("owner-action-store");
if (ownerActionStoreButton) {
  ownerActionStoreButton.addEventListener("click", openOwnerStoreModal);
}

function ensureOwnerTaxBrackets() {
  if (!ownerSharedData.taxBrackets || typeof ownerSharedData.taxBrackets !== "object") {
    ownerSharedData.taxBrackets = { service: [], product: [] };
  }
  if (!Array.isArray(ownerSharedData.taxBrackets.service)) {
    ownerSharedData.taxBrackets.service = [];
  }
  if (!Array.isArray(ownerSharedData.taxBrackets.product)) {
    ownerSharedData.taxBrackets.product = [];
  }
  return ownerSharedData.taxBrackets;
}

function renderOwnerTaxBracketList(listElement, brackets, category) {
  listElement.innerHTML = "";

  if (brackets.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "ماكاين حتى مستوى محدد.";
    listElement.appendChild(empty);
    return;
  }

  brackets
    .slice()
    .sort(function (a, b) { return a.threshold - b.threshold; })
    .forEach(function (bracket) {
      const row = document.createElement("div");
      row.className = "owner-cost-row";

      const label = document.createElement("span");
      label.textContent = "بداية من " + formatOwnerAmount(bracket.threshold) + " → -" + formatOwnerAmount(bracket.amount);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "owner-task-remove";
      removeButton.textContent = "✕";
      removeButton.setAttribute("aria-label", "مسح هاد المستوى");
      removeButton.addEventListener("click", function () {
        const brackets = ensureOwnerTaxBrackets()[category];
        const index = brackets.findIndex(function (item) {
          return item.threshold === bracket.threshold && item.amount === bracket.amount;
        });
        if (index !== -1) {
          brackets.splice(index, 1);
        }
        saveOwnerProductsData();
        renderOwnerTaxBrackets();
      });

      row.appendChild(label);
      row.appendChild(removeButton);
      listElement.appendChild(row);
    });
}

function renderOwnerTaxBrackets() {
  const brackets = ensureOwnerTaxBrackets();
  if (ownerTaxServiceList) {
    renderOwnerTaxBracketList(ownerTaxServiceList, brackets.service, "service");
  }
  if (ownerTaxProductList) {
    renderOwnerTaxBracketList(ownerTaxProductList, brackets.product, "product");
  }
}

function addOwnerTaxBracket(category, thresholdInput, amountInput) {
  const threshold = Number(thresholdInput.value);
  const amount = Number(amountInput.value);

  if (!Number.isFinite(threshold) || threshold < 0 || !Number.isFinite(amount) || amount < 0) {
    return;
  }

  ensureOwnerTaxBrackets()[category].push({ threshold: threshold, amount: amount });
  saveOwnerProductsData();
  thresholdInput.value = "";
  amountInput.value = "";
  renderOwnerTaxBrackets();
}

if (ownerTaxServiceAddButton) {
  ownerTaxServiceAddButton.addEventListener("click", function () {
    addOwnerTaxBracket("service", ownerTaxServiceThreshold, ownerTaxServiceAmount);
  });
}

if (ownerTaxProductAddButton) {
  ownerTaxProductAddButton.addEventListener("click", function () {
    addOwnerTaxBracket("product", ownerTaxProductThreshold, ownerTaxProductAmount);
  });
}

if (ownerNetCreditInput) {
  ownerNetCreditInput.addEventListener("change", function () {
    setOwnerCreditAmount(ownerNetCreditInput.value);
    renderOwnerNetOverview();
  });
}

if (ownerCleanlinessTaxInput) {
  ownerCleanlinessTaxInput.addEventListener("change", function () {
    setOwnerCleanlinessTaxAmount(ownerCleanlinessTaxInput.value);
    renderOwnerNetOverview();
  });
}

const ownerActionEmployeesButton = document.getElementById("owner-action-employees");
if (ownerActionEmployeesButton) {
  ownerActionEmployeesButton.addEventListener("click", function () {
    window.open("manager-dashboard.html", "_blank");
  });
}

const ownerActionTasksButton = document.getElementById("owner-action-tasks");
if (ownerActionTasksButton) {
  ownerActionTasksButton.addEventListener("click", openOwnerTasksModal);
}

const ownerActionSaleProductsButton = document.getElementById("owner-action-sale-products");
if (ownerActionSaleProductsButton) {
  ownerActionSaleProductsButton.addEventListener("click", openOwnerProductsPopupModal);
}

const ownerActionTargetsButton = document.getElementById("owner-action-targets");
if (ownerActionTargetsButton) {
  ownerActionTargetsButton.addEventListener("click", openOwnerTargetModal);
}

ownerNetOverviewPeriodButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    setOwnerNetOverviewPeriod(button.dataset.period || "day");
  });
});

function bindOwnerNetBoxOpener(box, kind) {
  if (!box) {
    return;
  }

  box.addEventListener("click", function () {
    openOwnerNetBreakdownModal(kind);
  });

  box.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openOwnerNetBreakdownModal(kind);
    }
  });
}

bindOwnerNetBoxOpener(ownerNetCaServicesBox, "services");
bindOwnerNetBoxOpener(ownerNetCaProductsBox, "products");

if (ownerNetBreakdownCloseButton) {
  ownerNetBreakdownCloseButton.addEventListener("click", closeOwnerNetBreakdownModal);
}

if (ownerNetBreakdownCloseIconButton) {
  ownerNetBreakdownCloseIconButton.addEventListener("click", closeOwnerNetBreakdownModal);
}

if (ownerNetBreakdownModal) {
  ownerNetBreakdownModal.addEventListener("click", function (event) {
    if (event.target === ownerNetBreakdownModal) {
      closeOwnerNetBreakdownModal();
    }
  });
}

renderOwnerDashboard("day");
mountOwnerSectionsInPopup();
setOwnerCompactView("overview", { openPopup: false });
closeOwnerSectionsModal();
syncOwnerReferenceDateInput();
renderOwnerLastSavedIndicator();
window.scrollTo(0, 0);
openOwnerBriefingModal();
