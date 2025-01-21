// Highlight Region Card
document.querySelectorAll('.region-card button').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.region-card').forEach(card => card.classList.remove('selected'));
        this.closest('.region-card').classList.add('selected');
        alert(`You have selected the ${this.closest('.region-card').querySelector('h2').textContent} tour.`);
    });
});

// Add Items to Cart and Calculate Total
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

document.querySelectorAll('.tour-card button').forEach(button => {
    button.addEventListener('click', function () {
        const card = this.closest('.tour-card');
        const title = card.querySelector('h3').textContent;
        const priceText = card.querySelector('p').textContent;
        const price = parseFloat(priceText.match(/\$\d+/)[0].substring(1));

        // Check if the item is already in the cart
        const existingItem = cartItems.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ title, price, quantity: 1 });
        }

        // Save cart data to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Update cart total
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        alert(`Added ${title} to cart. Total: $${total.toFixed(2)}`);

        // Update cart count in the navigation
        updateCartCount();
    });
});

// Update Cart Count in Navigation
function updateCartCount() {
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-link').innerText = `Cart (${cartCount})`;
}

// Login Form Submission
document.querySelector('.login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (users[email] && users[email].password === password) {
        alert('Login successful!');
        localStorage.setItem('currentUser', JSON.stringify({ name: users[email].name, email })); // Store user data
        window.location.href = 'home.html'; // Redirect after login
    } else {
        alert('Invalid email or password. Please try again.');
    }
});

// Signup Form Submission
document.querySelector('.signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    if (users[email]) {
        alert('Email is already registered!');
        return;
    }

    users[email] = { name, password };
    localStorage.setItem('users', JSON.stringify(users));

    alert('Account created successfully!');
    window.location.href = 'login.html'; // Redirect to login page
});

// Smooth Scrolling
document.querySelectorAll('header a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Dynamic Greetings
const heroHeading = document.querySelector('.hero h1');
const hour = new Date().getHours();
if (hour < 12) {
    heroHeading.textContent = 'Good Morning! Welcome to DineKɔ';
} else if (hour < 18) {
    heroHeading.textContent = 'Good Afternoon! Welcome to DineKɔ';
} else {
    heroHeading.textContent = 'Good Evening! Welcome to DineKɔ';
}

// Redirect on "Browse our shop" button click in home.html
document.querySelector('.browse-shop-btn').addEventListener('click', function() {
    window.location.href = 'booking.html';
});

// Redirect on "Book Now" button click in cart.html
document.querySelectorAll('.book-now-btn').forEach(button => {
    button.addEventListener('click', function() {
        window.location.href = 'booking.html';
    });
});

// Initialize Cart Count on Page Load
window.onload = function() {
    updateCartCount();
};

// Dashboard Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Load user data for Dashboard
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('user-name').textContent = `Welcome, ${currentUser.name}`;
    } else {
        alert('You must log in to access the dashboard.');
        window.location.href = 'login.html'; // Redirect to login if not logged in
    }

    // Admin Tasks - Manage Bookings
    const manageBookingsBtn = document.getElementById('manage-bookings');
    manageBookingsBtn.addEventListener('click', function () {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        let bookingDetails = '';
        bookings.forEach((booking, index) => {
            bookingDetails += `<p>Booking #${index + 1} - ${booking.region} Tour - ${booking.quantity} person(s)</p>`;
        });
        document.getElementById('booking-list').innerHTML = bookingDetails;
    });

    // Admin Tasks - Manage Users
    const manageUsersBtn = document.getElementById('manage-users');
    manageUsersBtn.addEventListener('click', function () {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        let userDetails = '';
        for (const email in users) {
            userDetails += `<p>${users[email].name} (${email})</p>`;
        }
        document.getElementById('user-list').innerHTML = userDetails;
    });

    // Log out functionality
    const logoutBtn = document.getElementById('logout');
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html'; // Redirect to login after logout
    });
});

// Payment Process Handling
document.getElementById('payment-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cartItems.length === 0) {
        alert('Your cart is empty. Please add items before proceeding.');
        return;
    }

    // Calculate total payment amount
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    alert(`Payment of $${totalAmount.toFixed(2)} has been successfully processed using ${paymentMethod}!`);

    // Show success message and clear cart
    document.getElementById('success-message').style.display = 'block';
    setTimeout(() => {
        localStorage.removeItem('cartItems');
        window.location.href = 'home.html';
    }, 3000); // Redirect to home after 3 seconds
});

// Booking Form Submission (booking.html)
document.getElementById('booking-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const selectedRegion = document.querySelector('.region-card.selected');
    if (!selectedRegion) {
        alert('Please select a region for the tour.');
        return;
    }

    const regionName = selectedRegion.querySelector('h2').textContent;
    const quantity = document.getElementById('quantity').value;

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push({ region: regionName, quantity });

    localStorage.setItem('bookings', JSON.stringify(bookings));

    alert('Booking successful!');
    window.location.href = 'cart.html'; // Redirect to cart after booking
});

// Profile Page Updates - Load User Data and Bookings
document.addEventListener('DOMContentLoaded', function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-email').textContent = currentUser.email;

        // Display user's recent bookings
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        let bookingDetails = '';
        bookings.forEach((booking, index) => {
            bookingDetails += `<li>Booking #${index + 1} - ${booking.region} Tour - ${booking.quantity} person(s)</li>`;
        });
        document.getElementById('booking-list').innerHTML = bookingDetails;
    } else {
        alert('You must log in to view your profile.');
        window.location.href = 'login.html'; // Redirect to login if not logged in
    }

    // Log out functionality
    const logoutBtn = document.getElementById('logout');
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html'; // Redirect to login after logout
    });
});
