import cp from 'child_process'

/**
 * ```ts
 * await Promise.all(
 *   tasks.map(task => {
 *     const runner = processTask(workerPath('prepareSharedZipsWorker.js'))
 *     return runner.run(task)
 *   }),
 * ).catch(() => {
 *   console.log('Zipping shared files failed. exiting...')
 *   process.exit(1)
 * })
 * ```
 */
export function processTask(workerPath: string) {
  return {
    run<T>(arg: any): Promise<T> {
      return new Promise((resolve, reject) => {
        const worker = cp.fork(workerPath)

        worker.on('message', (msg: {type: string; payload: T}) => {
          switch (msg.type) {
            case 'ready':
              console.time(`[Worker ${worker.pid}]`)
              worker.send(arg)
              break
            case 'done':
              console.timeEnd(`[Worker ${worker.pid}]`)
              worker.kill()
              resolve(msg.payload)
              break
            case 'error':
              worker.kill()
              reject(new Error(`Worker ${worker.pid} is error.`))
              break
          }
        })
      })
    },
  }
}
