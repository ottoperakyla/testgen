import {fromEvent, mergeAll, combineTemplate} from 'baconjs'
import {equals, prop, pathSatisfies, not} from 'ramda'
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

const clicks = fromEvent(document, 'click')
const changes = fromEvent(document, 'change')

const keydowns = fromEvent(document, 'keydown')
const keyCodes = keydowns.map('.key')
const control = keyCodes.filter(equals('Control'))

const recordingStart = control 
const recordingStatus = recordingStart.scan(false, not).skip(1)

recordingStatus
  .onValue(toggleBodyClass)

const alt = keydowns.filter(({key}) => key === 'Alt')
const leftmouse = clicks.filter(({which}) => which === 1)
const showExpectUi = alt.sampledBy(leftmouse)

showExpectUi
  .onValue(() => {
    document.body.append(expectUI())
  })

const events = mergeAll(clicks, changes)
  .filter(recordingStatus)
  .filter(pathSatisfies(notEmpty, ['target', 'id']))
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

combineTemplate({
  showResults,
  lines
})
  .filter(prop('showResults'))
  .map('.lines')
  .map(formatToTest)
  .doAction(console.log)
  .onValue(copyToClipboard) 
