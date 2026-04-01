/**
 * Mock authentication module.
 * 
 * In production, replace this with Clerk, Auth.js, or another provider.
 * The interface here is designed to match Clerk's shape for easy migration.
 */

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

// Single demo user — the "logged-in" user in the app
export const MOCK_USER: MockUser = {
  id: "user-demo",
  name: "Alex Rivera",
  email: "alex@Orbit.app",
  avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=Alex",
};

/**
 * Returns the current user. 
 * In a real app, this would verify session tokens.
 */
export function getCurrentUser(): MockUser {
  return MOCK_USER;
}

/**
 * Checks if the user is authenticated.
 * In a real app, this checks for a valid session.
 */
export function isAuthenticated(): boolean {
  return true;
}
