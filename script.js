document.addEventListener('DOMContentLoaded', function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Profile Page - Load User Data and Bookings
    if (document.body.contains(document.getElementById('user-name'))) {
        if (currentUser) {
            document.getElementById('user-name').textContent = currentUser.name;
            document.getElementById('user-email').textContent = currentUser.email;

            const bookingList = document.getElementById('booking-list');
            if (bookings.length > 0) {
                bookingList.innerHTML = bookings
                    .map((booking, index) => `<li>Booking #${index + 1} - ${booking.region} Tour - ${booking.quantity} person(s)</li>`)
                    .join('');
            } else {
                bookingList.innerHTML = '<li>No bookings available.</li>';
            }
        } else {
            alert('You must log in to view your profile.');
            window.location.href = 'login.html';
        }
    }

    // Cart Count in Navigation
    function updateCartCount() {
        const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const cartLink = document.getElementById('cart-link');
        if (cartLink) {
            cartLink.textContent = `Cart (${cartCount})`;
        }
    }
    updateCartCount();

    // Log Out Functionality
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('currentUser');
            alert('You have been logged out.');
            window.location.href = 'login.html';
        });
    }

    // Booking Form Submission (booking.html)
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const selectedRegion = document.querySelector('.region-card.selected');
            if (!selectedRegion) {
                alert('Please select a region for the tour.');
                return;
            }

            const regionName = selectedRegion.querySelector('h2').textContent;
            const quantity = parseInt(document.getElementById('quantity').value, 10);

            bookings.push({ region: regionName, quantity });
            localStorage.setItem('bookings', JSON.stringify(bookings));

            alert('Booking successful!');
            window.location.href = 'cart.html';
        });
    }

    // Cart Add Items
    document.querySelectorAll('.tour-card button').forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.tour-card');
            const title = card.querySelector('h3').textContent;
            const price = parseFloat(card.querySelector('p').textContent.replace(/[^0-9.]/g, ''));

            const existingItem = cartItems.find(item => item.title === title);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({ title, price, quantity: 1 });
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            alert(`Added ${title} to cart.`);
            updateCartCount();
        });
    });

    // Dynamic Greetings on Home Page
    const heroHeading = document.querySelector('.hero h1');
    if (heroHeading) {
        const hour = new Date().getHours();
        if (hour < 12) {
            heroHeading.textContent = 'Good Morning! Welcome to DineKɔ';
        } else if (hour < 18) {
            heroHeading.textContent = 'Good Afternoon! Welcome to DineKɔ';
        } else {
            heroHeading.textContent = 'Good Evening! Welcome to DineKɔ';
        }
    }
});
