import { Users, Heart, Sparkles, Star } from 'lucide-react';

import team2 from '@/images/2.png';
import team3 from '@/images/3.png';
import team4 from '@/images/4.png';
import team5 from '@/images/5.png';
import team6 from '@/images/6.png';
import team7 from '@/images/7.png';
import team8 from '@/images/8.png';
import team9 from '@/images/9.png';
import team10 from '@/images/10.png';
import team11 from '@/images/11.png';
import team12 from '@/images/12.png';
import team13 from '@/images/13.png';
import team14 from '@/images/14.png';
import team15 from '@/images/15.png';
import team16 from '@/images/16.png';
import team17 from '@/images/17.png';
import team18 from '@/images/18.png';

const teamMembers = [
  { id: 1, image: team2, name: 'Zekeriya Can Erbil', delay: '0s' },
  { id: 2, image: team3, name: 'Tuba Yılmaz', delay: '0.05s' },
  { id: 3, image: team4, name: 'Nur Tunç', delay: '0.1s' },
  { id: 4, image: team5, name: 'Arda Türkmen', delay: '0.15s' },
  { id: 5, image: team6, name: 'Esra Yüksel', delay: '0.2s' },
  { id: 6, image: team7, name: 'Bengisu Köten', delay: '0.25s' },
  { id: 7, image: team8, name: 'Gülnisa Pancar', delay: '0.3s' },
  { id: 8, image: team9, name: 'Maşide Duman', delay: '0.35s' },
  { id: 9, image: team10, name: 'Ebrar Kurşun', delay: '0.4s' },
  { id: 10, image: team11, name: 'Şeyma Acar', delay: '0.45s' },
  { id: 11, image: team12, name: 'Esma Şahin', delay: '0.5s' },
  { id: 12, image: team13, name: 'Sude Eker', delay: '0.55s' },
  { id: 13, image: team14, name: 'Betül Zehra Bilgen', delay: '0.6s' },
  { id: 14, image: team15, name: 'Aysu Polatel', delay: '0.65s' },
  { id: 15, image: team16, name: 'Emirhan Akgün', delay: '0.7s' },
  { id: 16, image: team17, name: 'Miray Z. Kurban', delay: '0.75s' },
  { id: 17, image: team18, name: 'Tuğbanur Kaya', delay: '0.8s' },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-teal-950/30" />
        
        {/* Floating Orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-400/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Floating Particles */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-green-500 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-40 left-1/4 w-3 h-3 bg-emerald-500 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 right-1/3 w-5 h-5 bg-teal-500 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1.5s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-2xl animate-float">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Ekibimiz
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Yaşayan Tasarım Topluluğu'nun arkasındaki tutkulu ve yaratıcı ekip. 
              Birlikte doğayı keşfediyor, tasarlıyor ve paylaşıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 mb-4">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Birlikte Güçlüyüz</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Topluluğumuzun Yüzleri
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Her biri benzersiz yeteneklere sahip, doğa ve tasarım tutkunu ekip üyelerimiz
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group relative animate-fade-in-up flex flex-col items-center"
                style={{ animationDelay: member.delay }}
              >
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full opacity-0 group-hover:opacity-70 blur-xl transition-all duration-500" />

                {/* Image Container */}
                <div className="relative">
                  {/* Ring */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-spin-slow" style={{ animationDuration: '8s' }} />

                  {/* Image Wrapper */}
                  <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                      <Sparkles className="w-6 h-6 text-white animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Name Label */}
                <div className="mt-4 text-center">
                  <p className="font-semibold text-sm md:text-base text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                    {member.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Quote Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/10 to-teal-500/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <Star className="w-10 h-10 text-yellow-500 mx-auto mb-6 animate-pulse" />
            <blockquote className="text-xl md:text-2xl font-medium text-foreground/80 italic leading-relaxed">
              "Tek başına güçlü olmak güzeldir, ama birlikte olmak muhteşemdir. 
              Yaşayan Tasarım Topluluğu olarak, doğanın güzelliğini birlikte keşfediyoruz."
            </blockquote>
            <p className="mt-6 text-muted-foreground font-medium">
              — Yaşayan Tasarım Topluluğu Ekibi
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

