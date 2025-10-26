import Link from 'next/link'
import { AIMode } from '@/types'

export default function ModeCard({ mode }: { mode: AIMode }) {
  const colorClass = mode.metadata.color_theme || '#4A90E2'

  return (
    <Link 
      href={`/modes/${mode.slug}`}
      className="block bg-dark-lighter rounded-xl p-6 border border-dark-border hover:border-accent-blue transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <div 
          className="text-4xl group-hover:scale-110 transition-transform duration-300"
          style={{ filter: `drop-shadow(0 0 10px ${colorClass}40)` }}
        >
          {mode.metadata.mode_icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">Mode {mode.metadata.mode_number}</span>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-accent-blue transition-colors">
            {mode.metadata.mode_name}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {mode.metadata.short_description}
          </p>
        </div>
      </div>
    </Link>
  )
}