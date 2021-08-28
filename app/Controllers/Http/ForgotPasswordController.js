'use strict'

const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

class ForgotPasswordController {
  async store ({ request, response }) {
    const email = request.input('email')
    const user = await User.findBy('email', email)

    if (!user) {
      return response.status(400).send({ error: { message: 'Email icorrect!' } })
    }

    user.token = crypto.randomBytes(10).toString('hex')
    user.token_created_at = new Date()

    await user.save()

    await Mail.send(
      'emails.forgot_password',
      {
        email: user.email,
        token: user.token,
        link: `${request.input('redirect_url')}?token=${user.token}`
      },
      message => {
        message.to(user.email).from('no-reply@api.com').subject('Forgot password')
      }
    )
  }

  async update ({ request, response }) {
    const { token, password } = request.all()

    const user = await User.findBy('token', token)

    if (!user) {
      return response.status(400).send({ error: { message: 'Token unexists' } })
    }

    const now = dayjs().toDate()
    const tokenDate = dayjs(user.token_created_at).add(2, 'days').utc().local().format()

    if (!(dayjs(now).isBefore(tokenDate))) {
      return response.status(401).send({ error: { message: 'Token expired' } })
    }

    user.token = null
    user.token_created_at = null
    user.password = password

    await user.save()
  }
}

module.exports = ForgotPasswordController
