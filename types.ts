// Comprehensive TypeScript definitions for RADZZ content

// Base Cosmic object interface
export interface CosmicObject {
  id: string
  slug: string
  title: string
  content?: string
  metadata: Record<string, any>
  type: string
  created_at: string
  modified_at: string
}

// AI Mode type
export interface AIMode extends CosmicObject {
  type: 'ai-modes'
  metadata: {
    mode_name: string
    mode_icon: string
    mode_number: number
    short_description: string
    full_description?: string
    system_prompt: string
    color_theme?: string
    featured_image?: {
      url: string
      imgix_url: string
    }
    active?: boolean
    example_prompts?: string[]
  }
}

// Blog Post type
export interface BlogPost extends CosmicObject {
  type: 'blog-posts'
  metadata: {
    title: string
    excerpt: string
    content: string
    featured_image?: {
      url: string
      imgix_url: string
    }
    author_name: string
    author_avatar?: {
      url: string
      imgix_url: string
    }
    category: {
      key: string
      value: string
    }
    tags?: string[]
    read_time?: number
    published_date: string
  }
}

// Feature type
export interface Feature extends CosmicObject {
  type: 'features'
  metadata: {
    feature_name: string
    icon: string
    short_description: string
    detailed_description?: string
    feature_image?: {
      url: string
      imgix_url: string
    }
    demo_video_url?: string
    available?: boolean
    coming_soon?: boolean
  }
}

// Documentation Page type
export interface DocumentationPage extends CosmicObject {
  type: 'documentation-pages'
  metadata: {
    page_title: string
    category: {
      key: string
      value: string
    }
    content: string
    order?: number
    cover_image?: {
      url: string
      imgix_url: string
    }
    related_pages?: DocumentationPage[]
  }
}

// FAQ Item type
export interface FAQItem extends CosmicObject {
  type: 'faq-items'
  metadata: {
    question: string
    answer: string
    category: {
      key: string
      value: string
    }
    order?: number
    featured?: boolean
  }
}

// Cosmic API response type
export interface CosmicResponse<T> {
  objects: T[]
  total: number
  limit?: number
  skip?: number
}

// Type guard for checking object types
export function isAIMode(obj: CosmicObject): obj is AIMode {
  return obj.type === 'ai-modes'
}

export function isBlogPost(obj: CosmicObject): obj is BlogPost {
  return obj.type === 'blog-posts'
}

export function isFeature(obj: CosmicObject): obj is Feature {
  return obj.type === 'features'
}

export function isDocumentationPage(obj: CosmicObject): obj is DocumentationPage {
  return obj.type === 'documentation-pages'
}

export function isFAQItem(obj: CosmicObject): obj is FAQItem {
  return obj.type === 'faq-items'
}