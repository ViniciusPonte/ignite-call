/* eslint-disable camelcase */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const splittedRoute = req.url.split('/')
  const queryParams = splittedRoute[splittedRoute.length - 1].split('?')

  const date = queryParams[1].split('=')[1]

  if (!date) {
    return NextResponse.json(
      { message: 'Year or month not specified' },
      { status: 404 },
    )
  }

  const username = splittedRoute[splittedRoute.length - 2]

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.week_day === weekDay,
    )
  })

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    SELECT 
        EXTRACT(DAY FROM S.date) AS date,
        COUNT(S.date) AS amount,
        ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) AS size

    FROM schedulings S

    LEFT JOIN user_time_intervals UTI
        ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))

    WHERE S.user_id = ${user.id}
        AND DATE_FORMAT(S.date, "%Y-%m") = ${date}
    
    GROUP BY EXTRACT(DAY FROM S.date), 
        ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

    HAVING amount >= size
  `

  const blockedDates = blockedDatesRaw.map((item) => item.date)

  return NextResponse.json(
    {
      blockedWeekDays: blockedWeekDays || [],
      blockedDates: blockedDates || [],
    },
    { status: 200 },
  )
}
