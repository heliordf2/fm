import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'franca-fm-hidden'

function loadHidden() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useHiddenRadios() {
  const [hidden, setHidden] = useState(loadHidden)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hidden))
  }, [hidden])

  const isHidden = useCallback(
    (id) => hidden.includes(id),
    [hidden],
  )

  const hideRadio = useCallback((id) => {
    setHidden((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const unhideRadio = useCallback((id) => {
    setHidden((prev) => prev.filter((item) => item !== id))
  }, [])

  const toggleHidden = useCallback((id) => {
    setHidden((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }, [])

  return { hidden, isHidden, hideRadio, unhideRadio, toggleHidden }
}
