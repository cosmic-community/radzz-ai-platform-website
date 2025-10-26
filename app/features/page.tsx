import { cosmic, hasStatus } from '@/lib/cosmic'
import { Feature } from '@/types'
import FeatureCard from '@/components/FeatureCard'

async function getFeatures(): Promise<Feature[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'features' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Feature[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw error
  }
}

export default async function FeaturesPage() {
  const features = await getFeatures()

  return (
    <div className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need for AI-powered productivity, all in one platform
          </p>
        </div>

        {features.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p>Features information coming soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}