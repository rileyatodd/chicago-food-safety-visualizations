import Task from 'data.task'
import Maybe from 'data.maybe'
import { set, over, find, chain, compose, curry, flip, lensProp, lensIndex, map } from 'ramda'

export var trace = curry((tag, x) => {console.log(tag, x);return x})

// Promise a -> Task Error a
export var taskFromPromise = promise => new Task(
  (reject, result) => promise.then(result).catch(reject))

// String -> Object -> Task Error Response
const request = curry((params, url) => taskFromPromise(fetch(url, params)))

// URL -> Object -> Task Error Response
export var postJSON = curry((data, url) => request({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
}, url))

export var throwErr = (err) => {throw err;}

// Response -> Task Error Object
const getResponseJSON = (response) => taskFromPromise(response.json())

// URL -> Task Error Object
export var getJSON = compose(chain(getResponseJSON), request({method: 'GET'}))

// Pred -> [a] -> Maybe a
export const safeFind = curry((pred, xs) => {
  let result = find(pred, xs)
  return result ? Maybe.Just(result) : Maybe.Nothing()
})

const setProp = curry((p, x, o) => set(lensProp(p), x, o))

const overProp = curry((p, f, o) => over(lensProp(p), f, o))

const lens = x => ({number: lensIndex(x), string: lensProp(x)})[typeof x] || x

const setPath = curry((p, x, o) => set(compose(...map(lens, p)), x, o))

const overPath = curry((p, f, o) => over(compose(...map(lens, p)), f, o))

export const set_ = curry((p, x, o) => (Array.isArray(p) ? setPath : setProp)(p, x, o))

export const over_ = curry((p, f, o) => (Array.isArray(p) ? overPath : overProp)(p, f, o))

export function loadScript(attributes) {
  let existingScript = document.querySelector(`script[src='${attributes.src}']`)
  if (existingScript) return

  attributes.type = attributes.type || 'text/javascript'
  var tag = document.createElement('script')
  Object.assign(tag, attributes)
  document.body.append(tag)
}