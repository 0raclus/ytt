import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Bell, Shield, Calendar, Heart, Settings, Save, Award, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';

export function UserProfile() {
  const { getUserRegistrations, events } = useEvents();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { toast } = useToast();
  
  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Giriş Gerekli</h3>
          <p className="text-muted-foreground mb-4">
            Profilinizi görmek için giriş yapmalısınız.
          </p>
        </CardContent>
      </Card>
    );
  }

  const registeredEventIds = getUserRegistrations();
  const registeredEvents = events.filter(event => registeredEventIds.includes(event.id));
  
  const [profile, setProfile] = useState({
    name: user?.full_name || 'Kullanıcı',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    level: user?.student_level || ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reminderTime: 1,
    newsletter: true,
    smsNotifications: false
  });

  const handleSaveProfile = async () => {
    try {
      const result = await updateProfile(profile);
      if (result.success) {
        toast({
          title: "Profil Güncellendi!",
          description: "Bilgileriniz başarıyla kaydedildi.",
        });
      } else {
        toast({
          title: "Hata",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Profil güncelleme işlemi başarısız oldu.",
        variant: "destructive"
      });
    }
  };

  const handleSavePreferences = () => {
    toast({
      title: "Tercihler Kaydedildi!",
      description: "Bildirim ayarlarınız güncellendi.",
    });
  };

  const upcomingEvents = registeredEvents.filter(e => new Date(e.date) >= new Date());
  const completedEvents = registeredEvents.filter(e => new Date(e.date) < new Date());

  const getCategoryLabel = (category: string) => {
    const labels = {
      workshop: 'Atölye',
      walk: 'Yürüyüş',
      seminar: 'Seminer',
      planting: 'Dikim'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      workshop: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      walk: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      seminar: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      planting: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
          <p className="text-muted-foreground">
            Kişisel bilgilerinizi ve etkinlik tercihlerinizi yönetin.
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Etkinliklerim</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Ayarlar</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Kişisel Bilgiler</span>
                </CardTitle>
                <CardDescription>
                  Profil bilgilerinizi güncelleyin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Bölüm</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    onChange={(e) => setProfile({...profile, department: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level">Seviye</Label>
                  <Input
                    id="level"
                    value={profile.level}
                    onChange={(e) => setProfile({...profile, level: e.target.value})}
                  />
                </div>

                <Separator />
                
                <Button onClick={handleSaveProfile} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Profili Kaydet
                </Button>
              </CardContent>
            </Card>

            {/* Profile Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>İstatistiklerim</span>
                </CardTitle>
                <CardDescription>
                  Etkinlik katılım geçmişiniz.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-primary">{upcomingEvents.length}</p>
                    <p className="text-sm text-muted-foreground">Yaklaşan Etkinlik</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-success">{completedEvents.length}</p>
                    <p className="text-sm text-muted-foreground">Tamamlanan</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Katılım Kategorileri</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Atölyeler</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Yürüyüşler</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Seminerler</span>
                      <span className="font-medium">1</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="text-center space-y-2">
                  <Award className="h-12 w-12 text-nature mx-auto" />
                  <h4 className="font-semibold">Doğa Sever</h4>
                  <p className="text-xs text-muted-foreground">3+ etkinlik tamamladınız!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Yaklaşan Etkinlikler ({upcomingEvents.length})</span>
              </CardTitle>
              <CardDescription>
                Kayıt olduğunuz yaklaşan etkinlikler.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg transition-all duration-200 hover:bg-accent/50"
                  >
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getCategoryColor(event.category)}>
                        {getCategoryLabel(event.category)}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Detay
                      </Button>
                    </div>
                  </div>
                ))}
                
                {upcomingEvents.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Henüz kayıtlı etkinlik bulunmuyor.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Completed Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-success" />
                <span>Tamamlanan Etkinlikler ({completedEvents.length})</span>
              </CardTitle>
              <CardDescription>
                Geçmişte katıldığınız etkinlikler.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg opacity-75"
                  >
                    <div className="flex items-center space-x-4">
                      <Award className="h-8 w-8 text-success" />
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className={getCategoryColor(event.category)}>
                        {getCategoryLabel(event.category)}
                      </Badge>
                      <Badge variant="secondary">Tamamlandı</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Bildirim Ayarları</span>
              </CardTitle>
              <CardDescription>
                Hangi bildirim türlerini almak istediğinizi seçin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">E-posta Bildirimleri</Label>
                  <p className="text-xs text-muted-foreground">
                    Etkinlik hatırlatmaları ve güncellemeler
                  </p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => 
                    setPreferences({...preferences, emailNotifications: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Push Bildirimleri</Label>
                  <p className="text-xs text-muted-foreground">
                    Tarayıcı bildirimleri
                  </p>
                </div>
                <Switch
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) => 
                    setPreferences({...preferences, pushNotifications: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">SMS Bildirimleri</Label>
                  <p className="text-xs text-muted-foreground">
                    Önemli etkinlik bilgileri
                  </p>
                </div>
                <Switch
                  checked={preferences.smsNotifications}
                  onCheckedChange={(checked) => 
                    setPreferences({...preferences, smsNotifications: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Newsletter</Label>
                  <p className="text-xs text-muted-foreground">
                    Aylık bitki ve etkinlik bülteni
                  </p>
                </div>
                <Switch
                  checked={preferences.newsletter}
                  onCheckedChange={(checked) => 
                    setPreferences({...preferences, newsletter: checked})
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Etkinlik Hatırlatma Zamanı</Label>
                <Select 
                  value={preferences.reminderTime.toString()} 
                  onValueChange={(value) => 
                    setPreferences({...preferences, reminderTime: parseInt(value)})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 saat önce</SelectItem>
                    <SelectItem value="2">2 saat önce</SelectItem>
                    <SelectItem value="24">1 gün önce</SelectItem>
                    <SelectItem value="48">2 gün önce</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSavePreferences} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Tercihleri Kaydet
              </Button>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Şifre Değiştir</span>
              </CardTitle>
              <CardDescription>
                Hesap güvenliğiniz için güçlü bir şifre kullanın.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mevcut Şifre</Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Yeni Şifre</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Yeni Şifre Tekrar</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>

              <Button onClick={handleChangePassword} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Şifreyi Değiştir
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Gizlilik ve Güvenlik</span>
              </CardTitle>
              <CardDescription>
                Hesap güvenliği ve gizlilik ayarları.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Şifre Değiştir
              </Button>
              
              <Button variant="outline" className="w-full">
                Hesap Verilerini İndir
              </Button>
              
              <Separator />
              
              <Button variant="destructive" className="w-full">
                Hesabı Deaktive Et
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}