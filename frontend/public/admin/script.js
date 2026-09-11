const legacyUsers = [
  {
    role: "manager",
    username: "gerant1",
    password: "1234"
  },
  {
    role: "employee",
    username: "emp1",
    password: "1234",
    employeeId: 1,
    name: "Ahmed",
    post: "Post 1"
  },
  {
    role: "owner",
    username: "osmane Barber",
    password: "otmankrouit199811"
  }
];

function getAuthContext() {
  if (window.SalonStorage) {
    const data = window.SalonStorage.loadData();
    const authUsers = Array.isArray(data.authUsers) && data.authUsers.length > 0
      ? data.authUsers
      : legacyUsers;

    return {
      users: authUsers,
      employees: Array.isArray(data.employees) ? data.employees : []
    };
  }

  return {
    users: legacyUsers,
    employees: []
  };
}

const dashboardRoutes = {
  manager: "manager-dashboard.html",
  employee: "employee-dashboard.html",
  owner: "owner-dashboard.html"
};

const loginForm = document.getElementById("login-form");
const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");
const errorMessage = document.getElementById("login-error");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const enteredUsername = usernameField.value.trim();
  const enteredPassword = passwordField.value;

  const authContext = getAuthContext();

  // Match username + password; the role comes from whichever account matches.
  const matchedUser = authContext.users.find(function (user) {
    return (
      user.username === enteredUsername &&
      user.password === enteredPassword
    );
  });

  if (!matchedUser) {
    errorMessage.textContent = "المعلومات خاطئة. تأكد من اسم المستخدم وكلمة السر.";
    return;
  }

  errorMessage.textContent = "";

  const linkedEmployee = matchedUser.role === "employee"
    ? authContext.employees.find(function (employee) {
      return Number(employee.id) === Number(matchedUser.employeeId);
    })
    : null;

  // Keep only non-sensitive identity data for the destination dashboard.
  const userPayload = {
    role: matchedUser.role,
    username: matchedUser.username,
    employeeId: matchedUser.employeeId || linkedEmployee?.id || null,
    name: matchedUser.name || linkedEmployee?.name || null,
    post: matchedUser.post || linkedEmployee?.post || null
  };

  if (window.SalonStorage) {
    window.SalonStorage.saveUser(userPayload);
  } else {
    sessionStorage.setItem("salonCurrentUser", JSON.stringify(userPayload));
  }

  window.location.href = dashboardRoutes[matchedUser.role];
});
