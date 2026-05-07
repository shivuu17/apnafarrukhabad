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

export async function resetPassword({ email }) {
  if (typeof adapter.resetPassword === 'function') {
    return adapter.resetPassword({ email });
  }
  throw new Error('Reset password not supported by adapter');
}

export default { login, signup, logout, getCurrentUser, updateUserProfile, checkUsernameAvailability };
