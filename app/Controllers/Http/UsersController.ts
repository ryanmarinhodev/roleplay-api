import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async store(ctx: HttpContextContract) {
    return ctx.response.created({})
  }
}
