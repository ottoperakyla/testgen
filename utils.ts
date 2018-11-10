import * as R from 'ramda'

export const notEmpty = a =>
  !R.isEmpty(a)

export const toggleBodyClass = toggle =>
  document.body.classList.toggle('recording', toggle)

export const formatToTest = lines => {
  return lines.join('\n')
}

export const copyToClipboard = str => {
  const el = document.createElement('textarea')
  el.value = str
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

export const expectUI = () => {
  const wrapper = document.createElement('div')
  const template = `
    <h4>Assert</h4>
    <ul>
      <li><a data-assert="visiblity" href="#">visiblity</a></li>
      <li><a data-assert="text" href="#">text</a></li>
      <li><a data-assert="href" href="#">class</a></li>
    </ul>
  `
  wrapper.className = 'expect-ui'
  wrapper.innerHTML = template
  return wrapper
}