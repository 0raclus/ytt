import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, Plus, Send, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function NotificationManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    recipient: 'all',
    specific_user_id: '',
    title: '',
    message: '',
    type: 'info',
    priority: 'medium'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id, full_name, email');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let targetUsers: string[] = [];

      if (formData.recipient === 'all') {
        targetUsers = users.map(u => u.user_id);
      } else if (formData.recipient === 'specific' && formData.specific_user_id) {
        targetUsers = [formData.specific_user_id];
      }

      const notifications = targetUsers.map(userId => ({
        user_id: userId,
        title: formData.title,
        message: formData.message,
        type: formData.type,
        priority: formData.priority,
        read: false
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: `${targetUsers.length} kullanıcıya bildirim gönderildi.`,
      });

      setIsDialogOpen(false);
      setFormData({
        recipient: 'all',
        specific_user_id: '',
        title: '',
        message: '',
        type: 'info',
        priority: 'medium'
      });
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center space-x-3">
            <Bell className="h-8 w-8" />
            <span>Bildirim Yönetimi</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Kullanıcılara bildirim gönderin
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Bildirim Gönder
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Bildirim Gönder</DialogTitle>
            </DialogHeader>
            <form onSubmit={sendNotification} className="space-y-4">
              <div>
                <Label>Alıcı *</Label>
                <Select
                  value={formData.recipient}
                  onValueChange={v => setFormData({...formData, recipient: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                    <SelectItem value="specific">Belirli Kullanıcı</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.recipient === 'specific' && (
                <div>
                  <Label>Kullanıcı Seç *</Label>
                  <Select
                    value={formData.specific_user_id}
                    onValueChange={v => setFormData({...formData, specific_user_id: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kullanıcı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.user_id} value={user.user_id}>
                          {user.full_name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label>Başlık *</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="Bildirim başlığı"
                />
              </div>

              <div>
                <Label>Mesaj *</Label>
                <Textarea
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="Bildirim içeriği"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tip</Label>
                  <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Bilgi</SelectItem>
                      <SelectItem value="success">Başarılı</SelectItem>
                      <SelectItem value="warning">Uyarı</SelectItem>
                      <SelectItem value="reminder">Hatırlatma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Öncelik</Label>
                  <Select value={formData.priority} onValueChange={v => setFormData({...formData, priority: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Düşük</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="high">Yüksek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={loading}>
                  <Send className="h-4 w-4 mr-2" />
                  Gönder
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bildirim İstatistikleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-muted-foreground">Toplam Kullanıcı</span>
              </div>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Bell className="h-5 w-5 text-green-600" />
                <span className="text-sm text-muted-foreground">Aktif Bildirimler</span>
              </div>
              <p className="text-2xl font-bold">-</p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Send className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-muted-foreground">Bugün Gönderilen</span>
              </div>
              <p className="text-2xl font-bold">-</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
