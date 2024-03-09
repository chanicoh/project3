
// ---------spa--------------------------------
const app = {
  pages: [],
  show: new Event('show'),
  init: function(){
      app.pages = document.querySelectorAll('.page');
      app.pages.forEach((pg)=>{
          pg.addEventListener('show', app.pageShown);
      })
      
      document.querySelectorAll('.nav-link').forEach((link)=>{
          link.addEventListener('click', app.nav);
      })
      window.addEventListener('popstate', app.poppin);
  },
  nav: function(ev){
      ev.preventDefault();
      let currentPage = ev.target.getAttribute('data-target');
      document.querySelector('.active').classList.remove('active');
      document.getElementById(currentPage).classList.add('active');
      console.log(currentPage)
      history.pushState({}, currentPage, `#${currentPage}`);
      document.getElementById(currentPage).dispatchEvent(app.show);
  },

  poppin: function(ev){
      console.log(location.hash, 'popstate event');
      let hash = location.hash.replace('#' ,'');
      document.querySelector('.active').classList.remove('active');
      document.getElementById(hash).classList.add('active');
      console.log(hash)
      //history.pushState({}, currentPage, `#${currentPage}`);
      document.getElementById(hash).dispatchEvent(app.show);
  }
}

document.addEventListener('DOMContentLoaded', app.init);

// ----------sign-up------------------------
document.getElementById('signupForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    // Gets the username, email, and password entered in the form
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    // Check if the user already exists in cookies
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    let userExists = false;
    
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      // Check if the username in the cookie matches the entered username
      if (key === username) {
        userExists = true;
        break;
      }
    }

    // If the user already exists, display an alert
    if (userExists) {
      alert('שם המשתמש כבר קיים.');
    } 
    else {
      // Create a new user object with the provided information
      const newUser = new UserData(username, email, password);

      // Store the user data in cookies
      //document.cookie = `${username}=${password}=${email}`;
      // Store the user data in cookies
      document.cookie = `${username}=${password}; path=/`;

      // Store the user data in localStorage
      storeUserLocally(newUser);

      alert('הרישום הצליח!');
      window.location.href="../HTML/sign_up_in.html";
    }
  });

  // Function to store the user data in localStorage
  function storeUserLocally(user) {
    // Check if localStorage is supported by the browser
    if (typeof (Storage) !== "undefined") {
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

document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  // Extracting cookies and trimming whitespace
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  
  let userFound = false;
  
  // Iterating over each cookie to find the user
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    // Checking if username and password match
    if (key === username && value === password) {
      userFound = true;
      alert('Login successful!');

      // Storing the logged-in user in localStorage
      localStorage.setItem('loggedInUser', username);

      // Redirecting to the home page
      window.location.href = "../HTML/TodoList.html";
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
        alert('User is blocked for 30 minutes.');
      } 
      else {
        // Alerting about incorrect username or password
        alert('Incorrect username or password.');
      }
    } else {
      // Adding the first login attempt
      loginAttempts.set(username, 1);
      alert('Incorrect username or password.');
    }
  }
});
