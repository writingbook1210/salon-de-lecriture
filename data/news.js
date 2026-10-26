/* お知らせのデータです。書き換えたら node tools/build.mjs を実行してください（版番号が上がります）。

   formUrl  : 会の申込フォーム（Googleフォーム）の URL。決まったら '' の中に入れます。
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
  formUrl: 'https://forms.gle/uAgr2wAodHfwX4LC8',

  upcoming: [],


  /* これからの会の予定：日程が決まっていなくても、「これからの会」の欄に出す会の進め方。
     title は小見出し、items は 見出し(label) と 中身(text) の組。…En は英語表示の文面（空なら日本語のまま出す）
     draft: true のあいだは公開サイトに出ない（URL の末尾に ?preview=1 を付けると見える） */
  guide: {
    title: '会のかたち',
    titleEn: 'How Our Salons Work',
    items: [
      { label: '日程', labelEn: 'Date',
        text: '日程はまだ確定していません。決まりしだい、このページでお知らせします。',
        textEn: 'The date has not been decided yet. It will be announced on this page as soon as it is set.' },
      { label: '内容', labelEn: 'Programme',
        text: '前半は読書会、後半は談話と交流の時間です。読書会では、ふだんは参加者がそれぞれ好きな本を持ち寄って紹介し合います。ときどき課題本を決めて、事前にお知らせする回もあります。',
        textEn: 'The first half is a reading group, and the second half is time for conversation and getting to know one another. In the reading group, participants usually each bring a book they love and introduce it to the others. Sometimes we choose a set book and announce it in advance.' },
      { label: '場所', labelEn: 'Venue',
        text: '東京都内（会場は申込後にお知らせします）。オンラインでも参加できます。',
        textEn: 'Tokyo (the venue will be sent to you after you sign up). You can also join online.' },
      { label: '持ち物', labelEn: 'What to bring',
        text: '紹介したい本や作品があればお持ちください。紹介をせず、話を聞くだけの参加もできます。',
        textEn: 'A book or work you would like to introduce, if you have one. You are also welcome to come just to listen.' },
      { label: '定員', labelEn: 'Capacity',
        text: '定めていません。',
        textEn: 'No limit.' },
      { label: '参加費', labelEn: 'Fee',
        text: '紹介したい本や作品を持ってくる方は無料、それ以外の方は500円です。',
        textEn: 'Free if you bring a book or work to introduce; ¥500 otherwise.' },
      { label: '申込', labelEn: 'How to join',
        text: 'Googleフォームから受け付けています。日程が決まったら、あらためてご案内します。',
        textEn: 'Sign-ups are taken through a Google Form. We will contact you again once the date is set.',
        link: 'Googleフォームを開く', linkEn: 'Open the Google Form' }
    ]
  },

  records: []
};
