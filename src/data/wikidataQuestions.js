const BASE="https://raw.githubusercontent.com/fiko933507/bir_bilgi/main/src/data/wikidata";
const cache=new Map();
export async function fetchWikidataQuestions({category="Tümü",count=20}={}){
  const categories=category==="Tümü"?["Tarih","Bilim","Uzay","Hayvanlar","Dünya","Teknoloji","İnsan","Sanat","Spor","Edebiyat","Sinema","Müzik","Coğrafya","Mitoloji","Felsefe","Matematik","Ekonomi"]:[category];
  const out=[];
  for(const name of categories){
    try{
      let data=cache.get(name);
      if(!data){
        const res=await fetch(BASE+"/"+encodeURIComponent(name)+".json");
        if(!res.ok)continue;
        data=await res.json();
        cache.set(name,data);
      }
      out.push(...data);
      if(out.length>=count)break;
    }catch(e){}
  }
  return out.sort(()=>Math.random()-.5).slice(0,count);
}
