export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
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
  image_url?: string;
  reply_to_comment_id?: number;
  created_at: string;
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
  image: string;
  status: string;
  species: string;
  gender: string;
  type: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  image?: File;
  expires_at?: string;
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

export interface GetCommentsResponse {
  success: boolean;
  comments?: Comment[];
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
