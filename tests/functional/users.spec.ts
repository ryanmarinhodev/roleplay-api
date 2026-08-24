import { test } from '@japa/runner'
import superTest from 'supertest'
import Hash from '@ioc:Adonis/Core/Hash'

const baseUrl = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', () => {
  test('It should create an user', async ({ assert }) => {
    const requestData = {
      name: 'testehash3',
      email: 'testehash3@teste.com',
      password: 'teste123',
    }

    console.log(requestData)

    // const { body } = await superTest(baseUrl).post('/users').send(payload).expect(201)
    const response = await superTest(baseUrl).post('/users').send(requestData)
    const hashedPassword = await Hash.make(response.body.user.password)

    assert.exists(response.body.user, 'User Undefined')
    assert.exists(response.body.user.id, 'Id Undefined')
    assert.equal(response.body.user.name, requestData.name)
    assert.equal(response.body.user.email, requestData.email)
    assert.notEqual(hashedPassword, 'Indefinida')
  }).pin()
})
