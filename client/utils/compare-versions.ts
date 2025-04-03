/**
 * Form version-related utilities
 */

/**
 * Compares two semantic version strings
 */
function compareVersions (v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number)
  const parts2 = v2.split('.').map(Number)

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = i < parts1.length ? parts1[i] : 0
    const part2 = i < parts2.length ? parts2[i] : 0

    if (part1 > part2) {
      return 1
    }
    if (part1 < part2) {
      return -1
    }
  }

  return 0
}

/**
 * Checks if a version needs to be reset based on version change and forceRefresh flag
 */
export function shouldReset (
  storedVersion: string | undefined,
  newVersion: string,
  forceRefresh: boolean
): boolean {
  if (forceRefresh || !storedVersion) {
    return true
  }

  return compareVersions(newVersion, storedVersion) > 0
}
