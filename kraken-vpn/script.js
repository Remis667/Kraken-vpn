/* ============================================================
   KRAKEN — interactivity
   ============================================================ */

const REGIONS = [
  { name: 'Амстердам', country: 'Нидерланды', flag: '🇳🇱', ping: 12 },
  { name: 'Франкфурт', country: 'Германия', flag: '🇩🇪', ping: 15 },
  { name: 'Стокгольм', country: 'Швеция', flag: '🇸🇪', ping: 18 },
  { name: 'Цюрих', country: 'Швейцария', flag: '🇨🇭', ping: 20 },
  { name: 'Варшава', country: 'Польша', flag: '🇵🇱', ping: 17 },
  { name: 'Лиссабон', country: 'Португалия', flag: '🇵🇹', ping: 24 },
  { name: 'Милан', country: 'Италия', flag: '🇮🇹', ping: 21 },
  { name: 'Осло', country: 'Норвегия', flag: '🇳🇴', ping: 19 },
  { name: 'Нью-Йорк', country: 'США', flag: '🇺🇸', ping: 9 },
  { name: 'Сиэтл', country: 'США', flag: '🇺🇸', ping: 11 },
  { name: 'Торонто', country: 'Канада', flag: '🇨🇦', ping: 14 },
  { name: 'Мехико', country: 'Мексика', flag: '🇲🇽', ping: 22 },
  { name: 'Сан-Паулу', country: 'Бразилия', flag: '🇧🇷', ping: 28 },
  { name: 'Богота', country: 'Колумбия', flag: '🇨🇴', ping: 26 },
  { name: 'Токио', country: 'Япония', flag: '🇯🇵', ping: 16 },
  { name: 'Сингапур', country: 'Сингапур', flag: '🇸🇬', ping: 13 },
  { name: 'Сеул', country: 'Южная Корея', flag: '🇰🇷', ping: 17 },
  { name: 'Мумбаи', country: 'Индия', flag: '🇮🇳', ping: 25 },
  { name: 'Гонконг', country: 'Гонконг', flag: '🇭🇰', ping: 15 },
  { name: 'Дубай', country: 'ОАЭ', flag: '🇦🇪', ping: 20 },
  { name: 'Сидней', country: 'Австралия', flag: '🇦🇺', ping: 30 },
  { name: 'Окленд', country: 'Новая Зеландия', flag: '🇳🇿', ping: 34 },
];

const CUSTOM_BASE_PRICE = 5.9;
const CUSTOM_FREE_REGIONS = 2;
const CUSTOM_PRICE_PER_EXTRA = 0.85;

/* ---------- scroll reveal (home page ocean story) ---------- */

function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(el => io.observe(el));
}

/* ---------- pricing toggle (monthly / yearly) ---------- */

function initPricingPage() {
  const toggle = document.getElementById('billingToggle');
  if (!toggle) return;

  const labelMonthly = document.getElementById('labelMonthly');
  const labelYearly = document.getElementById('labelYearly');
  const priceEls = document.querySelectorAll('.price-val');
  const noteEls = document.querySelectorAll('.billing-note');

  let yearly = false;

  toggle.addEventListener('click', () => {
    yearly = !yearly;
    toggle.classList.toggle('on', yearly);
    labelMonthly.classList.toggle('active', !yearly);
    labelYearly.classList.toggle('active', yearly);

    priceEls.forEach(el => {
      const val = yearly ? el.dataset.yearly : el.dataset.monthly;
      el.textContent = val;
    });

    noteEls.forEach(el => {
      el.textContent = yearly ? 'Оплата раз в год' : 'Оплата помесячно';
    });
  });
}

/* ---------- custom plan region picker ---------- */

function initRegionPicker() {
  const grid = document.getElementById('regionGrid');
  if (!grid) return;

  const searchInput = document.getElementById('regionSearch');
  const countEl = document.getElementById('regionCount');
  const priceEl = document.getElementById('customPrice');

  const selected = new Set();

  function updateTotals() {
    countEl.textContent = selected.size;
    const extra = Math.max(0, selected.size - CUSTOM_FREE_REGIONS);
    const total = CUSTOM_BASE_PRICE + extra * CUSTOM_PRICE_PER_EXTRA;
    priceEl.textContent = total.toFixed(2);
  }

  function render(list) {
    grid.innerHTML = list.map(r => `
      <label class="region-chip ${selected.has(r.name) ? 'checked' : ''}" data-name="${r.name}">
        <input type="checkbox" ${selected.has(r.name) ? 'checked' : ''}>
        <span class="rc-flag">${r.flag}</span>
        <span class="rc-name">${r.name}</span>
        <span class="rc-ping">${r.ping} ms</span>
      </label>
    `).join('');

    grid.querySelectorAll('.region-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const name = chip.dataset.name;
        if (selected.has(name)) {
          selected.delete(name);
        } else {
          selected.add(name);
        }
        chip.classList.toggle('checked', selected.has(name));
        chip.querySelector('input').checked = selected.has(name);
        updateTotals();
      });
    });
  }

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = REGIONS.filter(r =>
      !q || r.name.toLowerCase().includes(q) || r.country.toLowerCase().includes(q)
    );
    render(filtered);
  });

  render(REGIONS);
  updateTotals();
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initPricingPage();
  initRegionPicker();
});
