/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'

export default class EmailAlredyInException extends Exception {
  constructor() {
    super('E-mail em uso', 409)
  }

  public async handle(error: this, ctx: HttpContextContract) {
    return ctx.response.status(error.status).send({ message: this.message, status: this.status })
  }
}
