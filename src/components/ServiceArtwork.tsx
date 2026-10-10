import { useState } from 'react'
import { employerServiceArtworkSources } from '../mocks/employerServiceArtwork'
import type { EmployerServiceArt } from '../mocks/employerHomeFixtures'

const fallbackColor: Record<EmployerServiceArt, string> = {
  moving: '#fff2d8', cleaning: '#eaf7ef', delivery: '#edf4fc', events: '#fff0eb',
}

export function ServiceArtwork({ service, label, className = '', decorative = false }: { service: EmployerServiceArt; label: string; className?: string; decorative?: boolean }) {
  const [failed, setFailed] = useState(false)

  return (
    <span
      className={`service-art service-art--${service} ${className}`.trim()}
      style={{ backgroundColor: fallbackColor[service] }}
    >
      {failed ? (
        <span className="service-art-fallback" role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : label} aria-hidden={decorative || undefined} />
      ) : (
        <img
          src={employerServiceArtworkSources[service]}
          alt={decorative ? '' : label}
          aria-hidden={decorative || undefined}
          loading="lazy"
          decoding="async"
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}
