export function wait<T>(ms: number, fn?: () => T): Promise<T> {
  return new Promise<T>(resolve =>
    setTimeout(() => resolve(fn ? fn() : (undefined as T)), ms)
  )
}

if (import.meta.vitest) {
  describe('wait', () => {
    test('wait 10ms', async () => {
      const start = Date.now()
      await wait(10)
      expect(Date.now() - start).toBeGreaterThanOrEqual(10)
    })

    test('wait 10ms with fn', async () => {
      const start = Date.now()
      await wait(10, () => 1)
      expect(Date.now() - start).toBeGreaterThanOrEqual(10)
    })
  })
}
