function signup() {
    let user = {
        firstName_val: document.getElementById('firstName_val').value,
        lastName_val: document.getElementById('lastName_val').value,
        email_val: document.getElementById('email_val').value,
        password_val: document.getElementById('password_val').value,
        passwordVal: document.getElementById('passwordVal').value,
        btnradio: document.querySelector('input[name="btnradio"]:checked').value,
        termsChecked: document.getElementById('TCs').checked
    };

    if (!user.termsChecked) {
        alert("Please agree to the Terms and Conditions");
        return;
    }

    if (!user.firstName_val || !user.lastName_val || !user.email_val || !user.password_val || !user.passwordVal) {
        alert("Missing details!");
        return;
    }

    if (user.password_val !== user.passwordVal) {
        alert("Passwords do not match!");
        return;
    }

    if (user.password_val.length < 8) {
        alert("Password must be at least 8 characters long");
        return;
    }
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert("Valid Signup");
            location.href = '/login.html';
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Invalid Signup");
        }
    };

    xhttp.open("POST", "/signup");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}
