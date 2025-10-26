import { cosmic, hasStatus } from '@/lib/cosmic'
import { BlogPost } from '@/types'
import BlogCard from '@/components/BlogCard'

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'blog-posts' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    const posts = response.objects as BlogPost[]
    return posts.sort((a, b) => {
      const dateA = new Date(a.metadata.published_date).getTime()
      const dateB = new Date(b.metadata.published_date).getTime()
      return dateB - dateA
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw error
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  const categories = Array.from(new Set(posts.map(post => post.metadata.category.value)))

  return (
    <div className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            RADZZ Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            News, updates, tutorials, and insights from the RADZZ team
          </p>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <button className="px-4 py-2 bg-accent-blue text-white rounded-lg font-medium">
              All Posts
            </button>
            {categories.map((category) => (
              <button 
                key={category}
                className="px-4 py-2 bg-dark-lighter hover:bg-dark-border text-gray-300 rounded-lg font-medium transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p>No blog posts available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}