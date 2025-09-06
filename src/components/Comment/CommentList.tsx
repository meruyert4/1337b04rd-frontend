import React, { useState, useEffect } from 'react';
import { Comment } from '../../api/types';
import { api } from '../../api';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';

interface CommentListProps {
  postId: number;
  currentUserId?: string;
  onCommentUpdate?: () => void;
}

const CommentList: React.FC<CommentListProps> = ({
  postId,
  currentUserId,
  onCommentUpdate
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching comments for postId:', postId);
      const fetchedComments = await api.getCommentsByPost(postId);
      console.log('Fetched comments:', fetchedComments);
      
      // Organize comments into a tree structure
      const organizedComments = organizeCommentsIntoTree(fetchedComments);
      console.log('Organized comments:', organizedComments);
      setComments(organizedComments);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setError('Failed to load comments');
      setComments([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const organizeCommentsIntoTree = (flatComments: Comment[] | null | undefined): Comment[] => {
    // Handle null, undefined, or empty array
    if (!flatComments || !Array.isArray(flatComments) || flatComments.length === 0) {
      return [];
    }

    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create map of all comments
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into tree structure
    flatComments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.reply_to_comment_id) {
        const parentComment = commentMap.get(comment.reply_to_comment_id);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const handleCommentCreated = (comment?: Comment) => {
    fetchComments();
    setReplyingTo(null);
    setShowCommentForm(false);
    if (onCommentUpdate) {
      onCommentUpdate();
    }
  };

  const handleCommentUpdated = async (updatedComment: Comment) => {
    try {
      await api.updateComment({
        id: updatedComment.id,
        title: updatedComment.title,
        content: updatedComment.content
      });
      
      fetchComments();
      setEditingComment(null);
      if (onCommentUpdate) {
        onCommentUpdate();
      }
    } catch (err) {
      console.error('Failed to update comment:', err);
      alert('Failed to update comment');
    }
  };

  const handleCommentDeleted = async (commentId: number) => {
    try {
      await api.deleteComment(commentId);
      fetchComments();
      if (onCommentUpdate) {
        onCommentUpdate();
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment');
    }
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
    setEditingComment(null);
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setReplyingTo(null);
  };

  if (loading) {
    return (
      <div className="comment-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comment-list-error">
        <p>❌ {error}</p>
        <button onClick={fetchComments} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }


  return (
    <div className="comment-list">
      <h3>Comments ({comments.length})</h3>

      {/* Show Add Comment button when no comments and user is logged in */}
      {!replyingTo && !editingComment && currentUserId && comments.length === 0 && !showCommentForm && (
        <button 
          className="add-comment-btn"
          onClick={() => setShowCommentForm(true)}
        >
          💬 Add Comment
        </button>
      )}

      {/* Comment Form for new comments - only show if user is logged in and form is visible */}
      {!replyingTo && !editingComment && currentUserId && (comments.length > 0 || showCommentForm) && (
        <CommentForm
          postId={postId}
          onCommentCreated={handleCommentCreated}
          onCancel={() => setShowCommentForm(false)}
          currentUserId={currentUserId}
        />
      )}

      {/* Show login message if user is not logged in */}
      {!replyingTo && !editingComment && !currentUserId && (
        <div className="comment-login-message">
          <p>Please log in to leave a comment.</p>
        </div>
      )}

      {/* Comment Form for editing */}
      {editingComment && (
        <CommentForm
          postId={postId}
          editingComment={editingComment}
          onCommentCreated={(updatedComment) => {
            if (editingComment && updatedComment) {
              const updatedCommentData = {
                ...editingComment,
                title: updatedComment.title,
                content: updatedComment.content
              };
              handleCommentUpdated(updatedCommentData);
            }
          }}
          onCancel={() => setEditingComment(null)}
          currentUserId={currentUserId}
        />
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="comment-list-empty">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onEdit={handleEdit}
            onDelete={handleCommentDeleted}
            onCommentCreated={handleCommentCreated}
            currentUserId={currentUserId}
            postId={postId}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
          />
        ))
      )}
    </div>
  );
};

export default CommentList;
