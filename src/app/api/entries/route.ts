import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const entries = await prisma.entry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(entries)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, content, mood, inputType } = await req.json()

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 })
  }

  const entry = await prisma.entry.create({
    data: {
      title,
      content,
      mood: mood || null,
      inputType: inputType || 'text',
      userId: session.user.id,
    },
  })

  return NextResponse.json(entry, { status: 201 })
}
