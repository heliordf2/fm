import { useCallback, useEffect, useRef, useState } from 'react'

export function useSleepTimer({ onExpire }) {
  const [minutes, setMinutes] = useState('')
  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const timerRef = useRef(null)
  const tickRef = useRef(null)
  const endTimeRef = useRef(null)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (tickRef.current) clearInterval(tickRef.current)
    timerRef.current = null
    tickRef.current = null
    endTimeRef.current = null
    setRemainingSeconds(null)
  }, [])

  const startSleep = useCallback(() => {
    const mins = Number(String(minutes).replace(',', '.'))
    if (!Number.isFinite(mins) || mins <= 0) return false

    clearTimer()

    const totalMs = mins * 60 * 1000
    endTimeRef.current = Date.now() + totalMs
    setRemainingSeconds(Math.ceil(totalMs / 1000))

    tickRef.current = setInterval(() => {
      const left = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000))
      setRemainingSeconds(left)
      if (left <= 0 && tickRef.current) {
        clearInterval(tickRef.current)
        tickRef.current = null
      }
    }, 1000)

    timerRef.current = setTimeout(() => {
      clearTimer()
      onExpireRef.current?.()
    }, totalMs)

    return true
  }, [minutes, clearTimer])

  useEffect(() => () => clearTimer(), [clearTimer])

  return {
    minutes,
    setMinutes,
    remainingSeconds,
    isActive: remainingSeconds !== null && remainingSeconds > 0,
    startSleep,
    cancelSleep: clearTimer,
  }
}
