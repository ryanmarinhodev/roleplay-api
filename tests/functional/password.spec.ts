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
      // ----- debugar -----
      // assert.deepEqual(message.to, [{ adress: user.email }])
      // assert.deepEqual(message.from, [{ adress: 'no-reply@roleplay.com' }])
      // assert.equal(message.text, 'Clique no link abaixo para redefinir sua senha')
      assert.equal(message.subject, 'Roleplay, recuperação de senha')
    })

    await superTest(baseUrl)
      .post('/forgot-password')
      .send({ email: user.email, resetPasswordUrl: 'url' })
      .expect(204)

    Mail.restore()
  }).pin()

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
