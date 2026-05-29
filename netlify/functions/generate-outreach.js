exports.handler = async function (event) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ ok: true }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'openrouter/free';

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'OPENROUTER_API_KEY is not configured in Netlify environment variables.'
      })
    };
  }

  let lead;
  try {
    lead = JSON.parse(event.body || '{}');
  } catch (error) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON body.' }) };
  }

  const prompt = `You are an expert B2B sales copywriter for ScaleWise, an accounting and finance support firm.

Generate high-callback outreach for a LinkedIn lead. Use only the information provided. Do not claim you visited the URL or read the LinkedIn profile unless the content is pasted below.

Company service context:
ScaleWise offers bookkeeping, QuickBooks cleanup, reconciliations, payroll coordination, tax preparation support, CPA firm capacity support, restaurant accounting, reporting, and flexible contract accounting support.

Lead details:
- Poster name: ${lead.name || 'Unknown'}
- Company: ${lead.company || 'Unknown'}
- Profile URL reference: ${lead.profile || 'Not provided'}
- Post URL reference: ${lead.post || 'Not provided'}
- Service angle: ${lead.service || 'Auto-detect'}
- Poster role: ${lead.role || 'Unknown'}
- Business type: ${lead.businessType || 'Unknown'}
- Exact trigger from post: ${lead.trigger || 'Not provided'}
- Likely pain: ${lead.pain || 'Unknown'}
- Urgency: ${lead.urgency || 'Unknown'}
- CTA preference: ${lead.cta || 'Offer quick capability summary'}
- Services to mention: ${lead.services || 'bookkeeping, reconciliations, payroll coordination, tax prep support, reporting'}
- Pasted post text / summary: ${lead.postText || 'Not provided'}
- Profile/context notes: ${lead.notes || 'Not provided'}

Output format:
1. PERSONALIZATION SCORE: score out of 100 and one sentence explaining what is missing.
2. CONNECTION NOTE: under 280 characters.
3. BEST FIRST DM: 70-110 words, specific, practical, not pushy.
4. SHORT DM: under 450 characters.
5. CONSULTATIVE DM: 110-150 words.
6. FOLLOW-UP SEQUENCE: Day 2, Day 5, Day 10.
7. OBJECTION RESPONSES: pricing, send info, already have someone, not now.

Rules:
- Sound human, concise, and professional.
- Do not use spammy phrases like "I hope this message finds you well".
- Do not overpromise.
- Do not say you scraped or reviewed the profile URL.
- Mention the exact trigger and pain if provided.
- Make the CTA low-friction.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://scalewiselead.netlify.app',
        'X-OpenRouter-Title': 'ScaleWise Lead Radar'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You write customized B2B outreach for accounting and finance services.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.55,
        max_tokens: 1400
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: corsHeaders,
        body: JSON.stringify({ error: data?.error?.message || data?.message || 'OpenRouter request failed.', details: data })
      };
    }

    const text = data?.choices?.[0]?.message?.content || '';
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ text, model }) };
  } catch (error) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message || 'Server error.' }) };
  }
};
