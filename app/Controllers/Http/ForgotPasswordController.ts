import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ForgotController {
  public async forgot(ctx: HttpContextContract) {
    const { email } = ctx.request.only(['email'])

    const responseForgotPassword = await Mail.send((message) => {
      message
        .from('no-reply@roleplay.com')
        .to(email)
        .subject('Roleplay, recuperação de senha')
        .text('Clique no link abaixo para redefinir sua senha')
    })
    console.log('O que veio do controller', responseForgotPassword)
    return ctx.response.status(204).noContent()
  }
}
