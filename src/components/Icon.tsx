import type { MaterialIconName } from '../types'

export type IconProps = {
  name: MaterialIconName
  filled?: boolean
  className?: string
}

export function Icon({ name, filled = false, className }: IconProps) {
  const classes = [
    'material-symbols-outlined',
    'material-icon',
    filled ? 'material-icon--filled' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} aria-hidden="true">
      {name}
    </span>
  )
}

