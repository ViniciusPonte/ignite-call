import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const username = req.url.slice(req.url.lastIndexOf('/') + 1)

  console.log('teste ', username)

  if (!username) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  console.log(user)

  return NextResponse.json({ user }, { status: 200 })
}
