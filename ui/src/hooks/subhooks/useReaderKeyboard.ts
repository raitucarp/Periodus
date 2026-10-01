import { useEffect } from 'react'

interface KeyboardNavigationProps {
  hasPrev: boolean
  hasNext: boolean
  onPrev: () => void
  onNext: () => void
}

export function useReaderKeyboard({ hasPrev, hasNext, onPrev, onNext }: KeyboardNavigationProps) {
  useEffect(function setupKeyboardShortcuts() {
    function handleKeyDown(event: KeyboardEvent) {
      const { key, target } = event
      const targetTag = (target as HTMLElement)?.tagName
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag)) {
        return
      }

      if (key === 'ArrowLeft' && hasPrev) {
        event.preventDefault()
        onPrev()
      } else if ((key === 'ArrowRight' || key === ' ') && hasNext) {
        event.preventDefault()
        onNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return function cleanupKeyboard() {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [hasPrev, hasNext, onPrev, onNext])
}
