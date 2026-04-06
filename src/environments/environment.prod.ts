export const environment = {
  production: true,
  apiUrl: 'https://api.techwindows.com/api', // Replace with your production API URL
  appName: 'TechWindows',
  version: '1.0.0',
  defaultLanguage: 'en',
  supportedLanguages: ['en'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  pagination: {
    defaultPageSize: 12,
    pageSizeOptions: [6, 12, 24, 48]
  },
  features: {
    search: true,
    filters: true,
    ratings: true,
    reviews: true,
    fileUpload: true,
    notifications: true
  },
  // API Configuration
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    endpoints: {
      auth: '/auth',
      courses: '/courses',
      institutes: '/institutes',
      trainers: '/trainers',
      mentors: '/mentors',
      users: '/users',
      search: '/search',
      upload: '/upload',
      orders: '/orders',
      cart: '/cart',
      news: '/news',
      dashboard: '/dashboard'
    }
  },
  // File Upload Configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    allowedVideoTypes: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv']
  },
  // Authentication Configuration
  auth: {
    tokenKey: 'token',
    userKey: 'user',
    refreshTokenKey: 'refreshToken',
    tokenExpiryBuffer: 5 * 60 * 1000 // 5 minutes before expiry
  },
  // UI Configuration
  ui: {
    defaultTheme: 'light',
    animations: true,
    sidebarCollapsed: false,
    itemsPerPage: 12
  }
};

