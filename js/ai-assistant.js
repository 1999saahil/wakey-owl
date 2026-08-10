/**
 * Wakey Owl — AI Coffee Sommelier & Encyclopedia Knowledge Engine
 * Answers questions regarding coffee history, Indian terroirs, brewing rituals, and food pairings.
 */

const COFFEE_KNOWLEDGE_BASE = [
  {
    keywords: ["baba budan", "history", "origin", "1670", "yemen", "first coffee", "chikmagalur history", "heritage"],
    title: "The Sacred 1670 Baba Budan Origin Story",
    category: "Heritage & History",
    answer: `
      In <strong>1670 AD</strong>, the revered Sufi saint <strong>Baba Budan</strong> embarked on a pilgrimage to Mecca. While returning through the ancient port of Mocha in Yemen, he encountered the divine elixir of roasted coffee, which Arabs strictly guarded against export in unroasted form.<br/><br/>
      Driven by a vision to bring this sacred gift to India, Baba Budan concealed <strong>seven raw green coffee beans</strong> within his robes and beard—seven being a holy number. Upon his return to the lush, mist-covered Western Ghats of Karnataka, he planted them in the fertile volcanic soils of the <strong>Chandragiri Hills (now famously named Bababudangiri)</strong>.<br/><br/>
      Those seven sacred seeds gave birth to India's entire 400-year-old shade-grown coffee heritage, which Wakey Owl continues today at 1,750m elevation.
    `,
    relatedRoasts: ["ratnagiri-pearl-south", "attikan-estate-reserve"],
    quickFollowUps: ["How is Indian coffee different from African or Latin coffee?", "How do I brew authentic South Indian Filter coffee?"]
  },
  {
    keywords: ["how to make", "brew filter coffee", "south indian filter", "davarah", "decoction", "recipe", "chicory"],
    title: "The Royal South Indian Filter Kaapi Ritual (Brass Davarah)",
    category: "Brewing Masterclass",
    answer: `
      Brewing authentic <strong>Royal South Indian Filter Kaapi</strong> requires our <em>Mysore Imperial Royal Filter Blend (85:15 Peaberry & Roasted Chicory)</em> and a traditional brass drip filter:<br/><br/>
      <strong>1. The Bed:</strong> Add 3 tablespoons (approx 20g) of freshly ground coffee into the top perforated brass compartment. Lightly tamp using the brass pressing disc.<br/>
      <strong>2. The Water:</strong> Bring fresh water (100ml) to 92°C (just off the boil). Pour gently over the pressing disc.<br/>
      <strong>3. The Stasis:</strong> Seal the lid and allow 12–15 minutes for the dense, dark first decoction to drip into the bottom vessel.<br/>
      <strong>4. The Royal Pour:</strong> In a brass Davarah, add 1.5 teaspoons of raw jaggery or cane sugar, pour 40ml of hot first decoction, and top with 120ml of boiling rich whole milk.<br/>
      <strong>5. The Froth:</strong> Meter the liquid back and forth between the tumbler and davarah from a height to generate a thick, golden layer of aromatic foam.
    `,
    relatedRoasts: ["mysore-imperial-filter-blend", "imperial-brass-davarah-set"],
    quickFollowUps: ["What food should I pair with Filter Coffee?", "Why do we add 15% chicory to South Indian filter coffee?"]
  },
  {
    keywords: ["what to eat", "food pairing", "pairings", "snack", "sweet", "mysore pak", "pastry", "breakfast"],
    title: "Gourmet Culinary & Indian Royal Pairings",
    category: "Sommelier Culinary Guide",
    answer: `
      Pairing coffee is an art of complementary and contrasting lipid profiles:<br/><br/>
      • <strong>Dark French Roasts (e.g. Attikan & Malabar):</strong> Pair magnificently with <em>Ghee-rich Mysore Pak with cardamom</em>, <em>Dark Chocolate Jaggery Truffles</em>, warm almond croissants, or aged smoked cheeses. The heavy cocoa notes cut through the richness of ghee.<br/>
      • <strong>Light-Medium Floral Roasts (e.g. Ratnagiri & Panama Geisha):</strong> Pair with <em>Ratnagiri Alphonso Mango Tart</em>, lemon zest madeleines, pistachio baklava, or mild goat cheese sourdough toast.<br/>
      • <strong>Medium Roasts (e.g. Araku Valley):</strong> Pair with <em>Cardamom Saffron Shrikhand</em>, warm banana walnut cake, or roasted spiced cashews.<br/>
      • <strong>South Indian Filter Kaapi:</strong> The timeless royal accompaniment to <em>Crisp Mysore Masala Dosa</em>, hot ghee Rava Kesari, or medu vadas.
    `,
    relatedRoasts: ["attikan-estate-reserve", "ratnagiri-pearl-south", "mysore-imperial-filter-blend"],
    quickFollowUps: ["Tell me about the Araku Valley biodynamic terroir", "Which coffee has the lowest acidity?"]
  },
  {
    keywords: ["monsooned", "malabar", "ocean", "monsoon", "low acid", "crema"],
    title: "The Mystery of Monsooned Malabar",
    category: "Terroir & Processing",
    answer: `
      <strong>Monsooned Malabar</strong> is a Geographic Indication (GI) protected coffee unique to the Southwest coast of India.<br/><br/>
      During the historical age of wooden sailing ships, coffee traveling from India to Europe around the Cape of Good Hope underwent a 6-month voyage exposed to humid sea air. The beans absorbed moisture, swelled to double their size, and transformed from green to golden straw.<br/><br/>
      Today, we replicate this under controlled conditions in coastal Malabar warehouses between June and September. The Arabian Sea monsoon winds strip away all harsh chlorogenic acids, yielding an ultra-smooth, heavy-bodied cup with <strong>zero bitter acidity and unprecedented dense crema</strong>.
    `,
    relatedRoasts: ["malabar-monsooned-stasis"],
    quickFollowUps: ["What is the difference between Arabica and Robusta in India?", "How do I make Pour-Over coffee?"]
  },
  {
    keywords: ["pour-over", "v60", "chemex", "how to brew pour over", "ratio", "grind"],
    title: "The Quantum Pour-Over & V60 Protocol",
    category: "Brewing Masterclass",
    answer: `
      For delicate micro-lots like <strong>Ratnagiri Anaerobic</strong> or <strong>Panama Geisha</strong>:<br/><br/>
      • <strong>Ratio:</strong> 1:16 (15g medium-fine ground coffee to 240ml mineral water).<br/>
      • <strong>Temperature:</strong> 93.5°C.<br/>
      • <strong>Bloom (0:00–0:45):</strong> Pour 45ml water in concentric spirals. Allow the trapped CO2 to release for 45 seconds.<br/>
      • <strong>First Pulse (0:45–1:30):</strong> Pour continuously until reaching 150ml.<br/>
      • <strong>Final Drawdown (1:30–3:00):</strong> Pour gently up to 240ml and let gravity draw the clean, crystalline liquor through the paper bed.
    `,
    relatedRoasts: ["ratnagiri-pearl-south", "panama-geisha-imperial-guest"],
    quickFollowUps: ["What makes Ratnagiri Estate so famous?", "What are the best food pairings for light roasts?"]
  },
  {
    keywords: ["shade-grown", "unique", "indian coffee", "why indian coffee", "biodiversity", "western ghats"],
    title: "Why Indian Shade-Grown Coffee is Globally Unique",
    category: "Botany & Ecology",
    answer: `
      India is the <strong>only coffee-producing nation in the world where 100% of coffee is grown under a dual-tier natural forest shade canopy</strong> alongside wild pepper vines, cardamom, cinnamon, silver oak, and jackfruit trees in the UNESCO Western Ghats biodiversity hotspot.<br/><br/>
      This canopy prevents harsh direct tropical sunlight, forcing the coffee cherries to mature slowly over 9 months. This extended maturation produces significantly higher density of natural sucrose, delicate floral terpenes, and balanced natural sweetness without artificial chemical inputs.
    `,
    relatedRoasts: ["attikan-estate-reserve", "araku-tribal-reserve"],
    quickFollowUps: ["Tell me about the 1670 Baba Budan origin story", "How do I brew South Indian Filter coffee?"]
  },
  {
    keywords: ["recommend", "which coffee", "choose", "best for me", "morning", "focus", "dark or light"],
    title: "Wakey Owl Personalized Sommelier Recommendation",
    category: "Palate Matching",
    answer: `
      To guide your sensory selection:<br/><br/>
      • <strong>For Deep Morning Focus & Velvet Body:</strong> Choose <em>Attikan Estate Royal Reserve (₹890)</em> — heavy dark chocolate and spiced jaggery notes.<br/>
      • <strong>For Exotic Fruit & Floral Brightness:</strong> Choose <em>Ratnagiri 'Pearl of South' (₹1,150)</em> — luscious Alphonso mango and wild honey notes.<br/>
      • <strong>For Traditional Royal Court Decoction:</strong> Choose <em>Mysore Imperial Royal Filter Blend (₹650)</em> with our Handcrafted Brass Davarah.<br/>
      • <strong>For Ultra-Smooth Heavy Crema:</strong> Choose <em>Malabar Monsooned Stasis (₹820)</em>.
    `,
    relatedRoasts: ["attikan-estate-reserve", "ratnagiri-pearl-south", "mysore-imperial-filter-blend"],
    quickFollowUps: ["What food should I pair with my chosen roast?", "How do I brew with a French Press?"]
  }
];

class AIAssistantEngine {
  constructor(containerId = "ai-coffee-chatbox") {
    this.container = document.getElementById(containerId);
    this.floatingTrigger = document.getElementById("floating-ai-trigger");
    this.floatingModal = document.getElementById("floating-ai-modal");
    this.chatHistory = [];

    this.init();
  }

  init() {
    if (this.container) {
      this.renderChatInterface(this.container);
    }
    this.initFloatingWidget();
  }

  initFloatingWidget() {
    if (!document.getElementById("floating-ai-modal")) {
      const widgetHTML = `
        <button type="button" id="floating-ai-trigger" class="floating-ai-btn" aria-label="Ask Wakey Owl AI Barista">
          <span class="ai-sparkle">✦</span>
          <span>Ask AI Sommelier</span>
        </button>

        <div id="floating-ai-modal" class="floating-ai-modal">
          <div class="floating-ai-header">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="ai-avatar-dot">✦</span>
              <div>
                <h4 style="font-size:0.95rem; margin:0; color:#FFF;">Wakey Owl AI Sommelier</h4>
                <span style="font-size:0.75rem; color:#00F0FF;">● Online • Indian & Global Coffee Encyclopedia</span>
              </div>
            </div>
            <button type="button" id="btn-close-floating-ai" class="btn-modal-close" style="position:static; width:28px; height:28px; font-size:0.8rem;">✕</button>
          </div>
          <div class="floating-ai-body" id="floating-chat-messages">
            <!-- Messages stream -->
          </div>
          <div class="floating-ai-footer">
            <div class="ai-quick-pills" id="floating-quick-chips">
              <button class="chip-q" data-question="Tell me the 1670 Baba Budan origin story">1670 Baba Budan</button>
              <button class="chip-q" data-question="How to brew South Indian Filter Kaapi in brass Davarah?">Filter Kaapi Recipe</button>
              <button class="chip-q" data-question="What food should I pair with Dark Roast?">Food Pairings</button>
              <button class="chip-q" data-question="Why is Indian shade-grown coffee unique?">Shade-Grown Ecology</button>
            </div>
            <form id="floating-ai-form" class="floating-ai-input-wrap">
              <input type="text" id="floating-ai-input" placeholder="Ask anything about origins, brewing, pairings..." />
              <button type="submit" class="btn btn-glow-gold btn-small" style="padding:8px 14px;">Send</button>
            </form>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", widgetHTML);
    }

    const trigger = document.getElementById("floating-ai-trigger");
    const modal = document.getElementById("floating-ai-modal");
    const closeBtn = document.getElementById("btn-close-floating-ai");

    if (trigger && modal) {
      trigger.addEventListener("click", () => {
        modal.classList.toggle("open");
        if (modal.classList.contains("open")) {
          if (window.wakeyAudio) window.wakeyAudio.playSonar();
          const msgs = document.getElementById("floating-chat-messages");
          if (msgs && msgs.children.length === 0) {
            this.sendBotMessage(
              msgs,
              "Namaste. I am your <strong>Wakey Owl AI Sommelier & Encyclopedia Assistant</strong>. Ask me anything about Indian single-estates (Chikmagalur, BR Hills, Araku), the 1670 Baba Budan history, precision brewing rituals (South Indian Filter, V60, Espresso), or royal dessert & gourmet food pairings."
            );
          }
        }
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
      });
    }

    // Bind Quick Chips
    document.querySelectorAll(".chip-q").forEach(chip => {
      chip.addEventListener("click", () => {
        const q = chip.getAttribute("data-question");
        const msgs = document.getElementById("floating-chat-messages");
        if (msgs) {
          this.handleUserQuery(q, msgs);
        }
      });
    });

    // Bind Form
    const form = document.getElementById("floating-ai-form");
    const input = document.getElementById("floating-ai-input");
    if (form && input) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
          const msgs = document.getElementById("floating-chat-messages");
          this.handleUserQuery(text, msgs);
          input.value = "";
        }
      });
    }
  }

  renderChatInterface(container) {
    container.innerHTML = `
      <div class="ai-encyclopedia-box">
        <div class="ai-box-header">
          <div class="ai-badge-top">
            <span class="ai-sparkle">✦</span>
            <span>Intelligent Coffee Sommelier & Heritage Encyclopedia</span>
          </div>
          <h3 class="ai-box-title">Ask the Wakey Owl <span class="text-gradient-amber">Master Barista</span></h3>
          <p class="ai-box-desc">
            Explore 400 years of Indian coffee heritage, master extraction rituals for brass Davarah or V60, and uncover gourmet food pairings.
          </p>
        </div>

        <div class="ai-suggestion-pills-row">
          <span>Curated Inquiries:</span>
          <button type="button" class="btn-ai-pill" data-ask="Tell me the sacred 1670 Baba Budan origin story">✦ The 1670 Baba Budan Pilgrimage</button>
          <button type="button" class="btn-ai-pill" data-ask="How to brew authentic South Indian Filter Kaapi in brass Davarah?">☕ Royal Filter Kaapi Decoction Recipe</button>
          <button type="button" class="btn-ai-pill" data-ask="What food should I pair with Dark Roast vs Light Roast?">🍰 Gourmet Food & Dessert Pairings</button>
          <button type="button" class="btn-ai-pill" data-ask="Why is Indian shade-grown coffee globally unique?">🌿 Shade-Grown Western Ghats Ecology</button>
          <button type="button" class="btn-ai-pill" data-ask="What is the story behind Monsooned Malabar coffee?">🌊 The Maritime Monsooned Malabar</button>
        </div>

        <div class="ai-chat-thread" id="embedded-ai-thread">
          <!-- Live conversation thread -->
        </div>

        <form id="embedded-ai-form" class="ai-input-form-bar">
          <input type="text" id="embedded-ai-input" class="ai-text-input" placeholder="Type any question regarding history, brewing methods, origins, or pairings..." required />
          <button type="submit" class="btn btn-glow-gold">
            <span>Consult AI</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </form>
      </div>
    `;

    const thread = container.querySelector("#embedded-ai-thread");
    this.sendBotMessage(
      thread,
      "Welcome, connoisseur. I am your <strong>Wakey Owl AI Sommelier</strong>. Select one of the curated inquiries above or ask any question on coffee botany, historical estates, brewing mathematics, or royal culinary pairings."
    );

    // Pill clicks
    container.querySelectorAll(".btn-ai-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const q = btn.getAttribute("data-ask");
        this.handleUserQuery(q, thread);
      });
    });

    // Form submit
    const form = container.querySelector("#embedded-ai-form");
    const input = container.querySelector("#embedded-ai-input");
    if (form && input) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
          this.handleUserQuery(text, thread);
          input.value = "";
        }
      });
    }
  }

  handleUserQuery(query, container) {
    if (!query || !container) return;

    // Append User Message
    const userMsg = document.createElement("div");
    userMsg.className = "chat-msg chat-msg-user animate-slide-up";
    userMsg.innerHTML = `
      <div class="msg-bubble user-bubble">${query}</div>
    `;
    container.appendChild(userMsg);
    container.scrollTop = container.scrollHeight;

    if (window.wakeyAudio) window.wakeyAudio.playClick();

    // Show Thinking indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "chat-msg chat-msg-bot animate-fade-in typing-row";
    typingIndicator.innerHTML = `
      <div class="msg-bubble bot-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    container.appendChild(typingIndicator);
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
      typingIndicator.remove();
      const response = this.computeKnowledgeMatch(query);
      this.sendBotMessage(container, response.html, response.relatedRoasts, response.quickFollowUps);
    }, 600);
  }

  computeKnowledgeMatch(query) {
    const qLower = query.toLowerCase();

    // Search knowledge base
    let bestMatch = null;
    let maxHits = 0;

    for (const item of COFFEE_KNOWLEDGE_BASE) {
      let hits = 0;
      for (const kw of item.keywords) {
        if (qLower.includes(kw)) {
          hits += kw.length; // weight longer keyword matches
        }
      }
      if (hits > maxHits) {
        maxHits = hits;
        bestMatch = item;
      }
    }

    if (bestMatch && maxHits > 0) {
      return {
        html: `
          <div class="knowledge-card">
            <span class="knowledge-category-tag">${bestMatch.category}</span>
            <h4 class="knowledge-title">${bestMatch.title}</h4>
            <div class="knowledge-body">${bestMatch.answer}</div>
          </div>
        `,
        relatedRoasts: bestMatch.relatedRoasts,
        quickFollowUps: bestMatch.quickFollowUps
      };
    }

    // Default fallback intelligent response for custom queries
    return {
      html: `
        <div class="knowledge-card">
          <span class="knowledge-category-tag">Sommelier Insight</span>
          <h4 class="knowledge-title">Sensory & Terroir Analysis</h4>
          <div class="knowledge-body">
            Regarding your inquiry on <em>"${query}"</em>: High-altitude Indian specialty coffees (1,200m–1,750m) grown under biodiverse canopy in the Western Ghats develop rich sucrose matrices with low bitterness.<br/><br/>
            Whether you brew through a traditional South Indian brass filter, a 9-bar espresso extraction, or a pour-over dripper, the key is maintaining water temperature between 92°C–94°C to extract aromatic terpenes without scorching delicate oils.
          </div>
        </div>
      `,
      relatedRoasts: ["attikan-estate-reserve", "ratnagiri-pearl-south"],
      quickFollowUps: ["How to brew South Indian Filter Kaapi in brass Davarah?", "What food should I pair with Dark Roast?"]
    };
  }

  sendBotMessage(container, htmlContent, relatedRoasts = [], quickFollowUps = []) {
    if (!container) return;

    const botMsg = document.createElement("div");
    botMsg.className = "chat-msg chat-msg-bot animate-scale-up";

    let roastsHTML = "";
    if (relatedRoasts && relatedRoasts.length > 0) {
      const matchedProducts = WAKEY_PRODUCTS.filter(p => relatedRoasts.includes(p.id));
      if (matchedProducts.length > 0) {
        roastsHTML = `
          <div class="ai-matched-roasts-shelf">
            <span class="shelf-label">✦ Recommended Estate Roasts for this Inquiry:</span>
            <div class="matched-chips-row">
              ${matchedProducts.map(p => `
                <div class="matched-roast-chip" onclick="window.wakeyApp.openQuickView('${p.id}')">
                  <img src="${p.image}" alt="${p.name}" />
                  <div>
                    <strong>${p.name}</strong>
                    <span>₹${p.priceINR.toFixed(2)} • Cupping ${p.cuppingScore}</span>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }
    }

    let followUpsHTML = "";
    if (quickFollowUps && quickFollowUps.length > 0) {
      followUpsHTML = `
        <div class="ai-followup-chips">
          ${quickFollowUps.map(f => `
            <button type="button" class="btn-followup-pill" data-ask="${f}">↳ ${f}</button>
          `).join("")}
        </div>
      `;
    }

    botMsg.innerHTML = `
      <div class="msg-bubble bot-bubble">
        <div class="bot-header-row">
          <span class="bot-owl-mark">✦ Wakey Owl AI Barista</span>
        </div>
        ${htmlContent}
        ${roastsHTML}
        ${followUpsHTML}
      </div>
    `;

    container.appendChild(botMsg);
    container.scrollTop = container.scrollHeight;

    if (window.wakeyAudio) window.wakeyAudio.playSuccess();

    // Bind follow-up clicks
    botMsg.querySelectorAll(".btn-followup-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const followQ = btn.getAttribute("data-ask");
        this.handleUserQuery(followQ, container);
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.wakeyAI = new AIAssistantEngine("ai-coffee-chatbox");
});
