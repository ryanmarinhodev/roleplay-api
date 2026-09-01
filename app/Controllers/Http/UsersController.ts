import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async store(ctx: HttpContextContract) {
    const userData = ctx.request.only(['name', 'email', 'password', 'avatar'])

    const emailFind = await User.findBy('email', userData.email)

    if (emailFind) {
      return ctx.response.conflict({ message: 'E-mail em uso' })
    }

    const user = await User.create(userData)

    return ctx.response.created({ user })
  }
}
