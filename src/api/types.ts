export interface Post {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  createdAt: string;
  authorName?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  image?: File;
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
  title?: string;
  content?: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
