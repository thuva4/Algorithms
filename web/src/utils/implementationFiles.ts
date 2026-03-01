import type { ImplementationEntry, ImplementationFile } from '../types'

function shouldHideImplementationFile(language: string, file: ImplementationFile) {
  return language === 'c' && file.filename.toLowerCase().endsWith('.h')
}

export function getVisibleImplementationFiles(language: string, files: ImplementationFile[]) {
  return files.filter((file) => !shouldHideImplementationFile(language, file))
}

export function getVisibleImplementations(implementations: Record<string, ImplementationEntry>) {
  return Object.fromEntries(
    Object.entries(implementations).flatMap(([language, entry]) => {
      const files = getVisibleImplementationFiles(language, entry.files ?? [])
      if (files.length === 0) {
        return []
      }

      return [[language, { ...entry, files }]]
    })
  ) as Record<string, ImplementationEntry>
}
