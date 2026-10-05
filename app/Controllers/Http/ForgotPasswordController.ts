import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { randomBytes } from 'crypto'
import { promisify } from 'util'

export default class ForgotController {
  public async forgot(ctx: HttpContextContract) {
    const { email, name, resetPasswordUrl } = ctx.request.only([
      'email',
      'name',
      'resetPasswordUrl',
    ])

    const user = await User.findByOrFail('email', email)

    const ramdon = await promisify(randomBytes)(24)
    const token = ramdon.toString('hex')
    await user.related('tokens').updateOrCreate({ userId: user.id }, { token })
    const resetPathUrlWithToken = `${resetPasswordUrl}?token=${token}`

    try {
      await Mail.send((message) => {
        message
          .from('no-reply@roleplay.com', name)
          .to(email, name)
          .subject('Roleplay, recuperação de senha')
          .text('Clique no link abaixo para redefinir sua senha')
          .htmlView('email/forgotpassword.edge', {
            productName: 'Roleplay',
            name: user.name,
            resetPasswordUrl: resetPathUrlWithToken,
          })
      })
    } catch (error) {
      console.error(error)
    }

    return ctx.response.status(204).noContent()
  }
}
