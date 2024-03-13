import { shapes } from '@joint/plus';
import {combineTransforms} from './combineTransforms.js'

export function convertTextBlocks(element, parentMatrix) {
  // console.log('ELEMENT in TEXT BLOCKS', element.innerHTML)
  const GET_BOX = element.getBBox()

  const componentMatrix = element.transform.baseVal.consolidate().matrix
  let mutateMatrix = null

  let textElement = Array.from(element?.children[2]?.children)[0]

  let fullTextElement = () => {
    const children = Array.from(textElement.children)
    let text = ''

    children.map((el) => (text += ' ' + el.innerHTML))
    return text
  }

  if (parentMatrix && componentMatrix) {
    mutateMatrix = combineTransforms(parentMatrix, componentMatrix)
    let transformSanitizeElement = element.outerHTML.replace(
      /transform=".*?"/,
      `transform="matrix(${mutateMatrix.a}, ${mutateMatrix.b}, ${mutateMatrix.c}, ${mutateMatrix.d}, 0, ${GET_BOX.height})"`
    )
  }

  const text = new shapes.standard.Rectangle({
    size: { width: GET_BOX.width, height: GET_BOX.height },
    position: {
      x: mutateMatrix?.e || componentMatrix.e,
      y: mutateMatrix?.f || componentMatrix.f,
    },

    attrs: {
      body: {
        fill: 'transparent',
        stroke: 'none',
      },
      label: {
        text: textElement.innerHTML,

        style: {
          class: 'test',
        },
      },
    },
  })

  return text
}

