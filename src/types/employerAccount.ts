export type EmployerKind = 'individual' | 'shop' | 'business'
export interface EmployerDemoProfile { displayName: string; kind: EmployerKind; businessLabel: string }
export type SavedAddressKind = 'home' | 'store' | 'office' | 'other'
export interface EmployerSavedAddress { id: string; label: string; kind: SavedAddressKind; area: string }
export interface EmployerNotification { id: string; type: 'assigned' | 'upcoming' | 'checked_in' | 'extension' | 'completion' | 'review' | 'case'; title: string; detail: string; requestId?: string; createdAt: string; read: boolean }
