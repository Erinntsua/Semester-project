document.addEventListener('DOMContentLoaded', function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Display user's name if logged in
    if (currentUser) {
        const greeting = document.getElementById('greeting');
        greeting.textContent = `Welcome back, ${currentUser.name}!`;

        // Optionally, you can change the greeting message based on the time of day
        const hour = new Date().getHours();
        const heroHeading = document.querySelector('.hero h1');
        if (hour < 12) {
            heroHeading.textContent = `Good Morning, ${currentUser.name}! Welcome to DineKɔ`;
        } else if (hour < 18) {
            heroHeading.textContent = `Good Afternoon, ${currentUser.name}! Welcome to DineKɔ`;
        } else {
            heroHeading.textContent = `Good Evening, ${currentUser.name}! Welcome to DineKɔ`;
        }
    } else {
        // If not logged in, ask the user to login
        alert('Please log in to see personalized content.');
        window.location.href = 'login.html';
    }

    // Cart Count in Navigation
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    function updateCartCount() {
        const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const cartLink = document.getElementById('cart-link');
        if (cartLink) {
            cartLink.textContent = `Cart (${cartCount})`;
        }
    }
    updateCartCount();
});
