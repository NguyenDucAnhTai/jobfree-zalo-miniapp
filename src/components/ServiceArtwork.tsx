import type { CSSProperties } from 'react'
import type { EmployerServiceArt } from '../mocks/employerHomeFixtures'

const spritePosition: Record<EmployerServiceArt, string> = {
  moving: '0% 0%',
  cleaning: '100% 0%',
  delivery: '0% 100%',
  events: '100% 100%',
}
const fallbackColor: Record<EmployerServiceArt, string> = {
  moving: '#fff2d8', cleaning: '#eaf7ef', delivery: '#edf4fc', events: '#fff0eb',
}

export function ServiceArtwork({ service, label, className = '' }: { service: EmployerServiceArt; label: string; className?: string }) {
  return (
    <span
      className={`service-art service-art--${service} ${className}`.trim()}
      role="img"
      aria-label={label}
      style={{ '--service-art-position': spritePosition[service], backgroundColor: fallbackColor[service] } as CSSProperties}
    />
  )
}
