'use strict'

const Mail = use('Mail')
const Helpers = use('Helpers')

class NewTaskMail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'NewTaskMail-job'
  }

  async handle ({ username, title, email, file }) {
    console.log(`Jobs: ${NewTaskMail.key}`)

    await Mail.send(
      'emails.new_task',
      {
        username,
        title,
        hasAttachment: !!file
      },
      (message) => {
        message.to(email).from('no-reply@api.com').subject('Nova tarefa')

        if (file) {
          message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
            filename: file.name
          })
        }
      }
    )
  }
}

module.exports = NewTaskMail
