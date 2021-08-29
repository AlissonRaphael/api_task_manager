'use strict'

class Task {
  get validatorAll () {
    return true
  }

  get rules () {
    return {
      title: 'required',
      due_date: 'date'
    }
  }
}

module.exports = Task
