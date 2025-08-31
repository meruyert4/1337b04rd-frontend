# Frontend-Backend API Connection Setup

## Overview

Your React frontend is now configured to connect to the Go backend API. The system automatically switches between mock and real API based on configuration.

## Quick Setup

### 1. Create Environment File

Create a `.env` file in your `1337b04rd-frontend` directory:

```bash
# Backend API Configuration
REACT_APP_API_URL=http://localhost:8080/api

# Frontend Configuration
REACT_APP_USE_MOCK_API=false
REACT_APP_ENABLE_LOGGING=true
```

### 2. Start Backend

In your `1337b04rd-backend` directory:

```bash
# Create .env file with your PostgreSQL password
# Then run:
go run cmd/main.go
```

### 3. Start Frontend

In your `1337b04rd-frontend` directory:

```bash
npm start
```

## API Services Available

### Main Service (Recommended)
```typescript
import { api } from './api';

// Use the unified service
const posts = await api.getPosts();
const post = await api.createPost({
  title: "My Post",
  content: "Post content",
  author_id: "user123",
  author_name: "John Doe"
});
```

### Individual Services
```typescript
import { 
  unifiedApiService, 
  realApiService, 
  postService as mockService 
} from './api';

// Unified service (auto-switches between mock/real)
const posts = await unifiedApiService.getPosts();

// Real API service only
const posts = await realApiService.getPosts();

// Mock service only
const posts = await mockService.getPosts();
```

## Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:8080/api` | Backend API base URL |
| `REACT_APP_USE_MOCK_API` | `false` | Force mock API usage |
| `REACT_APP_ENABLE_LOGGING` | `true` | Enable API logging |

### Switching Between Mock and Real API

**Use Real API (Default):**
```bash
REACT_APP_USE_MOCK_API=false
```

**Use Mock API:**
```bash
REACT_APP_USE_MOCK_API=true
```

**Force Mock API in Development:**
```typescript
// In your component
import { apiConfig } from './api';

if (apiConfig.useMockApi) {
  console.log('Using mock API');
} else {
  console.log('Using real API:', apiConfig.baseUrl);
}
```

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/{id}` - Get specific post
- `POST /api/posts` - Create new post
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post
- `POST /api/posts/{id}/archive` - Archive post
- `POST /api/posts/{id}/unarchive` - Unarchive post
- `GET /api/posts/author?author_id={id}` - Get posts by author

### Comments
- `GET /api/comments/post?post_id={id}` - Get comments by post
- `POST /api/comments` - Create comment
- `GET /api/comments/{id}` - Get specific comment
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

### Sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions/{id}` - Get session
- `PUT /api/sessions/{id}` - Update session
- `DELETE /api/sessions/{id}` - Delete session

### Health Check
- `GET /health` - Backend health status

## Error Handling

The unified service automatically falls back to mock data if the real API fails:

```typescript
try {
  const posts = await api.getPosts();
  // Use real data
} catch (error) {
  // Automatically falls back to mock data
  console.log('Using mock data due to API error');
}
```

## Testing the Connection

### 1. Health Check
```typescript
import { api } from './api';

const health = await api.healthCheck();
console.log('Backend status:', health.status);
```

### 2. Test Posts API
```typescript
import { api } from './api';

// Get posts
const posts = await api.getPosts();
console.log('Posts:', posts);

// Create a test post
const newPost = await api.createPost({
  title: "Test Post",
  content: "This is a test post",
  author_id: "test123",
  author_name: "Test User"
});
console.log('Created post:', newPost);
```

## Troubleshooting

### Backend Not Running
- Ensure PostgreSQL is running and accessible
- Check backend logs for connection errors
- Verify database credentials in backend `.env`

### CORS Issues
- Backend has CORS enabled for `localhost:3000`
- If using different port, update backend CORS settings

### API Connection Failed
- Check `REACT_APP_API_URL` in frontend `.env`
- Ensure backend is running on correct port
- Check browser console for network errors

### Fallback to Mock
- If real API fails, check backend logs
- Mock service automatically activates as fallback
- Check `api.isUsingMock()` to verify current mode

## Development Workflow

1. **Start with Mock API** for UI development
2. **Switch to Real API** when backend is ready
3. **Use Unified Service** for automatic fallback
4. **Monitor Console** for API mode and errors

## Example Component Usage

```typescript
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Post } from '../api/types';

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await api.getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>By: {post.author_name}</small>
        </div>
      ))}
    </div>
  );
};

export default PostList;
```
