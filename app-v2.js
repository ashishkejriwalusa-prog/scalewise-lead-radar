const STORAGE_KEY = 'scalewise_leads_v4';
const QUEUE_KEY = 'scalewise_queue_modular_v2';
const outreachOptions = ['Not Contacted', 'Contacted', 'Replied', 'Call Booked', 'Converted', 'Not Fit'];

function getQueries() {
  return Array.isArray(window.SEARCH_QUERIES) ? window.SEARCH_QUERIES : [];
}

function openTab(tabId, button) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.querySelectorAll('.nav button').forEach(btn => btn.classList.remove('active'));
  if (button) button.classList.add('active');
  const titles = {
    dashboard: ['Dashboard', 'LinkedIn lead search assistant with modular search queries and AI outreach access.'],
    queue: ['Search Queue', 'Work through fewer OR-based LinkedIn searches.'],
    search: ['Search Library', 'Open grouped Boolean searches for high-intent posts.'],
    capture: ['Capture', 'Paste posts, score leads, skip duplicates, and save quickly.'],
    leads: ['Lead CRM', 'Manage outreach status, notes, follow-ups, and export.'],
    templates: ['Outreach Pro', 'Generate a quick draft or open AI Outreach.'],
    guide: ['Guide', 'The workflow and limitations.']
  };
  document.getElementById('title').textContent = titles[tabId][0];
  document.getElementById('desc').textContent = titles[tabId][1];
}

function openTabById(id) {
  const button = [...document.querySelectorAll('.nav button')].find(btn => btn.getAttribute('onclick') && btn.getAttribute('onclick').includes("'" + id + "'"));
  openTab(id, button);
}

function linkedInSearchUrl(query) {
  const params = new URLSearchParams();
  params.set('keywords', query);
  params.set('origin', 'GLOBAL_SEARCH_HEADER');
  params.set('sortBy', 'date_posted');
  params.set('datePosted', 'past-week');
  return 'https://www.linkedin.com/search/results/content/?' + params.toString();
}

function googleSearchUrl(query) {
  const params = new URLSearchParams();
  params.set('q', 'site:linkedin.com/posts ' + query);
  params.set('tbs', 'qdr:w,sbd:1');
  return 'https://www.google.com/search?' + params.toString();
}

function openLinkedInSearch(query) {
  window.open(linkedInSearchUrl(query), '_blank');
}

function customLinkedIn() {
  const query = document.getElementById('customSearch').value.trim();
  if (!query) return alert('Type a search phrase first.');
  openLinkedInSearch(query);
}

function customGoogle() {
  const query = document.getElementById('customSearch').value.trim();
  if (!query) return alert('Type a search phrase first.');
  window.open(googleSearchUrl(query), '_blank');
}

function getLeads() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function setLeads(leads) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  updateMetrics();
  renderLeads();
}

function getQueue() {
  return JSON.parse(localStorage.getItem(QUEUE_KEY) || '{}');
}

function setQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  renderQueue();
}

function scoreText(text) {
  const lower = ' ' + String(text || '').toLowerCase() + ' ';
  let score = 0;
  let matched = [];
  let service = 'General Finance Support';
  const has = terms => terms.some(term => lower.includes(term));
  const add = (points, label) => { score += points; if (!matched.includes(label)) matched.push(label); };

  if (has(['need a bookkeeper', 'looking for a bookkeeper', 'hiring a bookkeeper', 'bookkeeper needed', 'bookkeeping help', 'monthly bookkeeping', 'quickbooks cleanup', 'catch up bookkeeping'])) {
    add(35, 'Bookkeeping intent');
    service = 'Bookkeeping';
  }
  if (has(['need a tax preparer', 'looking for a tax preparer', 'hiring a tax preparer', 'tax preparation', 'tax filing help', 'tax season'])) {
    add(35, 'Tax prep intent');
    service = service === 'Bookkeeping' ? 'Bookkeeping + Tax' : 'Tax Preparation';
  }
  if (has(['cpa firm', 'accounting firm', 'tax practice', 'seasonal capacity', 'outsourced accounting'])) {
    add(22, 'CPA firm / outsourcing signal');
    if (service === 'General Finance Support') service = 'CPA Firm Support';
  }
  if (has(['payroll', 'gusto', 'adp', 'paychex'])) {
    add(14, 'Payroll signal');
    if (service === 'General Finance Support') service = 'Payroll Support';
  }
  if (has(['restaurant', 'cafe', 'bar', 'hospitality', 'food truck'])) {
    add(14, 'Restaurant / hospitality signal');
    if (service === 'General Finance Support') service = 'Restaurant Accounting';
  }
  if (has(['contract hire', 'contract', 'contractor', 'part-time', 'part time', 'freelance', '1099', 'seasonal', 'temporary', 'interim', 'fractional'])) {
    add(18, 'Contract hire signal');
    if (service === 'General Finance Support') service = 'Contract Hire';
  }
  if (has(['urgent', 'asap', 'immediately', 'this week', 'this month', 'need help', 'recommend'])) add(18, 'Urgency');
  if (has(['united states', ' usa ', ' u.s.', ' us ', 'atlanta', 'georgia', 'new york', 'california', 'texas', 'florida', 'chicago', 'austin', 'dallas', 'houston', 'miami', 'tampa', 'charlotte'])) add(18, 'US location signal');
  if (has(['looking for a job', 'open to work', 'resume', 'candidate', 'hire me'])) {
    score -= 35;
    matched.push('Negative / job seeker signal');
  }
  if (String(text).length > 100) score += 5;
  score = Math.max(0, Math.min(100, score));
  const qualityStatus = score >= 80 ? 'Hot' : score >= 60 ? 'Warm' : 'Review';
  return { score, qualityStatus, service, matched, nextAction: qualityStatus === 'Hot' ? 'Contact today with tailored message' : 'Review and contact manually' };
}

function normalizeText(text) {
  return String(text || '').toLowerCase().replace(/https?:\/\/\S+/g, '').replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 260);
}

function normalizeUrl(url) {
  return String(url || '').split('?')[0].replace(/\/$/, '').toLowerCase();
}

function findDuplicate(text, url) {
  const leads = getLeads();
  const nt = normalizeText(text);
  const nu = normalizeUrl(url);
  return leads.find(lead => (nu && normalizeUrl(lead.url) === nu) || (nt && normalizeText(lead.text) === nt));
}

function extractUrl(text) {
  const match = String(text || '').match(/https?:\/\/\S+/);
  return match ? match[0] : '';
}

function makeLead(text, person, url) {
  const result = scoreText(text);
  return {
    id: Date.now() + Math.random(),
    date: new Date().toISOString(),
    person: person || 'Unknown / To verify',
    url: url || extractUrl(text),
    text,
    snippet: String(text).slice(0, 360),
    score: result.score,
    qualityStatus: result.qualityStatus,
    service: result.service,
    matched: result.matched,
    outreachStatus: 'Not Contacted',
    notes: '',
    followUpDate: '',
    nextAction: result.nextAction
  };
}

function showResult(result, saved, duplicate) {
  const cls = result.qualityStatus.toLowerCase();
  document.getElementById('result').innerHTML = '<div class="card" style="margin-top:16px;background:#FBFCFE"><h3>' + (duplicate ? 'Duplicate Found' : saved ? 'Saved Lead' : 'Analysis Result') + '</h3><div class="toolbar"><div class="score ' + cls + '">' + result.score + '</div><span class="tag ' + cls + '">' + result.qualityStatus + '</span><span class="tag">' + escapeHtml(result.service) + '</span></div><p class="sub">Matched: ' + (result.matched.length ? result.matched.map(escapeHtml).join(', ') : 'No strong signals found') + '</p></div>';
}

function analyzeSingleOnly() {
  const text = document.getElementById('postText').value.trim();
  if (!text) return alert('Paste post text first.');
  showResult(scoreText(text), false, false);
}

function saveSingle() {
  const text = document.getElementById('postText').value.trim();
  if (!text) return alert('Paste post text first.');
  const person = document.getElementById('person').value.trim();
  const url = document.getElementById('url').value.trim();
  const result = scoreText(text);
  if (findDuplicate(text, url)) return showResult(result, false, true);
  const leads = getLeads();
  leads.unshift(makeLead(text, person, url));
  setLeads(leads);
  showResult(result, true, false);
}

function clearSingle() {
  document.getElementById('person').value = '';
  document.getElementById('url').value = '';
  document.getElementById('postText').value = '';
  document.getElementById('result').innerHTML = '';
}

function splitBulk(text) {
  return String(text || '').split(/\n\s*\n/).map(item => item.trim()).filter(Boolean);
}

function previewBulk() {
  const blocks = splitBulk(document.getElementById('bulkText').value);
  if (!blocks.length) return alert('Paste posts first.');
  document.getElementById('bulkResult').innerHTML = '<div class="card"><h3>Preview</h3>' + blocks.map((block, index) => {
    const result = scoreText(block);
    const cls = result.qualityStatus.toLowerCase();
    return '<p><span class="score ' + cls + '" style="display:inline-flex;width:32px;height:32px;margin-right:8px">' + result.score + '</span><b>Post ' + (index + 1) + ':</b> ' + escapeHtml(result.service) + ' — ' + result.qualityStatus + '</p>';
  }).join('') + '</div>';
}

function saveBulk() {
  const blocks = splitBulk(document.getElementById('bulkText').value);
  if (!blocks.length) return alert('Paste bulk posts first.');
  const leads = getLeads();
  let saved = 0;
  let skipped = 0;
  blocks.forEach(block => {
    if (findDuplicate(block, extractUrl(block))) { skipped++; return; }
    leads.unshift(makeLead(block, 'Bulk capture / To verify', extractUrl(block)));
    saved++;
  });
  setLeads(leads);
  document.getElementById('bulkResult').innerHTML = '<div class="notice blue"><b>Saved ' + saved + '</b> new leads. Skipped ' + skipped + ' duplicates.</div>';
  document.getElementById('bulkText').value = '';
}

function renderSearchButtons() {
  const box = document.getElementById('searchButtons');
  box.innerHTML = '';
  getQueries().forEach(item => {
    const query = item.query || item.q || '';
    const card = document.createElement('div');
    card.className = 'search-card';
    card.innerHTML = '<div><strong>' + escapeHtml(item.category || item.c) + '</strong><small>Priority ' + escapeHtml(item.priority || item.p) + ' • Merged OR query • Past Week / Latest</small><div class="query-preview">' + escapeHtml(query) + '</div></div><div class="toolbar"><a class="btn gold small" target="_blank" href="' + linkedInSearchUrl(query) + '">LinkedIn</a><a class="btn outline small" target="_blank" href="' + googleSearchUrl(query) + '">Google</a></div>';
    box.appendChild(card);
  });
}

function renderQueue() {
  const state = getQueue();
  const box = document.getElementById('queueList');
  box.innerHTML = '';
  getQueries().forEach(item => {
    const query = item.query || item.q || '';
    const done = state[query];
    const row = document.createElement('div');
    row.className = 'queue-row';
    row.style.opacity = done ? '.55' : '1';
    row.innerHTML = '<div><strong>' + escapeHtml(item.category || item.c) + '</strong><small>Priority ' + escapeHtml(item.priority || item.p) + ' • ' + (done ? 'Reviewed' : 'Pending') + '</small><div class="query-preview">' + escapeHtml(query) + '</div></div><div class="toolbar"><button class="btn gold small" onclick="openLinkedInSearch(\'' + jsEscape(query) + '\')">Open</button><button class="btn outline small" onclick="markQueue(\'' + jsEscape(query) + '\')">' + (done ? 'Undo' : 'Mark Done') + '</button></div>';
    box.appendChild(row);
  });
}

function markQueue(query) {
  const state = getQueue();
  state[query] = !state[query];
  setQueue(state);
}

function resetQueue() {
  if (confirm('Reset queue?')) setQueue({});
}

function openNextSearch() {
  const state = getQueue();
  const next = getQueries().find(item => !state[item.query || item.q]) || getQueries()[0];
  if (!next) return;
  const query = next.query || next.q;
  openLinkedInSearch(query);
  state[query] = true;
  setQueue(state);
}

function openTopSearches(count) {
  const state = getQueue();
  getQueries().filter(item => !state[item.query || item.q]).slice(0, count).forEach(item => {
    const query = item.query || item.q;
    window.open(linkedInSearchUrl(query), '_blank');
    state[query] = true;
  });
  setQueue(state);
}

function renderLeads() {
  const q = (document.getElementById('leadSearch')?.value || '').toLowerCase();
  const sf = document.getElementById('serviceFilter')?.value || 'All Services';
  const qf = document.getElementById('qualityFilter')?.value || 'All Quality';
  const of = document.getElementById('outreachFilter')?.value || 'All Outreach';
  const rows = getLeads().filter(lead => {
    const blob = (lead.person + ' ' + lead.service + ' ' + lead.text + ' ' + (lead.matched || []).join(' ') + ' ' + (lead.notes || '')).toLowerCase();
    return (!q || blob.includes(q)) && (sf === 'All Services' || lead.service === sf) && (qf === 'All Quality' || lead.qualityStatus === qf) && (of === 'All Outreach' || (lead.outreachStatus || 'Not Contacted') === of);
  });
  const box = document.getElementById('leadRows');
  box.innerHTML = '';
  if (!rows.length) { box.innerHTML = '<div class="empty">No leads match this filter.</div>'; return; }
  rows.forEach(lead => {
    const cls = (lead.qualityStatus || 'Review').toLowerCase();
    const card = document.createElement('div');
    card.className = 'lead-card';
    card.innerHTML = '<div class="lead-top"><div class="lead-title"><div class="score ' + cls + '">' + lead.score + '</div><div><h4>' + escapeHtml(lead.person) + '</h4><p>' + new Date(lead.date).toLocaleString() + ' • ' + escapeHtml(lead.service) + ' • <b>' + escapeHtml(lead.qualityStatus) + '</b></p><div>' + (lead.matched || []).map(match => '<span class="tag">' + escapeHtml(match) + '</span>').join('') + '</div></div></div><div class="lead-actions">' + (lead.url ? '<a class="btn outline small" target="_blank" href="' + escapeAttr(lead.url) + '">Open Post</a>' : '') + '<button class="btn gold small" onclick="copyLeadMessage(\'' + lead.id + '\')">Copy Message</button><button class="btn red small" onclick="deleteLead(\'' + lead.id + '\')">Delete</button></div></div><div class="snippet">' + escapeHtml(lead.snippet) + '...</div><div class="lead-controls"><div><label>Status</label><select onchange="updateLead(\'' + lead.id + '\',\'outreachStatus\',this.value)">' + outreachOptions.map(option => '<option ' + ((lead.outreachStatus || 'Not Contacted') === option ? 'selected' : '') + '>' + option + '</option>').join('') + '</select></div><div><label>Follow-up</label><input type="date" value="' + escapeAttr(lead.followUpDate || '') + '" onchange="updateLead(\'' + lead.id + '\',\'followUpDate\',this.value)"></div><div><label>Next Action</label><input value="' + escapeAttr(lead.nextAction || 'Review and contact manually') + '" onchange="updateLead(\'' + lead.id + '\',\'nextAction\',this.value)"></div></div><div class="field" style="margin-top:12px"><label>Notes</label><textarea onblur="updateLead(\'' + lead.id + '\',\'notes\',this.value)">' + escapeHtml(lead.notes || '') + '</textarea></div>';
    box.appendChild(card);
  });
}

function updateLead(id, field, value) {
  const leads = getLeads();
  const lead = leads.find(item => String(item.id) === String(id));
  if (lead) { lead[field] = value; setLeads(leads); }
}

function deleteLead(id) {
  if (confirm('Delete this lead?')) setLeads(getLeads().filter(lead => String(lead.id) !== String(id)));
}

function copyLeadMessage(id) {
  const lead = getLeads().find(item => String(item.id) === String(id));
  if (!lead) return;
  copyText(generateMessage(lead));
}

function generateMessage(lead) {
  const name = (lead.person || '').split(',')[0].replace('Bulk capture / To verify', '').replace('Unknown / To verify', '').trim() || '[Name]';
  return 'Hi ' + name + ', I saw your post about ' + (lead.service || 'accounting support') + '. ScaleWise can help with flexible bookkeeping, tax support, payroll coordination, reconciliations, and reporting. Happy to share a quick capability summary if helpful.';
}

function generateQuickOutreach() {
  const name = document.getElementById('outName').value.trim() || '[Name]';
  const company = document.getElementById('outCompany').value.trim();
  const trigger = document.getElementById('outTrigger').value.trim() || 'your post';
  const service = document.getElementById('outService').value;
  const notes = document.getElementById('outNotes').value.trim();
  const companyText = company ? ' at ' + company : '';
  document.getElementById('quickOutreach').textContent = 'Hi ' + name + ', I noticed ' + trigger + companyText + '. ScaleWise supports ' + service.toLowerCase() + ' needs with flexible bookkeeping, reconciliations, payroll coordination, tax prep support, and reporting. If the need is still open, happy to share a quick capability summary or review the requirement.\n\nContext: ' + (notes || 'Not provided');
}

function copyQuickOutreach() {
  const text = document.getElementById('quickOutreach').textContent.trim();
  if (!text || text === 'Quick draft will appear here.') return alert('Generate a draft first.');
  copyText(text);
}

function updateMetrics() {
  const leads = getLeads();
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('totalLeads').textContent = leads.length;
  document.getElementById('hotLeads').textContent = leads.filter(lead => lead.qualityStatus === 'Hot').length;
  document.getElementById('notContacted').textContent = leads.filter(lead => (lead.outreachStatus || 'Not Contacted') === 'Not Contacted').length;
  document.getElementById('dueFollowups').textContent = leads.filter(lead => lead.followUpDate && lead.followUpDate <= today && !['Converted', 'Not Fit'].includes(lead.outreachStatus)).length;
}

function exportCSV() {
  const leads = getLeads();
  if (!leads.length) return alert('No leads to export.');
  const headers = ['Date', 'Name/Company', 'Service', 'Score', 'Quality', 'Outreach Status', 'Follow-up Date', 'Next Action', 'Notes', 'Matched Signals', 'URL', 'Post Text'];
  const rows = leads.map(lead => [lead.date, lead.person, lead.service, lead.score, lead.qualityStatus, lead.outreachStatus || 'Not Contacted', lead.followUpDate || '', lead.nextAction || '', lead.notes || '', (lead.matched || []).join('; '), lead.url, lead.text]);
  const csv = [headers, ...rows].map(row => row.map(value => '"' + String(value || '').replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = 'scalewise_lead_radar_export.csv';
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

function clearLeads() {
  if (confirm('Clear all saved leads from this browser? Export CSV first if needed.')) {
    localStorage.removeItem(STORAGE_KEY);
    updateMetrics();
    renderLeads();
  }
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => alert('Copied.'));
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[ch]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '');
}

function jsEscape(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

document.addEventListener('DOMContentLoaded', () => {
  renderSearchButtons();
  renderQueue();
  updateMetrics();
  renderLeads();
});
