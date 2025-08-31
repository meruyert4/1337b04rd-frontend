export interface ApiConfig {
  baseUrl: string;
  enableLogging: boolean;
  timeout: number;
}

export const apiConfig: ApiConfig = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  enableLogging: process.env.REACT_APP_ENABLE_LOGGING !== 'false',
  timeout: 10000, // 10 seconds
};

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
