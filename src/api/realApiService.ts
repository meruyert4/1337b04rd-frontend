import { 
  Post, 
  Comment, 
  Session, 
  Character,
  CreatePostRequest, 
  CreatePostResponse, 
  GetPostsResponse, 
  GetPostResponse, 
  UpdatePostRequest, 
  UpdatePostResponse, 
  DeletePostResponse, 
  CreateCommentRequest, 
  CreateCommentResponse, 
  GetCommentsResponse 
} from './types';

export class RealApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8080') {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async makeFormRequest<T>(
    endpoint: string, 
    formData: FormData
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Posts API
  async getPosts(limit: number = 10, offset: number = 0, includeArchived: boolean = false): Promise<Post[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      include_archived: includeArchived.toString(),
    });
    
    return this.makeRequest<Post[]>(`/posts?${params}`);
  }

  async getPost(id: number): Promise<Post> {
    return this.makeRequest<Post>(`/posts/${id}`);
  }

  async createPost(postData: CreatePostRequest): Promise<Post> {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    
    if (postData.image) {
      formData.append('image', postData.image);
    }
    
    if (postData.expires_at) {
      formData.append('expires_at', postData.expires_at);
    }

    const response = await this.makeFormRequest<Post>(`/api/posts`, formData);
    return response;
  }

  async updatePost(request: UpdatePostRequest): Promise<Post> {
    const formData = new FormData();
    formData.append('id', request.id.toString());
    formData.append('title', request.title);
    formData.append('content', request.content);
    
    if (request.image) {
      formData.append('image', request.image);
    }
    
    return this.makeFormRequest<Post>(`/api/posts/${request.id}`, formData);
  }

  async deletePost(id: number): Promise<void> {
    return this.makeRequest<void>(`/posts/${id}`, { method: 'DELETE' });
  }

  async archivePost(id: number): Promise<void> {
    return this.makeRequest<void>(`/posts/${id}/archive`, { method: 'POST' });
  }

  async unarchivePost(id: number): Promise<void> {
    return this.makeRequest<void>(`/posts/${id}/unarchive`, { method: 'POST' });
  }

  async getPostsByAuthor(authorId: string, limit: number = 10, offset: number = 0): Promise<Post[]> {
    const params = new URLSearchParams({
      author_id: authorId,
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    return this.makeRequest<Post[]>(`/posts/author?${params}`);
  }

  // Comments API
  async getCommentsByPost(postId: number): Promise<Comment[]> {
    const params = new URLSearchParams({
      post_id: postId.toString(),
    });
    
    return this.makeRequest<Comment[]>(`/comments/post?${params}`);
  }

  async createComment(request: CreateCommentRequest): Promise<Comment> {
    const formData = new FormData();
    formData.append('post_id', request.post_id.toString());
    formData.append('title', request.title);
    formData.append('content', request.content);
    
    if (request.image) {
      formData.append('image', request.image);
    }
    
    if (request.reply_to_comment_id) {
      formData.append('reply_to_comment_id', request.reply_to_comment_id.toString());
    }
    
    return this.makeFormRequest<Comment>('/api/comments', formData);
  }

  async getComment(id: number): Promise<Comment> {
    return this.makeRequest<Comment>(`/api/comments/${id}`);
  }

  async updateComment(id: number, request: Partial<CreateCommentRequest>): Promise<Comment> {
    const formData = new FormData();
    formData.append('id', id.toString());
    
    if (request.title) formData.append('title', request.title);
    if (request.content) formData.append('content', request.content);
    if (request.image) formData.append('image', request.image);
    
    return this.makeFormRequest<Comment>(`/api/comments/${id}`, formData);
  }

  async deleteComment(id: number): Promise<void> {
    return this.makeRequest<void>(`/api/comments/${id}`, { method: 'DELETE' });
  }

  // Sessions API
  async createSession(): Promise<Session> {
    const formData = new FormData();
    
    return this.makeFormRequest<Session>('/api/sessions', formData);
  }

  async getSession(id: string): Promise<Session> {
    return this.makeRequest<Session>(`/api/sessions/${id}`);
  }

  async updateSession(id: string, name?: string, gender?: string, age?: string): Promise<Session> {
    const formData = new FormData();
    
    if (name) {
      formData.append('name', name);
    }
    
    if (gender) {
      formData.append('gender', gender);
    }
    
    if (age) {
      formData.append('age', age);
    }
    
    return this.makeFormRequest<Session>(`/api/sessions/${id}`, formData);
  }

  async deleteSession(id: string): Promise<void> {
    return this.makeRequest<void>(`/api/sessions/${id}`, { method: 'DELETE' });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.makeRequest<{ status: string }>('/health');
  }
}

export const realApiService = new RealApiService();
export default realApiService;
