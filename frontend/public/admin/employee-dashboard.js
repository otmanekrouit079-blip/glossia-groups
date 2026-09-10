const requiredDailyMinutes = 12 * 60;

const periodButtons = document.querySelectorAll(".period-tab");
const welcomeHeading = document.getElementById("employee-welcome");
const employeePostLabel = document.getElementById("employee-post-label");
const hoursSummary = document.getElementById("employee-hours-summary");
const historyBody = document.getElementById("employee-history-body");
const weekSalesElement = document.getElementById("employee-week-sales");
const monthSalesElement = document.getElementById("employee-month-sales");
const salesList = document.getElementById("employee-sales-list");
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
  name: currentUser.name || "Employé",
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
    hoursSummary.appendChild(createMetricCard("Heures effectuees", "Repos"));
    hoursSummary.appendChild(createMetricCard("Objectif", "Exclu du calcul"));
    hoursSummary.appendChild(createMetricCard("Statut", "Jour de repos", "pending"));
    return;
  }

  hoursSummary.appendChild(
    createMetricCard("Heures effectuées", formatMinutes(summary.workedMinutes))
  );
  hoursSummary.appendChild(
    createMetricCard("Objectif", formatMinutes(summary.targetMinutes))
  );

  if (summary.targetMinutes === 0) {
    hoursSummary.appendChild(
      createMetricCard("Statut", "Aucune journée enregistrée", "pending")
    );
    return;
  }

  if (!summary.complete) {
    hoursSummary.appendChild(
      createMetricCard(
        "Statut",
        "Pointages incomplets · Manque " + formatMinutes(summary.missingMinutes),
        "warning"
      )
    );
    return;
  }

  if (summary.missingMinutes === 0) {
    hoursSummary.appendChild(
      createMetricCard("Statut", formatMinutes(summary.workedMinutes) + " effectuées", "success")
    );
    return;
  }

  hoursSummary.appendChild(
    createMetricCard("Statut", "Manque " + formatMinutes(summary.missingMinutes), "warning")
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
    cell.textContent = "Aucun pointage enregistré pour le moment.";
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
        ? "Repos"
        : (calculation ? formatMinutes(calculation.workedMinutes) : "En attente")
    );

    if (entry.schedule.restDay) {
      appendTableCell(row, "Repos", "history-status pending");
    } else if (!calculation) {
      appendTableCell(row, "Pointages incomplets", "history-status warning");
    } else if (calculation.meetsTarget) {
      appendTableCell(row, "Objectif atteint", "history-status success");
    } else {
      appendTableCell(
        row,
        "Manque " + formatMinutes(calculation.missingMinutes),
        "history-status warning"
      );
    }

    historyBody.appendChild(row);
  });
}

function renderSales() {
  const sales = (employeeState.salesHistory || []).slice().sort(function (first, second) {
    return new Date(second.dateISO) - new Date(first.dateISO);
  });

  const weekTotal = sales.reduce(function (total, sale) {
    return isDateInCurrentWeek(new Date(sale.dateISO)) ? total + sale.amount : total;
  }, 0);
  const monthTotal = sales.reduce(function (total, sale) {
    return isDateInCurrentMonth(new Date(sale.dateISO)) ? total + sale.amount : total;
  }, 0);

  weekSalesElement.textContent = formatAmount(weekTotal);
  monthSalesElement.textContent = formatAmount(monthTotal);
  salesList.innerHTML = "";

  if (sales.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "employee-list-empty";
    emptyItem.textContent = "Aucune vente enregistrée.";
    salesList.appendChild(emptyItem);
    return;
  }

  sales.forEach(function (sale) {
    const item = document.createElement("li");
    const date = document.createElement("span");
    const amount = document.createElement("strong");

    date.textContent = new Date(sale.dateISO).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    amount.textContent = formatAmount(sale.amount);

    item.appendChild(date);
    item.appendChild(amount);
    salesList.appendChild(item);
  });
}

function renderTasks() {
  const tasks = employeeState.tasks || [];
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const emptyText = document.createElement("p");
    emptyText.className = "employee-list-empty";
    emptyText.textContent = "Aucune tâche assignée.";
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
      status === "done" ? "Fait" :
      status === "notdone" ? "Pas fait" :
      status === "excuse" ? "Excusé" : "En attente";

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
    savedReason.textContent = "Votre justification: " + task.excuseReason;
    box.appendChild(savedReason);
    return box;
  }

  const label = document.createElement("p");
  label.className = "task-excuse-label";
  label.textContent = "Justifiez pourquoi cette tâche n'a pas été faite:";

  const input = document.createElement("textarea");
  input.className = "task-excuse-input";
  input.placeholder = "Expliquez votre excuse...";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "manager-btn";
  saveButton.textContent = "Envoyer la justification";
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

welcomeHeading.textContent = "Bienvenue " + employee.name;
employeePostLabel.textContent = employee.post;
renderPeriodSummary("day");
renderDailyHistory();
renderSales();
renderTasks();
