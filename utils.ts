import * as R from 'ramda'

export const notEmpty = (a: any): boolean =>
  !R.isEmpty(a)

export const toggleBodyClass = (toggle: boolean): void => {
  document.body.classList.toggle('recording', toggle)
}

export const formatToTest = (lines: Array<string>): string => {
  return lines.join('\n')
}

export const copyToClipboard = (str: string): void => {
  const el = document.createElement('textarea')
  el.value = str
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

export const expectUI = (): HTMLDivElement => {
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