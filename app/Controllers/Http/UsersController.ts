import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async store(ctx: HttpContextContract) {
    const userData = ctx.request.only(['name', 'email', 'password', 'avatar'])
    const user = await User.create(userData)

    const emailFind = await User.find(user.email)

    if (emailFind) {
      return ctx.response.status(409)
    }

    return ctx.response.created({ user })
  }
}
