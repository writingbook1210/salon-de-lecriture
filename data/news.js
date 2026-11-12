/* お知らせのデータです。書き換えたら node tools/build.mjs を実行してください（版番号が上がります）。

   formUrl  : 会の申込ページ（Peatix）の URL。決まったら '' の中に入れます。
              入れると、どのページの「次回の会に申し込む」もこのフォームにつながります。
   upcoming : これからの会。開催日を過ぎると自動で表示されなくなります。
     date 'YYYY/M/D'、start / end '14:00' の形
     area   : 一覧の帯に出す短い場所（例: '東京都内'）　place : 詳しい場所
     content: 内容　　form : この会だけ別のフォームにするときの URL（ふだんは ''）
     …En    : 英語表示のときの文面
     draft: true のあいだは公開サイトに出ません（仮の内容。URLの末尾に ?preview=1 を付けると見えます）
   guide    : これからの会の予定（日程にかかわらず出す会の進め方）。下の guide のところを参照
   records  : 開催後の記録。新しいものを上に足します。
     { date: '2026/11/14', title: '…', titleEn: '…', text: '…（改行は \n）', textEn: '…' } */
var NEWS = {
  formUrl: 'https://salon-de-lecriture.peatix.com',

  upcoming: [],


  /* いつも開いている会：トップの「次回の会」の帯に出す一文（次回の会が upcoming にないとき）。空なら「準備中」と出す */
  regular: { text: '毎週日曜日 16:00〜18:00、神保町ブックセンターで執筆会（第3日曜日は読書会）を開いています。', textEn: 'Writing sessions every Sunday, 16:00–18:00, at Jimbocho Book Center (a reading group on the third Sunday).' },

  /* 会のかたち：日程にかかわらず「これからの会」の欄に出す会の進め方。上から順に並べる。
     title は会の名前、catch はその下の一行、intro は紹介文（\n は改行、空行 \n\n で段落を分ける）、lead は小見出しの下の一文。
     parts は小見出しごとのまとまり：{ title, items: [見出し(label) と 中身(text) の組] } か { title, text: 箇条（\n で改行）, note: 添える文 }。
     items の項目に href / hrefText を書くと、本文の下にそのサイトへのリンクを出し、after はリンクの下に出す一文。
     items（parts を使わないとき）は 見出し(label) と 中身(text) の組（text の \n は改行）。
     link を書くと、その項目の下に申込ページ（formUrl）へのリンクを出す。ブロックに link を書くと申込ボタンになる（join: true で区切り線つきの独立した欄にする）。…En は英語表示の文面（空なら日本語のまま出す）
     id を書いたブロックは「これからの会」の下の目次に出る（題名が目次の項目名になる。いちばん下に「開催後の記録」が自動で加わる）。
     draft: true のあいだは公開サイトに出ない（URL の末尾に ?preview=1 を付けると見える） */
  guide: [
    {
      id: 'writing', title: '執筆会', titleEn: 'Writing Sessions',
      catch: 'Salon de l’écriture 執筆会 ── ただ書く。猛烈に紡ごう！',
      catchEn: 'Salon de l’écriture Writing Sessions — Just write, with everything you’ve got!',
      intro: '日曜の「黙って書く」会です。\nぜひ、書きかけの原稿を持ってきてください。\n\n集まってそれぞれが自分の原稿を黙って書く会であり、原稿を見せ合ったり、批評したりする時間はありません。同じ机で同じ時間、ただ純粋に自分の文章と向き合います。\n小説・評論・エッセイ、日本語・英語、どんな原稿でも構いません。これから書き始めるという方も大歓迎です。\n\n参加者が少ない日も、人数にかかわらず毎週必ず開いています。',
      introEn: 'Our Sunday sessions for writing in silence.\nDo bring a manuscript you are working on.\n\nEveryone gathers and writes their own manuscript in silence; there is no time for showing work to one another or critiquing it. At the same table, for the same stretch of time, we simply face our own writing.\nAny manuscript is welcome: fiction, criticism, or essays, in Japanese or English. If you are only about to start writing, you are very welcome too.\n\nWe hold the session every week without fail, however few people come.',
      parts: [
        { title: '開催概要', titleEn: 'At a glance',
          items: [
            { label: '日時', labelEn: 'When',
              text: '毎週日曜日（※第3日曜日を除く）16:00～18:00',
              textEn: 'Every Sunday (except the third Sunday of the month), 16:00–18:00' },
            { label: '場所', labelEn: 'Venue',
              text: '神保町ブックセンター（1F喫茶または2F会議室）\n↑本に囲まれた、非常に落ち着いた素敵な空間です。\n会場の雰囲気やアクセスは、以下の公式サイトをご覧ください。',
              textEn: 'Jimbocho Book Center (the café on the first floor or the meeting room on the second floor)\n↑ A calm, lovely space surrounded by books.\nFor the atmosphere and directions, please see the official website below.',
              href: 'https://jimbocho-book.jp/', hrefText: '神保町ブックセンター公式サイト', hrefTextEn: 'Jimbocho Book Center official website',
              after: 'オンラインでも開催しています。', afterEn: 'We also hold the session online.' },
            { label: '対象', labelEn: 'Who can join',
              text: '小説、評論、エッセイなど、どんな原稿でもOK（言語不問・未経験歓迎）',
              textEn: 'Any manuscript is fine: fiction, criticism, essays, and more (any language; no experience needed)' }
          ] },
        { title: '当日の流れ', titleEn: 'On the day',
          items: [
            { label: '16:00', text: '自己紹介と「今日なにを書くのか」の宣言',
              textEn: 'Introductions, and a declaration of what you will write today' },
            { label: '16:10', text: '黙って書く\n本当にこれだけです。黙って自分の文章に向き合う時間にしてください。（※休憩時間の話しかけは歓迎です）',
              textEn: 'Write in silence\nThat really is all. Make it a time to face your own writing without speaking. (You are welcome to talk to us during breaks.)' },
            { label: '17:45', text: '成果の報告', textEn: 'Report on what you got done' },
            { label: '18:00', text: '終了・雑談（任意）\n雑談は任意ですので、そのままお帰りいただいても大丈夫です。',
              textEn: 'Close and chat (optional)\nThe chat is optional, so feel free to head home straight away.' }
          ] },
        { title: 'こんな方におすすめです', titleEn: 'Who it is for',
          text: 'ひとりだとなかなか書き始められない方\n書きかけの原稿を少しでも先へ進めたい方\n「書く人」がいる場所に身を置いてみたい方',
          textEn: 'People who find it hard to start writing on their own\nPeople who want to move a work in progress forward, even a little\nPeople who would like to spend time where “writers” are',
          note: 'ひとりでも絶対います。\n何が何でもいます。\n雨だろうが吹雪だろうが、嵐だろうがなんだっています。\nいつだって私は書いているし、誰かだって書いているのだから。',
          noteEn: 'Even if it is just me, I will be there.\nI will be there no matter what.\nRain, snowstorm, or gale, I will be there.\nI am always writing, and someone else is writing too.' }
      ]
    },
    {
      id: 'reading', title: '読書会', titleEn: 'Reading Group',
      catch: 'Salon de l’écriture 読書会 ── 未知の物語と出会い、語り尽くす',
      catchEn: 'Salon de l’écriture Reading Group — Meet stories you have never known, and talk them through',
      intro: 'とにかく本を読みまくり、紹介しまくる会です。\nジャンルやテーマの指定はありません。ご自身が好きな本、誰かに勧めたい本を持ち寄り、心ゆくまで語り合いませんか？\n\n読み手の方も、書き手の方も、あるいはそのどちらでもない方も。\nふだんはあまり本を読まないという方も大歓迎です。\n「いいね」の評価から離れ、純粋に言葉や物語と向き合う時間を一緒に楽しみましょう。\n当読書会が初めての方も、2回目以降の方も、ぜひお気軽にお越しください。\n\n（※ネットワークビジネスや宗教等の勧誘行為はNGとさせてください）',
      introEn: 'A gathering where we read books to our hearts’ content and introduce them to one another.\nThere is no set genre or theme. Why not bring a book you love, or one you want to recommend to someone, and talk about it as much as you like?\n\nReaders, writers, and those who are neither.\nIf you don’t usually read much, you are very welcome too.\nLet’s step away from the judgement of “likes” and enjoy time spent simply with words and stories.\nWhether it is your first time at our reading group or you have been before, please feel free to come along.\n\n(Please note that solicitation for network marketing, religion, or the like is not allowed.)',
      parts: [
        { title: '開催概要', titleEn: 'At a glance',
          items: [
            { label: 'テーマ', labelEn: 'Theme',
              text: '自由紹介型（小説、評論、エッセイなどジャンル不問）',
              textEn: 'Introduce anything you like (fiction, criticism, essays: any genre)' },
            { label: '日時', labelEn: 'When',
              text: '毎月 第3日曜日 16:00～18:00',
              textEn: 'The third Sunday of every month, 16:00–18:00' },
            { label: '会場', labelEn: 'Venue',
              text: '神保町ブックセンター（1F喫茶または2F会議室）\n↑本に囲まれた、非常に落ち着いた素敵な空間です。\n会場の雰囲気やアクセスは、以下の公式サイトをご覧ください。',
              textEn: 'Jimbocho Book Center (the café on the first floor or the meeting room on the second floor)\n↑ A calm, lovely space surrounded by books.\nFor the atmosphere and directions, please see the official website below.',
              href: 'https://jimbocho-book.jp/', hrefText: '神保町ブックセンター公式サイト', hrefTextEn: 'Jimbocho Book Center official website',
              after: 'オンラインでも開催しています。', afterEn: 'We also hold the reading group online.' }
          ] },
        { title: '当日の流れ（状況により変更あり）', titleEn: 'On the day (subject to change)',
          items: [
            { label: '16:00', text: '読書会開始・簡単な自己紹介', textEn: 'Start, with brief introductions' },
            { label: '16:10', text: '本の紹介タイム（各自のおすすめ本を紹介し合い、自由に語り合います）',
              textEn: 'Book introductions (everyone introduces a book they recommend, and we talk freely)' },
            { label: '18:00', text: '読書会終了・完全撤収\n※終了後の雑談は任意です。そのままお帰りいただいても構いません。',
              textEn: 'End, and we fully clear the room\nChatting afterwards is optional; feel free to head home straight away.' }
          ] },
        { title: 'こんな方におすすめです', titleEn: 'Who it is for',
          text: '自分の好きな本について、誰かと熱く語り合いたい方\n普段自分では選ばないような、新しい本や価値観に出会いたい方\n「書く人」や「読む人」がいる場所に身を置いてみたい方',
          textEn: 'People who want to talk passionately with others about books they love\nPeople who want to discover new books and values they would not usually choose\nPeople who would like to spend time where “writers” and “readers” are',
          note: 'ひとりでも絶対におります。\n何が何でもいます。\n雨だろうが吹雪だろうが、嵐だろうがなんだっています。\nいつだって私は書いているし、誰かだって書いているのだから。',
          noteEn: 'Even if it is just me, I will be there.\nI will be there no matter what.\nRain, snowstorm, or gale, I will be there.\nI am always writing, and someone else is writing too.' }
      ]
    },
    {
      id: 'join', title: '申込', titleEn: 'How to join', join: true,
      lead: 'Peatix の申込ページから受け付けています。',
      leadEn: 'Sign-ups are taken on our Peatix page.',
      link: 'Peatix の申込ページを開く', linkEn: 'Open our Peatix page'
    }
  ],

  records: []
};
