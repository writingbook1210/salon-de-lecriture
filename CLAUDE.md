# Salon de l'écriture — 更新の手引き

対面で集まる会と、ウェブ上で作品を読む場を兼ねたサロンのサイトです。
公開先: https://writingbook1210.github.io/salon-de-lecriture/ （GitHub Pages、main ブランチの一番上をそのまま公開）
姉妹サイト: writing book（https://writingbook1210.github.io/ 、リポジトリ writingbook1210/writingbook1210.github.io）

## 約束ごと

- **Claude が作ったものは、確認が済むまで公開しない。** Claude が作成したページ、題名まわりの表示、紹介文・見出し、訳題（英訳した題名・副題・名前）は、運営が内容を確認したうえで、書き手本人の確認を得てから公開する。原稿や PDF を受け取っても、すぐには公開しない。下書きを用意したら「これで公開してよいか」を運営（持ち主）に返し、OK をもらってから main に入れる。
  - 確認待ちのあいだは main に入れない（main はそのまま公開されるため）。手元か、`draft/` で始まるブランチに置く。
  - 返すときは、Claude が作った文面を一覧にして見せる（下の「作品を足す」の 4 を参照）。
- 文章は原文のまま載せる。誤字らしき所は直さず、どこかを持ち主に伝える。
- 英語の文面（メニュー・案内・ボタン、作品の題名・副題・名前の英訳）も、下書きを見せて確認を取ってから公開する。作品本文は日本語のまま。
- writing book 側に手を入れるときは、文面と場所を持ち主に確認してから。
- 公開前の確認として `python3 tools/check.py` を通す（スマホ幅・縦書き・英語表示）。
- 更新のたびに版番号（VERSION）を上げる。`node tools/build.mjs` が自動で上げ、css・js・データ・画像の読み込みに `?v=番号` を付け直す。古い表示が残らないようにするため。

## ファイル

| 場所 | 中身 |
|---|---|
| `data/works.js` | 作品データ（題名・副題・筆名・ジャンル・日付・公開の範囲・英訳・本文） |
| `data/bodies/*.html` | 図や注のある作品の本文（HTML） |
| `data/news.js` | お知らせ（申込フォームの URL、これからの会、開催後の記録）。公開サイトがそのまま読む |
| `data/site.js` | トップの一文、紹介文、サイトの紹介文、連絡先 |
| `assets/style.css` / `assets/site.js` | 見た目と動き（言語切替、縦書き／横書き、一覧の絞り込み、お知らせ表示） |
| `tools/build.mjs` | data から全ページと sitemap.xml を書き出す |
| `tools/make_images.py` | SNS で共有したときの画像（images/ogp/）とアイコンを作る |
| `tools/check.py` | 手元で全ページを開いて確かめる（リンク切れ・はみ出し・1行の字数） |
| `index.html` `works/` `news/` `about/` `contact/` `404.html` `sitemap.xml` | 書き出されたページ（直接は書き換えない） |

## よくある更新

### 作品を足す
1. `data/works.js` に `{ … }` を1つ足す（id は英数字、genre は 小説／評論／エッセイ、date は 'YYYY/M/D'）。
   - 短い本文は `body`（改行 `\n`、空行 `\n\n`）。図や注があれば `data/bodies/<id>.html` に置いて `bodyFile`。図は `images/<id>/` に置き、HTML からは `images/<id>/figNN.jpg` で参照する。
   - 題名・副題・名前の英訳（titleEn / subEn / authorEn）は下書きして確認を取る。
2. `python3 tools/make_images.py <id>` で共有用の画像を作る。
3. `node tools/build.mjs --keep` → `python3 tools/check.py --shots` で下書きを確かめる（まだ公開しない）。
4. 運営に「これで公開してよいか」を返す。書き手本人の確認も運営が取る。返すもの：
   - 作品ページの画面（PC・スマホ、縦書き・横書き、英語表示）
   - Claude が作った文面の一覧：英訳した題名・副題・名前、検索や SNS で出る紹介文（作品ページの description）、トップや一覧に出る書き出しの範囲、共有用の画像
   - 誤字らしき所（直さずに場所だけ）
5. OK が出たら `node tools/build.mjs`（版番号を上げる）→ `python3 tools/check.py` → commit → push。

### 次回の会・記録を載せる
- `data/news.js` の `upcoming` に会を足す。仮の内容は `draft: true`（公開サイトには出ず、`?preview=1` で見える）。
- 開催後は `records` に記録を足す。開催日を過ぎた会は自動で表示されなくなる。
- 申込フォームが決まったら `formUrl` に入れる（全ページの「次回の会に申し込む」がフォームにつながる）。
- Claude が書いた案内文や記録の文面は、運営の確認を取ってから公開する。
- 書き換えたら `node tools/build.mjs`（版番号を上げるため）→ commit → push。

### トップの一文・紹介文
- `data/site.js` の `tagline` / `intro`（と英語の `taglineEn` / `introEn`）に入れて `node tools/build.mjs`。空のあいだは表示しない。

## 見た目の決まりごと
- writing book と同じ系統：Shippori Mincho、白地、細い罫線。写真やイラストは使わず文字の組み方で見せる。欧文のロゴは Cormorant Garamond（「Salon」は立体、「de l'écriture」は斜体）。
- 作品本文：縦書きは1行26字、横書きは1行32字（スマホの横書きは画面幅で折り返す）。本文の塊はヘッダーの横線の中央にそろえる。
- 最初の向き：小説は縦書き、評論・エッセイは横書き。読者が選んだ向きは「小説」と「評論・エッセイ」で別々にブラウザに保存。
- 縦書き・横書きの切り替えは作品本文だけ。ほかのページは横書き。
- どのページからも「作品」と「次回の会に申し込む」へ一手で進めること。
