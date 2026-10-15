#!/usr/bin/env python3
"""公開前の確認をします（PC幅とスマホ幅、日本語と英語、縦書きと横書き）。

使い方: python3 tools/check.py [--shots]
  ・GitHub Pages と同じ /salon-de-lecriture/ の場所で手元に立ち上げて、全ページを開く
  ・リンク切れ・画像切れ・スクリプトのエラー・スマホ幅での横はみ出しを調べる
  ・作品ページの1行の字数（縦26字・横32字）を数える
  --shots を付けると tools/.cache/shots/ に画面の写真を保存する
書体は tools/.cache/ の Shippori Mincho / Cormorant Garamond を使います（先に make_images.py を一度実行）。
"""
import functools
import http.server
import json
import pathlib
import shutil
import sys
import tempfile
import threading
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent
CACHE = ROOT / 'tools' / '.cache'
FONTS = CACHE / 'fonts' / 'node_modules' / '@fontsource'
BASE = '/salon-de-lecriture/'
PORT = 8765

# 作品ページは works/ にあるものを全部たどる
PAGES = ['', 'works/'] + [f'works/{p.name}' for p in sorted((ROOT / 'works').glob('*.html')) if p.name != 'index.html'] + \
        ['news/', 'about/', 'contact/']
WIDTHS = {'pc': 1280, 'sp': 390}

COUNT_JS = """
(sel) => {
  const bd = document.querySelector(sel);
  if (!bd) return null;
  const vertical = getComputedStyle(bd).writingMode.startsWith('vertical');
  const lines = new Map();
  const half = new Set();
  const walker = document.createTreeWalker(bd, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const p = node.parentElement.closest('p');
    if (!p || p.closest('figure, .fn')) continue;
    for (let i = 0; i < node.length; i++) {
      const ch = node.data[i];
      if (/\\s/.test(ch)) continue;
      const r = document.createRange();
      r.setStart(node, i); r.setEnd(node, i + 1);
      const rect = r.getBoundingClientRect();
      if (!rect.width && !rect.height) continue;
      const key = Math.round(vertical ? rect.left : rect.top);
      lines.set(key, (lines.get(key) || 0) + 1);
      if (ch.charCodeAt(0) < 0x2000 || node.parentElement.closest('sup, .tcy')) half.add(key);
    }
  }
  const full = [...lines.entries()].filter(([k]) => !half.has(k)).map(([, v]) => v);
  return { vertical, max: full.length ? Math.max(...full) : 0, lines: lines.size };
}
"""


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def serve(tmp):
    handler = functools.partial(Quiet, directory=str(tmp))
    httpd = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def main():
    from playwright.sync_api import sync_playwright
    shots = '--shots' in sys.argv
    tmp = pathlib.Path(tempfile.mkdtemp())
    (tmp / 'salon-de-lecriture').symlink_to(ROOT)
    (tmp / '_fonts').symlink_to(FONTS)
    httpd = serve(tmp)
    origin = f'http://127.0.0.1:{PORT}'
    font_css = ''.join(f'@import url({origin}/_fonts/{f});' for f in [
        'shippori-mincho/400.css', 'shippori-mincho/500.css', 'cormorant-garamond/400.css',
        'cormorant-garamond/500.css', 'cormorant-garamond/600.css', 'cormorant-garamond/400-italic.css'])
    problems, report = [], []
    shot_dir = CACHE / 'shots'
    if shots:
        shutil.rmtree(shot_dir, ignore_errors=True)
        shot_dir.mkdir(parents=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        checked = set()
        for lang in ['ja', 'en']:
            for wname, width in WIDTHS.items():
                ctx = browser.new_context(viewport={'width': width, 'height': 900}, device_scale_factor=1)
                ctx.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(status=200, content_type='text/css', body=font_css))
                ctx.route('https://fonts.gstatic.com/**', lambda r: r.abort())
                page = ctx.new_page()
                errors = []
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
                for path in PAGES:
                    url = f'{origin}{BASE}{path}?lang={lang}&preview=1'
                    page.goto(url)
                    page.evaluate('document.fonts.ready')
                    page.wait_for_timeout(250)
                    tag = f'{lang}/{wname}/{path or "top"}'
                    over = page.evaluate('document.documentElement.scrollWidth - window.innerWidth')
                    if over > 0:
                        problems.append(f'{tag}: 横に {over}px はみ出しています')
                    if page.evaluate('document.documentElement.lang') != lang:
                        problems.append(f'{tag}: 言語が切り替わっていません')
                    if path.startswith('works/') and path.endswith('.html') and not page.query_selector('#m-v'):
                        # 英語などの作品：切り替えはなく、保存された向きが「縦」でも横書きのままか確かめる
                        page.evaluate("localStorage.setItem('salon-mode-prose','v');localStorage.setItem('salon-mode-novel','v')")
                        page.reload(); page.evaluate('document.fonts.ready'); page.wait_for_timeout(250)
                        if page.evaluate("getComputedStyle(document.getElementById('bd')).writingMode").startswith('vertical'):
                            problems.append(f'{tag}: 横書きだけの作品が縦書きになっています')
                        page.evaluate("localStorage.removeItem('salon-mode-novel');localStorage.removeItem('salon-mode-prose')")
                        report.append(f'{tag}: 横書きのみ（切り替えなし）')
                        if shots:
                            page.screenshot(path=str(shot_dir / f'{lang}-{wname}-{path.replace("/", "_")}.png'), full_page=True)
                    elif path.startswith('works/') and path.endswith('.html'):
                        for mode in ['v', 'h']:
                            page.click(f'#m-{mode}')
                            page.wait_for_timeout(100)
                            c = page.evaluate(COUNT_JS, '#bd')
                            report.append(f'{tag} {"縦" if mode == "v" else "横"}: 全角だけの行の最大字数 {c["max"]}（全{c["lines"]}行）')
                            if shots:
                                page.screenshot(path=str(shot_dir / f'{lang}-{wname}-{path.replace("/", "_")}-{mode}.png'), full_page=True)
                        # 次の確認のために、保存された向きを消す
                        page.evaluate("localStorage.removeItem('salon-mode-novel');localStorage.removeItem('salon-mode-prose')")
                    elif shots:
                        page.screenshot(path=str(shot_dir / f'{lang}-{wname}-{(path or "top").replace("/", "_")}.png'), full_page=True)
                    # リンクと画像
                    refs = page.evaluate("""() => [...document.querySelectorAll('a[href], img[src], link[href], script[src]')]
                        .map(e => e.href || e.src)""")
                    for ref in refs:
                        u = urllib.parse.urlsplit(ref)
                        if u.scheme not in ('http', 'https') or u.netloc != f'127.0.0.1:{PORT}':
                            continue
                        key = u.path
                        if key in checked:
                            continue
                        checked.add(key)
                        r = page.request.get(f'{origin}{u.path}')
                        if r.status != 200:
                            problems.append(f'{tag}: 見つからない {u.path}（{r.status}）')
                    broken = page.evaluate("[...document.images].filter(i => i.complete && !i.naturalWidth && i.loading !== 'lazy').map(i => i.src)")
                    for b in broken:
                        problems.append(f'{tag}: 画像が表示されません {b}')
                for e in errors:
                    problems.append(f'{lang}/{wname}: スクリプトのエラー {e}')
                ctx.close()
        browser.close()
    httpd.shutdown()
    print('\n'.join(report))
    print('\n問題: なし' if not problems else '\n問題:\n' + '\n'.join(problems))
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
