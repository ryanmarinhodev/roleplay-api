import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import superTest from 'supertest'

const baseUrl = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', (group) => {
  test('It should forgot password', async () => {
    const user = await UserFactory.create()
    await superTest(baseUrl)
      .post('/forgot-password')
      .send({ email: user.email, resetPasswordUrl: 'url' })
      .expect(204)
  }).pin()

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
