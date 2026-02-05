import { db, User, UserRole } from './mock-db';

const AUTH_COOKIE_NAME = 'dimms-user';

// For demo purposes, we'll use localStorage to persist auth state
export const setAuthUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_COOKIE_NAME, JSON.stringify(user));
  }
};

export const getAuthUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(AUTH_COOKIE_NAME);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

export const clearAuthUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_COOKIE_NAME);
  }
};

export const login = (email: string, password: string): User | null => {
  const user = db.authenticateUser(email, password);
  if (user) {
    setAuthUser(user);
    return user;
  }
  return null;
};

export const logout = () => {
  clearAuthUser();
};

export const isAuthenticated = (): boolean => {
  return getAuthUser() !== null;
};

export const hasRole = (role: UserRole): boolean => {
  const user = getAuthUser();
  return user?.role === role;
};

export const hasAnyRole = (roles: UserRole[]): boolean => {
  const user = getAuthUser();
  return user ? roles.includes(user.role) : false;
};

export const getCurrentUserId = (): string | null => {
  const user = getAuthUser();
  return user?.id || null;
};
