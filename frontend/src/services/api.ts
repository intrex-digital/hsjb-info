import axios from 'axios'
import type { BlogPost, Skill, ResumeEntry, ContactFormData, PaginatedResponse } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login'
      }
    }
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Public APIs
export const blogApi = {
  getAll: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<BlogPost>>('/blog', { params: { page, limit } }),
  getBySlug: (slug: string) =>
    api.get<BlogPost>(`/blog/${slug}`),
  getFeatured: (limit = 9) =>
    api.get<BlogPost[]>('/blog/featured', { params: { limit } }),
}

export const portfolioApi = {
  getSkills: () =>
    api.get<Skill[]>('/portfolio/skills'),
  getResume: () =>
    api.get<ResumeEntry[]>('/portfolio/resume'),
}

export const contactApi = {
  submit: (data: ContactFormData) =>
    api.post('/contact', data),
}

// Admin APIs
export const adminApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: { email: string; name: string } }>('/admin/login', { email, password }),

  verify: () =>
    api.get<{ user: { email: string; name: string } }>('/admin/verify'),

  getStats: () =>
    api.get<{
      blogPosts: number
      skills: number
      resumeEntries: number
      contacts: number
      unreadContacts: number
    }>('/admin/stats'),

  blog: {
    getAll: (page = 1, limit = 20) =>
      api.get<PaginatedResponse<BlogPost>>('/admin/blog', { params: { page, limit } }),
    create: (data: Partial<BlogPost>) =>
      api.post('/admin/blog', data),
    update: (id: number, data: Partial<BlogPost>) =>
      api.put(`/admin/blog/${id}`, data),
    delete: (id: number) =>
      api.delete(`/admin/blog/${id}`),
  },

  skills: {
    getAll: () =>
      api.get<Skill[]>('/admin/skills'),
    create: (data: Partial<Skill>) =>
      api.post('/admin/skills', data),
    update: (id: number, data: Partial<Skill>) =>
      api.put(`/admin/skills/${id}`, data),
    delete: (id: number) =>
      api.delete(`/admin/skills/${id}`),
  },

  resume: {
    getAll: () =>
      api.get<ResumeEntry[]>('/admin/resume'),
    create: (data: Partial<ResumeEntry>) =>
      api.post('/admin/resume', data),
    update: (id: number, data: Partial<ResumeEntry>) =>
      api.put(`/admin/resume/${id}`, data),
    delete: (id: number) =>
      api.delete(`/admin/resume/${id}`),
  },

  contacts: {
    getAll: () =>
      api.get<any[]>('/admin/contacts'),
    markRead: (id: number) =>
      api.put(`/admin/contacts/${id}/read`),
    delete: (id: number) =>
      api.delete(`/admin/contacts/${id}`),
  },

  getSettings: () =>
    api.get<Record<string, string>>('/admin/settings'),

  updateSettings: (data: Record<string, string>) =>
    api.put('/admin/settings', data),
}

export default api
