'use strict'

const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('/users', 'UserController.store').validator('User')
Route.post('/sessions', 'SessionController.store').validator('Session')

Route.post('/password/forgot', 'ForgotPasswordController.store').validator('ForgotPassword')
Route.put('/password/reset', 'ForgotPasswordController.update').validator('ResetPassword')

Route.group(() => {
  Route.get('/files/:id', 'FileController.show')
  Route.post('/files', 'FileController.store')

  Route.resource('projects', 'ProjectController').apiOnly().validator(
    new Map([
      [['projects.store'], ['Project']]
    ]))
  Route.resource('projects.tasks', 'TaskController').apiOnly()
}).middleware(['auth'])
