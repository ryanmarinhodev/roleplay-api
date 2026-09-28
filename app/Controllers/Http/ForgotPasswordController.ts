import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ForgotController {
  public async forgot(ctx: HttpContextContract) {
    return ctx.response.status(204).noContent()
  }
}
