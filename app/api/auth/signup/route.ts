import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { cosmic } from '@/lib/cosmic'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    try {
      const existingUser = await cosmic.objects.findOne({
        type: 'users',
        'metadata.email': email
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        )
      }
    } catch (error: any) {
      // 404 is expected if user doesn't exist
      if (error.status !== 404) {
        throw error
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user in Cosmic
    const user = await cosmic.objects.insertOne({
      title: name,
      type: 'users',
      metadata: {
        email,
        password_hash: passwordHash,
        name,
        created_date: new Date().toISOString()
      }
    })

    // Generate JWT token
    const token = await new SignJWT({ userId: user.object.id, email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.object.id,
        name,
        email
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}