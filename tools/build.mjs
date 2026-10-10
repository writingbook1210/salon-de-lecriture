#!/usr/bin/env node
/* Salon de l'écriture — ページを書き出す
   使い方:
     node tools/build.mjs          版番号（VERSION）を1つ上げて、全ページと sitemap.xml を書き出す
     node tools/build.mjs --keep   版番号を上げずに書き出す（確認用）
   読むもの: data/site.js, data/works.js, data/bodies/*.html
   書くもの: index.html, works/, news/, about/, contact/, 404.html, sitemap.xml
   ※ data/news.js は公開サイトがそのまま読み込みます（ここでは版番号を付けるだけ）。 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const wr = (p, s) => {
  const f = path.join(ROOT, p);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, s);
};
function loadVar(file, name) {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`${rd(file)}\n;this.__value = ${name};`, ctx, { filename: file });
  return ctx.__value;
}

const SITE = loadVar('data/site.js', 'SITE');
const WORKS = loadVar('data/works.js', 'WORKS');

let ver = parseInt(rd('VERSION').trim(), 10) || 1;
if (!process.argv.includes('--keep')) {
  ver += 1;
  wr('VERSION', `${ver}\n`);
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const GENRE_EN = { '小説': 'Fiction', '評論': 'Criticism', 'エッセイ': 'Essay' };
const STATUS_EN = { '全文公開': 'Full text', '一部公開': 'Excerpt' };
const GENRES = ['小説', '評論', 'エッセイ'];
const dnum = (d) => {
  const p = String(d || '').split('/');
  return p.length === 3 ? (+p[0]) * 10000 + (+p[1]) * 100 + (+p[2]) : 0;
};
const iso = (d) => {
  const p = String(d).split('/');
  return `${p[0]}-${String(p[1]).padStart(2, '0')}-${String(p[2]).padStart(2, '0')}`;
};
const en = (v, fallback) => esc(v || fallback || '');
const abs = (p = '') => SITE.url + p;

/* ---------- 作品の本文 ---------- */
// 原文のまま組む。bodyFile は HTML をそのまま、body は1行ずつ段落にする（自動の字下げはしない）。
function bodyHtml(w) {
  if (w.bodyFile) {
    return rd(w.bodyFile).trim()
      .replace(/src="images\//g, 'src="../images/')
      .replace(/(src="\.\.\/images\/[^"?]+\.(?:jpe?g|png|webp))\?v=\d+"/g, `$1?v=${ver}"`)
      .replace(/(src="\.\.\/images\/[^"?]+\.(?:jpe?g|png|webp))"/g, `$1?v=${ver}"`);
  }
  return String(w.body || '').split('\n')
    .map((ln) => (ln ? `<p class="ln">${esc(ln)}</p>` : '<p class="ln"><br></p>'))
    .join('\n');
}
function plain(html) {
  return html.replace(/<sup>[\s\S]*?<\/sup>/g, '').replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
}
// 書き出し（トップや一覧に出す冒頭）
function leadOf(w) {
  if (w.bodyFile) {
    const m = rd(w.bodyFile).match(/<p[^>]*>([\s\S]*?)<\/p>/);
    return m ? plain(m[1]) : '';
  }
  return String(w.body || '').split('\n').filter(Boolean).slice(0, 5).join('\n');
}
function descOf(w) {
  const lead = leadOf(w).replace(/\n/g, ' ');
  const cut = lead.length > 80 ? `${lead.slice(0, 80)}…` : lead;
  return `${w.author}の${w.genre}${w.sub ? `。${w.sub}` : ''}。${cut}`;
}
const metaJa = (w) => [w.genre, w.status, w.date].filter(Boolean).join('　／　');
const metaEn = (w) => [GENRE_EN[w.genre] || w.genre, STATUS_EN[w.status] || w.status, w.date].filter(Boolean).join('  /  ');

const works = WORKS.slice().sort((a, b) => dnum(b.date) - dnum(a.date));
works.forEach((w) => {
  if (!/^[A-Za-z0-9_-]+$/.test(w.id)) throw new Error(`id は英数字にしてください: ${w.id}`);
  if (!GENRES.includes(w.genre)) throw new Error(`ジャンルは 小説・評論・エッセイ のどれかにしてください: ${w.id}`);
  if (!dnum(w.date)) throw new Error(`date は 'YYYY/M/D' の形にしてください: ${w.id}`);
});

/* ---------- ページの共通部分 ---------- */
function head({ root, title, desc, url, image, type = 'website', jsonld }) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="${root}images/icon-32.png?v=${ver}">
<link rel="apple-touch-icon" href="${root}images/icon-180.png?v=${ver}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&amp;family=Shippori+Mincho:wght@400;500&amp;display=swap">
<link rel="stylesheet" href="${root}assets/style.css?v=${ver}">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>\n` : ''}</head>`;
}

function header(root, cur) {
  const nav = [['works', '作品', 'Works'], ['news', 'お知らせ', 'News'], ['about', 'このサロンについて', 'About'], ['contact', '連絡先', 'Contact']];
  return `<div class="wrap">
<header class="hd">
<div class="hd-top">
<a class="logo" href="${root}" lang="fr"><b>Salon</b> <i>de l’écriture</i></a>
<a class="lang" id="lang-switch" href="?lang=en" lang="en">English</a>
</div>
<nav class="nav" aria-label="メインメニュー" data-en-label="Main menu">
${nav.map(([k, ja, e]) => `<a href="${root}${k}/"${cur === k ? ' aria-current="page"' : ''} data-en="${e}">${ja}</a>`).join('\n')}
<a class="cta js-cta" href="${root}news/" data-en="Join the next salon">次回の会に申し込む</a>
</nav>
</header>`;
}

function footer(root) {
  return `<footer class="ft">
<span class="ft-c" lang="fr">© Salon de l’écriture</span>
<span class="ft-l">
<a href="https://www.instagram.com/${esc(SITE.instagram)}/" target="_blank" rel="noopener">Instagram</a>
<a href="${root}contact/" data-en="Contact">連絡先</a>
<a href="${esc(SITE.sister.url)}"><span data-en="Sister site">姉妹サイト</span>　${esc(SITE.sister.name)} ↗</a>
</span>
</footer>
</div>
<script src="${root}data/news.js?v=${ver}"></script>
<script src="${root}assets/site.js?v=${ver}"></script>
</body>
</html>
`;
}

function page({ file, root, cur, title, titleEn, desc, url, image, type, jsonld, main }) {
  wr(file, `${head({ root, title, desc, url, image: image || abs('images/ogp/site.png'), type, jsonld })}
<body data-root="${root}" data-title-en="${esc(titleEn || title)}">
${header(root, cur)}
<main>
${main}
</main>
${footer(root)}`);
}

const T = (t) => `${t}｜${SITE.name}`;

/* ---------- トップ ---------- */
function topPage() {
  const root = './';
  const [f, ...rest] = works;
  const href = (w) => `works/${w.id}.html`;
  const feat = f ? `<article class="feat">
<div class="feat-h">
<p class="meta" data-en="${esc(metaEn(f))}">${esc(metaJa(f))}</p>
<h3 class="feat-t"><a href="${href(f)}" data-en="${en(f.titleEn, f.title)}">${esc(f.title)}</a></h3>
${f.sub ? `<p class="feat-s" data-en="${en(f.subEn, f.sub)}">${esc(f.sub)}</p>\n` : ''}<p class="feat-a" data-en="${en(f.authorEn, f.author)}">${esc(f.author)}</p>
</div>
<div class="feat-b">
<p class="lead l5" lang="ja">${esc(leadOf(f))}</p>
<a class="link" href="${href(f)}" data-en="Continue reading →">続きを読む　→</a>
</div>
</article>` : '';
  const cards = rest.slice(0, 2).map((w) => `<article class="card">
<p class="meta" data-en="${esc(metaEn(w))}">${esc(metaJa(w))}</p>
<h3 class="card-t"><a href="${href(w)}" data-en="${en(w.titleEn, w.title)}">${esc(w.title)}</a></h3>
${w.sub ? `<p class="card-s" data-en="${en(w.subEn, w.sub)}">${esc(w.sub)}</p>\n` : ''}<p class="card-a" data-en="${en(w.authorEn, w.author)}">${esc(w.author)}</p>
<p class="lead l2" lang="ja">${esc(leadOf(w))}</p>
<a class="link" href="${href(w)}" data-en="Read →">読む　→</a>
</article>`).join('\n');
  const main = `${SITE.tagline ? `<p class="tagline" data-en="${en(SITE.taglineEn, SITE.tagline)}">${esc(SITE.tagline)}</p>\n` : ''}<section class="latest">
<div class="sec-hd thick">
<h2 data-en="Latest works">新着作品</h2>
<a class="link" href="works/" data-en="All works →">作品一覧へ　→</a>
</div>
${feat}
<div class="cards">
${cards}
</div>
<div class="center"><a class="btn-o" href="works/" data-en="Read all works">すべての作品を読む</a></div>
</section>
<section class="band" id="next-band" aria-live="polite">
<h2 data-en="Next salon">次回の会</h2>
<a class="link" href="news/" data-en="See news →">お知らせを見る　→</a>
</section>`;
  page({
    file: 'index.html', root, cur: '', title: SITE.name, titleEn: SITE.name,
    desc: SITE.description, url: abs(), main,
    jsonld: { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url, inLanguage: 'ja', description: SITE.description }
  });
}

/* ---------- 作品一覧 ---------- */
function worksIndex() {
  const root = '../';
  const authors = [];
  works.forEach((w) => { if (!authors.find((a) => a.ja === w.author)) authors.push({ ja: w.author, en: w.authorEn || w.author }); });
  const rows = works.map((w, i) => `<a class="row" href="${w.id}.html" data-genre="${esc(w.genre)}" data-author="${esc(w.author)}" data-date="${dnum(w.date)}">
<span class="no">${String(i + 1).padStart(2, '0')}</span>
<span class="mn">
<span class="t" data-en="${en(w.titleEn, w.title)}">${esc(w.title)}</span>
${w.sub ? `<span class="sb" data-en="${en(w.subEn, w.sub)}">${esc(w.sub)}</span>\n` : ''}<span class="au" data-en="${en(w.authorEn, w.author)}">${esc(w.author)}</span>
<span class="ex" lang="ja">${esc(leadOf(w).split('\n')[0])}</span>
</span>
<span class="sd"><span data-en="${esc(GENRE_EN[w.genre])}">${esc(w.genre)}</span><br>${w.status ? `<span data-en="${esc(STATUS_EN[w.status] || w.status)}">${esc(w.status)}</span><br>` : ''}${esc(w.date)}</span>
</a>`).join('\n');
  const main = `<h1 class="h1" data-en="Works">作品</h1>
<div class="fl">
<span class="lb" data-en="Genre">ジャンル</span>
<button type="button" class="fb" data-genre="all" aria-pressed="true" data-en="All">すべて</button>
${GENRES.map((g) => `<button type="button" class="fb" data-genre="${g}" aria-pressed="false" data-en="${GENRE_EN[g]}">${g}</button>`).join('\n')}
</div>
<div class="fl">
<label class="lb" for="writer" data-en="Writer">書き手</label>
<span class="sel">
<select id="writer">
<option value="all" data-en="All writers">すべての書き手</option>
${authors.map((a) => `<option value="${esc(a.ja)}" data-en="${esc(a.en)}">${esc(a.ja)}</option>`).join('\n')}
</select>
<svg aria-hidden="true" width="10" height="6" viewBox="0 0 10 6"><path d="M1 1 L5 5 L9 1" fill="none" stroke="#111" stroke-width="1"/></svg>
</span>
<span class="so">
<button type="button" class="ob" data-order="new" aria-pressed="true" data-en="Newest">新しい順</button>
<button type="button" class="ob" data-order="old" aria-pressed="false" data-en="Oldest">古い順</button>
</span>
</div>
<div class="list" id="work-list">
${rows}
</div>
<p class="none" id="no-match" hidden data-en="No works match these filters yet.">該当する作品はまだありません。</p>`;
  page({
    file: 'works/index.html', root, cur: 'works', title: T('作品'), titleEn: T('Works'),
    desc: `${SITE.name}の作品一覧。小説・評論・エッセイを、ジャンル・書き手・新しい順／古い順で絞り込んで読めます。`,
    url: abs('works/'), main
  });
}

/* ---------- 作品ページ ---------- */
function workPage(w) {
  const root = '../';
  const mode = w.genre === '小説' ? 'v' : 'h';
  const url = abs(`works/${w.id}.html`);
  const image = abs(`images/ogp/${w.id}.png`);
  const main = `<article class="rd">
<div class="bar">
<a class="bk" href="./" data-en="← All works">← 作品一覧</a>
<div class="seg" role="group" aria-label="本文の向き" data-en-label="Text direction">
<span class="seg-l" data-en="Text">本文</span>
<button type="button" id="m-v" aria-pressed="${mode === 'v'}" data-en="Vertical">縦書き</button>
<button type="button" id="m-h" aria-pressed="${mode === 'h'}" data-en="Horizontal">横書き</button>
</div>
</div>
<p class="meta" data-en="${esc(metaEn(w))}">${esc(metaJa(w))}</p>
<h1 class="wt" data-en="${en(w.titleEn, w.title)}">${esc(w.title)}</h1>
${w.sub ? `<p class="ws" data-en="${en(w.subEn, w.sub)}">${esc(w.sub)}</p>\n` : ''}<p class="wa" data-en="${en(w.authorEn, w.author)}">${esc(w.author)}</p>
<p class="jp-only en-only" lang="en">This work is available in Japanese only.</p>
<div class="bd ${mode}" id="bd" lang="ja" data-genre="${esc(w.genre)}">
${bodyHtml(w)}
</div>
<div class="end"><a class="bk" href="./" data-en="← All works">← 作品一覧</a></div>
</article>`;
  page({
    file: `works/${w.id}.html`, root, cur: 'works',
    title: T(w.title), titleEn: T(w.titleEn || w.title),
    desc: descOf(w), url, image, type: 'article', main,
    jsonld: {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: w.title, ...(w.sub ? { alternativeHeadline: w.sub } : {}),
      author: { '@type': 'Person', name: w.author },
      datePublished: iso(w.date), inLanguage: 'ja', genre: w.genre,
      image, url, isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url }
    }
  });
}

/* ---------- お知らせ ---------- */
function newsPage() {
  const main = `<h1 class="h1" data-en="News">お知らせ</h1>
<section>
<div class="sec-hd"><h2 data-en="Upcoming salons">これからの会</h2></div>
<div id="upcoming"><noscript><p class="empty">会の案内の表示には JavaScript を使います。</p></noscript></div>
</section>
<section class="sec2">
<div class="sec-hd"><h2 data-en="Past salons">開催後の記録</h2></div>
<div id="records"></div>
</section>`;
  page({
    file: 'news/index.html', root: '../', cur: 'news', title: T('お知らせ'), titleEn: T('News'),
    desc: `${SITE.name}のお知らせ。これからの会の日時・場所・申込方法と、開催後の記録を載せています。`,
    url: abs('news/'), main
  });
}

/* ---------- このサロンについて ---------- */
function aboutPage() {
  const paras = (ja, enText) => {
    const a = String(ja || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    const b = String(enText || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    return a.map((p, i) => `<p class="ab-p" data-en="${en(b[i], p)}">${esc(p)}</p>`).join('\n');
  };
  const main = `<section>
<h1 class="h1" data-en="About the salon">このサロンについて</h1>
${SITE.tagline ? `<p class="ab-t" data-en="${en(SITE.taglineEn, SITE.tagline)}">${esc(SITE.tagline)}</p>\n` : ''}${paras(SITE.intro, SITE.introEn)}
<div class="btns">
<a class="btn js-cta" href="../news/" data-en="Join the next salon">次回の会に申し込む</a>
<a class="btn-o" href="../works/" data-en="Read the works">作品を読む</a>
</div>
<div class="sister">
<span class="lb" data-en="Sister site">姉妹サイト</span>
<a href="${esc(SITE.sister.url)}">${esc(SITE.sister.name)} ↗</a>
</div>
</section>`;
  page({
    file: 'about/index.html', root: '../', cur: 'about', title: T('このサロンについて'), titleEn: T('About'),
    desc: SITE.description, url: abs('about/'), main
  });
}

/* ---------- 連絡先 ---------- */
function contactPage() {
  const main = `<section>
<h1 class="h1" data-en="Contact">連絡先</h1>
<dl class="dl ct">
<dt data-en="Email">メール</dt>
<dd><a href="mailto:${esc(SITE.mail)}">${esc(SITE.mail)}</a></dd>
<dt>Instagram</dt>
<dd><a href="https://www.instagram.com/${esc(SITE.instagram)}/" target="_blank" rel="noopener">@${esc(SITE.instagram)}</a></dd>
<dt data-en="Joining a salon">会への申込</dt>
<dd><a href="../news/" data-en="See upcoming salons and sign up →">お知らせ・申込のページへ　→</a></dd>
</dl>
</section>`;
  page({
    file: 'contact/index.html', root: '../', cur: 'contact', title: T('連絡先'), titleEn: T('Contact'),
    desc: `${SITE.name}への連絡先（メール・Instagram）と、会への申込方法。`, url: abs('contact/'), main
  });
}

/* ---------- 404 ---------- */
function notFound() {
  const root = '/salon-de-lecriture/';
  const main = `<h1 class="h1" data-en="Page not found">ページが見つかりません</h1>
<p class="ab-p" data-en="The page may have moved. Please go back to the top page.">移動したか、なくなった可能性があります。トップページからお探しください。</p>
<div class="btns"><a class="btn-o" href="${root}" data-en="Back to the top">トップへ</a></div>`;
  page({ file: '404.html', root, cur: '', title: T('ページが見つかりません'), titleEn: T('Page not found'), desc: SITE.description, url: abs('404.html'), main });
}

/* ---------- 検索向けのページ一覧 ---------- */
function sitemap() {
  const latest = works.length ? iso(works[0].date) : undefined;
  const urls = [
    { loc: abs(), lastmod: latest },
    { loc: abs('works/'), lastmod: latest },
    ...works.map((w) => ({ loc: abs(`works/${w.id}.html`), lastmod: iso(w.date) })),
    { loc: abs('news/') },
    { loc: abs('about/') },
    { loc: abs('contact/') }
  ];
  wr('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`);
}

topPage();
worksIndex();
works.forEach(workPage);
newsPage();
aboutPage();
contactPage();
notFound();
sitemap();
console.log(`書き出しました（版番号 ${ver}、作品 ${works.length} 本）`);
const missing = works.filter((w) => !fs.existsSync(path.join(ROOT, `images/ogp/${w.id}.png`))).map((w) => w.id);
if (missing.length) console.log(`共有用の画像がまだない作品: ${missing.join(', ')} → python3 tools/make_images.py を実行してください`);
