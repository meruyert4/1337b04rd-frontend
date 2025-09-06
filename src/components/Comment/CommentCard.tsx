import React, { useState } from 'react';
import { Comment } from '../../api/types';
import CommentForm from './CommentForm';

interface CommentCardProps {
  comment: Comment;
  onReply?: (commentId: number) => void;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: number) => void;
  onCommentCreated?: () => void;
  currentUserId?: string;
  isReply?: boolean;
  depth?: number;
  postId: number;
  replyingTo?: number | null;
  onCancelReply?: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  onCommentCreated,
  currentUserId,
  isReply = false,
  depth = 0,
  postId,
  replyingTo,
  onCancelReply
}) => {
  const [showReplies, setShowReplies] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(comment.title);
  const [editContent, setEditContent] = useState(comment.content);

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

  const handleEdit = () => {
    if (onEdit) {
      onEdit({
        ...comment,
        title: editTitle,
        content: editContent
      });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(comment.title);
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      if (onDelete) {
        onDelete(comment.id);
      }
    }
  };

  const canEdit = currentUserId === comment.author_id;
  const maxDepth = 3; // Maximum nesting depth
  const shouldShowReplies = comment.replies && comment.replies.length > 0 && depth < maxDepth;

  return (
    <div className={`comment-card ${isReply ? 'comment-reply' : ''}`} style={{ marginLeft: `${depth * 20}px` }}>
      <div className="comment-header">
        <div className="comment-author-section">
          <div className="comment-author-avatar">
            {comment.author_image && comment.author_image.trim() !== '' ? (
              <img 
                src={comment.author_image} 
                alt={comment.author_name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`comment-author-placeholder ${comment.author_image && comment.author_image.trim() !== '' ? 'hidden' : ''}`}>
              {comment.author_name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="comment-author-info">
            <span className="comment-author-name">{comment.author_name}</span>
            <span className="comment-date">{formatDate(comment.created_at)}</span>
          </div>
        </div>
        
        {canEdit && (
          <div className="comment-actions">
            <button 
              className="comment-edit-btn"
              onClick={() => setIsEditing(true)}
              title="Edit comment"
            >
              Edit
            </button>
            <button 
              className="comment-delete-btn"
              onClick={handleDelete}
              title="Delete comment"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="comment-content">
        {isEditing ? (
          <div className="comment-edit-form">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="comment-edit-title"
              placeholder="Comment title"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="comment-edit-content"
              placeholder="Comment content"
              rows={3}
            />
            <div className="comment-edit-actions">
              <button className="comment-save-btn" onClick={handleEdit}>
                Save
              </button>
              <button className="comment-cancel-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h4 className="comment-title">{comment.title}</h4>
            <p className="comment-text">{comment.content}</p>
            {comment.image_url && (
              <div className="comment-image-container">
                <img 
                  src={comment.image_url} 
                  alt="Comment attachment"
                  className="comment-image"
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className="comment-footer">
        {!isReply && depth < maxDepth && (
          <button 
            className="comment-reply-btn"
            onClick={() => onReply && onReply(comment.id)}
          >
            Reply
          </button>
        )}
        
        {shouldShowReplies && (
          <button 
            className="comment-toggle-replies-btn"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? 'Hide' : 'Show'} {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
          </button>
        )}
      </div>

      {shouldShowReplies && showReplies && (
        <div className="comment-replies">
          {comment.replies!.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onCommentCreated={onCommentCreated}
              currentUserId={currentUserId}
              isReply={true}
              depth={depth + 1}
              postId={postId}
              replyingTo={replyingTo}
              onCancelReply={onCancelReply}
            />
          ))}
        </div>
      )}

      {/* Reply form appears under the comment being replied to */}
      {replyingTo === comment.id && currentUserId && (
        <div className="comment-reply-form-container">
          <CommentForm
            postId={postId}
            replyToCommentId={comment.id}
            onCommentCreated={() => {
              if (onCommentCreated) {
                onCommentCreated();
              }
              if (onCancelReply) {
                onCancelReply();
              }
            }}
            onCancel={onCancelReply}
            currentUserId={currentUserId}
          />
        </div>
      )}
    </div>
  );
};

export default CommentCard;
