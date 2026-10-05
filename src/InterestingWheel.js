import React,{useRef,useState} from "react";
import {View,Text,Pressable,StyleSheet,Animated,Easing} from "react-native";
import {INTERESTING_CATEGORIES,fetchInterestingFacts} from "./data/interestingFacts";

const SEGMENTS=[
 {name:"Uzay",icon:"🌌"},{name:"Hayvanlar",icon:"🐾"},{name:"Bilim",icon:"🔬"},{name:"Tarih",icon:"🏛️"},
 {name:"Dünya",icon:"🌍"},{name:"Coğrafya",icon:"🗺️"},{name:"Teknoloji",icon:"💻"},{name:"İnsan",icon:"🧠"},
 {name:"Sanat",icon:"🎨"},{name:"Spor",icon:"🏅"},{name:"Edebiyat",icon:"📚"},{name:"Sinema",icon:"🎬"},
 {name:"Müzik",icon:"🎵"},{name:"Mitoloji",icon:"🐉"},{name:"Doğa",icon:"🌿"},{name:"Yiyecek",icon:"🍽️"},
 {name:"Mimari",icon:"🏗️"},{name:"Keşifler",icon:"🧭"},{name:"Ekonomi",icon:"💰"},{name:"Sürpriz",icon:"✨"}
];

export default function InterestingWheel({onBack,onFact}){
 const rotation=useRef(new Animated.Value(0)).current;
 const [spinning,setSpinning]=useState(false),[result,setResult]=useState(null);
 const spin=()=>{
   if(spinning)return;
   const index=Math.floor(Math.random()*SEGMENTS.length),segment=360/SEGMENTS.length;
   const target=360*6+(360-(index*segment+segment/2));
   setSpinning(true);setResult(null);
   Animated.timing(rotation,{toValue:target,duration:4200,easing:Easing.out(Easing.cubic),useNativeDriver:true}).start(async({finished})=>{
     if(!finished)return;
     const selected=SEGMENTS[index];
     setResult(selected);setSpinning(false);
     setTimeout(async()=>{
       const cat=selected.name==="Sürpriz"?"Tümü":selected.name;
       const facts=await fetchInterestingFacts({category:cat,count:1});
       onFact(facts[0]||null,cat);
     },500);
   });
 };
 const spinStyle={transform:[{rotate:rotation.interpolate({inputRange:[0,360],outputRange:["0deg","360deg"]})}]};
 return <View style={w.screen}>
   <View style={w.top}><Pressable onPress={onBack} style={w.back}><Text style={w.backText}>←</Text></Pressable><View><Text style={w.title}>Merak Çarkı</Text><Text style={w.sub}>İlgini çekebilecek bir konu seçelim</Text></View></View>
   <View style={w.stage}>
    <View style={w.pointer}><Text style={w.pointerText}>▼</Text></View>
    <Animated.View style={[w.wheel,spinStyle]}>
     {SEGMENTS.map((x,i)=><View key={x.name} style={[w.slot,{transform:[{rotate:`${i*(360/SEGMENTS.length)}deg`},{translateY:-118}]}]}><View style={w.slotInner}><Text style={w.icon}>{x.icon}</Text><Text style={w.slotText}>{x.name}</Text></View></View>)}
     <View style={w.center}><Text style={w.centerIcon}>?</Text></View>
    </Animated.View>
   </View>
   {result?<View style={w.result}><Text style={w.resultSmall}>✨ MERAK ÇARKI</Text><Text style={w.resultTitle}>{result.icon} {result.name}</Text><Text style={w.resultText}>Birazdan bu konudan gerçekten ilginç bir bilgi geliyor.</Text></View>:<Text style={w.hint}>{spinning?"Merak çarkı dönüyor...":"Çarkı çevir; konu senin için seçilsin!"}</Text>}
   <Pressable disabled={spinning} onPress={spin} style={[w.button,spinning&&w.disabled]}><Text style={w.buttonText}>{spinning?"✨ Bilgi aranıyor...":"✨ MERAK ÇARKINI ÇEVİR"}</Text></Pressable>
   <Text style={w.note}>10.000+ bağımsız ilginç bilgi arasından seçilir. Kaynak bilgisi kartta gösterilir.</Text>
 </View>
}
const w=StyleSheet.create({
 screen:{flex:1,backgroundColor:"#0d0b1d",padding:20},top:{flexDirection:"row",alignItems:"center",gap:12,marginBottom:10},
 back:{width:44,height:44,borderRadius:14,backgroundColor:"#17132a",alignItems:"center",justifyContent:"center"},backText:{color:"#fff",fontSize:24},
 title:{color:"#fff",fontSize:26,fontWeight:"900"},sub:{color:"#aaa6c4",fontSize:12,marginTop:2},stage:{height:350,alignItems:"center",justifyContent:"center",position:"relative"},
 pointer:{position:"absolute",top:4,zIndex:5,backgroundColor:"#f7f4ff",borderRadius:12,paddingHorizontal:10,paddingVertical:5},pointerText:{color:"#7561d9",fontSize:25,fontWeight:"900"},
 wheel:{width:290,height:290,borderRadius:145,backgroundColor:"#7561d9",borderWidth:8,borderColor:"#c7b8ff",alignItems:"center",justifyContent:"center"},
 slot:{position:"absolute",width:88,height:88,left:101,top:101,alignItems:"center"},slotInner:{width:80,height:80,borderRadius:40,backgroundColor:"#221b40",borderWidth:1,borderColor:"#574b83",alignItems:"center",justifyContent:"center"},
 icon:{fontSize:20},slotText:{color:"#fff",fontSize:8,fontWeight:"900",marginTop:2,textAlign:"center"},center:{width:70,height:70,borderRadius:35,backgroundColor:"#f7f4ff",alignItems:"center",justifyContent:"center",borderWidth:5,borderColor:"#c7b8ff"},
 centerIcon:{color:"#6652c5",fontSize:30,fontWeight:"900"},hint:{color:"#aaa6c4",textAlign:"center",fontSize:14,marginBottom:15},result:{backgroundColor:"#221b40",borderWidth:1,borderColor:"#40356c",borderRadius:20,padding:14,alignItems:"center",marginBottom:14},
 resultSmall:{color:"#a99bea",fontSize:9,fontWeight:"900"},resultTitle:{color:"#fff",fontSize:24,fontWeight:"900",marginTop:3},resultText:{color:"#aaa6c4",fontSize:11,marginTop:4,textAlign:"center"},
 button:{backgroundColor:"#7561d9",borderRadius:16,paddingVertical:17,alignItems:"center"},disabled:{opacity:.65},buttonText:{color:"#fff",fontWeight:"900",fontSize:15},note:{color:"#6e6980",fontSize:10,lineHeight:16,textAlign:"center",marginTop:16}
});
