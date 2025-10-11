import React from 'react';
import { Plant } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Leaf, Droplets, Sun, Calendar } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
  onSelect: (plant: Plant) => void;
}

export function PlantCard({ plant, onSelect }: PlantCardProps) {
  return (
    <Card 
      className="plant-card cursor-pointer group"
      onClick={() => onSelect(plant)}
    >
      <div className="aspect-video overflow-hidden rounded-t-lg">
        <img
          src={plant.image}
          alt={plant.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{plant.name}</CardTitle>
          <Leaf className="h-5 w-5 text-nature" />
        </div>
        <CardDescription className="italic text-muted-foreground">
          {plant.scientificName}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {plant.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-primary" />
            <span>{plant.seasonalInfo.blooming}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Sun className="h-3 w-3 text-warning" />
            <span>Tam güneş</span>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Özellikler:</h4>
          <div className="flex flex-wrap gap-1">
            {plant.characteristics.slice(0, 3).map((char, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {char}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}