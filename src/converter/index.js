import {convertTextBlocks} from './convertTextBlocks.js'
import {convertFigures} from './convertFigures.js'
import {convertConnectors} from './convertConnectors.js'

let cells = []

export function convertSvgToAutograph(pageRaw) {

  const wrapper = document.getElementById('svg-wrapper')
  wrapper.innerHTML = pageRaw

  const page = wrapper.getElementsByTagName('svg')[0]
  if(page.tagName !== 'svg') {
    wrapper.innerHTML = ''

    throw new Error('Неверный формат данных')
  }

  const pageBox = page.getBBox()
  const pageSize = { width: pageBox.width, height: pageBox.height }

  const content = page.getElementById('SContent')
  if(!content) throw new Error('Неверный формат данных') // на данный момент конвертор предназначен только для свг после конвертации аспоузом.

  // формируем css узлы
  // let styleMap 

  const rootElement = Array.from(content.children[0].children)[0]
  const elements = Array.from(content.children[0].children[0].children) // странная структура свг после конвертации аспоузом

  const textCells = []
  const figureCells = []
  const connectorCells = []

  const parentMatrix = rootElement.transform.baseVal.consolidate().matrix

  elements.map((el) => {
    let typeElement = defineTypeElement(el)

    if(typeElement === 'text') textCells.push(convertTextBlocks(el, parentMatrix))
    if(typeElement === 'figure') figureCells.push(convertFigures(el, parentMatrix))
    // if(typeElement === 'connector') connectorCells.push(convertConnectors(el))
  })

  return {pageSize, cells: [...textCells, ...figureCells]}
}

const defineTypeElement = (el) => {
  let isTextElement = identifyTextElement(el)
  if(isTextElement) return 'text'

  let isFigureElement = identifyFigureElement(el)
  if(isFigureElement) return 'figure'

  // let isConnectorElement = identifyConnectorElement().filter(Boolean)
  // if(isConnectorElement) return 'connector'
}

const identifyConnectorElement = () => {}

const identifyFigureElement = (element) => {
  let complexTagNameCollection = ['g']
  let title = element.children[0].innerHTML
  let isDynamicConnector  = Boolean(title.match('Dynamic connector'))
  return Boolean(complexTagNameCollection.includes(element.tagName) && element.children.length && !isDynamicConnector)
}

const identifyTextElement = (el) => {
  if (!el.children[1]) return false

  const subEl = el.children[2]

  let childrenCount = subEl?.children.length
  let textElementsCount = 0

  for (let i = 0; i < childrenCount; i++) {
    if (subEl.children[i].tagName === 'text') textElementsCount += 1
  }

  if (childrenCount === 0 && textElementsCount === 0) return false

  if (Boolean(childrenCount === textElementsCount)) return el
  else return false
}

