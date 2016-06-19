import Task from 'data.task'
import { chain, compose, curry, flip } from 'ramda'

export var trace = curry((tag, x) => {
  console.log(tag, x)
  return x
})

// Promise a -> Task Error a 
export var taskFromPromise = promise => new Task((reject, result) => promise.then(result).catch(reject))

// String -> Object -> Task Error Response
export var request = curry((url, params) => taskFromPromise(fetch(url, params)))

// URL -> Object -> Task Error Response
export var postJSON = (url, data) => request(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})

export var throwErr = (err) => {throw err;}

// Response -> Task Error Object
const getResponseJSON = (response) => taskFromPromise(response.json())

// URL -> Task Error Object
export var getJSON = compose(chain(getResponseJSON), flip(request)({method: 'GET'}))