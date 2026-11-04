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
  regular: { text: '毎週日曜日 16:00〜18:00、神保町で執筆会を開いています。', textEn: 'Writing sessions every Sunday, 16:00–18:00, in Jimbocho.' },

  /* 会のかたち：日程にかかわらず「これからの会」の欄に出す会の進め方。上から順に並べる。
     title は小見出し、lead は小見出しの下の一文、items は 見出し(label) と 中身(text) の組（text の \n は改行）。
     link を書くと、その項目の下に申込ページ（formUrl）へのリンクを出す。…En は英語表示の文面（空なら日本語のまま出す）
     draft: true のあいだは公開サイトに出ない（URL の末尾に ?preview=1 を付けると見える） */
  guide: [
    {
      title: '執筆会', titleEn: 'Writing Sessions',
      lead: '日曜の黙って書く会。ぜひ、書きかけの原稿を持ってきてください。',
      leadEn: 'Sunday sessions for writing in silence. Do bring a manuscript you are working on.',
      items: [
        { label: '内容', labelEn: 'Programme',
          text: '集まってそれぞれが自分の原稿を黙って書く会です。原稿を見せ合ったり、批評したりする時間はありません。同じ机で同じ時間、自分の文章と向き合います。\n小説・評論・エッセイ、日本語・英語、どんな原稿でも構いません。これから書き始める方も歓迎です。参加者が少ない日も、人数にかかわらず開いています。',
          textEn: 'Everyone gathers and writes their own manuscript in silence. There is no time for showing work to one another or critiquing it. At the same table, for the same stretch of time, each of us faces our own writing.\nAny manuscript is welcome: fiction, criticism, or essays, in Japanese or English. If you are only about to start writing, you are welcome too. We hold the session however few people come.' },
        { label: '当日の流れ', labelEn: 'On the day',
          text: '「黙って書く」。本当にこれだけです。黙って自分の文章に向き合う時間にしてください。\nその後、雑談（任意です。そのまま帰っても大丈夫です）。\n休憩時間は話しかけ歓迎です。テーブルに置いた「Salon de l’écriture」の札が目印です。',
          textEn: '“Write in silence.” That really is all. Make it a time to face your own writing without speaking.\nAfterwards, there is time to chat (optional; you are welcome to leave straight away).\nFeel free to talk to us during breaks. Look for the “Salon de l’écriture” card on our table.' },
        { label: 'こんな方に', labelEn: 'Who it is for',
          text: '・ひとりだと、なかなか書き始められない方\n・書きかけの原稿を、少しでも先へ進めたい方\n・書く人がいる場所に、身を置いてみたい方',
          textEn: '・People who find it hard to start writing on their own\n・People who want to move a work in progress forward, even a little\n・People who would like to spend time where others are writing' },
        { label: '日時', labelEn: 'When',
          text: '毎週日曜日（16:00〜18:00）。第3日曜はお休みして、読書会を開いています。',
          textEn: 'Every Sunday, 16:00–18:00. On the third Sunday of the month, we hold a reading group instead.' },
        { label: '場所', labelEn: 'Venue',
          text: '神保町。オンラインでも参加できます。',
          textEn: 'Jimbocho, Tokyo. You can also join online.' },
        { label: '参加費', labelEn: 'Fee',
          text: '無料（飲食代は各自）',
          textEn: 'Free (food and drinks at your own expense).' },
        { label: '持ち物', labelEn: 'What to bring',
          text: '書くもの（原稿・ノート・PCなど）',
          textEn: 'Something to write with (a manuscript, notebook, laptop, etc.).' }
      ]
    },
    {
      title: '読書会', titleEn: 'Reading Group',
      lead: '月に一度、第3日曜は執筆会をお休みして、読書会を開いています。',
      leadEn: 'Once a month, on the third Sunday, we hold a reading group in place of the writing session.',
      items: [
        { label: '内容', labelEn: 'Programme',
          text: '出版された本と、サロンの参加者の作品を交互に読む少人数の会です。答え合わせはしません。好きな一行を持ってきてください。',
          textEn: 'A small group that alternates between published books and works by members of the salon. There are no right answers to compare. Bring a line you love.' },
        { label: '日時', labelEn: 'When',
          text: '毎月第3日曜日',
          textEn: 'The third Sunday of every month' },
        { label: '場所', labelEn: 'Venue',
          text: '神保町。オンラインでも参加できます。',
          textEn: 'Jimbocho, Tokyo. You can also join online.' },
        { label: '参加費', labelEn: 'Fee',
          text: '紹介したい本や作品を持ってくる方は無料、それ以外の方は500円です。',
          textEn: 'Free if you bring a book or work to introduce; ¥500 otherwise.' }
      ]
    },
    {
      items: [
        { label: '申込', labelEn: 'How to join',
          text: 'Peatix の申込ページから受け付けています。',
          textEn: 'Sign-ups are taken on our Peatix page.',
          link: 'Peatix の申込ページを開く', linkEn: 'Open our Peatix page' }
      ]
    }
  ],

  records: []
};
