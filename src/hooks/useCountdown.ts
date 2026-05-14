import { useEffect, useState } from 'react'

export type Countdown = {
  days: number
  hours: number
  minutes: number
  isPast: boolean
}

const getCountdown = (targetDate: Date): Countdown => {
  const diff = targetDate.getTime() - Date.now()

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      isPast: true,
    }
  }

  const minutesTotal = Math.floor(diff / 60000)

  return {
    days: Math.floor(minutesTotal / 1440),
    hours: Math.floor((minutesTotal % 1440) / 60),
    minutes: minutesTotal % 60,
    isPast: false,
  }
}

export const useCountdown = (targetDate: Date): Countdown => {
  const [countdown, setCountdown] = useState<Countdown>(() =>
    getCountdown(targetDate),
  )

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown(targetDate))
    }, 60000)

    return () => {
      window.clearInterval(timer)
    }
  }, [targetDate])

  return countdown
}
