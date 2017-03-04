import { combineReducers } from 'redux'
import { CHANGE_VIEW_TYPE, RECEIVE_DATA_FROM_REMOTE, PASS_FAIL_CHANGE, SELECT_LOCATION } from 'actions'
import { set, lensProp } from 'ramda'
import { establishmentsByLicense } from 'models'

// {Int: Establishment} -> Action -> {Int: Establishment}
function data(state = {}, action) {
  switch (action.type) {
    case RECEIVE_DATA_FROM_REMOTE: {
      return establishmentsByLicense(action.data)
    }
  }
  return state
}

// Int -> Action -> Int
function selectedLocation(state = null, action) {
  switch (action.type) {
    case SELECT_LOCATION: {
      return parseInt(action.license)
    }
  }
  return state
}

// String -> Action -> String
function viewType(state = 'marker', action) {
  switch (action.type) {
    case CHANGE_VIEW_TYPE: {
      return action.viewType
    }
  }
  return state
}

const defaultFilters = {
  'passFail': 'all'
}

// {String: String} -> Action -> {String: String}
function filters(state = defaultFilters, action) {
  switch (action.type) {
    case PASS_FAIL_CHANGE: {
      return set(lensProp('passFail'), action.filterState, state)
    }
  }
  return state
}

export default combineReducers({data, filters, selectedLocation, viewType})
