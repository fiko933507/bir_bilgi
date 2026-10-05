const BASE="https://raw.githubusercontent.com/fiko933507/bir_bilgi/main/src/data/interesting-facts";

const cache={};

export const INTERESTING_CATEGORIES=[
 "Tümü","Uzay","Hayvanlar","Bilim","Tarih","Dünya","Coğrafya","Teknoloji",
 "İnsan","Sanat","Spor","Edebiyat","Sinema","Müzik","Mitoloji","Doğa",
 "Yiyecek","Mimari","Keşifler","Ekonomi"
];

export async function fetchInterestingFacts({category="Tümü",count=1}={}){
 const cats=category==="Tümü"?INTERESTING_CATEGORIES.slice(1):[category];
 const wanted=Math.max(1,count);
 let all=[];
 for(const cat of cats){
   if(!cache[cat]){
     try{
       const r=await fetch(`${BASE}/${encodeURIComponent(cat)}.json`);
       if(r.ok) cache[cat]=await r.json(); else cache[cat]=[];
     }catch(e){cache[cat]=[]}
   }
   all.push(...(cache[cat]||[]));
   if(category==="Tümü" && all.length>=wanted*3) break;
 }
 return all.sort(()=>Math.random()-.5).slice(0,wanted);
}
