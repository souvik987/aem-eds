export default async function decorate(block) {
    // 1. block = the <div class="product-list block"> element EDS handed us.
  //    We don't care what the author put inside the table, so clear it out.

    block.innerHTML = '<P>Loading products....</p>';
   // 2. Fetch our "database" — the products sheet we published, served as JSON.
    
   const resp = await fetch('/products.json');
   const json = await resp.json();
   const products = json.data; // EDS wraps sheet rows in a `data` array

    // 3. Build a container we'll style with CSS Grid.
    const grid = document.createElement('div');
    grid.className = 'product-grid';

    // 4. Turn each row of the sheet into one product card.
    products.forEach((p) => {
        const card = document.createElement('a');
        card.className = 'product-card';
        card.href = `/products/${p.sku}`; // where the PDP will live later

    // instock comes in as the STRING "true"/"false", not a real boolean —
    // sheets always give you strings, so we compare against the string.
     const outOfStock = p.instock === 'false';

    card.innerHTML = `
      <div class="product-image-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${outOfStock ? '<span class="badge">Out of Stock</span>' : ''}
      </div>
      <h3>${p.name}</h3>
      <p class="price">$${p.price}</p>
    `;
    grid.append(card);
  });

  // 5. Replace the "Loading…" text with our finished grid.
  block.innerHTML = '';
  block.append(grid); 
}