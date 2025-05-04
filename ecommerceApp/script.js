(function() {
    const products = [
      {id: 'p1', name: 'Elegant Headphones', price: 89.99, image: 'https://images.pexels.com/photos/3394664/pexels-photo-3394664.jpeg?auto=compress&cs=tinysrgb&h=350'},
      {id: 'p2', name: 'Stylish Sneakers', price: 120.50, image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&h=350'},
      {id: 'p3', name: 'Modern Watch', price: 149.00, image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&h=350'},
      {id: 'p4', name: 'Cozy Sweater', price: 75.25, image: 'https://images.pexels.com/photos/1464217/pexels-photo-1464217.jpeg?auto=compress&cs=tinysrgb&h=350'},
      {id: 'p5', name: 'Classic Sunglasses', price: 49.95, image: 'https://images.pexels.com/photos/884979/pexels-photo-884979.jpeg?auto=compress&cs=tinysrgb&h=350'},
      {id: 'p6', name: 'Wireless Speaker', price: 110.00, image: 'https://images.pexels.com/photos/3394656/pexels-photo-3394656.jpeg?auto=compress&cs=tinysrgb&h=350'},
      {id: 'p7', name: 'Leather Wallet', price: 34.99, image: 'https://images.pexels.com/photos/1172631/pexels-photo-1172631.jpeg?auto=compress&cs=tinysrgb&h=350'},
      {id: 'p8', name: 'Backpack for Travel', price: 89.99, image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&h=350'},
      {id: 'p9', name: 'Fitness Tracker', price: 65.00, image: 'https://images.pexels.com/photos/1190781/pexels-photo-1190781.jpeg?auto=compress&cs=tinysrgb&h=350'},
      {id: 'p10', name: 'Stylish Jacket', price: 99.95, image: 'https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&h=350'}
    ];

    const productsGrid = document.getElementById('productsGrid');
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartCount = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const searchInput = document.getElementById('searchInput');

    let cart = {};

    const savedCart = localStorage.getItem('shopEaseCart');
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
      } catch {
        cart = {};
      }
    }

    function renderProducts(filterText = '') {
      productsGrid.innerHTML = '';
      const lowerFilter = filterText.trim().toLowerCase();

      let filteredProducts = products;
      if (lowerFilter.length > 0) {
        filteredProducts = products.filter(p => p.name.toLowerCase().includes(lowerFilter));
      }

      if(filteredProducts.length === 0){
        productsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align:center; color:#888; padding:1rem;">No products found.</p>';
        return;
      }

      filteredProducts.forEach(p => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('tabindex', '0');
        card.innerHTML = `
          <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy" />
          <div class="product-info">
            <h2 class="product-name">${p.name}</h2>
            <p class="product-price">$${p.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" aria-label="Add ${p.name} to cart" data-id="${p.id}">Add to Cart</button>
          </div>
        `;
        productsGrid.appendChild(card);
      });
    }

    function renderCart() {
      cartItemsContainer.innerHTML = '';

      const idsInCart = Object.keys(cart);
      if (idsInCart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#aaa; padding:1rem;">Your cart is empty.</p>';
        cartTotal.textContent = 'Total: $0.00';
        cartCount.textContent = '0';
        return;
      }

      let total = 0;
      idsInCart.forEach(id => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        const qty = cart[id];
        const itemTotal = product.price * qty;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <img src="${product.image}" alt="${product.name}" />
          <div class="cart-item-info">
            <p class="cart-item-name">${product.name}</p>
            <p class="cart-item-price">$${itemTotal.toFixed(2)}</p>
          </div>
          <div class="cart-item-qty" aria-label="Quantity controls for ${product.name}">
            <button class="qty-btn" aria-label="Decrease quantity" data-id="${id}" data-action="decrease">-</button>
            <div class="qty-display" aria-live="polite" aria-atomic="true">${qty}</div>
            <button class="qty-btn" aria-label="Increase quantity" data-id="${id}" data-action="increase">+</button>
          </div>
          <button class="remove-btn" aria-label="Remove ${product.name} from cart" data-id="${id}">&times;</button>
        `;
        cartItemsContainer.appendChild(cartItem);
      });
      cartTotal.textContent = `Total: $${total.toFixed(2)}`;
      cartCount.textContent = Object.values(cart).reduce((a,b) => a+b, 0);
    }

    function saveCart() {
      localStorage.setItem('shopEaseCart', JSON.stringify(cart));
    }

    function toggleCart(open) {
      if (open) {
        cartSidebar.classList.add('open');
        cartSidebar.setAttribute('aria-hidden', 'false');
        cartSidebar.focus();
      } else {
        cartSidebar.classList.remove('open');
        cartSidebar.setAttribute('aria-hidden', 'true');
        cartBtn.focus();
      }
    }

    function addToCart(productId) {
      if (cart[productId]) {
        cart[productId]++;
      } else {
        cart[productId] = 1;
      }
      saveCart();
      renderCart();
    }

    function removeFromCart(productId) {
      if (cart[productId]) {
        delete cart[productId];
        saveCart();
        renderCart();
      }
    }

    function updateQuantity(productId, action) {
      if (!cart[productId]) return;
      if (action === 'increase') {
        cart[productId]++;
      } else if (action === 'decrease') {
        if (cart[productId] > 1) {
          cart[productId]--;
        } else {
          // Remove if quantity goes below 1
          removeFromCart(productId);
          return;
        }
      }
      saveCart();
      renderCart();
    }

    productsGrid.addEventListener('click', e => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        const id = e.target.getAttribute('data-id');
        addToCart(id);
        toggleCart(true);
      }
    });

    cartBtn.addEventListener('click', () => {
      toggleCart(true);
    });

    closeCartBtn.addEventListener('click', () => {
      toggleCart(false);
    });

    cartItemsContainer.addEventListener('click', e => {
      if (e.target.classList.contains('remove-btn')) {
        const id = e.target.getAttribute('data-id');
        removeFromCart(id);
      } else if (e.target.classList.contains('qty-btn')) {
        const id = e.target.getAttribute('data-id');
        const action = e.target.getAttribute('data-action');
        updateQuantity(id, action);
      }
    });

    checkoutBtn.addEventListener('click', () => {
      if (Object.keys(cart).length === 0) {
        alert('Your cart is empty!');
        return;
      }
      alert('Thank you for your purchase! (This is a demo, no real checkout)');
      cart = {};
      saveCart();
      renderCart();
      toggleCart(false);
    });

    searchInput.addEventListener('input', (e) => {
      renderProducts(e.target.value);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
        toggleCart(false);
      }
    });

    renderProducts();
    renderCart();

  })();