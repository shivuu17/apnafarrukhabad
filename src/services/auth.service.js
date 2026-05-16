// High-level auth service. Uses an adapter (mock for now) and exposes a stable API.
import firebaseAdapter from './firebaseAdapter';

// In future, swap based on env: restAdapter | firebaseAdapter
const adapter = firebaseAdapter;

export async function login({ email, password }) {
  return adapter.signIn({ email, password });
}

export async function signup({ name, email, password }) {
  return adapter.signUp({ name, email, password });
}

export async function logout() {
  return adapter.signOut();
}

export async function getCurrentUser(token) {
  return adapter.getCurrentUser(token);
}

export async function updateUserProfile(userId, payload) {
  if (typeof adapter.updateUserProfile === 'function') {
    return adapter.updateUserProfile(userId, payload)
  }
  throw new Error('Update profile not supported by adapter')
}

export async function checkUsernameAvailability(username, excludeUid) {
  if (typeof adapter.checkUsernameAvailability === 'function') {
    return adapter.checkUsernameAvailability(username, excludeUid)
  }
  throw new Error('Username availability check not supported by adapter')
}

export async function syncUsernameRegistry(uid, username) {
  if (typeof adapter.syncUsernameRegistry === 'function') {
    return adapter.syncUsernameRegistry(uid, username)
  }
  throw new Error('Username registry sync not supported by adapter')
}

export async function resetPassword({ email }) {
  if (typeof adapter.resetPassword === 'function') {
    return adapter.resetPassword({ email });
  }
  throw new Error('Reset password not supported by adapter');
}

export async function deleteAccount(password, reason) {
  if (typeof adapter.deleteAccount === 'function') {
    return adapter.deleteAccount(password, reason);
  }
  throw new Error('Delete account not supported by adapter');
}

export async function sendEmailVerificationCode(email) {
  if (typeof adapter.sendEmailVerificationCode === 'function') {
    return adapter.sendEmailVerificationCode(email);
  }
  throw new Error('Email verification not supported by adapter');
}

export async function verifyEmailCode(email, otp, userId) {
  if (typeof adapter.verifyEmailCode === 'function') {
    return adapter.verifyEmailCode(email, otp, userId);
  }
  throw new Error('Email verification not supported by adapter');
}

export async function sendPhoneVerificationCode(phone, userId) {
  if (typeof adapter.sendPhoneVerificationCode === 'function') {
    return adapter.sendPhoneVerificationCode(phone, userId);
  }
  throw new Error('Phone verification not supported by adapter');
}

export async function verifyPhoneCode(phone, otp, userId) {
  if (typeof adapter.verifyPhoneCode === 'function') {
    return adapter.verifyPhoneCode(phone, otp, userId);
  }
  throw new Error('Phone verification not supported by adapter');
}

export default { login, signup, logout, getCurrentUser, updateUserProfile, checkUsernameAvailability, syncUsernameRegistry, resetPassword, deleteAccount, sendEmailVerificationCode, verifyEmailCode, sendPhoneVerificationCode, verifyPhoneCode };
