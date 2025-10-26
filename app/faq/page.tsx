import { cosmic, hasStatus } from '@/lib/cosmic'
import { FAQItem } from '@/types'

async function getFAQs(): Promise<FAQItem[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'faq-items' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    const faqs = response.objects as FAQItem[]
    return faqs.sort((a, b) => (a.metadata.order || 0) - (b.metadata.order || 0))
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw error
  }
}

export default async function FAQPage() {
  const faqs = await getFAQs()

  const categories = Array.from(new Set(faqs.map(faq => faq.metadata.category.value)))
  const faqsByCategory = categories.reduce((acc, category) => {
    acc[category] = faqs.filter(faq => faq.metadata.category.value === category)
    return acc
  }, {} as Record<string, FAQItem[]>)

  const featuredFAQs = faqs.filter(faq => faq.metadata.featured)

  return (
    <div className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Find answers to common questions about RADZZ
          </p>
        </div>

        {featuredFAQs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-accent-blue">Popular Questions</h2>
            <div className="space-y-4">
              {featuredFAQs.map((faq) => (
                <details 
                  key={faq.id}
                  className="bg-dark-lighter rounded-xl p-6 border border-dark-border group"
                >
                  <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
                    <span>{faq.metadata.question}</span>
                    <span className="text-accent-blue">+</span>
                  </summary>
                  <div 
                    className="mt-4 text-gray-400 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: faq.metadata.answer }}
                  />
                </details>
              ))}
            </div>
          </div>
        )}

        {faqs.length > 0 ? (
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryFAQs = faqsByCategory[category]
              if (!categoryFAQs || categoryFAQs.length === 0) return null

              return (
                <div key={category}>
                  <h2 className="text-2xl font-bold mb-6 text-accent-blue">
                    {category}
                  </h2>
                  <div className="space-y-4">
                    {categoryFAQs.map((faq) => (
                      <details 
                        key={faq.id}
                        className="bg-dark-lighter rounded-xl p-6 border border-dark-border group"
                      >
                        <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
                          <span>{faq.metadata.question}</span>
                          <span className="text-accent-blue">+</span>
                        </summary>
                        <div 
                          className="mt-4 text-gray-400 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: faq.metadata.answer }}
                        />
                      </details>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p>FAQ content coming soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}