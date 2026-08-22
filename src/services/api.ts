/**
 * Premier Tours REST API Client for MongoDB Backend
 * Built for zero-downtime, production resilience on Hostinger
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
  user?: any;
  token?: string;
  stats?: any;
  url?: string;
}

const getHeaders = (includeAuth = true, isJson = true): HeadersInit => {
  const headers: Record<string, string> = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (includeAuth) {
    const token = localStorage.getItem('pt_auth_token') || localStorage.getItem('sb-auth-token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

/**
 * Safe HTTP wrapper that prevents JSON parse errors when the server returns HTML
 */
async function safeFetch<T = any>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const json = await res.json();
      return json;
    }

    // Server returned HTML or text (e.g. 404, 500 error page)
    const text = await res.text();
    return {
      success: false,
      error: `Server returned non-JSON response (${res.status}): ${text.slice(0, 120)}...`,
      message: `Request failed with HTTP ${res.status}`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network request failed',
      message: err?.message || 'Network connection failed',
    };
  }
}

export const api = {
  // Health & Connection
  getHealth: async (): Promise<ApiResponse> => {
    return safeFetch(`${API_BASE}/health`);
  },

  // Media / File Upload API
  upload: {
    uploadImage: async (file: File, folder = 'general'): Promise<ApiResponse<{ imageUrl: string; url: string }>> => {
      try {
        const formData = new FormData();
        formData.append('folder', folder);
        formData.append('image', file);

        const token = localStorage.getItem('pt_auth_token');
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers,
          body: formData,
        });

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          const text = await res.text();
          return {
            success: false,
            error: `Upload server returned non-JSON (${res.status}): ${text.slice(0, 100)}`,
          };
        }

        const data = await res.json();
        return data;
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || 'Image upload failed',
        };
      }
    },
  },

  // Auth
  auth: {
    register: async (payload: any): Promise<ApiResponse> => {
      const data = await safeFetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(payload),
      });
      if (data.token) {
        localStorage.setItem('pt_auth_token', data.token);
      }
      return data;
    },

    login: async (email: string, password: string): Promise<ApiResponse> => {
      const data = await safeFetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ email, password }),
      });
      if (data.token) {
        localStorage.setItem('pt_auth_token', data.token);
      }
      return data;
    },

    getMe: async (): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/auth/me`, {
        headers: getHeaders(true),
      });
    },

    updateProfile: async (payload: any): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
    },

    logout: async (): Promise<ApiResponse> => {
      localStorage.removeItem('pt_auth_token');
      return safeFetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getHeaders(true),
      });
    },
  },

  // Tours
  tours: {
    getAll: async (params?: { category?: string; search?: string; featured?: boolean }): Promise<ApiResponse> => {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.featured) query.set('featured', 'true');
      return safeFetch(`${API_BASE}/tours?${query.toString()}`);
    },

    getByIdOrSlug: async (idOrSlug: string): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/tours/${encodeURIComponent(idOrSlug)}`);
    },

    save: async (payload: any): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/tours`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
    },

    delete: async (id: string): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/tours/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
    },
  },

  // Hotels
  hotels: {
    getAll: async (params?: { city?: string; search?: string }): Promise<ApiResponse> => {
      const query = new URLSearchParams();
      if (params?.city) query.set('city', params.city);
      if (params?.search) query.set('search', params.search);
      return safeFetch(`${API_BASE}/hotels?${query.toString()}`);
    },

    getByIdOrSlug: async (idOrSlug: string): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/hotels/${encodeURIComponent(idOrSlug)}`);
    },

    save: async (payload: any): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/hotels`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
    },

    delete: async (id: string): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/hotels/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
    },
  },

  // Cars
  cars: {
    getAll: async (params?: { category?: string; available?: boolean }): Promise<ApiResponse> => {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.available !== undefined) query.set('available', String(params.available));
      return safeFetch(`${API_BASE}/cars?${query.toString()}`);
    },

    save: async (payload: any): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/cars`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
    },

    delete: async (id: string): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/cars/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
    },
  },

  // Flights
  flights: {
    getAll: async (params?: { origin?: string; destination?: string; cabinClass?: string }): Promise<ApiResponse> => {
      const query = new URLSearchParams();
      if (params?.origin) query.set('origin', params.origin);
      if (params?.destination) query.set('destination', params.destination);
      if (params?.cabinClass) query.set('cabinClass', params.cabinClass);
      return safeFetch(`${API_BASE}/flights?${query.toString()}`);
    },

    save: async (payload: any): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/flights`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
    },
  },

  // Bookings
  bookings: {
    getAll: async (params?: { status?: string; userEmail?: string }): Promise<ApiResponse> => {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.userEmail) query.set('userEmail', params.userEmail);
      return safeFetch(`${API_BASE}/bookings?${query.toString()}`, {
        headers: getHeaders(true),
      });
    },

    create: async (payload: any): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
    },

    updateStatus: async (id: string, status: string, paymentStatus?: string): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/bookings/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify({ status, paymentStatus }),
      });
    },
  },

  // Reviews
  reviews: {
    getAll: async (params?: { serviceType?: string; itemId?: string; status?: string; search?: string }): Promise<ApiResponse> => {
      const query = new URLSearchParams();
      if (params?.serviceType) query.set('serviceType', params.serviceType);
      if (params?.itemId) query.set('itemId', params.itemId);
      if (params?.status) query.set('status', params.status);
      if (params?.search) query.set('search', params.search);
      return safeFetch(`${API_BASE}/reviews?${query.toString()}`);
    },

    create: async (payload: any): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
    },

    markHelpful: async (id: string): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/reviews/${id}/helpful`, {
        method: 'POST',
      });
    },

    moderate: async (id: string, status: string, rejectionReason?: string): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/reviews/${id}/moderate`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify({ status, rejectionReason }),
      });
    },

    update: async (id: string, payload: any): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/reviews/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
    },

    delete: async (id: string): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/reviews/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
    },
  },


  // Blog
  blog: {
    getAll: async (params?: { category?: string; search?: string }): Promise<ApiResponse> => {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      return safeFetch(`${API_BASE}/blog?${query.toString()}`);
    },

    getBySlug: async (slug: string): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/blog/${encodeURIComponent(slug)}`);
    },

    save: async (payload: any): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/blog`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
    },
  },

  // Contact Concierge
  contact: {
    submit: async (payload: { name: string; email: string; phone?: string; subject?: string; message: string }): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(payload),
      });
    },

    getAll: async (): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/contact`, {
        headers: getHeaders(true),
      });
    },
  },

  // Admin Dashboard
  admin: {
    getDashboardStats: async (): Promise<ApiResponse> => {
      return safeFetch(`${API_BASE}/admin/dashboard`, {
        headers: getHeaders(true),
      });
    },
  },
};
