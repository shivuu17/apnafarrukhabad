// Mock adapter that simulates backend behavior for development.
// Exposes functions that mimic an auth backend.

const latency = (ms = 300) => new Promise((r) => setTimeout(r, ms));

let users = [
  { id: 'u_1', name: 'Demo User', email: 'demo@local', password: 'demo123', role: 'user' },
  { id: 'u_2', name: 'Admin User', email: 'admin@local', password: 'admin123', role: 'admin' },
];

const tokens = new Map();

function makeToken(user) {
  const token = `tok_${user.id}_${Date.now()}`;
  tokens.set(token, user.id);
  return token;
}

export async function signIn({ email, password }) {
  await latency();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid credentials');
  const token = makeToken(user);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
}

export async function signUp({ name, email, password }) {
  await latency(500);
  if (users.find((u) => u.email === email)) throw new Error('Email already exists');
  const id = `u_${users.length + 1}`;
  const newUser = { id, name, email, password, role: 'user' };
  users.push(newUser);
  const token = makeToken(newUser);
  return { user: { id, name, email, role: newUser.role }, token };
}

export async function signOut() {
  await latency(100);
  return { ok: true };
}

export async function getCurrentUser(token) {
  await latency(150);
  if (!token) return null;
  const userId = tokens.get(token);
  if (!userId) return null;
  const user = users.find((u) => u.id === userId);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function resetPassword({ email }) {
  await latency(300);
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error('No account found with that email');
  // In a real adapter we'd send email. For mock, just return OK.
  return { ok: true, message: 'Password reset email sent (mock)' };
}

// Export as default adapter-like object
export default { signIn, signUp, signOut, getCurrentUser };
