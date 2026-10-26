/* Salon de l'écriture — 共通の動き
   ・日本語／英語の切り替え（選んだ言語はブラウザに保存。URL に ?lang=en を付けても英語で開きます）
   ・作品ページの縦書き／横書き（小説は縦書き、評論・エッセイは横書きで始まり、
     読者が選んだ向きは「小説」と「評論・エッセイ」で別々にブラウザに保存）
   ・作品一覧の絞り込みと並べ替え
   ・お知らせ（data/news.js）の表示と、申込ボタンの行き先 */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var root = body.getAttribute('data-root') || './';
  var NEWS = window.NEWS || {};

  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* 保存できない環境では覚えない */ } }
  };
  var session = {
    get: function (k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* 何もしない */ } }
  };

  var query = new URLSearchParams(window.location.search);
  var qLang = query.get('lang');
  if (qLang === 'en' || qLang === 'ja') store.set('salon-lang', qLang);
  var lang = store.get('salon-lang') === 'en' ? 'en' : 'ja';

  // ?preview=1 で仮の内容（draft）も表示する。?preview=0 で戻す。
  if (query.get('preview') === '1') session.set('salon-preview', '1');
  if (query.get('preview') === '0') session.set('salon-preview', '0');
  var preview = session.get('salon-preview') === '1';

  var S = {
    ja: {
      next: '次回の会', signUp: '申し込む', signUpThis: 'この会に申し込む', seeNews: 'お知らせを見る　→',
      tbd: '次回の日程は準備中です。',
      noUpcoming: '次回の会は準備中です。決まりしだい、ここでお知らせします。',
      noRecords: 'まだ記録はありません。会のあと、ここに記録を載せます。',
      place: '場所', content: '内容', join: '申込', viaForm: 'Googleフォームから',
      formSoon: '申込フォームは準備中です。', draft: '仮の内容'
    },
    en: {
      next: 'Next salon', signUp: 'Sign up', signUpThis: 'Sign up for this salon', seeNews: 'See news →',
      tbd: 'The next date is being planned.',
      noUpcoming: 'The next salon is being planned. It will be announced here.',
      noRecords: 'No records yet. Notes from each salon will be posted here afterwards.',
      place: 'Venue', content: 'Programme', join: 'How to join', viaForm: 'Via Google Form',
      formSoon: 'The sign-up form is not open yet.', draft: 'Draft'
    }
  };
  function s(k) { return S[lang][k]; }

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function each(sel, fn) { Array.prototype.forEach.call(doc.querySelectorAll(sel), fn); }

  /* ---------- 言語 ---------- */
  function applyLang() {
    doc.documentElement.lang = lang;
    each('[data-en]', function (el) {
      if (!el.hasAttribute('data-ja')) el.setAttribute('data-ja', el.textContent);
      el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-ja');
    });
    each('[data-en-label]', function (el) {
      if (!el.hasAttribute('data-ja-label')) el.setAttribute('data-ja-label', el.getAttribute('aria-label') || '');
      el.setAttribute('aria-label', lang === 'en' ? el.getAttribute('data-en-label') : el.getAttribute('data-ja-label'));
    });
    if (!body.hasAttribute('data-title-ja')) body.setAttribute('data-title-ja', doc.title);
    var tEn = body.getAttribute('data-title-en');
    doc.title = lang === 'en' && tEn ? tEn : body.getAttribute('data-title-ja');
    var sw = doc.getElementById('lang-switch');
    if (sw) {
      sw.textContent = lang === 'en' ? '日本語' : 'English';
      sw.setAttribute('lang', lang === 'en' ? 'ja' : 'en');
      sw.setAttribute('href', '?lang=' + (lang === 'en' ? 'ja' : 'en'));
    }
  }

  var sw = doc.getElementById('lang-switch');
  if (sw) {
    sw.addEventListener('click', function (e) {
      e.preventDefault();
      lang = lang === 'en' ? 'ja' : 'en';
      store.set('salon-lang', lang);
      if (query.has('lang') && window.history.replaceState) {
        query.delete('lang');
        var qs = query.toString();
        window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
      }
      applyLang();
      renderNews();
    });
  }

  /* ---------- お知らせ ---------- */
  var WJ = ['日', '月', '火', '水', '木', '金', '土'];
  var WE = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var ME = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function toDate(v) {
    var p = String(v || '').split('/');
    return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]) : null;
  }
  function fmt(ev) {
    var d = toDate(ev.date);
    var y = d.getFullYear(), m = d.getMonth() + 1, dd = d.getDate(), w = d.getDay();
    var time = ev.start ? ev.start + (ev.end ? ' — ' + ev.end : '') : '';
    if (lang === 'en') {
      return {
        year: String(y), day: dd + ' ' + ME[m - 1], dow: '',
        time: WE[w] + (time ? ', ' + time : ''),
        band: WE[w] + ' ' + dd + ' ' + ME[m - 1] + (ev.start ? ', ' + ev.start : ''),
        full: WE[w] + ' ' + dd + ' ' + ME[m - 1] + ' ' + y
      };
    }
    return {
      year: y + '年', day: m + '月' + dd + '日', dow: '（' + WJ[w] + '）', time: time,
      band: m + '月' + dd + '日（' + WJ[w] + '）' + (ev.start ? ev.start + '〜' : ''),
      full: y + '年' + m + '月' + dd + '日（' + WJ[w] + '）'
    };
  }
  function pick(o, k) { return lang === 'en' && o[k + 'En'] ? o[k + 'En'] : (o[k] || ''); }
  function upcoming() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return (NEWS.upcoming || []).filter(function (ev) {
      var d = ev && toDate(ev.date);
      return d && d >= today && (preview || !ev.draft);
    }).sort(function (a, b) { return toDate(a.date) - toDate(b.date); });
  }
  function formOf(ev) { return (ev && ev.form) || NEWS.formUrl || ''; }
  function linkAttrs(url) {
    return 'href="' + esc(url) + '"' + (/^https?:/.test(url) ? ' target="_blank" rel="noopener"' : '');
  }

  function setCtas() {
    var ev = upcoming()[0];
    var form = ev ? formOf(ev) : '';
    each('.js-cta', function (a) {
      if (form) {
        a.setAttribute('href', form);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
      } else {
        a.setAttribute('href', root + 'news/');
        a.removeAttribute('target');
        a.removeAttribute('rel');
      }
    });
  }

  function renderBand() {
    var el = doc.getElementById('next-band');
    if (!el) return;
    var ev = upcoming()[0];
    if (!ev) {
      el.innerHTML = '<h2>' + esc(s('next')) + '</h2><p class="band-p">' + esc(s('tbd')) + '</p>' +
        '<a class="link" href="' + root + 'news/">' + esc(s('seeNews')) + '</a>';
      return;
    }
    var f = fmt(ev);
    var form = formOf(ev);
    el.innerHTML = '<h2>' + esc(s('next')) + '</h2>' +
      (ev.draft ? '<span class="draft">' + esc(s('draft')) + '</span>' : '') +
      '<p class="band-d">' + esc(f.band) + '</p>' +
      '<p class="band-p">' + esc(pick(ev, 'area') || pick(ev, 'place')) + '</p>' +
      '<a class="btn" ' + linkAttrs(form || root + 'news/') + '>' + esc(s('signUp')) + '</a>';
  }

  function renderUpcoming() {
    var el = doc.getElementById('upcoming');
    if (!el) return;
    var list = upcoming();
    if (!list.length) {
      el.innerHTML = '<p class="empty">' + esc(s('noUpcoming')) + '</p>';
      return;
    }
    el.innerHTML = list.map(function (ev) {
      var f = fmt(ev);
      var form = formOf(ev);
      return '<article class="ev">' +
        '<div class="ev-d">' +
          (ev.draft ? '<p class="ev-y"><span class="draft">' + esc(s('draft')) + '</span></p>' : '') +
          '<p class="ev-y">' + esc(f.year) + '</p>' +
          '<p class="ev-day">' + esc(f.day) + (f.dow ? '<small>' + esc(f.dow) + '</small>' : '') + '</p>' +
          (f.time ? '<p class="ev-t">' + esc(f.time) + '</p>' : '') +
        '</div>' +
        '<div class="ev-b">' +
          '<dl class="dl">' +
            '<dt>' + esc(s('place')) + '</dt><dd>' + esc(pick(ev, 'place')) + '</dd>' +
            '<dt>' + esc(s('content')) + '</dt><dd>' + esc(pick(ev, 'content')) + '</dd>' +
            '<dt>' + esc(s('join')) + '</dt><dd>' + esc(s('viaForm')) + '</dd>' +
          '</dl>' +
          (form
            ? '<a class="btn" ' + linkAttrs(form) + '>' + esc(s('signUpThis')) + '</a>'
            : '<p class="ev-note">' + esc(s('formSoon')) + '</p>') +
        '</div>' +
      '</article>';
    }).join('');
  }

  // 会のかたち（日程にかかわらず出す会の説明）
  function renderGuide() {
    var el = doc.getElementById('guide');
    if (!el) return;
    var g = NEWS.guide;
    if (!g || !(g.items || []).length || (g.draft && !preview)) { el.innerHTML = ''; return; }
    el.innerHTML = '<section class="sec2">' +
      '<div class="sec-hd"><h2>' + esc(pick(g, 'title')) + '</h2>' +
        (g.draft ? '<span class="draft">' + esc(s('draft')) + '</span>' : '') + '</div>' +
      '<dl class="dl guide">' + g.items.map(function (it) {
        return '<dt>' + esc(pick(it, 'label')) + '</dt><dd>' + esc(pick(it, 'text')) + '</dd>';
      }).join('') + '</dl>' +
    '</section>';
  }

  function renderRecords() {
    var el = doc.getElementById('records');
    if (!el) return;
    var list = (NEWS.records || []).filter(function (r) { return r && (preview || !r.draft); });
    if (!list.length) {
      el.innerHTML = '<p class="empty">' + esc(s('noRecords')) + '</p>';
      return;
    }
    el.innerHTML = list.map(function (r) {
      var title = pick(r, 'title');
      var text = pick(r, 'text');
      return '<article class="rec">' +
        (toDate(r.date) ? '<p class="rec-d">' + esc(fmt(r).full) + '</p>' : '') +
        (title ? '<h3>' + esc(title) + '</h3>' : '') +
        (text ? '<p class="rec-b">' + esc(text) + '</p>' : '') +
      '</article>';
    }).join('');
  }

  function renderNews() {
    setCtas();
    renderBand();
    renderUpcoming();
    renderGuide();
    renderRecords();
  }

  /* ---------- 作品一覧の絞り込み ---------- */
  function initWorks() {
    var list = doc.getElementById('work-list');
    if (!list) return;
    var rows = Array.prototype.slice.call(list.querySelectorAll('.row'));
    var st = { genre: 'all', writer: 'all', order: 'new' };
    var none = doc.getElementById('no-match');
    var select = doc.getElementById('writer');

    function render() {
      var sorted = rows.slice().sort(function (a, b) {
        return (+b.getAttribute('data-date')) - (+a.getAttribute('data-date'));
      });
      if (st.order === 'old') sorted.reverse();
      var n = 0;
      sorted.forEach(function (row) {
        var show = (st.genre === 'all' || row.getAttribute('data-genre') === st.genre) &&
                   (st.writer === 'all' || row.getAttribute('data-author') === st.writer);
        row.hidden = !show;
        list.appendChild(row);
        if (show) {
          n += 1;
          row.querySelector('.no').textContent = ('0' + n).slice(-2);
        }
      });
      if (none) none.hidden = n > 0;
      each('.fb', function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-genre') === st.genre ? 'true' : 'false'); });
      each('.ob', function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-order') === st.order ? 'true' : 'false'); });
    }

    each('.fb', function (b) {
      b.addEventListener('click', function () { st.genre = b.getAttribute('data-genre'); render(); });
    });
    each('.ob', function (b) {
      b.addEventListener('click', function () { st.order = b.getAttribute('data-order'); render(); });
    });
    if (select) select.addEventListener('change', function () { st.writer = select.value; render(); });
    render();
  }

  /* ---------- 作品ページの縦書き／横書き ---------- */
  function initReader() {
    var bd = doc.getElementById('bd');
    if (!bd || bd.hasAttribute('data-fixed')) return;   // 英語などの作品は横書きのまま
    var group = bd.getAttribute('data-genre') === '小説' ? 'novel' : 'prose';
    var key = 'salon-mode-' + group;
    var fallback = group === 'novel' ? 'v' : 'h';

    function setMode(m, save) {
      bd.classList.toggle('v', m === 'v');
      bd.classList.toggle('h', m !== 'v');
      ['v', 'h'].forEach(function (k) {
        var b = doc.getElementById('m-' + k);
        if (b) b.setAttribute('aria-pressed', k === m ? 'true' : 'false');
      });
      if (save) store.set(key, m);
    }

    var saved = store.get(key);
    setMode(saved === 'v' || saved === 'h' ? saved : fallback, false);
    ['v', 'h'].forEach(function (k) {
      var b = doc.getElementById('m-' + k);
      if (b) b.addEventListener('click', function () { setMode(k, true); });
    });
  }

  applyLang();
  renderNews();
  initWorks();
  initReader();
})();
