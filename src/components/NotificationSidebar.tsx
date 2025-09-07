import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ChevronDown, ChevronRight, Plus, Filter, Star, Archive, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';

interface NotificationSidebarProps {
  onClose?: () => void;
}

export function NotificationSidebar({ onClose }: NotificationSidebarProps) {
  const { 
    sources, 
    tags, 
    filters, 
    updateFilters, 
    savedViews, 
    applySavedView,
    unreadCount,
    filteredNotifications 
  } = useNotifications();
  
  const [openSections, setOpenSections] = useState({
    views: true,
    sources: true,
    severities: true,
    tags: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleStatusFilter = (status: typeof filters.status) => {
    updateFilters({ status: status === filters.status ? 'all' : status });
  };

  const handleSourceToggle = (source: string) => {
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter(s => s !== source)
      : [...filters.sources, source];
    updateFilters({ sources: newSources });
  };

  const handleSeverityToggle = (severity: string) => {
    const newSeverities = filters.severities.includes(severity)
      ? filters.severities.filter(s => s !== severity)
      : [...filters.severities, severity];
    updateFilters({ severities: newSeverities });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    updateFilters({ tags: newTags });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      case 'info': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const clearAllFilters = () => {
    updateFilters({
      sources: [],
      severities: [],
      tags: [],
      status: 'all',
      search: ''
    });
  };

  const hasActiveFilters = filters.sources.length > 0 || 
    filters.severities.length > 0 || 
    filters.tags.length > 0 || 
    filters.status !== 'all' || 
    filters.search !== '';

  return (
    <div className="w-80 border-r bg-card flex-shrink-0 flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">NotifyInbox</h2>
          <div className="flex items-center gap-2">
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
                <X className="w-4 h-4" />
              </Button>
            )}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <Filter className="w-4 h-4" />
                Clear
              </Button>
            )}
            <Badge variant="secondary">{filteredNotifications.length}</Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Quick Status Filters */}
        <div className="space-y-2">
          <Button
            variant={filters.status === 'unread' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => handleStatusFilter('unread')}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Unread
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {unreadCount}
              </Badge>
            )}
          </Button>
        
          <Button
            variant={filters.status === 'starred' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => handleStatusFilter('starred')}
          >
            <Star className="w-4 h-4 mr-2" />
            Starred
          </Button>
        
          <Button
            variant={filters.status === 'completed' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => handleStatusFilter('completed')}
          >
            <Archive className="w-4 h-4 mr-2" />
            Completed
          </Button>
        
          <Button
            variant={filters.status === 'snoozed' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => handleStatusFilter('snoozed')}
          >
            <Clock className="w-4 h-4 mr-2" />
            Snoozed
          </Button>
        </div>

        <Separator />

        {/* Saved Views */}
        <Collapsible open={openSections.views} onOpenChange={() => toggleSection('views')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md">
            <span className="font-medium">Saved Views</span>
            {openSections.views ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-2">
            {savedViews.map(view => (
              <Button
                key={view.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => applySavedView(view)}
              >
                {view.name}
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Sources */}
        <Collapsible open={openSections.sources} onOpenChange={() => toggleSection('sources')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md">
            <span className="font-medium">Sources</span>
            {openSections.sources ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-2">
            {sources.map(source => (
              <Button
                key={source}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-sm",
                  filters.sources.includes(source) && "bg-accent"
                )}
                onClick={() => handleSourceToggle(source)}
              >
                {source}
                {filters.sources.includes(source) && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    ✓
                  </Badge>
                )}
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Severities */}
        <Collapsible open={openSections.severities} onOpenChange={() => toggleSection('severities')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md">
            <span className="font-medium">Severity</span>
            {openSections.severities ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-2">
            {['critical', 'high', 'medium', 'low', 'info'].map(severity => (
              <Button
                key={severity}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-sm",
                  filters.severities.includes(severity) && "bg-accent"
                )}
                onClick={() => handleSeverityToggle(severity)}
              >
                <div className={cn("w-2 h-2 rounded-full mr-2", getSeverityColor(severity))} />
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
                {filters.severities.includes(severity) && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    ✓
                  </Badge>
                )}
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Tags */}
        <Collapsible open={openSections.tags} onOpenChange={() => toggleSection('tags')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md">
            <span className="font-medium">Tags</span>
            {openSections.tags ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-2">
            <div className="flex flex-wrap gap-1">
              {tags.map(tag => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}