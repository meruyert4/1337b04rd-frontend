import React, { useState, useEffect } from 'react';
import { Post } from '../../api/types';
import { detectImageOrientation, getImageSizeClass, ImageOrientation } from '../../utils/imageUtils';


interface PostCardProps {
  post: Post;
  onView?: (postId: number) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: number) => void;
  onArchive?: (postId: number) => void;
  onUnarchive?: (postId: number) => void;
  showActions?: boolean;
  compact?: boolean;
  currentUserId?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onView,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  showActions = true,
  compact = false,
  currentUserId 
}) => {
  const [imageOrientation, setImageOrientation] = useState<ImageOrientation>('default');

  // Detect image orientation when image URL changes
  useEffect(() => {
    if (post.image_url && !compact) {
      detectImageOrientation(post.image_url).then(setImageOrientation);
    }
  }, [post.image_url, compact]);

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
    <div className={`post-card ${compact ? 'compact' : ''}`} data-testid={`post-card-${post.id}`}>
      <div className="post-header" data-testid="post-header">
        <h3 className="post-title" onClick={handleView} data-testid="post-title">
          {post.title}
        </h3>
        <div className="post-meta" data-testid="post-meta">
          {post.author_name && (
            <div className="post-author-section" data-testid="post-author-section">
              <div className="post-author-avatar" data-testid="post-author-avatar">
                {post.author_image && post.author_image.trim() !== '' ? (
                  <img 
                    src={post.author_image} 
                    alt={post.author_name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                    data-testid="post-author-image"
                  />
                ) : null}
                <div className={`post-author-placeholder ${post.author_image && post.author_image.trim() !== '' ? 'hidden' : ''}`} data-testid="post-author-placeholder">
                  {post.author_name.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="post-author" data-testid="post-author-name">{post.author_name}</span>
            </div>
          )}
          <div className="post-meta-right" data-testid="post-meta-right">
            <span className="post-date" data-testid="post-date">{formatDate(post.created_at)}</span>
            {post.comments && post.comments.length > 0 && (
              <span className="post-comment-count" data-testid="post-comment-count">
                💬 {post.comments.length}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="post-content" data-testid="post-content">
        <p className="post-text" data-testid="post-text">
          {compact ? truncateContent(post.content) : post.content}
        </p>
        
        {post.image_url && (
          <div className="post-image-container" data-testid="post-image-container">
            {compact ? (
              <div className="attachment-indicator" onClick={handleView} data-testid="attachment-indicator">
                📎 Attachment
              </div>
            ) : (
              <img 
                src={post.image_url} 
                alt={post.title}
                className={`post-image ${getImageSizeClass(imageOrientation)}`}
                onClick={handleView}
                data-testid="post-image"
              />
            )}
          </div>
        )}
      </div>

      {showActions && (
        <div className="post-actions" data-testid="post-actions">
          {onView && (
            <button
              onClick={() => onView(post.id)}
              className="action-btn view-btn"
              data-testid="view-btn"
            >
              View
            </button>
          )}
          
          {onEdit && currentUserId && post.author_id === currentUserId && (
            <button 
              className="action-btn edit-btn"
              onClick={handleEdit}
              data-testid="edit-btn"
            >
              Edit
            </button>
          )}
          
          {onDelete && currentUserId && post.author_id === currentUserId && (
            <button 
              className="action-btn delete-btn"
              onClick={handleDelete}
              data-testid="delete-btn"
            >
              Delete
            </button>
          )}
          
          {onArchive && currentUserId && post.author_id === currentUserId && !post.is_archive && (
            <button 
              className="action-btn archive-btn"
              onClick={() => onArchive(post.id)}
              data-testid="archive-btn"
            >
              Archive
            </button>
          )}
          
          {onUnarchive && currentUserId && post.author_id === currentUserId && post.is_archive && (
            <button 
              className="action-btn unarchive-btn"
              onClick={() => onUnarchive(post.id)}
              data-testid="unarchive-btn"
            >
              Unarchive
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
