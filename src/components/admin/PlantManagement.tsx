import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Leaf, Plus, CreditCard as Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Plant {
  id: string;
  name: string;
  scientific_name: string;
  description: string;
  difficulty_level: string;
  image_url: string;
}

export function PlantManagement() {
  const { toast } = useToast();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    scientific_name: '',
    description: '',
    habitat: '',
    uses: '',
    care_instructions: '',
    difficulty_level: 'easy',
    image_url: ''
  });

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .order('name');

      if (error) throw error;
      setPlants(data || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const plantData = {
        ...formData,
        uses: formData.uses.split(',').map(s => s.trim()),
        care_instructions: formData.care_instructions.split(',').map(s => s.trim())
      };

      if (editingPlant) {
        const { error } = await supabase
          .from('plants')
          .update(plantData)
          .eq('id', editingPlant.id);

        if (error) throw error;

        toast({ title: "Başarılı", description: "Bitki güncellendi." });
      } else {
        const { error } = await supabase
          .from('plants')
          .insert([plantData]);

        if (error) throw error;

        toast({ title: "Başarılı", description: "Bitki eklendi." });
      }

      setIsDialogOpen(false);
      resetForm();
      loadPlants();
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deletePlant = async (id: string) => {
    if (!confirm('Bu bitkiyi silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('plants')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({ title: "Silindi", description: "Bitki başarıyla silindi." });
      loadPlants();
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      scientific_name: '',
      description: '',
      habitat: '',
      uses: '',
      care_instructions: '',
      difficulty_level: 'easy',
      image_url: ''
    });
    setEditingPlant(null);
  };

  const openEditDialog = (plant: any) => {
    setEditingPlant(plant);
    setFormData({
      name: plant.name,
      scientific_name: plant.scientific_name,
      description: plant.description || '',
      habitat: plant.habitat || '',
      uses: Array.isArray(plant.uses) ? plant.uses.join(', ') : '',
      care_instructions: Array.isArray(plant.care_instructions) ? plant.care_instructions.join(', ') : '',
      difficulty_level: plant.difficulty_level || 'easy',
      image_url: plant.image_url || ''
    });
    setIsDialogOpen(true);
  };

  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.scientific_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center space-x-3">
            <Leaf className="h-8 w-8" />
            <span>Bitki Yönetimi</span>
          </h2>
          <p className="text-muted-foreground mt-2">Bitki veritabanını yönetin</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Bitki Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlant ? 'Bitki Düzenle' : 'Yeni Bitki Ekle'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bitki Adı *</Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Bilimsel Adı *</Label>
                  <Input
                    required
                    value={formData.scientific_name}
                    onChange={e => setFormData({...formData, scientific_name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Açıklama *</Label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label>Habitat</Label>
                <Input
                  value={formData.habitat}
                  onChange={e => setFormData({...formData, habitat: e.target.value})}
                />
              </div>

              <div>
                <Label>Kullanım Alanları (virgülle ayırın)</Label>
                <Textarea
                  value={formData.uses}
                  onChange={e => setFormData({...formData, uses: e.target.value})}
                  placeholder="Aromaterapi, Kozmetik, Çay..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Bakım Talimatları (virgülle ayırın)</Label>
                <Textarea
                  value={formData.care_instructions}
                  onChange={e => setFormData({...formData, care_instructions: e.target.value})}
                  placeholder="Günlük sulama, Bol güneş..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Zorluk Seviyesi</Label>
                  <Select value={formData.difficulty_level} onValueChange={v => setFormData({...formData, difficulty_level: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Kolay</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="hard">Zor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Görsel URL</Label>
                  <Input
                    value={formData.image_url}
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit">
                  {editingPlant ? 'Güncelle' : 'Ekle'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Bitki ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlants.map(plant => (
              <Card key={plant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={plant.image_url || 'https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg'}
                  alt={plant.name}
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{plant.name}</h3>
                  <p className="text-sm text-muted-foreground italic mb-2">{plant.scientific_name}</p>
                  <p className="text-sm line-clamp-2 mb-3">{plant.description}</p>
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(plant)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deletePlant(plant.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
