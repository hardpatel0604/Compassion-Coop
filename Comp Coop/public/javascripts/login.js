/* global Vue */
const vueinstLogin = new Vue({
  el: '#loginDropdown',
  data: {
    loggedIn: localStorage.getItem('loggedIn') === 'true',
    isManager: localStorage.getItem('userType') === 'Manager',
    isSystemAdmin: localStorage.getItem('userType') === 'System Admin',
    branchID: localStorage.getItem('branchID') || null,
    branchName: localStorage.getItem('branchName') || null
  },
  methods: {
    logout() {
      this.loggedIn = false;
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('userType');
      localStorage.removeItem('branchID');
      localStorage.removeItem('branchName');
      localStorage.removeItem('email');
      location.href = '/homepage.html';
    }
  }
});

function login() {
  let user = { email: document.getElementById('email_val').value, password: document.getElementById('password_val').value };
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const userData = JSON.parse(this.responseText);
        const userType = userData.userType;
        const branchID = userData.branchID;
        const branchName = userData.branchName;
        const email = userData.email;

        localStorage.setItem('loggedIn', true);
        localStorage.setItem('userType', userType);
        localStorage.setItem('email', email);
        if (branchID) {
          localStorage.setItem('branchID', branchID);
          localStorage.setItem('branchName', branchName);
        }

        vueinstLogin.loggedIn = true;
        vueinstLogin.isManager = (userType === 'Manager');
        vueinstLogin.isSystemAdmin = (userType === 'System Admin');
        if (vueinstLogin.isManager) {
          vueinstLogin.branchID = branchID;
          vueinstLogin.branchName = branchName;
          alert(`Valid Login! Manager email: ${email}`);
        }
        else {
          alert('Valid Login!');
        }
        location.href = '/homepage.html';
      }
      else if (this.status >= 400) {
        alert("Invalid Login");
      }
    }
  };
  xhttp.open("POST", "/login");
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(user));
}

function do_google_login(response) {

  // Sends the login token provided by google to the server for verification using an AJAX request

  console.log(response);

  fetch('/google-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(response)
  })
    .then(response => {
      if (response.ok) {
        return response.json().then(data => {
          console.log('Response received:', data);
          const userData = data;
          const userType = userData.userTypeID;
          const branchID = userData.branchID;
          const branchName = userData.branchName;
          const email = userData.email;

          localStorage.setItem('loggedIn', true);
          localStorage.setItem('userType', userType);
          localStorage.setItem('email', email);
          if (branchID) {
            localStorage.setItem('branchID', branchID);
            localStorage.setItem('branchName', branchName);
          }

          vueinstLogin.loggedIn = true;
          vueinstLogin.isManager = (userType === 'Manager');
          vueinstLogin.isSystemAdmin = (userType === 'System Admin');
          if (vueinstLogin.isManager) {
            vueinstLogin.branchID = branchID;
            vueinstLogin.branchName = branchName;
            alert(`Valid Login! Manager email: ${email}`);
          }
          else {
            alert('Valid Login!');
          }
          location.href = '/homepage.html';
        });
      } else if (response.status === 401) {
        alert('Login FAILED');
        return response.json().then(data => {
          console.log('Response received:', data);
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

}