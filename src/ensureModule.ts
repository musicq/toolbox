const moduleCache = new Map<string, any>()

/**
 * Ensure a module is loaded and cached.
 *
 * This is useful when you want to load a ESM module from a CJS module.
 *
 * # Example
 *
 * ```ts
 * // index.cjs
 * import fetch from 'node-fetch'
 * // this will throw an error
 *
 * // index.ts
 * const fetch = await ensureModule<typeof import('node-fetch')>('node-fetch')
 * // this will work
 * ```
 */
export async function ensureModule<M>(moduleName: string): Promise<M> {
  if (moduleCache.has(moduleName)) return moduleCache.get(moduleName) as M

  const mod = await import(moduleName)
  moduleCache.set(moduleName, mod)

  return mod as M
}
