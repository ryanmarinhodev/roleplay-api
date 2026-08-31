import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import superTest from 'supertest'

const baseUrl = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', (group) => {
  test('It should create an user', async ({ assert }) => {
    const requestData = {
      name: 'testehash8',
      email: 'testehash85@teste.com',
      password: 'teste12344',
    }

    const response = await superTest(baseUrl).post('/users').send(requestData).expect(201)

    assert.exists(response.body.user, 'User Undefined')
    assert.exists(response.body.user.id, 'Id Undefined')
    assert.equal(response.body.user.name, requestData.name)
    assert.equal(response.body.user.email, requestData.email)
    assert.notExists(response.body.user.password, 'Passaword defined')
  })

  test('should return 409 when user already exists', async ({ assert }) => {
    const { email } = await UserFactory.create()
    const response = await superTest(baseUrl)
      .post('/users')
      .send({ email, name: 'teste', password: 'teste' })
      .expect(409)
  })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
