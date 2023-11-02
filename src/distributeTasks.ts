export function distributeTasks<T>(tasks: T[], count: number): T[][] {
  const r: T[][] = []

  for (let i = 0; i < tasks.length; i++) {
    const idx = i % count
    if (!r[idx]) r[idx] = []
    r[idx].push(tasks[i])
  }

  return r
}
