/* 
   Zen Tea Co. Logic
   - Product Data
   - Cart Management
   - DOM Rendering
*/

// --- Product Data ---
const products = [
    {
        id: 1,
        name: "Golden Chamomile",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Herbal",
        description: "Soothing whole flower chamomile for a restful sleep."
    },
    {
        id: 2,
        name: "Imperial Jasmine",
        price: 15.50,
        image: "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Green",
        description: "Delicate green tea pearls scented with fresh jasmine blossoms."
    },
    {
        id: 3,
        name: "Earl Grey Reserve",
        price: 14.00,
        image: "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Black",
        description: "Robust black tea infused with premium bergamot oil."
    },
    {
        id: 4,
        name: "Matcha Ceremonial",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1515816506112-f3f6216a8175?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Green",
        description: "Vibrant, stone-ground green tea powder from Japan."
    },
    {
        id: 5,
        name: "Hibiscus Berry",
        price: 13.50,
        image: "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Herbal",
        description: "Tart and fruity blend of hibiscus, rosehips, and berries."
    },
    {
        id: 6,
        name: "Oolong Supreme",
        price: 18.00,
        image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Oolong",
        description: "Complex floral notes with a smooth, creamy finish."
    }
];

// --- State Management ---
let cart = JSON.parse(localStorage.getItem('zenTeaCart')) || [];

// --- DOM Elements ---
const featuredContainer = document.getElementById('featured-products-container');
const menuContainer = document.getElementById('menu-products-container');
const cartCountElements = document.querySelectorAll('.cart-count'); // Class to support multiple if needed
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalElement = document.getElementById('cart-total');

// --- Functions ---

// Save Cart
function saveCart() {
    localStorage.setItem('zenTeaCart', JSON.stringify(cart));
    updateCartCount();
}

// Update Cart Count in UI
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => el.textContent = count);
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    alert(`${product.name} added to cart!`); // Simple feedback for now
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

// Change Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCart();
        }
    }
}

// Render Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;
    return card;
}

// Render Featured Products (First 3)
function renderFeatured() {
    if (!featuredContainer) return;
    featuredContainer.innerHTML = '';
    products.slice(0, 3).forEach(product => {
        featuredContainer.appendChild(createProductCard(product));
    });
}

// Render Menu Page
function renderMenu() {
    if (!menuContainer) return;
    menuContainer.innerHTML = '';
    products.forEach(product => {
        menuContainer.appendChild(createProductCard(product));
    });
}

// Render Cart Page
function renderCart() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
        if (cartTotalElement) cartTotalElement.textContent = '$0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    if (cartTotalElement) cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderFeatured();
    renderMenu();
    renderCart();
});
