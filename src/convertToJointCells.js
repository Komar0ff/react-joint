import { dia } from '@joint/plus';

let cells = []

export function convertSvgToJointCells(svg) {
  try {
    cells = []

    /* All these manipulations are necessary to determine the exact size of the element */
    const wrapper = document.getElementById('svg-wrapper')
    wrapper.innerHTML = svg

    const main = wrapper.getElementsByTagName('svg')[0]
    const mainBox = main.getBBox()
    const paperSize = { width: mainBox.width, height: mainBox.height }

    if (main.tagName !== 'svg') throw Error('...')

    const content = document.getElementById('SContent')
    if (content) {
      const elements = Array.from(content.children[0].children)
      elements.map((el) => convertComplexSvgToJointCore(el))
    } else {
      convertSvgToAutographCore(main)
    }

    wrapper.innerHTML = ''
    return { paperSize, cells }
  } catch (e) {
    console.error(e)
  }
}

const convertComplexSvgToJointCore = (element) => {
    const children = Array.from(element.children)
    const isComplexChildren = children.find((el) => indentifyComplexChild(el))

    if (isComplexChildren) {
        element.childNodes.forEach((subElement, i) => {
            if (indentifySimpleChild(subElement)) {
                cells.push(generationSimpleCell(subElement))
            } else if (indentifyComplexChild(subElement)) {
                const parentMatrix =
                    element.transform.baseVal.consolidate().matrix
                cells.push(generateComplexCell(subElement, parentMatrix))
            }
        })
    } else {
        cells.push(generateComplexCell(element))
    }

    return null
}

const convertSvgToAutographCore = () => {
    console.log('Simple svg')
}

const indentifyComplexChild = (element) => {
    let complexTagNameCollection = ['g']
    return Boolean(
        complexTagNameCollection.includes(element.tagName) &&
            element.children.length
    )
}

const generateComplexCell = (element, parentMatrix) => {
    const GET_BOX = element.getBBox()

    const componentMatrix = element.transform.baseVal.consolidate().matrix
    let sanitizeElement = null
    let mutateMatrix = null

    if (parentMatrix && componentMatrix) {
        mutateMatrix = combineTransforms(parentMatrix, componentMatrix)
        sanitizeElement = element.outerHTML.replace(
            /transform=".*?"/,
            `transform="matrix(${mutateMatrix.a}, ${mutateMatrix.b}, ${mutateMatrix.c}, ${mutateMatrix.d}, 0, 0)"`
        )
    }

    const cell = new dia.Element({
        position: {
            x: mutateMatrix?.e || componentMatrix.e,
            y: mutateMatrix?.f || componentMatrix.f,
        },
        size: { width: GET_BOX.width, height: GET_BOX.height },
        markup: sanitizeElement || element.outerHTML,
        type: 'g-element',
    })

    cell.attr('root/title', 'autograph.Element')
    return cell
}

const indentifySimpleChild = (element) => {
  /* Simple elements can have children, but usually it's text or something like that */
  let simpleTagNameCollection = [
    'path',
    'rect',
    'ellipse',
    'line',
    'polygon',
    'polyline',
    'textPath',
  ]
  return Boolean(
    simpleTagNameCollection.includes(element.tagName) &&
      element.children.length
  )
}

const generationSimpleCell = (element) => {
  console.log('generationSimpleCell', element)
}

function combineTransforms(parentMatrix, componentMatrix) {
  const { a: a1, b: b1, c: c1, d: d1, e: e1, f: f1 } = parentMatrix
  const { a: a2, b: b2, c: c2, d: d2, e: e2, f: f2 } = componentMatrix

  return {
    // scaleX
    a: a1 * a2 + c1 * b2,
    // skewY
    b: b1 * a2 + d1 * b2,
    // skewX
    c: a1 * c2 + c1 * d2,
    // scaleY
    d: b1 * c2 + d1 * d2,
    // translateX
    e: a1 * e2 + c1 * f2 + e1,
    // translateY
    f: b1 * e2 + d1 * f2 + f1,
  }
}
