/**
 * 
 * This service provides a centralized API handling layer for making HTTP requests
 * to the backend server with consistent authentication, error handling, and response processing.
 * 
 * It includes:
 * - Authentication token management with local storage integration
 * - Standardized HTTP request methods (GET, POST) with proper headers
 * - Consistent error handling with special cases for authentication failures
 * - User session management (login, logout, verification)
 * - Automatic credential inclusion for authenticated requests
 * 
 * The service handles authentication edge cases by clearing invalid tokens on 401 responses
 * and provides centralized logging for all API interactions. It properly processes
 * response data, handles empty responses safely, and maintains consistent API request
 * patterns across the application to reduce code duplication and improve maintainability.
 */


// services/apiService.js - Centralized API handling
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The auth token
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Prepare headers for API requests, including authentication
 * @param {boolean} includeAuth - Whether to include the auth token
 * @returns {Headers} Headers object ready for fetch
 */
const getHeaders = (includeAuth = true) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
  }

  return headers;
};

/**
 * Handle API responses with consistent error handling
 * @param {Response} response - Fetch response object
 * @returns {Promise<any>} Parsed response data
 */
const handleResponse = async (response) => {
  const text = await response.text();
  
  // Don't try to parse empty responses
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      console.error('Authentication error:', data);
      // Clear invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

/**
 * Make a GET request to the API
 * @param {string} endpoint - API endpoint
 * @param {boolean} authenticated - Whether this requires authentication
 * @returns {Promise<any>} Response data
 */
export const apiGet = async (endpoint, authenticated = true) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(authenticated),
      credentials: 'include'
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`GET ${endpoint} failed:`, error);
    throw error;
  }
};

/**
 * Make a POST request to the API
 * @param {string} endpoint - API endpoint
 * @param {object} data - Data to send
 * @param {boolean} authenticated - Whether this requires authentication
 * @returns {Promise<any>} Response data
 */
export const apiPost = async (endpoint, data, authenticated = true) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(authenticated),
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`POST ${endpoint} failed:`, error);
    throw error;
  }
};

/**
 * Verify the current authentication token
 * @returns {Promise<{valid: boolean, user: object|null}>} Verification result
 */
export const verifyAuth = async () => {
  try {
    const result = await apiGet('/auth/verify');
    return { valid: true, user: result.user };
  } catch (error) {
    console.error('Auth verification failed:', error);
    return { valid: false, user: null };
  }
};

/**
 * Authenticate a user (login or register)
 * @param {string} type - 'login' or 'register'
 * @param {object} credentials - User credentials
 * @returns {Promise<{token: string, user: object}>} Auth data
 */
export const authenticate = async (type, credentials) => {
  try {
    const endpoint = `/auth/${type}`;
    const data = await apiPost(endpoint, credentials, false);
    
    // Store auth data
    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('justLoggedIn', 'true');
    }
    
    return data;
  } catch (error) {
    console.error(`Authentication (${type}) failed:`, error);
    throw error;
  }
};

/**
 * Log out the current user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('justLoggedIn');
};

export default {
  apiGet,
  apiPost,
  verifyAuth,
  authenticate,
  logout,
  getToken
};