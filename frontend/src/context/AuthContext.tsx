import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

type User = { id: string; email: string } | null;

type State = {
  isAuthenticated: boolean;
  token: string | null;
  user: User;
  loading: boolean;
};

type Action =
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'LOGOUT' }
  | { type: 'HYDRATE'; payload: { token: string | null; user: User } };

const AuthContext = createContext<{
  state: State;
  login: (token: string, user: User) => void;
  logout: () => void;
} | null>(null);

const initialState: State = { isAuthenticated: false, token: null, user: null, loading: true };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: !!action.payload.token,
        loading: false,
      };
    case 'LOGIN_SUCCESS':
      return { ...state, isAuthenticated: true, token: action.payload.token, user: action.payload.user, loading: false };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    dispatch({ type: 'HYDRATE', payload: { token, user: userStr ? JSON.parse(userStr) : null } });
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const value = useMemo(() => ({ state, login, logout }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
