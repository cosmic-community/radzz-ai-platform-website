import Link from 'next/link'
import { cosmic, hasStatus } from '@/lib/cosmic'
import { AIMode, Feature, BlogPost } from '@/types'
import ModeCard from '@/components/ModeCard'
import FeatureCard from '@/components/FeatureCard'
import BlogCard from '@/components/BlogCard'

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

async function getLatestPosts(): Promise<BlogPost[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'blog-posts' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    const posts = response.objects as BlogPost[]
    return posts
      .sort((a, b) => {
        const dateA = new Date(a.metadata.published_date).getTime()
        const dateB = new Date(b.metadata.published_date).getTime()
        return dateB - dateA
      })
      .slice(0, 3)
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw error
  }
}

export default async function HomePage() {
  const [modes, features, latestPosts] = await Promise.all([
    getAIModes(),
    getFeatures(),
    getLatestPosts(),
  ])

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 blur-3xl"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 glow-text">
              RADZZ ⚡
            </h1>
            <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
              Your AI-Powered Productivity Platform
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              7 specialized AI modes for coding, learning, design, research, and more. 
              Switch seamlessly between modes and boost your productivity.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link 
                href="/docs" 
                className="px-8 py-3 bg-accent-blue hover:bg-accent-purple rounded-lg font-semibold transition-all duration-300 glow-border"
              >
                Get Started
              </Link>
              <Link 
                href="/modes" 
                className="px-8 py-3 bg-dark-lighter hover:bg-dark-border rounded-lg font-semibold transition-all duration-300 border border-dark-border"
              >
                Explore Modes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Modes Section */}
      <section className="py-16 px-6 bg-dark-lighter/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              7 Specialized AI Modes
            </h2>
            <p className="text-gray-400 text-lg">
              Each mode is optimized for specific tasks with specialized system prompts
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

          <div className="text-center mt-12">
            <Link 
              href="/modes" 
              className="inline-block px-6 py-3 bg-dark-lighter hover:bg-dark-border rounded-lg font-semibold transition-all duration-300 border border-dark-border"
            >
              View All Modes →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-lg">
              Everything you need for AI-powered productivity
            </p>
          </div>
          
          {features.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.slice(0, 6).map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <p>Features coming soon.</p>
            </div>
          )}

          {features.length > 6 && (
            <div className="text-center mt-12">
              <Link 
                href="/features" 
                className="inline-block px-6 py-3 bg-dark-lighter hover:bg-dark-border rounded-lg font-semibold transition-all duration-300 border border-dark-border"
              >
                View All Features →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      {latestPosts.length > 0 && (
        <section className="py-16 px-6 bg-dark-lighter/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 gradient-text">
                Latest from the Blog
              </h2>
              <p className="text-gray-400 text-lg">
                News, updates, and insights from the RADZZ team
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link 
                href="/blog" 
                className="inline-block px-6 py-3 bg-dark-lighter hover:bg-dark-border rounded-lg font-semibold transition-all duration-300 border border-dark-border"
              >
                View All Posts →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 gradient-text">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start using RADZZ today and experience the power of specialized AI modes
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/docs/getting-started-with-radzz" 
              className="px-8 py-3 bg-accent-blue hover:bg-accent-purple rounded-lg font-semibold transition-all duration-300 glow-border"
            >
              Get Started
            </Link>
            <Link 
              href="/faq" 
              className="px-8 py-3 bg-dark-lighter hover:bg-dark-border rounded-lg font-semibold transition-all duration-300 border border-dark-border"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}