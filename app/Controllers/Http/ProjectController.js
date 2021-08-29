'use strict'

const Project = use('App/Models/Project')

class ProjectController {
  async index ({ request, response }) {
    const { page } = request.get()

    const projects = await Project.query().with('user').paginate(page)

    return response.status(200).send(projects)
  }

  async store ({ request, response, auth }) {
    const data = request.only(['title', 'description'])

    const project = await Project.create({
      ...data,
      user_id: auth.user.id
    })

    return response.status(201).send(project)
  }

  async show ({ params, response }) {
    const project = await Project.findBy('id', params.id)

    if (!project) {
      return response.status(400).send({ erro: { message: 'Project not found!' } })
    }

    await project.load('user')
    await project.load('tasks')

    return response.status(200).send(project)
  }

  async update ({ params, request, response }) {
    const data = request.only(['title', 'description'])

    const project = await Project.findBy('id', params.id)

    if (!project) {
      return response.status(401).send({ erro: { message: 'Project not found!' } })
    }

    project.merge(data)

    await project.save()

    return response.status(201).send(project)
  }

  async destroy ({ params, response }) {
    const project = await Project.findBy('id', params.id)

    if (!project) {
      return response.status(401).send({ erro: { message: 'Project not found!' } })
    }

    await project.delete()

    return response.status(200).send()
  }
}

module.exports = ProjectController
