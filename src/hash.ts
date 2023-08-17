import type {BinaryLike} from 'crypto'
import crypto from 'crypto'
import fs from 'fs'
import type {Result} from 'unwrapit'
import {err, ok} from 'unwrapit'

export function calcHash(
  buffer: BinaryLike,
  algorithm: string = 'md5'
): string {
  return crypto.createHash(algorithm).update(buffer).digest('hex')
}

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
  it('should generate MD5', () => {
    expect(calcHash('something')).toBe('437b930db84b8079c2dd804a71936b5f')
    expect(calcHash(Buffer.from('something'))).toBe(
      '437b930db84b8079c2dd804a71936b5f'
    )
  })
}
