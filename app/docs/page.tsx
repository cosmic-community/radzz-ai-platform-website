import { cosmic, hasStatus } from '@/lib/cosmic'
import { DocumentationPage } from '@/types'
import Link from 'next/link'

async function getDocs(): Promise<DocumentationPage[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'documentation-pages' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    const docs = response.objects as DocumentationPage[]
    return docs.sort((a, b) => (a.metadata.order || 0) - (b.metadata.order || 0))
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw error
  }
}

export default async function DocsPage() {
  const docs = await getDocs()

  const categories = Array.from(new Set(docs.map(doc => doc.metadata.category.value)))
  const docsByCategory = categories.reduce((acc, category) => {
    acc[category] = docs.filter(doc => doc.metadata.category.value === category)
    return acc
  }, {} as Record<string, DocumentationPage[]>)

  return (
    <div className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            Documentation
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Learn everything about RADZZ and how to make the most of its features
          </p>
        </div>

        {docs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const categoryDocs = docsByCategory[category]
              if (!categoryDocs || categoryDocs.length === 0) return null

              return (
                <div key={category} className="bg-dark-lighter rounded-xl p-6 border border-dark-border">
                  <h2 className="text-2xl font-bold mb-4 text-accent-blue">
                    {category}
                  </h2>
                  <ul className="space-y-3">
                    {categoryDocs.map((doc) => (
                      <li key={doc.id}>
                        <Link 
                          href={`/docs/${doc.slug}`}
                          className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                        >
                          <span>→</span>
                          <span>{doc.metadata.page_title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p>Documentation coming soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}