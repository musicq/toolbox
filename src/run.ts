import type {
  DefaultEncodingOption,
  Options as ExecaOptions,
  ExecaReturnValue,
} from 'execa'
import {ensureModule} from './ensureModule'

export async function run(
  bin: string,
  args: string[] = [],
  opts: ExecaOptions<DefaultEncodingOption> = {}
): Promise<ExecaReturnValue<string>> {
  const {execa} = await ensureModule<typeof import('execa')>('execa')

  return execa(bin, args, {stdio: 'inherit', ...opts})
}

export async function runCmd(
  cmd: string,
  opts: ExecaOptions<DefaultEncodingOption> = {}
): Promise<ExecaReturnValue<string>> {
  const {execaCommand} = await ensureModule<typeof import('execa')>('execa')
  return execaCommand(cmd, {stdio: 'inherit', ...opts})
}

if (import.meta.vitest) {
  it('run with `inherit`', async () => {
    expect((await run('echo', ['123'])).stdout).toBeUndefined()
  })

  it('run with `pipe`', async () => {
    expect((await run('echo', ['123'], {stdio: 'pipe'})).stdout).toBe('123')
  })

  it('runCmd with `inherit`', async () => {
    expect((await runCmd('echo "123"')).stdout).toBeUndefined()
  })

  it('runCmd with `pipe`', async () => {
    expect((await runCmd('echo 123', {stdio: 'pipe'})).stdout).toBe('123')
  })
}
