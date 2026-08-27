export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface ServiceStatus {
  status: 'configured' | 'not_configured' | 'healthy' | 'error';
  details: string;
}

export interface SystemStatusData {
  application: string;
  phase: string;
  systemStatus: string;
  services: {
    backendServer: ServiceStatus;
    mongoDbAtlas: ServiceStatus;
    firebaseAuth: ServiceStatus;
    jwtSecrets: ServiceStatus;
  };
  supportedRoles: string[];
  timestamp: string;
}

export interface UserRoleInfo {
  role: 'Customer' | 'Worker' | 'Cooperative Admin';
  description: string;
  tagline: string;
  iconName: string;
}
