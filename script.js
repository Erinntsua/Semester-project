// script.js

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Example action for 'Explore Now' button
document.querySelector('.hero button').addEventListener('click', () => {
    window.location.href = 'cart.html'; // Redirect to tours and foods page
});

// Event for 'Book Now' buttons in tour cards
document.querySelectorAll('.tour-card button').forEach(button => {
    button.addEventListener('click', () => {
        alert('Thank you for your interest! Booking functionality will be added soon.');
    });
});
// Cart functionality
const cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(item) {
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
}

document.querySelectorAll('.tour-card button').forEach((button, index) => {
    button.addEventListener('click', () => {
        const item = {
            id: index,
            name: button.parentElement.querySelector('h3').innerText,
            description: button.parentElement.querySelector('p').innerText
        };
        addToCart(item);
    });
   
// script.js

document.querySelector('.login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    const email = document.getElementById('Email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Basic validation
    if (!email || !password) {
        alert('Please fill out all fields.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Simulate login success
    alert('Login successful! Redirecting...');
    window.location.href = 'home.html'; // Redirect to the home page
});

// Email validation helper
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
    
});
// Attach event listener to the signup form
document.querySelector('.signup-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    // Get form input values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate inputs
    if (!name) {
        alert('Please enter your full name.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    // Simulate successful signup
    alert('Signup successful! Redirecting to the login page...');
    window.location.href = 'login.html'; // Redirect to the login page
});

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Real-time feedback for password match
document.getElementById('confirm-password').addEventListener('input', function () {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;

    if (confirmPassword && password !== confirmPassword) {
        this.style.border = '2px solid red';
    } else {
        this.style.border = '2px solid green';
    }
});
