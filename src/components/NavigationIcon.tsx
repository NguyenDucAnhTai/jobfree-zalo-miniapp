import type { NavigationIconName } from '../navigation/navigation'

export function NavigationIcon({ name }: { name: NavigationIconName }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: 1.8 }

  return (
    <svg className="navigation-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...common}>
      {name === 'home' && <><path d="m3.5 10 8.5-7 8.5 7" /><path d="M5.5 9v11h13V9M9.5 20v-6h5v6" /></>}
      {name === 'services' && <><rect x="4" y="4" width="6" height="6" rx="1.2" /><rect x="14" y="4" width="6" height="6" rx="1.2" /><rect x="4" y="14" width="6" height="6" rx="1.2" /><rect x="14" y="14" width="6" height="6" rx="1.2" /></>}
      {name === 'jobs' && <><rect x="5" y="4.5" width="14" height="17" rx="2" /><path d="M9 4.5v-2h6v2M8 10h7M8 14h4" /><path d="m14.5 16 1.5 1.5 3-3" /></>}
      {name === 'schedule' && <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3v4M16.5 3v4M3.5 9.5h17M8 13h2M13 13h2M8 17h2" /></>}
      {name === 'wallet' && <><rect x="3" y="6" width="18" height="15" rx="2.5" /><path d="M3.5 8V5.5A2.5 2.5 0 0 1 6 3h12M15 12h6v5h-6a2.5 2.5 0 0 1 0-5Z" /><path d="M16 14.5h.01" /></>}
      {name === 'account' && <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>}
    </svg>
  )
}
