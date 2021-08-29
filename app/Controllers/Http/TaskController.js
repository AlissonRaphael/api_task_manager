'use strict'

const Task = use('App/Models/Task')

class TaskController {
  async index ({ params, response }) {
    const task =
      await Task.query().where('project_id', params.projects_id).with('user').fetch()

    return response.status(200).send(task)
  }

  async store ({ params, request, response }) {
    const data = request.only([
      'user_id',
      'title',
      'description',
      'due_date',
      'files_id'
    ])

    const task = await Task.create({ ...data, project_id: params.projects_id })

    return response.status(201).send(task)
  }

  async show ({ params, request, response, view }) {
    const task = await Task.findBy('id', params.id)

    if (!task) {
      return response.status(400).send({ erro: { message: 'Task not found!' } })
    }

    return response.status(201).send(task)
  }

  async update ({ params, request, response }) {
    const data = request.only([
      'user_id',
      'title',
      'description',
      'due_date',
      'files_id'
    ])

    const task = await Task.findBy('id', params.id)

    if (!task) {
      return response.status(400).send({ erro: { message: 'Task not found!' } })
    }

    task.merge(data)

    await task.save()

    return response.status(201).send(task)
  }

  async destroy ({ params, response }) {
    const task = await Task.findBy('id', params.id)

    if (!task) {
      return response.status(400).send({ erro: { message: 'Task not found!' } })
    }

    await task.delete()

    return response.status(200).send()
  }
}

module.exports = TaskController
