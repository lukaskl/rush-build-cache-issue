#!/usr/bin/env node

import * as colors from 'colors'
import * as child_process from 'child_process'

const isIstanbulBuild = process.argv.some((a) => a.includes('--istanbul'))

console.log('Invoking my-toolchain...')

// This is a dummy implementation
// We don't use istanbul or anything, just outputting to a different directory
// This whole repo is just for demo purposes and to report an issue.
const command = isIstanbulBuild ? 'tsc --outDir lib-istanbul' : 'tsc'
child_process.execSync(command, { stdio: 'inherit' })

console.log(colors.green('Success!'))
