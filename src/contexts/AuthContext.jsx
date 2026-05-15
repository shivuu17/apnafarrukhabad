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

  const sendEmailVerificationCode = useCallback(async (email) => {
    return authService.sendEmailVerificationCode(email)
  }, [])

  const verifyEmailCode = useCallback(async (email, otp) => {
    const result = await authService.verifyEmailCode(email, otp, user?.id)
    if (result.success) {
      setUser((prev) => ({ ...(prev || {}), emailVerified: true }))
    }
    return result
  }, [user?.id])

  const sendPhoneVerificationCode = useCallback(async (phone) => {
    return authService.sendPhoneVerificationCode(phone, user?.id)
  }, [user?.id])

  const verifyPhoneCode = useCallback(async (phone, otp) => {
    const result = await authService.verifyPhoneCode(phone, otp, user?.id)
    if (result.success) {
      setUser((prev) => ({ ...(prev || {}), phoneVerified: true }))
    }
    return result
  }, [user?.id])

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('af_token');
      setUser(null);
    }
  }, []);

  const deleteAccount = useCallback(async (password, reason) => {
    try {
      await authService.deleteAccount(password, reason);
      localStorage.removeItem('af_token');
      setUser(null);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout, 
      updateProfile, 
      checkUsernameAvailability, 
      deleteAccount,
      sendEmailVerificationCode,
      verifyEmailCode,
      sendPhoneVerificationCode,
      verifyPhoneCode,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
