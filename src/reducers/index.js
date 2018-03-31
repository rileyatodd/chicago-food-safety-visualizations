import { combineReducers } from 'redux'
import { useActionF, composeReducers } from 'util/redux'
import { defaultUIState } from 'models/ui'
import { searchListeners } from 'models/search'

export default combineReducers(
  { data: useActionF('data', {})
  , ui: useActionF('UI', defaultUIState)
  , search: composeReducers(searchListeners, useActionF('search', {}))
  }
)
