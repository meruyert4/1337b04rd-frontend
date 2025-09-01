import React, { useState, useEffect } from 'react';
import PostCard from '../PostCard/PostCard';
import PostList from '../PostList/PostList';
import { Post } from '../../api/types';
import { api } from '../../api';
import { useSession } from '../../hooks/useSession';

const Archive: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'view'>('list');
  const { userId } = useSession();

  useEffect(() => {
    fetchArchivedPosts();
  }, []);

  const fetchArchivedPosts = async () => {
    try {
      setLoading(true);
      const allPosts = await api.getPosts(100, 0, true); // include_archived = true
      // Filter only archived posts
      const archivedPosts = allPosts.filter(post => post.is_archive);
      setPosts(archivedPosts);
    } catch (error) {
      console.error('Failed to fetch archived posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPost = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setViewMode('view');
    }
  };

  const handleUnarchivePost = async (postId: number) => {
    if (window.confirm('Are you sure you want to unarchive this post? It will be moved back to the main posts.')) {
      try {
        await api.unarchivePost(postId);
        setPosts(prev => prev.filter(p => p.id !== postId));
        if (selectedPost?.id === postId) {
          setSelectedPost(null);
          setViewMode('list');
        }
      } catch (error) {
        console.error('Failed to unarchive post:', error);
      }
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'view':
        return selectedPost ? (
          <div className="content-section">
            <div className="section-header">
              <h2>View Archived Post</h2>
              <button 
                className="back-btn"
                onClick={() => setViewMode('list')}
              >
                ← Back to Archive
              </button>
            </div>
            <PostCard
              post={selectedPost}
              showActions={true}
              onUnarchive={handleUnarchivePost}
            />
          </div>
        ) : null;

      default:
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>🌌 Archive</h2>
            </div>
            <PostList
              posts={posts}
              onViewPost={handleViewPost}
              onUnarchivePost={handleUnarchivePost}
              loading={loading}
              showActions={true}
              compact={true}
              currentUserId={userId}
              emptyMessage="No archived posts found. The multiverse is clean!"
            />
          </div>
        );
    }
  };

  return (
    <div className="archive">
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Archive;
