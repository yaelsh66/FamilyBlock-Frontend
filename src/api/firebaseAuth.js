import axios from 'axios';


const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const BASE_URL = `https://identitytoolkit.googleapis.com/v1`;
const BACKEND_BASE_URL2 = 'http://localhost:8081/api';
const BACKEND_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const PROJECT_ID = 'family-c56e3';

// 🌐 Sign in existing user
export const signInWithEmailAndPassword = async (email, password) => {
  const url = `${BASE_URL}/accounts:signInWithPassword?key=${API_KEY}`;
  const payload = {
    email,
    password,
    returnSecureToken: true,
  };

  try {
    const response = await axios.post(url, payload, { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error("❌ Sign-in failed:", error.response?.data || error.message);
    throw error;
  }
};

// 🆕 Sign up new user
export const signUpWithEmailAndPassword = async (email, password) => {
  const url = `${BASE_URL}/accounts:signUp?key=${API_KEY}`;
  const payload = {
    email,
    password,
    returnSecureToken: true,
  };

  try {
    const response = await axios.post(url, payload, { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error("❌ Sign-up failed:", error.response?.data || error.message);
    throw error;
  }
};

// ✉️ Send password reset email
export const sendPasswordResetEmail = async (email) => {
  const url = `${BASE_URL}/accounts:sendOobCode?key=${API_KEY}`;
  const payload = {
    requestType: 'PASSWORD_RESET',
    email,
  };

  try {
    const response = await axios.post(url, payload, { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error("❌ Password reset email failed:", error.response?.data || error.message);
    throw error;
  }
};

// 🔁 Refresh ID token
export const refreshIdToken = async (refreshToken) => {
  const url = `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`;
  const payload = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  };

  try {
    const response = await axios.post(url, payload, { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error("❌ Token refresh failed:", error.response?.data || error.message);
    throw error;
  }
};

export const createUser = async ({idToken, role, familyName, name}) => {
  const url = `${BACKEND_BASE_URL}/users`;

  const payload = {
    role,
    familyName, // matches backend
    ...(name && { name }), // include name if provided
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Creating user in backend failed:', error.response?.data || error.message);
    throw error;
  }
};



