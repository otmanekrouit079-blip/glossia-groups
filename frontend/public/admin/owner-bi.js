(function () {
  const ownerBiNav = document.getElementById("owner-bi-nav");
  const ownerBiTitle = document.getElementById("owner-bi-details-title");
  const ownerBiRangeButtons = document.querySelectorAll(".owner-bi-range-btn");
  const ownerBiCustomRange = document.getElementById("owner-bi-custom-range");
  const ownerBiStartDate = document.getElementById("owner-bi-start-date");
  const ownerBiEndDate = document.getElementById("owner-bi-end-date");
  const ownerBiApplyRange = document.getElementById("owner-bi-apply-range");
  const ownerBiTotalRevenue = document.getElementById("owner-bi-total-revenue");
  const ownerBiChart = document.getElementById("owner-bi-chart");
  const ownerBiRankingWrap = document.getElementById("owner-bi-ranking-wrap");
  const ownerBiRanking = document.getElementById("owner-bi-ranking");
  const ownerBiEmployeeSales = document.getElementById("owner-bi-employee-sales");
  const ownerBiEmployeeSalesList = document.getElementById("owner-bi-employee-sales-list");
  const ownerBiTaskStats = document.getElementById("owner-bi-task-stats");
  const ownerBiStockThresholds = document.getElementById("owner-bi-stock-thresholds");
  const ownerBiRecordsWrap = document.getElementById("owner-bi-records-wrap");
  const ownerBiRecordsTitle = document.getElementById("owner-bi-records-title");
  const ownerBiRecords = document.getElementById("owner-bi-records");

  const ownerNavServicesValue = document.getElementById("owner-bi-nav-services-value");
  const ownerNavProductsValue = document.getElementById("owner-bi-nav-products-value");
  const ownerNavTasksValue = document.getElementById("owner-bi-nav-tasks-value");
  const ownerNavHoursValue = document.getElementById("owner-bi-nav-hours-value");
  const ownerNavConsumedValue = document.getElementById("owner-bi-nav-consumed-value");
  const ownerNavRuptureValue = document.getElementById("owner-bi-nav-rupture-value");
  const ownerRuptureBadge = document.getElementById("owner-bi-rupture-badge");

  const ownerAccountingPeriodButtons = document.querySelectorAll(".owner-accounting-period-btn");
  const ownerFixedCostsList = document.getElementById("owner-fixed-costs-list");
  const ownerVariableCostsList = document.getElementById("owner-variable-costs-list");
  const ownerProductsList = document.getElementById("owner-products-list");
  const ownerSalariesList = document.getElementById("owner-salaries-list");
  const ownerTaxesList = document.getElementById("owner-taxes-list");
  const ownerVariableCostsBreakdown = document.getElementById("owner-variable-costs-breakdown");
  const ownerTaxPeriodCaption = document.getElementById("owner-tax-period-caption");
  const ownerAddFixedCost = document.getElementById("owner-add-fixed-cost");
  const ownerAddVariableCost = document.getElementById("owner-add-variable-cost");
  const ownerAddProduct = document.getElementById("owner-add-product");
  const ownerAccountingRevenue = document.getElementById("owner-accounting-revenue");
  const ownerAccountingExpenses = document.getElementById("owner-accounting-expenses");
  const ownerAccountingProfit = document.getElementById("owner-accounting-profit");

  if (!ownerBiNav || !ownerAccountingRevenue) {
    return;
  }

  const biState = {
    activeView: "services",
    rangeMode: "day",
    customStart: "",
    customEnd: "",
    selectedEmployeeId: null,
    accountingPeriod: "day"
  };

  function formatMoneyDh(amount) {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0) + " DH";
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

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  function endOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  }

  function isoDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function loadOwnerData() {
    const parsed = window.SalonStorage ? window.SalonStorage.loadData() : null;
    if (!parsed || typeof parsed !== "object") {
      return {
        employees: [],
        employeeData: {},
        ownerCampaignTarget: {},
        ownerDailyTaxDh: 0,
        productSales: [],
        ownerProducts: [],
        ownerTaxRates: {},
        inventoryProducts: [],
        fixedCosts: [],
        variableCosts: [],
        employeeSalaries: {}
      };
    }

      if (!Array.isArray(parsed.inventoryProducts) || parsed.inventoryProducts.length === 0) {
        parsed.inventoryProducts = [
          { id: 1, name: "Shampooing", stock: 12, threshold: 5, consumedToday: 2 },
          { id: 2, name: "Gel coiffant", stock: 4, threshold: 5, consumedToday: 1 },
          { id: 3, name: "Crème soin", stock: 8, threshold: 3, consumedToday: 1 }
        ];
      }

      if (!Array.isArray(parsed.productSales)) {
        parsed.productSales = [];
      }

      if (!Array.isArray(parsed.ownerProducts)) {
        parsed.ownerProducts = [];
      }

      parsed.ownerProducts = parsed.ownerProducts.map(function (product, index) {
        const purchasePrice = Number(product?.purchasePrice || product?.costPrice || 0);
        const sellingPrice = Number(product?.sellingPrice || 0);
        const employeeProfit = Number(product?.employeeProfit || product?.profitMargin || 0);
        return {
          id: Number(product?.id || (Date.now() + index)),
          name: String(product?.name || "Produit"),
          purchasePrice: Number.isFinite(purchasePrice) && purchasePrice >= 0 ? purchasePrice : 0,
          sellingPrice: Number.isFinite(sellingPrice) && sellingPrice >= 0 ? sellingPrice : 0,
          employeeProfit: Number.isFinite(employeeProfit) && employeeProfit >= 0 ? employeeProfit : 0
        };
      });

      if (!Number.isFinite(Number(parsed.ownerDailyTaxDh)) || Number(parsed.ownerDailyTaxDh) < 0) {
        parsed.ownerDailyTaxDh = 0;
      }

      if (!parsed.ownerTaxRates || typeof parsed.ownerTaxRates !== "object") {
        parsed.ownerTaxRates = {};
      }

      if (!Array.isArray(parsed.fixedCosts)) {
        parsed.fixedCosts = [
          { id: Date.now() + 1, label: "Loyer", monthlyAmount: 0 },
          { id: Date.now() + 2, label: "Électricité", monthlyAmount: 0 }
        ];
      }

      if (!Array.isArray(parsed.variableCosts)) {
        parsed.variableCosts = [
          { id: Date.now() + 3, label: "Achat produits", monthlyAmount: 0 },
          { id: Date.now() + 4, label: "Maintenance", monthlyAmount: 0 }
        ];
      }

      if (!parsed.employeeSalaries || typeof parsed.employeeSalaries !== "object") {
        parsed.employeeSalaries = {};
      }

      const employees = Array.isArray(parsed.employees) ? parsed.employees : [];
      employees.forEach(function (employee) {
        if (typeof parsed.employeeSalaries[employee.id] !== "number") {
          parsed.employeeSalaries[employee.id] = 0;
        }

        if (typeof parsed.ownerTaxRates[employee.id] !== "number") {
          parsed.ownerTaxRates[employee.id] = 0;
        }
      });

    return parsed;
  }

  function saveOwnerData(data) {
    if (window.SalonStorage) {
      window.SalonStorage.saveData(data);
    }
  }

  function getEmployeeState(data, employeeId) {
    return data.employeeData?.[employeeId] || {
      salesHistory: [],
      tasks: [],
      scheduleByDate: {}
    };
  }

  function getServiceSalesRecords(data) {
    const employees = Array.isArray(data.employees) ? data.employees : [];
    const records = [];

    employees.forEach(function (employee) {
      const state = getEmployeeState(data, employee.id);
      (state.salesHistory || []).forEach(function (entry) {
        records.push({
          employeeId: employee.id,
          employeeName: employee.name,
          label: String(entry.serviceName || entry.label || "Service"),
          amount: Number(entry.amount || 0),
          dateISO: entry.dateISO,
          kind: "service"
        });
      });
    });

    return records;
  }

  function getProductSalesRecords(data) {
    const employees = Array.isArray(data.employees) ? data.employees : [];
    return (data.productSales || []).map(function (entry) {
      const employee = employees.find(function (item) { return item.id === entry.employeeId; });
      return {
        employeeId: entry.employeeId,
        employeeName: employee ? employee.name : "Non assigné",
        label: entry.label || "Produit",
        amount: Number(entry.amount || 0),
        dateISO: entry.dateISO,
        kind: "product"
      };
    });
  }

  function getAllSalesRecords(data) {
    return getServiceSalesRecords(data).concat(getProductSalesRecords(data));
  }

  function getProductMarginBySale(data, sale) {
    const configuredProducts = Array.isArray(data.ownerProducts) ? data.ownerProducts : [];
    const byId = configuredProducts.find(function (product) {
      return Number(product.id) === Number(sale.productId);
    });
    if (byId && Number.isFinite(Number(byId.employeeProfit))) {
      return Number(byId.employeeProfit);
    }

    const saleLabel = String(sale.label || "").trim().toLowerCase();
    const byName = configuredProducts.find(function (product) {
      return String(product.name || "").trim().toLowerCase() === saleLabel;
    });
    if (byName && Number.isFinite(Number(byName.employeeProfit))) {
      return Number(byName.employeeProfit);
    }

    const unitMargin = Number(sale.unitMargin || 0);
    return Number.isFinite(unitMargin) && unitMargin >= 0 ? unitMargin : 0;
  }

  function clampCurrency(value) {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue)) {
      return 0;
    }

      return Math.max(0, numericValue);
  }

  function parseMoneyInput(value) {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }

    const raw = String(value || "").trim().toLowerCase();
    if (!raw) {
      return 0;
    }

    const normalized = raw
      .replace(/dh/g, "")
      .replace(/\s+/g, "")
      .replace(/,/g, ".")
      .replace(/[^0-9.-]/g, "");

    const parsed = Number(normalized);
    if (!Number.isFinite(parsed)) {
      return 0;
    }

    return parsed;
  }

  function getPeriodLabel(period) {
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

    if (period === "year") {
      return "Année";
    }

    return "Personnalisée";
  }

  function getDayCountForAccountingPeriod(period, bounds) {
    if (!bounds) {
      return 0;
    }

    if (period === "day") {
      return 1;
    }

    if (period === "week") {
      return 7;
    }

    if (period === "month") {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    }

    if (period === "quarter") {
      const now = new Date();
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      return new Date(now.getFullYear(), quarterStartMonth + 1, 0).getDate() +
        new Date(now.getFullYear(), quarterStartMonth + 2, 0).getDate() +
        new Date(now.getFullYear(), quarterStartMonth + 3, 0).getDate();
    }

    if (period === "year") {
      const now = new Date();
      const year = now.getFullYear();
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      return isLeap ? 366 : 365;
    }

    const dayMs = 24 * 60 * 60 * 1000;
    const start = startOfDay(bounds.start);
    const end = endOfDay(bounds.end);
    return Math.max(1, Math.floor((end.getTime() - start.getTime()) / dayMs) + 1);
  }

  function getCompensationByEmployee(data, bounds, period) {
    const employees = Array.isArray(data.employees) ? data.employees : [];
    const compensationMap = {};

    employees.forEach(function (employee) {
      compensationMap[employee.id] = {
        employeeId: employee.id,
        employeeName: employee.name,
        serviceSales: 0,
        serviceShare: 0,
        productProfit: 0,
        grossCompensation: 0,
        taxAmount: 0,
        netCompensation: 0
      };
    });

    employees.forEach(function (employee) {
      const state = getEmployeeState(data, employee.id);
      const filteredServiceSales = filterRecordsByBounds((state.salesHistory || []).map(function (sale) {
        return {
          amount: Number(sale.amount || 0),
          dateISO: sale.dateISO
        };
      }), bounds);

      const serviceSalesTotal = filteredServiceSales.reduce(function (total, sale) {
        return total + Number(sale.amount || 0);
      }, 0);

      compensationMap[employee.id].serviceSales = serviceSalesTotal;
      compensationMap[employee.id].serviceShare = serviceSalesTotal * 0.5;
    });

    (data.productSales || []).forEach(function (sale) {
      if (!bounds) {
        return;
      }

      const saleDate = new Date(sale.dateISO);
      if (saleDate < bounds.start || saleDate > bounds.end) {
        return;
      }

      const employeeEntry = compensationMap[sale.employeeId];
      if (!employeeEntry) {
        return;
      }

      const quantity = Math.max(1, Math.round(Number(sale.quantity || 1)));
      const margin = getProductMarginBySale(data, sale);
      employeeEntry.productProfit += margin * quantity;
    });

    Object.values(compensationMap).forEach(function (entry) {
      entry.grossCompensation = entry.serviceShare + entry.productProfit;
      entry.taxAmount = 0;
      entry.netCompensation = entry.grossCompensation;
    });

    return compensationMap;
  }

  function getBoundsForRange(mode, customStart, customEnd) {
    const now = new Date();

    if (mode === "hour") {
      const start = new Date(now.getTime() - 60 * 60 * 1000);
      return { start: start, end: now };
    }

    if (mode === "day") {
      return { start: startOfDay(now), end: now };
    }

    if (mode === "week") {
      const start = startOfDay(now);
      const weekday = start.getDay();
      const daysSinceMonday = weekday === 0 ? 6 : weekday - 1;
      start.setDate(start.getDate() - daysSinceMonday);
      return { start: start, end: now };
    }

    if (mode === "month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      return { start: start, end: now };
    }

    if (mode === "quarter") {
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      const start = new Date(now.getFullYear(), quarterStartMonth, 1, 0, 0, 0, 0);
      return { start: start, end: now };
    }

    if (mode === "year") {
      const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      return { start: start, end: now };
    }

    if (mode === "custom") {
      if (!customStart || !customEnd) {
        return null;
      }

      const start = new Date(customStart + "T00:00:00");
      const end = new Date(customEnd + "T23:59:59");
      if (end < start) {
        return null;
      }

      return { start: start, end: end };
    }

    return { start: startOfDay(now), end: now };
  }

  function filterRecordsByBounds(records, bounds) {
    if (!bounds) {
      return [];
    }

    return records.filter(function (record) {
      const recordDate = new Date(record.dateISO);
      return recordDate >= bounds.start && recordDate <= bounds.end;
    });
  }

  function sumAmounts(records) {
    return records.reduce(function (total, entry) {
      return total + Number(entry.amount || 0);
    }, 0);
  }

  function getCompletionRateForRange(data, bounds) {
    const employees = Array.isArray(data.employees) ? data.employees : [];
    let total = 0;
    let done = 0;

    employees.forEach(function (employee) {
      const state = getEmployeeState(data, employee.id);
      (state.tasks || []).forEach(function (task) {
        total += 1;
        if (!task.done || !task.completedAtISO) {
          return;
        }

        const completionDate = new Date(task.completedAtISO);
        if (completionDate >= bounds.start && completionDate <= bounds.end) {
          done += 1;
        }
      });
    });

    if (total === 0) {
      return 0;
    }

    return (done / total) * 100;
  }

  function getHoursCompliance(data) {
    const employees = Array.isArray(data.employees) ? data.employees : [];
    const todayKey = isoDateKey(new Date());
    let compliant = 0;

    employees.forEach(function (employee) {
      const state = getEmployeeState(data, employee.id);
      const schedule = state.scheduleByDate?.[todayKey];
      if (schedule?.calculation?.meetsTarget) {
        compliant += 1;
      }
    });

    return {
      compliant: compliant,
      total: employees.length
    };
  }

  function renderBiNavCards(data) {
    const dayBounds = getBoundsForRange("day");
    const serviceSales = sumAmounts(filterRecordsByBounds(getServiceSalesRecords(data), dayBounds));
    const productSales = sumAmounts(filterRecordsByBounds(getProductSalesRecords(data), dayBounds));
    const taskRate = getCompletionRateForRange(data, dayBounds);
    const hours = getHoursCompliance(data);
    const consumed = (data.inventoryProducts || []).reduce(function (total, product) {
      return total + Number(product.consumedToday || 0);
    }, 0);
    const lowStockProducts = (data.inventoryProducts || []).filter(function (product) {
      return Number(product.stock || 0) <= Number(product.threshold || 0);
    });

    ownerNavServicesValue.textContent = formatMoneyDh(serviceSales);
    ownerNavProductsValue.textContent = formatMoneyDh(productSales);
    ownerNavTasksValue.textContent = Math.round(taskRate) + "%";
    ownerNavHoursValue.textContent = hours.compliant + " / " + hours.total;
    ownerNavConsumedValue.textContent = consumed + " unités";
    ownerNavRuptureValue.textContent = String(lowStockProducts.length);

    window.dispatchEvent(new CustomEvent("owner:operations-updated", {
      detail: {
        services: formatMoneyDh(serviceSales),
        products: formatMoneyDh(productSales),
        tasksRate: Math.round(taskRate) + "%",
        hours: hours.compliant + " / " + hours.total,
        consumed: consumed + " unités",
        ruptureCount: lowStockProducts.length
      }
    }));

    if (lowStockProducts.length > 0) {
      ownerRuptureBadge.classList.remove("hidden");
      ownerRuptureBadge.textContent = String(lowStockProducts.length);
    } else {
      ownerRuptureBadge.classList.add("hidden");
    }
  }

  function renderBarChart(records, bounds) {
    ownerBiChart.innerHTML = "";

    if (!bounds || records.length === 0) {
      ownerBiChart.innerHTML = '<p class="owner-bi-empty">Aucune donnée pour cette période.</p>';
      return;
    }

    const dayMap = {};
    records.forEach(function (record) {
      const key = isoDateKey(new Date(record.dateISO));
      dayMap[key] = (dayMap[key] || 0) + Number(record.amount || 0);
    });

    const sortedKeys = Object.keys(dayMap).sort();
    const maxAmount = sortedKeys.reduce(function (highest, key) {
      return Math.max(highest, dayMap[key]);
    }, 0);

    sortedKeys.forEach(function (key) {
      const amount = dayMap[key];
      const bar = document.createElement("div");
      const head = document.createElement("div");
      const track = document.createElement("div");
      const fill = document.createElement("div");
      const dateSpan = document.createElement("span");
      const amountSpan = document.createElement("span");

      bar.className = "owner-bi-bar";
      head.className = "owner-bi-bar-head";
      track.className = "owner-bi-bar-track";
      fill.className = "owner-bi-bar-fill";

      const displayDate = new Date(key + "T12:00:00").toLocaleDateString("fr-FR");
      dateSpan.textContent = displayDate;
      amountSpan.textContent = formatMoneyDh(amount);

      fill.style.width = (maxAmount > 0 ? (amount / maxAmount) * 100 : 0) + "%";

      head.appendChild(dateSpan);
      head.appendChild(amountSpan);
      track.appendChild(fill);
      bar.appendChild(head);
      bar.appendChild(track);
      ownerBiChart.appendChild(bar);
    });
  }

  function renderEmployeeSalesList(records) {
    ownerBiEmployeeSalesList.innerHTML = "";

    if (!records.length) {
      const item = document.createElement("li");
      item.className = "modal-list-item muted";
      item.textContent = "Aucune vente pour cet employé sur cette période.";
      ownerBiEmployeeSalesList.appendChild(item);
      return;
    }

    records
      .slice()
      .sort(function (a, b) { return new Date(b.dateISO) - new Date(a.dateISO); })
      .forEach(function (record) {
        const item = document.createElement("li");
        item.className = "modal-list-item";
        item.textContent = formatDateTime(record.dateISO) + " · " + record.label + " · " + formatMoneyDh(record.amount);
        ownerBiEmployeeSalesList.appendChild(item);
      });
  }

  function renderEmployeeRanking(records) {
    ownerBiRanking.innerHTML = "";

    const totalsByEmployee = {};
    records.forEach(function (record) {
      if (!record.employeeId) {
        return;
      }

      if (!totalsByEmployee[record.employeeId]) {
        totalsByEmployee[record.employeeId] = {
          employeeId: record.employeeId,
          employeeName: record.employeeName,
          total: 0
        };
      }

      totalsByEmployee[record.employeeId].total += Number(record.amount || 0);
    });

    const ranking = Object.values(totalsByEmployee).sort(function (a, b) {
      return b.total - a.total;
    });

    if (ranking.length === 0) {
      ownerBiRanking.innerHTML = '<p class="owner-bi-empty">Aucun classement disponible.</p>';
      ownerBiEmployeeSalesList.innerHTML = '<li class="modal-list-item muted">Aucune donnée.</li>';
      return;
    }

    if (!biState.selectedEmployeeId || !totalsByEmployee[biState.selectedEmployeeId]) {
      biState.selectedEmployeeId = ranking[0].employeeId;
    }

    ranking.forEach(function (entry, index) {
      const button = document.createElement("button");
      const left = document.createElement("strong");
      const right = document.createElement("span");

      button.type = "button";
      button.className = "owner-bi-rank-item" + (biState.selectedEmployeeId === entry.employeeId ? " active" : "");
      left.textContent = (index + 1) + ". " + entry.employeeName;
      right.textContent = formatMoneyDh(entry.total);

      button.appendChild(left);
      button.appendChild(right);
      button.addEventListener("click", function () {
        biState.selectedEmployeeId = entry.employeeId;
        renderEmployeeRanking(records);
      });
      ownerBiRanking.appendChild(button);
    });

    const selectedRecords = records.filter(function (record) {
      return record.employeeId === biState.selectedEmployeeId;
    });
    renderEmployeeSalesList(selectedRecords);
  }

  function renderStockThresholdEditor(data) {
    ownerBiStockThresholds.innerHTML = "";

    (data.inventoryProducts || []).forEach(function (product) {
      const row = document.createElement("div");
      const label = document.createElement("strong");
      const stock = document.createElement("span");
      const input = document.createElement("input");
      const button = document.createElement("button");

      row.className = "owner-bi-stock-row";
      label.textContent = product.name;
      stock.textContent = "Stock: " + Number(product.stock || 0);

      input.type = "number";
      input.min = "0";
      input.step = "1";
      input.className = "owner-target-input";
      input.value = String(Number(product.threshold || 0));

      button.type = "button";
      button.className = "manager-btn manager-btn-muted";
      button.textContent = "Enregistrer";

      button.addEventListener("click", function () {
        const nextValue = Number(input.value);
        if (!Number.isFinite(nextValue) || nextValue < 0) {
          return;
        }

        product.threshold = Math.round(nextValue);
        saveOwnerData(data);
        renderPhaseDashboards();
      });

      row.appendChild(label);
      row.appendChild(stock);
      row.appendChild(input);
      row.appendChild(button);
      ownerBiStockThresholds.appendChild(row);
    });
  }

  function renderTaskStatistics(data) {
    const dayRate = getCompletionRateForRange(data, getBoundsForRange("day"));
    const weekRate = getCompletionRateForRange(data, getBoundsForRange("week"));
    const monthRate = getCompletionRateForRange(data, getBoundsForRange("month"));

    ownerBiTaskStats.innerHTML = "";

    const stats = [
      { label: "Taux de complétion (jour)", value: Math.round(dayRate) + "%" },
      { label: "Taux de complétion (semaine)", value: Math.round(weekRate) + "%" },
      { label: "Taux de complétion (mois)", value: Math.round(monthRate) + "%" }
    ];

    stats.forEach(function (stat) {
      const row = document.createElement("div");
      const label = document.createElement("span");
      const value = document.createElement("strong");

      row.className = "owner-task-stat-row";
      label.textContent = stat.label;
      value.textContent = stat.value;

      row.appendChild(label);
      row.appendChild(value);
      ownerBiTaskStats.appendChild(row);
    });

    const employees = Array.isArray(data.employees) ? data.employees : [];
    const reliability = employees.map(function (employee) {
      const state = getEmployeeState(data, employee.id);
      const tasks = state.tasks || [];
      const done = tasks.filter(function (task) { return task.done; }).length;
      return {
        name: employee.name,
        rate: tasks.length > 0 ? (done / tasks.length) * 100 : 0,
        tasks: tasks
      };
    }).sort(function (a, b) {
      return b.rate - a.rate;
    });

    const best = reliability[0];
    const bestRow = document.createElement("div");
    bestRow.className = "owner-task-stat-row";
    bestRow.innerHTML =
      "<span>Employé le plus fiable</span><strong>" +
      (best ? best.name + " · " + Math.round(best.rate) + "%" : "Aucune donnée") +
      "</strong>";
    ownerBiTaskStats.appendChild(bestRow);

    const listTitle = document.createElement("h3");
    listTitle.textContent = "Liste complète des tâches";
    ownerBiTaskStats.appendChild(listTitle);

    employees.forEach(function (employee) {
      const state = getEmployeeState(data, employee.id);
      (state.tasks || []).forEach(function (task) {
        const item = document.createElement("div");
        item.className = "owner-task-stat-row";
        const timeText = task.completedAtISO ? formatDateTime(task.completedAtISO) : "-";
        item.innerHTML =
          "<span>" + employee.name + " · " + task.text + "</span><strong>" +
          (task.done ? "Terminé · " + timeText : "En attente") +
          "</strong>";
        ownerBiTaskStats.appendChild(item);
      });
    });
  }

  function renderRecordsTable(title, headers, rows) {
    if (!ownerBiRecordsWrap || !ownerBiRecords || !ownerBiRecordsTitle) {
      return;
    }

    ownerBiRecordsWrap.classList.remove("hidden");
    ownerBiRecordsTitle.textContent = title;

    if (!rows.length) {
      ownerBiRecords.innerHTML = '<p class="owner-bi-empty">Aucune donnée détaillée disponible.</p>';
      return;
    }

    const headHtml = headers.map(function (header) {
      return "<th>" + header + "</th>";
    }).join("");

    const bodyHtml = rows.map(function (row) {
      const columns = row.map(function (cell) {
        return "<td>" + cell + "</td>";
      }).join("");

      return "<tr>" + columns + "</tr>";
    }).join("");

    ownerBiRecords.innerHTML =
      '<div class="employee-table-wrap"><table class="employee-history-table">' +
      "<thead><tr>" + headHtml + "</tr></thead>" +
      "<tbody>" + bodyHtml + "</tbody></table></div>";
  }

  function renderSalesRecordsDetail(records, title) {
    const rows = records
      .slice()
      .sort(function (a, b) { return new Date(b.dateISO) - new Date(a.dateISO); })
      .map(function (record) {
        return [
          formatDateTime(record.dateISO),
          record.employeeName || "Non assigné",
          record.label || "-",
          formatMoneyDh(record.amount)
        ];
      });

    renderRecordsTable(title, ["Date", "Employé", "Libellé", "Montant"], rows);
  }

  function renderHoursRecordsDetail(data, bounds) {
    const employees = Array.isArray(data.employees) ? data.employees : [];
    const rows = employees.map(function (employee) {
      const state = getEmployeeState(data, employee.id);
      const entries = Object.entries(state.scheduleByDate || {}).map(function (entry) {
        return {
          dateKey: entry[0],
          schedule: entry[1]
        };
      }).filter(function (entry) {
        if (!bounds) {
          return true;
        }

        const date = new Date(entry.dateKey + "T12:00:00");
        return date >= bounds.start && date <= bounds.end;
      });

      if (entries.length === 0) {
        return [employee.name, "0", "0h00", "Aucun horaire"];
      }

      let workedMinutes = 0;
      let completeDays = 0;
      entries.forEach(function (entry) {
        const calculation = entry.schedule?.calculation;
        if (calculation?.workedMinutes != null) {
          workedMinutes += Number(calculation.workedMinutes || 0);
          completeDays += 1;
        }
      });

      return [
        employee.name,
        String(entries.length),
        Math.floor(workedMinutes / 60) + "h" + String(workedMinutes % 60).padStart(2, "0"),
        completeDays > 0 ? (completeDays + " jour(s) complet(s)") : "Pointages incomplets"
      ];
    });

    renderRecordsTable("Détail des horaires", ["Employé", "Jours pointés", "Heures cumulées", "Statut"], rows);
  }

  function renderTaskRecordsDetail(data) {
    const employees = Array.isArray(data.employees) ? data.employees : [];
    const rows = [];

    employees.forEach(function (employee) {
      const tasks = getEmployeeState(data, employee.id).tasks || [];
      tasks.forEach(function (task) {
        rows.push([
          employee.name,
          task.text,
          task.done ? "Terminée" : "En attente",
          task.completedAtISO ? formatDateTime(task.completedAtISO) : "-"
        ]);
      });
    });

    renderRecordsTable("Détail des tâches", ["Employé", "Tâche", "Statut", "Date"], rows);
  }

  function renderStockRecordsDetail(data, isRupture) {
    const products = (data.inventoryProducts || []).filter(function (product) {
      if (!isRupture) {
        return true;
      }

      return Number(product.stock || 0) <= Number(product.threshold || 0);
    });

    const rows = products.map(function (product) {
      return [
        product.name,
        String(Number(product.stock || 0)),
        String(Number(product.threshold || 0)),
        String(Number(product.consumedToday || 0)),
        Number(product.stock || 0) <= Number(product.threshold || 0) ? "À réapprovisionner" : "OK"
      ];
    });

    renderRecordsTable(
      isRupture ? "Détail produits en rupture" : "Détail produits consommés",
      ["Produit", "Stock", "Seuil", "Consommé (jour)", "Statut"],
      rows
    );
  }

  function renderBiView(data) {
    const labels = {
      services: "Services vendus",
      products: "Produits vendus",
      tasks: "Tâches",
      hours: "Horaires",
      consumed: "Produits consommés",
      rupture: "Produits en rupture"
    };

    ownerBiTitle.textContent = labels[biState.activeView] || "Analyse détaillée";

    const bounds = getBoundsForRange(biState.rangeMode, biState.customStart, biState.customEnd);
    ownerBiStockThresholds.classList.add("hidden");
    ownerBiTaskStats.classList.add("hidden");
    ownerBiRankingWrap.classList.remove("hidden");
    ownerBiEmployeeSales.classList.remove("hidden");
    if (ownerBiRecordsWrap) {
      ownerBiRecordsWrap.classList.remove("hidden");
    }

    if (biState.activeView === "tasks") {
      ownerBiTotalRevenue.textContent = "-";
      ownerBiChart.innerHTML = "<p class='owner-bi-empty'>Vue analytique des tâches.</p>";
      ownerBiRankingWrap.classList.add("hidden");
      ownerBiEmployeeSales.classList.add("hidden");
      ownerBiTaskStats.classList.remove("hidden");
      renderTaskStatistics(data);
      renderTaskRecordsDetail(data);
      return;
    }

    if (biState.activeView === "hours") {
      const hours = getHoursCompliance(data);
      ownerBiTotalRevenue.textContent = hours.compliant + " / " + hours.total;
      ownerBiChart.innerHTML = "<p class='owner-bi-empty'>Heures conformes à 12h aujourd'hui.</p>";
      ownerBiRankingWrap.classList.add("hidden");
      ownerBiEmployeeSales.classList.add("hidden");
      renderHoursRecordsDetail(data, bounds);
      return;
    }

    if (biState.activeView === "consumed" || biState.activeView === "rupture") {
      const consumed = (data.inventoryProducts || []).reduce(function (total, product) {
        return total + Number(product.consumedToday || 0);
      }, 0);
      ownerBiTotalRevenue.textContent = consumed + " unités";
      ownerBiChart.innerHTML = "<p class='owner-bi-empty'>Suivi des stocks et seuils d'alerte.</p>";
      ownerBiRankingWrap.classList.add("hidden");
      ownerBiEmployeeSales.classList.add("hidden");
      ownerBiStockThresholds.classList.remove("hidden");
      renderStockThresholdEditor(data);
      renderStockRecordsDetail(data, biState.activeView === "rupture");
      return;
    }

    const records = biState.activeView === "products"
      ? getProductSalesRecords(data)
      : getServiceSalesRecords(data);
    const filtered = filterRecordsByBounds(records, bounds);

    ownerBiTotalRevenue.textContent = formatMoneyDh(sumAmounts(filtered));
    renderBarChart(filtered, bounds);
    renderEmployeeRanking(filtered);
    renderSalesRecordsDetail(
      filtered,
      biState.activeView === "products" ? "Détail des produits vendus" : "Détail des services vendus"
    );
  }

  function renderCostRows(costs, container, onChange) {
    container.innerHTML = "";

    costs.forEach(function (cost) {
      const row = document.createElement("div");
      const label = document.createElement("input");
      const amount = document.createElement("input");
      const remove = document.createElement("button");

      row.className = "owner-cost-row";

      label.type = "text";
      label.className = "owner-target-input";
      label.value = cost.label || "";

      amount.type = "text";
      amount.className = "owner-target-input";
      amount.value = String(Number(cost.monthlyAmount || 0));
      amount.placeholder = "Ex: 4000 DH";

      remove.type = "button";
      remove.className = "manager-btn manager-btn-muted";
      remove.textContent = "Supprimer";

      label.addEventListener("change", function () {
        cost.label = label.value.trim() || "Charge";
        onChange();
      });

      function applyCostAmountFromInput() {
        const next = parseMoneyInput(amount.value);
        cost.monthlyAmount = next >= 0 ? next : 0;
        onChange();
      }

      amount.addEventListener("change", applyCostAmountFromInput);

      remove.addEventListener("click", function () {
        const index = costs.indexOf(cost);
        if (index >= 0) {
          costs.splice(index, 1);
          onChange();
        }
      });

      row.appendChild(label);
      row.appendChild(amount);
      row.appendChild(remove);
      container.appendChild(row);
    });
  }

  function getProductCostByName(data, productName) {
    const targetName = String(productName || "").trim().toLowerCase();
    if (!targetName) {
      return 0;
    }

    const match = (data.ownerProducts || []).find(function (product) {
      return String(product.name || "").trim().toLowerCase() === targetName;
    });

    if (!match) {
      return 0;
    }

    return Math.max(0, Number(match.purchasePrice || 0));
  }

  function getConsumedProductsAutoCost(data, period) {
    const periodBounds = getBoundsForRange(period);
    const periodDays = getDayCountForAccountingPeriod(period, periodBounds);

    const dailyCost = (data.inventoryProducts || []).reduce(function (total, product) {
      const consumedQty = Math.max(0, Number(product.consumedToday || 0));
      const purchaseCost = getProductCostByName(data, product.name);
      return total + (consumedQty * purchaseCost);
    }, 0);

    return dailyCost * periodDays;
  }

  function renderProductRows(data) {
    if (!ownerProductsList) {
      return;
    }

    ownerProductsList.innerHTML = "";
    const products = Array.isArray(data.ownerProducts) ? data.ownerProducts : [];

    if (products.length === 0) {
      ownerProductsList.innerHTML = '<p class="owner-bi-empty">Aucun produit configuré.</p>';
      return;
    }

    const tableWrap = document.createElement("div");
    tableWrap.className = "employee-table-wrap";

    const table = document.createElement("table");
    table.className = "employee-history-table owner-products-table";
    table.innerHTML =
      "<thead><tr>" +
      "<th>Produit</th>" +
      "<th>Prix d'achat</th>" +
      "<th>Prix de vente</th>" +
      "<th>Bénéfice employé</th>" +
      "<th>Bénéfice net Glossia</th>" +
      "<th>Action</th>" +
      "</tr></thead>";

    const body = document.createElement("tbody");

    products.forEach(function (product) {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      const purchaseCell = document.createElement("td");
      const sellingCell = document.createElement("td");
      const employeeCell = document.createElement("td");
      const glossiaCell = document.createElement("td");
      const actionCell = document.createElement("td");

      const nameInput = document.createElement("input");
      const purchaseInput = document.createElement("input");
      const sellingInput = document.createElement("input");
      const employeeProfitInput = document.createElement("input");
      const glossiaStrong = document.createElement("strong");
      const removeButton = document.createElement("button");

      nameInput.type = "text";
      nameInput.className = "owner-target-input";
      nameInput.value = String(product.name || "");
      nameInput.placeholder = "Nom produit";

      purchaseInput.type = "number";
      purchaseInput.min = "0";
      purchaseInput.step = "0.01";
      purchaseInput.className = "owner-target-input";
      purchaseInput.value = String(Number(product.purchasePrice || 0));
      purchaseInput.placeholder = "Prix achat (DH)";

      sellingInput.type = "number";
      sellingInput.min = "0";
      sellingInput.step = "0.01";
      sellingInput.className = "owner-target-input";
      sellingInput.value = String(Number(product.sellingPrice || 0));
      sellingInput.placeholder = "Prix vente (DH)";

      employeeProfitInput.type = "number";
      employeeProfitInput.min = "0";
      employeeProfitInput.step = "0.01";
      employeeProfitInput.className = "owner-target-input";
      employeeProfitInput.value = String(Number(product.employeeProfit || 0));
      employeeProfitInput.placeholder = "Bénéfice employé (DH)";

      removeButton.type = "button";
      removeButton.className = "manager-btn manager-btn-muted";
      removeButton.textContent = "Supprimer";

      function refreshGlossiaNet() {
        const purchasePrice = Number(product.purchasePrice || 0);
        const sellingPrice = Number(product.sellingPrice || 0);
        const employeeProfit = Number(product.employeeProfit || 0);
        const glossiaNet = (sellingPrice - purchasePrice) - employeeProfit;

        glossiaStrong.textContent = formatMoneyDh(glossiaNet);
        glossiaStrong.className = glossiaNet >= 0 ? "profit-positive" : "profit-negative";
      }

      nameInput.addEventListener("change", function () {
        product.name = nameInput.value.trim() || "Produit";
        saveOwnerData(data);
        renderAccountingSection();
      });

      purchaseInput.addEventListener("change", function () {
        const next = Number(purchaseInput.value);
        product.purchasePrice = Number.isFinite(next) && next >= 0 ? next : 0;
        saveOwnerData(data);
        renderAccountingSection();
      });

      sellingInput.addEventListener("change", function () {
        const next = Number(sellingInput.value);
        product.sellingPrice = Number.isFinite(next) && next >= 0 ? next : 0;
        saveOwnerData(data);
        renderAccountingSection();
      });

      employeeProfitInput.addEventListener("change", function () {
        const next = Number(employeeProfitInput.value);
        product.employeeProfit = Number.isFinite(next) && next >= 0 ? next : 0;
        saveOwnerData(data);
        renderAccountingSection();
      });

      removeButton.addEventListener("click", function () {
        const index = products.indexOf(product);
        if (index >= 0) {
          products.splice(index, 1);
          saveOwnerData(data);
          renderAccountingSection();
        }
      });

      refreshGlossiaNet();

      nameCell.appendChild(nameInput);
      purchaseCell.appendChild(purchaseInput);
      sellingCell.appendChild(sellingInput);
      employeeCell.appendChild(employeeProfitInput);
      glossiaCell.appendChild(glossiaStrong);
      actionCell.appendChild(removeButton);

      row.appendChild(nameCell);
      row.appendChild(purchaseCell);
      row.appendChild(sellingCell);
      row.appendChild(employeeCell);
      row.appendChild(glossiaCell);
      row.appendChild(actionCell);
      body.appendChild(row);
    });

    table.appendChild(body);
    tableWrap.appendChild(table);
    ownerProductsList.appendChild(tableWrap);
  }

  function renderCompensationRows(data, compensationMap) {
    ownerSalariesList.innerHTML = "";
    const rows = Object.values(compensationMap || {});

    if (!rows.length) {
      ownerSalariesList.innerHTML = '<p class="owner-bi-empty">Aucun employé disponible.</p>';
      return;
    }

    const bodyHtml = rows.map(function (entry) {
      const detail =
        formatMoneyDh(entry.serviceSales) + " → " +
        formatMoneyDh(entry.serviceShare) + " + " +
        formatMoneyDh(entry.productProfit) + " = " +
        formatMoneyDh(entry.netCompensation);

      return "<tr>" +
        "<td>" + entry.employeeName + "</td>" +
        "<td>" + formatMoneyDh(entry.serviceSales) + "</td>" +
        "<td>" + formatMoneyDh(entry.serviceShare) + "</td>" +
        "<td>" + formatMoneyDh(entry.productProfit) + "</td>" +
        "<td>" + formatMoneyDh(entry.netCompensation) + "</td>" +
        "<td>" + detail + "</td>" +
        "</tr>";
    }).join("");

    ownerSalariesList.innerHTML =
      '<div class="employee-table-wrap"><table class="employee-history-table owner-comp-table">' +
      "<thead><tr><th>Employé</th><th>Ventes services</th><th>50% services</th><th>+ Bénéfice produits</th><th>= Bénéfice net</th><th>Détail du calcul</th></tr></thead>" +
      "<tbody>" + bodyHtml + "</tbody></table></div>";
  }

  function renderTaxRows(data, compensationMap) {
    if (!ownerTaxesList) {
      return;
    }

    ownerTaxesList.innerHTML = '<p class="owner-bi-empty">Mode pourcentage actif: aucun salaire fixe ni taxe déduite des employés.</p>';
  }

  function getPeriodFactor(period) {
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

  function renderAccountingSection() {
    const data = loadOwnerData();

    renderCostRows(data.fixedCosts, ownerFixedCostsList, function () {
      saveOwnerData(data);
      renderAccountingSection();
    });

    renderCostRows(data.variableCosts, ownerVariableCostsList, function () {
      saveOwnerData(data);
      renderAccountingSection();
    });

    renderProductRows(data);

    const bounds = getBoundsForRange(biState.accountingPeriod);
    const revenue = sumAmounts(filterRecordsByBounds(getAllSalesRecords(data), bounds));
    const factor = getPeriodFactor(biState.accountingPeriod);

    const fixedTotal = (data.fixedCosts || []).reduce(function (total, cost) {
      return total + Number(cost.monthlyAmount || 0);
    }, 0) * factor;

    const manualVariableTotal = (data.variableCosts || []).reduce(function (total, cost) {
      return total + Number(cost.monthlyAmount || 0);
    }, 0) * factor;

    const consumedProductsAutoTotal = getConsumedProductsAutoCost(data, biState.accountingPeriod);
    const variableTotal = manualVariableTotal;

    const compensationMap = getCompensationByEmployee(data, bounds, biState.accountingPeriod);
    renderCompensationRows(data, compensationMap);
    renderTaxRows(data, compensationMap);

    if (ownerTaxPeriodCaption) {
      ownerTaxPeriodCaption.textContent = "Période: " + getPeriodLabel(biState.accountingPeriod);
    }

    if (ownerVariableCostsBreakdown) {
      ownerVariableCostsBreakdown.textContent =
        "Variables = Manuel " + formatMoneyDh(manualVariableTotal) +
        " (Produits consommés auto: " + formatMoneyDh(consumedProductsAutoTotal) + " · info)";
    }

    const payrollNetTotal = Object.values(compensationMap).reduce(function (total, entry) {
      return total + Number(entry.netCompensation || 0);
    }, 0);

    const expenses = fixedTotal + variableTotal;
    const profit = revenue - expenses;

    ownerAccountingRevenue.textContent = formatMoneyDh(revenue);
    ownerAccountingExpenses.textContent = formatMoneyDh(expenses);
    ownerAccountingProfit.textContent = formatMoneyDh(profit);
    ownerAccountingProfit.classList.toggle("profit-positive", profit >= 0);
    ownerAccountingProfit.classList.toggle("profit-negative", profit < 0);

    window.dispatchEvent(new CustomEvent("owner:finance-updated", {
      detail: {
        revenue: formatMoneyDh(revenue),
        expenses: formatMoneyDh(expenses),
        profit: formatMoneyDh(profit),
        fixedTotal: formatMoneyDh(fixedTotal),
        variableTotal: formatMoneyDh(variableTotal),
        payrollNetTotal: formatMoneyDh(payrollNetTotal)
      }
    }));
  }

  function renderPhaseDashboards() {
    const data = loadOwnerData();
    renderBiNavCards(data);
    renderBiView(data);
    renderAccountingSection();
  }

  ownerBiNav.addEventListener("click", function (event) {
    const card = event.target.closest(".owner-bi-nav-card");
    if (!card) {
      return;
    }

    biState.activeView = card.dataset.view;
    ownerBiNav.querySelectorAll(".owner-bi-nav-card").forEach(function (item) {
      item.classList.toggle("active", item === card);
    });

    renderPhaseDashboards();
  });

  ownerBiRangeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      biState.rangeMode = button.dataset.range;
      ownerBiRangeButtons.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });

      ownerBiCustomRange.classList.toggle("hidden", biState.rangeMode !== "custom");
      renderPhaseDashboards();
    });
  });

  ownerBiApplyRange.addEventListener("click", function () {
    biState.customStart = ownerBiStartDate.value;
    biState.customEnd = ownerBiEndDate.value;
    renderPhaseDashboards();
  });

  ownerAccountingPeriodButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      biState.accountingPeriod = button.dataset.period;
      ownerAccountingPeriodButtons.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      renderAccountingSection();
    });
  });

  ownerAddFixedCost.addEventListener("click", function () {
    const data = loadOwnerData();
    data.fixedCosts.push({ id: Date.now(), label: "Nouvelle charge fixe", monthlyAmount: 0 });
    saveOwnerData(data);
    renderAccountingSection();
  });

  ownerAddVariableCost.addEventListener("click", function () {
    const data = loadOwnerData();
    data.variableCosts.push({ id: Date.now(), label: "Nouvelle charge variable", monthlyAmount: 0 });
    saveOwnerData(data);
    renderAccountingSection();
  });

  if (ownerAddProduct) {
    ownerAddProduct.addEventListener("click", function () {
      const data = loadOwnerData();
      if (!Array.isArray(data.ownerProducts)) {
        data.ownerProducts = [];
      }

      data.ownerProducts.push({
        id: Date.now(),
        name: "Nouveau produit",
        purchasePrice: 0,
        sellingPrice: 0,
        employeeProfit: 0
      });

      saveOwnerData(data);
      renderAccountingSection();
    });
  }

  window.addEventListener("salon-storage-saved", function () {
    renderPhaseDashboards();
  });

  window.addEventListener("storage", function (event) {
    const dataKey = window.SalonStorage?.DATA_KEY || "salonManagerData";
    if (event.key !== dataKey) {
      return;
    }

    renderPhaseDashboards();
  });

  renderPhaseDashboards();
})();
