/* お知らせのデータです。書き換えたら node tools/build.mjs を実行してください（版番号が上がります）。

   formUrl  : 会の申込フォーム（Googleフォーム）の URL。決まったら '' の中に入れます。
              入れると、どのページの「次回の会に申し込む」もこのフォームにつながります。
   upcoming : これからの会。開催日を過ぎると自動で表示されなくなります。
     date 'YYYY/M/D'、start / end '14:00' の形
     area   : 一覧の帯に出す短い場所（例: '東京都内'）　place : 詳しい場所
     content: 内容　　form : この会だけ別のフォームにするときの URL（ふだんは ''）
     …En    : 英語表示のときの文面
     draft: true のあいだは公開サイトに出ません（仮の内容。URLの末尾に ?preview=1 を付けると見えます）
   records  : 開催後の記録。新しいものを上に足します。
     { date: '2026/11/14', title: '…', titleEn: '…', text: '…（改行は \n）', textEn: '…' } */
var NEWS = {
  formUrl: '',

  upcoming: [
    {
      date: '2026/11/14', start: '14:00', end: '16:30',
      area: '東京都内', areaEn: 'Tokyo',
      place: '東京都内（会場は申込後にお知らせします）',
      placeEn: 'Tokyo (the venue will be sent to you after you sign up)',
      content: '持ち寄った作品の朗読と合評',
      contentEn: 'Reading aloud and discussing the works participants bring',
      form: '',
      draft: true
    }
  ],

  records: []
};
