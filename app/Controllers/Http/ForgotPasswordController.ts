import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { randomBytes } from 'crypto'
import { promisify } from 'util'

export default class ForgotController {
  public async forgot(ctx: HttpContextContract) {
    const forgotValidator = schema.create({
      email: schema.string({}, [rules.email()]),
      name: schema.string(),
      resetPasswordUrl: schema.string.optional(),
    })

    const forgotData = await ctx.request.validate({
      schema: forgotValidator,
    })

    const user = await User.findByOrFail('email', forgotData.email)

    const ramdon = await promisify(randomBytes)(24)
    const token = ramdon.toString('hex')
    await user.related('tokens').updateOrCreate({ userId: user.id }, { token })
    const resetPathUrlWithToken = `${forgotData.resetPasswordUrl}?token=${token}`

    try {
      await Mail.send((message) => {
        message
          .from('no-reply@roleplay.com', forgotData.name)
          .to(forgotData.email, forgotData.name)
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
