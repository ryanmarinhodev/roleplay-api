import { test } from '@japa/runner'
import superTest from 'supertest'

const baseUrl = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', () => {
  test('It should create an user', async ({ assert }) => {
    const requestData = {
      name: 'teste4',
      email: 'test@test4',
      password: 'teste123',
    }

    // const { body } = await superTest(baseUrl).post('/users').send(payload).expect(201)
    const response = await superTest(baseUrl).post('/users').send(requestData)

    assert.exists(response.body.user, 'User Undefined')
    assert.exists(response.body.user.id, 'Id Undefined')
    assert.equal(response.body.user.name, requestData.name)
    assert.equal(response.body.user.email, requestData.email)
    assert.equal(response.body.user.password, requestData.password)
  }).pin()
})
