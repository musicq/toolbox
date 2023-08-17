import cp from 'child_process'
import os from 'os'

export function existCmd(cmd: string): boolean {
  const isWindows = os.platform() === 'win32'
  const where = isWindows ? 'where' : 'which'

  const out = cp.spawnSync(where, [cmd], {encoding: 'utf-8'})

  return out.status === 0
}

if (import.meta.vitest) {
  describe('existCmd', () => {
    test('should return true because cmd `ls` exists', () => {
      expect(existCmd('ls')).toBe(true)
    })

    test("should return false because cmd `what_ever_command` doesn't exists", () => {
      expect(existCmd('what_ever_command')).toBe(false)
    })
  })
}
