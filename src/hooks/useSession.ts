import { useState, useEffect } from 'react';
import { sessionManager } from '../services/sessionManager';
import { Session } from '../api/types';

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      // Wait a bit for session manager to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const currentSession = sessionManager.getCurrentSession();
      setSession(currentSession);
      setLoading(false);
    };

    initializeSession();
  }, []);

  const refreshSession = async () => {
    setLoading(true);
    await sessionManager.refreshSession();
    setSession(sessionManager.getCurrentSession());
    setLoading(false);
  };

  const updateUserName = async (newName: string) => {
    const success = await sessionManager.updateUserName(newName);
    if (success) {
      setSession(sessionManager.getCurrentSession());
    }
    return success;
  };

  const updateAvatar = async (avatarUrl: string) => {
    const success = await sessionManager.updateAvatar(avatarUrl);
    if (success) {
      setSession(sessionManager.getCurrentSession());
    }
    return success;
  };

  const clearSession = () => {
    sessionManager.clearSession();
    setSession(null);
  };

  return {
    session,
    loading,
    userId: sessionManager.getUserId(),
    userName: sessionManager.getUserName(),
    isSessionValid: sessionManager.isSessionValid(),
    refreshSession,
    updateUserName,
    updateAvatar,
    clearSession
  };
};
