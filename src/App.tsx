import React from 'react';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { NotificationSidebar } from '@/components/NotificationSidebar';
import { NotificationList } from '@/components/NotificationList';
import { NotificationDetail } from '@/components/NotificationDetail';
import { useNotifications } from '@/contexts/NotificationContext';
import './App.css';

function AppContent() {
  const { selectedNotification, filters, updateFilters } = useNotifications();
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Close sidebar on mobile when notification is selected
  useEffect(() => {
    if (selectedNotification && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [selectedNotification]);

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <NotificationSidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <h1 className="text-xl font-semibold lg:hidden">NotifyInbox</h1>
            
            {/* Search and filters - hidden on mobile, shown on larger screens */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-2xl">
              <Input
                placeholder="Search notifications..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="flex-1"
              />
              <Select 
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-') as [typeof filters.sortBy, typeof filters.sortOrder];
                  updateFilters({ sortBy, sortOrder });
                }}
              >
                <SelectTrigger className="w-48">
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
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        <NotificationList />
      </div>
      
      {/* Sliding detail panel */}
      <div className={`
        fixed top-0 right-0 h-full w-full sm:w-96 bg-background border-l shadow-xl
        transform transition-transform duration-300 ease-in-out z-50
        ${selectedNotification ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <NotificationDetail />
      </div>
      
      {/* Overlay when detail panel is open */}
      {selectedNotification && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 sm:hidden"
        />
      )}
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;