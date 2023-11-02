import {Worker} from 'node:worker_threads'
import {getCPUCount} from './getCPUCount'

type TaskCallback = (worker: Worker) => void
type Pool = {state: 'idle' | 'inuse'; worker: Worker}

/**
 * # Example
 * ```ts
 * const workerPool = createWorkerPool(
 *   workerPath('prepareResMapWorker.js'),
 *   options,
 *   concurrency,
 * )
 * 
 * const resMap = await flattenPromise(
 *   Promise.all(
 *     tasks.map(([type, subTasks]) => {
 *       return Promise.all(
 *         subTasks.map(task => {
 *           return new Promise<ResMap>(resolve => {
 *             const payload: ResourceWorkerPayload = {
 *               task,
 *               context: {platforms: options.platforms},
 *             }

 *             workerPool.getWorker(worker => {
 *               console.log('[Worker thread]', worker.threadId)

 *               worker.on('message', (msg: {type: string; payload: ResMap}) => {
 *                 if (msg.type === 'done') {
 *                   console.timeEnd(`[Worker ${worker.threadId}:${type}]`)

 *                   workerPool.releaseWorker(worker)
 *                   resolve(msg.payload)
 *                 }
 *               })

 *               worker.postMessage({type, payload})
 *               console.time(`[Worker ${worker.threadId}:${type}]`)
 *             })
 *           })
 *         }),
 *       )
 *     }),
 *   ).then(r => r.flat()),
 * ).finally(() => workerPool.destroy())
 * ```
 */
export function createWorkerPool(
  workerPath: string,
  workerData?: any,
  cpuCount: number = getCPUCount(2 / 3)
) {
  let pool = new Array<Pool>(cpuCount)
  const queue: TaskCallback[] = []

  for (let i = 0; i < cpuCount; i++) {
    pool[i] = {
      state: 'idle',
      worker: new Worker(workerPath, {workerData}),
    }
  }

  return {
    getWorker: (callback: TaskCallback) => {
      const worker = pool.find(x => x.state === 'idle')
      if (!worker) {
        return queue.push(callback)
      }

      worker.state = 'inuse'
      callback(worker.worker)
    },
    releaseWorker: (worker: Worker) => {
      const w = pool.find(w => w.worker === worker)
      if (!w) return

      if (queue.length) {
        return queue.shift()!(w.worker)
      }

      w.state = 'idle'
    },
    destroy: async () => {
      await Promise.all(pool.map(x => x.worker.terminate()))
      pool = []
    },
    size: cpuCount,
  }
}
