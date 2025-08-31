import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import PostForm, { PostFormData } from './components/PostForm/PostForm';
import PostList from './components/PostList/PostList';
import PostCard from './components/PostCard/PostCard';
import { Post } from './components/PostForm/PostForm';
import postService from './api/postService';
import './App.css';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'view'>('list');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const response = await postService.getPosts();
    if (response.success && response.posts) {
      setPosts(response.posts);
    }
    setLoading(false);
  };

  const handleCreatePost = async (data: PostFormData) => {
    const response = await postService.createPost(data);
    if (response.success && response.post) {
      setPosts(prev => [response.post!, ...prev]);
      setShowCreateForm(false);
      setViewMode('list');
    }
  };

  const handleViewPost = async (postId: string) => {
    const response = await postService.getPost(postId);
    if (response.success && response.post) {
      setSelectedPost(response.post);
      setViewMode('view');
    }
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setViewMode('create');
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      const response = await postService.deletePost(postId);
      if (response.success) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        if (selectedPost?.id === postId) {
          setSelectedPost(null);
          setViewMode('list');
        }
      }
    }
  };

  const handleUpdatePost = async (data: PostFormData) => {
    if (selectedPost) {
      const response = await postService.updatePost(selectedPost.id, data);
      if (response.success && response.post) {
        setPosts(prev => prev.map(p => p.id === selectedPost.id ? response.post! : p));
        setSelectedPost(null);
        setViewMode('list');
      }
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'create':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>🧬 {selectedPost ? 'Edit Post' : 'Create New Post'}</h2>
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
              <h2>👁️ View Post</h2>
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
                🧬 Create New Post
              </button>
            </div>
            <PostList
              posts={posts}
              onViewPost={handleViewPost}
              onEditPost={handleEditPost}
              onDeletePost={handleDeletePost}
              loading={loading}
              showActions={true}
            />
          </div>
        );
    }
  };

  return (
    <div className="app">
      <Header currentPage={viewMode === 'list' ? 'posts' : 'home'} />
      
      <main className="main-content">
        {renderContent()}
      </main>

      <footer className="footer">
        <p>🧬 Built by a Rick who got tired of Reddit. No warranties. Not even existential.</p>
      </footer>
    </div>
  );
}

export default App;
