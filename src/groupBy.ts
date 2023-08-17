export function groupBy<S, V>(
  source: S[],
  keySelector: (v: S) => string,
  elementSelector: (v: S) => V = x => x as any
) {
  const result: Record<string, V[]> = {}

  for (const item of source) {
    const key = keySelector(item)
    result[key] ??= []
    result[key].push(elementSelector(item))
  }

  return result
}

if (import.meta.vitest) {
  describe('groupBy', () => {
    test('groupBy', () => {
      const source = [
        {name: 'a', value: 1},
        {name: 'b', value: 2},
        {name: 'a', value: 3},
        {name: 'b', value: 4},
      ]

      const result = groupBy(
        source,
        x => x.name,
        x => x.value
      )
      expect(result).toEqual({
        a: [1, 3],
        b: [2, 4],
      })
    })
  })
}
