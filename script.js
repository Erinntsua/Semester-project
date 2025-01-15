// Highlight Region Card
document.querySelectorAll('.region-card button').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.region-card').forEach(card => card.classList.remove('selected'));
        this.closest('.region-card').classList.add('selected');
        alert(`You have selected the ${this.closest('.region-card').querySelector('h2').textContent} tour.`);
    });
});
// Add Items to Cart and Calculate Total
const cartItems = [];
document.querySelectorAll('.tour-card button').forEach(button => {
    button.addEventListener('click', function () {
        const card = this.closest('.tour-card');
        const title = card.querySelector('h3').textContent;
        const price = parseFloat(card.querySelector('p').textContent.match(/\$\d+/)[0].substring(1));
        cartItems.push({ title, price });

        const total = cartItems.reduce((sum, item) => sum + item.price, 0);
        alert(`Added ${title} to cart. Total: $${total.toFixed(2)}`);
    });
});
document.querySelector('.login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('Email').value;
    const password = document.getElementById('password').value;

    if (!email.includes('@') || password.length < 6) {
        alert('Invalid email or password. Please try again.');
    } else {
        alert('Login successful!');
        window.location.href = 'home.html'; // Redirect after login
    }
});
document.querySelector('.signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
    } else {
        alert('Account created successfully!');
        window.location.href = 'login.html'; // Redirect to login page
    }
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
document.querySelectorAll('.tour-card button').forEach(button => {
    button.addEventListener('click', function () {
        const card = this.closest('.tour-card');
        const title = card.querySelector('h3').textContent;
        const price = parseFloat(card.querySelector('p').textContent.match(/\$\d+/)[0].substring(1));

        // Check if the item is already in the cart
        const existingItem = cartItems.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ title, price, quantity: 1 });
        }

        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        alert(`Added ${title} to cart. Total: $${total.toFixed(2)}`);
    });
});

