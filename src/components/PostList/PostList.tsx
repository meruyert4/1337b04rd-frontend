import React from 'react';
import { Post } from '../PostForm/PostForm';
import PostCard from '../PostCard/PostCard';
import './PostList.css';

interface PostListProps {
  posts: Post[];
  onViewPost?: (postId: string) => void;
  onEditPost?: (post: Post) => void;
  onDeletePost?: (postId: string) => void;
  showActions?: boolean;
  compact?: boolean;
  emptyMessage?: string;
  loading?: boolean;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  onViewPost,
  onEditPost,
  onDeletePost,
  showActions = true,
  compact = false,
  emptyMessage = "No posts found in this dimension. Be the first to create chaos! 🧬",
  loading = false
}) => {
  if (loading) {
    return (
      <div className="post-list-loading">
        <div className="loading-spinner"></div>
        <p>🔄 Loading posts from the multiverse...</p>
      </div>
    );
  }

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
        />
      ))}
    </div>
  );
};

export default PostList;
