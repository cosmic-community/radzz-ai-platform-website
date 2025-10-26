# RADZZ AI Platform Website

![RADZZ Platform](https://imgix.cosmicjs.com/04b1ae40-b270-11f0-a900-b7bbcbe531cb-photo-1677442136019-21780ecad995-1761492505513.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A comprehensive marketing and documentation website for RADZZ - the AI-powered productivity platform with 7 specialized modes for coding, learning, design, research, and more. Built with Next.js 15 and Cosmic CMS.

## Features

- 🤖 **AI Modes Showcase** - Interactive display of all 7 specialized AI modes with descriptions and color themes
- 📝 **Blog System** - Full-featured blog with category filtering, author profiles, and markdown rendering
- 📚 **Documentation Hub** - Organized documentation with category navigation and related content
- ❓ **FAQ System** - Categorized FAQs with featured questions and expandable answers
- ✨ **Features Gallery** - Platform features showcase with availability status and detailed descriptions
- 🎨 **Modern Dark Design** - Beautiful gradient backgrounds with glowing effects and smooth animations
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- ⚡ **Server-Side Rendering** - Fast page loads with Next.js 15 App Router
- 🔍 **SEO Optimized** - Proper metadata, semantic HTML, and structured content

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68fe207b92c9229c30fe735e&clone_repository=68fe23ef92c9229c30fe73a3)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "You are an expert full-stack web developer AI. Create a complete, ready-to-launch website called **RADZZ**, inspired by **Blackbox.ai**. Do NOT use any builder or external templates. Write everything from scratch using **HTML, CSS, and JavaScript** only. The entire code must be inside a single `index.html` file. RADZZ is an AI-powered coding and productivity platform that allows users to: Chat with AI (general + coding + creative), Generate and debug code, Study and learn concepts, Design UI ideas, Research deeply, Generate images via AI, Perform web search–based queries. Modern black/dark gradient background (#0b0b0b → #111), Glowing logo text 'RADZZ ⚡' at top-left, Smooth-glow animated borders and button hover effects, Center chat container with round corners and shadow, Sidebar (left) for mode selection: Friendly Chat, Study & Learn, Design & Canvas, Web Development, Deep Research, Image Generation, Web Search Thinking. Responsive layout for mobile & desktop, Loading animation with 'RADZZ is thinking…', Use modern monospace font for code display."

### Code Generation Prompt

> "Based on the content model I created for RADZZ, now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Cosmic CMS** - Headless CMS for content management
- **React Markdown** - Markdown rendering for blog and docs
- **Inter Font** - Modern typography

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Cosmic account with bucket credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd radzz-website
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
```

4. Run the development server:
```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cosmic SDK Examples

### Fetching AI Modes
```typescript
import { cosmic } from '@/lib/cosmic'

const { objects: modes } = await cosmic.objects
  .find({ type: 'ai-modes' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Modes are pre-sorted by mode_number in content
const sortedModes = modes.sort((a, b) => 
  a.metadata.mode_number - b.metadata.mode_number
)
```

### Fetching Blog Posts with Categories
```typescript
const { objects: posts } = await cosmic.objects
  .find({ type: 'blog-posts' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Manual sorting by published_date (newest first)
const sortedPosts = posts.sort((a, b) => {
  const dateA = new Date(a.metadata.published_date).getTime()
  const dateB = new Date(b.metadata.published_date).getTime()
  return dateB - dateA
})
```

### Fetching Documentation by Category
```typescript
const { objects: docs } = await cosmic.objects
  .find({ 
    type: 'documentation-pages',
    'metadata.category.key': 'getting-started'
  })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Manual sorting by order field
const sortedDocs = docs.sort((a, b) => 
  (a.metadata.order || 0) - (b.metadata.order || 0)
)
```

## Cosmic CMS Integration

This application uses Cosmic CMS for all content management:

### Content Types

1. **AI Modes** - 7 specialized AI modes with system prompts and color themes
2. **Blog Posts** - Articles with markdown, categories, tags, and author info
3. **Features** - Platform features with descriptions and availability
4. **Documentation Pages** - Organized docs with categories and related content
5. **FAQ Items** - Categorized questions with featured status

### Content Structure

- All content is fetched server-side for optimal performance
- Images are optimized using imgix parameters
- Markdown content is rendered with proper styling
- Related content is accessed via depth parameter

## Deployment Options

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Connect your repository
2. Set build command: `bun run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy

### Environment Variables

Set these in your hosting platform:

```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
```

## Project Structure

```
radzz-website/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── modes/                # AI modes pages
│   ├── blog/                 # Blog pages
│   ├── docs/                 # Documentation pages
│   ├── features/             # Features pages
│   └── faq/                  # FAQ page
├── components/               # Reusable components
├── lib/
│   └── cosmic.ts            # Cosmic SDK setup
├── types.ts                 # TypeScript definitions
└── tailwind.config.js       # Tailwind configuration
```

## License

MIT License - feel free to use this for your own projects!

---

**Built with Cosmic** - [Try Cosmic CMS](https://www.cosmicjs.com)

<!-- README_END -->