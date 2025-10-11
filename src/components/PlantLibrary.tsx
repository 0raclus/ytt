import React, { useState, useEffect } from 'react';
import { PlantCard } from '@/components/PlantCard';
import { PlantDetail } from '@/components/PlantDetail';
import { Plant } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Leaf, Search, Filter, BookOpen, Droplets, Sun, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export function PlantLibrary() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

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

      const mappedPlants: Plant[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        scientificName: p.scientific_name,
        description: p.description || '',
        characteristics: p.seasonal_info?.characteristics || [],
        habitat: p.habitat || '',
        uses: p.uses || [],
        careInstructions: p.care_instructions || [],
        image: p.image_url || 'https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg',
        seasonalInfo: {
          blooming: p.seasonal_info?.blooming || '',
          planting: p.seasonal_info?.planting || '',
          harvesting: p.seasonal_info?.harvesting || ''
        }
      }));
      setPlants(mappedPlants);
    } catch (error) {
      console.error('Error loading plants:', error);
      toast({
        title: "Hata",
        description: "Bitkiler yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plant.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeason = seasonFilter === 'all' || 
                         plant.seasonalInfo.blooming.toLowerCase().includes(seasonFilter.toLowerCase());
    
    return matchesSearch && matchesSeason;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name, 'tr');
      case 'scientific':
        return a.scientificName.localeCompare(b.scientificName);
      default:
        return 0;
    }
  });

  const seasons = [
    { value: 'all', label: 'Tüm Mevsimler' },
    { value: 'ilkbahar', label: 'İlkbahar' },
    { value: 'yaz', label: 'Yaz' },
    { value: 'sonbahar', label: 'Sonbahar' },
    { value: 'kış', label: 'Kış' }
  ];

  const sortOptions = [
    { value: 'name', label: 'İsme Göre' },
    { value: 'scientific', label: 'Bilimsel İsme Göre' }
  ];

  const plantStats = [
    {
      title: 'Toplam Bitki',
      value: plants.length,
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20'
    },
    {
      title: 'Aromatik',
      value: plants.filter(p => p.uses.some(use => use.toLowerCase().includes('aroma'))).length,
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20'
    },
    {
      title: 'Tıbbi Özellik',
      value: plants.filter(p => p.uses.some(use => use.toLowerCase().includes('tıbbi') || use.toLowerCase().includes('çay'))).length,
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    }
  ];

  const handlePlantSelect = (plant: Plant) => {
    if (!isAuthenticated) {
      toast({
        title: "Giriş Gerekli",
        description: "Bitki detaylarını görmek için giriş yapmalısınız.",
        variant: "destructive"
      });
      return;
    }
    setSelectedPlant(plant);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-nature/10 rounded-full">
            <Leaf className="h-8 w-8 text-nature" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Bitki Kütüphanesi</h1>
            <p className="text-lg text-muted-foreground">
              Bölgemizde yaygın olarak bulunan bitkileri keşfedin ve öğrenin.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {plantStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="transition-all duration-300 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Bitki ismi, bilimsel isim veya açıklama ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-900"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                    <SelectTrigger className="w-48 bg-white dark:bg-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {seasons.map(season => (
                        <SelectItem key={season.value} value={season.value}>
                          {season.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-white dark:bg-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(searchQuery || seasonFilter !== 'all') && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filtreler:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-2">
                    Arama: "{searchQuery}"
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {seasonFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-2">
                    Mevsim: {seasons.find(s => s.value === seasonFilter)?.label}
                    <button 
                      onClick={() => setSeasonFilter('all')}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSeasonFilter('all');
                    setSortBy('name');
                  }}
                  className="text-muted-foreground"
                >
                  Tümünü Temizle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Introduction Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200 flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span>Bölgemizin Doğal Hazineleri</span>
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Bu bölgede yaygın olarak bulunan {plants.length} önemli bitki türü: Lavanta, Adaçayı ve Süs Akçaağacı. 
            Her birinin kendine özgü özellikleri ve kullanım alanları vardır. Bu kütüphane ile bitki dünyasını keşfedin!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <Sun className="h-6 w-6 text-yellow-600" />
              <div>
                <p className="font-medium">Güneş Sevici</p>
                <p className="text-sm text-muted-foreground">Tam güneşte yetişir</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <Droplets className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium">Az Su İster</p>
                <p className="text-sm text-muted-foreground">Kuraklığa dayanıklı</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <Leaf className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium">Çok Amaçlı</p>
                <p className="text-sm text-muted-foreground">Tıbbi ve süs amaçlı</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results Count */}
      {filteredPlants.length !== plants.length && (
        <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg border">
          <p className="text-sm">
            <span className="font-medium">{filteredPlants.length}</span> bitki bulundu
            {plants.length !== filteredPlants.length && (
              <span className="text-muted-foreground"> (toplam {plants.length} bitkiden)</span>
            )}
          </p>
        </div>
      )}

      {/* Plants Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onSelect={handlePlantSelect}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredPlants.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Leaf className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Bitki Bulunamadı</h3>
            <p className="text-muted-foreground mb-4">
              Arama kriterlerinize uygun bitki bulunamadı. Lütfen farklı anahtar kelimeler deneyin.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSeasonFilter('all');
              }}
              variant="outline"
            >
              Filtreleri Temizle
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Plant Detail Modal */}
      {selectedPlant && (
        <PlantDetail
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
        />
      )}
    </div>
  );
}