import React, { useRef, useState } from 'react';
import { useSession } from '../../hooks/useSession';
import { sessionManager } from '../../services/sessionManager';

const Profile: React.FC = () => {
  const { session, userName, refreshSession } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNewSession = async () => {
    try {
      await sessionManager.createNewSession();
      if (refreshSession) {
        refreshSession();
      }
    } catch (error) {
      console.error('Failed to create new session:', error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && session?.id) {
      try {
        const imageUrl = URL.createObjectURL(file);
        console.log('Image selected:', file.name);
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  const toggleProfile = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="profile-section">
      {userName && (
        <>
          {/* Compact header profile */}
          <div className="profile-compact" onClick={toggleProfile}>
            <div className="avatar-small" onClick={handleImageClick} title="Click to change profile image">
              {session?.image ? (
                <img src={session.image} alt={userName} />
              ) : (
                <div className="avatar-placeholder-small">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="username-compact">{userName}</span>
            <div className="profile-arrow">
              {isExpanded ? '▼' : '▶'}
            </div>
          </div>

          {/* Dice button in header */}
          <button 
            className="dice-button-header"
            onClick={handleNewSession}
            title="Get new random character"
          >
            🎲
          </button>

          {/* Expanded profile dropdown */}
          {isExpanded && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <div className="avatar" onClick={handleImageClick} title="Click to change profile image">
                  {session?.image ? (
                    <img src={session.image} alt={userName} />
                  ) : (
                    <div className="avatar-placeholder">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="avatar-overlay">
                    <span>📷</span>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <div className="user-details">
                  <span className="username">{userName}</span>
                  <span className="character-status">Character</span>
                  {session?.gender && <span className="gender">Gender: {session.gender}</span>}
                  {session?.age && <span className="age">Age: {session.age}</span>}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
