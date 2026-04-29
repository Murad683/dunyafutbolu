import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthState {
  token: string | null;
  email: string | null;
}

interface AuthContextType extends AuthState {
  login: (token: string, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem('admin_token'),
    email: localStorage.getItem('admin_email'),
  });

  const login = (token: string, email: string) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_email', email);
    setState({ token, email });
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    setState({ token: null, email: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, isAuthenticated: !!state.token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
