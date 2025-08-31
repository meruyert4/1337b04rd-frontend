import { apiConfig } from './config';
import { realApiService } from './realApiService';
import { 
  Post, 
  CreatePostRequest, 
  UpdatePostRequest, 
  CreateCommentRequest, 
  Session,
  Character
} from './types';

// Use type alias to avoid conflict with DOM Comment
type ApiComment = import('./types').Comment;

export interface ApiService {
  // Character methods
  getRandomCharacter(): Promise<Character>;
  getAllCharacters(): Promise<Character[]>;
  
  // Post methods
  getPosts(limit?: number, offset?: number, includeArchived?: boolean): Promise<Post[]>;
  getPost(id: number): Promise<Post | null>;
  createPost(request: CreatePostRequest): Promise<Post>;
  updatePost(request: UpdatePostRequest): Promise<Post>;
  deletePost(id: number): Promise<void>;
  getPostsByAuthor(authorId: string, limit?: number, offset?: number): Promise<Post[]>;
  
  // Comment methods
  getComments(postId: number): Promise<Comment[]>;
  createComment(request: CreateCommentRequest): Promise<Comment>;
  updateComment(id: number, request: CreateCommentRequest): Promise<Comment>;
  deleteComment(id: number): Promise<void>;
  
  // Session methods
  createSession(): Promise<Session>;
  getSession(id: string): Promise<Session | null>;
  updateSession(id: string, name?: string, gender?: string, age?: string): Promise<Session>;
  deleteSession(id: string): Promise<void>;
}

class UnifiedApiService {
  // Posts API
  async getPosts(limit: number = 10, offset: number = 0, includeArchived: boolean = false): Promise<Post[]> {
    return await realApiService.getPosts(limit, offset, includeArchived);
  }

  async getPost(id: number): Promise<Post | null> {
    try {
      return await realApiService.getPost(id);
    } catch (error) {
      console.error('Failed to fetch post:', error);
      return null;
    }
  }

  async createPost(request: CreatePostRequest): Promise<Post> {
    return await realApiService.createPost(request);
  }

  async updatePost(request: UpdatePostRequest): Promise<Post> {
    return await realApiService.updatePost(request);
  }

  async deletePost(id: number): Promise<void> {
    await realApiService.deletePost(id);
  }

  async archivePost(id: number): Promise<void> {
    await realApiService.archivePost(id);
  }

  async unarchivePost(id: number): Promise<void> {
    await realApiService.unarchivePost(id);
  }

  async getPostsByAuthor(authorId: string, limit: number = 10, offset: number = 0): Promise<Post[]> {
    return await realApiService.getPostsByAuthor(authorId, limit, offset);
  }

  // Comments API
  async getCommentsByPost(postId: number): Promise<ApiComment[]> {
    const comments = await realApiService.getCommentsByPost(postId);
    return comments as unknown as ApiComment[];
  }

  async createComment(request: CreateCommentRequest): Promise<ApiComment> {
    const comment = await realApiService.createComment(request);
    return comment as unknown as ApiComment;
  }

  // Sessions API
  async createSession(): Promise<Session> {
    return await realApiService.createSession();
  }

  async getSession(id: string): Promise<Session> {
    return await realApiService.getSession(id);
  }

  async updateSession(id: string, name?: string, gender?: string, age?: string): Promise<Session> {
    return await realApiService.updateSession(id, name, gender, age);
  }

  async deleteSession(id: string): Promise<void> {
    return await realApiService.deleteSession(id);
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return await realApiService.healthCheck();
  }

  // Utility methods
  getApiUrl(): string {
    return apiConfig.baseUrl;
  }

  isUsingMock(): boolean {
    return false;
  }
}

export const unifiedApiService = new UnifiedApiService();
export default unifiedApiService;
