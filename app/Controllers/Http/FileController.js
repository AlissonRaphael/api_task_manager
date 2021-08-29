'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')

class FileController {
  async show ({ params, response }) {
    const file = await File.findBy('id', params.id)

    if (!file) {
      return response.status(400).send({ erro: { message: 'File not found!' } })
    }

    return response.download(Helpers.tmpPath(`uploads/${file.file}`))
  }

  async store ({ request, response }) {
    if (!request.file('file')) {
      return response.status(400).send({ erro: { message: 'File not found' } })
    }

    const upload = request.file('file', { size: '2mb' })

    const fileName = `${Date.now()}-${upload.clientName.split(' ').join('')}.${upload.subtype}`

    await upload.move(Helpers.tmpPath('uploads'), {
      name: fileName
    })

    if (!upload.moved()) {
      return response.status(401).send({ erro: { message: 'Upload file erro' } })
    }

    const file = await File.create({
      file: fileName,
      name: upload.clientName,
      type: upload.type,
      subtype: upload.subtype
    })

    return response.status(401).send(file)
  }
}

module.exports = FileController
