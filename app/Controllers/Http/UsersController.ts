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
}

// Falta adicionar o handle para 422 caso falhe os dados esperados da request
// Falta adicionar o handle para quando e-amail e senha forem inválidos
