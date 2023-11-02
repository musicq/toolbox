import {cpus} from 'os'

export function getCPUCount(ratio: number): number {
  return Math.floor(cpus().length * ratio)
}
