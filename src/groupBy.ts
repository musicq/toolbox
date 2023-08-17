/**
 * Group an array by a key.
 *
 * # Example
 *
 * ```ts
 * const source = [
 *   {name: 'a', value: 1},
 *   {name: 'b', value: 2},
 *   {name: 'a', value: 3},
 *   {name: 'b', value: 4},
 * ]
 * const result = groupBy(source, x => x.name, x => x.value)
 * // {a: [1, 3], b: [2, 4]}
 * ```
 */
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
    const source = [
      {name: 'a', value: 1},
      {name: 'b', value: 2},
      {name: 'a', value: 3},
      {name: 'b', value: 4},
    ]

    test('groupBy without elementSelector', () => {
      const result = groupBy(source, x => x.name)
      expect(result).toEqual({
        a: [
          {name: 'a', value: 1},
          {name: 'a', value: 3},
        ],
        b: [
          {name: 'b', value: 2},
          {name: 'b', value: 4},
        ],
      })
    })

    test('groupBy with elementSelector', () => {
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
