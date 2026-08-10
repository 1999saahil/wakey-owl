/**
 * Wakey Owl — Royal Cart & Checkout Engine (Indian Luxury Edition)
 * Handles INR pricing, GST invoice toggle, luxury gifting messages, pincode check, and UPI/Card checkout.
 */

class CartEngine {
  constructor() {
    this.items = [];
    this.discountPercent = 0;
    this.flatDiscountINR = 0;
    this.freeShippingPromo = false;
    this.freeShippingThresholdINR = 1500.00;
    this.appliedPromoCode = null;
    this.isGiftBox = false;

    this.init();
  }

  init() {
    this.loadFromStorage();
    this.injectCartDrawer();
    this.injectCheckoutModal();
    this.updateUI();
    this.bindEvents();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem("wakey_cart_items_inr");
      if (saved) {
        this.items = JSON.parse(saved);
      }
    } catch (e) {
      this.items = [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem("wakey_cart_items_inr", JSON.stringify(this.items));
    } catch (e) {}
  }

  addItem(productId, quantity = 1, grind = "whole-bean", size = "250g") {
    const product = WAKEY_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = this.items.findIndex(
      item => item.id === productId && item.grind === grind && item.size === size
    );

    const sizeObj = BAG_SIZES.find(s => s.id === size) || BAG_SIZES[0];
    const basePriceINR = product.priceINR * sizeObj.multiplier;

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        subtitle: product.subtitle,
        image: product.image,
        unitPriceINR: basePriceINR,
        quantity: quantity,
        grind: grind,
        size: size,
        accentColor: product.accentColor
      });
    }

    this.saveToStorage();
    this.updateUI();
    this.showToast(`Added "${product.name}" to your Royal Bag.`);
    if (window.wakeyAudio) window.wakeyAudio.playSuccess();
  }

  updateQuantity(index, newQty) {
    if (index < 0 || index >= this.items.length) return;
    if (newQty <= 0) {
      this.removeItem(index);
    } else {
      this.items[index].quantity = newQty;
      this.saveToStorage();
      this.updateUI();
    }
  }

  removeItem(index) {
    if (index < 0 || index >= this.items.length) return;
    const removed = this.items.splice(index, 1)[0];
    this.saveToStorage();
    this.updateUI();
    this.showToast(`Removed "${removed.name}" from your bag.`);
    if (window.wakeyAudio) window.wakeyAudio.playClick();
  }

  clearCart() {
    this.items = [];
    this.appliedPromoCode = null;
    this.discountPercent = 0;
    this.flatDiscountINR = 0;
    this.freeShippingPromo = false;
    this.isGiftBox = false;
    this.saveToStorage();
    this.updateUI();
  }

  applyPromo(code) {
    const clean = code.trim().toUpperCase();
    if (clean === "WAKEY10") {
      this.discountPercent = 0.10;
      this.appliedPromoCode = "WAKEY10 (10% Off)";
      this.showToast("10% Connoisseur Privilege Applied!");
      if (window.wakeyAudio) window.wakeyAudio.playSuccess();
      this.updateUI();
      return true;
    } else if (clean === "ROYAL15") {
      this.discountPercent = 0.15;
      this.appliedPromoCode = "ROYAL15 (15% Royal Society Off)";
      this.showToast("15% Royal Estate Discount Applied!");
      if (window.wakeyAudio) window.wakeyAudio.playSuccess();
      this.updateUI();
      return true;
    } else if (clean === "IMPERIAL") {
      this.flatDiscountINR = 200.00;
      this.appliedPromoCode = "IMPERIAL (₹200 Off)";
      this.showToast("₹200 Imperial Welcome Perk Applied!");
      if (window.wakeyAudio) window.wakeyAudio.playSuccess();
      this.updateUI();
      return true;
    } else {
      this.showToast("Invalid code. Try 'ROYAL15' or 'WAKEY10'", true);
      return false;
    }
  }

  getSubtotalINR() {
    return this.items.reduce((sum, item) => sum + (item.unitPriceINR * item.quantity), 0);
  }

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCalculations() {
    const subtotalINR = this.getSubtotalINR();
    const percentDiscount = subtotalINR * this.discountPercent;
    const totalDiscount = percentDiscount + this.flatDiscountINR;
    const discountedSubtotalINR = Math.max(0, subtotalINR - totalDiscount);

    const isFreeShipping = this.freeShippingPromo || (discountedSubtotalINR >= this.freeShippingThresholdINR);
    const shippingINR = (subtotalINR === 0 || isFreeShipping) ? 0 : 150.00;
    const giftBoxFeeINR = this.isGiftBox ? 250.00 : 0;
    const totalINR = discountedSubtotalINR + shippingINR + giftBoxFeeINR;

    const remainingForFreeShipINR = Math.max(0, this.freeShippingThresholdINR - discountedSubtotalINR);
    const freeShipProgress = Math.min(100, (discountedSubtotalINR / this.freeShippingThresholdINR) * 100);

    return {
      subtotalINR,
      totalDiscount,
      discountedSubtotalINR,
      shippingINR,
      isFreeShipping,
      giftBoxFeeINR,
      remainingForFreeShipINR,
      freeShipProgress,
      totalINR
    };
  }

  formatINR(val) {
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  injectCartDrawer() {
    if (document.getElementById("cart-drawer-overlay")) return;

    const drawerHTML = `
      <div id="cart-drawer-overlay" class="cart-drawer-overlay"></div>
      <div id="cart-drawer" class="cart-drawer">
        <div class="cart-drawer-header">
          <div class="cart-header-title">
            <span class="cart-owl-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="9" cy="10" r="2" fill="#D4AF37"/><circle cx="15" cy="10" r="2" fill="#D4AF37"/><path d="M12 14l-2 3h4z"/></svg>
            </span>
            <h3>Royal Sensory Bag</h3>
            <span class="cart-header-count" id="drawer-item-count">(0)</span>
          </div>
          <button type="button" class="btn-close-drawer" id="cart-drawer-close" aria-label="Close Bag">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Free Delivery Progress Meter -->
        <div class="cart-shipping-meter" id="cart-shipping-meter">
          <div class="shipping-meter-text" id="shipping-meter-text">Add ₹1,500.00 for Complimentary Royal Courier</div>
          <div class="shipping-meter-track">
            <div class="shipping-meter-fill" id="shipping-meter-fill" style="width: 0%"></div>
          </div>
        </div>

        <!-- Pincode Check Bar -->
        <div style="padding: 12px 28px; background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--border-glass); display:flex; gap:8px; align-items:center;">
          <input type="text" id="pincode-quick-check" placeholder="Enter Pincode (e.g. 560001)" maxlength="6" style="flex:1; background:rgba(0,0,0,0.4); border:1px solid var(--border-glass); border-radius:6px; padding:6px 10px; color:#FFF; font-size:0.82rem;" />
          <button type="button" id="btn-check-pincode" class="btn btn-glass btn-small" style="padding:6px 12px; font-size:0.78rem;">Check</button>
        </div>
        <div id="pincode-status-msg" style="padding: 0 28px; font-size:0.78rem; color:#00F0FF; margin-top:4px;"></div>

        <div class="cart-drawer-body" id="cart-drawer-items">
          <!-- Populated by JS -->
        </div>

        <div class="cart-drawer-footer" id="cart-drawer-footer">
          <!-- Luxury Gifting Option Toggle -->
          <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:#D4AF37; margin-bottom:12px; cursor:pointer;">
            <input type="checkbox" id="gift-box-toggle" style="accent-color:#D4AF37;" />
            <span>Add Royal Heirloom Gift Packaging (+₹250)</span>
          </label>

          <div class="cart-promo-row">
            <input type="text" id="cart-promo-input" class="cart-promo-input" placeholder="Privilege code (e.g. ROYAL15)" />
            <button type="button" id="cart-promo-btn" class="btn btn-small btn-glass">Apply</button>
          </div>
          <div id="cart-applied-promo-tag" class="cart-applied-promo-tag"></div>

          <div class="cart-summary-lines">
            <div class="summary-line"><span>Subtotal</span><span id="drawer-subtotal">₹0.00</span></div>
            <div class="summary-line discount-line" id="drawer-discount-row" style="display:none;"><span>Privilege Discount</span><span id="drawer-discount">-₹0.00</span></div>
            <div class="summary-line" id="drawer-gift-row" style="display:none;"><span>Heirloom Gift Box</span><span>₹250.00</span></div>
            <div class="summary-line"><span>Royal Express Courier</span><span id="drawer-shipping">₹150.00</span></div>
            <div class="summary-line total-line"><span>Total Amount</span><span id="drawer-total">₹0.00</span></div>
          </div>

          <div class="cart-drawer-actions">
            <button type="button" class="btn btn-glow-gold btn-block" id="btn-checkout-start">
              <span>Proceed to Royal Dispatch</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
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
        meterText.innerHTML = `Add <strong>${this.formatINR(calcs.remainingForFreeShipINR)}</strong> for Free Royal Courier`;
        meterFill.style.width = `${calcs.freeShipProgress}%`;
        meterFill.style.background = "linear-gradient(90deg, #FF9E1B, #D4AF37)";
      }
    }

    // Drawer Items
    const itemsContainer = document.getElementById("cart-drawer-items");
    const footer = document.getElementById("cart-drawer-footer");
    
    if (itemsContainer) {
      if (this.items.length === 0) {
        itemsContainer.innerHTML = `
          <div class="cart-empty-state">
            <div class="empty-owl-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6C738A" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 15h8M9 9h.01M15 9h.01"/></svg>
            </div>
            <h4>Your Royal Bag is Empty</h4>
            <p>Select from our high-elevation Indian single-estates to awaken your senses.</p>
            <a href="shop.html" class="btn btn-glass btn-small" id="btn-empty-shop">Explore Estate Roasts</a>
          </div>
        `;
        if (footer) footer.style.opacity = "0.4";
      } else {
        if (footer) footer.style.opacity = "1";
        itemsContainer.innerHTML = this.items.map((item, idx) => {
          const grindObj = GRIND_OPTIONS.find(g => g.id === item.grind);
          const grindName = grindObj ? grindObj.label.split("—")[0] : item.grind;

          return `
            <div class="cart-item-row animate-fade-in" data-index="${idx}">
              <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
              <div class="cart-item-info">
                <div class="cart-item-title-row">
                  <h4 class="cart-item-title">${item.name}</h4>
                  <button type="button" class="btn-remove-item" data-remove-idx="${idx}" aria-label="Remove item">✕</button>
                </div>
                <div class="cart-item-meta">
                  <span>${item.size}</span> • <span>${grindName}</span>
                </div>
                <div class="cart-item-bottom-row">
                  <div class="qty-control-pill">
                    <button type="button" class="btn-qty" data-action="dec" data-idx="${idx}">-</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button type="button" class="btn-qty" data-action="inc" data-idx="${idx}">+</button>
                  </div>
                  <div class="cart-item-price">${this.formatINR(item.unitPriceINR * item.quantity)}</div>
                </div>
              </div>
            </div>
          `;
        }).join("");
      }
    }

    // Numbers
    const subtotalEl = document.getElementById("drawer-subtotal");
    const discountRow = document.getElementById("drawer-discount-row");
    const discountEl = document.getElementById("drawer-discount");
    const giftRow = document.getElementById("drawer-gift-row");
    const shippingEl = document.getElementById("drawer-shipping");
    const totalEl = document.getElementById("drawer-total");

    if (subtotalEl) subtotalEl.textContent = this.formatINR(calcs.subtotalINR);
    if (discountRow && discountEl) {
      if (calcs.totalDiscount > 0) {
        discountRow.style.display = "flex";
        discountEl.textContent = `-${this.formatINR(calcs.totalDiscount)}`;
      } else {
        discountRow.style.display = "none";
      }
    }
    if (giftRow) {
      giftRow.style.display = this.isGiftBox ? "flex" : "none";
    }
    if (shippingEl) shippingEl.textContent = calcs.shippingINR === 0 ? "Complimentary" : this.formatINR(calcs.shippingINR);
    if (totalEl) totalEl.textContent = this.formatINR(calcs.totalINR);

    // Promo tag
    const promoTag = document.getElementById("cart-applied-promo-tag");
    if (promoTag) {
      if (this.appliedPromoCode) {
        promoTag.innerHTML = `<span>Applied: <strong>${this.appliedPromoCode}</strong></span> <button type="button" id="btn-remove-promo">✕</button>`;
      } else {
        promoTag.innerHTML = "";
      }
    }

    // Modal summary pill
    const modalSummaryPill = document.getElementById("modal-checkout-summary-pill");
    if (modalSummaryPill) {
      modalSummaryPill.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>Items (${count})</span>
          <strong>${this.formatINR(calcs.discountedSubtotalINR)}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>Express Royal Courier</span>
          <span>${calcs.shippingINR === 0 ? "FREE" : this.formatINR(calcs.shippingINR)}</span>
        </div>
        ${this.isGiftBox ? `<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Heirloom Gift Box</span><span>₹250.00</span></div>` : ""}
        <div style="display:flex; justify-content:space-between; font-size:1.15rem; color:#D4AF37; font-weight:700; border-top:1px solid rgba(255,255,255,0.1); padding-top:8px; margin-top:8px;">
          <span>Total Authorized</span>
          <span>${this.formatINR(calcs.totalINR)}</span>
        </div>
      `;
    }
  }

  bindEvents() {
    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest("[data-cart-open]");
      if (openBtn) {
        e.preventDefault();
        this.openDrawer();
      }

      const closeBtn = e.target.closest("#cart-drawer-close, #cart-drawer-overlay, #link-close-and-shop");
      if (closeBtn) {
        e.preventDefault();
        this.closeDrawer();
      }

      const qtyBtn = e.target.closest(".btn-qty");
      if (qtyBtn) {
        const idx = parseInt(qtyBtn.getAttribute("data-idx"));
        const action = qtyBtn.getAttribute("data-action");
        if (action === "inc") this.updateQuantity(idx, this.items[idx].quantity + 1);
        if (action === "dec") this.updateQuantity(idx, this.items[idx].quantity - 1);
      }

      const removeBtn = e.target.closest(".btn-remove-item");
      if (removeBtn) {
        const idx = parseInt(removeBtn.getAttribute("data-remove-idx"));
        this.removeItem(idx);
      }

      const removePromoBtn = e.target.closest("#btn-remove-promo");
      if (removePromoBtn) {
        this.appliedPromoCode = null;
        this.discountPercent = 0;
        this.flatDiscountINR = 0;
        this.updateUI();
        this.showToast("Privilege code removed.");
      }

      const checkoutStart = e.target.closest("#btn-checkout-start");
      if (checkoutStart) {
        if (this.items.length === 0) {
          this.showToast("Your bag is empty! Add an estate roast first.", true);
        } else {
          this.closeDrawer();
          this.openCheckoutModal();
        }
      }

      const modalClose = e.target.closest("#checkout-modal-close, #checkout-modal-overlay");
      if (modalClose && !e.target.closest(".checkout-modal-card")) {
        this.closeCheckoutModal();
      }
    });

    // Promo code apply
    const promoBtn = document.getElementById("cart-promo-btn");
    const promoInput = document.getElementById("cart-promo-input");
    if (promoBtn && promoInput) {
      promoBtn.addEventListener("click", () => {
        if (promoInput.value) {
          this.applyPromo(promoInput.value);
          promoInput.value = "";
        }
      });
    }

    // Gift box toggle
    const giftBoxToggle = document.getElementById("gift-box-toggle");
    if (giftBoxToggle) {
      giftBoxToggle.addEventListener("change", (e) => {
        this.isGiftBox = e.target.checked;
        this.updateUI();
      });
    }

    // Pincode check
    const pinBtn = document.getElementById("btn-check-pincode");
    const pinInput = document.getElementById("pincode-quick-check");
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

    // Checkout Submit
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.processCheckout();
      });
    }
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
          <span class="receipt-pre-title" style="color:#D4AF37;">Royal Order Confirmed</span>
          <h2 class="receipt-order-id">${orderNum}</h2>
          <p class="receipt-notice">Your single-estate micro-lot has entered our nocturnal nitrogen roaster. Hand-packaged with wax seal in our Bangalore facility.</p>

          <div class="receipt-details-box">
            <div class="receipt-detail-row"><span>Estimated Dispatch</span><strong>Within 24 Hours (Nocturnal Stasis)</strong></div>
            <div class="receipt-detail-row"><span>Courier Partner</span><strong>Bluedart Air / Delhivery Royal Express</strong></div>
            <div class="receipt-detail-row"><span>Total Paid</span><strong style="color:#D4AF37;">${this.formatINR(calcs.totalINR)}</strong></div>
          </div>

          <div class="receipt-items-mini-list">
            ${orderItems.map(item => `
              <div class="receipt-mini-item">
                <span>${item.quantity}x ${item.name} (${item.size}, ${item.grind})</span>
                <span>${this.formatINR(item.unitPriceINR * item.quantity)}</span>
              </div>
            `).join("")}
          </div>

          <div class="receipt-actions">
            <button type="button" class="btn btn-glow-gold btn-block" id="btn-finish-receipt">
              <span>Return to Royal Collection</span>
            </button>
          </div>
        </div>
      `;

      this.clearCart();

      const finishBtn = document.getElementById("btn-finish-receipt");
      if (finishBtn) {
        finishBtn.addEventListener("click", () => {
          this.closeCheckoutModal();
          window.location.reload();
        });
      }
    }, 1800);
  }

  showToast(message, isError = false) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-pill ${isError ? "toast-error" : "toast-success"} animate-slide-up`;
    toast.innerHTML = `
      <span class="toast-dot" style="${isError ? '' : 'background:#D4AF37; box-shadow:0 0 8px #D4AF37;'}"></span>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.wakeyCart = new CartEngine();
});
