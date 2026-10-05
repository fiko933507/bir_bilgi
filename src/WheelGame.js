import React,{useRef,useState} from "react";
import {View,Text,Pressable,StyleSheet,Animated,Easing} from "react-native";

const SEGMENTS=[
 {name:"Tarih",icon:"🏛️"},{name:"Bilim",icon:"🔬"},{name:"Uzay",icon:"🌌"},{name:"Hayvanlar",icon:"🐾"},
 {name:"Dünya",icon:"🌍"},{name:"Teknoloji",icon:"💻"},{name:"İnsan",icon:"🧠"},{name:"Sürpriz",icon:"🎲"},{name:"Efsane",icon:"🏆",legendary:true}
];

export default function WheelGame({onSelected,onBack}){
 const rotation=useRef(new Animated.Value(0)).current;
 const [spinning,setSpinning]=useState(false),[result,setResult]=useState(null);
 const spin=()=>{
  if(spinning)return;
  const index=Math.floor(Math.random()*SEGMENTS.length),segment=360/SEGMENTS.length;
  const target=360*6+(360-(index*segment+segment/2));
  setSpinning(true);setResult(null);
  Animated.timing(rotation,{toValue:target,duration:4200,easing:Easing.out(Easing.cubic),useNativeDriver:true}).start(({finished})=>{
   if(finished){setResult(SEGMENTS[index]);setSpinning(false);setTimeout(()=>onSelected(SEGMENTS[index].name,!!SEGMENTS[index].legendary),650);}
  });
 };
 const spinStyle={transform:[{rotate:rotation.interpolate({inputRange:[0,360],outputRange:["0deg","360deg"]})}]};
 return <View style={w.screen}>
  <View style={w.top}><Pressable onPress={onBack} style={w.back}><Text style={w.backText}>←</Text></Pressable><View><Text style={w.title}>Bilgi Çarkı</Text><Text style={w.sub}>Şansına hangi kategori gelecek?</Text></View></View>
  <View style={w.stage}>
   <View style={w.pointer}><Text style={w.pointerText}>▼</Text></View>
   <Animated.View style={[w.wheel,spinStyle]}>
    {SEGMENTS.map((x,i)=><View key={x.name} style={[w.slot,{transform:[{rotate:`${i*45}deg`},{translateY:-118}]}]}><View style={w.slotInner}><Text style={w.icon}>{x.icon}</Text><Text style={w.slotText}>{x.name}</Text></View></View>)}
    <View style={w.center}><Text style={w.centerIcon}>?</Text></View>
   </Animated.View>
  </View>
  {result?<View style={w.result}><Text style={w.resultSmall}>{result.legendary?"🏆 EFSANEVİ DİLİM!":"ÇARK DURDU!"}</Text><Text style={w.resultTitle}>{result.icon} {result.name}</Text><Text style={w.resultText}>{result.legendary?"Bu turda +100 XP değerinde zor bir soru geliyor!":result.name==="Sürpriz"?"Her kategoriden sürpriz bir soru hazırlanıyor.":"Bu kategoriden şansına özel bir soru geliyor."}</Text></View>:<Text style={w.hint}>{spinning?"Dönüyor...":"Çarkı çevir ve şansını dene!"}</Text>}
  <Pressable disabled={spinning} onPress={spin} style={[w.button,spinning&&w.disabled]}><Text style={w.buttonText}>{spinning?"🎡 Çark dönüyor...":"🎡 ÇARKI ÇEVİR"}</Text></Pressable>
  <Text style={w.note}>Her dönüşte soru havuzundan farklı bir soru seçilebilir. Bazı sorular görsel veya sesli olabilir.</Text>
 </View>
}
const w=StyleSheet.create({
 screen:{flex:1,backgroundColor:"#0d0b1d",padding:20},top:{flexDirection:"row",alignItems:"center",gap:12,marginBottom:10},
 back:{width:44,height:44,borderRadius:14,backgroundColor:"#17132a",alignItems:"center",justifyContent:"center"},backText:{color:"#fff",fontSize:24},
 title:{color:"#fff",fontSize:26,fontWeight:"900"},sub:{color:"#aaa6c4",fontSize:12,marginTop:2},stage:{height:360,alignItems:"center",justifyContent:"center",position:"relative"},
 pointer:{position:"absolute",top:5,zIndex:5,backgroundColor:"#f7f4ff",borderRadius:12,paddingHorizontal:10,paddingVertical:5},pointerText:{color:"#7561d9",fontSize:25,fontWeight:"900"},
 wheel:{width:290,height:290,borderRadius:145,backgroundColor:"#7561d9",borderWidth:8,borderColor:"#c7b8ff",alignItems:"center",justifyContent:"center"},
 slot:{position:"absolute",width:104,height:104,left:89,top:89,alignItems:"center"},slotInner:{width:92,height:92,borderRadius:46,backgroundColor:"#221b40",borderWidth:1,borderColor:"#574b83",alignItems:"center",justifyContent:"center"},
 icon:{fontSize:24},slotText:{color:"#fff",fontSize:10,fontWeight:"900",marginTop:4},center:{width:72,height:72,borderRadius:36,backgroundColor:"#f7f4ff",alignItems:"center",justifyContent:"center",borderWidth:5,borderColor:"#c7b8ff"},
 centerIcon:{color:"#6652c5",fontSize:30,fontWeight:"900"},hint:{color:"#aaa6c4",textAlign:"center",fontSize:14,marginBottom:15},result:{backgroundColor:"#221b40",borderWidth:1,borderColor:"#40356c",borderRadius:20,padding:14,alignItems:"center",marginBottom:14},
 resultSmall:{color:"#a99bea",fontSize:9,fontWeight:"900"},resultTitle:{color:"#fff",fontSize:24,fontWeight:"900",marginTop:3},resultText:{color:"#aaa6c4",fontSize:11,marginTop:4,textAlign:"center"},
 button:{backgroundColor:"#7561d9",borderRadius:16,paddingVertical:17,alignItems:"center"},disabled:{opacity:.65},buttonText:{color:"#fff",fontWeight:"900",fontSize:15},legendary:{color:"#ffd86b",fontSize:11,fontWeight:"900"},note:{color:"#6e6980",fontSize:10,lineHeight:16,textAlign:"center",marginTop:16}
});