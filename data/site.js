/* サイト全体の設定です（ページを書き出すときに使います）。
   tagline : トップの一文。まだ決まっていなければ '' のまま（空のあいだは表示しません）
   intro   : 「このサロンについて」の見出しのすぐ下に置く短い紹介文。段落は空行で区切ります（空のあいだは表示しません）。[文字](#flow) で同じページの節へリンク
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

  intro: `当サロンは、読書会や合評会にとどまらず、ZINEとしての合同誌を刊行するために設立した団体です。対面で集まる会のほか、このウェブサイトでも参加者の小説・評論・エッセイを公開しています。作品は日本語・英語のどちらでも受け付けています。

掲載をご希望の方は[掲載までの流れ](#flow)をご覧ください。`,
  introEn: `Salon de l’écriture is a group founded not only to hold reading groups and critique sessions, but also to publish a joint anthology in the form of a zine. Alongside our in-person meetings, we publish members’ fiction, criticism, and essays on this website. We accept work in either Japanese or English.

If you would like your work published here, please see [From Submission to Publication](#flow).`,

  signature: "Salon de l'écriture　主宰　及川渉",
  // 英語の署名は2行（\n で改行）
  signatureEn: "Wataru Oikawa, Organizer\nSalon de l'écriture",

  /* 紹介文の下に、上から順に並べる節。署名はいちばん最後の節の下に置きます。
     段落は空行で区切ります。「1．作品を送る」のように数字と「．」で始まる行は小見出しになり、
     「→」で始まる段落は字下げしません。[文字](URL) と書くとリンクになります（URL はサイトの中なら files/… や contact/ のように書く）。
     英語（titleEn / bodyEn）が空の節は、英語表示では出しません（英訳は確認を取ってから入れる）。
     id を書くと、その節へ #id でリンクできます（例: 'flow' → [掲載までの流れ](#flow)） */
  sections: [
    {
      id: 'salon',
      title: "Salon de l'écriture", titleEn: 'Salon de l’écriture',
      body: `何かを欲し、心を奪われ、そしてそれを体現しようともがく。私たちはそうやって、「私」というものを決めている。

私の場合、それは書くことだ。言葉を見つけ、捕まえようと 手を伸ばす。けれど、いざ掴もうとすると、それは指の隙間から綺麗にこぼれ落ちて、ひとつのかけらも残らない。それが悲しいから、私はひたすらにもがく。書いて、紡いで、結んで、緩めて、解いて、消す。その終わりのないような、途方に暮れることも飽きてしまう作業の集積が、言葉となり、文章となり、本となり、やがて私になる。

いまは、さまざまな考え方が認められ、自分の生き方を主張することをよしとする良い時代になった。その流れのなかで、noteやX、Threadsなど、自身の意見や論考を載せられる媒体は増え、表現の自由さや多様さは拡大の一途をたどっている。それ自体はとても喜ばしい。だが、「いいね」などの反応に促されて優先的に表示されていくものを、私たちは心の底から、一片の曇りもなく「私の興味関心だ」と言えるだろうか。それは所詮、システムが予測した私の趣味嗜好を訳も分からず与えられ、意味を問うこともなく味わっているだけではないのか。その弊害から誰もが目を背けるうちに、自分一人で「自由」に生きていくことは、かえって難しくなってしまった。

欲求とは本来、容易に満たされるほど単純なものではない。それはどこか楽しく、同時に苦しくもあるものではなかっただろうか。境遇や生い立ちに関係なく、自分の写しのような作品を誰かと共有し、意見し、議論し、切磋琢磨していく。そういうものでもあったはずだ。それを私たちは、いつの間にか遠い昔のことのように感じている。

現在の私たちは、誰かの栄光を羨望とともにたやすく眺められる、安直で、それでいて複雑怪奇な世界に放逐されて久しい。そして、瞬時に与えられる答えや正解に、あまりにも惑わされている。

だからこそ、書き手やその作品は書いているというだけで、自らの創出として認められるべきだと私は思う。もちろん、客体として誰かから評価を受けるのは大変勇気のいることだ。その機会を無下になげうつのは、貴重な経験を捨てることに等しい。それでも、いま必要なのは分かりやすい評価軸ではない。作品の持つ個性や文体といった、数多ある固有のものを眺めるための時間だ。評価以前に、まず自分の作品と真正面から向き合い、それを誰かと分かち合う。そのためには、一度立ち止まって言葉を交わす場が必要だ。

その場を、私は「サロン」と呼びたい。ただ、サロンと聞くと、誰かを中心とした、あるいは誰かを支持するための、堅苦しく一方通行な集まりを思い浮かべる人も多いだろう。しかし語源をたどれば、サロンとは邸宅の「客間」や「談話室」といった大きな部屋を指す言葉であり、共通の話題や興味について語り合う場でもあった。知的でありながら格式張らず、互いの知見や意見を持ち寄る場所だったはずだ。だとすれば、サロンはもっと軽やかで、賑わいに満ちたものであるべきではないだろうか。

こうした思いから、私はこのSalon de l'écritureを立ち上げた。観たもの、聴いたもの、さらには感じたこと、思ったことを活字に落とし込み、文学のみならず、芸術や学術にまで足を延ばしていく。

誰かに流されず、誰かからの評価をものともせず、自分の作品を信じ切る。それはとても苦しく、大変なことだ。それでも、この心意気を忘れてしまえば、なぜ書いているのか、なぜ書かなければならなかったのかが、わからなくなってしまうだろう。

その信念を忘れないために、このサロンを使っていただけたら、大変ありがたく思います。`,
      bodyEn: `We desire something, are captivated by it, and struggle to embody it. That is how we determine what this thing called “I” is.

For me, that something is writing. I find words and reach out to catch them. But the moment I try to close my hand, they slip clean through my fingers, leaving not a single fragment behind. Because that saddens me, I go on struggling, single-mindedly. I write, spin, tie, loosen, unravel, erase. The work seems to have no end — so endless that even being at a loss over it grows tiresome — and its accumulation becomes words, then sentences, then books, and in time becomes me.

These are good times: many ways of thinking are accepted, and asserting one’s own way of life is looked on favorably. With that has come a growing number of outlets — note, X, Threads — where anyone can post their opinions and arguments, and the freedom and diversity of expression continue to expand. That in itself is very welcome. And yet, when something is pushed to the top of our feeds because it has drawn “likes” and other reactions, can we say from the bottom of our hearts, without a shadow of doubt, that it is “what I am interested in”? In the end, aren’t we simply being handed the tastes a system has predicted for us, without knowing why, and savoring them without ever asking what they mean? While we have all been averting our eyes from the damage this does, living “freely” on your own has, if anything, become harder than before.

Desire, by nature, is not so simple a thing that it can be easily satisfied. Wasn’t it something joyful and, at the same time, painful? Sharing work that is a reflection of yourself with someone else, whatever your circumstances or upbringing; offering opinions, arguing, pushing one another to do better — that, too, is what it should have been. Somewhere along the way, we have come to feel that all this belongs to the distant past.

It is a long time now since we were cast out into a world that is facile and yet bewilderingly complex, a world where we can gaze with envy at someone else’s glory with the greatest of ease. And we are far too easily swayed by the answers and “correct” solutions handed to us in an instant.

That is precisely why I believe that writers and their work should be acknowledged as something they themselves have created, for the simple fact that they write. Of course, to become the object of someone else’s assessment takes great courage, and to throw that opportunity away out of hand is the same as discarding a precious experience. Even so, what we need now is not an easy-to-grasp yardstick for judging. It is time — time to look at the countless things that belong to a work alone, its character, its style. Before any assessment, we face our own work head-on and share it with someone. For that, we need a place where we can stop for a moment and exchange words.

That place is what I want to call a “salon.” Many people in Japan, though, hear the word “salon” and picture a stiff, one-way gathering centered on a single person, or assembled to support one. Yet if we trace the word to its origins, a salon was a large room in a grand house — a drawing room, a parlor — and also a place where people talked together about shared topics and interests. It must have been intellectual and yet unceremonious, a place where people brought their knowledge and opinions to one another. If so, shouldn’t a salon be something lighter, something full of life and bustle?

It was out of these thoughts that I started Salon de l’écriture. We set down in print what we have watched and listened to, and what we have felt and thought as well, reaching beyond literature into art and scholarship.

To refuse to be swept along by others, to pay no heed to anyone’s assessment, and to believe utterly in your own work — this is painful, and it is hard. Even so, if we forget that spirit, we will lose sight of why we are writing, and why we had to write.

If you would use this salon to keep hold of that conviction, I would be truly grateful.`
    },
    {
      title: '私たちの領域', titleEn: 'Our Scope',
      body: `私たちは、主に芸術（一定の素材・様式を使って、社会の現実、理想とその矛盾や、人間・人生とは何かなどについて表現した人間の活動と、その作品。文学・絵画・彫刻・音楽・演劇など。『新明解国語辞典』より引用）と、それに関する評論やエッセイを活動領域としています。また、その文面を記述するに際しての意見交換、議論、お互いの作品に対する批評などを用いての交流を活発に行なっていきたいと考えております。しかし、芸術という広範な領域を扱うにあたり、活動内での混乱を避けるため、政治・宗教に関する勧誘や、それらに付随し恣意的と判断される宣伝行為を目的とする文面は、お受けいたしかねますのでご了承ください。`,
      bodyEn: `Our activities focus mainly on art (defined in the Shin Meikai Kokugo Jiten as “human activity that uses particular materials and forms to express such things as the realities and ideals of society and the contradictions between them, or what it means to be human and what life is, together with the works it produces, such as literature, painting, sculpture, music, and theater”) and on criticism and essays about art. We also hope to foster lively exchanges by sharing views and debating as we write, and by critiquing one another’s work. However, because art is such a broad field, and to avoid confusion within our activities, we are unable to accept submissions intended for political or religious solicitation, or related promotional content that we judge to be self-serving. Thank you for your understanding.`
    },
    {
      id: 'flow',
      title: '掲載までの流れ', titleEn: 'From Submission to Publication',
      body: `当サロンに作品を載せるときは、次の流れで進めます。どの段階でも、書き手の了承を得ないまま先へ進むことはありません。

1．作品を送る
掲載を希望する作品を、メールでお送りください。小説・評論・エッセイのいずれも、日本語・英語のどちらでも受け付けています。

2．原稿の取り扱いへの同意
原稿をAI（Claude）で扱う前に、AIをどこに使うのか、お預かりした原稿がどこに、どのくらいの期間残るのかをご説明し、同意をいただきます。AIで扱うことを望まない場合は、ご相談のうえ対応を決めます。

3．掲載の準備
同意をいただいてから、運営が掲載用のページを組みます。本文には手を加えません。誤字や出典の誤りなど、気になる箇所があれば、直さずにまとめてお伝えします。紹介文や見出しはAIが作成しますが、ご自身で用意していただくこともできます。

4．掲載前の確認
パソコンやスマホでの見え方、英語表示、SNSで共有したときの画像などを、確認用の資料にまとめてお送りします。掲載日、題名とその翻訳の扱い、全文公開か一部公開か、気になる箇所を直すかどうかなどを決めていただき、全体を承認していただいてから公開します。

→ [確認用の資料の見本（PDF）](files/review-sample.pdf)

5．公開
承認いただいた内容でサイトに公開し、正しく表示されていることを確かめてからご報告します。

公開後に作品の修正や取り下げをご希望の場合も、[連絡先](contact/)までご相談ください。`,
      bodyEn: `When we publish a work on this site, we follow the steps below. At no stage do we move forward without the writer’s consent.

1. Send your work
Please send the work you would like us to publish by email. We accept fiction, criticism, and essays, in either Japanese or English.

2. Consent to how your manuscript is handled
Before we handle your manuscript with AI (Claude), we explain where AI is used, and where and for how long the manuscript you entrust to us is kept, and we ask for your consent. If you would prefer that your work not be handled with AI, we will discuss with you how to proceed.

3. Preparing the page
Once we have your consent, the organizers build the page for your work. We make no changes to the text itself. If we notice anything that may need attention, such as typos or errors in sources, we list it for you without correcting it. Introductions and headings are written with AI, but you are also welcome to provide your own.

4. Review before publication
We send you a review document showing how the page looks on a computer and a smartphone, how it appears in English, and the image shown when it is shared on social media. You decide on the publication date, how the title and its translation are handled, whether to publish the full text or an excerpt, and whether to correct any points we raised. We publish only after you have approved everything.

→ [Sample review document (PDF, in Japanese)](files/review-sample.pdf)

5. Publication
We publish the page as approved, check that it displays correctly, and then let you know.

If you would like to revise or withdraw your work after publication, please get in touch through our [contact page](contact/).`
    },
    {
      title: 'AIの利用について', titleEn: 'Our Use of AI',
      body: `当サロンでは、サイトの運営にAI（Claude）を利用しています。AIを使うのは、掲載用のページの作成、紹介文や見出しの作成、題名の翻訳、誤りと思われる箇所の確認です。作品本文をAIで書き換えたり、翻訳したりすることはありません。書き手ご自身が翻訳した作品を載せる場合は、訳者と、AI翻訳を使ったかどうかを作品ページに明記します。

運営で使うアカウントは、会話がAIの学習に使われない設定にしています。また、公開している作品について、AIの学習を目的とした主要なクローラーによる収集を拒否する設定をしています。

保存期間や例外を含む詳しい内容は、次のページにまとめています。

→ [AIの利用とデータの取り扱いについて（2026年10月14日改定）](files/ai-data-policy.pdf)`,
      bodyEn: `We use AI (Claude) to run this site. We use it to build the pages for published works, to write introductions and headings, to translate titles, and to check for possible errors. We never use AI to rewrite or translate the text of a work. When we publish a work that the writer has translated, the work’s page states who translated it and whether AI translation was used.

The account we use to run the site is set so that our conversations are not used to train AI. We have also set the site to refuse collection of our published works by the major crawlers that gather data for AI training.

Details, including how long data is kept and the exceptions, are set out in the following document.

→ [Our Use of AI and Handling of Data (revised October 14, 2026; PDF, in Japanese)](files/ai-data-policy.pdf)`
    }
  ],

  mail: 'writing.book1210@gmail.com',
  instagram: 'salon.de.lecriture',
  sister: { name: 'Organizer’s website', url: 'https://writingbook1210.github.io/' }  // 主宰のページ（writing book）へのリンク
};
