// Minimal API client used by services. Abstracts fetch, baseURL and token injection.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, { method = 'GET', body, headers = {}, token, signal } = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    signal,
  };

  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body !== undefined && body !== null) opts.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(url, opts);
  } catch (networkErr) {
    const err = new Error(`Network error while requesting ${url}: ${networkErr.message}`);
    err.cause = networkErr;
    throw err;
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      // Response not JSON — keep raw text available for debugging
      data = text;
    }
  }

  if (!res.ok) {
    const err = new Error(`API error ${res.status} when requesting ${url}`);
    err.status = res.status;
    err.url = url;
    err.payload = data;
    // Log to console for easier debugging in dev
    // eslint-disable-next-line no-console
    console.error('apiClient error:', { url, status: res.status, body: data });
    throw err;
  }

  return data;
}

export default { request };
