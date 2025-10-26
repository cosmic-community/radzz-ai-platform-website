import { cosmic, hasStatus } from '@/lib/cosmic'
import { AIMode } from '@/types'
import ModeCard from '@/components/ModeCard'

async function getAIModes(): Promise<AIMode[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'ai-modes' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    const modes = response.objects as AIMode[]
    return modes
      .filter(mode => mode.metadata.active !== false)
      .sort((a, b) => a.metadata.mode_number - b.metadata.mode_number)
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw error
  }
}

export default async function ModesPage() {
  const modes = await getAIModes()

  return (
    <div className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            7 Specialized AI Modes
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Each mode is optimized for specific tasks with specialized system prompts, 
            giving you expert-level assistance in every domain.
          </p>
        </div>

        {modes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modes.map((mode) => (
              <ModeCard key={mode.id} mode={mode} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p>No AI modes available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}