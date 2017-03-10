import {curry} from 'ramda'

export const actionify = curry((tag, actionName, f) =>
  (...args) => ({type: `${tag}__${actionName}`, f, args}))

export const useActionF = (ns, defaultState) => (state = defaultState, {type, f, args}) => {
  return f && args && type.startsWith(ns) ? f(...args)(state) : state
}
  

const composeReducers = (...reducers) => (state, action) =>
  reducers.reduceRight((acc, r) => r(acc, action), state)
