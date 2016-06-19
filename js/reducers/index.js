import { combineReducers } from 'redux'
import { CHANGE_VIEW_TYPE, RECEIVE_DATA_FROM_REMOTE, PASS_FAIL_CHANGE, SELECT_LOCATION } from '../actions'
import { prop, groupBy, set, lensProp, compose, map, head } from 'ramda'

function data(state = {}, action) {
  switch (action.type) {
    case RECEIVE_DATA_FROM_REMOTE: {   

      const buildPosition = (x) => ({lat: parseFloat(x.latitude), lng: parseFloat(x.longitude)})

      const inspectionsToLocations = (inspections) => ({
        position: buildPosition(head(inspections)),
        license: head(inspections)['license_'],
        inspections
      })

      const locationsByLicense = compose(map(inspectionsToLocations), groupBy(prop('license_')))

      return locationsByLicense(action.data)
    }
  }
  return state
}

function selectedLocation(state = null, action) {
  switch (action.type) {
    case SELECT_LOCATION: {
      return parseInt(action.license)
    }
  }
  return state
}

function viewType(state = 'heatmap', action) {
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

function filters(state = defaultFilters, action) {
  switch (action.type) {
    case PASS_FAIL_CHANGE: {
      return set(lensProp('passFail'), action.filterState, state)
    }
  }
  return state
}

export default combineReducers({data, filters, selectedLocation, viewType})