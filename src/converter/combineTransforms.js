export function combineTransforms(parentMatrix, componentMatrix) {
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
