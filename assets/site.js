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
      place: '場所', content: '内容', join: '申込', viaForm: 'Peatix の申込ページから',
      formSoon: '申込ページは準備中です。', draft: '仮の内容',
      past: '開催後の記録', back: '目次へ戻る　↑'
    },
    en: {
      next: 'Next salon', signUp: 'Sign up', signUpThis: 'Sign up for this salon', seeNews: 'See news →',
      tbd: 'The next date is being planned.',
      noUpcoming: 'The next salon is being planned. It will be announced here.',
      noRecords: 'No records yet. Notes from each salon will be posted here afterwards.',
      place: 'Venue', content: 'Programme', join: 'How to join', viaForm: 'On our Peatix page',
      formSoon: 'The sign-up page is not open yet.', draft: 'Draft',
      past: 'Past salons', back: 'Back to contents ↑'
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
    var form = ev ? formOf(ev) : (NEWS.formUrl || '');
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
      var reg = NEWS.regular && pick(NEWS.regular, 'text');
      el.innerHTML = '<h2>' + esc(s('next')) + '</h2><p class="band-p">' + esc(reg || s('tbd')) + '</p>' +
        (reg && NEWS.formUrl
          ? '<a class="btn" ' + linkAttrs(NEWS.formUrl) + '>' + esc(s('signUp')) + '</a>'
          : '<a class="link" href="' + root + 'news/">' + esc(s('seeNews')) + '</a>');
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
      el.innerHTML = guides().length ? '' : '<p class="empty">' + esc(s('noUpcoming')) + '</p>';
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

  // 会のかたち（日程にかかわらず「これからの会」の欄に出す会の進め方）。1つでも、いくつか並べても書ける
  function guides() {
    var g = NEWS.guide;
    var list = Array.isArray(g) ? g : (g ? [g] : []);
    return list.filter(function (b) {
      return b && ((b.items || []).length || (b.parts || []).length || b.intro || b.lead || b.link) && (preview || !b.draft);
    });
  }
  // 改行（\n）、スマホ幅だけの改行（\v）、「──」を一本の線に、時刻の範囲は途中で折り返さない
  function multi(t) {
    return esc(t).replace(/\v/g, '<br class="sp-br">').replace(/\n/g, '<br>')
      .replace(/─{2,}/g, function (d) { return '<span class="dash">' + d + '</span>'; })
      .replace(/\d{1,2}:\d{2}[～〜–-]\d{1,2}:\d{2}/g, function (x) { return '<span class="nw">' + x + '</span>'; });
  }
  function paras(t, cls) {
    return String(t || '').split(/\n{2,}/).map(function (x) { return '<p class="' + cls + '">' + multi(x) + '</p>'; }).join('');
  }
  function guideDl(items) {
    return '<dl class="dl">' + items.map(function (it) {
      var form = it.link ? (it.url || NEWS.formUrl || '') : '';
      return '<dt>' + esc(pick(it, 'label')) + '</dt><dd>' + multi(pick(it, 'text')) +
        (it.href ? '<br><a class="link" ' + linkAttrs(it.href) + '>' + esc(pick(it, 'hrefText') || it.href) + '　↗</a>' : '') +
        (pick(it, 'after') ? '<br>' + multi(pick(it, 'after')) : '') +
        (form ? '<br><a class="link" ' + linkAttrs(form) + '>' + esc(pick(it, 'link')) + '　→</a>' : '') + '</dd>';
    }).join('') + '</dl>';
  }
  function renderGuide() {
    var el = doc.getElementById('guide');
    if (!el) return;
    el.innerHTML = guides().map(function (g) {
      var form = g.link ? (g.url || NEWS.formUrl || '') : '';
      return '<div class="guide' + (g.join ? ' guide-join' : '') + '"' + (g.id ? ' id="' + esc(g.id) + '"' : '') + '>' +
        (g.draft ? '<span class="draft">' + esc(s('draft')) + '</span>' : '') +
        (pick(g, 'title') ? '<h3 class="guide-h">' + esc(pick(g, 'title')) + '</h3>' : '') +
        (pick(g, 'catch') ? '<p class="guide-catch">' + multi(pick(g, 'catch')) + '</p>' : '') +
        (pick(g, 'intro') ? '<div class="guide-intro">' + paras(pick(g, 'intro'), 'guide-p') + '</div>' : '') +
        (pick(g, 'lead') ? '<p class="guide-lead">' + multi(pick(g, 'lead')) + '</p>' : '') +
        (form ? '<a class="btn" ' + linkAttrs(form) + '>' + esc(pick(g, 'link')) + '</a>' : '') +
        ((g.items || []).length ? guideDl(g.items) : '') +
        (g.parts || []).map(function (pt) {
          return '<div class="guide-part">' +
            (pick(pt, 'title') ? '<h4 class="guide-sh">' + esc(pick(pt, 'title')) + '</h4>' : '') +
            ((pt.items || []).length ? guideDl(pt.items) : '') +
            (pick(pt, 'text') ? '<p class="guide-list">' + multi(pick(pt, 'text')) + '</p>' : '') +
            (pick(pt, 'note') ? '<p class="guide-note">' + multi(pick(pt, 'note')) + '</p>' : '') +
          '</div>';
        }).join('') +
        (g.id && !g.join && pick(g, 'title') ? '<p class="toc-back"><a href="#toc" data-to="toc">' + esc(s('back')) + '</a></p>' : '') +
      '</div>';
    }).join('');
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

  // 「これからの会」の下の目次。id のある会と「開催後の記録」を並べ、押すと矢印が見出しの横まで一緒に移る
  function tocItems() {
    var items = guides().filter(function (g) { return g.id && pick(g, 'title'); })
      .map(function (g) { return { id: g.id, label: pick(g, 'title') }; });
    if (items.length && doc.getElementById('past')) items.push({ id: 'past', label: s('past') });
    return items;
  }
  function renderToc() {
    var el = doc.getElementById('toc');
    if (!el) return;
    var items = tocItems();
    el.hidden = !items.length;
    el.innerHTML = items.length ? '<ul>' + items.map(function (it) {
      return '<li><a href="#' + esc(it.id) + '" data-to="' + esc(it.id) + '">' +
        '<span class="toc-t">' + esc(it.label) + '</span><span class="toc-a" aria-hidden="true">→</span></a></li>';
    }).join('') + '</ul>' : '';
  }
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var moving = 0;
  function headOf(id) {
    var t = doc.getElementById(id);
    if (!t || id === 'toc') return t;
    return t.querySelector('.guide-h, .sec-hd h2') || t;
  }
  function go(id, arrow, instant) {
    var target = doc.getElementById(id);
    if (!target) return;
    var head = headOf(id);
    // 前のしおり（見出しの横の矢印）を外して、行き先の見出しに付け直す
    each('.toc-mark', function (m) { m.parentNode.removeChild(m); });
    var mark = null;
    if (id !== 'toc' && head) {
      mark = doc.createElement('span');
      mark.className = 'toc-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = '→';
      head.insertBefore(mark, head.firstChild);
    }
    if (window.history && history.replaceState) history.replaceState(null, '', '#' + id);
    var startY = window.pageYOffset;
    var maxY = Math.max(0, doc.documentElement.scrollHeight - window.innerHeight);
    var endY = Math.min(maxY, Math.max(0, target.getBoundingClientRect().top + startY - 24));
    var done = function () {
      if (!head) return;
      if (!head.hasAttribute('tabindex')) head.setAttribute('tabindex', '-1');
      try { head.focus({ preventScroll: true }); } catch (e) { /* 古いブラウザでは何もしない */ }
    };
    if (calm || instant) { window.scrollTo(0, endY); done(); return; }
    var fly = null, from = null;
    if (arrow && mark) {
      from = arrow.getBoundingClientRect();
      fly = doc.createElement('span');
      fly.className = 'toc-fly';
      fly.setAttribute('aria-hidden', 'true');
      fly.textContent = '→';
      body.appendChild(fly);
      mark.style.visibility = 'hidden';
    }
    var run = ++moving, t0 = null, D = 500;
    var ease = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
    var step = function (now) {
      if (run !== moving) { if (fly && fly.parentNode) fly.parentNode.removeChild(fly); return; }
      if (t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / D), e = ease(p);
      window.scrollTo(0, startY + (endY - startY) * e);
      if (fly) {
        var to = mark.getBoundingClientRect();
        fly.style.transform = 'translate(' + (from.left + (to.left - from.left) * e) + 'px,' +
          (from.top + (to.top - from.top) * e) + 'px)';
      }
      if (p < 1) { window.requestAnimationFrame(step); return; }
      if (fly && fly.parentNode) fly.parentNode.removeChild(fly);
      if (mark) mark.style.visibility = '';
      done();
    };
    window.requestAnimationFrame(step);
  }
  doc.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[data-to]') : null;
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    go(a.getAttribute('data-to'), a.querySelector('.toc-a'));
  });
  // スマホ：指が触れた瞬間に、PC でカーソルを乗せたときと同じ変化を出す
  doc.addEventListener('touchstart', function (e) {
    var a = e.target.closest ? e.target.closest('.toc a') : null;
    if (!a) return;
    a.classList.add('is-touch');
    window.setTimeout(function () { a.classList.remove('is-touch'); }, 600);
  }, { passive: true });

  function renderNews() {
    setCtas();
    renderBand();
    renderUpcoming();
    renderGuide();
    renderToc();
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
  // アドレスに #writing などが付いて開かれたら、その会の見出しへ（中身を書き出したあとで移る）
  if (doc.getElementById('toc') && location.hash.length > 1) {
    var first = decodeURIComponent(location.hash.slice(1));
    if (doc.getElementById(first)) go(first, null, true);
  }
  initWorks();
  initReader();
})();
