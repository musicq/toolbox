import {mergeProps} from './mergeProps'

export function flattenPromise<T extends Record<string, unknown>>(
  p: Promise<T[]>,
): Promise<T> {
  return p.then(r => r.reduce((acc, cur) => mergeProps(acc, cur), {} as T))
}
