import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import MyPosts from './components/MyPosts/MyPosts';
import PostForm, { PostFormData } from './components/PostForm/PostForm';
import PostCard from './components/PostCard/PostCard';
import PostList from './components/PostList/PostList';
import { Post, CreatePostRequest, UpdatePostRequest } from './api/types';
import { api } from './api';
import { useSession } from './hooks/useSession';
import { ThemeProvider } from './theme';


// Main Posts Component (Catalog)
const PostsCatalog: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [viewMode, setViewMode] = React.useState<'list' | 'create' | 'view'>('list');
  const { userId, userName, session } = useSession();

  React.useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await api.getPosts();
      setPosts(fetchedPosts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
    }
    setLoading(false);
  };

  const handleCreatePost = async (data: PostFormData) => {
    console.log('Creating post with data:', data);
    console.log('Current userId:', userId);
    console.log('Current userName:', userName);
    
    try {
      const createRequest: CreatePostRequest = {
        title: data.title,
        content: data.content,
        image: data.image,
        author_id: userId,
        author_name: userName,
        author_image: session?.image
      };
      
      console.log('Create request:', createRequest);
      const newPost = await api.createPost(createRequest);
      console.log('Created post:', newPost);
      
      setPosts(prev => [newPost, ...prev]);
      setShowCreateForm(false);
      setViewMode('list');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleViewPost = async (postId: number) => {
    try {
      const post = await api.getPost(postId);
      if (post) {
        setSelectedPost(post);
        setViewMode('view');
      }
    } catch (error) {
      console.error('Failed to view post:', error);
    }
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setViewMode('create');
  };

  const handleDeletePost = async (postId: number) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await api.deletePost(postId);
        setPosts(prev => prev.filter(p => p.id !== postId));
        if (selectedPost?.id === postId) {
          setSelectedPost(null);
          setViewMode('list');
        }
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handleUpdatePost = async (data: PostFormData) => {
    if (selectedPost) {
      try {
        const updateRequest: UpdatePostRequest = {
          id: selectedPost.id,
          title: data.title,
          content: data.content,
          image: data.image,
          author_id: userId,
          author_name: userName,
          author_image: session?.image
        };
        
        const updatedPost = await api.updatePost(updateRequest);
        setPosts(prev => prev.map(p => p.id === selectedPost.id ? updatedPost : p));
        setSelectedPost(null);
        setViewMode('list');
      } catch (error) {
        console.error('Failed to update post:', error);
      }
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'create':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>{selectedPost ? 'Edit Post' : 'Create New Post'}</h2>
              <button 
                className="back-btn"
                onClick={() => {
                  setViewMode('list');
                  setSelectedPost(null);
                }}
              >
                ← Back to Posts
              </button>
            </div>
            <PostForm
              onSubmit={selectedPost ? handleUpdatePost : handleCreatePost}
              submitButtonText={selectedPost ? 'Update Post' : 'Create Post'}
              initialData={selectedPost || {}}
              mode={selectedPost ? 'edit' : 'create'}
            />
          </div>
        );

      case 'view':
        return selectedPost ? (
          <div className="content-section">
            <div className="section-header">
              <h2>View Post</h2>
              <button 
                className="back-btn"
                onClick={() => setViewMode('list')}
              >
                ← Back to Posts
              </button>
            </div>
            <PostCard
              post={selectedPost}
              showActions={true}
              onEdit={() => setViewMode('create')}
              onDelete={handleDeletePost}
            />
          </div>
        ) : null;

      default:
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>🌌 Posts from the Multiverse</h2>
              <button 
                className="create-btn"
                onClick={() => setViewMode('create')}
              >
                Create New Post
              </button>
            </div>
            <PostList
              posts={posts}
              onViewPost={handleViewPost}
              onEditPost={handleEditPost}
              onDeletePost={handleDeletePost}
              loading={loading}
              showActions={true}
              currentUserId={userId}
            />
          </div>
        );
    }
  };

  return (
    <div className="posts-catalog">
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

// Home Component
const Home: React.FC = () => {
  return (
    <div className="home">
      <main className="main-content">
        <div className="content-section">
          <div className="section-header">
            <h2>🌌 Welcome to 1337b04rd</h2>
          </div>
          <div className="welcome-content">
            <p>Welcome to the multiverse of posts! Explore posts from across dimensions or create your own.</p>
            <div className="welcome-actions">
              <a href="/posts" className="welcome-btn">Browse Posts</a>
              <a href="/my-posts" className="welcome-btn">My Posts</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Archive Component
const Archive: React.FC = () => {
  return (
    <div className="archive">
      <main className="main-content">
        <div className="content-section">
          <div className="section-header">
            <h2>🌌 Archive</h2>
          </div>
          <p>Archive functionality coming soon...</p>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <div className="app">
          <Header />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<PostsCatalog />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <footer className="footer">
            <p>🧬 Built by a Rick who got tired of Reddit. No warranties. Not even existential.</p>
          </footer>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
