export function mergeProps(o1: any, o2: any) {
  const r = {...o1}

  for (const key of Object.keys(o2)) {
    if (Object.prototype.hasOwnProperty.call(o2, key)) {
      if (Array.isArray(o2[key])) {
        ;(r[key] || (r[key] = [])).push(...o2[key])
      } else if (typeof o2[key] === 'object') {
        r[key] = mergeProps(r[key], o2[key])
      } else {
        r[key] = o2[key]
      }
    }
  }

  return r
}
