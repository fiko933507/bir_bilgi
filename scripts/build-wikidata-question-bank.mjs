import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const ENDPOINT = "https://query.wikidata.org/sparql";
const OUT_DIR = new URL("../src/data/wikidata/", import.meta.url);
const TARGET_PER_CATEGORY = Number(process.env.WIKIDATA_TARGET_PER_CATEGORY || 600);
const USER_AGENT = "bir_bilgi/1.0 (https://github.com/fiko933507/bir_bilgi) WikidataQuestionBuilder/1.0";
const sleep = ms => new Promise(r => setTimeout(r, ms));

const CATEGORIES = {
  Tarih:[{property:"P571",question:"{label} hangi tarihte başladı/oluşturuldu?",answer:"date"},{property:"P570",question:"{label} hangi tarihte öldü?",answer:"date"}],
  Bilim:[{property:"P31",question:"{label} hangi tür bilimsel varlıktır?",answer:"item"},{property:"P279",question:"{label} hangi kavramın alt sınıfıdır?",answer:"item"}],
  Uzay:[{property:"P31",question:"{label} hangi tür gök cismidir?",answer:"item"},{property:"P2067",question:"{label} yaklaşık kaç kilogram kütleye sahiptir?",answer:"quantity"}],
  Hayvanlar:[{property:"P171",question:"{label} hangi üst taksona bağlıdır?",answer:"item"},{property:"P141",question:"{label} için koruma durumu nedir?",answer:"item"}],
  Dünya:[{property:"P36",question:"{label} için başkent hangisidir?",answer:"item"},{property:"P37",question:"{label} hangi resmi dili kullanır?",answer:"item"}],
  Teknoloji:[{property:"P31",question:"{label} hangi tür teknoloji/üründür?",answer:"item"},{property:"P176",question:"{label} hangi şirket/üretici tarafından üretilmiştir?",answer:"item"}],
  İnsan:[{property:"P19",question:"{label} nerede doğmuştur?",answer:"item"},{property:"P106",question:"{label} hangi meslekle tanınır?",answer:"item"}],
  Sanat:[{property:"P170",question:"{label} eserinin sanatçısı kimdir?",answer:"item"},{property:"P571",question:"{label} hangi tarihte oluşturuldu?",answer:"date"}],
  Spor:[{property:"P31",question:"{label} hangi tür spor organizasyonu/varlığıdır?",answer:"item"},{property:"P17",question:"{label} hangi ülkeyle ilişkilidir?",answer:"item"}],
  Edebiyat:[{property:"P50",question:"{label} eserinin yazarı kimdir?",answer:"item"},{property:"P577",question:"{label} ne zaman yayımlandı?",answer:"date"}],
  Sinema:[{property:"P57",question:"{label} filminin yönetmeni kimdir?",answer:"item"},{property:"P161",question:"{label} filminde hangi oyuncu yer alır?",answer:"item"}],
  Müzik:[{property:"P175",question:"{label} eserinin icracısı kimdir?",answer:"item"},{property:"P86",question:"{label} eserinin bestecisi kimdir?",answer:"item"}],
  Coğrafya:[{property:"P2044",question:"{label} deniz seviyesinden yaklaşık kaç metre yüksektedir?",answer:"quantity"},{property:"P625",question:"{label} hangi coğrafi konuma sahiptir?",answer:"coordinate"}],
  Mitoloji:[{property:"P31",question:"{label} hangi tür mitolojik varlıktır?",answer:"item"},{property:"P279",question:"{label} hangi kavramın alt sınıfıdır?",answer:"item"}],
  Felsefe:[{property:"P31",question:"{label} hangi tür felsefi kavramdır?",answer:"item"},{property:"P50",question:"{label} eserinin/yaklaşımının yazarı kimdir?",answer:"item"}],
  Matematik:[{property:"P31",question:"{label} hangi tür matematiksel kavramdır?",answer:"item"},{property:"P279",question:"{label} hangi kavramın alt sınıfıdır?",answer:"item"}],
  Ekonomi:[{property:"P31",question:"{label} hangi tür ekonomik kavram/kurumdur?",answer:"item"},{property:"P17",question:"{label} hangi ülkeyle ilişkilidir?",answer:"item"}]
};

const safe=s=>String(s??"").replace(/[<>]/g,"");
const hash=s=>createHash("sha1").update(s).digest("hex").slice(0,12);

function buildQuery(property,offset,limit){
  return 'SELECT ?item ?itemLabel ?value ?valueLabel WHERE {'+
    '?item wdt:'+property+' ?value . '+
    '?item rdfs:label ?itemLabel . FILTER(LANG(?itemLabel)="tr") '+
    'OPTIONAL { ?value rdfs:label ?valueLabel . FILTER(LANG(?valueLabel)="tr") } '+
    'SERVICE wikibase:label { bd:serviceParam wikibase:language "tr,en". } '+
    '} LIMIT '+limit+' OFFSET '+offset;
}

async function queryWikidata(sparql){
  const url=ENDPOINT+"?format=json&query="+encodeURIComponent(sparql);
  for(let attempt=0;attempt<4;attempt++){
    const res=await fetch(url,{headers:{"Accept":"application/sparql-results+json","User-Agent":USER_AGENT}});
    if(res.ok)return res.json();
    if(![429,500,502,503,504].includes(res.status))throw new Error("WDQS "+res.status);
    await sleep(1500*(attempt+1));
  }
  throw new Error("WDQS request failed after retries");
}

function parseDate(v){
  if(!v)return null;
  const d=String(v).slice(0,10);
  if(!/^[-+]?\d{4}-\d{2}-\d{2}$/.test(d))return null;
  const y=d.slice(0,4);
  return y.startsWith("-")?Math.abs(Number(y))+" MÖ":y;
}

function makeQuestion(category,recipe,b,distractors){
  const item=safe(b.itemLabel?.value);
  const raw=b.value?.value;
  if(!item||!raw)return null;
  let answerText=b.valueLabel?.value?safe(b.valueLabel.value):null;
  if(recipe.answer==="date")answerText=parseDate(raw);
  if(recipe.answer==="quantity"){
    const n=Number(raw);
    if(!Number.isFinite(n))return null;
    answerText=Math.round(n*100)/100;
  }
  if(recipe.answer==="coordinate")return null;
  if(!answerText)return null;
  const pool=distractors.filter(x=>x&&x!==answerText).slice(0,3);
  if(pool.length<3)return null;
  const options=[String(answerText),...pool].sort(()=>Math.random()-.5);
  const answer=options.indexOf(String(answerText));
  return {
    id:"wd-"+hash(category+"|"+recipe.property+"|"+item+"|"+raw),
    category,type:"multiple",difficulty:"medium",
    question:recipe.question.replace("{label}",item),
    options,answer,
    explanation:item+" hakkında Wikidata'daki yapılandırılmış bilgi kullanılarak oluşturulmuştur.",
    source:"Wikidata · yapılandırılmış veri",
    sourceUrl:b.item?.value||"https://www.wikidata.org/",
    license:"CC0 (Wikidata structured data)",
    generatedAt:new Date().toISOString().slice(0,10)
  };
}

async function buildCategory(category,recipes){
  const all=new Map();
  for(const recipe of recipes){
    let offset=0;
    while(all.size<TARGET_PER_CATEGORY&&offset<5000){
      const json=await queryWikidata(buildQuery(recipe.property,offset,250));
      const rows=json.results?.bindings||[];
      if(!rows.length)break;
      const values=rows.map(r=>r.valueLabel?.value||r.value?.value).filter(Boolean);
      for(const row of rows){
        const q=makeQuestion(category,recipe,row,values);
        if(q)all.set(q.id,q);
        if(all.size>=TARGET_PER_CATEGORY)break;
      }
      offset+=rows.length;
      await sleep(350);
      if(rows.length<250)break;
    }
  }
  return [...all.values()].slice(0,TARGET_PER_CATEGORY);
}

await mkdir(OUT_DIR,{recursive:true});
const manifest={source:"Wikidata",license:"CC0 (structured data)",targetPerCategory:TARGET_PER_CATEGORY,categories:{}};
for(const [category,recipes] of Object.entries(CATEGORIES)){
  console.log("Building "+category+"...");
  const questions=await buildCategory(category,recipes);
  await writeFile(new URL(encodeURIComponent(category)+".json",OUT_DIR),JSON.stringify(questions,null,2)+"\n");
  manifest.categories[category]=questions.length;
  console.log("  "+questions.length+" questions");
}
manifest.total=Object.values(manifest.categories).reduce((a,b)=>a+b,0);
manifest.generatedAt=new Date().toISOString();
await writeFile(new URL("manifest.json",OUT_DIR),JSON.stringify(manifest,null,2)+"\n");
console.log("Wikidata bank complete: "+manifest.total+" questions");
