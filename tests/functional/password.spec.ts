import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import superTest from 'supertest'

const baseUrl = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', (group) => {
  test('It should forgot password', async ({ assert }) => {
    const user = await UserFactory.create()

    Mail.trap((message) => {
      assert.deepEqual(message.to, [{ address: user.email, name: user.name }])
      assert.deepEqual(message.from, { address: 'no-reply@roleplay.com', name: user.name })
      assert.equal(message.text, 'Clique no link abaixo para redefinir sua senha')
      assert.include(message.html!, user.name)
    })

    await superTest(baseUrl)
      .post('/forgot-password')
      .send({ email: user.email, resetPasswordUrl: 'url', name: user.name })
      .expect(204)

    Mail.restore()
  })

  test('It should create token', async ({ assert }) => {
    const user = await UserFactory.create()

    await superTest(baseUrl)
      .post('/forgot-password')
      .send({ email: user.email, resetPasswordUrl: 'url', name: user.name })
      .expect(204)

    const token = await user.related('tokens').query()
    console.log('Token aqui:', token)
    assert.isNotEmpty(token)
  })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
