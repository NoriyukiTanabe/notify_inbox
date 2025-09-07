export interface Notification {
  id: string;
  title: string;
  body: string;
  source: {
    name: string;
    icon: string;
    color: string;
  };
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  tags: string[];
  dueDate?: Date;
  receivedTime: Date;
  isRead: boolean;
  isStarred: boolean;
  isComplete: boolean;
  isSnoozed: boolean;
  snoozeUntil?: Date;
  externalUrl?: string;
}

export interface SavedView {
  id: string;
  name: string;
  filters: {
    sources?: string[];
    severities?: string[];
    tags?: string[];
    status?: 'all' | 'unread' | 'starred' | 'completed' | 'snoozed';
  };
  sortBy: 'severity' | 'dueDate' | 'receivedTime';
  sortOrder: 'asc' | 'desc';
}

export interface FilterState {
  sources: string[];
  severities: string[];
  tags: string[];
  status: 'all' | 'unread' | 'starred' | 'completed' | 'snoozed';
  search: string;
  sortBy: 'severity' | 'dueDate' | 'receivedTime';
  sortOrder: 'asc' | 'desc';
}