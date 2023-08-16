/**
 * Lazy init variables.
 *
 * This is useful when some variables might not been initialized yet when it was declared.
 *
 * # Example
 *
 * ```ts
 * const lazyVariable = lazy(() => 1)
 * const unwrappedValue = lazyVariable.unwrap()
 * //=> 1
 * ```
 */
export function lazy<T>(a: () => T): {unwrap: () => T} {
  let cache: T

  return {
    unwrap: () => cache ?? (cache = a()),
  }
}

if (import.meta.vitest) {
  describe('lazy', () => {
    test('should lazy init a variable', () => {
      const lazyVariable = lazy(() => 1)
      const unwrappedValue = lazyVariable.unwrap()
      expect(unwrappedValue).toBe(1)
    })

    test('should lazy init a variable only once', () => {
      let counter = 0
      const lazyVariable = lazy(() => ++counter)
      const unwrappedValue = lazyVariable.unwrap()
      expect(unwrappedValue).toBe(1)
      expect(lazyVariable.unwrap()).toBe(1)
      expect(lazyVariable.unwrap()).toBe(1)
    })
  })
}
