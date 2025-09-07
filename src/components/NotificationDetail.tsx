import React, { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  Star, 
  Clock, 
  CheckCircle, 
  ExternalLink, 
  Archive,
  Tag,
  Calendar,
  X,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';

export function NotificationDetail() {
  const { selectedNotification, updateNotification, setSelectedNotification } = useNotifications();
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [snoozeHours, setSnoozeHours] = useState('1');

  if (!selectedNotification) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      case 'info': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleToggleStar = () => {
    updateNotification(selectedNotification.id, { 
      isStarred: !selectedNotification.isStarred 
    });
  };

  const handleToggleComplete = () => {
    updateNotification(selectedNotification.id, { 
      isComplete: !selectedNotification.isComplete 
    });
  };

  const handleSnooze = () => {
    const hours = parseInt(snoozeHours);
    const snoozeUntil = new Date(Date.now() + hours * 60 * 60 * 1000);
    updateNotification(selectedNotification.id, {
      isSnoozed: true,
      snoozeUntil
    });
  };

  const handleUnsnooze = () => {
    updateNotification(selectedNotification.id, {
      isSnoozed: false,
      snoozeUntil: undefined
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !selectedNotification.tags.includes(newTag.trim())) {
      updateNotification(selectedNotification.id, {
        tags: [...selectedNotification.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateNotification(selectedNotification.id, {
      tags: selectedNotification.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const formatDueDate = (dueDate: Date | undefined) => {
    if (!dueDate) return null;
    const now = new Date();
    const isOverdue = dueDate < now;
    
    return (
      <div className={cn(
        "flex items-center gap-2 p-2 rounded text-sm",
        isOverdue ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
      )}>
        <Calendar className="w-4 h-4" />
        <span>
          {isOverdue ? 'Overdue: ' : 'Due: '}
          {format(dueDate, 'MMM d, yyyy \'at\' h:mm a')}
          <span className="ml-1 text-xs">
            ({formatDistanceToNow(dueDate, { addSuffix: true })})
          </span>
        </span>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs", getSeverityColor(selectedNotification.severity))}>
              {selectedNotification.severity}
            </Badge>
            <span className="text-sm font-medium text-muted-foreground">
              {selectedNotification.source.name}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedNotification(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <h2 className="text-lg font-semibold leading-tight mb-2">
          {selectedNotification.title}
        </h2>

        <div className="text-sm text-muted-foreground">
          Received {formatDistanceToNow(selectedNotification.receivedTime, { addSuffix: true })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Due Date */}
        {selectedNotification.dueDate && formatDueDate(selectedNotification.dueDate)}

        {/* Body */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Message</h3>
          <div className="bg-muted/50 p-3 rounded-md text-sm leading-relaxed">
            {selectedNotification.body}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Tags</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditingTags(!isEditingTags)}
            >
              <Tag className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedNotification.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs"
              >
                {tag}
                {isEditingTags && (
                  <button 
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>

          {isEditingTags && (
            <div className="flex gap-2">
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="text-sm"
              />
              <Button size="sm" onClick={handleAddTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Snooze Status */}
        {selectedNotification.isSnoozed && selectedNotification.snoozeUntil && (
          <div className="bg-orange-50 border border-orange-200 p-3 rounded-md">
            <div className="flex items-center gap-2 text-orange-800">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Snoozed until {format(selectedNotification.snoozeUntil, 'MMM d, yyyy \'at\' h:mm a')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t space-y-3">
        {/* Primary actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={selectedNotification.isComplete ? "default" : "outline"}
            onClick={handleToggleComplete}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {selectedNotification.isComplete ? 'Completed' : 'Complete'}
          </Button>
          
          <Button
            variant={selectedNotification.isStarred ? "default" : "outline"}
            onClick={handleToggleStar}
            className="flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            {selectedNotification.isStarred ? 'Starred' : 'Star'}
          </Button>
        </div>

        {/* Snooze controls */}
        {!selectedNotification.isSnoozed ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Select value={snoozeHours} onValueChange={setSnoozeHours}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                  <SelectItem value="24">1 day</SelectItem>
                  <SelectItem value="168">1 week</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSnooze} className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Snooze
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={handleUnsnooze} className="w-full">
            <Clock className="w-4 h-4 mr-2" />
            Unsnooze
          </Button>
        )}

        {/* External link */}
        {selectedNotification.externalUrl && (
          <Button
            variant="outline"
            onClick={() => window.open(selectedNotification.externalUrl, '_blank')}
            className="w-full flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open in {selectedNotification.source.name}
          </Button>
        )}
      </div>
    </div>
  );
}