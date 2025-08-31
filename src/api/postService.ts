import { 
  Post, 
  CreatePostRequest, 
  CreatePostResponse, 
  GetPostsResponse, 
  GetPostResponse,
  UpdatePostRequest,
  UpdatePostResponse,
  DeletePostResponse
} from './types';

// Mock data for development
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Welcome to 1337b04rd! 🧬',
    content: 'First post in this dimension! Ready to explore the multiverse of ideas and chaos. No Jerries allowed!',
    createdAt: new Date().toISOString(),
    authorName: 'Rick C-137'
  },
  {
    id: '2',
    title: 'My New Plumbus Design 💎',
    content: 'Just finished crafting the most efficient plumbus ever. It\'s got extra dinglebops and a revolutionary schleem distribution system.',
    imageURL: 'https://via.placeholder.com/400x300/88ff00/000000?text=Plumbus',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    authorName: 'Morty Prime'
  },
  {
    id: '3',
    title: 'Portal Gun Malfunction 😅',
    content: 'So I was trying to get to dimension C-132 for some interdimensional tacos, but ended up in a universe where everyone is made of cheese. Not complaining though, the fondue parties are wild!',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    authorName: 'Evil Morty'
  }
];

class PostService {
  private posts: Post[] = [...mockPosts];

  // Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all posts
  async getPosts(): Promise<GetPostsResponse> {
    try {
      await this.delay(500); // Simulate network delay
      return {
        success: true,
        posts: [...this.posts]
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch posts from the multiverse'
      };
    }
  }

  // Get single post by ID
  async getPost(id: string): Promise<GetPostResponse> {
    try {
      await this.delay(300);
      const post = this.posts.find(p => p.id === id);
      
      if (!post) {
        return {
          success: false,
          error: 'Post not found in this dimension'
        };
      }

      return {
        success: true,
        post
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch post from the multiverse'
      };
    }
  }

  // Create new post
  async createPost(request: CreatePostRequest): Promise<CreatePostResponse> {
    try {
      await this.delay(800);
      
      const newPost: Post = {
        id: Date.now().toString(),
        title: request.title,
        content: request.content,
        imageURL: request.image ? URL.createObjectURL(request.image) : undefined,
        createdAt: new Date().toISOString(),
        authorName: `Rick ${Math.floor(Math.random() * 1000)}`
      };

      this.posts.unshift(newPost);

      return {
        success: true,
        post: newPost
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create post in the multiverse'
      };
    }
  }

  // Update existing post
  async updatePost(id: string, request: UpdatePostRequest): Promise<UpdatePostResponse> {
    try {
      await this.delay(600);
      
      const postIndex = this.posts.findIndex(p => p.id === id);
      
      if (postIndex === -1) {
        return {
          success: false,
          error: 'Post not found in this dimension'
        };
      }

      const updatedPost = {
        ...this.posts[postIndex],
        ...request,
        imageURL: request.image ? URL.createObjectURL(request.image) : this.posts[postIndex].imageURL
      };

      this.posts[postIndex] = updatedPost;

      return {
        success: true,
        post: updatedPost
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update post in the multiverse'
      };
    }
  }

  // Delete post
  async deletePost(id: string): Promise<DeletePostResponse> {
    try {
      await this.delay(400);
      
      const postIndex = this.posts.findIndex(p => p.id === id);
      
      if (postIndex === -1) {
        return {
          success: false,
          error: 'Post not found in this dimension'
        };
      }

      this.posts.splice(postIndex, 1);

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete post from the multiverse'
      };
    }
  }

  // Search posts (mock implementation)
  async searchPosts(query: string): Promise<GetPostsResponse> {
    try {
      await this.delay(400);
      
      const filteredPosts = this.posts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      );

      return {
        success: true,
        posts: filteredPosts
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to search posts in the multiverse'
      };
    }
  }
}

// Export singleton instance
export const postService = new PostService();
export default postService;
