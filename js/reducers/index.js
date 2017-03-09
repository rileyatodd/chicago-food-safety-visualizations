import { combineReducers } from 'redux'
import { useActionF } from 'util/redux'

export default combineReducers(
  { data: useActionF('data')
  , ui: useActionF('UI')
  }
)
