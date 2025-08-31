import React from 'react';
import { Post } from '../../api/types';
import PostCard from '../PostCard/PostCard';


interface PostListProps {
  posts: Post[];
  onViewPost?: (postId: number) => void;
  onEditPost?: (post: Post) => void;
  onDeletePost?: (postId: number) => void;
  showActions?: boolean;
  compact?: boolean;
  emptyMessage?: string;
  loading?: boolean;
  currentUserId?: string;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  onViewPost,
  onEditPost,
  onDeletePost,
  showActions = true,
  compact = false,
  emptyMessage = "No posts found in this dimension. Be the first to create chaos!",
  loading = false,
  currentUserId
}) => {
  // Safety check - if posts is null/undefined, show loading or empty state
  if (!posts) {
    return (
      <div className="post-list-loading">
        <div className="loading-spinner"></div>
        <p>🔄 Initializing posts from the multiverse...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="post-list-loading">
        <div className="loading-spinner"></div>
        <p>🔄 Loading posts from the multiverse...</p>
      </div>
    );
  }

  // Handle empty posts array
  if (posts.length === 0) {
    return (
      <div className="post-list-empty">
        <div className="empty-icon">🌌</div>
        <h3>Empty Space</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onView={onViewPost}
          onEdit={onEditPost}
          onDelete={onDeletePost}
          showActions={showActions}
          compact={compact}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default PostList;
