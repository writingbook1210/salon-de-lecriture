/* 作品データです。作品を足すときは { … } を1つコピーして書き換え、
   node tools/build.mjs を実行するとページが書き出されます（版番号も自動で1つ上がります）。

   id       : 作品ページのファイル名になる英数字（例: 'taiji' → works/taiji.html）
   title    : 題名　　sub : 副題（なければ ''）　　author : 筆名
   genre    : '小説' / '評論' / 'エッセイ'（小説は縦書き、評論・エッセイは横書きで開きます）
   date     : 掲載日 'YYYY/M/D'（一覧はこの日付で並びます）
   status   : '全文公開' / '一部公開'
   titleEn / subEn / authorEn : 英語表示のときの題名・副題・名前（本文は日本語のまま）
   本文は次のどちらか：
     body     : 本文をそのまま書く。改行は \n、空行は \n\n。原文のとおりに組みます（自動の字下げはしません）
     bodyFile : 図や注のある作品は、本文を data/bodies/ にHTMLで置き、その場所を書く
   原文は直さずに載せます。 */
var WORKS = [
{
  id: 'taiji',
  title: '対峙', sub: '', author: '及川 渉',
  genre: '小説', date: '2026/9/9', status: '一部公開',
  titleEn: 'Face to Face', subEn: '', authorEn: 'Wataru Oikawa',
  body: 'あなたは、わたしではない\nわたしも、あなたではない\nあなたは、わたしの心は分からない\nわたしも、あなたの気持ちは分からない\nだけどあなたは、あなたの気持ちを知っている\n一時も絶えることなく対峙している\nだけどわたしも、あなたを知ろうとする\nあなたも、そうするのだろう\nその勇気を、わたしは知っている\nあなたは、あなただ。\nわたしは、わたし。'
},
{
  id: 'attention',
  title: 'アテンション', sub: '現代を大庭葉蔵と生きる若者たちと、『人間失格』を読むということ', author: '及川 渉',
  genre: '評論', date: '2026/9/11', status: '全文公開',
  titleEn: 'Attention', subEn: 'Young People Living Today with Yōzō Ōba, and What It Means to Read No Longer Human', authorEn: 'Wataru Oikawa',
  bodyFile: 'data/bodies/attention.html'
},
{
  id: 'kodomo',
  title: '子は、親からの愛しか享受し得ないのか。', sub: '『違国日記』の槙生の思想と保護者という視点から', author: '及川 渉',
  genre: '評論', date: '2026/9/14', status: '全文公開',
  titleEn: 'Can a Child Receive Love Only from Their Parents?', subEn: 'Makio’s Thinking in Journal with Witch, and the Perspective of a Guardian', authorEn: 'Wataru Oikawa',
  bodyFile: 'data/bodies/kodomo.html'
},
{
  id: 'her',
  title: '「愛されている」とは誰によって決められてしまうのか。', sub: 'ヤマシタトモコ『HER』CASE.5における花河まみと本美優', author: '及川 渉',
  genre: '評論', date: '2026/9/29', status: '全文公開',
  titleEn: 'Who Gets to Decide That Someone Is “Loved”?', subEn: 'Mami Hanakawa and Yū Motomi in Tomoko Yamashita’s HER, CASE.5', authorEn: 'Wataru Oikawa',
  bodyFile: 'data/bodies/her.html'
}
];
