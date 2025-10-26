import Link from 'next/link'
import { BlogPost } from '@/types'

export default function BlogCard({ post }: { post: BlogPost }) {
  const formattedDate = new Date(post.metadata.published_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="block bg-dark-lighter rounded-xl overflow-hidden border border-dark-border hover:border-accent-blue transition-all duration-300 group"
    >
      {post.metadata.featured_image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={`${post.metadata.featured_image.imgix_url}?w=800&h=400&fit=crop&auto=format,compress`}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-lighter to-transparent"></div>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3 text-sm">
          <span className="px-3 py-1 bg-accent-blue/20 text-accent-blue rounded-full">
            {post.metadata.category.value}
          </span>
          <span className="text-gray-500">{formattedDate}</span>
          {post.metadata.read_time && (
            <span className="text-gray-500">{post.metadata.read_time} min read</span>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-accent-blue transition-colors">
          {post.metadata.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          {post.metadata.excerpt}
        </p>
        {post.metadata.author_name && (
          <div className="flex items-center gap-3 pt-4 border-t border-dark-border">
            {post.metadata.author_avatar && (
              <img 
                src={`${post.metadata.author_avatar.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                alt={post.metadata.author_name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm text-gray-400">By {post.metadata.author_name}</span>
          </div>
        )}
      </div>
    </Link>
  )
}