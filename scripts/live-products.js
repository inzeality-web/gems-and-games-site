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

  // Admin reveal shortcut: Ctrl/Cmd + Shift + A shows a temporary admin link
  function adminShortcut() {
    if (typeof window === 'undefined') return;
    let timer = null;
    function showLink() {
      if (location.pathname.endsWith('/admin.html') || location.pathname.endsWith('admin.html')) return;
      if (document.getElementById('secret-admin-link')) return;
      const a = document.createElement('a');
      a.id = 'secret-admin-link';
      a.href = '/admin.html';
      a.textContent = 'Admin';
      a.style.position = 'fixed';
      a.style.right = '12px';
      a.style.bottom = '12px';
      a.style.padding = '8px 10px';
      a.style.background = 'rgba(0,0,0,0.7)';
      a.style.color = '#fff';
      a.style.borderRadius = '8px';
      a.style.zIndex = 9999;
      a.style.fontSize = '14px';
      a.style.textDecoration = 'none';
      document.body.appendChild(a);
      // remove after 2 minutes
      timer = setTimeout(()=>{ const el = document.getElementById('secret-admin-link'); if(el) el.remove(); }, 120000);
    }

    window.addEventListener('keydown', e => {
      const mod = (e.ctrlKey || e.metaKey) && e.shiftKey && e.key && e.key.toLowerCase() === 'a';
      if (mod) {
        showLink();
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', adminShortcut);
  else adminShortcut();

})();
