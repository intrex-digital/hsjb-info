export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string | null
  content: string
  author: string
  category: string
  tags: string | null
  reading_time: string | null
  cover_image: string | null
  published: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: number
  name: string
  percentage: number
  category: string | null
  display_order: number
}

export interface ResumeEntry {
  id: number
  type: 'experience' | 'education' | 'certification' | 'training'
  title: string
  organization: string | null
  date_range: string | null
  join_date: string | null
  exit_date: string | null
  description: string | null
  display_order: number
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
