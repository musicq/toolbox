import type {Result} from 'unwrapit'
import {wrap} from 'unwrapit'

/**
 * Try to parse a JSON string with a ergonomic API.
 *
 * # Example
 *
 * ```ts
 * tryParseJSON('{a: 1}')
 * // {ok: false, error: SyntaxError: Unexpected token a in JSON at position 1}
 * 
 * tryParseJSON('{"a": 1}')
 * // {ok: true, value: {a: 1}}
 * ```
 */
export const tryParseJSON: <T>(source: string) => Result<T> = wrap(
  (source: string) => JSON.parse(source)
)

if (import.meta.vitest) {
  it('should parse w/o error', () => {
    const source = {a: 1, b: true, c: {d: 'hi'}}
    expect(tryParseJSON(JSON.stringify(source)).unwrap()).toStrictEqual(source)
  })

  it('should parse w/ error', () => {
    expect(tryParseJSON('{whatever: 1}').ok).toBe(false)
  })
}
