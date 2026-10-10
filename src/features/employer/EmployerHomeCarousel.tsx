import { useState } from 'react'
import { employerHomeBanners } from '../../mocks/employerHomeFixtures'
import type { Destination } from '../../types/domain'
import { ServiceArtwork } from '../../components/ServiceArtwork'

export function EmployerHomeCarousel({ onNavigate }: { onNavigate: (destination: Destination) => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const banner = employerHomeBanners[activeIndex]

  const goTo = (index: number) => setActiveIndex(Math.max(0, Math.min(employerHomeBanners.length - 1, index)))
  const onTouchEnd = (touchEnd: number) => {
    if (touchStart === null) return
    const distance = touchEnd - touchStart
    if (distance < -45) goTo(activeIndex + 1)
    if (distance > 45) goTo(activeIndex - 1)
    setTouchStart(null)
  }

  return (
    <section
      className="employer-carousel"
      aria-label="Khám phá dịch vụ JobFree"
      aria-roledescription="carousel"
      onTouchStart={(event) => setTouchStart(event.changedTouches[0]?.clientX ?? null)}
      onTouchEnd={(event) => onTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
    >
      <article className={`employer-banner employer-banner--${banner.id}`} aria-live="polite" aria-roledescription="slide" aria-label={`${activeIndex + 1} trên ${employerHomeBanners.length}`}>
        <div className="employer-banner-copy">
          <span className="eyebrow">{banner.eyebrow}</span>
          <h1>{banner.title}</h1>
          <p>{banner.description}</p>
          <button className="employer-banner-cta" type="button" onClick={() => onNavigate(banner.destination)}>
            {banner.cta}<span aria-hidden="true">→</span>
          </button>
        </div>
        <ServiceArtwork service={banner.artwork} label={banner.artworkLabel} className="employer-banner-art" />
      </article>
      <div className="employer-carousel-controls">
        <div className="employer-carousel-dots" role="group" aria-label="Chọn banner">
          {employerHomeBanners.map((item, index) => <button key={item.id} type="button" aria-label={`Banner ${index + 1}: ${item.title}`} aria-current={index === activeIndex ? 'true' : undefined} className={index === activeIndex ? 'is-active' : ''} onClick={() => goTo(index)} />)}
        </div>
        <div className="employer-carousel-arrows">
          <button type="button" aria-label="Banner trước" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0}>‹</button>
          <button type="button" aria-label="Banner tiếp theo" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === employerHomeBanners.length - 1}>›</button>
        </div>
      </div>
    </section>
  )
}
