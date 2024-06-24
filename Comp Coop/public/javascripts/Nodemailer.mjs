document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('email_val');
    const messageDiv = document.getElementById('message');

    newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from submitting normally

        const userEmail = emailInput.value;
        const selectedBranch = document.querySelector('input[name="branch"]:checked').value;

        if (!validateEmail(userEmail)) {
            showMessage('Invalid email address. Please enter a valid email.', 'danger');
            return;
        }

        fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: userEmail, branch: selectedBranch })
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Error sending email');
            }
        })
        .then(data => {
            emailInput.value = '';
            showMessage('Email sent successfully!', 'success');
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Error sending email. Please try again.', 'danger');
        });
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function showMessage(message, type) {
        messageDiv.style.display = 'block';
        messageDiv.className = `alert alert-${type}`;
        messageDiv.textContent = message;
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
});
