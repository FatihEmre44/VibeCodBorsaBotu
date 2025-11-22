#  BorsaBot - Borsa İstanbul & Kripto Takip Sistemi
Bu proje, Node.js kullanılarak geliştirilmiş, Borsa İstanbul (BIST), Döviz, Altın ve Kripto para piyasalarını **gerçek zamanlı** takip eden bir bottur.

Belirlenen sembollerde ani fiyat değişimleri (varsayılan %1) yaşandığında e-posta yoluyla anlık bildirim gönderir. Ayrıca sunucu kapandığında veya hata aldığında yöneticiyi bilgilendirir.

## Özellikler

* **Çoklu Takip:** Hisse senetleri (THYAO.IS), Döviz (USDTRY=X), Emtia (GC=F) ve Kripto (BTC-USD) aynı anda takip edilebilir.
* **Akıllı Alarm Sistemi:** Fiyat değişimi belirlenen eşiği (Örn: %1) geçerse otomatik e-posta atar.
* **Spam Koruması:** Aynı hisse için sürekli mail atmaz, her hisse için 1 saatlik (ayarlanabilir) bekleme süresi vardır.
* **Renkli Konsol Arayüzü:** Yükselişleri yeşil, düşüşleri kırmızı ile gösteren okunabilir CLI ekranı.
* **Sistem Durum Bildirimleri:** Bot manuel olarak durdurulduğunda veya hata alıp çöktüğünde otomatik "Sistem Durdu" maili atar.
* **Yahoo Finance API:** Güvenilir ve ücretsiz veri kaynağı kullanır.

## Kurulum

Projeyi bilgisayarınıza indirin ve gerekli paketleri yükleyin.

```bash
# Projeyi klonlayın (veya indirin)
git clone [https://github.com/kullaniciadi/borsa-botu.git](https://github.com/kullaniciadi/borsa-botu.git)

# Proje dizinine girin
cd borsa-botu

# Gerekli paketleri yükleyin
npm install
