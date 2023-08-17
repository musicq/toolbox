import type {BinaryLike} from 'crypto'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import type {Result} from 'unwrapit'
import {err, ok} from 'unwrapit'

/**
 * Calculate hash of a buffer or string using the given algorithm.
 *
 * Default algorithm is `md5`.
 *
 * # Example
 *
 * ```ts
 * calcHash('something')
 * // 437b930db84b8079c2dd804a71936b5f
 * calcHash('something', 'sha256')
 * // 3fc9b689459d738f8c88a3a48aa9e33542016b7a4052e001aaa536fca74813cb
 * ```
 */
export function calcHash(
  buffer: BinaryLike,
  algorithm: string = 'md5'
): string {
  return crypto.createHash(algorithm).update(buffer).digest('hex')
}

/**
 * Calculate hash of a file using the given algorithm.
 *
 * Default algorithm is `md5`.
 *
 * # Example
 *
 * ```ts
 * await calcFileHash('path/to/file')
 * ```
 */
export async function calcFileHash(
  filepath: string,
  algorithm: string = 'md5'
): Promise<Result<string, Error>> {
  const hash = crypto.createHash(algorithm)
  hash.setEncoding('hex')

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filepath)) {
      return resolve(err(new Error('File not found')))
    }

    const input = fs.createReadStream(filepath)

    input.on('readable', () => {
      const data = input.read()
      if (data) {
        hash.update(data)
      } else {
        resolve(ok(hash.digest('hex')))
      }
    })

    input.on('error', e => resolve(err(e)))
  })
}

if (import.meta.vitest) {
  describe('hash', () => {
    test('should generate MD5', () => {
      expect(calcHash('something', 'sha256')).toBe(
        '3fc9b689459d738f8c88a3a48aa9e33542016b7a4052e001aaa536fca74813cb'
      )
      expect(calcHash('something')).toBe('437b930db84b8079c2dd804a71936b5f')
      expect(calcHash(Buffer.from('something'))).toBe(
        '437b930db84b8079c2dd804a71936b5f'
      )
    })

    test('calcFileHash', async () => {
      const result = await calcFileHash(
        path.resolve(__dirname, '../test/fixtures/file.txt')
      )
      expect(result.unwrap()).toEqual('6a582706a3c73401568902ba5d40cad9')
    })

    test('calcFileHash should report error when file does not exists', async () => {
      const result = await calcFileHash(
        path.resolve(__dirname, '../test/fixtures/does_not_exist.txt')
      )
      expect(result.ok).toBe(false)
    })
  })
}
