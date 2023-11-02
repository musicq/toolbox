import type {DefaultEncodingOption, Options as ExecaOptions} from 'execa'
import {run} from './run'

export async function zipFiles(
  dest: string,
  zippedFiles: string[],
  opt?: {
    zipOpts?: string[]
    spawnOpts?: ExecaOptions<DefaultEncodingOption>
  }
) {
  if (zippedFiles.length === 0) {
    return
  }

  const flags = [
    '-q',
    '-MM',
    '-X',
    '-9',
    '--compression-method',
    'deflate',
    ...(opt?.zipOpts ?? []),
  ]

  await run('zip', [...flags, dest, ...zippedFiles], opt?.spawnOpts)
}

export async function sevenZipFiles(
  cmd: 'a' | 'u',
  dest: string,
  source: string | string[],
  zipOpts?: string[],
  options?: ExecaOptions<DefaultEncodingOption>
): Promise<void> {
  const defaultZipOpts = ['-mtm-', '-mx=3', '-mmt=on', '-m0=lzma2']

  await run(
    '7z',
    [
      cmd,
      ...(zipOpts ?? defaultZipOpts),
      dest,
      ...(Array.isArray(source) ? source : [source]),
    ],
    options
  )
}
