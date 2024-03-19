// ---------spa--------------------------------
const app = {
  pages: [],
  show: new Event("show"),
  init: function () {
    app.pages = document.querySelectorAll(".page");
    app.pages.forEach((pg) => {
      pg.addEventListener("show", app.pageShown);
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", app.nav);
    });
    // window.addEventListener("popstate", app.poppin);
  },
  nav: function (ev) {
    ev.preventDefault();
    let currentPage = ev.target.getAttribute("data-target");
    if (
      currentPage !== "todo-list" ||
      (currentPage == "todo-list" && loginAttempt())
    ) {
      document.querySelector(".active").classList.remove("active");
      document.getElementById(currentPage).classList.add("active");
      console.log(currentPage);
      history.pushState({}, currentPage, `#${currentPage}`);
    }
    document.getElementById(currentPage).dispatchEvent(app.show);
  },

  // poppin: function (ev) {
  //   console.log(location.hash, "popstate event");
  //   let hash = location.hash.replace("#", "");
  //   document.querySelector(".active").classList.remove("active");
  //   document.getElementById(hash).classList.add("active");
  //   console.log(hash);
  //   //history.pushState({}, currentPage, `#${currentPage}`);
  //   document.getElementById(hash).dispatchEvent(app.show);
  // },
};

document.addEventListener("DOMContentLoaded", app.init);

// ----------sign-up------------------------
document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Gets the username, email, and password entered in the form
    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    // Check if the user already exists in cookies
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    let userExists = false;

    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      // Check if the username in the cookie matches the entered username
      if (key === username) {
        userExists = true;
        break;
      }
    }

    // If the user already exists, display an alert
    if (userExists) {
      alert("שם המשתמש כבר קיים.");
    } else {
      // Create a new user object with the provided information
      const newUser = new UserData(username, email, password);

      // Store the user data in cookies
      //document.cookie = `${username}=${password}=${email}`;
      // Store the user data in cookies
      document.cookie = `${username}=${password}; path=/`;

      // Store the user data in localStorage
      storeUserLocally(newUser);

      alert("הרישום הצליח!");
      window.location.href = "../HTML/sign_up_in.html";
    }
  });

// Function to store the user data in localStorage
function storeUserLocally(user) {
  // Check if localStorage is supported by the browser
  if (typeof Storage !== "undefined") {
    // Convert the user object to a JSON string and store it in localStorage
    localStorage.setItem(user.name, JSON.stringify(user));
  } else {
    // If localStorage is not supported, display an error message
    alert("Browser does not support Web Storage");
  }
}

// Constructor function for creating a new User object
function UserData(name, email, password) {
  this.name = name;
  this.email = email;
  this.password = password;
  this.lastLogin = "Not available";
  this.todoList = [];
}

// ----------sign-in------------------------

// Creating a Map to store the number of login attempts for each user
const loginAttempts = new Map();
function loginAttempt() {
  let loginSuccess = false; // Variable to track login success

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  // Extracting cookies and trimming whitespace
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

  let userFound = false;

  // Iterating over each cookie to find the user
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    // Checking if username and password match
    if (key === username && value === password) {
      userFound = true;
      alert("Login successful!");

      // Storing the logged-in user in localStorage
      localStorage.setItem("loggedInUser", username);
      initTodos() ;

      loginSuccess = true; // Set login success to true
      break;
    }
  }

  // If the user is not found
  if (!userFound) {
    // Checking if there are previous login attempts for the user
    if (loginAttempts.has(username)) {
      // Incrementing the number of login attempts
      loginAttempts.set(username, loginAttempts.get(username) + 1);
      // Checking if the user has reached 3 attempts
      if (loginAttempts.get(username) === 3) {
        // Blocking the user for 30 minutes
        const now = new Date();
        const timeToBlock = new Date(now.getTime() + 30 * 60000); // 30 minutes

        document.cookie = `${username}=blocked; expires=${timeToBlock.toUTCString()}; path=/;`;
        alert("User is blocked for 30 minutes.");
      } else {
        // Alerting about incorrect username or password
        alert("Incorrect username or password.");
      }
    } else {
      // Adding the first login attempt
      loginAttempts.set(username, 1);
      alert("Incorrect username or password.");
    }
  }

  // Return login success status
  return loginSuccess;
}

// ---------------------------todo----------------

const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".clear-btn"),
  taskBox = document.querySelector(".task-box");

function updateLocalStorageTodos(todos) {
  const loggedInUsername = localStorage.getItem("loggedInUser");
  // Retrieve user data from localStorage based on the username
  const usersData = JSON.parse(localStorage.getItem(loggedInUsername));
  usersData.todoList = todos;
  localStorage.setItem(loggedInUsername, JSON.stringify(usersData));
}
function getLocalStorageTodos() {
  const loggedInUsername = localStorage.getItem("loggedInUser");
  // Retrieve user data from localStorage based on the username
  const usersData = JSON.parse(localStorage.getItem(loggedInUsername));
  return usersData.todoList;
}

let editId,
  isEditTask = false,
  todos;
  // todos = getLocalStorageTodos();

function initTodos() {
  (isEditTask = false), (todos = getLocalStorageTodos());
  showTodo("all");
}

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let liTag = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let completed = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
      }
    });
  }
  taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
  let checkTask = taskBox.querySelectorAll(".task");
  !checkTask.length
    ? clearAll.classList.remove("active")
    : clearAll.classList.add("active");
  taskBox.offsetHeight >= 300
    ? taskBox.classList.add("overflow")
    : taskBox.classList.remove("overflow");
}
// showTodo("all");

function showMenu(selectedTask) {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  updateLocalStorageTodos(todos);
}

function editTask(taskId, textName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = textName;
  taskInput.focus();
  taskInput.classList.add("active");
}

function deleteTask(deleteId, filter) {
  isEditTask = false;
  todos.splice(deleteId, 1);
  updateLocalStorageTodos(todos);
  showTodo(filter);
}

clearAll.addEventListener("click", () => {
  isEditTask = false;
  todos.splice(0, todos.length);
  updateLocalStorageTodos(todos);
  showTodo();
});

taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditTask) {
      todos = !todos ? [] : todos;
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo);
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    updateLocalStorageTodos(todos);
    showTodo(document.querySelector("span.active").id);
  }
});
