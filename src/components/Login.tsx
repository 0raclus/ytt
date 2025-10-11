import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Loader as Loader2, Shield, Eye, EyeOff, Lock, User, Mail, Phone, Building, GraduationCap, CircleAlert as AlertCircle, CircleCheck as CheckCircle, ArrowLeft, Github, Chrome } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    department: '',
    student_level: '',
    terms: false
  });

  // Password reset state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!loginData.email || !loginData.password) {
      setError('Lütfen tüm alanları doldurun.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(loginData.email, loginData.password);
      
      if (!result.success) {
        setError(result.message || 'Giriş başarısız.');
      } else {
        setSuccess('Giriş başarılı! Yönlendiriliyorsunuz...');
        if (rememberMe) {
          localStorage.setItem('ytt_remember_email', loginData.email);
        }
      }
    } catch (error) {
      setError('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validation
    if (!registerData.email || !registerData.password || !registerData.full_name) {
      setError('Lütfen zorunlu alanları doldurun.');
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      setIsLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      setIsLoading(false);
      return;
    }

    if (!registerData.terms) {
      setError('Kullanım şartlarını kabul etmelisiniz.');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setError('Geçerli bir e-posta adresi girin.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await register({
        email: registerData.email,
        password: registerData.password,
        full_name: registerData.full_name,
        phone: registerData.phone,
        department: registerData.department,
        student_level: registerData.student_level
      });
      
      if (result.success) {
        setSuccess(result.message || 'Hesabınız başarıyla oluşturuldu! E-posta adresinizi doğrulamayı unutmayın.');
        setActiveTab('login');
        setRegisterData({
          email: '',
          password: '',
          confirmPassword: '',
          full_name: '',
          phone: '',
          department: '',
          student_level: '',
          terms: false
        });
      } else {
        setError(result.message || 'Kayıt sırasında bir hata oluştu.');
      }
    } catch (error) {
      setError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!resetEmail) {
      setError('E-posta adresi gereklidir.');
      setIsLoading(false);
      return;
    }

    // Simulate password reset
    setTimeout(() => {
      setResetSent(true);
      setIsLoading(false);
      setSuccess('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    }, 2000);
  };

  // Load remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('ytt_remember_email');
    if (rememberedEmail) {
      setLoginData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const departments = [
    'Bilgisayar Mühendisliği',
    'Elektrik-Elektronik Mühendisliği',
    'Makine Mühendisliği',
    'İnşaat Mühendisliği',
    'Biyoloji Bölümü',
    'Kimya Bölümü',
    'Matematik Bölümü',
    'Fizik Bölümü',
    'Diğer'
  ];

  const studentLevels = [
    'Lisans 1. Sınıf',
    'Lisans 2. Sınıf', 
    'Lisans 3. Sınıf',
    'Lisans 4. Sınıf',
    'Yüksek Lisans',
    'Doktora',
    'Akademik Personel',
    'İdari Personel'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Shield className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">YTT Platform</h1>
          <p className="text-muted-foreground">
            Yenilikçi Teknoloji Takımı'na hoş geldiniz
          </p>
        </div>

        {/* Main Auth Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {activeTab === 'login' ? 'Giriş Yap' : activeTab === 'register' ? 'Hesap Oluştur' : 'Şifre Sıfırla'}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === 'login' 
                ? 'Hesabınızla sisteme giriş yapın' 
                : activeTab === 'register' 
                ? 'Yeni hesap oluşturun ve etkinliklere katılmaya başlayın'
                : 'E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
              </TabsList>

              {/* Error/Success Messages */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta Adresi</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@universite.edu.tr"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="pl-10"
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Şifre</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Şifrenizi girin"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="pl-10 pr-10"
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                        disabled={isLoading}
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Beni hatırla
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={() => setActiveTab('reset')}
                      disabled={isLoading}
                      className="px-0"
                    >
                      Şifremi unuttum
                    </Button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Giriş yapılıyor...
                      </>
                    ) : (
                      'Giriş Yap'
                    )}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      veya
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" disabled={isLoading}>
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                  <Button variant="outline" disabled={isLoading}>
                    <Chrome className="h-4 w-4 mr-2" />
                    Google
                  </Button>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Ad Soyad *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="full_name"
                          type="text"
                          placeholder="Adınız Soyadınız"
                          value={registerData.full_name}
                          onChange={(e) => setRegisterData({...registerData, full_name: e.target.value})}
                          className="pl-10"
                          disabled={isLoading}
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg_email">E-posta *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reg_email"
                          type="email"
                          placeholder="ornek@universite.edu.tr"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                          className="pl-10"
                          disabled={isLoading}
                          autoComplete="email"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+90 555 123 4567"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                        className="pl-10"
                        disabled={isLoading}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Bölüm</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <select
                          id="department"
                          value={registerData.department}
                          onChange={(e) => setRegisterData({...registerData, department: e.target.value})}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isLoading}
                        >
                          <option value="">Seçiniz</option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student_level">Seviye</Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <select
                          id="student_level"
                          value={registerData.student_level}
                          onChange={(e) => setRegisterData({...registerData, student_level: e.target.value})}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isLoading}
                        >
                          <option value="">Seçiniz</option>
                          {studentLevels.map((level) => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg_password">Şifre *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reg_password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="En az 6 karakter"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          className="pl-10 pr-10"
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Şifre Tekrar *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm_password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Şifrenizi tekrar girin"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          className="pl-10 pr-10"
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={registerData.terms}
                      onCheckedChange={(checked) => setRegisterData({...registerData, terms: checked as boolean})}
                      disabled={isLoading}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      <a href="#" className="text-primary hover:underline">Kullanım Şartları</a> ve{' '}
                      <a href="#" className="text-primary hover:underline">Gizlilik Politikası</a>'nı kabul ediyorum
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Hesap oluşturuluyor...
                      </>
                    ) : (
                      'Hesap Oluştur'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Password Reset Modal */}
            {activeTab === 'reset' && (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('login')}
                  className="mb-4 p-0"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Giriş sayfasına dön
                </Button>

                {!resetSent ? (
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset_email">E-posta Adresi</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset_email"
                          type="email"
                          placeholder="E-posta adresinizi girin"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="pl-10"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        'Sıfırlama Bağlantısı Gönder'
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                    <div>
                      <h3 className="font-semibold">E-posta Gönderildi</h3>
                      <p className="text-sm text-muted-foreground">
                        Şifre sıfırlama bağlantısı <strong>{resetEmail}</strong> adresine gönderildi.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setResetSent(false);
                        setActiveTab('login');
                      }}
                      className="w-full"
                    >
                      Giriş Sayfasına Dön
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; 2025 YTT - Yenilikçi Teknoloji Takımı</p>
          <p className="mt-1">Doğa ve teknoloji ile sürdürülebilir geleceği inşa ediyoruz</p>
        </div>
      </div>
    </div>
  );
}