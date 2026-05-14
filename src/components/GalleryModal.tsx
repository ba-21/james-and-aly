import { useEffect, useRef } from 'react'
import type { EventImage } from '../content'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { Icon } from './Icon'

export type GalleryItem = {
  title: string
  image: EventImage
}

export type GalleryModalProps = {
  title: string
  items: GalleryItem[]
  activeIndex: number | null
  onClose: () => void
  onStep: (direction: -1 | 1) => void
}

export function GalleryModal({
  title,
  items,
  activeIndex,
  onClose,
  onStep,
}: GalleryModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const activeItem = activeIndex === null ? undefined : items[activeIndex]
  const isOpen = Boolean(activeItem)

  useLockBodyScroll(isOpen)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onStep(-1)
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onStep(1)
        return
      }

      if (event.key === 'Tab' && panelRef.current) {
        const focusableElements =
          panelRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (!firstElement || !lastElement) {
          return
        }

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
      previousFocusRef.current = null
    }
  }, [isOpen, onClose, onStep])

  if (!activeItem || activeIndex === null) {
    return null
  }

  return (
    <div
      className="gallery-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="gallery-modal-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          className="gallery-modal-close"
          type="button"
          aria-label="Close gallery"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
        <button
          className="gallery-modal-step gallery-modal-step--previous"
          type="button"
          aria-label="Previous image"
          onClick={() => onStep(-1)}
        >
          <Icon name="arrow_back" />
        </button>
        <figure className="gallery-modal-frame">
          <img src={activeItem.image.src} alt={activeItem.image.alt} />
          <figcaption>
            <span>{activeItem.title}</span>
            <span>
              {activeIndex + 1} / {items.length}
            </span>
          </figcaption>
        </figure>
        <button
          className="gallery-modal-step gallery-modal-step--next"
          type="button"
          aria-label="Next image"
          onClick={() => onStep(1)}
        >
          <Icon name="arrow_forward" />
        </button>
      </div>
    </div>
  )
}
