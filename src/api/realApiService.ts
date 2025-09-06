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
  UpdateCommentRequest,
  UpdateCommentResponse,
  GetCommentsResponse,
  DeleteCommentResponse
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
      credentials: 'include',
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
      
      // Check if response has content to parse as JSON
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      if (contentType && contentType.includes('application/json') && contentLength !== '0') {
        return await response.json();
      } else {
        // For empty responses (like archive/unarchive), return undefined
        return undefined as T;
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async makeFormRequest<T>(
    endpoint: string, 
    formData: FormData,
    method: string = 'POST'
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    
    
    try {
      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        body: formData,
      });
      
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Response data:', result);
      return result;
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
    
    return this.makeRequest<Post[]>(`/api/posts?${params}`);
  }

  async getPost(id: number): Promise<Post> {
    return this.makeRequest<Post>(`/api/posts/${id}`);
  }

  async createPost(postData: CreatePostRequest): Promise<Post> {
    console.log('Creating post with data:', postData);
    
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    
    if (postData.image) {
      formData.append('image', postData.image);
    }
    
    if (postData.expires_at) {
      formData.append('expires_at', postData.expires_at);
    }

    if (postData.author_id) {
      formData.append('author_id', postData.author_id);
    }

    if (postData.author_name) {
      formData.append('author_name', postData.author_name);
    }


    console.log('Sending request to:', `/api/posts`);
    console.log('With credentials:', 'include');
    
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

    if (request.author_id) {
      formData.append('author_id', request.author_id);
    }

    if (request.author_name) {
      formData.append('author_name', request.author_name);
    }
    
    return this.makeFormRequest<Post>(`/api/posts/${request.id}`, formData, 'PUT');
  }

  async deletePost(id: number): Promise<void> {
    return this.makeRequest<void>(`/api/posts/${id}`, { 
      method: 'DELETE',
      credentials: 'include'
    });
  }

  async archivePost(id: number): Promise<void> {
    console.log('API: Archiving post with ID:', id);
    try {
      await this.makeRequest<void>(`/api/posts/${id}/archive`, { 
        method: 'POST',
        credentials: 'include'
      });
      console.log('API: Archive request successful');
    } catch (error) {
      console.error('API: Archive request failed:', error);
      throw error;
    }
  }

  async unarchivePost(id: number): Promise<void> {
    console.log('API: Unarchiving post with ID:', id);
    try {
      await this.makeRequest<void>(`/api/posts/${id}/unarchive`, { 
        method: 'POST',
        credentials: 'include'
      });
      console.log('API: Unarchive request successful');
    } catch (error) {
      console.error('API: Unarchive request failed:', error);
      throw error;
    }
  }

  async getPostsByAuthor(authorId: string, limit: number = 10, offset: number = 0): Promise<Post[]> {
    const params = new URLSearchParams({
      author_id: authorId,
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    return this.makeRequest<Post[]>(`/api/posts/author?${params}`);
  }

  // Character API (Rick and Morty)
  async getRandomCharacter(): Promise<Character> {
    return this.makeRequest<Character>('/api/characters/random');
  }

  async getAllCharacters(): Promise<Character[]> {
    return this.makeRequest<Character[]>('/api/characters');
  }

  // Comments API
  async getCommentsByPost(postId: number): Promise<Comment[]> {
    const params = new URLSearchParams({
      post_id: postId.toString(),
    });
    
    try {
      const comments = await this.makeRequest<Comment[]>(`/api/comments/post?${params}`);
      // Ensure we always return an array, even if the API returns null/undefined
      return Array.isArray(comments) ? comments : [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
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

  async updateComment(request: UpdateCommentRequest): Promise<Comment> {
    const formData = new FormData();
    formData.append('title', request.title);
    formData.append('content', request.content);
    
    if (request.image) {
      formData.append('image', request.image);
    }
    
    return this.makeFormRequest<Comment>(`/api/comments/${request.id}`, formData, 'PUT');
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
    
    return this.makeFormRequest<Session>(`/api/sessions/${id}`, formData, 'PUT');
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
