import { Event } from '@/types';

export const events: Event[] = [
  {
    id: '1',
    title: 'Bitki Tanıma Yürüyüşü',
    description: 'Kampüs alanında doğal olarak yetişen bitkileri tanıma ve özelliklerini öğrenme yürüyüşü.',
    date: '2025-01-25',
    time: '14:00',
    location: 'Mühendislik Fakültesi Önü',
    capacity: 20,
    registered: 12,
    category: 'walk',
    requirements: ['Rahat ayakkabı', 'Su şişesi', 'Not defteri'],
    image: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg',
    instructor: 'Dr. Ayşe Botanik',
    duration: '2 saat',
    difficulty: 'beginner'
  },
  {
    id: '2',
    title: 'Bitki Ekimi Atölyesi',
    description: 'Sera ortamında lavanta, adaçayı ve diğer aromatik bitkilerin ekimi ve bakımı hakkında uygulamalı eğitim.',
    date: '2025-09-05',
    time: '11:00',
    location: 'Biyoloji Serası',
    capacity: 15,
    registered: 8,
    category: 'workshop',
    requirements: ['İş eldiveni', 'Önlük', 'Su şişesi'],
    image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg',
    instructor: 'Prof. Mehmet Yeşil',
    duration: '3 saat',
    difficulty: 'intermediate'
  },
  {
    id: '3',
    title: 'Aromatik Bitkiler Semineri',
    description: 'Lavanta, adaçayı ve diğer aromatik bitkilerin tıbbi ve kullanım alanları hakkında teorik bilgi semineri.',
    date: '2025-02-15',
    time: '10:00',
    location: 'Konferans Salonu',
    capacity: 50,
    registered: 35,
    category: 'seminar',
    requirements: ['Not defteri', 'Kalem'],
    image: 'https://images.pexels.com/photos/6629401/pexels-photo-6629401.jpeg',
    instructor: 'Dr. Fatma Aroma',
    duration: '1.5 saat',
    difficulty: 'beginner'
  },
  {
    id: '4',
    title: 'Süs Ağaçları Dikimi',
    description: 'Kampüs çevresinde süs akçaağacı ve diğer süs ağaçlarının dikimi ve peyzaj düzenlemesi çalışması.',
    date: '2025-03-20',
    time: '09:00',
    location: 'Merkez Kampüs',
    capacity: 25,
    registered: 18,
    category: 'planting',
    requirements: ['İş eldiveni', 'Kürek', 'Su şişesi', 'Şapka'],
    image: 'https://images.pexels.com/photos/4503268/pexels-photo-4503268.jpeg',
    instructor: 'Peyzaj Mimar Ali Doğa',
    duration: '4 saat',
    difficulty: 'intermediate'
  }
];