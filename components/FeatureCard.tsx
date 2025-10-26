import Link from 'next/link'
import { Feature } from '@/types'

export default function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Link 
      href={`/features/${feature.slug}`}
      className="block bg-dark-lighter rounded-xl p-6 border border-dark-border hover:border-accent-blue transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
          {feature.metadata.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {feature.metadata.available && (
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                Available
              </span>
            )}
            {feature.metadata.coming_soon && (
              <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                Coming Soon
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-accent-blue transition-colors">
            {feature.metadata.feature_name}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {feature.metadata.short_description}
          </p>
        </div>
      </div>
    </Link>
  )
}