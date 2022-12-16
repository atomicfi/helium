import { get } from 'lodash'

export function elementMeetsConditions({
  currentFormData,
  requestType,
  product,
  element
}) {
  if (!element.hidden) return true
  return (element.conditions || []).some((condition) => {
    return (
      _meetsInputCondition({ currentFormData, requestType, condition }) ||
      _meetsProductCondition({ productToCheck: product, condition })
    )
  })
}

function _meetsInputCondition({ currentFormData, requestType, condition }) {
  const valueToCheck = get(
    currentFormData,
    `${requestType}.${condition.inputName}.value`
  )
  return condition.type === 'input' && valueToCheck === condition.equals
}

function _meetsProductCondition({ productToCheck, condition }) {
  return (
    condition.type === 'product' && condition.products.includes(productToCheck)
  )
}
