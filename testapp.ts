import Bacon from 'baconjs'

const submitButton = document.querySelector('button[type="submit"]')
const submits = Bacon.fromEvent(submitButton, 'click')

submits
  .doAction('.preventDefault')
  .onValue()
