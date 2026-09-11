const requiredDailyMinutes = 12 * 60;

const periodButtons = document.querySelectorAll(".period-tab");
const welcomeHeading = document.getElementById("employee-welcome");
const employeePostLabel = document.getElementById("employee-post-label");
const hoursSummary = document.getElementById("employee-hours-summary");
const historyBody = document.getElementById("employee-history-body");
const netBenefitElement = document.getElementById("employee-net-benefit");
const netBenefitDetailElement = document.getElementById("employee-net-benefit-detail");
const benefitToggle = document.getElementById("employee-benefit-toggle");
const benefitList = document.getElementById("employee-benefit-list");
let activeBenefitType = "service";
const taskList = document.getElementById("employee-task-list");
const logoutButton = document.getElementById("employee-logout");

const currentUser = (window.SalonStorage ? window.SalonStorage.loadUser() : null) || {
  role: "employee",
  employeeId: 1,
  name: "Ahmed",
  post: "Post 1"
};

const sharedData = (window.SalonStorage ? window.SalonStorage.loadData() : null) || {
  employees: [{ id: 1, name: "Ahmed", post: "Post 1" }],
  employeeData: {}
};

const employee = sharedData.employees.find(function (item) {
  return item.id === currentUser.employeeId;
}) || {
  id: currentUser.employeeId || 1,
  name: currentUser.name || "الموظف",
  post: currentUser.post || ""
};

// The dashboard only works with the currently logged-in employee's own data.
const employeeState = sharedData.employeeData[employee.id] || {
  salesHistory: [],
  tasks: [],
  scheduleByDate: {}
};

function formatMinutes(totalMinutes) {
  const safeMinutes = Math.max(0, Math.round(totalMinutes || 0));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  return hours + "h" + String(minutes).padStart(2, "0");
}

function formatAmount(amount) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount) + " DH";
}

function dateFromKey(dateKey) {
  return new Date(dateKey + "T12:00:00");
}

function getCurrentWorkDateKey() {
  const now = new Date();

  // A departure just after midnight still belongs to the previous workday.
  if (now.getHours() < 6) {
    now.setDate(now.getDate() - 1);
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

function getWeekStart(date) {
  const start = new Date(date);
  const day = start.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;

  start.setDate(start.getDate() - daysSinceMonday);
  start.setHours(0, 0, 0, 0);
  return start;
}

function isDateInCurrentWeek(date) {
  const start = getWeekStart(new Date());
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return date >= start && date < end;
}

function isDateInCurrentMonth(date) {
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function calculateSchedule(schedule) {
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
    missingMinutes: Math.max(0, requiredDailyMinutes - workedMinutes),
    meetsTarget: workedMinutes >= requiredDailyMinutes
  };
}

function getScheduleEntries() {
  return Object.entries(employeeState.scheduleByDate || {}).map(function (entry) {
    return {
      dateKey: entry[0],
      date: dateFromKey(entry[0]),
      schedule: entry[1],
      calculation: calculateSchedule(entry[1])
    };
  });
}

function getPeriodSummary(period) {
  const entries = getScheduleEntries();

  if (period === "day") {
    const todayEntry = entries.find(function (entry) {
      return entry.dateKey === getCurrentWorkDateKey();
    });

    if (todayEntry?.schedule?.restDay) {
      return {
        restDay: true,
        workedMinutes: 0,
        targetMinutes: 0,
        missingMinutes: 0,
        workedDays: 0,
        complete: true
      };
    }

    const workedMinutes = todayEntry?.calculation?.workedMinutes || 0;

    return {
      workedMinutes: workedMinutes,
      targetMinutes: requiredDailyMinutes,
      missingMinutes: Math.max(0, requiredDailyMinutes - workedMinutes),
      workedDays: todayEntry ? 1 : 0,
      complete: Boolean(todayEntry?.calculation)
    };
  }

  const periodEntries = entries.filter(function (entry) {
    if (!entry.schedule.arrival) {
      return false;
    }

    return period === "week"
      ? isDateInCurrentWeek(entry.date)
      : isDateInCurrentMonth(entry.date);
  });

  const workedMinutes = periodEntries.reduce(function (total, entry) {
    return total + (entry.calculation?.workedMinutes || 0);
  }, 0);
  const targetMinutes = periodEntries.length * requiredDailyMinutes;

  return {
    workedMinutes: workedMinutes,
    targetMinutes: targetMinutes,
    missingMinutes: Math.max(0, targetMinutes - workedMinutes),
    workedDays: periodEntries.length,
    complete: periodEntries.length > 0 && periodEntries.every(function (entry) {
      return Boolean(entry.calculation);
    })
  };
}

function createMetricCard(label, value, className) {
  const card = document.createElement("article");
  card.className = "employee-metric-card" + (className ? " " + className : "");

  const cardLabel = document.createElement("span");
  cardLabel.textContent = label;

  const cardValue = document.createElement("strong");
  cardValue.textContent = value;

  card.appendChild(cardLabel);
  card.appendChild(cardValue);
  return card;
}

function renderPeriodSummary(period) {
  const summary = getPeriodSummary(period);
  hoursSummary.innerHTML = "";

  if (summary.restDay) {
    hoursSummary.appendChild(createMetricCard("الساعات المنجزة", "راحة"));
    hoursSummary.appendChild(createMetricCard("الهدف", "خارج الحساب"));
    hoursSummary.appendChild(createMetricCard("الحالة", "يوم راحة", "pending"));
    return;
  }

  hoursSummary.appendChild(
    createMetricCard("الساعات المنجزة", formatMinutes(summary.workedMinutes))
  );
  hoursSummary.appendChild(
    createMetricCard("الهدف", formatMinutes(summary.targetMinutes))
  );

  if (summary.targetMinutes === 0) {
    hoursSummary.appendChild(
      createMetricCard("الحالة", "ماكاين حتى يوم مسجل", "pending")
    );
    return;
  }

  if (!summary.complete) {
    hoursSummary.appendChild(
      createMetricCard(
        "الحالة",
        "التسجيل ناقص · باقي " + formatMinutes(summary.missingMinutes),
        "warning"
      )
    );
    return;
  }

  if (summary.missingMinutes === 0) {
    hoursSummary.appendChild(
      createMetricCard("الحالة", formatMinutes(summary.workedMinutes) + " كاملة", "success")
    );
    return;
  }

  hoursSummary.appendChild(
    createMetricCard("الحالة", "باقي " + formatMinutes(summary.missingMinutes), "warning")
  );
}

function formatDateKey(dateKey) {
  return dateFromKey(dateKey).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function getStampTime(stamp) {
  return stamp ? stamp.time : "--:--";
}

function appendTableCell(row, text, className) {
  const cell = document.createElement("td");
  cell.textContent = text;

  if (className) {
    cell.className = className;
  }

  row.appendChild(cell);
}

function renderDailyHistory() {
  const entries = getScheduleEntries().sort(function (first, second) {
    return second.date - first.date;
  });

  historyBody.innerHTML = "";

  if (entries.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 7;
    cell.className = "employee-empty-cell";
    cell.textContent = "ماكاين حتى تسجيل دابا.";
    row.appendChild(cell);
    historyBody.appendChild(row);
    return;
  }

  entries.forEach(function (entry) {
    const row = document.createElement("tr");
    const calculation = entry.calculation;

    appendTableCell(row, formatDateKey(entry.dateKey));
    appendTableCell(row, getStampTime(entry.schedule.arrival));
    appendTableCell(row, getStampTime(entry.schedule.lunch));
    appendTableCell(row, getStampTime(entry.schedule.returnTime));
    appendTableCell(row, getStampTime(entry.schedule.departure));
    appendTableCell(
      row,
      entry.schedule.restDay
        ? "راحة"
        : (calculation ? formatMinutes(calculation.workedMinutes) : "فالانتظار")
    );

    if (entry.schedule.restDay) {
      appendTableCell(row, "راحة", "history-status pending");
    } else if (!calculation) {
      appendTableCell(row, "التسجيل ناقص", "history-status warning");
    } else if (calculation.meetsTarget) {
      appendTableCell(row, "الهدف تحقق", "history-status success");
    } else {
      appendTableCell(
        row,
        "باقي " + formatMinutes(calculation.missingMinutes),
        "history-status warning"
      );
    }

    historyBody.appendChild(row);
  });
}

function findOwnerProductForSale(sale) {
  const ownerProducts = Array.isArray(sharedData.ownerProducts) ? sharedData.ownerProducts : [];

  if (sale.productId != null) {
    const byId = ownerProducts.find(function (product) {
      return Number(product.id) === Number(sale.productId);
    });
    if (byId) {
      return byId;
    }
  }

  const label = String(sale.label || "").trim().toLowerCase();
  if (!label) {
    return null;
  }

  return ownerProducts.find(function (product) {
    return String(product?.name || "").trim().toLowerCase() === label;
  }) || null;
}

function getServiceBenefitEntries() {
  return (employeeState.salesHistory || []).map(function (sale) {
    return {
      dateISO: sale.dateISO,
      benefit: Number(sale.amount || 0) * 0.5,
      label: sale.serviceName || "خدمة"
    };
  });
}

function getProductBenefitEntries() {
  const productSales = (sharedData.productSales || []).filter(function (sale) {
    return Number(sale.employeeId) === Number(employee.id);
  });

  return productSales.map(function (sale) {
    const ownerProduct = findOwnerProductForSale(sale);
    const quantity = Number(sale.quantity || 1);
    const benefit = ownerProduct
      ? Number(ownerProduct.employeeProfit || 0) * quantity
      : Number(sale.amount || 0);

    return {
      dateISO: sale.dateISO,
      benefit: benefit,
      label: sale.label || "منتوج"
    };
  });
}

function getTaxForRevenue(brackets, revenue) {
  const applicable = (brackets || [])
    .filter(function (bracket) { return revenue >= Number(bracket.threshold || 0); })
    .sort(function (a, b) { return b.threshold - a.threshold; });

  return applicable.length > 0 ? Number(applicable[0].amount || 0) : 0;
}

function renderBenefitSummary() {
  const serviceEntries = getServiceBenefitEntries();
  const productEntries = getProductBenefitEntries();

  const serviceBenefitTotal = serviceEntries.reduce(function (total, entry) {
    return total + entry.benefit;
  }, 0);
  const productBenefitTotal = productEntries.reduce(function (total, entry) {
    return total + entry.benefit;
  }, 0);
  const grossBenefit = serviceBenefitTotal + productBenefitTotal;

  const serviceRevenue = (employeeState.salesHistory || []).reduce(function (total, sale) {
    return total + Number(sale.amount || 0);
  }, 0);
  const productRevenue = (sharedData.productSales || [])
    .filter(function (sale) { return Number(sale.employeeId) === Number(employee.id); })
    .reduce(function (total, sale) { return total + Number(sale.amount || 0); }, 0);

  const taxBrackets = sharedData.taxBrackets || {};
  const serviceTax = getTaxForRevenue(taxBrackets.service, serviceRevenue);
  const productTax = getTaxForRevenue(taxBrackets.product, productRevenue);
  const totalTax = serviceTax + productTax;
  const netBenefit = grossBenefit - totalTax;

  netBenefitElement.textContent = formatAmount(netBenefit);

  const detailParts = ["الخام: " + formatAmount(grossBenefit)];
  if (serviceTax > 0) {
    detailParts.push("ضريبة الخدمات: -" + formatAmount(serviceTax));
  }
  if (productTax > 0) {
    detailParts.push("ضريبة المنتوجات: -" + formatAmount(productTax));
  }
  netBenefitDetailElement.textContent = detailParts.join(" · ");
}

function renderBenefitList() {
  const entries = (activeBenefitType === "service" ? getServiceBenefitEntries() : getProductBenefitEntries())
    .slice()
    .sort(function (first, second) {
      return new Date(second.dateISO) - new Date(first.dateISO);
    });

  benefitList.innerHTML = "";

  if (entries.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "employee-list-empty";
    emptyItem.textContent = activeBenefitType === "service"
      ? "ماكاين حتى خدمة مسجلة."
      : "ماكاين حتى منتوج مسجل.";
    benefitList.appendChild(emptyItem);
    return;
  }

  entries.forEach(function (entry) {
    const item = document.createElement("li");
    const date = document.createElement("span");
    const amount = document.createElement("strong");

    date.textContent = new Date(entry.dateISO).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    amount.textContent = formatAmount(entry.benefit);

    item.appendChild(date);
    item.appendChild(amount);
    benefitList.appendChild(item);
  });
}

function renderBenefits() {
  renderBenefitSummary();
  renderBenefitList();
}

if (benefitToggle) {
  benefitToggle.addEventListener("click", function (event) {
    const button = event.target.closest(".benefit-type-btn");
    if (!button) {
      return;
    }

    activeBenefitType = button.dataset.type;
    benefitToggle.querySelectorAll(".benefit-type-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn === button);
    });
    renderBenefitList();
  });
}

function renderTasks() {
  const tasks = employeeState.tasks || [];
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const emptyText = document.createElement("p");
    emptyText.className = "employee-list-empty";
    emptyText.textContent = "ماكاين حتى تاش موكولة ليك.";
    taskList.appendChild(emptyText);
    return;
  }

  tasks.forEach(function (task) {
    const row = document.createElement("div");
    row.className = "task-item employee-readonly-task";
    row.classList.toggle("is-done", task.status === "done");

    const text = document.createElement("span");
    text.textContent = task.text;
    text.className = task.status === "done" ? "task-done" : "";

    const badge = document.createElement("span");
    const status = task.status || "pending";
    badge.className = "task-status-badge task-status-" + status;
    badge.textContent =
      status === "done" ? "دارها" :
      status === "notdone" ? "مادارهاش" :
      status === "excuse" ? "معذور" : "فالانتظار";

    row.appendChild(text);
    row.appendChild(badge);
    taskList.appendChild(row);

    if (task.status === "excuse") {
      taskList.appendChild(createTaskExcuseBox(task));
    }
  });
}

function createTaskExcuseBox(task) {
  const box = document.createElement("div");
  box.className = "task-excuse-box";

  if (task.excuseReason) {
    const savedReason = document.createElement("p");
    savedReason.className = "task-excuse-reason";
    savedReason.textContent = "المبرر ديالك: " + task.excuseReason;
    box.appendChild(savedReason);
    return box;
  }

  const label = document.createElement("p");
  label.className = "task-excuse-label";
  label.textContent = "بيّن علاش هاد التاش مادارتيهاش:";

  const input = document.createElement("textarea");
  input.className = "task-excuse-input";
  input.placeholder = "شرح العذر ديالك...";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "manager-btn";
  saveButton.textContent = "صيفط المبرر";
  saveButton.addEventListener("click", function () {
    const reasonText = input.value.trim();
    if (!reasonText) {
      return;
    }

    task.excuseReason = reasonText;
    if (window.SalonStorage) {
      window.SalonStorage.saveData(sharedData);
    }
    renderTasks();
  });

  box.appendChild(label);
  box.appendChild(input);
  box.appendChild(saveButton);
  return box;
}

periodButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    periodButtons.forEach(function (periodButton) {
      const isActive = periodButton === button;
      periodButton.classList.toggle("active", isActive);
      periodButton.setAttribute("aria-selected", String(isActive));
    });

    renderPeriodSummary(button.dataset.period);
  });
});

logoutButton.addEventListener("click", function () {
  if (window.SalonStorage) {
    window.SalonStorage.clearUser();
  }
});

welcomeHeading.textContent = "مرحبا " + employee.name;
employeePostLabel.textContent = employee.post;
renderPeriodSummary("day");
renderDailyHistory();
renderBenefits();
renderTasks();
