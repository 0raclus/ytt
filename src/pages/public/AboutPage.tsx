import { Target, Lightbulb, Sparkles, Heart, Users, Leaf, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950/30 dark:to-gray-900" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-green-400/30 to-emerald-500/30 dark:from-green-600/20 dark:to-emerald-700/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 dark:from-emerald-600/20 dark:to-teal-700/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center p-4 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl backdrop-blur-md border border-emerald-200/50 dark:border-emerald-700/50">
              <Sparkles className="h-10 w-10 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            </div>

            <p className="text-lg md:text-xl text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
              Hakkımızda
            </p>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent">
              Biz Kimiz?
            </h1>

            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-full" />

            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-light">
              Yaşayan Tasarım Topluluğu (YTT); doğa, tasarım ve teknoloji arasında köprü kuran yenilikçi bir topluluktur.
              Çevreye duyarlı yaklaşımımızla, sürdürülebilir yaşam kültürünü yaygınlaştırmayı ve tasarımın dönüştürücü gücünü görünür kılmayı amaçlıyoruz.
            </p>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed italic">
              Bizim için her proje sadece bir tasarım değil, aynı zamanda doğaya ve geleceğe bırakılan bir izdir.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Mission Card */}
            <Card className="group relative h-full border-2 border-green-200/60 dark:border-green-700/60 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 group-hover:h-2 transition-all duration-500" />
              <CardHeader className="space-y-6 pt-8">
                <div className="flex items-center space-x-4">
                  <div className="relative p-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                      Misyonumuz
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    Doğal değerlerle modern tasarımı bir araya getirerek üyelerimizin öğrenmesine, üretmesine ve paylaşmasına olanak sağlıyoruz.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    Ortak projeler ve yaratıcı iş birlikleriyle çevresel duyarlılığı artıran, geleceğe yönelik yenilikçi çözümler geliştirmeyi hedefliyoruz.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-4">
                  <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700 px-4 py-2">
                    <Heart className="h-4 w-4 mr-2" /> Öğrenmek
                  </Badge>
                  <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700 px-4 py-2">
                    <Users className="h-4 w-4 mr-2" /> Üretmek
                  </Badge>
                  <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700 px-4 py-2">
                    <Leaf className="h-4 w-4 mr-2" /> Paylaşmak
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Vision Card */}
            <Card className="group relative h-full border-2 border-emerald-200/60 dark:border-emerald-700/60 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 group-hover:h-2 transition-all duration-500" />
              <CardHeader className="space-y-6 pt-8">
                <div className="flex items-center space-x-4">
                  <div className="relative p-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <Lightbulb className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                      Vizyonumuz
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    Yaratıcı ve çevreye duyarlı bireylerden oluşan, sürdürülebilir tasarımı yaşamın merkezine alan bir topluluk inşa etmek.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    Doğal ve kentsel yaşam alanlarını daha yaşanabilir hale getirmek için farkındalık yaratırken, topluma ilham veren bir dönüşümün parçası olmak.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-4">
                  <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700 px-4 py-2">
                    <Sparkles className="h-4 w-4 mr-2" /> Yaratıcılık
                  </Badge>
                  <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700 px-4 py-2">
                    <Leaf className="h-4 w-4 mr-2" /> Sürdürülebilirlik
                  </Badge>
                  <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700 px-4 py-2">
                    <Star className="h-4 w-4 mr-2" /> İlham
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quote */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 rounded-full shadow-lg border border-emerald-200 dark:border-emerald-800">
              <Star className="h-6 w-6 text-yellow-500" />
              <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                Doğaya bırakılan her iz, geleceğe atılan bir adımdır
              </p>
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

