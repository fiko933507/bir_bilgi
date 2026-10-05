const SUBJECT_CATEGORY={
 astronomy:"Uzay", high_school_biology:"Bilim", college_biology:"Bilim", high_school_chemistry:"Bilim", college_chemistry:"Bilim", high_school_physics:"Bilim", college_physics:"Bilim", conceptual_physics:"Bilim", virology:"Bilim",
 high_school_world_history:"Tarih", high_school_european_history:"Tarih", prehistory:"Tarih", us_history:"Tarih", world_history:"Tarih",
 high_school_geography:"Coğrafya", geography:"Coğrafya", global_facts:"Dünya",
 high_school_computer_science:"Teknoloji", college_computer_science:"Teknoloji", machine_learning:"Teknoloji", electrical_engineering:"Teknoloji", computer_security:"Teknoloji",
 anatomy:"İnsan", human_aging:"İnsan", psychology:"İnsan", human_sexuality:"İnsan", nutrition:"İnsan", medical_genetics:"İnsan", clinical_knowledge:"İnsan",
 philosophy:"Felsefe", moral_disputes:"Felsefe", moral_scenarios:"Felsefe", formal_logic:"Felsefe", sociology:"İnsan",
 high_school_mathematics:"Matematik", college_mathematics:"Matematik", elementary_mathematics:"Matematik", statistics:"Matematik", abstract_algebra:"Matematik", econometrics:"Ekonomi", microeconomics:"Ekonomi", macroeconomics:"Ekonomi",
 Turkish_Language_and_Literature:"Edebiyat", literature:"Edebiyat", world_religions:"Mitoloji", religion_and_ethics:"Mitoloji",
};
const normalize=(row,index)=>{const subject=row.subject||row.metadata?.subject||"global_facts";const category=SUBJECT_CATEGORY[subject]||"Dünya";const choices=row.choices||[];return {id:"mmlu-"+subject+"-"+index,category,type:"multiple",difficulty:row.metadata?.difficulty||"medium",question:row.question,options:choices,answer:Number(row.answer),explanation:"Soru, Türkçe çoktan seçmeli bilgi benchmarkı MMLU-TR veri kümesinden alınmıştır.",source:"MMLU-TR · malhajar/mmlu-tr",sourceUrl:"https://huggingface.co/datasets/malhajar/mmlu-tr"};};
export async function fetchRemoteQuestions({category="Tümü",count=20,offset=0}={}){const url="https://datasets-server.huggingface.co/rows?dataset=malhajar%2Fmmlu-tr&config=global_facts&split=test&offset="+offset+"&length="+Math.min(count,100);const res=await fetch(url);if(!res.ok)throw new Error("Soru sunucusu HTTP "+res.status);const json=await res.json();return (json.rows||[]).map((x,i)=>normalize(x.row,i)).filter(q=>category==="Tümü"||q.category===category).slice(0,count);}
export {SUBJECT_CATEGORY};