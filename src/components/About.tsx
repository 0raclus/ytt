import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Info, 
  Target, 
  Users, 
  Award, 
  Code, 
  Lightbulb, 
  Globe, 
  Heart,
  Mail,
  Github,
  Linkedin,
  ExternalLink
} from 'lucide-react';

export function About() {
  const teamMembers = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Proje Lideri & Full Stack Developer',
      expertise: ['React', 'Node.js', 'TypeScript', 'UI/UX'],
      avatar: '🧑‍💻',
      email: 'ahmet@ytt.dev',
      linkedin: 'linkedin.com/in/ahmetyilmaz'
    },
    {
      name: 'Ayşe Demir',
      role: 'Frontend Developer & Designer',
      expertise: ['React', 'Tailwind CSS', 'Figma', 'Animation'],
      avatar: '👩‍🎨',
      email: 'ayse@ytt.dev',
      linkedin: 'linkedin.com/in/aysedemir'
    },
    {
      name: 'Mehmet Kara',
      role: 'Backend Developer',
      expertise: ['Node.js', 'PostgreSQL', 'API Design', 'DevOps'],
      avatar: '👨‍⚙️',
      email: 'mehmet@ytt.dev',
      linkedin: 'linkedin.com/in/mehmetkara'
    }
  ];

  const technologies = [
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'Vite', category: 'Build Tool' },
    { name: 'Lucide Icons', category: 'Icons' },
    { name: 'Shadcn/ui', category: 'Components' }
  ];

  const features = [
    {
      icon: Users,
      title: 'Kullanıcı Dostu Arayüz',
      description: 'Modern ve sezgisel tasarım ile kolay kullanım'
    },
    {
      icon: Lightbulb,
      title: 'Yenilikçi Çözümler',
      description: 'Etkinlik yönetiminde yeni yaklaşımlar'
    },
    {
      icon: Globe,
      title: 'Responsive Tasarım',
      description: 'Tüm cihazlarda mükemmel görünüm'
    },
    {
      icon: Heart,
      title: 'Doğa Dostu',
      description: 'Çevre bilinci ile geliştirilmiş platform'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Info className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">YTT Hakkında</h1>
            <p className="text-lg text-muted-foreground">
              Yaşayan Tasarım Topluluğu - Doğa ve teknoloji buluşuyor
            </p>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-primary" />
            <span>Proje Vizyonu</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">
            YTT, doğa severler ve teknoloji meraklıları için geliştirilmiş modern bir etkinlik yönetim platformudur. 
            Amacımız, çevre bilinci yüksek etkinlikleri organize etmek ve katılımcılar arasında sürdürülebilir 
            yaşam kültürünü yaygınlaştırmaktır.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Misyonumuz</h3>
              <p className="text-sm text-muted-foreground">
                Teknoloji ile doğayı harmanlayarak, insanları bir araya getiren, 
                öğrenmeyi ve paylaşmayı destekleyen etkinliklerin düzenlenmesini kolaylaştırmak.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Vizyonumuz</h3>
              <p className="text-sm text-muted-foreground">
                Çevre bilinci yüksek, teknoloji okuryazarı ve sürdürülebilir yaşam 
                tarzını benimseyen bir toplumun oluşmasına katkıda bulunmak.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-primary" />
            <span>Platform Özellikleri</span>
          </CardTitle>
          <CardDescription>
            YTT platformunun sunduğu temel özellikler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center space-y-3">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-primary" />
            <span>Geliştirici Ekibi</span>
          </CardTitle>
          <CardDescription>
            YTT'yi hayata geçiren yetenekli ekibimiz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.name} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="text-4xl">{member.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                      <Linkedin className="h-3 w-3" />
                      <span>{member.linkedin}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technologies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-primary" />
            <span>Kullanılan Teknolojiler</span>
          </CardTitle>
          <CardDescription>
            Projenin geliştirilmesinde kullanılan modern teknolojiler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {technologies.map((tech) => (
              <div key={tech.name} className="text-center space-y-2">
                <div className="p-3 bg-secondary rounded-lg">
                  <Code className="h-6 w-6 mx-auto text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech.category}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact & Links */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200">İletişim & Bağlantılar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>İletişim</span>
              </h3>
              <div className="space-y-2 text-sm">
                <p>📧 E-posta: info@ytt.dev</p>
                <p>🌐 Web: www.ytt.dev</p>
                <p>📱 Sosyal Medya: @ytt_dev</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center space-x-2">
                <Github className="h-4 w-4" />
                <span>Açık Kaynak</span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Github className="h-4 w-4" />
                  <span>github.com/ytt-team</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
                <p className="text-muted-foreground">
                  Projemiz açık kaynak olarak geliştirilmekte, 
                  katkıda bulunmak için GitHub'dan inceleyebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}