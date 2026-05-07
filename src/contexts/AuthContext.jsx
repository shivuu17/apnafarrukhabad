import React, { createContext, useEffect, useState, useCallback } from 'react';
import * as authService from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // hydrate from localStorage token on mount
    const token = localStorage.getItem('af_token');
    if (!token) {
      setLoading(false);
      return;
    }
    let mounted = true;
    authService
      .getCurrentUser(token)
      .then((u) => {
        if (!mounted) return;
        if (u) setUser(u);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await authService.login({ email, password });
    localStorage.setItem('af_token', res.token);
    setUser(res.user);
    return res;
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    const res = await authService.signup({ name, email, password });
    localStorage.setItem('af_token', res.token);
    setUser(res.user);
    return res;
  }, []);

  const updateProfile = useCallback(async (payload) => {
    if (!user?.id) throw new Error('Not authenticated')
    // call auth service to update
    const updated = await authService.updateUserProfile(user.id, payload)
    // refresh local user state with returned object
    setUser((prev) => ({ ...(prev || {}), ...(updated || {}) }))
    return updated
  }, [user])

  const checkUsernameAvailability = useCallback(async (username) => {
    const excludeUid = user?.id || ''
    return authService.checkUsernameAvailability(username, excludeUid)
  }, [user])

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('af_token');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, checkUsernameAvailability }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
