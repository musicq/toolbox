import {wait} from './wait'

/**
 * Retry a promise function with max retry times and delay(ms).
 *
 *
 * # Example
 *
 * ```ts
 * const fn = () => new Promise((resolve, reject) => reject(1))
 *
 * await retry(fn, 3, 0)
 * // throw 1
 * ```
 */
export function retry<T>(
  fn: () => Promise<T>,
  maxRetryTimes: number,
  delay: number
): Promise<T> {
  maxRetryTimes--

  return fn().catch(async e => {
    if (maxRetryTimes <= 0) {
      throw e
    }

    await wait(delay)

    return retry(fn, maxRetryTimes, delay)
  })
}

if (import.meta.vitest) {
  describe('retry', () => {
    test('retry with 3 times', async () => {
      let c = 0
      const fn = () => new Promise((resolve, reject) => reject(++c))

      expect(retry(fn, 3, 2)).rejects.toBe(3)
    })

    test('no retry', async () => {
      let c = 0
      const fn = () => new Promise(resolve => resolve(++c))

      expect(retry(fn, 3, 0)).resolves.toBe(1)
    })
  })
}
