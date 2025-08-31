import React from 'react';
import { Post } from '../../api/types';


interface PostCardProps {
  post: Post;
  onView?: (postId: number) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: number) => void;
  showActions?: boolean;
  compact?: boolean;
  currentUserId?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  compact = false,
  currentUserId 
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
          {post.author_name && (
            <div className="post-author-section">
              <div className="post-author-avatar">
                {post.author_image ? (
                  <img 
                    src={post.author_image} 
                    alt={post.author_name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`post-author-placeholder ${post.author_image ? 'hidden' : ''}`}>
                  {post.author_name.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="post-author">{post.author_name}</span>
            </div>
          )}
          <span className="post-date">{formatDate(post.created_at)}</span>
        </div>
      </div>

      <div className="post-content">
        <p className="post-text">
          {compact ? truncateContent(post.content) : post.content}
        </p>
        
        {post.image_url && (
          <div className="post-image-container">
            <img 
              src={post.image_url} 
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
              onClick={() => onView(post.id)}
              className="action-btn view-btn"
            >
              View
            </button>
          )}
          
          {onEdit && currentUserId && post.author_id === currentUserId && (
            <button 
              className="action-btn edit-btn"
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
          
          {onDelete && currentUserId && post.author_id === currentUserId && (
            <button 
              className="action-btn delete-btn"
              onClick={handleDelete}
            >
              Delete
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
