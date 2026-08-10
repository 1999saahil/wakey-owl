/**
 * Wakey Owl — Luxury Royal Cart Engine (Indian Currency, PIN Code & GST Integration)
 */

class WakeyCart {
  constructor() {
    this.storageKey = "wakey_owl_royal_cart";
    this.items = this.loadCart();
    this.activeDiscountCode = null;
    this.discountPercent = 0;
    this.discountFlatINR = 0;
    this.pincodeValid = null;
    this.isHeirloomGift = false;
    this.giftBoxCostINR = 250;
    this.freeShippingThresholdINR = 1500;
    this.baseShippingINR = 150;

    this.init();
  }

  init() {
    this.injectDrawer();
    this.injectCheckoutModal();
    this.bindEvents();
    this.updateUI();
  }

  loadCart() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("Could not load cart from localStorage", e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  }

  addItem(productId, quantity = 1, grind = "whole-bean", size = "250g") {
    const product = WAKEY_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = this.items.findIndex(
      item => item.id === productId && item.grind === grind && item.size === size
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        subtitle: product.subtitle,
        estate: product.estate,
        altitude: product.altitude,
        priceINR: product.priceINR,
        image: product.image,
        accentColor: product.accentColor,
        grind: grind,
        size: size,
        quantity: quantity
      });
    }

    this.saveCart();
    this.updateUI();
    if (window.wakeyAudio) window.wakeyAudio.playSuccess();
    this.showToast(`✦ Added ${product.name} (${size}) to Royal Bag`);
  }

  removeItem(index) {
    if (index >= 0 && index < this.items.length) {
      const removed = this.items.splice(index, 1);
      this.saveCart();
      this.updateUI();
      if (window.wakeyAudio) window.wakeyAudio.playClick();
      if (removed[0]) {
        this.showToast(`Removed ${removed[0].name} from bag`);
      }
    }
  }

  updateQuantity(index, newQty) {
    if (index >= 0 && index < this.items.length) {
      if (newQty <= 0) {
        this.removeItem(index);
      } else {
        this.items[index].quantity = newQty;
        this.saveCart();
        this.updateUI();
      }
    }
  }

  clearCart() {
    this.items = [];
    this.activeDiscountCode = null;
    this.discountPercent = 0;
    this.discountFlatINR = 0;
    this.saveCart();
    this.updateUI();
  }

  getTotalCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getCalculations() {
    let subtotalINR = 0;

    this.items.forEach(item => {
      const sizeObj = (typeof BAG_SIZES !== "undefined")
        ? (BAG_SIZES.find(s => s.id === item.size) || { multiplier: 1.0 })
        : { multiplier: 1.0 };
      const itemBase = item.priceINR * sizeObj.multiplier;
      subtotalINR += itemBase * item.quantity;
    });

    let discountINR = 0;
    if (this.discountPercent > 0) {
      discountINR += (subtotalINR * this.discountPercent) / 100;
    }
    if (this.discountFlatINR > 0) {
      discountINR += this.discountFlatINR;
    }
    if (discountINR > subtotalINR) discountINR = subtotalINR;

    const isFreeShipping = subtotalINR >= this.freeShippingThresholdINR || subtotalINR === 0;
    const shippingINR = isFreeShipping ? 0 : this.baseShippingINR;
    const giftCost = this.isHeirloomGift ? this.giftBoxCostINR : 0;
    const totalINR = Math.max(0, subtotalINR - discountINR + shippingINR + giftCost);

    return {
      subtotalINR,
      discountINR,
      shippingINR,
      giftCost,
      isFreeShipping,
      amountToFreeShipping: Math.max(0, this.freeShippingThresholdINR - subtotalINR),
      totalINR
    };
  }

  formatPrice(amountInINR) {
    if (window.wakeyApp && typeof window.wakeyApp.formatPrice === "function") {
      return window.wakeyApp.formatPrice(amountInINR);
    }
    return `₹${amountInINR.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  injectDrawer() {
    if (document.getElementById("cart-drawer")) return;

    const drawerHTML = `
      <div id="cart-drawer-overlay" class="drawer-overlay"></div>
      <div id="cart-drawer" class="cart-drawer-panel">
        <div class="drawer-header">
          <div class="drawer-title-wrap">
            <span class="drawer-gold-crest">✦</span>
            <h3>Your Royal Bag <span id="drawer-item-count">(0)</span></h3>
          </div>
          <button type="button" class="btn-modal-close" id="btn-close-cart" aria-label="Close Bag">✕</button>
        </div>

        <!-- Free Royal Courier Meter -->
        <div class="shipping-meter-container" id="shipping-meter-box">
          <div class="shipping-meter-label" id="shipping-meter-text">
            Complimentary Royal Air Courier on orders above ₹1,500
          </div>
          <div class="shipping-meter-bar">
            <div class="shipping-meter-progress" id="shipping-meter-fill"></div>
          </div>
        </div>

        <!-- Cart Items List -->
        <div class="drawer-items-list" id="drawer-items-container">
          <!-- Dynamically Injected -->
        </div>

        <!-- Pincode Checker & Gift Box -->
        <div class="drawer-addon-section">
          <!-- PIN Code Check -->
          <div class="pincode-check-wrap">
            <input type="text" id="cart-pincode-input" placeholder="Enter 6-Digit Delivery PIN (e.g. 560001)" maxlength="6" />
            <button type="button" id="btn-check-pincode" class="btn btn-glass btn-small">Verify PIN</button>
          </div>
          <div id="pincode-status-msg" class="pincode-msg"></div>

          <!-- Heirloom Gift Box Option -->
          <div class="gift-addon-row">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.84rem;">
              <input type="checkbox" id="cart-heirloom-gift-toggle" />
              <span>Add Velvet-Lined Heirloom Gift Chest (+₹250)</span>
            </label>
          </div>
        </div>

        <!-- Promo Code Input -->
        <div class="drawer-promo-wrap">
          <input type="text" id="promo-code-input" placeholder="Privilege Code (Try: ROYAL15 / IMPERIAL)" />
          <button type="button" id="btn-apply-promo" class="btn btn-glass btn-small">Apply</button>
        </div>
        <div id="promo-code-feedback" class="promo-feedback-msg"></div>

        <!-- Drawer Footer & Totals -->
        <div class="drawer-footer">
          <div class="drawer-totals-row">
            <span>Subtotal</span>
            <span id="drawer-subtotal-val">₹0.00</span>
          </div>

          <div class="drawer-totals-row discount-row" id="drawer-discount-row" style="display:none;">
            <span>Royal Privilege Discount</span>
            <span id="drawer-discount-val">-₹0.00</span>
          </div>

          <div class="drawer-totals-row" id="drawer-gift-row" style="display:none;">
            <span>Heirloom Gift Presentation</span>
            <span id="drawer-gift-val">+₹250.00</span>
          </div>

          <div class="drawer-totals-row">
            <span>Royal Express Courier</span>
            <span id="drawer-shipping-val">FREE</span>
          </div>

          <div class="drawer-totals-row final-total-row">
            <span>Grand Allocation Total</span>
            <span id="drawer-total-val" class="text-gradient-gold">₹0.00</span>
          </div>

          <button type="button" class="btn btn-glow-gold btn-block btn-large" id="btn-checkout-start">
            <span>Proceed to Royal Dispatch</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          <div style="text-align:center; margin-top:10px;">
            <a href="shop.html" class="link-continue-shopping" id="link-close-and-shop">Explore More Single-Estates</a>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", drawerHTML);
  }

  injectCheckoutModal() {
    if (document.getElementById("checkout-modal-overlay")) return;

    const modalHTML = `
      <div id="checkout-modal-overlay" class="modal-overlay">
        <div class="modal-card checkout-modal-card animate-scale-up">
          <div class="modal-header">
            <div class="modal-brand">
              <span class="modal-owl-crest" style="color:#D4AF37;">✦</span>
              <h3>Wakey Owl — Royal Estate Dispatch</h3>
            </div>
            <button type="button" class="btn-modal-close" id="checkout-modal-close">✕</button>
          </div>

          <div class="checkout-modal-body" id="checkout-modal-step-container">
            <form id="checkout-form" class="checkout-form-grid">
              <div class="form-section-title">1. Dispatch Address in India</div>
              <div class="form-row form-row-split">
                <div class="form-group">
                  <label>Full Name</label>
                  <input type="text" class="input-field" required placeholder="Aditya Roy" value="Aditya Roy" />
                </div>
                <div class="form-group">
                  <label>Phone (+91 for Courier Updates)</label>
                  <input type="tel" class="input-field" required placeholder="+91 98765 43210" value="+91 98840 12345" />
                </div>
              </div>
              <div class="form-group">
                <label>Email (for Roast Batch & Invoicing)</label>
                <input type="email" class="input-field" required placeholder="aditya@royalestate.in" value="aditya@wakeyowl.luxury" />
              </div>
              <div class="form-group">
                <label>Delivery Address / Penthouse / Villa</label>
                <input type="text" class="input-field" required placeholder="74 Lavender Bough, Sadashivanagar" value="Plot 14, Royal Palm Avenue, Sadashivanagar" />
              </div>
              <div class="form-row form-row-split">
                <div class="form-group">
                  <label>City</label>
                  <input type="text" class="input-field" required placeholder="Bengaluru" value="Bengaluru" />
                </div>
                <div class="form-group">
                  <label>PIN Code</label>
                  <input type="text" class="input-field" required placeholder="560080" value="560080" />
                </div>
              </div>

              <!-- Corporate GST Toggle -->
              <div style="margin-top: 12px;">
                <label style="display:flex; align-items:center; gap:8px; font-size:0.84rem; color:var(--text-secondary); cursor:pointer;">
                  <input type="checkbox" id="gst-invoice-toggle" />
                  <span>I require a Tax Invoice with Corporate GSTIN</span>
                </label>
                <div id="gst-input-box" style="display:none; margin-top:8px;">
                  <input type="text" class="input-field" placeholder="Enter 15-Digit GSTIN (e.g. 29ABCDE1234F1Z5)" />
                </div>
              </div>

              <div class="form-section-title" style="margin-top: 20px;">2. Payment Channel</div>
              <div class="payment-method-selector">
                <label class="pay-radio selected">
                  <input type="radio" name="payment-method" checked />
                  <span>UPI (Google Pay / PhonePe / Cred)</span>
                </label>
                <label class="pay-radio">
                  <input type="radio" name="payment-method" />
                  <span>Luxury Credit / Debit Cards (Amex / Visa)</span>
                </label>
                <label class="pay-radio">
                  <input type="radio" name="payment-method" />
                  <span>NetBanking (HDFC / ICICI / SBI)</span>
                </label>
              </div>

              <div class="checkout-summary-pill" id="modal-checkout-summary-pill">
                <!-- Dynamic Summary -->
              </div>

              <button type="submit" class="btn btn-glow-gold btn-block btn-large" style="margin-top: 20px;">
                <span>Authorize & Roast to Order</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  updateUI() {
    const calcs = this.getCalculations();
    const count = this.getTotalCount();

    const badgeElements = document.querySelectorAll(".nav-cart-badge, .cart-count-badge");
    badgeElements.forEach(el => {
      el.textContent = count;
      el.classList.toggle("has-items", count > 0);
    });

    const headerCount = document.getElementById("drawer-item-count");
    if (headerCount) headerCount.textContent = `(${count})`;

    // Shipping Meter
    const meterText = document.getElementById("shipping-meter-text");
    const meterFill = document.getElementById("shipping-meter-fill");
    if (meterText && meterFill) {
      if (calcs.isFreeShipping) {
        meterText.innerHTML = `✨ <strong>Complimentary Royal Courier</strong> Unlocked!`;
        meterFill.style.width = "100%";
        meterFill.style.background = "linear-gradient(90deg, #D4AF37, #FF9E1B)";
      } else {
        const pct = Math.min(100, Math.round((calcs.subtotalINR / this.freeShippingThresholdINR) * 100));
        meterText.innerHTML = `Add <strong>${this.formatPrice(calcs.amountToFreeShipping)}</strong> more for Complimentary Royal Courier`;
        meterFill.style.width = `${pct}%`;
        meterFill.style.background = "linear-gradient(90deg, #00F0FF, #D4AF37)";
      }
    }

    // Render Items
    const itemsContainer = document.getElementById("drawer-items-container");
    if (itemsContainer) {
      if (this.items.length === 0) {
        itemsContainer.innerHTML = `
          <div class="empty-cart-view">
            <div class="empty-cart-icon">☕</div>
            <h4>Your Royal Bag is Empty</h4>
            <p>Explore our single-estate Indian harvest allocations.</p>
            <a href="shop.html" class="btn btn-glow-gold btn-small" id="btn-empty-shop">Explore Estates</a>
          </div>
        `;
        const shopBtn = itemsContainer.querySelector("#btn-empty-shop");
        if (shopBtn) {
          shopBtn.addEventListener("click", () => this.closeDrawer());
        }
      } else {
        itemsContainer.innerHTML = this.items.map((item, idx) => {
          const sizeObj = (typeof BAG_SIZES !== "undefined")
            ? (BAG_SIZES.find(s => s.id === item.size) || { multiplier: 1.0, label: item.size })
            : { multiplier: 1.0, label: item.size };
          const grindObj = (typeof GRIND_OPTIONS !== "undefined")
            ? (GRIND_OPTIONS.find(g => g.id === item.grind) || { label: item.grind })
            : { label: item.grind };

          const lineTotalINR = item.priceINR * sizeObj.multiplier * item.quantity;

          return `
            <div class="cart-item-card" data-cart-index="${idx}">
              <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" />
              <div class="cart-item-details">
                <div class="cart-item-title-row">
                  <h4>${item.name}</h4>
                  <button type="button" class="btn-remove-item" data-remove-idx="${idx}" title="Remove">✕</button>
                </div>
                <div class="cart-item-variant">
                  <span>${sizeObj.label || item.size}</span> • <span>${grindObj.label || item.grind}</span>
                </div>
                <div class="cart-item-estate">${item.altitude}</div>

                <div class="cart-item-bottom-row">
                  <div class="cart-qty-ctrl">
                    <button type="button" class="btn-qty-mini" data-qty-dec="${idx}">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" class="btn-qty-mini" data-qty-inc="${idx}">+</button>
                  </div>
                  <div class="cart-item-price-val">${this.formatPrice(lineTotalINR)}</div>
                </div>
              </div>
            </div>
          `;
        }).join("");

        // Bind item controls
        itemsContainer.querySelectorAll("[data-remove-idx]").forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-remove-idx"));
            this.removeItem(idx);
          });
        });

        itemsContainer.querySelectorAll("[data-qty-dec]").forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-qty-dec"));
            this.updateQuantity(idx, this.items[idx].quantity - 1);
          });
        });

        itemsContainer.querySelectorAll("[data-qty-inc]").forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-qty-inc"));
            this.updateQuantity(idx, this.items[idx].quantity + 1);
          });
        });
      }
    }

    // Update Totals
    const subtotalEl = document.getElementById("drawer-subtotal-val");
    if (subtotalEl) subtotalEl.textContent = this.formatPrice(calcs.subtotalINR);

    const discountRow = document.getElementById("drawer-discount-row");
    const discountVal = document.getElementById("drawer-discount-val");
    if (discountRow && discountVal) {
      if (calcs.discountINR > 0) {
        discountRow.style.display = "flex";
        discountVal.textContent = `-${this.formatPrice(calcs.discountINR)}`;
      } else {
        discountRow.style.display = "none";
      }
    }

    const giftRow = document.getElementById("drawer-gift-row");
    if (giftRow) {
      giftRow.style.display = this.isHeirloomGift ? "flex" : "none";
    }

    const shippingEl = document.getElementById("drawer-shipping-val");
    if (shippingEl) {
      if (calcs.isFreeShipping) {
        shippingEl.textContent = "COMPLIMENTARY";
        shippingEl.style.color = "#00F0FF";
      } else {
        shippingEl.textContent = this.formatPrice(calcs.shippingINR);
        shippingEl.style.color = "var(--text-secondary)";
      }
    }

    const totalEl = document.getElementById("drawer-total-val");
    if (totalEl) totalEl.textContent = this.formatPrice(calcs.totalINR);

    // Update Checkout Modal Pill
    const modalPill = document.getElementById("modal-checkout-summary-pill");
    if (modalPill) {
      modalPill.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>Allocations (${count} Items):</span>
          <span>${this.formatPrice(calcs.subtotalINR)}</span>
        </div>
        ${calcs.discountINR > 0 ? `
          <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:#D4AF37;">
            <span>Privilege Discount:</span>
            <span>-${this.formatPrice(calcs.discountINR)}</span>
          </div>
        ` : ''}
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>Courier Dispatch:</span>
          <span>${calcs.isFreeShipping ? 'FREE' : this.formatPrice(calcs.shippingINR)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-weight:800; font-size:1.1rem; color:#FFF; border-top:1px solid rgba(255,255,255,0.1); padding-top:6px; margin-top:6px;">
          <span>Total Authorized:</span>
          <span style="color:#D4AF37;">${this.formatPrice(calcs.totalINR)}</span>
        </div>
      `;
    }
  }

  bindEvents() {
    // Open cart drawer triggers
    document.querySelectorAll("[data-cart-open]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Close drawer
    const closeBtn = document.getElementById("btn-close-cart");
    const overlay = document.getElementById("cart-drawer-overlay");
    const linkShop = document.getElementById("link-close-and-shop");

    if (closeBtn) closeBtn.addEventListener("click", () => this.closeDrawer());
    if (overlay) overlay.addEventListener("click", () => this.closeDrawer());
    if (linkShop) linkShop.addEventListener("click", () => this.closeDrawer());

    // Promo Code
    const promoBtn = document.getElementById("btn-apply-promo");
    const promoInput = document.getElementById("promo-code-input");
    const promoFeedback = document.getElementById("promo-code-feedback");

    if (promoBtn && promoInput) {
      promoBtn.addEventListener("click", () => {
        const code = promoInput.value.trim().toUpperCase();
        if (code === "ROYAL15") {
          this.activeDiscountCode = "ROYAL15";
          this.discountPercent = 15;
          this.discountFlatINR = 0;
          promoFeedback.textContent = "✦ 15% Royal Privilege Code Applied!";
          promoFeedback.style.color = "#D4AF37";
          if (window.wakeyAudio) window.wakeyAudio.playSuccess();
        } else if (code === "WAKEY10") {
          this.activeDiscountCode = "WAKEY10";
          this.discountPercent = 10;
          this.discountFlatINR = 0;
          promoFeedback.textContent = "✦ 10% Connoisseur Privilege Applied!";
          promoFeedback.style.color = "#D4AF37";
          if (window.wakeyAudio) window.wakeyAudio.playSuccess();
        } else if (code === "IMPERIAL") {
          this.activeDiscountCode = "IMPERIAL";
          this.discountPercent = 0;
          this.discountFlatINR = 200;
          promoFeedback.textContent = "✦ ₹200 Imperial Privilege Applied!";
          promoFeedback.style.color = "#00F0FF";
          if (window.wakeyAudio) window.wakeyAudio.playSuccess();
        } else {
          promoFeedback.textContent = "Invalid or expired privilege key.";
          promoFeedback.style.color = "#FF3366";
          if (window.wakeyAudio) window.wakeyAudio.playClick();
        }
        this.updateUI();
      });
    }

    // Gift Box Toggle
    const giftToggle = document.getElementById("cart-heirloom-gift-toggle");
    if (giftToggle) {
      giftToggle.addEventListener("change", (e) => {
        this.isHeirloomGift = e.target.checked;
        this.updateUI();
        if (window.wakeyAudio) window.wakeyAudio.playClick();
      });
    }

    // Checkout Flow Start
    const checkoutStartBtn = document.getElementById("btn-checkout-start");
    if (checkoutStartBtn) {
      checkoutStartBtn.addEventListener("click", () => {
        if (this.items.length === 0) {
          this.showToast("Your royal bag is empty. Explore our single-estates first.");
          return;
        }
        this.closeDrawer();
        this.openCheckoutModal();
      });
    }

    // Checkout Modal Close
    const modalCloseBtn = document.getElementById("checkout-modal-close");
    const modalOverlay = document.getElementById("checkout-modal-overlay");
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", () => this.closeCheckoutModal());
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) this.closeCheckoutModal();
      });
    }

    // PIN Code Checker
    const pinBtn = document.getElementById("btn-check-pincode");
    const pinInput = document.getElementById("cart-pincode-input");
    const pinMsg = document.getElementById("pincode-status-msg");
    if (pinBtn && pinInput && pinMsg) {
      pinBtn.addEventListener("click", () => {
        const code = pinInput.value.trim();
        if (code.length === 6 && !isNaN(code)) {
          if (code.startsWith("560") || code.startsWith("400") || code.startsWith("110")) {
            pinMsg.innerHTML = `✦ Priority Express Route Active for Pincode ${code}: <strong>Delivery Tomorrow by 11:00 AM</strong>`;
            pinMsg.style.color = "#00F0FF";
          } else {
            pinMsg.innerHTML = `✦ Standard Air Courier for Pincode ${code}: <strong>Delivery within 36–48 Hours</strong>`;
            pinMsg.style.color = "#D4AF37";
          }
          if (window.wakeyAudio) window.wakeyAudio.playSuccess();
        } else {
          pinMsg.innerHTML = `Please enter a valid 6-digit Indian Postal PIN code.`;
          pinMsg.style.color = "#FF3366";
        }
      });
    }

    // GST Invoice Toggle
    const gstToggle = document.getElementById("gst-invoice-toggle");
    const gstBox = document.getElementById("gst-input-box");
    if (gstToggle && gstBox) {
      gstToggle.addEventListener("change", (e) => {
        gstBox.style.display = e.target.checked ? "block" : "none";
      });
    }

    // Checkout Submit with Document-Level Delegation
    document.addEventListener("submit", (e) => {
      const checkoutForm = e.target.closest("#checkout-form");
      if (checkoutForm) {
        e.preventDefault();
        e.stopPropagation();
        this.processCheckout();
      }
    });
  }

  openDrawer() {
    if (window.wakeyAudio) window.wakeyAudio.playClick();
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-drawer-overlay");
    if (drawer && overlay) {
      drawer.classList.add("open");
      overlay.classList.add("open");
      document.body.classList.add("no-scroll");
    }
  }

  closeDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-drawer-overlay");
    if (drawer && overlay) {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
      document.body.classList.remove("no-scroll");
    }
  }

  openCheckoutModal() {
    if (window.wakeyAudio) window.wakeyAudio.playSuccess();
    const modal = document.getElementById("checkout-modal-overlay");
    if (modal) {
      this.updateUI();
      modal.classList.add("open");
      document.body.classList.add("no-scroll");
    }
  }

  closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal-overlay");
    if (modal) {
      modal.classList.remove("open");
      document.body.classList.remove("no-scroll");
    }
  }

  processCheckout() {
    const modalContainer = document.getElementById("checkout-modal-step-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="checkout-processing-view animate-fade-in">
        <div class="processing-spinner-ring"></div>
        <h3>Authorizing Royal Roasting Queue...</h3>
        <p>Generating encrypted roast certificate & notifying Bangalore/Chikmagalur roastery...</p>
      </div>
    `;

    if (window.wakeyAudio) window.wakeyAudio.playSonar();

    setTimeout(() => {
      const orderNum = "WO-IN-" + Math.floor(100000 + Math.random() * 900000);
      const calcs = this.getCalculations();
      const orderItems = [...this.items];

      if (window.wakeyAudio) window.wakeyAudio.playSuccess();

      modalContainer.innerHTML = `
        <div class="order-receipt-view animate-scale-up">
          <div class="receipt-success-badge" style="border-color:#D4AF37;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h2>Royal Dispatch Confirmed</h2>
          <p class="receipt-order-id">Order Reference: <strong>${orderNum}</strong></p>
          <div class="receipt-status-pill">● Queue Position #1 • Bangalore Roastery Scheduled for Midnight Stasis Cycle</div>

          <div class="receipt-items-breakdown">
            <h4>Allocated Lots:</h4>
            ${orderItems.map(item => `
              <div class="receipt-item-line">
                <span>${item.name} (${item.size}, ${item.grind}) × ${item.quantity}</span>
                <span>${this.formatPrice(item.priceINR * item.quantity)}</span>
              </div>
            `).join("")}
            ${this.isHeirloomGift ? `
              <div class="receipt-item-line" style="color:#D4AF37;">
                <span>Heirloom Velvet Presentation Chest</span>
                <span>+₹250.00</span>
              </div>
            ` : ''}
            <div class="receipt-total-line">
              <span>Total Paid:</span>
              <span class="text-gradient-gold">${this.formatPrice(calcs.totalINR)}</span>
            </div>
          </div>

          <p style="font-size:0.85rem; color:var(--text-secondary); margin:18px 0; text-align:center;">
            An encrypted roast passport and live Bluedart tracking coordinates have been dispatched to your email.
          </p>

          <button type="button" class="btn btn-glow-gold btn-block" id="btn-finish-receipt">
            <span>Return to Sanctuary</span>
          </button>
        </div>
      `;

      this.clearCart();

      const finishBtn = document.getElementById("btn-finish-receipt");
      if (finishBtn) {
        finishBtn.addEventListener("click", () => {
          this.closeCheckoutModal();
          this.updateUI();
        });
      }
    }, 1800);
  }

  showToast(message) {
    let container = document.getElementById("wakey-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "wakey-toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "luxury-toast animate-slide-up";
    toast.innerHTML = `
      <span class="toast-owl-dot">✦</span>
      <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.wakeyCart = new WakeyCart();
});
