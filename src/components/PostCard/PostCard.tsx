import React from 'react';
import { Post } from '../PostForm/PostForm';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  onView?: (postId: string) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  compact = false
}) => {
  const handleView = () => {
    if (onView) onView(post.id);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(post);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(post.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className={`post-card ${compact ? 'compact' : ''}`}>
      <div className="post-header">
        <h3 className="post-title" onClick={handleView}>
          {post.title}
        </h3>
        <div className="post-meta">
          {post.authorName && (
            <span className="post-author">👤 {post.authorName}</span>
          )}
          <span className="post-date">🕐 {formatDate(post.createdAt)}</span>
        </div>
      </div>

      <div className="post-content">
        <p className="post-text">
          {compact ? truncateContent(post.content) : post.content}
        </p>
        
        {post.imageURL && (
          <div className="post-image-container">
            <img 
              src={post.imageURL} 
              alt={post.title}
              className="post-image"
              onClick={handleView}
            />
          </div>
        )}
      </div>

      {showActions && (
        <div className="post-actions">
          {onView && (
            <button 
              className="action-btn view-btn"
              onClick={handleView}
            >
              👁️ View
            </button>
          )}
          
          {onEdit && (
            <button 
              className="action-btn edit-btn"
              onClick={handleEdit}
            >
              ✏️ Edit
            </button>
          )}
          
          {onDelete && (
            <button 
              className="action-btn delete-btn"
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}

      {!compact && (
        <div className="post-footer">
          <span className="post-id">ID: {post.id}</span>
        </div>
      )}
    </div>
  );
};

export default PostCard;
