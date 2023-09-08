# toolbox

A collection of useful functions for JavaScript developers.

<p>
  <a href="https://npmjs.com/package/@musicq/toolbox"><img src="https://img.shields.io/npm/v/@musicq/toolbox.svg" alt="npm package"></a>
</p>

## Table of Contents

- [runParallel](#runparallel)
- [retry](#retry)
- [timelog](#timelog)
- [tryParseJSON](#tryparsejson)
- [wait](#wait)
- [groupBy](#groupby)
- [lazyInit](#lazyinit)
- [ensureModule](#ensuremodule)
- [existCmd](#existcmd)
- [calcHash](#calchash)
- [calcFileHash](#calcfilehash)

## runParallel

#### Signature

```ts
function runParallel<T, U>(
  data: T[],
  mapper: (v: T, i: number) => Promise<U>,
  concurrency?: number
): Promise<U[]>
```

Run promises in parallel with a concurrency limit and return the results in the
same order.

#### Example

```ts
import {wait} from '@musicq/toolbox'

const res = await runParallel([40, 20, 50, 10], wait, 2)
// res => [40, 20, 50, 10]
```

If you don't specify a concurrency limit, it will default to run all promises in
parallel.

You can run promises sequentially by setting the concurrency limit to 1.

## retry

Retry a promise function with max retry times and delay(ms).

#### Signature

```ts
function retry<T>(
  fn: () => Promise<T>,
  maxRetryTimes: number,
  delay: number
): Promise<T>
```

#### Example

```ts
const fn = () => new Promise((resolve, reject) => reject(1))

await retry(fn, 3, 0)
// throw 1
```

## timelog

Log the execution time of a function.

#### Signature

```ts
function timelog<T>(
  log: string,
  fn: () => Promise<T>,
  hideStartLog?: boolean
): Promise<T>
function timelog<T>(log: string, fn: () => T, hideStartLog?: boolean): T
```

#### Example

```ts
timelog('parse json', () => JSON.parse('{"name": "@musicq/toolbox"}'))
//=> [parse json] starting...
//=> [parse json]: 1.021ms
```

```ts
await timelog('fetch google', () => fetch('https://google.com'))
//=> [fetch google] starting...
//=> [fetch google]: 100.123ms
```

You can hide the starting log by passing `true` as the third argument.

```ts
await timelog('fetch google', () => fetch('https://google.com'), true)
//=> [fetch google]: 100.123ms
```

## tryParseJSON

Try to parse a JSON string with a ergonomic API.

#### Signature

```ts
function tryParseJSON<T>(source: string): Result<T>
```

#### Example

```ts
const json = tryParseJSON('{a: 1}') // {ok: false, error: SyntaxError: Unexpected token a in JSON at position 1}
if (!json.ok) {
  console.error(json.error)
  return
}
console.log(json.value)

tryParseJSON('{"a": 1}')
// {ok: true, value: {a: 1}}
```

## wait

Wait for a number of milliseconds.

#### Signature

```ts
function wait<T>(ms: number, fn?: () => T): Promise<T>
```

#### Example

```ts
await wait(10)
await wait(10, () => 'something')
```

## groupBy

Group an array by a key.

#### Signature

```ts
function groupBy<S, V>(
  source: S[],
  keySelector: (v: S) => string,
  elementSelector?: (v: S) => V
): Record<string, V[]>
```

#### Example

```ts
const source = [
  {name: 'a', value: 1},
  {name: 'b', value: 2},
  {name: 'a', value: 3},
  {name: 'b', value: 4},
]
const result = groupBy(
  source,
  x => x.name,
  x => x.value
)
// {a: [1, 3], b: [2, 4]}
```

## lazyInit

Lazy init variables.

This is useful when some variables might not been initialized yet when it was
declared.

#### Signature

```ts
function lazy<T>(a: () => T): {unwrap: () => T}
```

#### Example

```ts
const lazyVariable = lazy(() => 1)
const unwrappedValue = lazyVariable.unwrap()
//=> 1
```

## ensureModule

Ensure a module is loaded and cached.

This is useful when you want to load a ESM module from a CJS module.

#### Signature

```ts
function ensureModule<M>(moduleName: string): Promise<M>
```

#### Example

```ts
// index.cjs
import fetch from 'node-fetch'
// this will throw an error

// index.ts
const fetch = await ensureModule<typeof import('node-fetch')>('node-fetch')
// this will work
```

## existCmd

Check if a command exists in the current environment.

#### Signature

```ts
function existCmd(cmd: string): boolean
```

#### Example

```ts
if (existCmd('zip')) {
  console.log('zip exists')
} else {
  console.log(' does not exist')
}
```

## calcHash

Calculate hash of a buffer or string using the given algorithm.

Default algorithm is `md5`.

#### Signature

```ts
function calcHash(buffer: BinaryLike, algorithm?: string): string
```

#### Example

```ts
calcHash('something')
// 437b930db84b8079c2dd804a71936b5f
calcHash('something', 'sha256')
// 3fc9b689459d738f8c88a3a48aa9e33542016b7a4052e001aaa536fca74813cb
```

## calcFileHash

Calculate hash of a file using the given algorithm.

Default algorithm is `md5`.

#### Signature

```ts
function calcFileHash(
  filepath: string,
  algorithm?: string
): Promise<Result<string, Error>>
```

#### Example

```ts
import fs from 'fs'
await fs.promises.writeFile('example.txt', 'something')

await calcFileHash('example.txt')
// {ok: true, value: '437b930db84b8079c2dd804a71936b5f'}
```
