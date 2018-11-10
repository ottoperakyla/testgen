import Bacon from 'baconjs'
import * as R from 'ramda'
import {
  formatToTest,
  copyToClipboard,
  toggleBodyClass,
  notEmpty,
  expectUI
} from './utils'

const tester = (event: any): string => {
  const id = event.target.id

  switch(event.type) {
    case 'click':
      return `click('#${id}')`
    case 'change':
      return `change('#${id}', '${event.value}')`
  }
}

const clicks = Bacon.fromEvent(document, 'click')
const changes = Bacon.fromEvent(document, 'change')

const keydowns = Bacon.fromEvent(document, 'keydown')
const keyCodes = keydowns.map('.key')
const control = keyCodes.filter(R.equals('Control'))

const recordingStart = control 
const recordingStatus = recordingStart.scan(false, R.not).skip(1)

recordingStatus
  .onValue(toggleBodyClass)

const alt = keydowns.filter(({key}) => key === 'Alt')
const leftmouse = clicks.filter(({which}) => which === 1)
const showExpectUi = alt.sampledBy(leftmouse)

showExpectUi
  .onValue(() => {
    document.body.append(expectUI())
  })

const events = Bacon.mergeAll(clicks, changes)
  .filter(recordingStatus)
  .filter(R.pathSatisfies(notEmpty, ['target', 'id']))
  .map(({type, target}) => 
    type === 'click'
      ? {target, type}
      : {target, type, value: target.value}
  )

const lines = events.scan([], (lines: Array<string>, event: any) =>
  lines.concat(tester(event))
)

const showResults = recordingStatus
  .slidingWindow(2, 2)
  .map(([prev, next]) => prev && !next)

Bacon.combineTemplate({
  showResults,
  lines
})
  .filter(R.prop('showResults'))
  .map('.lines')
  .map(formatToTest)
  .doAction(console.log)
  .onValue(copyToClipboard) 
