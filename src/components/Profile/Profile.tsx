import React from 'react';
import { useSession } from '../../hooks/useSession';
import { sessionManager } from '../../services/sessionManager';
import './Profile.css';

const Profile: React.FC = () => {
  const { session, userName, refreshSession } = useSession();

  const handleNewSession = async () => {
    try {
      await sessionManager.createNewSession();
      // Refresh the session data in the UI
      if (refreshSession) {
        refreshSession();
      }
    } catch (error) {
      console.error('Failed to create new session:', error);
    }
  };

  return (
    <div className="profile-section">
      {userName && (
        <div className="profile-info">
          <div className="avatar">
            {session?.image ? (
              <img src={session.image} alt={userName} />
            ) : (
              <div className="avatar-placeholder">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-details">
            <span className="username">{userName}</span>
            <span className="character-status">Character</span>
            {session?.gender && <span className="gender">Gender: {session.gender}</span>}
            {session?.age && <span className="age">Age: {session.age}</span>}
          </div>
          <button 
            className="dice-button"
            onClick={handleNewSession}
            title="Get new random character"
          >
            🎲
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
