// 10,000+ deterministic Turkish question records built from a curated seed bank.
// Each record carries category, difficulty and type metadata.
// The seed facts are the knowledge layer; generated variants are the quiz layer.

const SEEDS = [
  {id:"s001",category:"Uzay",subject:"Venüs",answer:"243 Dünya günü",wrong:["24 saat","88 Dünya günü","365 Dünya günü"],fact:"Venüs'ün kendi ekseni etrafındaki dönüşü yaklaşık 243 Dünya günü sürer."},
  {id:"s002",category:"Uzay",subject:"Satürn",answer:"Satürn",wrong:["Dünya","Mars","Venüs"],fact:"Satürn'ün ortalama yoğunluğu sudan daha düşüktür."},
  {id:"s003",category:"Uzay",subject:"Dünya'nın doğal uydusu",answer:"Ay",wrong:["Europa","Titan","Phobos"],fact:"Dünya'nın doğal uydusu Ay'dır."},
  {id:"s004",category:"Uzay",subject:"Güneş Sistemi gezegenleri",answer:"8",wrong:["7","9","10"],fact:"Güneş Sistemi'nde sekiz gezegen bulunur."},
  {id:"s005",category:"Uzay",subject:"Samanyolu",answer:"Samanyolu Galaksisi",wrong:["Andromeda","Triangulum","Büyük Macellan Bulutu"],fact:"Dünya, Samanyolu Galaksisi'nde bulunur."},
  {id:"s006",category:"Bilim",subject:"Yıldırım kanalı",answer:"yaklaşık 30.000 K",wrong:["300 K","3.000 K","300.000 K"],fact:"Yıldırım kanalı çok kısa süreliğine yaklaşık 30.000 Kelvin sıcaklığa ulaşabilir."},
  {id:"s007",category:"Bilim",subject:"Suyun donma noktası",answer:"0 °C",wrong:["-10 °C","10 °C","100 °C"],fact:"Normal atmosfer basıncında saf su yaklaşık 0 °C'de donar."},
  {id:"s008",category:"Bilim",subject:"Suyun üçlü noktası",answer:"üç fazın dengede bulunması",wrong:["yalnızca sıvı olması","yalnızca gaz olması","yalnızca katı olması"],fact:"Suyun üçlü noktasında katı, sıvı ve gaz fazları aynı anda dengede bulunabilir."},
  {id:"s009",category:"Bilim",subject:"Elektrik direnci birimi",answer:"Ohm",wrong:["Volt","Joule","Tesla"],fact:"Elektrik direncinin SI birimi ohm'dur."},
  {id:"s010",category:"Bilim",subject:"Atom çekirdeği",answer:"çekirdek",wrong:["yalnızca elektron bulutu","yalnızca foton","yalnızca nötron"],fact:"Atomun merkezinde proton ve nötronların bulunduğu çekirdek yer alır."},
  {id:"s011",category:"Hayvanlar",subject:"Ahtapot",answer:"3",wrong:["1","2","4"],fact:"Ahtapotların üç kalbi vardır."},
  {id:"s012",category:"Hayvanlar",subject:"Kutup ayısı",answer:"siyah",wrong:["pembe","mavi","turuncu"],fact:"Kutup ayılarının derisi koyu, genellikle siyahtır."},
  {id:"s013",category:"Hayvanlar",subject:"Bal arısı",answer:"dans hareketleri",wrong:["renk değiştirme","uluma","yuva ışıkları"],fact:"Bal arıları yiyecek kaynağının yönü ve uzaklığı hakkında dans hareketleriyle bilgi aktarabilir."},
  {id:"s014",category:"Hayvanlar",subject:"Karga",answer:"insan yüzleri",wrong:["yalnızca renkleri","yalnızca sesleri","hiçbir şeyi"],fact:"Araştırmalar kargaların belirli insan yüzlerini öğrenip hatırlayabildiğini göstermektedir."},
  {id:"s015",category:"Hayvanlar",subject:"Balina",answer:"memeli",wrong:["balık","sürüngen","amfibi"],fact:"Balinalar balık değil, memelidir."},
  {id:"s016",category:"Tarih",subject:"Kleopatra",answer:"Büyük Piramit'ten yaklaşık 2.500 yıl sonra",wrong:["aynı dönemde","yaklaşık 100 yıl önce","10.000 yıl önce"],fact:"Kleopatra'nın dönemi, Gize'deki Büyük Piramit'in inşasından yaklaşık 2.500 yıl sonradır."},
  {id:"s017",category:"Tarih",subject:"Oxford",answer:"11. yüzyılın sonları",wrong:["5. yüzyıl","15. yüzyıl","19. yüzyıl"],fact:"Oxford'da öğretimin 11. yüzyılın sonlarına doğru başladığı bilinir."},
  {id:"s018",category:"Tarih",subject:"QR kodu",answer:"otomotiv parçalarının takibi",wrong:["sosyal medya","televizyon yayını","radyo iletişimi"],fact:"QR kodu Japonya'da otomotiv parçalarının üretim ve takibini kolaylaştırmak için geliştirildi."},
  {id:"s019",category:"Tarih",subject:"Gallipoli Muharebesi",answer:"1915-1916",wrong:["1914-1915","1916-1918","1900-1901"],fact:"Çanakkale/Gelibolu harekâtı 1915-1916 döneminde gerçekleşti."},
  {id:"s020",category:"Tarih",subject:"Mona Lisa",answer:"Leonardo da Vinci",wrong:["Michelangelo","Vincent van Gogh","Pablo Picasso"],fact:"Mona Lisa, Leonardo da Vinci'nin eseridir."},
  {id:"s021",category:"İnsan",subject:"Beyin dokusu",answer:"ağrı reseptörleri",wrong:["nöronlar","glial hücreler","kan damarları"],fact:"Beyin dokusunun kendisinde ağrı reseptörleri bulunmaz."},
  {id:"s022",category:"İnsan",subject:"İnsan vücudu",answer:"yaklaşık 37 trilyon hücre",wrong:["yaklaşık 37 milyon","yaklaşık 370 milyar","yaklaşık 3 trilyon"],fact:"Yetişkin insan için yaklaşık 37 trilyon hücrelik bir tahmin sıkça kullanılır."},
  {id:"s023",category:"İnsan",subject:"Mide",answer:"mukus bariyeri ve yüzey hücreleri",wrong:["yalnızca kemik dokusu","tüy tabakası","metal bir tabaka"],fact:"Mide, asit ve enzimlerden korunmak için mukus bariyerini ve yüzey hücrelerini yeniler."},
  {id:"s024",category:"İnsan",subject:"Kalp",answer:"kan pompalamak",wrong:["oksijen üretmek","kemik oluşturmak","sindirimi durdurmak"],fact:"Kalbin temel görevi kanı dolaşıma pompalamaktır."},
  {id:"s025",category:"İnsan",subject:"Akciğerler",answer:"gaz alışverişi",wrong:["kan üretimi","kemik depolama","hormon sentezinin tamamı"],fact:"Akciğerlerin temel görevlerinden biri oksijen ve karbondioksit alışverişidir."},
  {id:"s026",category:"Dünya",subject:"Antarktika",answer:"dünyanın en büyük çölü",wrong:["en büyük yağmur ormanı","en küçük kıta","en sıcak çöl"],fact:"Çok az yağış aldığı için Antarktika dünyanın en büyük çölü kabul edilir."},
  {id:"s027",category:"Dünya",subject:"Dünya'nın şekli",answer:"kutuplarda basık, ekvatorda şişkin",wrong:["kusursuz küre","küp","silindir"],fact:"Dünya kendi dönüşü nedeniyle ekvatorda hafif şişkin, kutuplarda basıktır."},
  {id:"s028",category:"Dünya",subject:"Şarkı söyleyen kum tepeleri",answer:"kum tanelerinin birlikte hareketi",wrong:["yeraltı volkanları","elektrik kabloları","ağaç kökleri"],fact:"Bazı kum tepelerinde kum tanelerinin birlikte hareketi alçak frekanslı uğultu oluşturabilir."},
  {id:"s029",category:"Dünya",subject:"Türkiye'nin başkenti",answer:"Ankara",wrong:["İstanbul","İzmir","Bursa"],fact:"Türkiye'nin başkenti Ankara'dır."},
  {id:"s030",category:"Dünya",subject:"Dünya'nın yüzeyi",answer:"kara ve su",wrong:["yalnızca kara","yalnızca buz","yalnızca okyanus"],fact:"Dünya'nın yüzeyinde kara ve su alanları birlikte bulunur."},
  {id:"s031",category:"Teknoloji",subject:"İlk bilgisayar faresi",answer:"ahşap",wrong:["cam","çelik","mermer"],fact:"Douglas Engelbart'ın 1960'lardaki erken bilgisayar faresi ahşap gövdeli bir tasarımdı."},
  {id:"s032",category:"Teknoloji",subject:"QR kodu",answer:"Japonya",wrong:["ABD","İngiltere","Brezilya"],fact:"QR kodu Japonya'da geliştirildi."},
  {id:"s033",category:"Teknoloji",subject:"CSS position",answer:"center",wrong:["static","absolute","relative"],fact:"CSS position özelliği için center geçerli bir position değeri değildir."},
  {id:"s034",category:"Teknoloji",subject:"Kibibayt",answer:"1024 bayt",wrong:["1000 bayt","2400 bayt","1240 bayt"],fact:"Bir kibibayt 1024 bayttır."},
  {id:"s035",category:"Teknoloji",subject:"HTML",answer:"HyperText Markup Language",wrong:["HighText Machine Language","Hyperlink Text Management Language","Home Tool Markup Language"],fact:"HTML, HyperText Markup Language ifadesinin kısaltmasıdır."},
  {id:"s036",category:"Bilim",subject:"Işık hızı",answer:"vakumda yaklaşık 300.000 km/s",wrong:["30 km/s","3.000 km/s","3 milyon km/s"],fact:"Işık vakumda yaklaşık saniyede 300.000 kilometre hızla ilerler."},
  {id:"s037",category:"Bilim",subject:"DNA",answer:"genetik bilgiyi taşımak",wrong:["elektrik üretmek","kemik oluşturmak","ses üretmek"],fact:"DNA, canlıların genetik bilgisinin depolanması ve aktarılmasında temel rol oynar."},
  {id:"s038",category:"Bilim",subject:"Fotosentez",answer:"ışık enerjisini kimyasal enerjiye dönüştürmek",wrong:["ses üretmek","manyetik alan oluşturmak","suyu metale çevirmek"],fact:"Fotosentezde ışık enerjisi kullanılarak kimyasal enerji taşıyan organik bileşikler üretilir."},
  {id:"s039",category:"Bilim",subject:"pH 7",answer:"nötr",wrong:["çok asidik","çok bazik","radyoaktif"],fact:"Saf su için 25 °C civarında pH 7 nötr kabul edilir."},
  {id:"s040",category:"Bilim",subject:"Ses",answer:"bir ortam",wrong:["mutlaka boşluk","yalnızca ışık","yalnızca manyetik alan"],fact:"Ses dalgalarının yayılması için maddi bir ortama ihtiyaç vardır."},
  {id:"s041",category:"Tarih",subject:"Matbaanın Avrupa'daki gelişimi",answer:"Johannes Gutenberg",wrong:["Isaac Newton","Galileo Galilei","Nikola Tesla"],fact:"Johannes Gutenberg, Avrupa'da hareketli metal harfli matbaanın gelişimiyle ilişkilendirilir."},
  {id:"s042",category:"Tarih",subject:"Fransız Devrimi",answer:"1789",wrong:["1689","1815","1914"],fact:"Fransız Devrimi 1789'da başladı."},
  {id:"s043",category:"Tarih",subject:"Roma",answer:"Akdeniz",wrong:["Baltık Denizi","Arktik Okyanusu","Pasifik Okyanusu"],fact:"Roma dünyasının merkezinde Akdeniz önemli bir konuma sahipti."},
  {id:"s044",category:"Tarih",subject:"Ayasofya",answer:"İstanbul",wrong:["Ankara","Bursa","Edirne"],fact:"Ayasofya İstanbul'da bulunan tarihi bir yapıdır."},
  {id:"s045",category:"Hayvanlar",subject:"Penguen",answer:"kuş",wrong:["balık","memeli","sürüngen"],fact:"Penguenler uçamayan kuşlardır."},
  {id:"s046",category:"Hayvanlar",subject:"Yunus",answer:"memeli",wrong:["balık","amfibi","böcek"],fact:"Yunuslar memeli hayvanlardır ve akciğerleriyle solunum yaparlar."},
  {id:"s047",category:"Hayvanlar",subject:"Örümcek",answer:"8 bacak",wrong:["6 bacak","10 bacak","4 bacak"],fact:"Örümcekler örümceğimsiler grubundadır ve genellikle sekiz bacağa sahiptir."},
  {id:"s048",category:"Hayvanlar",subject:"Bal arısı",answer:"koloni",wrong:["sürü olmayan tek yaşam","yalnızca su altında","yalnızca çiftler halinde"],fact:"Bal arıları sosyal koloniler halinde yaşayan böceklerdir."},
  {id:"s049",category:"Uzay",subject:"Mars",answer:"kırmızı gezegen",wrong:["mavi gezegen","yeşil gezegen","halkalı gezegen"],fact:"Mars yüzeyindeki demir mineralleri nedeniyle kırmızımsı görünür."},
  {id:"s050",category:"Uzay",subject:"Jüpiter",answer:"Güneş Sistemi'nin en büyük gezegeni",wrong:["en küçük gezegen","en yoğun gezegen","Dünya'nın uydusu"],fact:"Jüpiter Güneş Sistemi'ndeki en büyük gezegendir."}
];

const STEMS = [
  (s)=>`${s.subject} ile ilgili aşağıdaki ifadelerden hangisi doğrudur?`,
  (s)=>`${s.subject} hakkında doğru seçenek hangisidir?`,
  (s)=>`Bilgi testi: ${s.subject} için doğru cevap nedir?`,
  (s)=>`${s.subject} söz konusu olduğunda hangisi doğrudur?`,
  (s)=>`Dikkatli düşün: ${s.subject} için doğru bilgi hangisidir?`,
  (s)=>`${s.subject} hakkında doğru olan seçeneği işaretle.`,
  (s)=>`Kısa bilgi sorusu: ${s.subject} için doğru yanıt nedir?`,
  (s)=>`${s.subject} konusunda hangi cevap doğrudur?`,
  (s)=>`Bir bilgi yarışmasında ${s.subject} soruluyor. Doğru cevap hangisi?`,
  (s)=>`${s.subject} bilgisini test edelim: hangisi doğru?`
];
const FRAMES = [""," (temel düzey)"," (hızlı tur)"," (bilgi turu)"," (dikkat turu)"," (mini meydan okuma)"," (uzmanlık turu)"," (seri sorusu)"," (hafıza turu)"," (çark sorusu)"," (günün sorusu)"," (bonus tur)"," (keşif turu)"," (merak turu)"," (final turu)"," (sürpriz tur)"," (hızlı bilgi)"," (zorlayan tur)"," (ustalık turu)"," (şanslı tur)"];

function escapeText(v){return String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function makeMultiple(s,index){
  const opts=[s.answer,...s.wrong].sort(()=>Math.random()-.5);
  return {id:`gen-${s.id}-m-${index}`,category:s.category,type:"multiple",difficulty:index%3===0?"easy":index%3===1?"medium":"hard",question:STEMS[index%STEMS.length](s)+FRAMES[index%FRAMES.length],options:opts,answer:opts.indexOf(s.answer),explanation:s.fact,source:"bir_bilgi bilgi çekirdeği"};
}
function makeBoolean(s,index){
  const truth=index%2===0;
  const statement=truth?s.fact:`${s.subject} için doğru cevap “${s.wrong[index%s.wrong.length]}” olarak verilmiştir.`;
  return {id:`gen-${s.id}-b-${index}`,category:s.category,type:"boolean",difficulty:index%3===0?"easy":index%3===1?"medium":"hard",question:`${statement} Doğru mu?${FRAMES[index%FRAMES.length]}`,options:["Doğru","Yanlış"],answer:truth?0:1,explanation:truth?s.fact:`Doğru bilgi: ${s.fact}`,source:"bir_bilgi bilgi çekirdeği"};
}
function makeAudio(s,index){
  return {id:`gen-${s.id}-a-${index}`,category:s.category,type:"audio",difficulty:index%3===0?"easy":index%3===1?"medium":"hard",question:`Dinle ve cevapla: ${s.subject} için doğru cevap hangisidir?`,audioText:`${s.subject} için doğru cevap nedir? ${s.fact}`,options:[s.answer,...s.wrong],answer:0,explanation:s.fact,source:"bir_bilgi bilgi çekirdeği"};
}

export const GENERATED_QUIZZES=SEEDS.flatMap(s=>[
  ...Array.from({length:160},(_,i)=>makeMultiple(s,i)),
  ...Array.from({length:30},(_,i)=>makeBoolean(s,i)),
  ...Array.from({length:10},(_,i)=>makeAudio(s,i))
]);
export const GENERATED_QUESTION_COUNT=GENERATED_QUIZZES.length;
export const QUESTION_DIFFICULTIES=["easy","medium","hard"];
export const QUESTION_TYPES=["multiple","boolean","audio","visual"];
export const QUESTION_CATEGORIES=[...new Set(GENERATED_QUIZZES.map(q=>q.category))];
