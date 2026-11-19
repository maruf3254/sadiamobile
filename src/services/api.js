const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const apiRequest = async (endpoint, options = {}) => {
  try {
    // প্রতি রিকোয়েস্টে লেটেস্ট token পড়ুন
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        console.error("Authentication failed:", data);
      }

      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const get = (url) => apiRequest(url);

export const post = (url, body) =>
  apiRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const put = (url, body) =>
  apiRequest(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const patch = (url, body) =>
  apiRequest(url, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const del = (url) =>
  apiRequest(url, {
    method: "DELETE",
  });