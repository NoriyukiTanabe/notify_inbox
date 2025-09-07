import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Star, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';

export function NotificationList() {
  const { 
    filteredNotifications, 
    selectedNotification,
    setSelectedNotification,
    updateNotification,
    filters,
    updateFilters
  } = useNotifications();

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

  const handleNotificationClick = (notification: typeof filteredNotifications[0]) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      updateNotification(notification.id, { isRead: true });
    }
  };

  const toggleStar = (e: React.MouseEvent, notificationId: string, isStarred: boolean) => {
    e.stopPropagation();
    updateNotification(notificationId, { isStarred: !isStarred });
  };

  const toggleComplete = (e: React.MouseEvent, notificationId: string, isComplete: boolean) => {
    e.stopPropagation();
    updateNotification(notificationId, { isComplete: !isComplete });
  };

  const formatDueDate = (dueDate: Date | undefined) => {
    if (!dueDate) return null;
    const now = new Date();
    const isOverdue = dueDate < now;
    const timeAgo = formatDistanceToNow(dueDate, { addSuffix: true });
    
    return (
      <span className={cn(
        "text-xs flex items-center gap-1",
        isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"
      )}>
        <Clock className="w-3 h-3" />
        {isOverdue ? 'Overdue' : 'Due'} {timeAgo}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* Mobile search and sort - only shown on small screens */}
      <div className="md:hidden p-4 border-b space-y-4">
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Search notifications..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
          <Select 
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-') as [typeof filters.sortBy, typeof filters.sortOrder];
              updateFilters({ sortBy, sortOrder });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="receivedTime-desc">Newest first</SelectItem>
              <SelectItem value="receivedTime-asc">Oldest first</SelectItem>
              <SelectItem value="severity-desc">Severity (high to low)</SelectItem>
              <SelectItem value="severity-asc">Severity (low to high)</SelectItem>
              <SelectItem value="dueDate-asc">Due date (earliest)</SelectItem>
              <SelectItem value="dueDate-desc">Due date (latest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredNotifications.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">No notifications found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 cursor-pointer hover:bg-accent/50 transition-colors",
                  selectedNotification?.id === notification.id && "bg-accent",
                  !notification.isRead && !notification.isComplete && "bg-blue-50/50 border-l-4 border-l-blue-500",
                  notification.isComplete && "opacity-60"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={cn("text-xs", getSeverityColor(notification.severity))}>
                          {notification.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">
                          {notification.source.name}
                        </span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <h3 className={cn(
                        "font-medium text-sm leading-tight",
                        !notification.isRead && "font-semibold"
                      )}>
                        {notification.title}
                      </h3>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleStar(e, notification.id, notification.isStarred)}
                        className="h-8 w-8 p-0"
                      >
                        <Star className={cn(
                          "w-4 h-4",
                          notification.isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        )} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleComplete(e, notification.id, notification.isComplete)}
                        className="h-8 w-8 p-0"
                      >
                        <CheckCircle className={cn(
                          "w-4 h-4",
                          notification.isComplete ? "fill-green-500 text-green-500" : "text-muted-foreground"
                        )} />
                      </Button>
                      {notification.externalUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(notification.externalUrl, '_blank');
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Body Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {notification.body}
                  </p>

                  {/* Tags and metadata */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1">
                      {notification.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {formatDueDate(notification.dueDate)}
                      <span>
                        {formatDistanceToNow(notification.receivedTime, { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {notification.isSnoozed && notification.snoozeUntil && (
                    <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" />
                      Snoozed until {formatDistanceToNow(notification.snoozeUntil, { addSuffix: true })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}