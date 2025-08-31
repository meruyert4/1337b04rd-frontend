// Export all API types
export type {
  Post,
  CreatePostRequest,
  CreatePostResponse,
  GetPostsResponse,
  GetPostResponse,
  UpdatePostRequest,
  UpdatePostResponse,
  DeletePostResponse,
  ApiResponse
} from './types';

// Export services
export { default as postService } from './postService';
export { postService as postServiceInstance } from './postService';
