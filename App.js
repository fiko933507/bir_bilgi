import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
} from "react-native";
import { FACTS, CATEGORIES } from "./src/data/facts";

const pickRandom = (items, currentId) => {
  const pool = items.filter((item) => item.id !== currentId);
  return pool[Math.floor(Math.random() * pool.length)] || items[0];
};

export default function App() {
  const [current, setCurrent] = useState(FACTS[0]);
  const [category, setCategory] = useState("Tümü");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [seen, setSeen] = useState([FACTS[0].id]);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("tr-TR");
    return FACTS.filter((fact) => {
      const categoryOk = category === "Tümü" || fact.category === category;
      const searchOk =
        !q ||
        fact.title.toLocaleLowerCase("tr-TR").includes(q) ||
        fact.text.toLocaleLowerCase("tr-TR").includes(q) ||
        fact.category.toLocaleLowerCase("tr-TR").includes(q);
      return categoryOk && searchOk;
    });
  }, [category, search]);

  const nextFact = () => {
    const source = filtered.length ? filtered : FACTS;
    const next = pickRandom(source, current.id);
    setCurrent(next);
    setSeen((old) => (old.includes(next.id) ? old : [...old, next.id]));
  };

  const toggleFavorite = () => {
    setFavorites((old) =>
      old.includes(current.id)
        ? old.filter((id) => id !== current.id)
        : [...old, current.id]
    );
  };

  const isFavorite = favorites.includes(current.id);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>bir_bilgi</Text>
            <Text style={styles.subtitle}>Bugün ne öğreneceksin?</Text>
          </View>
          <View style={styles.counter}>
            <Text style={styles.counterNumber}>{seen.length}</Text>
            <Text style={styles.counterLabel}>keşfedildi</Text>
          </View>
        </View>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Bilgi ara..."
          placeholderTextColor="#8f8ba7"
          style={styles.search}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {["Tümü", ...CATEGORIES].map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[styles.chip, category === item && styles.chipActive]}
            >
              <Text style={[styles.chipText, category === item && styles.chipTextActive]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.badge}>✨ {current.category}</Text>
            <Pressable onPress={toggleFavorite} hitSlop={12}>
              <Text style={styles.heart}>{isFavorite ? "♥" : "♡"}</Text>
            </Pressable>
          </View>

          <Text style={styles.eyebrow}>BUNU BİLİYOR MUYDUN?</Text>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.fact}>{current.text}</Text>

          <View style={styles.sourceBox}>
            <Text style={styles.sourceLabel}>KAYNAK</Text>
            <Text style={styles.source}>{current.source}</Text>
          </View>
        </View>

        <Pressable onPress={nextFact} style={styles.button}>
          <Text style={styles.buttonText}>🎲 Yeni bir bilgi keşfet</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Bilgi evreni</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{FACTS.length}</Text>
            <Text style={styles.statText}>örnek bilgi</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{CATEGORIES.length}</Text>
            <Text style={styles.statText}>kategori</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>∞</Text>
            <Text style={styles.statText}>hedef</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Bu sadece başlangıç. Bilgi havuzu büyüdükçe uygulama gerçekten sınırsız bir keşif alanına dönüşecek.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0d0b1d" },
  container: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 22 },
  logo: { color: "#fff", fontSize: 30, fontWeight: "900", letterSpacing: -1 },
  subtitle: { color: "#aaa6c4", marginTop: 3, fontSize: 14 },
  counter: { backgroundColor: "#1b1730", borderRadius: 16, paddingHorizontal: 13, paddingVertical: 9, alignItems: "center" },
  counterNumber: { color: "#c7b8ff", fontSize: 20, fontWeight: "800" },
  counterLabel: { color: "#77728e", fontSize: 10 },
  search: { backgroundColor: "#17132a", color: "#fff", borderWidth: 1, borderColor: "#2b2644", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, marginBottom: 13 },
  categories: { marginBottom: 18 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, backgroundColor: "#17132a", marginRight: 8, borderWidth: 1, borderColor: "#28233f" },
  chipActive: { backgroundColor: "#7561d9", borderColor: "#7561d9" },
  chipText: { color: "#aaa6c4", fontSize: 12, fontWeight: "700" },
  chipTextActive: { color: "#fff" },
  card: { backgroundColor: "#f7f4ff", borderRadius: 28, padding: 22, minHeight: 360, marginBottom: 15 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  badge: { color: "#6652c5", fontWeight: "800", fontSize: 12 },
  heart: { color: "#6652c5", fontSize: 30 },
  eyebrow: { color: "#9b91b7", fontSize: 10, fontWeight: "900", letterSpacing: 1.5, marginTop: 42 },
  title: { color: "#19142b", fontSize: 28, lineHeight: 34, fontWeight: "900", marginTop: 9 },
  fact: { color: "#48415d", fontSize: 17, lineHeight: 26, marginTop: 16 },
  sourceBox: { borderTopWidth: 1, borderTopColor: "#e4dff0", marginTop: 26, paddingTop: 14 },
  sourceLabel: { color: "#9b91b7", fontSize: 9, fontWeight: "900" },
  source: { color: "#6e6680", fontSize: 11, marginTop: 3 },
  button: { backgroundColor: "#7561d9", borderRadius: 16, paddingVertical: 16, alignItems: "center", marginBottom: 28 },
  buttonText: { color: "#fff", fontWeight: "900", fontSize: 15 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "900", marginBottom: 12 },
  stats: { flexDirection: "row", gap: 10 },
  stat: { flex: 1, backgroundColor: "#17132a", borderRadius: 17, padding: 15 },
  statNumber: { color: "#c7b8ff", fontSize: 22, fontWeight: "900" },
  statText: { color: "#77728e", fontSize: 11, marginTop: 4 },
  footer: { color: "#6e6980", textAlign: "center", fontSize: 11, lineHeight: 17, marginTop: 25 }
});
