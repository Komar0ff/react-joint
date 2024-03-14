import { dia, util } from '@joint/plus';
import {combineTransforms, applyTransform} from './combineTransforms.js'

export function convertFigures(element, parentMatrix) {
  const GET_BOX = element.getBBox()
  const GET_RECT = element.getBoundingClientRect()

  if(element.getAttribute('id') == '3740.0') {

  // width 13.5 height 44.43

  const width = GET_BOX.width
  const height = GET_BOX.height

  const x = GET_BOX.x
  const y = GET_BOX.y

  const matrix = element.transform.baseVal.consolidate().matrix

  const vec1 = {x: width, y: 0}
  const vec2 = {x: 0, y: height}

  const matrixVec1 = matrix.a * vec1.x + matrix.b * vec1.x + matrix.c * vec1.x
  const matrixVec2 = matrix.a * vec2.x + matrix.b * vec2.x + matrix.c * vec2.x
  } 

  if(element.getAttribute('id') == '2.0') {
    const componentMatrix = element.transform.baseVal.consolidate().matrix
    let sanitizeElement = null
    let mutateMatrix = null

    if (parentMatrix && componentMatrix) {
      mutateMatrix = combineTransforms(parentMatrix, componentMatrix)
      sanitizeElement = element.outerHTML.replace(
        /transform=".*?"/,
        `transform="matrix(${mutateMatrix.a}, ${mutateMatrix.b}, ${mutateMatrix.c}, ${mutateMatrix.d}, 0, ${GET_BOX.height})"`
      )
    }

    const cell = new dia.Element({
      position: {
        x: mutateMatrix?.e || componentMatrix.e,
        y: (mutateMatrix?.f || componentMatrix.f) - GET_BOX.height,
      },
      size: { width: GET_BOX.width, height: GET_BOX.height },
      markup: util.svg`<g @selector="scalable">${sanitizeElement}</g>`,
      type: 'g-element',
    })

    cell.attr('root/title', 'autograph.Element')
    return cell

  }

  if(element.getAttribute('id') == '6.0') {
    const componentMatrix = element.transform.baseVal.consolidate().matrix
    let sanitizeElement = null
    let mutateMatrix = null

    // Надо подобрать вектора в зависимости от знака матричного параметра
    // канвас сверху вниз, хуйня снизу вверх

    const vecAll = {

    }

    // width
    let vecX1 = {x: -GET_BOX.width, y: 0, z: 1}
    let vecY1 = {x: 0, y: GET_BOX.height, z: 1}

    // height
    let vecX2 = {x: GET_BOX.width, y: 0, z: 1}
    let vecY2 = {x: 0, y: GET_BOX.height, z: 1}

      mutateMatrix = combineTransforms(parentMatrix, componentMatrix)

      const p = 1

      // кейс работает при условии если b - отрицательное
      const customMatrix = {a: p, b: p, c: p, d: p, e: 0, f: 0}

      console.log('mutate', customMatrix)

      // width
      let newVecXW = applyTransform(vecX1, customMatrix)
      let newVecYW = applyTransform(vecY1, customMatrix)

      let wMin = newVecXW.x > newVecYW.x ? newVecYW.x : newVecXW.x
      let wMax = newVecXW.x > newVecYW.x ? newVecXW.x : newVecYW.x

      let newVecXH = applyTransform(vecX2, customMatrix)
      let newVecYH = applyTransform(vecY2, customMatrix)

      let hMin = newVecXH.y > newVecYH.y ? newVecYH.y : newVecXH.y
      let hMax = newVecXH.y > newVecYH.y ? newVecXH.y : newVecYH.y

      console.log('BOX', GET_BOX, GET_RECT)
      console.log('wmin', wMin, 'hmin', hMin, 'wmax', wMax, 'hmax', hMax)

      sanitizeElement = element.outerHTML.replace(
        /transform=".*?"/,
        `transform="matrix(${customMatrix.a}, ${customMatrix.b}, ${customMatrix.c}, ${customMatrix.d}, 0, ${-hMax})"`
      )

    console.log('width', wMax-wMin, 'height', hMax-hMin)

    const cell = new dia.Element({
      position: {
        x: 0,
        y: 0 
      },
      size: { width: Math.abs(wMax-wMin), height: Math.abs(hMax-hMin)},
      markup: util.svg`<g @selector="scalable">${sanitizeElement}</g>`,
      type: 'g-element',
    })

    cell.attr('root/title', 'autograph.Element')
    return cell
  }

    const componentMatrix = element.transform.baseVal.consolidate().matrix
    let sanitizeElement = null
    let mutateMatrix = null

    // width
    let vecX1 = {x: -GET_BOX.width, y: 0, z: 1}
    let vecY1 = {x: 0, y: GET_BOX.height, z: 1}

    // height
    let vecX2 = {x: GET_BOX.width, y: 0, z: 1}
    let vecY2 = {x: 0, y: GET_BOX.height, z: 1}

      mutateMatrix = combineTransforms(parentMatrix, componentMatrix)

      const p = 1

      // b negative edge case
      // const customMatrix = {a: p, b: 0, c: 2*p, d: 8*p, e:0, f: 0}

      console.log('mutate', mutateMatrix)

      // width
      let newVecXW = applyTransform(vecX1, mutateMatrix)
      let newVecYW = applyTransform(vecY1, mutateMatrix)

      let wMin = newVecXW.x > newVecYW.x ? newVecYW.x : newVecXW.x
      let wMax = newVecXW.x > newVecYW.x ? newVecXW.x : newVecYW.x

      let newVecXH = applyTransform(vecX2, mutateMatrix)
      let newVecYH = applyTransform(vecY2, mutateMatrix)

      let hMin = newVecXH.y > newVecYH.y ? newVecYH.y : newVecXH.y
      let hMax = newVecXH.y > newVecYH.y ? newVecXH.y : newVecYH.y

      console.log('BOX', GET_BOX, GET_RECT)
      console.log('wmin', wMin, 'hmin', hMin, 'wmax', wMax, 'hmax', hMax)

      sanitizeElement = element.outerHTML.replace(
        /transform=".*?"/,
        `transform="matrix(${mutateMatrix.a}, ${mutateMatrix.b}, ${mutateMatrix.c}, ${mutateMatrix.d}, 0, ${GET_BOX.height})"`
      )

    console.log('width', wMax-wMin, 'height', hMax-hMin)

    const cell = new dia.Element({
      position: {
        x: mutateMatrix?.e || componentMatrix.e,
        y: (mutateMatrix?.f || componentMatrix.f) - GET_BOX.height,
      },
      size: { width: Math.abs(wMax-wMin), height: Math.abs(hMax-hMin)},
      markup: util.svg`<g @selector="scalable">${sanitizeElement}</g>`,
      type: 'g-element',
    })

    cell.attr('root/title', 'autograph.Element')
    return cell
}
