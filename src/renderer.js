document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const apiUrl = 'http://makeup-api.herokuapp.com/api/v1/products.json';
    const brandFilter = document.getElementById('brand-filter');

    // Fetch and display products
    function fetchProducts(maxPrice = 20, selectedBrand = '') {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const filteredProducts = data.filter(product =>
                    parseFloat(product.price) <= maxPrice &&
                    product.image_link &&
                    product.rating &&
                    (selectedBrand === '' || product.brand.trim().toLowerCase() === selectedBrand.trim().toLowerCase())
                );

                populateBrandFilter(data);
                displayProducts(filteredProducts);
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    // Populate the brand filter
    function populateBrandFilter(products) {
        const brands = [...new Set(products.map(product => product.brand))];
        brandFilter.innerHTML = '<option value="">All Brands</option>';
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandFilter.appendChild(option);
        });
    }

    // Display products
    function displayProducts(products) {
        productList.innerHTML = '';
        if (products.length === 0) {
            productList.innerHTML = '<p>No products available matching your criteria.</p>';
            return;
        }

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <h3 class="product-name">${product.name}</h3>
                <img src="${product.image_link}" alt="${product.name}">
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p><strong>Price:</strong> $${product.price}</p>
                <p><strong>Type:</strong> ${product.product_type}</p>
                <p><a href="${product.product_link}" target="_blank">Product Link</a></p>
                <p>or buy from us:</p>
                <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
                <button class="add-to-wishlist" data-id="${product.id}" data-name="${product.name}" data-link="${product.product_link}">Add to Wishlist</button>
                <div class="product-details" style="display: none;">
                    <p><strong>Description:</strong> ${product.description || 'No description available.'}</p>
                    <p class="rating">
                        <strong>Rating:</strong> ${product.rating ? product.rating : 'Not rated'}
                        <span class="rating-star">${product.rating ? '★' : ''}</span>
                    </p>
                </div>
            `;

            productList.appendChild(productDiv);

            // Toggle product details on click
            productDiv.querySelector('.product-name').addEventListener('click', () => {
                const detailsDiv = productDiv.querySelector('.product-details');
                detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none';
            });

            productDiv.querySelector('img').addEventListener('click', () => {
                const detailsDiv = productDiv.querySelector('.product-details');
                detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none';
            });
        });

        // Add event listeners for "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });

        // Add event listeners for "Add to Wishlist" buttons
        document.querySelectorAll('.add-to-wishlist').forEach(button => {
            button.addEventListener('click', addToWishlist);
        });
    }

    // Add product to cart
    function addToCart(event) {
        const productId = event.target.getAttribute('data-id');
        const productName = event.target.getAttribute('data-name');
        const productPrice = parseFloat(event.target.getAttribute('data-price'));

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productIndex = cart.findIndex(item => item.id === productId);

        if (productIndex === -1) {
            cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        } else {
            cart[productIndex].quantity += 1;
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${productName} added to cart`);
    }

    // Add product to wishlist
    function addToWishlist(event) {
        const productId = event.target.getAttribute('data-id');
        const productName = event.target.getAttribute('data-name');
        const productLink = event.target.getAttribute('data-link');

        const wishlists = JSON.parse(localStorage.getItem('wishlists')) || {};
        let wishlistName = prompt('Enter the name of the wishlist to add to or create a new one:');

        if (wishlistName) {
            if (!wishlists[wishlistName]) {
                wishlists[wishlistName] = []; // Create a new wishlist if it doesn't exist
            }

            const existingItem = wishlists[wishlistName].find(item => item.id === productId);
            if (!existingItem) {
                wishlists[wishlistName].push({ id: productId, name: productName, link: productLink });
                localStorage.setItem('wishlists', JSON.stringify(wishlists));
                alert(`${productName} added to wishlist "${wishlistName}"`);
            } else {
                alert(`${productName} is already in wishlist "${wishlistName}"`);
            }
        }
    }

    fetchProducts();

    // Update the filter button event listener
    document.getElementById('filter-button').addEventListener('click', () => {
        const maxPrice = parseFloat(document.getElementById('price-input').value) || Infinity;
        fetchProducts(maxPrice, brandFilter.value);
    });

    // Add event listener for brand filter
    brandFilter.addEventListener('change', () => {
        const selectedBrand = brandFilter.value;
        const maxPrice = parseFloat(document.getElementById('price-input').value) || Infinity;
        fetchProducts(maxPrice, selectedBrand);
    });
});
