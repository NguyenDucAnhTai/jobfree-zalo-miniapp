import { describe, expect, it } from 'vitest'
import mainSource from './main.tsx?raw'

describe('application stylesheet entry', () => {
  it('loads App.css exactly once from the application entrypoint', () => {
    const stylesheetImports = mainSource.match(/import\s+['"]\.\/App\.css['"];?/g) ?? []

    expect(stylesheetImports).toHaveLength(1)
  })
})
