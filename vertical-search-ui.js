// Vertical Search UI for ScaleWise Lead Radar
(function () {
  function groups() {
    return Array.isArray(window.VERTICAL_SEARCH_GROUPS) ? window.VERTICAL_SEARCH_GROUPS : [];
  }

  function esc(value) {
    return String(value || '').replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[ch];
    });
  }

  function linkedinUrl(query) {
    if (typeof linkedInSearchUrl === 'function') return linkedInSearchUrl(query);
    const params = new URLSearchParams();
    params.set('keywords', query);
    params.set('origin', 'GLOBAL_SEARCH_HEADER');
    params.set('sortBy', 'date_posted');
    params.set('datePosted', 'past-week');
    return 'https://www.linkedin.com/search/results/content/?' + params.toString();
  }

  function googleUrl(query) {
    if (typeof googleSearchUrl === 'function') return googleSearchUrl(query);
    const params = new URLSearchParams();
    params.set('q', 'site:linkedin.com/posts ' + query);
    params.set('tbs', 'qdr:w,sbd:1');
    return 'https://www.google.com/search?' + params.toString();
  }

  function createVerticalSection() {
    const searchTab = document.getElementById('search');
    if (!searchTab || document.getElementById('verticalSearchSection')) return;
    const section = document.createElement('div');
    section.className = 'card';
    section.id = 'verticalSearchSection';
    section.innerHTML =
      '<h3>Vertical Search Modes</h3>' +
      '<p class="sub">Use these when you want targeted searches by industry instead of broad bookkeeping/tax searches.</p>' +
      '<div class="toolbar"><select id="verticalSelect" style="max-width:320px"></select><button class="btn gold" onclick="renderSelectedVerticalSearches()">Show Searches</button><button class="btn outline" onclick="openAllVerticalSearches()">Open All in Selected Vertical</button></div>' +
      '<div id="verticalSearchDescription" class="notice blue"></div>' +
      '<div id="verticalSearchResults" class="search-grid"></div>';
    searchTab.insertBefore(section, searchTab.firstChild);
  }

  function fillVerticalOptions() {
    const select = document.getElementById('verticalSelect');
    if (!select) return;
    select.innerHTML = groups().map(function (group, index) {
      return '<option value="' + index + '">' + esc(group.vertical) + '</option>';
    }).join('');
  }

  window.renderSelectedVerticalSearches = function () {
    const select = document.getElementById('verticalSelect');
    const resultBox = document.getElementById('verticalSearchResults');
    const description = document.getElementById('verticalSearchDescription');
    if (!select || !resultBox) return;
    const group = groups()[Number(select.value || 0)];
    if (!group) return;
    description.innerHTML = '<b>' + esc(group.vertical) + ':</b> ' + esc(group.description || 'Targeted vertical search group.');
    resultBox.innerHTML = '';
    (group.searches || []).forEach(function (item) {
      const card = document.createElement('div');
      card.className = 'search-card';
      card.innerHTML =
        '<div><strong>' + esc(item.label) + '</strong><small>' + esc(group.vertical) + ' • Past Week / Latest</small><div class="query-preview">' + esc(item.query) + '</div></div>' +
        '<div class="toolbar"><a class="btn gold small" target="_blank" href="' + linkedinUrl(item.query) + '">LinkedIn</a><a class="btn outline small" target="_blank" href="' + googleUrl(item.query) + '">Google</a></div>';
      resultBox.appendChild(card);
    });
  };

  window.openAllVerticalSearches = function () {
    const select = document.getElementById('verticalSelect');
    const group = groups()[Number(select?.value || 0)];
    if (!group || !group.searches || !group.searches.length) return;
    group.searches.forEach(function (item) {
      window.open(linkedinUrl(item.query), '_blank');
    });
  };

  function init() {
    if (!groups().length) return;
    createVerticalSection();
    fillVerticalOptions();
    window.renderSelectedVerticalSearches();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 150); });
  } else {
    setTimeout(init, 150);
  }
})();
