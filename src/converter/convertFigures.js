import { dia, util } from '@joint/plus';
import {combineTransforms} from './combineTransforms.js'

export function convertFigures(element, parentMatrix) {
  const GET_BOX = element.getBBox()

  if(element.getAttribute('id') == '3740.0') {
  console.log('JOPA')

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
