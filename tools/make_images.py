#!/usr/bin/env python3
"""共有用の画像（SNSで共有したときに出る画像）とアイコンを作ります。

使い方:
  python3 tools/make_images.py          まだ画像のない作品と、サイト共通の画像・アイコンを作る
  python3 tools/make_images.py --all    全部作り直す
  python3 tools/make_images.py her      指定した作品だけ作り直す

必要なもの: Node.js（npm）と Python の playwright（Chromium）。
書体（Shippori Mincho / Cormorant Garamond）は初回に tools/.cache/ へ自動で入れます。
写真やイラストは使わず、文字の組み方だけで作ります。
"""
import html
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CACHE = ROOT / 'tools' / '.cache'
FONTS = CACHE / 'fonts' / 'node_modules' / '@fontsource'
OUT = ROOT / 'images'

GENRE_EN = {'小説': 'Fiction', '評論': 'Criticism', 'エッセイ': 'Essay'}


def ensure_fonts():
    if (FONTS / 'shippori-mincho').exists() and (FONTS / 'cormorant-garamond').exists():
        return
    d = CACHE / 'fonts'
    d.mkdir(parents=True, exist_ok=True)
    subprocess.run(['npm', 'init', '-y'], cwd=d, check=True, capture_output=True)
    subprocess.run(['npm', 'install', '--silent', '@fontsource/shippori-mincho@5',
                    '@fontsource/cormorant-garamond@5'], cwd=d, check=True)


def load_data():
    js = ("const fs=require('fs'),vm=require('vm');const c={};vm.createContext(c);"
          "for(const [f,n] of [['data/site.js','SITE'],['data/works.js','WORKS']])"
          "{vm.runInContext(fs.readFileSync(f,'utf8')+';this.__'+n+'='+n,c)}"
          "process.stdout.write(JSON.stringify({site:c.__SITE,works:c.__WORKS}))")
    out = subprocess.run(['node', '-e', js], cwd=ROOT, check=True, capture_output=True, text=True).stdout
    return json.loads(out)


def font_links():
    files = ['shippori-mincho/400.css', 'shippori-mincho/500.css',
             'cormorant-garamond/400.css', 'cormorant-garamond/500.css', 'cormorant-garamond/400-italic.css']
    return ''.join(f'<link rel="stylesheet" href="{(FONTS / f).as_uri()}">' for f in files)


BASE_CSS = """
*{box-sizing:border-box}
html,body{margin:0;background:#fff;color:#111}
body{width:1200px;height:630px;position:relative;overflow:hidden;
  font-family:'Shippori Mincho','Noto Serif CJK JP',serif}
.frame{position:absolute;inset:56px 72px;border-top:1.5px solid #111;border-bottom:1px solid rgba(0,0,0,.35)}
.logo{font-family:'Cormorant Garamond',serif;white-space:nowrap}
.logo b{font-weight:500}.logo i{font-style:italic;font-weight:400}
"""


def page(inner, css=''):
    return (f'<!doctype html><html lang="ja"><head><meta charset="utf-8">{font_links()}'
            f'<style>{BASE_CSS}{css}</style></head><body>{inner}</body></html>')


def site_html(site):
    css = """
.frame{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px}
.frame .logo{font-size:112px;line-height:1}
.kana{font-size:18px;letter-spacing:.62em;padding-left:.62em;color:#555}
"""
    inner = ('<div class="frame"><span class="logo" lang="fr"><b>Salon</b> <i>de l’écriture</i></span>'
             '<span class="kana">サロン・ド・レクリチュール</span></div>')
    return page(inner, css)


def work_html(w):
    e = html.escape
    meta = '　／　'.join(x for x in [w.get('genre'), w.get('status')] if x)
    if w.get('genre') == '小説':
        css = """
.top{position:absolute;left:0;top:30px;display:flex;flex-direction:column;gap:14px}
.top .logo{font-size:30px}
.meta{font-size:17px;letter-spacing:.18em;color:#555}
.date{position:absolute;left:0;bottom:30px;font-size:17px;letter-spacing:.14em;color:#555}
.vw{position:absolute;right:120px;top:40px;bottom:40px;writing-mode:vertical-rl;
  display:flex;flex-direction:column;gap:44px}
.vt{margin:0;font-size:92px;font-weight:500;letter-spacing:.32em;line-height:1.2}
.va{margin:0;align-self:flex-end;font-size:24px;letter-spacing:.3em}
"""
        inner = (f'<div class="frame"><div class="top"><span class="logo" lang="fr"><b>Salon</b> <i>de l’écriture</i></span>'
                 f'<span class="meta">{e(meta)}</span></div>'
                 f'<div class="vw"><h1 class="vt">{e(w["title"])}</h1><p class="va">{e(w["author"])}</p></div>'
                 f'<span class="date">{e(w["date"])}</span></div>')
        return page(inner, css)
    n = len(w['title'])
    size = 64 if n <= 14 else 54 if n <= 22 else 48
    css = f"""
.frame{{display:flex;flex-direction:column;justify-content:space-between;padding:30px 0 26px}}
.top{{display:flex;justify-content:space-between;align-items:baseline}}
.top .logo{{font-size:30px}}
.meta{{font-size:17px;letter-spacing:.18em;color:#555}}
.mid{{display:flex;flex-direction:column;gap:18px;max-width:980px}}
h1{{margin:0;font-size:{size}px;font-weight:500;line-height:1.45;letter-spacing:.05em}}
.sub{{margin:0;font-size:24px;line-height:1.7;letter-spacing:.06em;color:#555}}
.bot{{display:flex;justify-content:space-between;align-items:baseline;font-size:22px;letter-spacing:.2em}}
.bot .date{{font-size:17px;letter-spacing:.14em;color:#555}}
"""
    inner = (f'<div class="frame"><div class="top"><span class="logo" lang="fr"><b>Salon</b> <i>de l’écriture</i></span>'
             f'<span class="meta">{e(meta)}</span></div>'
             f'<div class="mid"><h1>{e(w["title"])}</h1>'
             + (f'<p class="sub">{e(w["sub"])}</p>' if w.get('sub') else '') +
             f'</div><div class="bot"><span>{e(w["author"])}</span><span class="date">{e(w["date"])}</span></div></div>')
    return page(inner, css)


def icon_html(size, border):
    fs = int(size * (0.86 if border else 0.84))
    b = 'border:1px solid #111;' if border else ''
    return (f'<!doctype html><html><head><meta charset="utf-8">{font_links()}<style>'
            f'html,body{{margin:0;background:#fff}}'
            f'.ic{{width:{size}px;height:{size}px;box-sizing:border-box;{b}display:flex;align-items:center;'
            f'justify-content:center;font-family:"Cormorant Garamond",serif;font-style:italic;font-weight:400;'
            f'font-size:{fs}px;line-height:1;padding-bottom:{int(size*0.12)}px;color:#111}}'
            f'</style></head><body><div class="ic" lang="fr">é</div></body></html>')


def render(pw_page, markup, out, size=None, selector=None):
    tmp = CACHE / 'render.html'
    tmp.write_text(markup, encoding='utf-8')
    pw_page.goto(tmp.as_uri())
    pw_page.evaluate('document.fonts.ready')
    pw_page.wait_for_timeout(300)
    out.parent.mkdir(parents=True, exist_ok=True)
    if selector:
        pw_page.locator(selector).screenshot(path=str(out))
    else:
        pw_page.screenshot(path=str(out), clip={'x': 0, 'y': 0, 'width': size[0], 'height': size[1]})
    print('作りました:', out.relative_to(ROOT))


def main():
    from playwright.sync_api import sync_playwright
    args = sys.argv[1:]
    redo_all = '--all' in args
    only = [a for a in args if not a.startswith('--')]
    ensure_fonts()
    data = load_data()
    CACHE.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        pg = browser.new_page(viewport={'width': 1200, 'height': 630})
        site_png = OUT / 'ogp' / 'site.png'
        if redo_all or not site_png.exists():
            render(pg, site_html(data['site']), site_png, size=(1200, 630))
        for w in data['works']:
            target = OUT / 'ogp' / f"{w['id']}.png"
            if (only and w['id'] not in only) or (not only and not redo_all and target.exists()):
                continue
            render(pg, work_html(w), target, size=(1200, 630))
        for size, border, name in [(32, True, 'icon-32.png'), (180, False, 'icon-180.png')]:
            if redo_all or not (OUT / name).exists():
                render(pg, icon_html(size, border), OUT / name, selector='.ic')
        browser.close()


if __name__ == '__main__':
    main()
