import { dia, util } from '@joint/plus';
import {combineTransforms, applyTransform} from './combineTransforms.js'
import {getAllVec} from './getAllVec.js'

export function convertFigures(element, parentMatrix) {
  const GET_BOX = element.getBBox()

  // if(element.getAttribute('id') == '6.0') {
  //   const componentMatrix = element.transform.baseVal.consolidate().matrix
  //   let mutateMatrix = combineTransforms(parentMatrix, componentMatrix)

  //   const vecAll = getAllVec(mutateMatrix, GET_BOX)

  //   // width
  //   let vecX1 = vecAll[1].vecX1
  //   let vecY1 = vecAll[1].vecY1

  //   // height
  //   let vecX2 = vecAll[1].vecX2
  //   let vecY2 = vecAll[1].vecY2


  //   const p = 1
  //   const customMatrix = {a: 0, b: 0, c: 0, d: 0, e: 0, f: 0}

  //   console.log('mutate', customMatrix)

  //   // width
  //   let newVecXW = applyTransform(vecX1, customMatrix)
  //   let newVecYW = applyTransform(vecY1, customMatrix)

  //   let wMin = newVecXW.x > newVecYW.x ? newVecYW.x : newVecXW.x
  //   let wMax = newVecXW.x > newVecYW.x ? newVecXW.x : newVecYW.x

  //   let newVecXH = applyTransform(vecX2, customMatrix)
  //   let newVecYH = applyTransform(vecY2, customMatrix)

  //   let hMin = newVecXH.y > newVecYH.y ? newVecYH.y : newVecXH.y
  //   let hMax = newVecXH.y > newVecYH.y ? newVecXH.y : newVecYH.y

  //   console.log('BOX', GET_BOX) 
  //   console.log('wmin', wMin, 'hmin', hMin, 'wmax', wMax, 'hmax', hMax)

  //   let sanitizeElement = element.outerHTML.replace(
  //     /transform=".*?"/,
  //     `transform="matrix(${customMatrix.a}, ${customMatrix.b}, ${customMatrix.c}, ${customMatrix.d}, 0, ${0})"`
  //   )

  //   console.log('width', wMax-wMin, 'height', hMax-hMin)

  //   const cell = new dia.Element({
  //     position: {
  //       x: 0,
  //       y: 0 
  //     },
  //     size: { width: Math.abs(wMax-wMin), height: Math.abs(hMax-hMin)},
  //     markup: util.svg`<g @selector="">${sanitizeElement}</g>`,
  //     type: 'g-element',
  //   })

  //   cell.attr('root/title', 'autograph.Element')
  //   return cell
  // }

    const componentMatrix = element.transform.baseVal.consolidate().matrix
    let mutateMatrix = combineTransforms(parentMatrix, componentMatrix)


    const vectors = getAllVec(mutateMatrix, GET_BOX)

    console.log('all vectors', vectors)

    // width
    let vecX1 = vectors.vecX1
    let vecY1 = vectors.vecY1

    // height
    let vecX2 = vectors.vecX2
    let vecY2 = vectors.vecY2

    // width
    let newVecXW = applyTransform(vecX1, mutateMatrix)
    let newVecYW = applyTransform(vecY1, mutateMatrix)

    let wMin = newVecXW.x > newVecYW.x ? newVecYW.x : newVecXW.x
    let wMax = newVecXW.x > newVecYW.x ? newVecXW.x : newVecYW.x

    let newVecXH = applyTransform(vecX2, mutateMatrix)
    let newVecYH = applyTransform(vecY2, mutateMatrix)

    let hMin = newVecXH.y > newVecYH.y ? newVecYH.y : newVecXH.y
    let hMax = newVecXH.y > newVecYH.y ? newVecXH.y : newVecYH.y

    let sanitizeElement = element.outerHTML.replace(
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
