/**
 * Log the execution time of a function.
 *
 * # Example
 *
 * ```ts
 * await timelog('fetch google', () => fetch('https://google.com'))
 * //=> [fetch google] starting...
 * //=> [fetch google]: 100.123ms
 * ```
 *
 * You can hide the starting log by passing `true` as the third argument.
 *
 * ```ts
 * await timelog('fetch google', () => fetch('https://google.com'), true)
 * //=> [fetch google]: 100.123ms
 * ```
 */
export function timelog<T>(
  log: string,
  fn: () => Promise<T>,
  hideStartLog?: boolean
): Promise<T>
export function timelog<T>(log: string, fn: () => T, hideStartLog?: boolean): T
export function timelog<T>(log: string, fn: () => T, hideStartLog?: boolean): T
export function timelog<T>(
  log: string,
  fn: () => Promise<T> | T,
  hideStartLog = false
): T | Promise<T> {
  const tag = `[${log}]`

  if (!hideStartLog) {
    console.log(`${tag} starting...`)
  }

  console.time(tag)
  const ret = fn()

  if (
    ret &&
    typeof ret === 'object' &&
    'then' in ret &&
    typeof ret.then === 'function'
  ) {
    return ret.then(r => {
      console.timeEnd(tag)
      return r
    })
  }

  console.timeEnd(tag)

  return ret
}

if (import.meta.vitest) {
  describe('timelog', () => {
    vi.spyOn(console, 'log')
    vi.spyOn(console, 'time')
    vi.spyOn(console, 'timeEnd')

    beforeEach(() => {
      vi.clearAllMocks()
    })

    test('should log the execution time of a function', async () => {
      const fn = vi.fn(() => 1)
      const ret = timelog('test', () => fn())

      expect(fn).toBeCalledTimes(1)
      expect(ret).toBe(1)
      expect(console.log).nthCalledWith(1, '[test] starting...')
      expect(console.time).toBeCalledTimes(1)
      expect(console.time).toBeCalledWith('[test]')
      expect(console.timeEnd).toBeCalledTimes(1)
      expect(console.timeEnd).toBeCalledWith('[test]')
    })

    test('should hide the starting log', async () => {
      const fn = vi.fn(() => Promise.resolve(1))
      const ret = await timelog('test', () => fn(), true)

      expect(fn).toBeCalledTimes(1)
      expect(ret).toBe(1)
      // for console.time
      expect(console.log).toBeCalledTimes(1)
      expect(console.time).toBeCalledTimes(1)
      expect(console.time).toBeCalledWith('[test]')
      expect(console.timeEnd).toBeCalledTimes(1)
      expect(console.timeEnd).toBeCalledWith('[test]')
    })
  })
}
