/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import mainSource from './main.tsx?raw'

describe('application stylesheet entry', () => {
  it('loads App.css exactly once from the application entrypoint', () => {
    const stylesheetImports = mainSource.match(/import\s+['"]\.\/App\.css['"];?/g) ?? []

    expect(stylesheetImports).toHaveLength(1)
  })

  it('keeps R4 Worker Core selector families in the main stylesheet', async () => {
    const css = readFileSync(resolve(process.cwd(), 'src/App.css'), 'utf8')
    expect(css).toContain('.worker-profile-page')
    expect(css).toContain('.worker-opportunities-page')
    expect(css).toContain('.worker-readiness-card')
    expect(css).toContain('.worker-core-state')
  })
})
