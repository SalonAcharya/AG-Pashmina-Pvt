import { API_BASE_URL } from "./api";

/**
 * Enhanced fetch wrapper that handles auth headers and 401 errors
 */
export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // If 401 Unauthorized, trigger a global logout event
    if (response.status === 401) {
      console.warn("Unauthorized request (401). Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Dispatch custom event for AuthContext to handle
      window.dispatchEvent(new CustomEvent("ag_unauthorized_access"));
      
      // We still return the response so the calling component can handle it if needed
      // but the logout redirect will happen via the AuthContext
    }

    return response;
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
};

/**
 * Helper for JSON responses
 */
export const apiJson = async <T = any>(endpoint: string, options: RequestInit = {}, fallback: T): Promise<T> => {
  try {
    const res = await apiClient(endpoint, options);
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
};
