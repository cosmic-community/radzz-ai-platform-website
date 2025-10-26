import { NextResponse } from 'next/server'
import { cosmic, hasStatus } from '@/lib/cosmic'

export async function GET() {
  try {
    const response = await cosmic.objects
      .find({ type: 'ai-modes' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    const modes = response.objects.filter((mode: any) => mode.metadata.active !== false)
    
    return NextResponse.json({ modes })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return NextResponse.json({ modes: [] })
    }
    return NextResponse.json(
      { error: 'Failed to fetch modes' },
      { status: 500 }
    )
  }
}