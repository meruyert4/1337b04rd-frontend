export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_image?: string;
  image_url?: string;
  is_archive: boolean;
  created_at: string;
  expires_at?: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  post_id: number;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_image?: string;
  image_url?: string;
  reply_to_comment_id?: number;
  created_at: string;
  replies?: Comment[];
}

export interface Session {
  id: string;
  name: string;
  gender: string;
  age: string;
  image: string;
  created_at: string;
  expires_at: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  image?: File;
  expires_at?: string;
  author_id?: string;
  author_name?: string;
}

export interface CreatePostResponse {
  success: boolean;
  post?: Post;
  error?: string;
}

export interface GetPostsResponse {
  success: boolean;
  posts?: Post[];
  error?: string;
}

export interface GetPostResponse {
  success: boolean;
  post?: Post;
  error?: string;
}

export interface UpdatePostRequest {
  id: number;
  title: string;
  content: string;
  image?: File;
  author_id?: string;
  author_name?: string;
}

export interface UpdatePostResponse {
  success: boolean;
  post?: Post;
  error?: string;
}

export interface DeletePostResponse {
  success: boolean;
  error?: string;
}

export interface CreateCommentRequest {
  post_id: number;
  title: string;
  content: string;
  image?: File;
  reply_to_comment_id?: number;
}

export interface CreateCommentResponse {
  success: boolean;
  comment?: Comment;
  error?: string;
}

export interface UpdateCommentRequest {
  id: number;
  title: string;
  content: string;
  image?: File;
}

export interface UpdateCommentResponse {
  success: boolean;
  comment?: Comment;
  error?: string;
}

export interface GetCommentsResponse {
  success: boolean;
  comments?: Comment[];
  error?: string;
}

export interface DeleteCommentResponse {
  success: boolean;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
