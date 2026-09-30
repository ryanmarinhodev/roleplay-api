import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ForgotController {
  public async forgot(ctx: HttpContextContract) {
    const { email, name } = ctx.request.only(['email', 'name'])

    await Mail.send((message) => {
      message
        .from('no-reply@roleplay.com', name)
        .to(email, name)
        .subject('Roleplay, recuperação de senha')
        .text('Clique no link abaixo para redefinir sua senha')
    })

    return ctx.response.status(204).noContent()
  }
}
