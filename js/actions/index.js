import { getJSON, throwErr } from '../util'
import { isEmpty, compose, all, identity, values } from 'ramda'

const remoteDataUrl = 'https://data.cityofchicago.org/resource/cwig-ma7x.json?$order=inspection_date DESC&$limit=300'

export const LOAD_DATA_FROM_REMOTE = 'LOAD_DATA_FROM_REMOTE'
export const REQUEST_DATA_FROM_REMOTE = 'REQUEST_DATA_FROM_REMOTE'
export const RECEIVE_DATA_FROM_REMOTE = 'RECEIVE_DATA_FROM_REMOTE'
export const PASS_FAIL_CHANGE = 'PASS_FAIL_CHANGE'
export const SELECT_LOCATION = 'SELECT_LOCATION'
export const CHANGE_VIEW_TYPE = 'CHANGE_VIEW_TYPE'

export const requestDataFromRemote = () => ({
  type: REQUEST_DATA_FROM_REMOTE
})

export const receiveDataFromRemote = (data) => ({
  type: RECEIVE_DATA_FROM_REMOTE,
  data
})

export const loadDataFromRemote = (bounds) => (dispatch, getState) => {

  let query = '&$where='
  if (bounds && !isEmpty(values(bounds)) && all(identity, values(bounds))) {
    query = query + buildGeoQuery(bounds.toJSON())
  }
  dispatch(requestDataFromRemote())
  getJSON(remoteDataUrl + query).fork(
    throwErr,
    compose(dispatch, receiveDataFromRemote)
  )
}

const buildGeoQuery = (bounds) => 
  `latitude > ${bounds.south} AND latitude < ${bounds.north} AND longitude > ${bounds.west} AND longitude < ${bounds.east}`
  
export const updateFailFilter = (filterState) => ({
  type: PASS_FAIL_CHANGE,
  filterState
})

export const selectLocation = (license) => ({
  type: SELECT_LOCATION,
  license
})

export const changeViewType = (viewType) => ({
  type: CHANGE_VIEW_TYPE,
  viewType
})