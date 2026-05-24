import confetti from 'canvas-confetti'
import { useEffect } from 'react'

const duration = 5 * 1000
const intervalDelay = 250
const defaults = {
  startVelocity: 30,
  spread: 360,
  scalar: 2,
  ticks: 60,
  zIndex: 220,
  disableForReducedMotion: true,
}

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min

export function ConfettiBurst() {
  useEffect(() => {
    const animationEnd = Date.now() + duration
    const fireworkInterval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        window.clearInterval(fireworkInterval)
        return
      }

      const particleCount = Math.ceil(50 * (timeLeft / duration))

      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
      })
    }, intervalDelay)

    return () => {
      window.clearInterval(fireworkInterval)
      confetti.reset()
    }
  }, [])

  return null
}
