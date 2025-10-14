import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Droplets, Sun, Thermometer, Wind, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function PlantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPlant();
    }
  }, [id]);

  const loadPlant = async () => {
    try {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPlant(data);
    } catch (error) {
      console.error('Error loading plant:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Bitki Bulunamadı</h2>
            <p className="text-muted-foreground mb-6">Aradığınız bitki mevcut değil.</p>
            <Link to="/plants">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Bitkilere Dön
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const careInstructions = plant.care_instructions || {};

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link to="/plants">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Bitkilere Dön
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {plant.image_url && (
            <div className="aspect-square relative overflow-hidden rounded-lg mb-6">
              <img
                src={plant.image_url}
                alt={plant.name}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{plant.name}</h1>
            {plant.scientific_name && (
              <p className="text-lg text-muted-foreground italic mb-4">
                {plant.scientific_name}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {plant.category && <Badge>{plant.category}</Badge>}
              {plant.difficulty && (
                <Badge variant="outline">{plant.difficulty}</Badge>
              )}
            </div>
            <p className="text-muted-foreground">{plant.description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bakım Talimatları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {careInstructions.sulama && (
                <div className="flex items-start space-x-3">
                  <Droplets className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Sulama</p>
                    <p className="text-sm text-muted-foreground">
                      {careInstructions.sulama}
                    </p>
                  </div>
                </div>
              )}

              {careInstructions.isik && (
                <div className="flex items-start space-x-3">
                  <Sun className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Işık</p>
                    <p className="text-sm text-muted-foreground">
                      {careInstructions.isik}
                    </p>
                  </div>
                </div>
              )}

              {careInstructions.sicaklik && (
                <div className="flex items-start space-x-3">
                  <Thermometer className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Sıcaklık</p>
                    <p className="text-sm text-muted-foreground">
                      {careInstructions.sicaklik}
                    </p>
                  </div>
                </div>
              )}

              {careInstructions.nem && (
                <div className="flex items-start space-x-3">
                  <Wind className="h-5 w-5 text-cyan-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Nem</p>
                    <p className="text-sm text-muted-foreground">
                      {careInstructions.nem}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
