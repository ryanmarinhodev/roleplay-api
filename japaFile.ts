import 'reflect-metadata'
import { join } from 'path'
import getPort from 'get-port'
import test from 'japa'
import sourceMapSupport from 'source-map-support'
import execa from 'execa'
import { Ignitor } from '@adonisjs/core/build/standalone'

process.env.NODE_ENV = 'test'
process.env.ADONIS_ACE_CWD = join(__dirname)

sourceMapSupport.install({ handleUncaughtExceptions: false })

async function startHttpServer() {
  process.env.PORT = String(await getPort())
  await new Ignitor(__dirname).httpServer().start()
}

async function runMigrations() {
  await execa.node('ace', ['migration:run'], {
    stdio: 'inherit',
  })
}

async function rollbackMigrations() {
  await execa.node('ace', ['migration:rollback'], {
    stdio: 'inherit',
  })
}

test.configure({
  files: ['test/**/*.spec.ts'],
  before: [runMigrations, startHttpServer],
  after: [rollbackMigrations],
})
