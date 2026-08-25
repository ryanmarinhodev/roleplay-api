import { test } from '@japa/runner'
import superTest from 'supertest'

const baseUrl = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', () => {
  test('It should create an user', async ({ assert }) => {
    const requestData = {
      name: 'testehash7',
      email: 'testehash75@teste.com',
      password: 'teste12344',
    }

    const response = await superTest(baseUrl).post('/users').send(requestData).expect(201)

    assert.exists(response.body.user, 'User Undefined')
    assert.exists(response.body.user.id, 'Id Undefined')
    assert.equal(response.body.user.name, requestData.name)
    assert.equal(response.body.user.email, requestData.email)
    assert.notExists(response.body.user.password, 'Passaword defined')
  }).pin()
})
