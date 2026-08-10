/**
 * Wakey Owl — Main Application Orchestrator & View Controller (Indian Luxury Edition)
 */

const CURRENCIES = {
  INR: { symbol: "₹", rate: 1.0 },
  USD: { symbol: "$", rate: 0.012 },
  EUR: { symbol: "€", rate: 0.011 },
  GBP: { symbol: "£", rate: 0.0094 },
  AED: { symbol: "AED ", rate: 0.044 }
};
let currentCurrency = "INR";

class WakeyApp {
  constructor() {
    this.init();
  }

  init() {
    this.initNavbar();
    this.initSearchModal();
    this.initProductQuickView();
    this.initShopPage();
    this.initFeaturedHome();
    this.initCurrencySwitcher();
    this.initSoundToggle();
    this.initMobileMenu();
    this.initSmoothLinks();
    this.initContactForm();
    this.initNewsletter();
  }

  // Handle Contact Form with full preventDefault and visual feedback
  initContactForm() {
    document.addEventListener("submit", (e) => {
      const form = e.target.closest("#contact-concierge-form");
      if (form) {
        e.preventDefault();
        e.stopPropagation();

        const feedback = document.getElementById("contact-form-feedback");
        if (feedback) {
          feedback.innerHTML = `
            <div class="whitelist-success-pill animate-fade-in" style="background:rgba(212,175,55,0.15); border:1px solid #D4AF37; color:#D4AF37; padding:16px 20px; border-radius:14px; font-size:0.92rem; font-weight:600; line-height:1.5;">
              ✦ <strong>Private Concierge Dispatch Confirmed</strong><br />
              Your Master Sommelier VIP Token <strong>#WO-VIP-778</strong> has been logged at our Bangalore Roastery. Our team will contact you within 4 business hours.
            </div>
          `;
        }
        if (window.wakeyAudio) window.wakeyAudio.playSuccess();
        if (window.wakeyCart) window.wakeyCart.showToast("Concierge Request Transmitted Successfully!");
        form.reset();
      }
    });
  }

  // Handle Royal Society Newsletter Form with full preventDefault
  initNewsletter() {
    document.addEventListener("submit", (e) => {
      const form = e.target.closest("#newsletter-form");
      if (form) {
        e.preventDefault();
        e.stopPropagation();

        const input = form.querySelector("input[type='email']");
        const msg = document.getElementById("newsletter-msg");
        if (input && input.value) {
          if (msg) {
            msg.innerHTML = `
              <div class="animate-fade-in" style="padding:10px 16px; background:rgba(212,175,55,0.12); border:1px solid #D4AF37; border-radius:10px; color:#D4AF37; font-size:0.92rem; font-weight:600;">
                ✦ Welcome to the Royal Society. Use privilege code <strong>ROYAL15</strong> at checkout for 15% off.
              </div>
            `;
          }
          if (window.wakeyAudio) window.wakeyAudio.playSuccess();
          if (window.wakeyCart) window.wakeyCart.showToast("15% Royal Privilege Code ROYAL15 Unlocked!");
          form.reset();
        }
      }
    });
  }

  initNavbar() {
    const navbar = document.querySelector(".site-navbar");
    if (!navbar) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  initMobileMenu() {
    const hamburger = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-nav-drawer");
    const closeBtn = document.getElementById("mobile-nav-close");

    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", () => {
        mobileMenu.classList.add("open");
        document.body.classList.add("no-scroll");
        if (window.wakeyAudio) window.wakeyAudio.playClick();
      });
    }

    if (closeBtn && mobileMenu) {
      closeBtn.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        document.body.classList.remove("no-scroll");
      });
    }

    // Auto-close mobile drawer when any link is tapped
    if (mobileMenu) {
      mobileMenu.querySelectorAll("a, button").forEach(link => {
        link.addEventListener("click", () => {
          mobileMenu.classList.remove("open");
          document.body.classList.remove("no-scroll");
        });
      });
    }

    // Global Escape Key Listener for Modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (mobileMenu) mobileMenu.classList.remove("open");
        const searchModal = document.getElementById("search-modal-overlay");
        if (searchModal) searchModal.classList.remove("open");
        const qvModal = document.getElementById("quickview-modal-overlay");
        if (qvModal) qvModal.classList.remove("open");
        const floatAi = document.getElementById("floating-ai-modal");
        if (floatAi) floatAi.classList.remove("open");
        if (window.wakeyCart) {
          window.wakeyCart.closeDrawer();
          window.wakeyCart.closeCheckoutModal();
        }
        document.body.classList.remove("no-scroll");
      }
    });
  }

  initSoundToggle() {
    const btn = document.getElementById("sound-toggle-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        if (window.wakeyAudio) {
          window.wakeyAudio.toggleSound();
        }
      });
    }
  }

  initCurrencySwitcher() {
    const select = document.getElementById("currency-select");
    if (select) {
      select.value = currentCurrency;
      select.addEventListener("change", (e) => {
        currentCurrency = e.target.value;
        this.refreshPrices();
        if (window.wakeyAudio) window.wakeyAudio.playClick();
        if (window.wakeyCart) window.wakeyCart.updateUI();
      });
    }
  }

  formatPrice(amountInINR) {
    const curr = CURRENCIES[currentCurrency] || CURRENCIES.INR;
    const converted = amountInINR * curr.rate;
    if (currentCurrency === "INR") {
      return `₹${amountInINR.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${curr.symbol}${converted.toFixed(2)}`;
  }

  refreshPrices() {
    const priceEls = document.querySelectorAll("[data-inr-price]");
    priceEls.forEach(el => {
      const inr = parseFloat(el.getAttribute("data-inr-price"));
      if (!isNaN(inr)) {
        el.textContent = this.formatPrice(inr);
      }
    });
  }

  // Global Search Modal
  initSearchModal() {
    const searchTrigger = document.querySelector("[data-search-trigger]");
    if (!searchTrigger) return;

    if (!document.getElementById("search-modal-overlay")) {
      const searchHTML = `
        <div id="search-modal-overlay" class="modal-overlay">
          <div class="modal-card search-modal-card animate-scale-up">
            <div class="search-input-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" id="global-search-input" placeholder="Search estates (Chikmagalur, Attikan, Araku) or tasting notes (Mango, Cardamom, Cocoa)..." autofocus />
              <button type="button" class="btn-modal-close" id="search-modal-close">✕</button>
            </div>
            <div class="search-results-list" id="search-results-list">
              <div class="search-empty-hint">Type to scan our single-estate Indian coffee database...</div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", searchHTML);
    }

    const modal = document.getElementById("search-modal-overlay");
    const input = document.getElementById("global-search-input");
    const list = document.getElementById("search-results-list");
    const closeBtn = document.getElementById("search-modal-close");

    searchTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("open");
      document.body.classList.add("no-scroll");
      if (input) {
        input.value = "";
        input.focus();
        this.renderSearchResults("", list);
      }
      if (window.wakeyAudio) window.wakeyAudio.playClick();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
        document.body.classList.remove("no-scroll");
      });
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
        document.body.classList.remove("no-scroll");
      }
    });

    if (input && list) {
      input.addEventListener("input", (e) => {
        this.renderSearchResults(e.target.value, list);
      });
    }
  }

  renderSearchResults(query, container) {
    const q = query.trim().toLowerCase();
    if (!q) {
      container.innerHTML = `
        <div class="search-quick-tags">
          <span>Popular Searches:</span>
          <button type="button" class="search-tag-chip" data-search-term="Attikan">Attikan Estate</button>
          <button type="button" class="search-tag-chip" data-search-term="Ratnagiri">Ratnagiri Mango</button>
          <button type="button" class="search-tag-chip" data-search-term="Filter">South Indian Filter</button>
          <button type="button" class="search-tag-chip" data-search-term="Araku">Araku Valley</button>
          <button type="button" class="search-tag-chip" data-search-term="Malabar">Monsooned Malabar</button>
        </div>
      `;

      container.querySelectorAll(".search-tag-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          const val = chip.getAttribute("data-search-term");
          const input = document.getElementById("global-search-input");
          if (input) {
            input.value = val;
            this.renderSearchResults(val, container);
          }
        });
      });
      return;
    }

    const matches = WAKEY_PRODUCTS.filter(p => {
      return p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.altitude.toLowerCase().includes(q) ||
        p.estate.toLowerCase().includes(q) ||
        p.flavorNotes.some(n => n.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q);
    });

    if (matches.length === 0) {
      container.innerHTML = `<div class="search-empty-hint">No estate coffees found matching "${query}". Try searching "Chikmagalur", "Attikan", or "Filter".</div>`;
      return;
    }

    container.innerHTML = matches.map(p => `
      <div class="search-result-item" data-product-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" class="search-thumb" />
        <div class="search-item-info">
          <div class="search-item-title">${p.name} <span class="search-badge">★ ${p.cuppingScore}</span></div>
          <div class="search-item-notes">${p.estate} • ${p.flavorNotes.join(" • ")}</div>
        </div>
        <div class="search-item-price">${this.formatPrice(p.priceINR)}</div>
      </div>
    `).join("");

    container.querySelectorAll(".search-result-item").forEach(item => {
      item.addEventListener("click", () => {
        const pId = item.getAttribute("data-product-id");
        document.getElementById("search-modal-overlay").classList.remove("open");
        document.body.classList.remove("no-scroll");
        this.openQuickView(pId);
      });
    });
  }

  // Home Featured Grid (First 3 Signature Indian Estates)
  initFeaturedHome() {
    const container = document.getElementById("featured-roasts-grid");
    if (!container) return;

    const featured = WAKEY_PRODUCTS.slice(0, 3);
    container.innerHTML = featured.map(p => this.createProductCardHTML(p)).join("");

    if (window.wakeyTilt) window.wakeyTilt.refresh();
    this.bindProductCardActions(container);
  }

  // Shop Page Catalog & Filters
  initShopPage() {
    const grid = document.getElementById("shop-products-grid");
    if (!grid) return;

    let activeFilter = "all";
    let activeSort = "featured";

    const render = () => {
      let list = [...WAKEY_PRODUCTS];

      if (activeFilter !== "all") {
        if (activeFilter === "single-estate") {
          list = list.filter(p => p.category === "estate-single-origin");
        } else if (activeFilter === "heritage-filter") {
          list = list.filter(p => p.category === "heritage-roast");
        } else if (activeFilter === "imperial") {
          list = list.filter(p => p.isImperialCuration);
        }
      }

      if (activeSort === "cupping") {
        list.sort((a, b) => b.cuppingScore - a.cuppingScore);
      } else if (activeSort === "price-low") {
        list.sort((a, b) => a.priceINR - b.priceINR);
      } else if (activeSort === "price-high") {
        list.sort((a, b) => b.priceINR - a.priceINR);
      } else if (activeSort === "rating") {
        list.sort((a, b) => b.rating - a.rating);
      }

      grid.innerHTML = list.map(p => this.createProductCardHTML(p)).join("");
      const countEl = document.getElementById("shop-count-indicator");
      if (countEl) countEl.textContent = `Displaying ${list.length} Royal Indian & Global Allocations`;

      if (window.wakeyTilt) window.wakeyTilt.refresh();
      this.bindProductCardActions(grid);
    };

    const filterBtns = document.querySelectorAll("[data-filter-category]");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.getAttribute("data-filter-category");
        if (window.wakeyAudio) window.wakeyAudio.playClick();
        render();
      });
    });

    const sortSelect = document.getElementById("shop-sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        activeSort = e.target.value;
        if (window.wakeyAudio) window.wakeyAudio.playClick();
        render();
      });
    }

    render();
  }

  createProductCardHTML(p) {
    return `
      <div class="luxury-product-card" data-tilt data-product-id="${p.id}">
        <div class="card-glass-sheen"></div>
        <div class="card-header-badge-row">
          <span class="card-roast-badge" style="color: ${p.accentColor}; border-color: ${p.accentColor}44;">
            ${p.badge}
          </span>
          <span class="card-cupping-score">★ ${p.cuppingScore} / 100</span>
        </div>

        <div class="card-media-wrapper">
          <img src="${p.image}" alt="${p.name}" class="card-product-img" loading="lazy" />
          <div class="card-glow-halo" style="background: radial-gradient(circle, ${p.accentColor}22 0%, transparent 70%);"></div>
          <button type="button" class="btn-quick-view" data-quickview-id="${p.id}">Sensory Profile & Pairings</button>
        </div>

        <div class="card-content">
          <div class="card-origin-pill">${p.altitude}</div>
          <h3 class="card-title">${p.name}</h3>
          <p class="card-subtitle">${p.subtitle}</p>

          <div class="card-flavor-tags">
            ${p.flavorNotes.slice(0, 3).map(n => `<span class="tag-flavor-mini">${n}</span>`).join("")}
          </div>

          <div class="card-roast-gauge-row">
            <span class="gauge-label">${p.roastLevel}</span>
            <div class="gauge-bar-track">
              <div class="gauge-bar-fill" style="width: ${p.radar.intensity}%; background: ${p.accentColor};"></div>
            </div>
          </div>

          <div class="card-footer-row">
            <div class="card-price-block">
              <span class="card-price-label">Artisanal 250g Tin</span>
              <span class="card-price-value" data-inr-price="${p.priceINR}">${this.formatPrice(p.priceINR)}</span>
            </div>

            <button type="button" class="btn btn-glow-gold btn-card-add" data-add-direct="${p.id}" aria-label="Add ${p.name} to Bag">
              <span>Add to Bag</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  bindProductCardActions(container) {
    container.querySelectorAll(".btn-quick-view").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const pId = btn.getAttribute("data-quickview-id");
        this.openQuickView(pId);
      });
    });

    container.querySelectorAll(".btn-card-add").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const pId = btn.getAttribute("data-add-direct");
        if (window.wakeyCart) {
          window.wakeyCart.addItem(pId, 1, "whole-bean", "250g");
          window.wakeyCart.openDrawer();
        }
      });
    });

    container.querySelectorAll(".luxury-product-card").forEach(card => {
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".btn-card-add") && !e.target.closest(".btn-quick-view")) {
          const pId = card.getAttribute("data-product-id");
          this.openQuickView(pId);
        }
      });
    });
  }

  // Interactive Product Quick-View Modal
  initProductQuickView() {
    if (!document.getElementById("quickview-modal-overlay")) {
      const modalHTML = `
        <div id="quickview-modal-overlay" class="modal-overlay">
          <div class="modal-card quickview-modal-card animate-scale-up" id="quickview-card-content">
            <!-- Injected by JS -->
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHTML);
    }
  }

  openQuickView(productId) {
    const product = WAKEY_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    if (window.wakeyAudio) window.wakeyAudio.playClick();
    const overlay = document.getElementById("quickview-modal-overlay");
    const container = document.getElementById("quickview-card-content");

    let selectedGrind = "whole-bean";
    let selectedSize = "250g";
    let quantity = 1;

    const renderModal = () => {
      const sizeObj = BAG_SIZES.find(s => s.id === selectedSize) || BAG_SIZES[0];
      const calculatedINR = product.priceINR * sizeObj.multiplier * quantity;

      container.innerHTML = `
        <button type="button" class="btn-modal-close" id="btn-qv-close">✕</button>

        <div class="quickview-grid">
          <div class="qv-media-col" data-tilt>
            <div class="qv-img-wrapper">
              <img src="${product.image}" alt="${product.name}" class="qv-main-img" />
              <div class="qv-halo" style="background: radial-gradient(circle, ${product.accentColor}33 0%, transparent 70%);"></div>
            </div>
            <div class="qv-spec-matrix">
              <div class="qv-spec-pill"><strong>Terroir:</strong> ${product.altitude}</div>
              <div class="qv-spec-pill"><strong>Estate:</strong> ${product.estate}</div>
              <div class="qv-spec-pill"><strong>Varietal:</strong> ${product.varietal}</div>
              <div class="qv-spec-pill"><strong>Cupping Score:</strong> ★ ${product.cuppingScore} / 100</div>
            </div>
          </div>

          <div class="qv-details-col">
            <div class="qv-badges-row">
              <span class="badge-sommelier-match">${product.badge}</span>
              <span class="badge-roast-level" style="color:${product.accentColor}">${product.roastLevel}</span>
            </div>

            <h2 class="qv-title">${product.name}</h2>
            <p class="qv-subtitle" style="color:#D4AF37;">${product.subtitle}</p>
            <p class="qv-description">${product.description}</p>

            <!-- Tasting Notes -->
            <div class="qv-flavor-notes-row">
              <span class="qv-label">Flavor Notes:</span>
              <div class="qv-notes-list">
                ${product.flavorNotes.map(n => `<span class="flavor-tag glow-tag">${n}</span>`).join("")}
              </div>
            </div>

            <!-- Gourmet Food Pairings -->
            <div style="margin-bottom: 18px; padding: 12px 16px; background: rgba(212,175,55,0.06); border: 1px solid rgba(212,175,55,0.2); border-radius: 12px;">
              <span class="qv-label" style="color:#D4AF37; margin-bottom:4px;">✦ Gourmet Food & Dessert Pairings:</span>
              <div style="font-size: 0.85rem; color: var(--text-primary); line-height: 1.45;">
                ${product.foodPairings.join(" • ")}
              </div>
            </div>

            <!-- Package Size Selector -->
            <div class="qv-option-group">
              <span class="qv-label">Select Volume:</span>
              <div class="qv-sizes-grid">
                ${BAG_SIZES.map(s => `
                  <button type="button" class="qv-pill-btn ${selectedSize === s.id ? 'active' : ''}" data-size-id="${s.id}">
                    <span>${s.label}</span>
                    ${s.save ? `<span class="pill-save-tag">${s.save}</span>` : ''}
                  </button>
                `).join("")}
              </div>
            </div>

            <!-- Grind Calibration Selector -->
            <div class="qv-option-group">
              <span class="qv-label">Grind Calibration:</span>
              <select id="qv-grind-select" class="qv-select-input">
                ${GRIND_OPTIONS.map(g => `
                  <option value="${g.id}" ${selectedGrind === g.id ? 'selected' : ''}>${g.label}</option>
                `).join("")}
              </select>
            </div>

            <!-- Pricing & Add to Bag -->
            <div class="qv-action-bottom">
              <div class="qv-qty-picker">
                <button type="button" class="btn-qty" id="qv-qty-dec">-</button>
                <span class="qty-val">${quantity}</span>
                <button type="button" class="btn-qty" id="qv-qty-inc">+</button>
              </div>

              <button type="button" class="btn btn-glow-gold btn-large" id="qv-add-cart-btn" style="flex:1;">
                <span>Add to Royal Bag — ${this.formatPrice(calculatedINR)}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      `;

      container.querySelectorAll("[data-size-id]").forEach(btn => {
        btn.addEventListener("click", () => {
          selectedSize = btn.getAttribute("data-size-id");
          if (window.wakeyAudio) window.wakeyAudio.playClick();
          renderModal();
        });
      });

      const grindSelect = container.querySelector("#qv-grind-select");
      if (grindSelect) {
        grindSelect.addEventListener("change", (e) => {
          selectedGrind = e.target.value;
        });
      }

      const decBtn = container.querySelector("#qv-qty-dec");
      const incBtn = container.querySelector("#qv-qty-inc");
      if (decBtn) {
        decBtn.addEventListener("click", () => {
          if (quantity > 1) {
            quantity--;
            renderModal();
          }
        });
      }
      if (incBtn) {
        incBtn.addEventListener("click", () => {
          quantity++;
          renderModal();
        });
      }

      const addBtn = container.querySelector("#qv-add-cart-btn");
      if (addBtn) {
        addBtn.addEventListener("click", () => {
          if (window.wakeyCart) {
            window.wakeyCart.addItem(product.id, quantity, selectedGrind, selectedSize);
            overlay.classList.remove("open");
            document.body.classList.remove("no-scroll");
            window.wakeyCart.openDrawer();
          }
        });
      }

      const closeBtn = container.querySelector("#btn-qv-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          overlay.classList.remove("open");
          document.body.classList.remove("no-scroll");
        });
      }
    };

    renderModal();
    overlay.classList.add("open");
    document.body.classList.add("no-scroll");

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("open");
        document.body.classList.remove("no-scroll");
      }
    });
  }

  initSmoothLinks() {
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
      anchor.addEventListener("click", function(e) {
        const href = this.getAttribute("href");
        if (href !== "#" && href.startsWith("#")) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.wakeyApp = new WakeyApp();
});
