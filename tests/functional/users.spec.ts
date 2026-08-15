import { test } from '@japa/runner'
import superTest from 'supertest'

const baseUrl = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', () => {
  test('It should create an user', async ({ assert }) => {
    const payload = {
      name: 'teste',
      email: 'test@test',
      password: 'teste123',
    }
    const { body } = await superTest(baseUrl).post('/users').send(payload).expect(201)
    assert.exists(body.user, 'User Undefined')
    assert.exists(body.id, 'Id Undefined')
    assert.exists(body.name, payload.name)
    assert.exists(body.email, payload.email)
    assert.exists(body.password, payload.password)
  }).pin()
})
