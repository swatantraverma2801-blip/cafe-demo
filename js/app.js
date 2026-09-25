(() => {
  'use strict';
  const config = window.CAFE_CONFIG || {};
  const menu = Array.isArray(config.menu) ? config.menu : [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const cart = new Map();
  const safePhone = String(config.whatsappNumber || '').replace(/\D/g, '');
  const whatsappReady = /^\d{8,15}$/.test(safePhone);
  let toastTimeout;
  let lastFocused = null;

  const currency = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: config.currency || 'INR', maximumFractionDigits: 0
  });
  const money = amount => currency.format(Number(amount) || 0);
  const toastEl = $('#toast');
  const showToast = (message) => {
    if (!toastEl) return;
    clearTimeout(toastTimeout);
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    toastTimeout = setTimeout(() => toastEl.classList.remove('is-visible'), 4600);
  };
  const whatsappLink = message => `https://wa.me/${safePhone}?text=${encodeURIComponent(message)}`;
  const openWhatsApp = message => {
    if (!whatsappReady) {
      showToast('Add your café WhatsApp number in js/config.js to activate this feature.');
      return false;
    }
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
    return true;
  };

  // Edit all café contact details in one place: js/config.js.
  const brandName = String(config.name || 'Brew & Bloom');
  $$('[data-cafe-name]').forEach(el => el.textContent = brandName);
  if (config.address) $('#cafe-address').textContent = config.address;
  if (config.openingHours) $('#cafe-hours').textContent = config.openingHours;
  $('#year').textContent = new Date().getFullYear();
  if (config.phone) {
    const phone = $('#cafe-phone');
    phone.textContent = config.phone;
    phone.href = `tel:${String(config.phone).replace(/[^\d+]/g, '')}`;
    $('#contact-detail').hidden = false;
  }
  if (config.googleMapsUrl && /^https:\/\//i.test(config.googleMapsUrl)) {
    const mapLink = $('#map-link');
    mapLink.href = config.googleMapsUrl;
    mapLink.hidden = false;
  }
  if (config.instagramUrl && /^https:\/\//i.test(config.instagramUrl)) {
    const instagram = $('#instagram-link');
    instagram.href = config.instagramUrl;
    instagram.hidden = false;
  }
  if (whatsappReady) {
    const wa = $('#whatsapp-link');
    wa.href = whatsappLink(`Hello! I'd like to know more about ${brandName}.`);
    wa.hidden = false;
  }

  // If a photo CDN is unavailable, display beautiful local illustrations instead.
  function addImageFallback(image) {
    image.addEventListener('error', function fallback() {
      const localImage = image.dataset.fallback || 'assets/coffee-art.svg';
      image.removeEventListener('error', fallback);
      image.src = localImage;
    });
  }
  $$('img[data-fallback]').forEach(addImageFallback);

  const header = $('#site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 42);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  const closeMobileNav = () => {
    mobileNav.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };
  toggle.addEventListener('click', () => {
    mobileNav.hidden = !mobileNav.hidden;
    toggle.setAttribute('aria-expanded', String(!mobileNav.hidden));
    toggle.setAttribute('aria-label', mobileNav.hidden ? 'Open menu' : 'Close menu');
  });
  $$('#mobile-nav a').forEach(link => link.addEventListener('click', closeMobileNav));
  window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMobileNav(); });

  const menuGrid = $('#menu-grid');
  function menuCard(item) {
    const article = document.createElement('article');
    article.className = 'menu-card';
    article.dataset.id = item.id;
    const photoWrap = document.createElement('div');
    photoWrap.className = 'menu-card-image';
    const photo = document.createElement('img');
    photo.src = item.image || item.fallback || 'assets/coffee-art.svg';
    photo.alt = item.name;
    photo.loading = 'lazy';
    photo.dataset.fallback = item.fallback || 'assets/coffee-art.svg';
    addImageFallback(photo);
    photoWrap.append(photo);
    if (item.tag) {
      const tag = document.createElement('span');
      tag.className = 'menu-tag';
      tag.textContent = item.tag;
      photoWrap.append(tag);
    }
    const body = document.createElement('div');
    body.className = 'menu-card-body';
    const titleRow = document.createElement('div');
    titleRow.className = 'menu-title-row';
    const heading = document.createElement('h3');
    heading.textContent = item.name;
    const price = document.createElement('span');
    price.className = 'menu-price';
    price.textContent = money(item.price);
    titleRow.append(heading, price);
    const description = document.createElement('p');
    description.textContent = item.description || '';
    const orderButton = document.createElement('button');
    orderButton.type = 'button';
    orderButton.className = 'menu-order';
    orderButton.innerHTML = '<span>Add to my order</span><svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>';
    orderButton.setAttribute('aria-label', `Add ${item.name} to order`);
    orderButton.addEventListener('click', () => addToCart(item.id));
    body.append(titleRow, description, orderButton);
    article.append(photoWrap, body);
    return article;
  }
  function renderMenu(filter = 'all') {
    menuGrid.replaceChildren();
    menu.filter(item => filter === 'all' || item.category === filter)
      .forEach(item => menuGrid.appendChild(menuCard(item)));
    if (!menuGrid.children.length) {
      const message = document.createElement('p');
      message.textContent = 'More delicious things are coming soon.';
      menuGrid.append(message);
    }
  }
  renderMenu();
  $$('#menu-filters button').forEach(button => button.addEventListener('click', () => {
    $$('#menu-filters button').forEach(btn => {
      const active = button === btn;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    renderMenu(button.dataset.filter);
  }));

  const drawer = $('#cart-drawer');
  const overlay = $('#cart-overlay');
  const countEl = $('#cart-count');
  const cartItemsEl = $('#cart-items');
  const cartFooter = $('#cart-footer');
  const openCart = () => {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    $('#cart-close').focus();
  };
  const closeCart = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocused && typeof lastFocused.focus === 'function' && lastFocused.isConnected) lastFocused.focus();
  };
  $('#cart-trigger').addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  $('#cart-explore').addEventListener('click', () => {
    closeCart();
    $('#menu').scrollIntoView({ behavior: 'smooth' });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (drawer.classList.contains('is-open')) closeCart();
      else if (!mobileNav.hidden) closeMobileNav();
    }
    if (event.key === 'Tab' && drawer.classList.contains('is-open')) {
      const focusables = $$('button:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]', drawer)
        .filter(el => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  function addToCart(id) {
    const item = menu.find(menuItem => menuItem.id === id);
    if (!item) return;
    cart.set(id, (cart.get(id) || 0) + 1);
    renderCart();
    showToast(`${item.name} added to your order. Open the bag to send it on WhatsApp.`);
  }
  function updateQuantity(id, difference) {
    const next = (cart.get(id) || 0) + difference;
    if (next <= 0) cart.delete(id);
    else cart.set(id, Math.min(next, 99));
    renderCart();
  }
  function renderCart() {
    const quantity = [...cart.values()].reduce((sum, qty) => sum + qty, 0);
    countEl.textContent = String(quantity);
    countEl.hidden = quantity === 0;
    cartFooter.hidden = quantity === 0;
    cartItemsEl.replaceChildren();
    if (quantity === 0) {
      const empty = document.createElement('div');
      empty.className = 'cart-empty';
      empty.innerHTML = '<span aria-hidden="true">☕</span><h3>Nothing in your cup yet.</h3><p>Find something you love on the menu.</p><button class="btn btn-dark" id="cart-explore-empty" type="button">Explore our menu <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></button>';
      empty.querySelector('button').addEventListener('click', () => {
        closeCart();
        $('#menu').scrollIntoView({ behavior: 'smooth' });
      });
      cartItemsEl.append(empty);
      return;
    }
    for (const [id, qty] of cart) {
      const item = menu.find(entry => entry.id === id);
      if (!item) continue;
      const row = document.createElement('div');
      row.className = 'cart-row';
      const img = document.createElement('img');
      img.src = item.image || item.fallback;
      img.alt = '';
      img.dataset.fallback = item.fallback || 'assets/coffee-art.svg';
      addImageFallback(img);
      const info = document.createElement('div');
      const name = document.createElement('h3');
      name.textContent = item.name;
      const price = document.createElement('div');
      price.className = 'cart-row-price';
      price.textContent = money(item.price);
      const controls = document.createElement('div');
      controls.className = 'cart-row-bottom';
      const qtyCtrl = document.createElement('div');
      qtyCtrl.className = 'qty-control';
      const minus = document.createElement('button');
      minus.type = 'button';
      minus.textContent = '−';
      minus.setAttribute('aria-label', `Remove one ${item.name}`);
      minus.addEventListener('click', () => updateQuantity(id, -1));
      const amount = document.createElement('span');
      amount.textContent = String(qty);
      const plus = document.createElement('button');
      plus.type = 'button';
      plus.textContent = '+';
      plus.setAttribute('aria-label', `Add one ${item.name}`);
      plus.addEventListener('click', () => updateQuantity(id, 1));
      qtyCtrl.append(minus, amount, plus);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'cart-remove';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => { cart.delete(id); renderCart(); });
      controls.append(qtyCtrl, remove);
      info.append(name, price, controls);
      row.append(img, info);
      cartItemsEl.append(row);
    }
    const total = [...cart].reduce((sum, [id, qty]) => {
      const item = menu.find(entry => entry.id === id);
      return sum + (item ? Number(item.price) * qty : 0);
    }, 0);
    $('#cart-total').textContent = money(total);
  }
  renderCart();
  $('#checkout-btn').addEventListener('click', () => {
    if (!cart.size) { showToast('Add an item to your order first.'); return; }
    const lines = [...cart].map(([id, qty]) => {
      const item = menu.find(entry => entry.id === id);
      return item ? `• ${item.name} × ${qty} — ${money(item.price * qty)}` : '';
    }).filter(Boolean);
    const total = [...cart].reduce((sum, [id, qty]) => {
      const item = menu.find(entry => entry.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
    const orderType = $('#order-type').value;
    const notes = $('#order-notes').value.trim();
    const message = [
      `Hello ${brandName}! I'd like to place an order:`, '',
      ...lines, '', `Estimated total: ${money(total)}`,
      `Order type: ${orderType}`,
      notes ? `Notes / address: ${notes}` : '',
      '', 'Please confirm availability, final amount and pickup/delivery details. Thank you!'
    ].filter(line => line !== null && line !== undefined).join('\n');
    openWhatsApp(message);
  });

  // Table requests are handed off to WhatsApp, where the café confirms them.
  const bookingForm = $('#booking-form');
  const dateInput = $('#booking-date');
  const now = new Date();
  const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  dateInput.min = today;
  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const date = dateInput.value;
    if (date < today) { showToast('Please choose today or a future date.'); return; }
    const name = $('#booking-name').value.trim();
    const phone = $('#booking-phone').value.trim();
    const time = $('#booking-time').value;
    const guests = $('#booking-guests').value;
    const notes = $('#booking-note').value.trim();
    const message = [
      `Hello ${brandName}! I'd like to request a table.`, '',
      `Name: ${name}`, `Phone: ${phone}`, `Preferred date: ${date}`,
      `Preferred time: ${time}`, `Guests: ${guests}`,
      notes ? `Notes: ${notes}` : '',
      '', 'Please confirm availability. Thank you!'
    ].filter(Boolean).join('\n');
    openWhatsApp(message);
  });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-ready');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -35px 0px', threshold: 0.06 });
    $$('.reveal').forEach(el => observer.observe(el));
  }
})();
