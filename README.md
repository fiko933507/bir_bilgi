# Bir Bilgi 🌌

Her açılışta yeni ve ilginç bir şey öğrenmek için tasarlanmış bilgi keşif uygulaması.

## Örnek sürüm

Bu ilk sürüm şunları içerir:

- Günün bilgisi
- Rastgele yeni bilgi
- Kategori filtreleri
- Bilgi arama
- Favorilere ekleme
- Okunmuş bilgileri takip etme
- Bilgi ilerleme göstergesi
- Yeni bilgiler için ölçeklenebilir JSON veri yapısı

## Çalıştırma

```bash
npm install
npx expo start
```

Expo Go ile QR kodu okutabilirsiniz.

## Veri yapısı

Bilgiler `src/data/facts.js` içinde tutuluyor. İleride bu yapı bir API/veritabanına taşınarak içerik havuzu sürekli büyütülebilir.

## Yol haritası

- [x] 1000+ doğrulanmış bilgi
- [ ] Günlük bildirim
- [ ] Kaynak gösterimi
- [ ] Bilgi detay ekranı
- [ ] Kullanıcının daha önce gördüğü bilgileri tekrar göstermeme
- [ ] Yapay zekâ destekli yeni bilgi keşfi
- [ ] Puan/seri sistemi
- [ ] Görselli bilgi kartları


## İkinci soru katmanı: Wikidata

Uygulama artık MMLU-TR katmanına ek olarak **Wikidata yapılandırılmış verilerinden üretilen bağımsız Türkçe sorular** için ikinci bir veri katmanına hazırdır. Üretici varsayılan olarak 17 kategoride kategori başına 600 soru hedefler (**10.200 soru**). Sorular kategori bazlı JSON dosyalarına ayrılır ve uygulama bunları gerektiğinde uzaktan yükler.

Wikidata'nın yapılandırılmış verileri CC0 kapsamında yeniden kullanılabilir; ayrıca uygulama içinde kaynak olarak Wikidata gösterilir. citeturn1search0turn1search1

Üretim: `npm run build:wikidata`

GitHub Actions ile manuel veya haftalık yenileme: `.github/workflows/build-wikidata-bank.yml`
