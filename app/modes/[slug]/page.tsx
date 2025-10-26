// app/modes/[slug]/page.tsx
import { cosmic, hasStatus } from '@/lib/cosmic'
import { AIMode } from '@/types'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

async function getMode(slug: string): Promise<AIMode | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'ai-modes',
      slug
    }).depth(1)
    
    return response.object as AIMode
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw error
  }
}

export default async function ModePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const mode = await getMode(slug)

  if (!mode) {
    return (
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Mode Not Found</h1>
          <p className="text-gray-400 mb-8">The AI mode you're looking for doesn't exist.</p>
          <Link href="/modes" className="text-accent-blue hover:text-accent-purple">
            ← Back to All Modes
          </Link>
        </div>
      </div>
    )
  }

  const colorClass = mode.metadata.color_theme || '#4A90E2'

  return (
    <div className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/modes" className="text-accent-blue hover:text-accent-purple mb-8 inline-block">
          ← Back to All Modes
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="text-6xl"
              style={{ filter: `drop-shadow(0 0 20px ${colorClass}60)` }}
            >
              {mode.metadata.mode_icon}
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">Mode {mode.metadata.mode_number}</div>
              <h1 className="text-5xl font-bold gradient-text">
                {mode.metadata.mode_name}
              </h1>
            </div>
          </div>

          {mode.metadata.featured_image && (
            <img 
              src={`${mode.metadata.featured_image.imgix_url}?w=1600&h=600&fit=crop&auto=format,compress`}
              alt={mode.metadata.mode_name}
              className="w-full h-64 object-cover rounded-xl mb-8"
            />
          )}

          <p className="text-xl text-gray-300 leading-relaxed">
            {mode.metadata.short_description}
          </p>
        </div>

        {mode.metadata.full_description && (
          <div className="bg-dark-lighter rounded-xl p-8 mb-8">
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: mode.metadata.full_description }}
            />
          </div>
        )}

        {mode.metadata.example_prompts && mode.metadata.example_prompts.length > 0 && (
          <div className="bg-dark-lighter rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Example Prompts</h2>
            <ul className="space-y-3">
              {mode.metadata.example_prompts.map((prompt, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-accent-blue mt-1">→</span>
                  <span className="text-gray-300">{prompt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-dark-lighter rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">System Prompt</h2>
          <p className="text-gray-400 text-sm mb-4">
            This is the specialized instruction that guides the AI's behavior in this mode:
          </p>
          <div className="bg-dark p-4 rounded-lg border border-dark-border">
            <p className="text-gray-300 font-mono text-sm leading-relaxed">
              {mode.metadata.system_prompt}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}