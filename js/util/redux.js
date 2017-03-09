import {curry} from 'ramda'

export const actionify = curry((tag, f) =>
  (...args) => ({type: `${tag}__${f.name || f.displayName}`, f, args}))

export const useActionF = ns => (state = {}, {type, f, args}) =>
  f && args && type.startsWith(ns) ? f(...args)(state) : state

const composeReducers = (...reducers) => (state, action) =>
  reducers.reduceRight((acc, r) => r(acc, action), state)
