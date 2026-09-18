import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import superTest from 'supertest'

const baseUrl = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', (group) => {
  test('It should create an user', async ({ assert }) => {
    const fakerUser = await UserFactory.make()
    const requestData = {
      name: fakerUser.name,
      email: fakerUser.email,
      password: fakerUser.password,
    }

    const response = await superTest(baseUrl).post('/users').send(requestData).expect(201)

    assert.exists(response.body.user, 'User Undefined')
    assert.exists(response.body.user.id, 'Id Undefined')
    assert.equal(response.body.user.name, requestData.name)
    assert.equal(response.body.user.email, requestData.email)
    assert.notExists(response.body.user.password, 'Passaword defined')
  })

  test('should return 409 when user already exists', async ({ assert }) => {
    const fakerUser = await UserFactory.make()
    const response = await superTest(baseUrl)
      .post('/users')
      .send({ name: fakerUser.name, email: 'test2@test.com', password: fakerUser.password })
      .expect(409)

    assert.equal(response.body.status, 409)
  })

  test('should return 422 when invalidate name', async ({ assert }) => {
    const fakerUser = await UserFactory.make()
    const response = await superTest(baseUrl)
      .post('/users')
      .send({ name: 1, email: fakerUser.email, password: fakerUser.password })
      .expect(422)

    assert.exists(response.body.error)
    assert.equal(response.body.messages, response.body.messages)
  })

  test('should return 422 when invalidate e-mail', async ({ assert }) => {
    const fakerUser = await UserFactory.make()
    const response = await superTest(baseUrl)
      .post('/users')
      .send({ name: fakerUser.name, email: 'nao-email', password: fakerUser.password })
      .expect(422)

    assert.exists(response.body.error)
    assert.equal(response.body.messages, response.body.messages)
  })

  test('should return 422 when invalidate password', async ({ assert }) => {
    const fakerUser = await UserFactory.make()
    const response = await superTest(baseUrl)
      .post('/users')
      .send({ name: fakerUser.name, email: fakerUser.email, password: 'oi' })
      .expect(422)

    assert.exists(response.body.error)
    assert.equal(response.body.messages, response.body.messages)
  })

  test('update user', async ({ assert }) => {
    const { id, password } = await UserFactory.create()
    const email = 'testeupdatenew@test.com'
    const avatar = 'http://ryanmarinhodev.com'
    const response = await superTest(baseUrl)
      .put(`/users/${id}`)
      .send({ email, avatar, password })
      .expect(422)

    console.log('O que veio do update:', response.body)
    console.log('Response:', response.text)
  }).pin()

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
