const STORAGE_KEY = 'eds-cart';

// Reads the cart from localStorage. Returns [] if nothing stored yet.

export function getCart() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// Adds a sku to the cart, or increases its quantity if already present.

export function addToCart(sku, qty = 1){
    const cart = getCart();
    const existing = cart.find((item) => item.sku === sku);
    if(existing){
        existing.qty += qty;
    } else{
        cart.push({sku, qty});
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    // Let any listening UI (like a cart icon count) know something changed
    document.dispatchEvent(new CustomEvent('cart:updated'));
}
    // Removes a sku entirely from the cart.
    export function removeFromCart(sku) {
     const cart = getCart().filter((item) => item.sku !== sku);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    document.dispatchEvent(new CustomEvent('cart:updated'));
}

// Returns total number of items (for a cart badge/count).
export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}