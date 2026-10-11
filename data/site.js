/* サイト全体の設定です（ページを書き出すときに使います）。
   tagline : トップの一文。まだ決まっていなければ '' のまま（空のあいだは表示しません）
   intro   : 「このサロンについて」の紹介文。段落は空行で区切ります（空のあいだは表示しません）
   signature : 紹介文の最後に右寄せで置く署名
   …En     : 英語表示のときの文面。空なら日本語をそのまま出します（英訳は確認を取ってから入れる）
   description : 検索結果やSNSで共有したときに出る、サイトの紹介文 */
var SITE = {
  name: "Salon de l'écriture",
  url: 'https://writingbook1210.github.io/salon-de-lecriture/',

  description: '対面で集まる会と、ウェブ上で作品を読む場を兼ねたサロンです。参加者の小説・評論・エッセイを読むことができ、次回の会にも申し込めます。',
  descriptionEn: 'A salon that meets in person and shares its members’ writing online. Read fiction, criticism and essays by participants, and sign up for the next gathering.',

  tagline: '',
  taglineEn: '',

  intro: `当サロンは、読書会や合評会にとどまらず、ZINEとしての合同誌を刊行するために設立した団体です。対面で集まる会のほか、このウェブサイトでも参加者の小説・評論・エッセイを公開しています。観たもの、聴いたもの、さらには感じたこと、思ったことを活字に落とし込み、文学のみならず芸術や学術にまで足を延ばして活動しています。

「サロン」と聞くと誰かを中心とした活動や、誰かを支持するような、堅苦しく一方通行的な活動だと感じてしまう方も多いと思います。しかし、サロンとは邸宅における「客間」「応接間」「談話室」といった大きな部屋を指す言葉です。サロンはもっと軽やかで、賑わいのあるものであるべきではないでしょうか。

また昨今では、noteやX、Threadsなど、自身の意見や論考を載せられる媒体が増え、表現の自由さや多様さは拡大の一途をたどっています。この現象自体はかなり喜ばしいことなのですが、「いいね」などの興味関心に促され、優先的に表示されていくものが増えているような気がしてなりません。

我々物書きは書いていれば、それだけで自身の創出として認められるべきだと私は思います。

客体として誰かから評価を受けるのは、大変勇気のいることです。その機会を無下になげうってしまうのは、貴重な経験を捨てることと同義だとも思います。それでも、まずは自身の作品と真正面から向き合い、評価以前に誰かと共有する機会を設けたいと考え、このSalon de l’écritureを立ち上げました。

最後になりますが、誰かに流されず、誰かからの評価をものともせず、それでも自身の作品を信じ切るというのは、とても苦しく、大変なことだと思います。それでも、この心意気を忘れてしまっては、なぜ書いているのか、何のために書くに至ったのか、我々はなぜ書かなければならなかったのか、なぜ書いていたのかが、わからなくなってしまうのではないでしょうか。

その信念を忘れないために、このサロンを使っていただけましたら、大変ありがたく思います。`,
  introEn: `Salon de l'écriture is a group founded not only to hold reading groups and critique sessions, but also to publish a collective anthology in the form of a zine. Alongside our in-person gatherings, we share our members' fiction, criticism and essays on this website. We put into words what we have seen and heard, and even what we have felt and thought, and our activities reach beyond literature into the arts and scholarship.

In Japan, many people hear the word "salon" and picture something stiff and one-directional: a circle built around one person, or a gathering of followers. Yet the word originally refers to a large room in a grand house, such as a drawing room, a reception room or a parlor. Shouldn't a salon be something lighter and livelier?

These days, platforms such as note, X and Threads let anyone publish their opinions and essays, and the freedom and variety of expression keep growing. That in itself is very welcome. Still, I can't shake the feeling that what gets shown first is increasingly what is driven by "likes" and other signs of attention.

I believe that for those of us who write, the act of writing should in itself be recognized as creation.

To become the object of someone else's judgment takes great courage. To throw that chance away carelessly would, I think, be the same as discarding a precious experience. Even so, I wanted to create a place where we can first face our own work head-on and share it with others before any judgment is made. That is why I founded Salon de l'écriture.

In closing, I think it is painful and hard to resist being swept along by others, to remain unshaken by anyone's judgment, and still to believe fully in your own work. Yet if we lose that spirit, won't we lose sight of why we are writing, what we set out to write for, why we had to write, and why we were writing at all?

I would be truly grateful if you would use this salon to keep hold of that conviction.`,

  signature: "Salon de l'écriture　主宰　及川渉",
  // 英語の署名は2行（\n で改行）
  signatureEn: "Wataru Oikawa, Organizer\nSalon de l'écriture",

  mail: 'writing.book1210@gmail.com',
  instagram: 'salon.de.lecriture',
  sister: { name: 'writing book', url: 'https://writingbook1210.github.io/' }
};
