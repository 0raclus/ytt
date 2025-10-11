import { Plant } from '@/types';

export const plants: Plant[] = [
  {
    id: 'lavanta',
    name: 'Lavanta',
    scientificName: 'Lavandula',
    description: 'Lavanta, güçlü kokusu ve mor çiçekleriyle tanınan, çok yıllık aromatik bir bitkidir. Akdeniz ikliminde yaygın olarak yetişir.',
    characteristics: [
      'Mor renkli çiçek başakları',
      'Güçlü ve hoş koku',
      'Gri-yeşil yapraklar',
      'Çok yıllık bitki',
      'Kuraklığa dayanıklı'
    ],
    habitat: 'Akdeniz iklimi, güneşli ve kurak alanlar, iyi drene edilmiş topraklar',
    uses: [
      'Aromaterapi',
      'Kozmetik ürünlerinde',
      'Çay olarak tüketim',
      'Doğal böcek kovucu',
      'Stres azaltıcı'
    ],
    careInstructions: [
      'Günde en az 6 saat güneş ışığı',
      'Az sulama, toprak kuruyunca sulama',
      'İyi drene edilmiş toprak',
      'Yılda bir kez budama',
      'Soğuk havalarda korunması gerekebilir'
    ],
    image: 'https://images.pexels.com/photos/2253844/pexels-photo-2253844.jpeg',
    seasonalInfo: {
      blooming: 'Haziran - Ağustos',
      planting: 'İlkbahar veya sonbahar',
      harvesting: 'Çiçekler tam açmadan önce'
    }
  },
  {
    id: 'adacayi',
    name: 'Adaçayı',
    scientificName: 'Salvia officinalis',
    description: 'Adaçayı, tıbbi özelliklerinden dolayı binlerce yıldır kullanılan aromatik bir bitkidir. Gümüşi yaprakları ve mavi çiçekleri vardır.',
    characteristics: [
      'Gümüşi-yeşil yapraklar',
      'Mavi-mor çiçekler',
      'Güçlü aromatik koku',
      'Çok yıllık bitki',
      'Soğuğa dayanıklı'
    ],
    habitat: 'Akdeniz bölgesi, kireçli topraklar, güneşli alanlar',
    uses: [
      'Tıbbi çay olarak',
      'Mutfakta baharat',
      'Antiseptik özellik',
      'Sindirim yardımcısı',
      'Bellek güçlendirici'
    ],
    careInstructions: [
      'Tam güneş veya yarı gölge',
      'Orta seviye sulama',
      'İyi drene edilmiş toprak',
      'Düzenli budama',
      'Kış aylarında mulçlama'
    ],
    image: 'https://images.pexels.com/photos/4198951/pexels-photo-4198951.jpeg',
    seasonalInfo: {
      blooming: 'Mayıs - Eylül',
      planting: 'İlkbahar',
      harvesting: 'Yaz ayları'
    }
  },
  {
    id: 'sus-akcaagaci',
    name: 'Süs Akçaağacı',
    scientificName: 'Acer campestre',
    description: 'Süs akçaağacı, güzel sonbahar renkleri ve kompakt yapısıyla peyzaj tasarımında sıkça kullanılan süs ağacıdır.',
    characteristics: [
      'Küçük, 3-5 loplu yapraklar',
      'Sarı-turuncu sonbahar renkleri',
      'Kompakt, yuvarlak taç',
      'Orta boylu ağaç (8-15m)',
      'Kentsel koşullara uygun'
    ],
    habitat: 'Avrupa, karışık ormanlar, park ve bahçeler',
    uses: [
      'Peyzaj tasarımı',
      'Park ve bahçe süslemesi',
      'Gölge ağacı',
      'Çevre düzenlemesi',
      'Doğal yaşam alanı'
    ],
    careInstructions: [
      'Tam güneş veya yarı gölge',
      'Düzenli sulama',
      'Zengin, nemli toprak',
      'İlkbahar budaması',
      'Soğuğa dayanıklı'
    ],
    image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg',
    seasonalInfo: {
      blooming: 'Nisan - Mayıs',
      planting: 'Sonbahar veya erken ilkbahar',
      harvesting: 'Tohumlar: Sonbahar'
    }
  }
];