interface GetWeekDaysParams {
  short?: boolean
}

export function getWeekDays({ short = false }: GetWeekDaysParams = {}) {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekday) => {
      if (short) {
        return weekday.substring(0, 3).toUpperCase()
      }

      return weekday.substring(0, 1).toUpperCase().concat(weekday.substring(1))
    })
}
