/* サイト全体の設定です（ページを書き出すときに使います）。
   tagline : トップの一文。まだ決まっていなければ '' のまま（空のあいだは表示しません）
   intro   : 「このサロンについて」の紹介文。段落は空行で区切ります（空のあいだは表示しません）
   signature : ページの文章のいちばん最後（sections の最後の節の下）に右寄せで置く署名
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

「サロン」と聞くと誰かを中心とした活動や、誰かを支持するような、堅苦しく一方通行的な活動だと感じてしまう方も多いと思います。しかしサロンという語句のルーツを辿ると、邸宅における「客間」「談話室」といった大きな部屋を指す言葉になります。

そして、それは共通の話題や興味について話す場でもありました。この事から、知的でありながらも格式張らず、お互いの知見や意見を交換する場であったとも言えるはずです。だとすれば、サロンはもっと軽やかで、賑わいのあるものであるべきではないでしょうか。

また昨今では、noteやX、Threadsなど、自身の意見や論考を載せられる媒体が増え、表現の自由さや多様さは拡大の一途をたどっています。この現象自体はかなり喜ばしいことなのですが、「いいね」などの興味関心に促され、優先的に表示されていくものが増えているような気がしてなりません。

我々物書きは書いていれば、それだけで自身の創出として認められるべきだと私は思います。

客体として誰かから評価を受けるのは、大変勇気のいることです。その機会を無下になげうってしまうのは、貴重な経験を捨てることと同義だとも思います。それでも、まずは自身の作品と真正面から向き合い、評価以前に誰かと共有する機会を設けたいと考え、このSalon de l’écritureを立ち上げました。

最後になりますが、誰かに流されず、誰かからの評価をものともせず、それでも自身の作品を信じ切るというのは、とても苦しく、大変なことだと思います。それでも、この心意気を忘れてしまっては、なぜ書いているのか、何のために書くに至ったのか、我々はなぜ書かなければならなかったのか、なぜ書いていたのかが、わからなくなってしまうのではないでしょうか。

その信念を忘れないために、このサロンを使っていただけましたら、大変ありがたく思います。`,
  introEn: `Salon de l'écriture is a group founded not only to hold reading groups and critique sessions, but also to publish a collective anthology in the form of a zine. Alongside our in-person gatherings, we share our members' fiction, criticism and essays on this website. We put into words what we have seen and heard, and even what we have felt and thought, and our activities reach beyond literature into the arts and scholarship.

In Japan, many people hear the word "salon" and picture something stiff and one-directional: a circle built around one person, or a gathering of followers. Yet if we trace the word back to its roots, it refers to a large room in a grand house, such as a drawing room or a parlor.

It was also a place where people talked about shared topics and interests. We can say, then, that it was a space for exchanging knowledge and opinions, intellectual yet unceremonious. If so, shouldn't a salon be something lighter and livelier?

These days, platforms such as note, X and Threads let anyone publish their opinions and essays, and the freedom and variety of expression keep growing. That in itself is very welcome. Still, I can't shake the feeling that what gets shown first is increasingly what is driven by "likes" and other signs of attention.

I believe that for those of us who write, the act of writing should in itself be recognized as creation.

To become the object of someone else's judgment takes great courage. To throw that chance away carelessly would, I think, be the same as discarding a precious experience. Even so, I wanted to create a place where we can first face our own work head-on and share it with others before any judgment is made. That is why I founded Salon de l'écriture.

In closing, I think it is painful and hard to resist being swept along by others, to remain unshaken by anyone's judgment, and still to believe fully in your own work. Yet if we lose that spirit, won't we lose sight of why we are writing, what we set out to write for, why we had to write, and why we were writing at all?

I would be truly grateful if you would use this salon to keep hold of that conviction.`,

  signature: "Salon de l'écriture　主宰　及川渉",
  // 英語の署名は2行（\n で改行）
  signatureEn: "Wataru Oikawa, Organizer\nSalon de l'écriture",

  /* 紹介文の下に、上から順に並べる節。署名はいちばん最後の節の下に置きます。
     段落は空行で区切ります。「1．作品を送る」のように数字と「．」で始まる行は小見出しになり、
     「→」で始まる段落は字下げしません。[文字](URL) と書くとリンクになります（URL はサイトの中なら files/… や contact/ のように書く）。
     英語（titleEn / bodyEn）が空の節は、英語表示では出しません（英訳は確認を取ってから入れる） */
  sections: [
    {
      title: '私たちの領域', titleEn: 'Our Scope',
      body: `私たちは、主に芸術（一定の素材・様式を使って、社会の現実、理想とその矛盾や、人間・人生とは何かなどについて表現した人間の活動と、その作品。文学・絵画・彫刻・音楽・演劇など。『新明解国語辞典』より引用）と、それに関する評論やエッセイを活動領域としています。また、その文面を記述するに際しての意見交換、議論、お互いの作品に対する批評などを用いての交流を活発に行なっていきたいと考えております。しかし、芸術という広範な領域を扱うにあたり、活動内での混乱を避けるため、政治・宗教に関する勧誘や、それらに付随し恣意的と判断される宣伝行為を目的とする文面は、お受けいたしかねますのでご了承ください。`,
      bodyEn: `Our activities focus mainly on art (defined in the Shin Meikai Kokugo Jiten as “human activity that uses particular materials and forms to express such things as the realities and ideals of society and the contradictions between them, or what it means to be human and what life is, together with the works it produces, such as literature, painting, sculpture, music, and theater”) and on criticism and essays about art. We also hope to foster lively exchanges by sharing views and debating as we write, and by critiquing one another’s work. However, because art is such a broad field, and to avoid confusion within our activities, we are unable to accept submissions intended for political or religious solicitation, or related promotional content that we judge to be self-serving. Thank you for your understanding.`
    },
    {
      title: '掲載までの流れ', titleEn: '',
      body: `当サロンに作品を載せるときは、次の流れで進めます。どの段階でも、書き手の了承を得ないまま先へ進むことはありません。

1．作品を送る
掲載を希望する作品を、メールでお送りください。小説・評論・エッセイのいずれも、日本語・英語のどちらでも受け付けています。

2．原稿の取り扱いへの同意
原稿をAI（Claude）で扱う前に、AIをどこに使うのか、お預かりした原稿がどこに、どのくらいの期間残るのかをご説明し、同意をいただきます。AIで扱うことを望まない場合は、ご相談のうえ対応を決めます。

3．掲載の準備
同意をいただいてから、運営が掲載用のページを組みます。本文には手を加えません。誤字や出典の誤りなど、気になる箇所があれば、直さずにまとめてお伝えします。紹介文や見出しはAIが作成しますが、ご自身で用意していただくこともできます。

4．掲載前の確認
パソコンやスマホでの見え方、英語表示、SNSで共有したときの画像などを、確認用の資料にまとめてお送りします。掲載日、題名とその翻訳の扱い、全文公開か一部公開か、気になる箇所を直すかどうかなどを決めていただき、全体を承認していただいてから公開します。

5．公開
承認いただいた内容でサイトに公開し、正しく表示されていることを確かめてからご報告します。

公開後に作品の修正や取り下げをご希望の場合も、[連絡先](contact/)までご相談ください。`,
      bodyEn: ''
    },
    {
      title: 'AIの利用について', titleEn: '',
      body: `当サロンでは、サイトの運営にAI（Claude）を利用しています。AIを使うのは、掲載用のページの作成、紹介文や見出しの作成、題名の翻訳、誤りと思われる箇所の確認です。作品本文をAIで書き換えたり、翻訳したりすることはありません。書き手ご自身が翻訳した作品を載せる場合は、訳者と、AI翻訳を使ったかどうかを作品ページに明記します。

運営で使うアカウントは、会話がAIの学習に使われない設定にしています。また、公開している作品について、AIの学習を目的とした主要なクローラーによる収集を拒否する設定をしています。

保存期間や例外を含む詳しい内容は、次のページにまとめています。

→ [AIの利用とデータの取り扱いについて（2026年10月14日改定）](files/ai-data-policy.pdf)`,
      bodyEn: ''
    }
  ],

  mail: 'writing.book1210@gmail.com',
  instagram: 'salon.de.lecriture',
  sister: { name: 'Organizer’s website', url: 'https://writingbook1210.github.io/' }  // 主宰のページ（writing book）へのリンク
};
