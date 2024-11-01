document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');

    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Display cart items
    function displayCart() {
        cartContainer.innerHTML = ''; // Clear current cart items
        let totalPrice = 0; // Initialize total price

        cart.forEach((item, index) => {
            // Ensure price and quantity are numbers
            const price = parseFloat(item.price) || 0;
            const quantity = item.quantity || 1; // Default to 1 if quantity is not set

            totalPrice += price * quantity; // Calculate total price

            // Create item container
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <p>${item.name} - $${price.toFixed(2)} x ${quantity}</p>
            `;

            // Create increase button
            const increaseButton = document.createElement('button');
            increaseButton.textContent = '+';
            increaseButton.addEventListener('click', () => updateQuantity(index, 'increase'));

            // Create decrease button
            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = '-';
            decreaseButton.addEventListener('click', () => updateQuantity(index, 'decrease'));

            // Create remove button
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => removeFromCart(index));

            // Append buttons to itemDiv
            itemDiv.appendChild(increaseButton);
            itemDiv.appendChild(decreaseButton);
            itemDiv.appendChild(removeButton);

            // Append itemDiv to cart container
            cartContainer.appendChild(itemDiv);
        });

        totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`; // Format total price
    }

    // Update quantity of cart items
    function updateQuantity(index, action) {
        console.log(`updateQuantity called with index: ${index}, action: ${action}`); // Debugging output

        if (action === 'increase') {
            cart[index].quantity += 1;
        } else if (action === 'decrease') {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                console.log('Quantity cannot be less than 1'); // Additional check
            }
        } else {
            console.log('Unknown action'); // Additional error handling
        }

        localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
        displayCart(); // Refresh cart display
    }

    // Remove item from cart
    function removeFromCart(index) {
        cart.splice(index, 1); // Remove item from cart
        localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
        displayCart(); // Refresh cart display
    }

    // Checkout functionality
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty');
        } else {
            alert('Checkout successful');
            cart = []; // Clear cart
            localStorage.removeItem('cart'); // Clear localStorage
            displayCart(); // Refresh cart display
        }
    });

    displayCart(); // Initial display of cart items
});
