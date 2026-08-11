import { spawn } from 'node:child_process'

const child = spawn(process.execPath, ['--test', 'test/streamAvailability.test.js'], {
  stdio: 'inherit',
  env: { ...process.env, CHECK_STREAMS: '1' },
})

child.on('exit', (code) => process.exit(code ?? 1))
