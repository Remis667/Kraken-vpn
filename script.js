/* ============================================================
   KRAKEN — interactivity
   ============================================================ */

const SERVERS = [
  { city: 'Амстердам', country: 'Нидерланды', flag: '🇳🇱', region: 'europe', load: 34, ping: 12 },
  { city: 'Франкфурт', country: 'Германия', flag: '🇩🇪', region: 'europe', load: 51, ping: 15 },
  { city: 'Стокгольм', country: 'Швеция', flag: '🇸🇪', region: 'europe', load: 22, ping: 18 },
  { city: 'Цюрих', country: 'Швейцария', flag: '🇨🇭', region: 'europe', load: 41, ping: 20 },
  { city: 'Варшава', country: 'Польша', flag: '🇵🇱', region: 'europe', load: 29, ping: 17 },
  { city: 'Лиссабон', country: 'Португалия', flag: '🇵🇹', region: 'europe', load: 18, ping: 24 },
  { city: 'Милан', country: 'Италия', flag: '🇮🇹', region: 'europe', load: 63, ping: 21 },
  { city: 'Осло', country: 'Норвегия', flag: '🇳🇴', region: 'europe', load: 26, ping: 19 },
  { city: 'Нью-Йорк', country: 'США', flag: '🇺🇸', region: 'americas', load: 58, ping: 9 },
  { city: 'Сиэтл', country: 'США', flag: '🇺🇸', region: 'americas', load: 33, ping: 11 },
  { city: 'Торонто', country: 'Канада', flag: '🇨🇦', region: 'americas', load: 27, ping: 14 },
  { city: 'Мехико', country: 'Мексика', flag: '🇲🇽', region: 'americas', load: 45, ping: 22 },
  { city: 'Сан-Паулу', country: 'Бразилия', flag: '🇧🇷', region: 'americas', load: 39, ping: 28 },
  { city: 'Богота', country: 'Колумбия', flag: '🇨🇴', region: 'americas', load: 21, ping: 26 },
  { city: 'Токио', country: 'Япония', flag: '🇯🇵', region: 'asia', load: 47, ping: 16 },
  { city: 'Сингапур', country: 'Сингапур', flag: '🇸🇬', region: 'asia', load: 55, ping: 13 },
  { city: 'Сеул', country: 'Южная Корея', flag: '🇰🇷', region: 'asia', load: 31, ping: 17 },
  { city: 'Мумбаи', country: 'Индия', flag: '🇮🇳', region: 'asia', load: 68, ping: 25 },
  { city: 'Гонконг', country: 'Гонконг', flag: '🇭🇰', region: 'asia', load: 44, ping: 15 },
  { city: 'Дубай', country: 'ОАЭ', flag: '🇦🇪', region: 'asia', load: 36, ping: 20 },
  { city: 'Сидней', country: 'Австралия', flag: '🇦🇺', region: 'oceania', load: 24, ping: 30 },
  { city: 'Окленд', country: 'Новая Зеландия', flag: '🇳🇿', region: 'oceania', load: 15, ping: 34 },
];

function loadClass(load) {
  if (load < 35) return '';
  if (load < 60) return 'med';
  return 'high';
}

function renderServers(list) {
  const grid = document.getElementById('serverGrid');
  const count = document.getElementById('resultCount');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

  grid.innerHTML = list.map(s => `
    <div class="server-card">
      <div class="server-top">
        <div>
          <div class="server-city">${s.city}</div>
          <div class="server-country">${s.country}</div>
        </div>
        <div class="server-flag">${s.flag}</div>
      </div>
      <div class="server-meta">
        <span>${s.ping} ms</span>
        <span>${s.load}% нагрузка</span>
      </div>
      <div class="load-bar"><div class="load-fill ${loadClass(s.load)}" style="width:${s.load}%"></div></div>
    </div>
  `).join('');

  count.textContent = list.length;
  noResults.classList.toggle('show', list.length === 0);
}

function initServersPage() {
  const searchInput = document.getElementById('searchInput');
  const chips = document.querySelectorAll('.filter-chip');
  if (!searchInput) return;

  let activeRegion = 'all';

  function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = SERVERS.filter(s => {
      const matchesRegion = activeRegion === 'all' || s.region === activeRegion;
      const matchesQuery = !q || s.city.toLowerCase().includes(q) || s.country.toLowerCase().includes(q);
      return matchesRegion && matchesQuery;
    });
    renderServers(filtered);
  }

  searchInput.addEventListener('input', applyFilters);

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeRegion = chip.dataset.region;
      applyFilters();
    });
  });

  renderServers(SERVERS);
}

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

document.addEventListener('DOMContentLoaded', () => {
  initServersPage();
  initPricingPage();
});
