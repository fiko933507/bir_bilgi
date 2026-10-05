import fs from "node:fs/promises";
import path from "node:path";

const OUT=path.resolve("src/data/interesting-facts");
const PER_CATEGORY=Number(process.env.INTERESTING_FACTS_PER_CATEGORY||500);
const ENDPOINT="https://query.wikidata.org/sparql";
const UA="bir_bilgi/1.0 (https://github.com/fiko933507/bir_bilgi; contact via GitHub)";

const RECIPES={
 "Uzay":[["P31","uzay nesnesi"],["P2067","kütle"],["P2146","yörünge süresi"]],
 "Hayvanlar":[["P31","hayvan"],["P171","takson üstü"],["P225","bilimsel ad"]],
 "Bilim":[["P31","bilimsel kavram"],["P279","üst sınıf"],["P2176","kullanılan madde"]],
 "Tarih":[["P571","başlangıç tarihi"],["P570","ölüm tarihi"],["P585","nokta tarih"]],
 "Dünya":[["P17","ülke"],["P36","başkent"],["P37","resmî dil"]],
 "Coğrafya":[["P2044","rakım"],["P17","ülke"],["P206","su kütlesi"]],
 "Teknoloji":[["P176","üretici"],["P577","yayın tarihi"],["P31","tür"]],
 "İnsan":[["P19","doğum yeri"],["P106","meslek"],["P69","eğitim kurumu"]],
 "Sanat":[["P170","yaratıcı"],["P571","oluşturulma tarihi"],["P175","sanatçı"]],
 "Spor":[["P641","spor"],["P17","ülke"],["P580","başlangıç"]],
 "Edebiyat":[["P50","yazar"],["P577","yayın tarihi"],["P136","tür"]],
 "Sinema":[["P57","yönetmen"],["P161","oyuncu"],["P577","yayın tarihi"]],
 "Müzik":[["P175","sanatçı"],["P86","besteci"],["P577","yayın tarihi"]],
 "Mitoloji":[["P31","tür"],["P279","üst sınıf"],["P106","rol"]],
 "Doğa":[["P31","tür"],["P2044","rakım"],["P206","sular"]],
 "Yiyecek":[["P279","üst sınıf"],["P17","ülke"],["P361","parçası"]],
 "Mimari":[["P571","oluşturulma tarihi"],["P84","mimar"]],
 "Keşifler":[["P61","keşfeden"],["P575","keşif tarihi"],["P793","önemli olay"]],
 "Ekonomi":[["P17","ülke"],["P452","sektör"],["P108","işveren"]]
};

const CATS=Object.keys(RECIPES);

function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function parseDate(v){
 const m=String(v||"").match(/^([+-]?\d{4})-(\d{2})-(\d{2})/);
 return m?m[1]:null;
}
function valueLabel(row){
 const v=row.valueLabel?.value||row.value?.value||"";
 return v.replace(/^Q\d+$/,"").trim();
}
function entityId(uri){return String(uri||"").match(/Q\d+$/)?.[0]||""}

async function query(sparql){
 for(let attempt=0;attempt<5;attempt++){
   const r=await fetch(ENDPOINT,{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded","accept":"application/sparql-results+json","user-agent":UA},body:new URLSearchParams({query:sparql,format:"json"})});
   if(r.ok)return (await r.json()).results.bindings;
   if(r.status===429||r.status>=500){await new Promise(x=>setTimeout(x,1500*(attempt+1)));continue}
   throw new Error(`WDQS ${r.status}: ${await r.text()}`);
 }
 return [];
}

function makeFact(category,row,propertyLabel){
 const item=row.itemLabel?.value?.trim(); const value=valueLabel(row); if(!item||!value)return null;
 const id=entityId(row.item?.value); if(!id)return null;
 const date=parseDate(row.value?.value);
 let title="",text="";
 if(date && /tarih|başlangıç|ölüm|yayın|oluşturulma|keşif/.test(propertyLabel)){
   title=`${item} hakkında şaşırtıcı bir tarih`;
   text=`${item}, ${date} yılında ${propertyLabel} ile ilişkilidir. Bu bilgi Wikidata üzerindeki yapılandırılmış veriden alınmıştır.`;
 }else{
   title=`${item} ile ilgili bunu biliyor muydun?`;
   text=`${item} hakkında dikkat çekici bilgi: Wikidata'da ${propertyLabel} olarak ${value} bilgisi yer alıyor.`;
 }
 return {id:`wd-fact-${id}-${propertyLabel.replace(/\\W+/g,"-")}`,category,title,text,source:"Wikidata · yapılandırılmış veri",sourceUrl:`https://www.wikidata.org/wiki/${id}`,license:"CC0",entity:id,tags:[category.toLocaleLowerCase("tr-TR"),propertyLabel]};
}

async function buildCategory(category){
  const seen=new Set(),out=[];
  const recipes=RECIPES[category];
  const values=recipes.map(([prop,label])=>`{ ?item wdt:${prop} ?value . BIND("${prop}" AS ?prop) BIND("${label}" AS ?propertyLabel) }`).join(" UNION ");
  const q=`SELECT ?item ?itemLabel ?value ?valueLabel ?prop ?propertyLabel WHERE {
    { ${values} }
    ?item rdfs:label ?itemLabel .
    FILTER(LANG(?itemLabel)="tr")
    OPTIONAL { ?value rdfs:label ?valueLabel . FILTER(LANG(?valueLabel)="tr") }
    FILTER(BOUND(?valueLabel) || DATATYPE(?value)=xsd:dateTime || DATATYPE(?value)=xsd:date || DATATYPE(?value)=xsd:decimal || DATATYPE(?value)=xsd:integer)
    SERVICE wikibase:label { bd:serviceParam wikibase:language "tr,en". }
  } LIMIT ${Math.max(PER_CATEGORY*3,750)}`;
  const rows=await query(q);
  for(const row of rows){
    if(out.length>=PER_CATEGORY)break;
    const label=row.propertyLabel?.value||"özelliği";
    const f=makeFact(category,row,label);
    if(f&&!seen.has(f.id)){seen.add(f.id);out.push(f)}
  }
  return out;
}

await fs.mkdir(OUT,{recursive:true});
const manifest={generatedAt:new Date().toISOString(),targetPerCategory:PER_CATEGORY,categories:{},total:0,license:"Wikidata structured data CC0"};
for(const category of CATS){
 console.log(`Building ${category}...`);
 const facts=await buildCategory(category);
 await fs.writeFile(path.join(OUT,`${category}.json`),JSON.stringify(facts,null,2));
 manifest.categories[category]=facts.length; manifest.total+=facts.length;
 console.log(`${category}: ${facts.length}`);
}
await fs.writeFile(path.join(OUT,"manifest.json"),JSON.stringify(manifest,null,2));
console.log(JSON.stringify(manifest,null,2));
