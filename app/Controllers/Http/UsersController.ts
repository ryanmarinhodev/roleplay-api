import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EmailAlredyInException from 'App/Exceptions/EmailAlredyInException'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UsersController {
  public async store(ctx: HttpContextContract) {
    const userSchema = schema.create({
      name: schema.string({}),
      email: schema.string({}, [rules.email()]),
      password: schema.string([rules.minLength(4)]),
    })

    const userData = await ctx.request.validate({
      schema: userSchema,
    })

    const emailFind = await User.findBy('email', userData.email)

    if (emailFind) {
      throw new EmailAlredyInException()
    }

    const user = await User.create(userData)
    return ctx.response.created({ user })
  }

  public async update(ctx: HttpContextContract) {
    const userFind = await User.find(ctx.params.id)

    if (!userFind) {
      return ctx.response.status(404).send({ message: 'User não encontrado' })
    }

    const userSchemaCreate = schema.create({
      email: schema.string.optional({}, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', whereNot: { id: userFind.id } }),
      ]),
      password: schema.string.optional([rules.minLength(4)]),
      avatar: schema.string.optional(),
    })
    const userData = await ctx.request.validate({
      schema: userSchemaCreate,
    })

    userFind.merge(userData)
    await userFind.save()

    return ctx.response.json({ message: 'Dados atualizados' })
  }
}
