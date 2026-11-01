// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = {
  baseURL: API_BASE_URL,
  
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`API.js Request: ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body) : null);  // Debug log
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    console.log(`API.js Response: ${response.status} ${response.statusText}`);  // Debug log
    console.log('API.js Response body:', await response.clone().text());  // Debug log
    console.log('API.js Response Just :', response);  // Debug log
    return response.json();
  },
  
  get(endpoint) {
    return this.request(endpoint);
  },
  
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  },
};