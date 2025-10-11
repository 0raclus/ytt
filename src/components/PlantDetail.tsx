import React from 'react';
import { Plant } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Leaf, Droplets, Sun, Calendar, Heart, Scissors, Shield } from 'lucide-react';

interface PlantDetailProps {
  plant: Plant;
  onClose: () => void;
}

export function PlantDetail({ plant, onClose }: PlantDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <CardTitle className="text-3xl font-bold text-primary flex items-center space-x-2">
                  <Leaf className="h-8 w-8" />
                  <span>{plant.name}</span>
                </CardTitle>
                <p className="text-lg italic text-muted-foreground mt-2">
                  {plant.scientificName}
                </p>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {plant.description}
              </p>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <Calendar className="h-6 w-6 mx-auto text-primary" />
                  <p className="text-xs font-medium">Çiçeklenme</p>
                  <p className="text-xs text-muted-foreground">{plant.seasonalInfo.blooming}</p>
                </div>
                <div className="space-y-1">
                  <Sun className="h-6 w-6 mx-auto text-warning" />
                  <p className="text-xs font-medium">Dikim</p>
                  <p className="text-xs text-muted-foreground">{plant.seasonalInfo.planting}</p>
                </div>
                <div className="space-y-1">
                  <Scissors className="h-6 w-6 mx-auto text-success" />
                  <p className="text-xs font-medium">Hasat</p>
                  <p className="text-xs text-muted-foreground">{plant.seasonalInfo.harvesting}</p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Separator />
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="flex items-center space-x-2 text-lg font-semibold mb-3">
                  <Leaf className="h-5 w-5 text-nature" />
                  <span>Özellikler</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {plant.characteristics.map((char, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="flex items-center space-x-2 text-lg font-semibold mb-3">
                  <Heart className="h-5 w-5 text-success" />
                  <span>Kullanım Alanları</span>
                </h3>
                <ul className="space-y-2">
                  {plant.uses.map((use, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <span className="w-2 h-2 bg-success rounded-full"></span>
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="flex items-center space-x-2 text-lg font-semibold mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Yaşam Alanı</span>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {plant.habitat}
                </p>
              </div>
              
              <div>
                <h3 className="flex items-center space-x-2 text-lg font-semibold mb-3">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <span>Bakım Talimatları</span>
                </h3>
                <ul className="space-y-2">
                  {plant.careInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}