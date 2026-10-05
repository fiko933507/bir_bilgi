# Soru bankası üreticileri

## Wikidata katmanı

`node scripts/build-wikidata-question-bank.mjs`

Varsayılan hedef 17 kategori x 600 = 10.200 bağımsız sorudur. Hedefi değiştirmek için:

`WIKIDATA_TARGET_PER_CATEGORY=700 node scripts/build-wikidata-question-bank.mjs`

Üretilen kategori JSON'ları `src/data/wikidata/` altında tutulur.

Wikidata'nın yapılandırılmış verileri CC0'dur. Üretici, Wikimedia servislerinin User-Agent ve rate-limit kurallarına uyar; yüksek hacimli kullanım için dump/uygun Wikimedia erişim kanalları tercih edilmelidir.
