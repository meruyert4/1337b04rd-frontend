import React, { useState } from 'react';


// Use the API types instead of local ones
import { Post } from '../../api/types';

export interface PostFormData {
  title: string;
  content: string;
  image?: File;
}

interface PostFormProps {
  onSubmit: (data: PostFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  initialData?: Partial<PostFormData> | Post;
  mode?: 'create' | 'edit';
}

const PostForm: React.FC<PostFormProps> = ({
  onSubmit,
  isLoading = false,
  submitButtonText = 'Create Post',
  initialData = {},
  mode = 'create'
}) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData.title || '',
    content: initialData.content || '',
    image: 'image' in initialData ? initialData.image : undefined
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    // Show existing image if editing and image_url exists
    mode === 'edit' && 'image_url' in initialData && initialData.image_url 
      ? initialData.image_url 
      : null
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.content.trim()) {
      onSubmit(formData);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: undefined }));
    setImagePreview(null);
  };

  return (
    <div className="post-form-container">
      <h3 className="form-title">
        {mode === 'create' ? 'Add a Post:' : 'Edit Post:'}
      </h3>
      
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="form-input"
            placeholder="Enter your post title..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={6}
            className="form-textarea"
            placeholder="Share your thoughts across the multiverse..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">Attach Image (optional):</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="form-file-input"
          />
          
          {imagePreview && (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                  type="button"
                  onClick={removeImage}
                  className="remove-image-btn"
                >
                  Remove
                </button>
            </div>
          )}
          
          {/* Show existing image info when editing */}
          {mode === 'edit' && 'image_url' in initialData && initialData.image_url && !imagePreview && (
            <div className="existing-image-info">
              <p>📷 Existing image: {initialData.image_url}</p>
              <button
                type="button"
                onClick={() => setImagePreview(initialData.image_url!)}
                className="show-image-btn"
              >
                Show Image
              </button>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
          >
            {isLoading ? 'Processing...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
