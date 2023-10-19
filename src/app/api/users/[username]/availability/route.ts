/* eslint-disable camelcase */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export async function GET(req: Request) {
  const splittedRoute = req.url.split('/')
  const queryParams = splittedRoute[splittedRoute.length - 1].split('?')

  const date = queryParams[1].split('=')[1]

  const username = splittedRoute[splittedRoute.length - 2]

  if (!date) {
    return NextResponse.json({ message: 'Date not provided' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  const referenceDate = dayjs(String(date))

  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return NextResponse.json(
      { possibleTimes: [], availableTimes: [] },
      { status: 200 },
    )
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return NextResponse.json(
      { possibleTimes: [], availableTimes: [] },
      { status: 200 },
    )
  }

  const { time_end_in_minutes, time_start_in_minutes } = userAvailability

  const startHour = time_start_in_minutes / 60
  const endHour = time_end_in_minutes / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )

  const blockedTimes = await prisma.scheduling.findMany({
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time,
    )

    const isTimeInPast = referenceDate.set('hour', time).isBefore(new Date())

    return !isTimeBlocked && !isTimeInPast
  })

  return NextResponse.json({ possibleTimes, availableTimes }, { status: 200 })
}
