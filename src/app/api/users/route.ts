import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const res = await req.json()

  const userExists = await prisma.user.findUnique({
    where: {
      username: res.username,
    },
  })

  if (userExists) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 },
    )
  }

  const user = await prisma.user.create({
    data: {
      name: res.name,
      username: res.username,
    },
  })

  cookies().set('@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/', // all routes can access
  })

  return NextResponse.json({ res }, { status: 201 })
}
