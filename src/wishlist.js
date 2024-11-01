document.addEventListener('DOMContentLoaded', () => {
    const wishlistContainer = document.getElementById('wishlist-container');
    const createWishlistButton = document.getElementById('create-wishlist');

    // Function to render wishlists
    function renderWishlists() {
        wishlistContainer.innerHTML = ''; // Clear current content
        const wishlists = JSON.parse(localStorage.getItem('wishlists')) || {};

        for (const [name, items] of Object.entries(wishlists)) {
            const wishlistDiv = document.createElement('div');
            wishlistDiv.className = 'wishlist';
            wishlistDiv.innerHTML = `
                <h3>
                    <span class="wishlist-name">${name}</span>
                    <button class="update-wishlist" data-name="${name}">Edit</button>
                    <button class="delete-wishlist" data-name="${name}">Delete</button>
                </h3>
                <ul>
                    ${items.map((item, index) => `
                        <li>
                            ${index + 1}. ${item.name} - 
                            <a href="${item.link || '#'}" target="_blank">View Product</a>
                            <button class="remove-item" data-name="${name}" data-index="${index}">Remove</button>
                        </li>`).join('')}
                </ul>
            `;
            wishlistContainer.appendChild(wishlistDiv);
        }

        // Re-bind update and delete buttons for wishlists
        document.querySelectorAll('.update-wishlist').forEach(button => {
            button.addEventListener('click', updateWishlist);
        });
        document.querySelectorAll('.delete-wishlist').forEach(button => {
            button.addEventListener('click', deleteWishlist);
        });

        // Bind remove buttons for each item
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }

    // Function to delete a wishlist
    function deleteWishlist(event) {
        const wishlistName = event.target.getAttribute('data-name');
        const wishlists = JSON.parse(localStorage.getItem('wishlists')) || {};

        if (wishlists[wishlistName]) {
            delete wishlists[wishlistName];
            localStorage.setItem('wishlists', JSON.stringify(wishlists));
            alert(`Wishlist "${wishlistName}" has been deleted.`);
            renderWishlists(); // Refresh the display
        }
    }

    // Function to update a wishlist name
    function updateWishlist(event) {
        const oldName = event.target.getAttribute('data-name');
        const wishlists = JSON.parse(localStorage.getItem('wishlists')) || {};

        const newName = prompt('Enter a new name for your wishlist:', oldName);
        if (newName && newName !== oldName) {
            if (!wishlists[newName]) {
                wishlists[newName] = wishlists[oldName];
                delete wishlists[oldName];
                localStorage.setItem('wishlists', JSON.stringify(wishlists));
                alert(`Wishlist renamed to "${newName}".`);
                renderWishlists(); // Refresh the display
            } else {
                alert(`A wishlist with the name "${newName}" already exists.`);
            }
        }
    }

    // Function to remove an item from a wishlist
    function removeItem(event) {
        const wishlistName = event.target.getAttribute('data-name');
        const itemIndex = parseInt(event.target.getAttribute('data-index'), 10);
        const wishlists = JSON.parse(localStorage.getItem('wishlists')) || {};

        if (wishlists[wishlistName]) {
            // Remove the item at the specified index
            wishlists[wishlistName].splice(itemIndex, 1);

            // If the wishlist is empty, remove it entirely
            if (wishlists[wishlistName].length === 0) {
                delete wishlists[wishlistName];
            }

            // Update localStorage and re-render the wishlists
            localStorage.setItem('wishlists', JSON.stringify(wishlists));
            alert(`Item removed from wishlist "${wishlistName}".`);
            renderWishlists(); // Refresh the display
        }
    }

    // Create a new wishlist
    createWishlistButton.addEventListener('click', () => {
        const newName = prompt('Enter a name for your new wishlist:');
        if (newName) {
            const wishlists = JSON.parse(localStorage.getItem('wishlists')) || {};
            if (!wishlists[newName]) {
                wishlists[newName] = []; // Initialize empty wishlist array
                localStorage.setItem('wishlists', JSON.stringify(wishlists));
                alert(`New wishlist "${newName}" created.`);
                renderWishlists(); // Refresh the display
            } else {
                alert(`A wishlist with the name "${newName}" already exists.`);
            }
        }
    });

    renderWishlists(); // Initial rendering of wishlists on page load
});
