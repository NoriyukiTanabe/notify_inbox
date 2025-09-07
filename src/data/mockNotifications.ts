import { Notification } from '@/types/notification';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Critical: Production API endpoint returning 500 errors',
    body: 'The /api/users endpoint has been returning 500 errors for the past 15 minutes. Error rate: 85%. Affected users: ~2,000. Investigation needed immediately.',
    source: {
      name: 'Sentry',
      icon: 'AlertTriangle',
      color: '#FB923C'
    },
    severity: 'critical',
    tags: ['backend', 'api', 'production'],
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    receivedTime: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
    isRead: false,
    isStarred: false,
    isComplete: false,
    isSnoozed: false,
    externalUrl: 'https://sentry.io/error/123456'
  },
  {
    id: '2',
    title: 'GitHub: Pull request #342 ready for review',
    body: 'feat: Add user authentication middleware - This PR adds JWT-based authentication middleware to protect sensitive endpoints. Includes unit tests and documentation updates.',
    source: {
      name: 'GitHub',
      icon: 'GitBranch',
      color: '#24292F'
    },
    severity: 'medium',
    tags: ['code-review', 'authentication', 'security'],
    receivedTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: true,
    isStarred: true,
    isComplete: false,
    isSnoozed: false,
    externalUrl: 'https://github.com/company/repo/pull/342'
  },
  {
    id: '3',
    title: 'CI/CD: Deployment to staging environment failed',
    body: 'Build #1247 failed during the deployment phase. Error: Cannot connect to staging database. This may be due to recent database migration changes.',
    source: {
      name: 'Jenkins',
      icon: 'Zap',
      color: '#D97706'
    },
    severity: 'high',
    tags: ['deployment', 'staging', 'database'],
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    receivedTime: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    isRead: false,
    isStarred: false,
    isComplete: false,
    isSnoozed: false,
    externalUrl: 'https://jenkins.company.com/job/deploy-staging/1247'
  },
  {
    id: '4',
    title: 'Email Gateway: Weekly digest ready',
    body: 'Your weekly notification digest is ready with 47 items processed, 12 critical alerts resolved, and 8 new integrations added.',
    source: {
      name: 'Email Gateway',
      icon: 'Mail',
      color: '#6366F1'
    },
    severity: 'info',
    tags: ['digest', 'weekly-report'],
    receivedTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: false,
    isStarred: false,
    isComplete: false,
    isSnoozed: false
  },
  {
    id: '5',
    title: 'Monitoring: High CPU usage on web-server-03',
    body: 'CPU usage has been above 85% for the past 20 minutes on web-server-03. Memory usage: 78%. This might indicate a resource leak or increased traffic.',
    source: {
      name: 'DataDog',
      icon: 'Activity',
      color: '#10B981'
    },
    severity: 'medium',
    tags: ['monitoring', 'performance', 'server'],
    dueDate: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
    receivedTime: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
    isRead: true,
    isStarred: false,
    isComplete: true,
    isSnoozed: false,
    externalUrl: 'https://app.datadoghq.com/dashboard/abc-123'
  },
  {
    id: '6',
    title: 'Security: Failed login attempts detected',
    body: 'Multiple failed login attempts detected from IP 192.168.1.100. 15 attempts in the last 5 minutes. Account: admin@company.com may be under attack.',
    source: {
      name: 'Auth0',
      icon: 'Shield',
      color: '#EF4444'
    },
    severity: 'high',
    tags: ['security', 'authentication', 'breach-attempt'],
    dueDate: new Date(Date.now() + 30 * 60 * 1000), // 30 mins from now
    receivedTime: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
    isRead: false,
    isStarred: true,
    isComplete: false,
    isSnoozed: false,
    externalUrl: 'https://auth0.com/security/logs'
  },
  {
    id: '7',
    title: 'Backup: Daily database backup completed',
    body: 'Daily backup of production database completed successfully. Backup size: 2.3 GB. Backup location: s3://company-backups/prod-db/2024-01-15.sql.gz',
    source: {
      name: 'AWS S3',
      icon: 'Database',
      color: '#8B5CF6'
    },
    severity: 'info',
    tags: ['backup', 'database', 'maintenance'],
    receivedTime: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    isRead: true,
    isStarred: false,
    isComplete: true,
    isSnoozed: false
  },
  {
    id: '8',
    title: 'API Rate Limit: Approaching threshold',
    body: 'API rate limit at 78% of daily quota. Current usage: 78,432 requests out of 100,000 daily limit. Consider optimizing API calls or upgrading plan.',
    source: {
      name: 'Stripe API',
      icon: 'TrendingUp',
      color: '#F59E0B'
    },
    severity: 'low',
    tags: ['api', 'rate-limit', 'quota'],
    dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    receivedTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isRead: false,
    isStarred: false,
    isComplete: false,
    isSnoozed: true,
    snoozeUntil: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    externalUrl: 'https://dashboard.stripe.com/usage'
  }
];