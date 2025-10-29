import React from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Clock, GraduationCap } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onRegister: (eventId: string) => void;
  isRegistered: boolean;
  showAdminActions?: boolean;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

export function EventCard({ event, onRegister, isRegistered, showAdminActions = false, onEdit, onDelete }: EventCardProps) {
  const categoryColors = {
    workshop: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    walk: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    seminar: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    planting: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
  };

  const difficultyColors = {
    beginner: 'text-green-600',
    intermediate: 'text-yellow-600',
    advanced: 'text-red-600'
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="event-card">
      <div className="aspect-video overflow-hidden rounded-t-lg">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
            <CardDescription>{event.instructor || 'Eğitmen Belirtilmemiş'}</CardDescription>
          </div>
          <Badge className={categoryColors[event.category]}>
            {event.category === 'workshop' && 'Atölye'}
            {event.category === 'walk' && 'Yürüyüş'}
            {event.category === 'seminar' && 'Seminer'}
            {event.category === 'planting' && 'Dikim'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {event.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{event.time} ({event.duration})</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-primary" />
            <span>{event.registered}/{event.capacity}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className={`h-4 w-4 ${difficultyColors[event.difficulty]}`} />
            <span className={`text-sm ${difficultyColors[event.difficulty]}`}>
              {event.difficulty === 'beginner' && 'Başlangıç'}
              {event.difficulty === 'intermediate' && 'Orta'}
              {event.difficulty === 'advanced' && 'İleri'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {showAdminActions ? (
              <>
                {onEdit && (
                  <Button
                    onClick={() => onEdit(event.id)}
                    size="sm"
                    variant="outline"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Düzenle
                  </Button>
                )}
                {onDelete && (
                  <Button
                    onClick={() => onDelete(event.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    Sil
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={() => onRegister(event.id)}
                disabled={isRegistered || event.registered >= event.capacity}
                size="sm"
                className="transition-all duration-200"
              >
                {isRegistered ? 'Kayıtlı' : event.registered >= event.capacity ? 'Dolu' : 'Katıl'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}