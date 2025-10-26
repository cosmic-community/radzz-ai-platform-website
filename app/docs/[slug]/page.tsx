// app/docs/[slug]/page.tsx
import { cosmic, hasStatus } from '@/lib/cosmic'
import { DocumentationPage } from '@/types'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

async function getDocBySlug(slug: string): Promise<DocumentationPage | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'documentation-pages', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.object as DocumentationPage
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw error
  }
}

async function getAllDocs(): Promise<DocumentationPage[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'documentation-pages' })
      .props(['slug'])
    
    return response.objects as DocumentationPage[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw error
  }
}

export async function generateStaticParams() {
  const docs = await getAllDocs()
  return docs.map((doc) => ({
    slug: doc.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = await getDocBySlug(slug)
  
  if (!doc) {
    return {
      title: 'Documentation Not Found - RADZZ',
    }
  }

  return {
    title: `${doc.metadata.page_title} - RADZZ Documentation`,
    description: doc.metadata.content.substring(0, 160),
  }
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = await getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  return (
    <div className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Cover Image */}
        {doc.metadata.cover_image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img 
              src={`${doc.metadata.cover_image.imgix_url}?w=1600&h=600&fit=crop&auto=format,compress`}
              alt={doc.metadata.page_title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-accent-blue/20 text-accent-blue rounded-full text-sm font-medium">
            {doc.metadata.category.value}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
          {doc.metadata.page_title}
        </h1>

        {/* Markdown Content */}
        <div className="prose prose-invert prose-lg max-w-none markdown-content">
          <ReactMarkdown>{doc.metadata.content}</ReactMarkdown>
        </div>

        {/* Related Pages */}
        {doc.metadata.related_pages && doc.metadata.related_pages.length > 0 && (
          <div className="mt-12 pt-8 border-t border-dark-border">
            <h2 className="text-2xl font-bold mb-6">Related Documentation</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {doc.metadata.related_pages.map((relatedDoc) => (
                <a
                  key={relatedDoc.id}
                  href={`/docs/${relatedDoc.slug}`}
                  className="block p-4 bg-dark-lighter rounded-lg border border-dark-border hover:border-accent-blue transition-colors"
                >
                  <h3 className="font-semibold text-white mb-2">
                    {relatedDoc.metadata.page_title}
                  </h3>
                  <span className="text-sm text-gray-400">
                    {relatedDoc.metadata.category.value}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}