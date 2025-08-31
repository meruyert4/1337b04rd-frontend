import { api } from '../api';
import { Session } from '../api/types';

class SessionManager {
  private sessionKey = '1337b04rd_session';
  private currentSession: Session | null = null;

  constructor() {
    this.initializeSession();
  }

  private async initializeSession() {
    console.log('Initializing session...');
    
    // Check if session exists in localStorage
    const existingSessionId = localStorage.getItem(this.sessionKey);
    console.log('Existing session ID from localStorage:', existingSessionId);
    
    if (existingSessionId) {
      try {
        console.log('Attempting to restore existing session...');
        // Try to get existing session from backend
        const session = await api.getSession(existingSessionId);
        if (session) {
          this.currentSession = session;
          // Set session cookie for backend authentication
          document.cookie = `session_id=${session.id}; path=/; max-age=86400; SameSite=Lax`;
          console.log('Session restored:', session.name);
          console.log('Session cookie restored:', document.cookie);
          return;
        }
      } catch (error) {
        console.log('Failed to restore session, creating new one:', error);
      }
    }

    console.log('No existing session, creating new one...');
    // Create new session for first-time user
    await this.createNewSession();
  }

  public async createNewSession() {
    try {
      console.log('Creating new session...');
      
      // Log current cookies
      console.log('Current cookies:', document.cookie);
      
      // Create session in backend (backend will assign random character)
      const session = await api.createSession();

      console.log('Session created successfully:', session);

      // Store session ID in localStorage
      localStorage.setItem(this.sessionKey, session.id);
      this.currentSession = session;
      
      // Set session cookie for backend authentication
      document.cookie = `session_id=${session.id}; path=/; max-age=86400; SameSite=Lax`;
      
      console.log('New session created:', session.name);
      console.log('Session cookie set:', document.cookie);
    } catch (error) {
      console.error('Failed to create session:', error);
      // Don't create fallback session - let the user retry
      this.currentSession = null;
    }
  }

  public getCurrentSession(): Session | null {
    return this.currentSession;
  }

  public getUserId(): string {
    return this.currentSession?.id || '';
  }

  public getUserName(): string {
    return this.currentSession?.name || '';
  }

  public async refreshSession() {
    if (this.currentSession) {
      try {
        const session = await api.getSession(this.currentSession.id);
        if (session) {
          this.currentSession = session;
          return true;
        }
      } catch (error) {
        console.error('Failed to refresh session:', error);
      }
    }
    
    // If refresh failed, create new session
    await this.createNewSession();
    return false;
  }

  public async updateUserName(newName: string) {
    if (!this.currentSession) return false;
    
    try {
      const updatedSession = await api.updateSession(
        this.currentSession.id,
        newName
      );
      
      this.currentSession = updatedSession;
      return true;
    } catch (error) {
      console.error('Failed to update user name:', error);
      return false;
    }
  }

  public async updateUserProfile(name?: string, gender?: string, age?: string) {
    if (!this.currentSession) return false;
    
    try {
      const updatedSession = await api.updateSession(
        this.currentSession.id,
        name,
        gender,
        age
      );
      
      this.currentSession = updatedSession;
      return true;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      return false;
    }
  }

  public async updateAvatar(avatarUrl: string) {
    if (!this.currentSession) return false;
    
    try {
      // Note: Avatar updates are not supported in the new API
      // The image field is managed by the backend from Rick and Morty API
      console.log('Avatar updates are not supported in the new API');
      return false;
    } catch (error) {
      console.error('Failed to update avatar:', error);
      return false;
    }
  }

  public clearSession() {
    localStorage.removeItem(this.sessionKey);
    this.currentSession = null;
    // Clear session cookie
    document.cookie = 'session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    console.log('Session cleared, cookies cleared');
  }

  public isSessionValid(): boolean {
    if (!this.currentSession) return false;
    
    if (this.currentSession.expires_at) {
      const expiryDate = new Date(this.currentSession.expires_at);
      return expiryDate > new Date();
    }
    
    return true;
  }
}

// Create singleton instance
export const sessionManager = new SessionManager();
export default sessionManager;
