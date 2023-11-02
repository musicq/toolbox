import fsp, {access, constants} from 'fs/promises'
import path from 'path'
import {wrap} from 'unwrapit'

export async function exists(path: string): Promise<boolean> {
  try {
    await access(path, constants.R_OK | constants.W_OK)
    return true
  } catch {
    return false
  }
}

export async function ensureDir(path: string): Promise<void> {
  if (!(await exists(path))) {
    await fsp.mkdir(path, {recursive: true})
  }
}

export async function copyDir(
  src: string,
  dest: string,
  filter?: (dir: string) => boolean,
  move = false // move files instead of copy them
) {
  const files = await wrap(fsp.readdir(src))

  if (!files.ok) {
    console.error('Skip copy folder due to\n', (files.error as Error).message)
    return
  }

  await Promise.all(
    files.value.map(async file => {
      const s = path.resolve(src, file)
      const d = path.resolve(dest, file)

      const stats = await wrap(fsp.stat(s))
      if (!stats.ok) {
        console.error(stats.error)
        return
      }

      if (stats.value.isDirectory()) {
        if (filter) {
          return filter(s) ? copyDir(s, d, filter, move) : undefined
        }

        return copyDir(s, d, filter, move)
      }

      await ensureDir(path.dirname(d))

      if (move) {
        return fsp.rename(s, d)
      }

      return fsp.copyFile(s, d)
    })
  )
}

export async function moveDir(
  src: string,
  dest: string,
  filter?: (dir: string) => boolean
) {
  return copyDir(src, dest, filter, true)
}
