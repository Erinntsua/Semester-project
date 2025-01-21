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

            // Add to bookings
            bookings.push({ region: regionName, quantity });
            localStorage.setItem('bookings', JSON.stringify(bookings));

            // Redirect to cart
            alert('Booking successful!');
            window.location.href = 'cart.html'; // Redirect to cart after booking
        });
    }

    // Cart Add Items - from the region selection buttons
    document.querySelectorAll('.region-card button').forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.region-card');
            const title = card.querySelector('h2').textContent;
            const price = parseFloat(card.querySelector('p').textContent.replace(/[^0-9.]/g, ''));
            const imageUrl = card.querySelector('img') ? card.querySelector('img').src : ''; // Check if an image exists
            const imageAlt = card.querySelector('img') ? card.querySelector('img').alt : title; // Default alt text

            // Add or update item in cart
            const existingItem = cartItems.find(item => item.title === title);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({ title, price, quantity: 1, imageUrl, imageAlt });
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
            heroHeading.textContent = `Good Morning! Welcome to DineKɔ`;
        } else if (hour < 18) {
            heroHeading.textContent = `Good Afternoon! Welcome to DineKɔ`;
        } else {
            heroHeading.textContent = `Good Evening! Welcome to DineKɔ`;
        }

        // Add user name greeting if logged in
        if (currentUser) {
            const greeting = `Good Morning, ${currentUser.name}! Welcome to DineKɔ`;
            heroHeading.textContent = greeting;
        }
    }

    // Cart Page - Update Cart and Total Amount
    if (document.body.contains(document.getElementById('cart-items-container'))) {
        const cartContainer = document.getElementById('cart-items-container');
        const totalAmountElement = document.getElementById('total-amount');

        // Display cart items
        function displayCartItems() {
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartContainer.innerHTML = ""; // Clear existing items
            let totalAmount = 0; // Initialize total amount to 0

            if (cartItems.length === 0) {
                cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            } else {
                cartItems.forEach((item, index) => {
                    const itemElement = document.createElement('div');
                    itemElement.innerHTML = `
                        <div class="cart-item">
                            <img src="${item.imageUrl}" alt="${item.imageAlt}" width="100" />
                            <div class="item-details">
                                <h3>${item.title}</h3>
                                <p><strong>Price:</strong> $${item.price}</p>
                                <p><strong>Quantity:</strong> ${item.quantity}</p>
                                <button onclick="removeFromCart(${index})">Remove</button>
                            </div>
                        </div>
                    `;
                    cartContainer.appendChild(itemElement);
                    totalAmount += item.price * item.quantity; // Add item total to the total amount
                });
                totalAmountElement.innerText = `Total: $${totalAmount.toFixed(2)}`;
            }
        }

        // Function to remove item from cart
        function removeFromCart(index) {
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems.splice(index, 1); // Remove item at the specified index
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            displayCartItems(); // Re-render the cart items
        }

        // Function to proceed to payment
        function proceedToPayment() {
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            if (cartItems.length === 0) {
                alert("Your cart is empty. Please add items to the cart before proceeding.");
                return;
            }
            localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Ensure cart items are available for the payment page
            window.location.href = 'payment.html'; // Redirect to the payment page
        }

        // Initialize cart display
        displayCartItems();

        // Handle cart proceed to payment button click
        const proceedToPaymentBtn = document.querySelector('button[onclick="window.location.href=\'payment.html\'"]');
        if (proceedToPaymentBtn) {
            proceedToPaymentBtn.addEventListener('click', proceedToPayment);
        }
    }
});
