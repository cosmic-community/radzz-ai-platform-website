// app/blog/[slug]/page.tsx
import { cosmic, hasStatus } from '@/lib/cosmic'
import { BlogPost } from '@/types'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'blog-posts',
      slug
    }).depth(1)
    
    return response.object as BlogPost
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw error
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return (
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog" className="text-accent-blue hover:text-accent-purple">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(post.metadata.published_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="text-accent-blue hover:text-accent-purple mb-8 inline-block">
          ← Back to Blog
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-accent-blue/20 text-accent-blue rounded-full text-sm">
                {post.metadata.category.value}
              </span>
              <span className="text-gray-500">{formattedDate}</span>
              {post.metadata.read_time && (
                <span className="text-gray-500">{post.metadata.read_time} min read</span>
              )}
            </div>

            <h1 className="text-5xl font-bold mb-6 gradient-text">
              {post.metadata.title}
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              {post.metadata.excerpt}
            </p>

            {post.metadata.author_name && (
              <div className="flex items-center gap-4 p-4 bg-dark-lighter rounded-lg">
                {post.metadata.author_avatar && (
                  <img 
                    src={`${post.metadata.author_avatar.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
                    alt={post.metadata.author_name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <div className="font-semibold">{post.metadata.author_name}</div>
                  <div className="text-sm text-gray-400">Author</div>
                </div>
              </div>
            )}
          </header>

          {post.metadata.featured_image && (
            <img 
              src={`${post.metadata.featured_image.imgix_url}?w=1600&h=800&fit=crop&auto=format,compress`}
              alt={post.title}
              className="w-full h-96 object-cover rounded-xl mb-8"
            />
          )}

          <div className="markdown-content">
            <ReactMarkdown>{post.metadata.content}</ReactMarkdown>
          </div>

          {post.metadata.tags && post.metadata.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-dark-border">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.metadata.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-dark-lighter text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}