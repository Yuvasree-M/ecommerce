import { auth } from "../firebase";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (url, options = {}) => {
  try {
    const user = auth.currentUser;
    let token = null;

    if (user) {
      token = await user.getIdToken();
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || "API request failed");
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};