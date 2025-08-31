// Export all API types
export type {
  Post,
  Comment,
  Session,
  CreatePostRequest,
  CreatePostResponse,
  GetPostsResponse,
  GetPostResponse,
  UpdatePostRequest,
  UpdatePostResponse,
  DeletePostResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  GetCommentsResponse,
  ApiResponse
} from './types';

// Export configuration
export { apiConfig, isDevelopment, isProduction } from './config';

// Export services

// Export real API service
export { default as realApiService } from './realApiService';
export { realApiService as apiService } from './realApiService';

// Export unified service (recommended for use)
export { default as unifiedApiService } from './unifiedService';
export { unifiedApiService as api } from './unifiedService';
