import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification, FilterState, SavedView } from '@/types/notification';
import { mockNotifications } from '@/data/mockNotifications';

interface NotificationContextType {
  notifications: Notification[];
  selectedNotification: Notification | null;
  filters: FilterState;
  savedViews: SavedView[];
  
  // Actions
  setSelectedNotification: (notification: Notification | null) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  addSavedView: (view: SavedView) => void;
  deleteSavedView: (viewId: string) => void;
  applySavedView: (view: SavedView) => void;
  
  // Computed values
  filteredNotifications: Notification[];
  sources: string[];
  tags: string[];
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  sources: [],
  severities: [],
  tags: [],
  status: 'all',
  search: '',
  sortBy: 'receivedTime',
  sortOrder: 'desc'
};

const defaultSavedViews: SavedView[] = [
  {
    id: 'unread',
    name: 'Unread',
    filters: { status: 'unread' },
    sortBy: 'receivedTime',
    sortOrder: 'desc'
  },
  {
    id: 'critical',
    name: 'Critical & High',
    filters: { severities: ['critical', 'high'] },
    sortBy: 'severity',
    sortOrder: 'desc'
  },
  {
    id: 'starred',
    name: 'Starred',
    filters: { status: 'starred' },
    sortBy: 'receivedTime',
    sortOrder: 'desc'
  }
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [savedViews, setSavedViews] = useState<SavedView[]>(defaultSavedViews);

  // Compute derived values
  const sources = Array.from(new Set(notifications.map(n => n.source.name)));
  const tags = Array.from(new Set(notifications.flatMap(n => n.tags)));
  const unreadCount = notifications.filter(n => !n.isRead && !n.isComplete).length;

  // Filter and sort notifications
  const filteredNotifications = React.useMemo(() => {
    let result = notifications.filter(notification => {
      // Skip snoozed notifications unless specifically looking for them
      if (notification.isSnoozed && filters.status !== 'snoozed') {
        if (notification.snoozeUntil && notification.snoozeUntil > new Date()) {
          return false;
        }
      }

      // Source filter
      if (filters.sources.length > 0 && !filters.sources.includes(notification.source.name)) {
        return false;
      }

      // Severity filter
      if (filters.severities.length > 0 && !filters.severities.includes(notification.severity)) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some(tag => notification.tags.includes(tag))) {
        return false;
      }

      // Status filter
      switch (filters.status) {
        case 'unread':
          return !notification.isRead && !notification.isComplete;
        case 'starred':
          return notification.isStarred;
        case 'completed':
          return notification.isComplete;
        case 'snoozed':
          return notification.isSnoozed;
        default:
          return true;
      }
    });

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(notification =>
        notification.title.toLowerCase().includes(searchLower) ||
        notification.body.toLowerCase().includes(searchLower) ||
        notification.source.name.toLowerCase().includes(searchLower) ||
        notification.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
          comparison = severityOrder[b.severity] - severityOrder[a.severity];
          break;
        case 'dueDate':
          const aDue = a.dueDate?.getTime() || Infinity;
          const bDue = b.dueDate?.getTime() || Infinity;
          comparison = aDue - bDue;
          break;
        case 'receivedTime':
        default:
          comparison = b.receivedTime.getTime() - a.receivedTime.getTime();
          break;
      }

      return filters.sortOrder === 'asc' ? -comparison : comparison;
    });

    return result;
  }, [notifications, filters]);

  const updateNotification = (id: string, updates: Partial<Notification>) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, ...updates } : notification
      )
    );
    
    // Update selected notification if it's the one being updated
    if (selectedNotification?.id === id) {
      setSelectedNotification(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const addSavedView = (view: SavedView) => {
    setSavedViews(prev => [...prev, view]);
  };

  const deleteSavedView = (viewId: string) => {
    setSavedViews(prev => prev.filter(view => view.id !== viewId));
  };

  const applySavedView = (view: SavedView) => {
    setFilters({
      sources: view.filters.sources || [],
      severities: view.filters.severities || [],
      tags: view.filters.tags || [],
      status: view.filters.status || 'all',
      search: '',
      sortBy: view.sortBy,
      sortOrder: view.sortOrder
    });
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      selectedNotification,
      filters,
      savedViews,
      setSelectedNotification,
      updateNotification,
      updateFilters,
      addSavedView,
      deleteSavedView,
      applySavedView,
      filteredNotifications,
      sources,
      tags,
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}