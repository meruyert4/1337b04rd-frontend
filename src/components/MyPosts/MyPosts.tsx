import React, { useState, useEffect } from 'react';
import PostList from '../PostList/PostList';
import PostCard from '../PostCard/PostCard';
import PostForm, { PostFormData } from '../PostForm/PostForm';
import { Post, CreatePostRequest, UpdatePostRequest } from '../../api/types';
import { api } from '../../api';
import { useSession } from '../../hooks/useSession';


const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'view'>('list');
  const { userId, userName, session } = useSession();

  const loadMyPosts = React.useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const fetchedPosts = await api.getPostsByAuthor(userId);
      setPosts(fetchedPosts || []);
    } catch (error) {
      console.error('Failed to load my posts:', error);
      setPosts([]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadMyPosts();
    }
  }, [userId, loadMyPosts]);

  const handleCreatePost = async (data: PostFormData) => {
    try {
      const createRequest: CreatePostRequest = {
        title: data.title,
        content: data.content,
        image: data.image,
        author_id: userId,
        author_name: userName,
        author_image: session?.image
      };
      
      const newPost = await api.createPost(createRequest);
      setPosts(prev => [newPost, ...prev]);
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
                ← Back to My Posts
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
                ← Back to My Posts
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
              <h2>🌌 My Posts from the Multiverse</h2>
              <button 
                className="create-btn"
                onClick={() => setViewMode('create')}
              >
                Create New Post
              </button>
            </div>
            {!userId ? (
              <div className="no-session-message">
                <p>Please create a session to view your posts.</p>
              </div>
            ) : (
              <PostList
                posts={posts}
                onViewPost={handleViewPost}
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
                loading={loading}
                showActions={true}
                currentUserId={userId}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="my-posts">
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default MyPosts;
