/**
 * Run promises in parallel with a concurrency limit and return the results in the same order.
 *
 * # Example
 *
 * ```ts
 * await runParallel([wait(40), wait(20), wait(50), wait(10)], 2)
 * //=> [40, 20, 50, 10]
 * ```
 *
 * If you don't specify a concurrency limit, it will default to run all promises in parallel.
 *
 * You can run promises sequentially by setting the concurrency limit to 1.
 */
export async function runParallel(
  promises: Promise<any>[],
  concurrency?: number
): Promise<any[]> {
  concurrency ??= promises.length

  const results: any[] = []
  let index = concurrency - 1

  const executeNext = async (promise: Promise<any>, idx: number) => {
    if (idx >= promises.length) return

    results[idx] = await promise

    index++
    await executeNext(promises[index], index)
  }

  await Promise.all(
    promises.slice(0, concurrency).map((p, i) => executeNext(p, i))
  )

  return results
}

if (import.meta.vitest) {
  describe('runParallel', () => {
    test('should run promises in parallel', async () => {
      const wait = (ms: number) =>
        new Promise(resolve => setTimeout(() => resolve(ms), ms))

      expect(
        runParallel([wait(40), wait(20), wait(50), wait(10)], 2)
      ).resolves.toStrictEqual([40, 20, 50, 10])
    })
  })
}
