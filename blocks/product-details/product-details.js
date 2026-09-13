import { addToCart } from '../../scripts/cart.js';

export default async function decorate(block) {
    
    // 1. The block's content is our authored table (SKU value only).
    //    block.textContent grabs whatever text is inside it, trimmed of whitespace.
    const cellSku = block.textContent.trim();

    //if the table cell is empty, look for ?sku=xxxx in the URL instead
    const params = new URLSearchParams(window.location.search);

    const sku = cellSku || params.get('sku');
    console.log('SKU from doc:', JSON.stringify(sku));

    block.innerHTML = '<p>Loading product...</p>'

    // 2. Fetch the same products.json "database" we already built.

    const resp = await fetch('/products.json');
    const json = await resp.json();
    console.log('All products:', json.data);
    const product = json.data.find((p) => p.sku === sku);

    if (!product) {
    block.innerHTML = '<p>Product not found.</p>';
    return;
  }

    const outOfStock = product.instock === 'false';

    // 3. Build the full detail view from the matched product row.
    block.innerHTML = `
    <div class="product-details-wrap">
      <div class="product-details-image">
        <img src="${product.image}" alt="${product.name}">
        ${outOfStock ? '<span class="badge">Out of Stock</span>' : ''}
      </div>
      <div class="product-details-info">
        <h1>${product.name}</h1>
        <p class="price">$${product.price}</p>
        <p class="description">${product.description}</p>
        <button class="add-to-cart-btn" ${outOfStock ? 'disabled' : ''} data-sku="${product.sku}">
          ${outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  `;

    const btn = block.querySelector('.add-to-cart-btn');
    if (btn && !outOfStock) {
        btn.addEventListener('click', () => {
        addToCart(product.sku, 1);
        btn.textContent = 'Added ✓';
        setTimeout(() => {
            btn.textContent = 'Add to Cart';
             }, 1200);
        });
    }
}