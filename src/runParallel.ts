/**
 * Run promises in parallel with a concurrency limit and return the results in the same order.
 *
 * # Example
 *
 * ```ts
 * import {wait} from '@musicq/toolbox'
 * 
 * const res = await runParallel([40, 20, 50, 10], wait, 2)
 * // res => [40, 20, 50, 10]
 * ```
 *
 * If you don't specify a concurrency limit, it will default to run all promises in parallel.
 *
 * You can run promises sequentially by setting the concurrency limit to 1.
 */
export async function runParallel<T, U>(
  data: T[],
  mapper: (v: T, i: number) => Promise<U>,
  concurrency?: number
): Promise<U[]> {
  concurrency ??= data.length
  let index = concurrency - 1
  const results: U[] = []

  const executeNext = async (item: T, idx: number) => {
    if (idx >= data.length) return

    results[idx] = await mapper(item, idx)

    index++
    await executeNext(data[index], index)
  }

  await Promise.all(data.slice(0, concurrency).map((p, i) => executeNext(p, i)))

  return results
}

if (import.meta.vitest) {
  describe('runParallel', () => {
    test('should run promises in parallel', async () => {
      const wait = (ms: number) =>
        new Promise(resolve => setTimeout(() => resolve(ms), ms))

      expect(runParallel([40, 20, 50, 10], wait, 2)).resolves.toStrictEqual([
        40, 20, 50, 10,
      ])
    })
  })
}
