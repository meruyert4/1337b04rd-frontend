import React, { useState } from 'react';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../../api/types';
import { api } from '../../api';

interface CommentFormProps {
  postId: number;
  replyToCommentId?: number;
  editingComment?: Comment;
  onCommentCreated: (comment?: Comment) => void;
  onCancel?: () => void;
  currentUserId?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  replyToCommentId,
  editingComment,
  onCommentCreated,
  onCancel,
  currentUserId
}) => {
  const [title, setTitle] = useState(editingComment?.title || '');
  const [content, setContent] = useState(editingComment?.content || '');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(editingComment?.image_url || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingComment) {
        // Update existing comment
        const updateRequest: UpdateCommentRequest = {
          id: editingComment.id,
          title: title.trim(),
          content: content.trim(),
          image: image || undefined
        };
        await api.updateComment(updateRequest);
        
        // Pass updated comment data
        const updatedComment: Comment = {
          ...editingComment,
          title: title.trim(),
          content: content.trim(),
          image_url: imagePreview || editingComment.image_url
        };
        onCommentCreated(updatedComment);
      } else {
        // Create new comment
        const createRequest: CreateCommentRequest = {
          post_id: postId,
          title: title.trim(),
          content: content.trim(),
          image: image || undefined,
          reply_to_comment_id: replyToCommentId
        };
        const createdComment = await api.createComment(createRequest);
        onCommentCreated(createdComment);
      }

      // Reset form
      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error('Failed to save comment:', err);
      console.error('Error details:', err);
      setError(`Failed to save comment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Reset form if no cancel handler
      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview(null);
    }
  };

  return (
    <div className="comment-form">
      <form onSubmit={handleSubmit} className="comment-form-content">
        <div className="comment-form-header">
          <h4>
            {editingComment ? 'Edit Comment' : replyToCommentId ? 'Reply to Comment' : 'Add Comment'}
          </h4>
          {onCancel && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="comment-form-cancel"
            >
              ✕
            </button>
          )}
        </div>

        {error && (
          <div className="comment-form-error">
            {error}
          </div>
        )}

        <div className="comment-form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Comment title"
            className="comment-form-input"
            required
          />
        </div>

        <div className="comment-form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment..."
            className="comment-form-textarea"
            rows={4}
            required
          />
        </div>

        <div className="comment-form-group">
          <label className="comment-form-file-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="comment-form-file-input"
            />
            <span className="comment-form-file-text">
              {image ? 'Change Image' : 'Add Image (Optional)'}
            </span>
          </label>
        </div>

        {imagePreview && (
          <div className="comment-form-image-preview">
            <img src={imagePreview} alt="Preview" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="comment-form-remove-image"
            >
              Remove Image
            </button>
          </div>
        )}

        <div className="comment-form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="comment-form-btn cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="comment-form-btn submit-btn"
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? 'Saving...' : editingComment ? 'Update Comment' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
