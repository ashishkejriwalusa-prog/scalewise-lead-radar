// ScaleWise Lead Qualification Engine
// Priority 1: reject poor-fit/job-seeker posts.
// Priority 2: classify buyer type for better targeting.

function containsAny(text, terms) {
  const lower = ' ' + String(text || '').toLowerCase() + ' ';
  return terms.some(term => lower.includes(String(term).toLowerCase()));
}

function findMatches(text, terms) {
  const lower = ' ' + String(text || '').toLowerCase() + ' ';
  return terms.filter(term => lower.includes(String(term).toLowerCase()));
}

function classifyBuyerType(text) {
  const lower = ' ' + String(text || '').toLowerCase() + ' ';
  if (containsAny(lower, ['cpa firm', 'accounting firm', 'tax firm', 'bookkeeping firm', 'ea firm', 'tax practice', 'tax office'])) return 'CPA Firm';
  if (containsAny(lower, ['restaurant', 'cafe', 'bar ', 'hospitality', 'food truck', 'bakery', 'diner', 'franchise location'])) return 'Restaurant / Hospitality';
  if (containsAny(lower, ['startup', 'saas', 'founder', 'seed round', 'series a', 'investor', 'venture', 'growth company'])) return 'Startup / Growth Company';
  if (containsAny(lower, ['law firm', 'dental', 'medical practice', 'clinic', 'real estate', 'agency', 'consulting firm', 'professional services'])) return 'Professional Services';
  if (containsAny(lower, ['small business', 'business owner', 'owner operator', 'my business', 'our business', 'local business'])) return 'Small Business';
  return 'Unknown / To Verify';
}

function rejectReason(text) {
  const jobSeekerTerms = ['#opentowork', 'open to work', 'opentowork', 'looking for work', 'looking for job', 'looking for a job', 'job seeker', 'actively looking', 'seeking opportunity', 'seeking opportunities', 'my resume', 'resume attached', 'hire me', 'available for work', 'available for opportunities'];
  const studentTerms = ['internship', 'entry level candidate', 'recent graduate looking', 'student looking'];
  const recruiterCandidateTerms = ['candidate available', 'available candidate', 'submit your resume', 'send your resume'];
  if (containsAny(text, jobSeekerTerms)) return 'Job seeker / OpenToWork post';
  if (containsAny(text, recruiterCandidateTerms)) return 'Candidate/recruiter supply post';
  if (containsAny(text, studentTerms)) return 'Student/internship post';
  return '';
}

function scoreText(text) {
  const lower = ' ' + String(text || '').toLowerCase() + ' ';
  let score = 0;
  let matched = [];
  let service = 'General Finance Support';
  const add = (points, label) => { score += points; if (!matched.includes(label)) matched.push(label); };
  const has = terms => containsAny(lower, terms);
  const reject = rejectReason(lower);
  const buyerType = classifyBuyerType(lower);

  if (reject) {
    return {
      score: 0,
      qualityStatus: 'Reject',
      service: 'Not Fit',
      matched: ['Rejected: ' + reject],
      buyerType,
      rejectReason: reject,
      nextAction: 'Do not contact. Skip this post.'
    };
  }

  if (has(['need a bookkeeper', 'hiring a bookkeeper', 'bookkeeper needed', 'recommend a bookkeeper', 'anyone know a bookkeeper', 'bookkeeping help', 'quickbooks cleanup', 'catch up bookkeeping', 'monthly bookkeeping'])) {
    add(35, 'Bookkeeping buyer intent');
    service = 'Bookkeeping';
  }
  if (has(['need a tax preparer', 'hiring a tax preparer', 'tax preparer needed', 'recommend a tax preparer', 'anyone know a tax preparer', 'tax preparation', 'tax filing help', 'tax season help'])) {
    add(35, 'Tax prep buyer intent');
    service = service === 'Bookkeeping' ? 'Bookkeeping + Tax' : 'Tax Preparation';
  }
  if (has(['need', 'hiring', 'recommend', 'referral', 'iso', 'anyone know', 'looking for recommendations'])) add(22, 'Buyer intent language');
  if (has(['cpa firm', 'accounting firm', 'tax firm', 'tax practice', 'seasonal capacity', 'outsourced accounting', 'overflow'])) {
    add(22, 'CPA firm / capacity signal');
    if (service === 'General Finance Support') service = 'CPA Firm Support';
  }
  if (has(['payroll', 'gusto', 'adp', 'paychex'])) {
    add(14, 'Payroll signal');
    if (service === 'General Finance Support') service = 'Payroll Support';
  }
  if (has(['restaurant', 'cafe', 'hospitality', 'food truck', 'bar ', 'bakery'])) {
    add(14, 'Restaurant / hospitality signal');
    if (service === 'General Finance Support') service = 'Restaurant Accounting';
  }
  if (has(['contract hire', 'contract', 'contractor', 'part-time', 'part time', 'freelance', '1099', 'seasonal', 'temporary', 'interim', 'fractional'])) {
    add(18, 'Contract/flexible support signal');
    if (service === 'General Finance Support') service = 'Contract Hire';
  }
  if (has(['urgent', 'asap', 'immediately', 'this week', 'this month', 'need help'])) add(18, 'Urgency');
  if (has(['united states', ' usa ', ' u.s.', ' us ', 'atlanta', 'georgia', 'new york', 'california', 'texas', 'florida', 'chicago', 'austin', 'dallas', 'houston', 'miami', 'tampa', 'charlotte'])) add(14, 'US location signal');

  if (buyerType !== 'Unknown / To Verify') add(8, 'Buyer type classified: ' + buyerType);
  if (String(text).length > 100) score += 5;

  score = Math.max(0, Math.min(100, score));
  const qualityStatus = score >= 80 ? 'Hot' : score >= 60 ? 'Warm' : score >= 40 ? 'Review' : 'Low Fit';
  const nextAction = qualityStatus === 'Hot' ? 'Contact today with AI-generated outreach' : qualityStatus === 'Warm' ? 'Review and contact if context is clear' : 'Review before contacting';
  return { score, qualityStatus, service, matched, buyerType, rejectReason: '', nextAction };
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
    buyerType: result.buyerType || 'Unknown / To Verify',
    rejectReason: result.rejectReason || '',
    matched: result.matched,
    outreachStatus: result.qualityStatus === 'Reject' ? 'Not Fit' : 'Not Contacted',
    notes: '',
    followUpDate: '',
    nextAction: result.nextAction
  };
}

function showResult(result, saved, duplicate) {
  const cls = result.qualityStatus === 'Reject' || result.qualityStatus === 'Low Fit' ? 'review' : result.qualityStatus.toLowerCase();
  const buyer = result.buyerType || 'Unknown / To Verify';
  const reject = result.rejectReason ? '<div class="notice" style="margin-top:12px"><b>Rejected:</b> ' + escapeHtml(result.rejectReason) + '</div>' : '';
  document.getElementById('result').innerHTML = '<div class="card" style="margin-top:16px;background:#FBFCFE"><h3>' + (duplicate ? 'Duplicate Found' : saved ? 'Saved Lead' : result.qualityStatus === 'Reject' ? 'Rejected Lead' : 'Analysis Result') + '</h3><div class="toolbar"><div class="score ' + cls + '">' + result.score + '</div><span class="tag">' + escapeHtml(result.qualityStatus) + '</span><span class="tag">' + escapeHtml(result.service) + '</span><span class="tag">' + escapeHtml(buyer) + '</span></div><p class="sub">Matched: ' + (result.matched.length ? result.matched.map(escapeHtml).join(', ') : 'No strong signals found') + '</p>' + reject + '</div>';
}

function saveSingle() {
  const text = document.getElementById('postText').value.trim();
  if (!text) return alert('Paste post text first.');
  const person = document.getElementById('person').value.trim();
  const url = document.getElementById('url').value.trim();
  const result = scoreText(text);
  if (result.qualityStatus === 'Reject') return showResult(result, false, false);
  if (findDuplicate(text, url)) return showResult(result, false, true);
  const leads = getLeads();
  leads.unshift(makeLead(text, person, url));
  setLeads(leads);
  showResult(result, true, false);
}

function previewBulk() {
  const blocks = splitBulk(document.getElementById('bulkText').value);
  if (!blocks.length) return alert('Paste posts first.');
  document.getElementById('bulkResult').innerHTML = '<div class="card"><h3>Preview</h3>' + blocks.map((block, index) => {
    const result = scoreText(block);
    const cls = result.qualityStatus === 'Reject' || result.qualityStatus === 'Low Fit' ? 'review' : result.qualityStatus.toLowerCase();
    return '<p><span class="score ' + cls + '" style="display:inline-flex;width:32px;height:32px;margin-right:8px">' + result.score + '</span><b>Post ' + (index + 1) + ':</b> ' + escapeHtml(result.service) + ' — ' + escapeHtml(result.qualityStatus) + ' — ' + escapeHtml(result.buyerType || 'Unknown / To Verify') + (result.rejectReason ? ' — Rejected: ' + escapeHtml(result.rejectReason) : '') + '</p>';
  }).join('') + '</div>';
}

function saveBulk() {
  const blocks = splitBulk(document.getElementById('bulkText').value);
  if (!blocks.length) return alert('Paste bulk posts first.');
  const leads = getLeads();
  let saved = 0;
  let skipped = 0;
  let rejected = 0;
  blocks.forEach(block => {
    const result = scoreText(block);
    if (result.qualityStatus === 'Reject') { rejected++; return; }
    if (findDuplicate(block, extractUrl(block))) { skipped++; return; }
    leads.unshift(makeLead(block, 'Bulk capture / To verify', extractUrl(block)));
    saved++;
  });
  setLeads(leads);
  document.getElementById('bulkResult').innerHTML = '<div class="notice blue"><b>Saved ' + saved + '</b> new leads. Skipped ' + skipped + ' duplicates. Rejected ' + rejected + ' job-seeker/non-buyer posts.</div>';
  document.getElementById('bulkText').value = '';
}

function renderLeads() {
  const q = (document.getElementById('leadSearch')?.value || '').toLowerCase();
  const sf = document.getElementById('serviceFilter')?.value || 'All Services';
  const qf = document.getElementById('qualityFilter')?.value || 'All Quality';
  const of = document.getElementById('outreachFilter')?.value || 'All Outreach';
  const rows = getLeads().filter(lead => {
    const blob = (lead.person + ' ' + lead.service + ' ' + (lead.buyerType || '') + ' ' + lead.text + ' ' + (lead.matched || []).join(' ') + ' ' + (lead.notes || '')).toLowerCase();
    return (!q || blob.includes(q)) && (sf === 'All Services' || lead.service === sf) && (qf === 'All Quality' || lead.qualityStatus === qf) && (of === 'All Outreach' || (lead.outreachStatus || 'Not Contacted') === of);
  });
  const box = document.getElementById('leadRows');
  box.innerHTML = '';
  if (!rows.length) { box.innerHTML = '<div class="empty">No leads match this filter.</div>'; return; }
  rows.forEach(lead => {
    const cls = (lead.qualityStatus === 'Reject' || lead.qualityStatus === 'Low Fit') ? 'review' : (lead.qualityStatus || 'Review').toLowerCase();
    const card = document.createElement('div');
    card.className = 'lead-card';
    card.innerHTML = '<div class="lead-top"><div class="lead-title"><div class="score ' + cls + '">' + lead.score + '</div><div><h4>' + escapeHtml(lead.person) + '</h4><p>' + new Date(lead.date).toLocaleString() + ' • ' + escapeHtml(lead.service) + ' • <b>' + escapeHtml(lead.qualityStatus) + '</b> • ' + escapeHtml(lead.buyerType || 'Unknown / To Verify') + '</p><div>' + (lead.matched || []).map(match => '<span class="tag">' + escapeHtml(match) + '</span>').join('') + '</div></div></div><div class="lead-actions">' + (lead.url ? '<a class="btn outline small" target="_blank" href="' + escapeAttr(lead.url) + '">Open Post</a>' : '') + '<button class="btn gold small" onclick="copyLeadMessage(\'' + lead.id + '\')">Copy Message</button><button class="btn red small" onclick="deleteLead(\'' + lead.id + '\')">Delete</button></div></div><div class="snippet">' + escapeHtml(lead.snippet) + '...</div><div class="lead-controls"><div><label>Status</label><select onchange="updateLead(\'' + lead.id + '\',\'outreachStatus\',this.value)">' + outreachOptions.map(option => '<option ' + ((lead.outreachStatus || 'Not Contacted') === option ? 'selected' : '') + '>' + option + '</option>').join('') + '</select></div><div><label>Follow-up</label><input type="date" value="' + escapeAttr(lead.followUpDate || '') + '" onchange="updateLead(\'' + lead.id + '\',\'followUpDate\',this.value)"></div><div><label>Next Action</label><input value="' + escapeAttr(lead.nextAction || 'Review and contact manually') + '" onchange="updateLead(\'' + lead.id + '\',\'nextAction\',this.value)"></div></div><div class="field" style="margin-top:12px"><label>Notes</label><textarea onblur="updateLead(\'' + lead.id + '\',\'notes\',this.value)">' + escapeHtml(lead.notes || '') + '</textarea></div>';
    box.appendChild(card);
  });
}

function generateMessage(lead) {
  const name = (lead.person || '').split(',')[0].replace('Bulk capture / To verify', '').replace('Unknown / To verify', '').trim() || '[Name]';
  const buyerType = lead.buyerType || 'your business';
  return 'Hi ' + name + ', I saw your post about ' + (lead.service || 'accounting support') + '. Since this looks like a ' + buyerType + ' need, ScaleWise can help with flexible bookkeeping, tax support, reconciliations, payroll coordination, and reporting. Happy to share a quick capability summary if useful.';
}

window.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    updateMetrics();
    renderLeads();
  }, 100);
});
