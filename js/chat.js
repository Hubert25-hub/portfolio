/* Hubcreate chat assistant (front end)
   Sends messages to the Cloudflare Worker, which holds the secret API key.
   Load with: <script src="js/chat.js" defer></script> */
(function () {
  'use strict';

  var WORKER_URL = 'https://portfolio-chatbot.hubertdjobokou3.workers.dev';
  var MAX_HISTORY = 10;      // messages sent to the Worker (it keeps 10 too)
  var MAX_CHARS = 500;       // same limit as the Worker
  var MIN_GAP_MS = 1500;     // minimum time between two messages
  var STORE_KEY = 'hubcreate_chat_history';

  var TEXT = {
    en: {
      open: 'Open chat',
      close: 'Close chat',
      title: 'Hubcreate assistant',
      subtitle: 'AI assistant · ask about my services',
      placeholder: 'Type your message…',
      send: 'Send',
      greeting: "Hi! I'm the Hubcreate assistant. Ask me about flyers, logos, branding or websites, or tell me about your project.",
      error: "Sorry, I can't answer right now. Please use the contact form on the Services page or email hubertdjobokou3@gmail.com.",
      wait: 'Please wait a moment before sending another message.',
      typing: 'The assistant is typing'
    },
    fr: {
      open: 'Ouvrir le chat',
      close: 'Fermer le chat',
      title: 'Assistant Hubcreate',
      subtitle: 'Assistant IA · posez vos questions',
      placeholder: 'Écrivez votre message…',
      send: 'Envoyer',
      greeting: "Bonjour ! Je suis l'assistant de Hubcreate. Posez-moi vos questions sur les flyers, logos, l'identité de marque ou les sites web, ou parlez-moi de votre projet.",
      error: "Désolé, je ne peux pas répondre pour le moment. Utilisez le formulaire de contact sur la page Services ou écrivez à hubertdjobokou3@gmail.com.",
      wait: 'Veuillez patienter un instant avant d\'envoyer un autre message.',
      typing: "L'assistant écrit"
    }
  };

  function lang() {
    var l = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return l === 'fr' ? 'fr' : 'en';
  }

  function t() {
    return TEXT[lang()];
  }

  function isValid(m) {
    return m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string';
  }

  function loadHistory() {
    try {
      var raw = sessionStorage.getItem(STORE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.filter(isValid).slice(-MAX_HISTORY) : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
    } catch (e) { /* ignore */ }
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // Safe text with clickable links and emails (no innerHTML, so no injection risk)
  function appendRich(container, text) {
    var pattern = /(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;
    var last = 0;
    var match;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > last) {
        container.appendChild(document.createTextNode(text.slice(last, match.index)));
      }

      var token = match[0];
      var tail = '';
      var trailing = token.match(/[).,!?;:]+$/);
      if (trailing) {
        tail = trailing[0];
        token = token.slice(0, token.length - tail.length);
      }

      var a = document.createElement('a');
      var isEmail = token.indexOf('@') !== -1 && token.indexOf('http') !== 0;
      a.href = isEmail ? 'mailto:' + token : token;
      a.textContent = token;
      if (!isEmail) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      container.appendChild(a);
      if (tail) container.appendChild(document.createTextNode(tail));

      last = match.index + match[0].length;
    }

    if (last < text.length) {
      container.appendChild(document.createTextNode(text.slice(last)));
    }
  }

  var ICON_CHAT =
    '<svg class="hc-ico-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.6-.8L3 21l1.9-5.1A8.4 8.4 0 1 1 21 11.5z"/></svg>';
  var ICON_CLOSE =
    '<svg class="hc-ico-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M18 6 6 18M6 6l12 12"/></svg>';
  var ICON_SEND =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>';

  function init() {
    if (document.getElementById('hcChat')) return;

    var history = loadHistory();
    var busy = false;
    var lastSent = 0;

    // ----- Build the interface -----
    var root = el('div', 'hc-root');
    root.id = 'hcChat';

    var launcher = el('button', 'hc-launcher');
    launcher.type = 'button';
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-controls', 'hcPanel');
    launcher.innerHTML = ICON_CHAT + ICON_CLOSE;

    var panel = el('section', 'hc-panel');
    panel.id = 'hcPanel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');

    var header = el('div', 'hc-header');
    var headerText = el('div', 'hc-header-text');
    var title = el('strong', 'hc-title');
    var subtitle = el('span', 'hc-subtitle');
    headerText.appendChild(title);
    headerText.appendChild(subtitle);
    var closeBtn = el('button', 'hc-close');
    closeBtn.type = 'button';
    closeBtn.innerHTML = ICON_CLOSE;
    header.appendChild(headerText);
    header.appendChild(closeBtn);

    var messages = el('div', 'hc-messages');
    messages.setAttribute('role', 'log');
    messages.setAttribute('aria-live', 'polite');

    var form = el('form', 'hc-form');
    form.setAttribute('autocomplete', 'off');
    var input = el('input', 'hc-input');
    input.type = 'text';
    input.maxLength = MAX_CHARS;
    var sendBtn = el('button', 'hc-send');
    sendBtn.type = 'submit';
    sendBtn.innerHTML = ICON_SEND;
    form.appendChild(input);
    form.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(messages);
    panel.appendChild(form);
    root.appendChild(launcher);
    root.appendChild(panel);
    document.body.appendChild(root);

    // ----- Helpers -----
    function scrollDown() {
      messages.scrollTop = messages.scrollHeight;
    }

    function addMessage(role, text) {
      var bubble = el('div', 'hc-msg ' + (role === 'user' ? 'hc-msg--user' : 'hc-msg--bot'));
      if (role === 'user') bubble.textContent = text;
      else appendRich(bubble, text);
      messages.appendChild(bubble);
      scrollDown();
      return bubble;
    }

    function addTyping() {
      var bubble = el('div', 'hc-msg hc-msg--bot hc-typing');
      bubble.setAttribute('aria-label', t().typing);
      bubble.appendChild(el('span'));
      bubble.appendChild(el('span'));
      bubble.appendChild(el('span'));
      messages.appendChild(bubble);
      scrollDown();
      return bubble;
    }

    function setOpen(open) {
      if (open) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
      panel.hidden = !open;
      launcher.classList.toggle('is-open', open);
      launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
      applyLang();
      if (open) {
        scrollDown();
        setTimeout(function () { input.focus(); }, 50);
      }
    }

    // Text that depends on the language (EN / FR)
    var greetingEl = addMessage('bot', t().greeting);

    function applyLang() {
      var txt = t();
      title.textContent = txt.title;
      subtitle.textContent = txt.subtitle;
      input.placeholder = txt.placeholder;
      input.setAttribute('aria-label', txt.placeholder);
      sendBtn.setAttribute('aria-label', txt.send);
      closeBtn.setAttribute('aria-label', txt.close);
      panel.setAttribute('aria-label', txt.title);
      launcher.setAttribute('aria-label', panel.hidden ? txt.open : txt.close);
      greetingEl.textContent = '';
      appendRich(greetingEl, txt.greeting);
    }

    // Show the saved conversation (from earlier pages in this visit)
    history.forEach(function (m) {
      addMessage(m.role === 'user' ? 'user' : 'bot', m.content);
    });
    applyLang();

    // ----- Sending a message -----
    function send(raw) {
      var text = (raw || '').trim().slice(0, MAX_CHARS);
      if (!text || busy) return;

      var now = Date.now();
      if (now - lastSent < MIN_GAP_MS) {
        addMessage('bot', t().wait);
        return;
      }
      lastSent = now;

      history.push({ role: 'user', content: text });
      addMessage('user', text);
      busy = true;
      sendBtn.disabled = true;
      var typing = addTyping();

      function fail() {
        history.pop(); // remove the message that got no answer
        saveHistory(history);
        addMessage('bot', t().error);
      }

      fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-MAX_HISTORY) })
      })
        .then(function (res) {
          return res.json().then(
            function (data) { return { ok: res.ok, data: data }; },
            function () { return { ok: false, data: null }; }
          );
        })
        .then(function (result) {
          if (typing.parentNode) typing.parentNode.removeChild(typing);
          if (result.ok && result.data && typeof result.data.reply === 'string' && result.data.reply) {
            history.push({ role: 'assistant', content: result.data.reply });
            saveHistory(history);
            addMessage('bot', result.data.reply);
          } else {
            fail();
          }
        })
        .catch(function () {
          if (typing.parentNode) typing.parentNode.removeChild(typing);
          fail();
        })
        .then(function () {
          busy = false;
          sendBtn.disabled = false;
          input.focus();
        });
    }

    // ----- Events -----
    launcher.addEventListener('click', function (e) {
      e.preventDefault();
      setOpen(panel.hidden);
    });

    closeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      launcher.focus();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = input.value;
      input.value = '';
      send(value);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) {
        setOpen(false);
        launcher.focus();
      }
    });

    // Update the text when the EN/FR switch changes <html lang>
    new MutationObserver(applyLang).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
