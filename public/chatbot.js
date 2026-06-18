// chatbot.js — Studio Legale Pagliaro widget
// Zero dependencies. Call init({ apiKey }) to mount.

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const WELCOME_MSG =
  'Sono l\'assistente virtuale AI dello Studio Legale Pagliaro. ' +
  'Ai sensi dell\'AI Act ti informo che stai interagendo con un sistema di intelligenza artificiale e non con un avvocato. ' +
  'Posso fornirti informazioni generali su diritto del lavoro, previdenza sociale e pubblico impiego. ' +
  'Come posso aiutarti?';

const LAW_FIRM_CONTEXT = `
Sei l'assistente virtuale dello Studio Legale Pagliaro. Rispondi esclusivamente in italiano, con tono professionale, formale e rassicurante. Non fornire mai pareri legali specifici su casi concreti: per questi, invita sempre il cliente a contattare lo studio per una consulenza.

STUDIO: Studio Legale Pagliaro, specializzato esclusivamente in diritto del lavoro, previdenza sociale e pubblico impiego. Sedi a Chieti e Roma. Avv. Emanuele Pagliaro, oltre 20 anni di esperienza, 200+ vertenze trattate.

AREE DI COMPETENZA:
- Diritto del lavoro: licenziamenti, demansionamento, mobbing, discriminazioni, risarcimenti
- Previdenza sociale: pensioni, invalidità, contributi figurativi, ricorsi INPS
- Pubblico impiego: controversie con enti pubblici, concorsi, carriera, disciplinari
- Diritto sindacale: vertenze sindacali, accordi collettivi
- Infortunistica: infortuni sul lavoro, malattie professionali, ricorsi INAIL

CONTATTI:
- Chieti: Corso Marrucino, Chieti (CH) — Tel: 0871 000000
- Roma: Via del Corso, Roma (RM) — Tel: 06 000000
- Email: info@avvocatopagliaro.it
- Orari: Lunedì–Venerdì, 09:00–18:30

CONSULENZA: tramite modulo contatti sul sito, email, telefono, presenza a Chieti/Roma su appuntamento, videochiamata (Teams, Zoom, WhatsApp). Risposta garantita entro 48h lavorative.

ISTRUZIONI: Rispondi SEMPRE in italiano. Tono professionale e rassicurante. Non fornire pareri legali specifici su casi concreti. Risposte concise (max 3–4 frasi). Se non sai rispondere, suggerisci di contattare lo studio.
`.trim();

const ICON_CHAT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`;
const ICON_CLOSE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

const DEFAULTS = {
  title: 'Come possiamo aiutarvi?',
  placeholder: 'Scrivi un messaggio…',
  openLabel: 'Apri chat',
  closeLabel: 'Chiudi',
  sendLabel: 'Invia',
  typingSpeedMs: 20,
  initialMessages: [],
  errorMessage: 'Qualcosa è andato storto. Riprova tra qualche secondo.',
};

let cfg = {};
let state = { open: false, messages: [], waiting: false, pending: null, nextId: 0 };
let els = {};
let pendingEl = null;

export function init(config) {
  cfg = { ...DEFAULTS, ...config };
  if (!cfg.apiKey) throw new Error('[chatbot] apiKey is required');
  buildDOM();
  cfg.initialMessages.forEach(m => appendMessage(m.sender, m.text, false));
}

function buildDOM() {
  const root = mk('div', { 'data-n8n-chatbot': 'root' });

  const panel = mk('div', {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': cfg.title,
    'data-n8n-chatbot': 'panel',
  });
  panel.hidden = true;

  const header = mk('header', { 'data-n8n-chatbot': 'header' });
  const titleSpan = mk('span', { 'data-n8n-chatbot': 'title' }, cfg.title);
  const closeBtn = mk('button', {
    type: 'button',
    'data-n8n-chatbot': 'close',
    'aria-label': cfg.closeLabel,
  }, cfg.closeLabel);
  header.append(titleSpan, closeBtn);

  const messages = mk('div', { 'data-n8n-chatbot': 'messages' });

  const typing = mk('div', { 'data-n8n-chatbot': 'typing', 'aria-label': 'In elaborazione' });
  typing.hidden = true;
  for (let i = 0; i < 3; i++) typing.append(mk('span', { 'data-n8n-chatbot': 'typing-dot' }));
  messages.append(typing);

  const form = mk('form', { 'data-n8n-chatbot': 'form' });
  const input = mk('input', {
    type: 'text',
    'data-n8n-chatbot': 'input',
    placeholder: cfg.placeholder,
    'aria-label': 'Messaggio',
    autocomplete: 'off',
  });
  const sendBtn = mk('button', {
    type: 'submit',
    'data-n8n-chatbot': 'send',
    'aria-label': cfg.sendLabel,
  }, cfg.sendLabel);
  sendBtn.disabled = true;
  form.append(input, sendBtn);

  panel.append(header, messages, form);

  const toggle = mk('button', {
    type: 'button',
    'data-n8n-chatbot': 'toggle',
    'data-open': 'false',
    'aria-label': cfg.openLabel,
    'aria-expanded': 'false',
  });
  toggle.innerHTML = ICON_CHAT;

  root.append(panel, toggle);
  document.body.append(root);

  els = { root, panel, messages, typing, form, input, sendBtn, toggle };

  appendMessage('bot', WELCOME_MSG, false);

  closeBtn.addEventListener('click', () => setOpen(false));
  toggle.addEventListener('click', () => setOpen(!state.open));
  form.addEventListener('submit', e => { e.preventDefault(); send(); });
  input.addEventListener('input', () => {
    els.sendBtn.disabled = !input.value.trim() || state.waiting;
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && state.open) setOpen(false);
  });
}

async function send() {
  const text = els.input.value.trim();
  if (!text || state.waiting) return;

  appendMessage('user', text);
  els.input.value = '';
  els.sendBtn.disabled = true;
  setWaiting(true);

  try {
    const reply = await callGroq();
    setWaiting(false);
    startTypewriter(reply);
  } catch (err) {
    console.error('[chatbot]', err);
    setWaiting(false);
    appendMessage('bot', cfg.errorMessage);
  }
}

async function callGroq() {
  const messages = [
    { role: 'system', content: LAW_FIRM_CONTEXT },
    ...state.messages.slice(-10).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
  ];

  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({ model: GROQ_MODEL, messages }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

function startTypewriter(full) {
  const skipAnim =
    cfg.typingSpeedMs <= 0 ||
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (skipAnim) {
    appendMessage('bot', full);
    return;
  }

  // Create element once — update textContent in-place each tick
  pendingEl = mk('div', { 'data-n8n-chatbot': 'message', 'data-sender': 'bot', 'data-pending': 'true' });
  els.messages.insertBefore(pendingEl, els.typing);
  state.pending = { full, shown: 0 };
  scrollToBottom();
  setTimeout(tickTypewriter, cfg.typingSpeedMs);
}

function tickTypewriter() {
  if (!state.pending || !pendingEl) return;
  const { full, shown } = state.pending;

  state.pending.shown++;
  pendingEl.textContent = full.slice(0, state.pending.shown);
  scrollToBottom();

  if (state.pending.shown >= full.length) {
    pendingEl.removeAttribute('data-pending');
    state.messages.push({ id: state.nextId++, sender: 'bot', text: full });
    state.pending = null;
    pendingEl = null;
    return;
  }

  setTimeout(tickTypewriter, cfg.typingSpeedMs);
}

function appendMessage(sender, text, scroll = true) {
  state.messages.push({ id: state.nextId++, sender, text });
  const div = mk('div', { 'data-n8n-chatbot': 'message', 'data-sender': sender }, text);
  els.messages.insertBefore(div, els.typing);
  if (scroll) scrollToBottom();
}


function setWaiting(val) {
  state.waiting = val;
  els.typing.hidden = !val;
  scrollToBottom();
}

function setOpen(val) {
  state.open = val;
  els.panel.hidden = !val;
  els.toggle.setAttribute('data-open', String(val));
  els.toggle.setAttribute('aria-expanded', String(val));
  els.toggle.setAttribute('aria-label', val ? cfg.closeLabel : cfg.openLabel);
  els.toggle.innerHTML = val ? ICON_CLOSE : ICON_CHAT;
  if (val) setTimeout(() => els.input.focus(), 50);
}

function scrollToBottom() {
  els.messages.scrollTop = els.messages.scrollHeight;
}

function mk(tag, attrs = {}, text) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}
