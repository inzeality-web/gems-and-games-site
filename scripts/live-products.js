// Live products renderer using Socket.IO
(() => {
  function renderProductsIntoGrid(products, grid) {
    grid.innerHTML = '';
    products.forEach(p => {
      const art = document.createElement('article');
      art.className = 'card';
      art.innerHTML = `
        <div class="thumb"><img src="${p.image}" alt="${p.title}"></div>
        <div class="meta">
          <div>
            <div class="title">${p.title}</div>
            <div class="cat">${p.category}</div>
          </div>
          <div class="price">$${Number(p.price).toFixed(2)}</div>
        </div>
        <div class="muted">${p.description || ''}</div>
        <div class="actions"><button class="btn">Details</button><button class="btn primary">Add to cart</button></div>
      `;
      grid.appendChild(art);
    });
  }

  function renderProductsIntoList(products, list) {
    list.innerHTML = '';
    products.forEach(p => {
      const li = document.createElement('div');
      li.className = 'product-item';
      li.innerHTML = `<strong>${p.title}</strong> — $${Number(p.price).toFixed(2)} | ${p.category}`;
      list.appendChild(li);
    });
  }

  // Connect if Socket.IO client is present and any target nodes exist
  function init() {
    const grid = document.querySelector('#products');
    const list = document.querySelector('#productList');
    if (!grid && !list) return;
    if (typeof io === 'undefined') return;
    try {
      const socket = io();
      socket.on('products', products => {
        if (grid) renderProductsIntoGrid(products, grid);
        if (list) renderProductsIntoList(products, list);
      });
    } catch (e) {
      console.warn('live-products: socket init failed', e);
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
