export function isPlainObject (value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false
  const proto = Object.getPrototypeOf(value) as object | null
  return proto === Object.prototype || proto === null
}

/**
 * Merges `source` into `target` and returns `target`. Never mutates `source`
 * (fixes v1 bug: converting a `dateFields` value used to write back into the
 * caller's own data object).
 *
 * - A real `Date` at a key listed in `dateFields` is stringified to ISO (fixes
 *   v1 bug: a plain object at that key used to throw on `.toISOString()`).
 * - Arrays are copied, never aliased (fixes v1 bug: `dateFields` itself was
 *   shared by reference between the module defaults, the user config, and
 *   every instance).
 * - Only plain objects are recursed into. `Date`, `Map`, `Set`, `Buffer` and
 *   class instances at any other key pass through by reference, intact
 *   (fixes v1 bug: these used to be flattened to `{}`, silently destroying
 *   data or throwing on `JSON.stringify`).
 */
export function deepMerge<T extends Record<string, unknown>> (
  target: T,
  source: unknown,
  dateFields: readonly string[] = []
): T {
  if (!isPlainObject(target) || !isPlainObject(source)) return target

  for (const key of Object.keys(source)) {
    const value = source[key]

    if (value instanceof Date && dateFields.includes(key)) {
      (target as Record<string, unknown>)[key] = value.toISOString()
      continue
    }

    if (Array.isArray(value)) {
      (target as Record<string, unknown>)[key] = value.slice()
      continue
    }

    if (isPlainObject(value)) {
      const existing = (target as Record<string, unknown>)[key]
      const next: Record<string, unknown> = isPlainObject(existing) ? existing : {}
      ;(target as Record<string, unknown>)[key] = next
      deepMerge(next, value, dateFields)
      continue
    }

    (target as Record<string, unknown>)[key] = value
  }

  return target
}
