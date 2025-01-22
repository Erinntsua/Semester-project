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

            // Add to cart if not already in the cart
            const existingCartItem = cartItems.find(item => item.title === regionName);
            if (existingCartItem) {
                existingCartItem.quantity += quantity;
            } else {
                const price = parseFloat(selectedRegion.querySelector('p').textContent.replace(/[^0-9.]/g, ''));
                cartItems.push({ title: regionName, price, quantity });
            }
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

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

            // Add or update item in cart
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
        let greeting = "Welcome to DineKɔ";
        if (hour < 12) {
            greeting = `Good Morning! ${greeting}`;
        } else if (hour < 18) {
            greeting = `Good Afternoon! ${greeting}`;
        } else {
            greeting = `Good Evening! ${greeting}`;
        }

        if (currentUser) {
            greeting = `Good ${hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening'}, ${currentUser.name}! ${greeting}`;
        }
        heroHeading.textContent = greeting;
    }

    // Cart Page - Update Cart and Total Amount
    if (document.body.contains(document.getElementById('cart-items-container'))) {
        const cartContainer = document.getElementById('cart-items-container');
        const totalAmountElement = document.getElementById('total-amount');

        // Function to display cart items
        function displayCartItems() {
            cartContainer.innerHTML = ''; // Clear existing items
            let totalAmount = 0; // Initialize total amount

            if (cartItems.length === 0) {
                cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            } else {
                cartItems.forEach((item, index) => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('cart-item');
                    itemElement.innerHTML = `
                        <div class="item-details">
                            <h3>${item.title}</h3>
                            <p><strong>Price:</strong> $${item.price}</p>
                            <p><strong>Quantity:</strong> 
                                <button onclick="updateQuantity(${index}, -1)">-</button>
                                <span id="quantity-${index}">${item.quantity}</span>
                                <button onclick="updateQuantity(${index}, 1)">+</button>
                            </p>
                            <button onclick="removeFromCart(${index})">Remove</button>
                        </div>
                    `;
                    cartContainer.appendChild(itemElement);
                    totalAmount += item.price * item.quantity;
                });
                totalAmountElement.innerText = `Total: $${totalAmount.toFixed(2)}`;
            }
        }

        // Function to update the quantity of an item in the cart
        function updateQuantity(index, change) {
            if (cartItems[index]) {
                cartItems[index].quantity += change;
                if (cartItems[index].quantity <= 0) cartItems[index].quantity = 1; // Prevent quantity from being less than 1
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                displayCartItems(); // Re-render the cart after updating quantity
            }
        }

        // Function to remove item from cart
        function removeFromCart(index) {
            cartItems.splice(index, 1); // Remove item from the array
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            displayCartItems(); // Re-render the cart
        }

        // Function to proceed to payment
        function proceedToPayment() {
            if (cartItems.length === 0) {
                alert("Your cart is empty. Please add items to the cart before proceeding.");
                return;
            }
            localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Store cart items
            window.location.href = 'payment.html'; // Proceed to payment page
        }

        // Initialize cart display
        displayCartItems();

        // Handle proceed to payment button
        const proceedToPaymentBtn = document.querySelector('button[onclick="window.location.href=\'payment.html\'"]');
        if (proceedToPaymentBtn) {
            proceedToPaymentBtn.addEventListener('click', proceedToPayment);
        }
    }
});
