import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async store(ctx: HttpContextContract) {
    const payload = ctx.request.only(['name', 'email', 'password', 'avatar'])
    const user = await User.create(payload)

    return ctx.response.created({ user })
  }
}
