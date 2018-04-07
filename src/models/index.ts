import { allPass, values, filter, groupBy
       , head, lensPath, flip, view
       , toPairs, T, compose, map, sum
       , prop, any, none, equals, lt
       , replace, split, identity, propEq
       , find, countBy, isEmpty, all, always as K
       } from 'ramda'
import { getJSON, throwErr, safeFind, set_, trace } from '../util'
import { actionify } from '../util/redux'
import { F, Atom } from '@grammarly/focal'
import * as ui from './ui'

export const gMapsScriptUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBu9YoSsRP2XYViyxIcPaMgwg2Engc2Nh4&libraries=geometry,visualization"

// Organizes possible filters into a queryable hierarchy
let filters = {
  passFail: {
    all : T,
    pass: propEq('failCount', 0),
    fail: compose(lt(0), prop('failCount'))
  }
}

// {filterType: filterName} -> [Lens]
let filterLenses = compose(map(lensPath), toPairs)

// [Lens] -> [Predicate]
let viewsIntoFilters = map(flip(view)(filters))

// {filterType: filterName} -> [Predicate]
let activeFilters = compose(viewsIntoFilters, filterLenses)

// {filterType: filterName} -> {license: Establishment} -> [Establishment]
export const filteredEstablishments =
  (filterNames, data) => filter(allPass(activeFilters(filterNames)), values(data))

interface LatLng {
  lat: number
  lng: number
}

// Inspection -> LatLngLiteral
const buildPosition = (i: Inspection): LatLng => ({ lat: parseFloat(i.latitude)
                                                  , lng: parseFloat(i.longitude) })

export interface Inspection {
  latitude: string
  longitude: string
  license: string
  failCount: string
}

export interface Business {
  position: LatLng
  license: string
  failCount: number
  inspections: Inspection[]
}

// [Inspection] -> Establishment
const inspectionsToEstablishment = (inspections: Inspection[]): Business => ({
  position: buildPosition(head(inspections)),
  license: head(inspections)['license_'],
  failCount: sum(map(compose(parseInt, prop('failCount')), inspections)),
  inspections
})

// [Inspection] -> {license: Establishment}
export const establishmentsByLicense: 
(is: Inspection[]) => {[license: string]: Business} = compose( map(inspectionsToEstablishment)
                                                             , groupBy(prop('license_')))

// String -> [{title: String, comments: String}]
export const parseViolations = compose(
  map(v => {
    let [title, comments] = v.split(/ - Comments:/)
    return {title, comments}
  })
  , filter(identity)
  , map(replace(/^[0-9]+\./, ''))
  , split(/\| [0-9]+\./)
)

// [Inspection] -> Maybe String
export const lastFailureDate = compose( map(prop('inspection_date'))
                                      , safeFind(propEq('results', 'Fail')) )

// [Inspection] -> {Pass: Integer, Fail: Integer, Pass w/ Exceptions: Integer}
export const countResults = countBy(prop('results'))

////////////////////////////////////////////////////////////////////////
////// STUFF FOR INTERACTING WITH data.cityofchicago.org's SODA endpoint
const remoteDataUrl = 'https://data.cityofchicago.org/resource/cwig-ma7x.json'

const validateBounds = bounds => bounds && !isEmpty(values(bounds))
                                        && all(identity, values(bounds))

// {north, south, east, west} -> String
const buildGeoQuery = (bounds) =>
  `&$where=latitude > ${bounds.south} AND latitude < ${bounds.north} `
  + `AND longitude > ${bounds.west} AND longitude < ${bounds.east}`

const locationsQuery =
  '?$select=license_,latitude,longitude,address,dba_name'
  + ',sum(case(results = "Fail", 1, true, 0)) as failCount'
  + '&$group=license_,latitude,longitude,address,dba_name'

export const loadDataFromRemote = (bounds) => (dispatch, getState) => {
  let geoQuery = validateBounds(bounds) ? buildGeoQuery(bounds.toJSON()) : ''
  dispatch(setLoadingLocations(true))
  getJSON(remoteDataUrl + locationsQuery + geoQuery).fork(
    throwErr,
    data => {
      dispatch(setData(data))
      dispatch(setLoadingLocations(false))
    }
  )
}

export const loadDataFromRemote2 = (atom: Atom<AppState>) => {
  let bounds = window['gMap'].getBounds()
  let geoQuery = validateBounds(bounds) ? buildGeoQuery(bounds.toJSON()) : ''
  atom.lens(x => x.ui.loadingLocations).set(true)
  getJSON(remoteDataUrl + locationsQuery + geoQuery).fork(
    throwErr,
    data => {
      atom.lens(x => x.ui.loadingLocations).set(false)
      atom.lens(x => x.data).set(establishmentsByLicense(data))
    }
  )
}

export interface AppState {
  ui: ui.State
  search: {
    results: any
  }
  data: any
}

export const defaultState: AppState = {
  ui: ui.defaultUIState,
  data: null,
  search: null
}

export const loadInspectionsForLicense = license => (dispatch, getState) => {
  dispatch(setLoadingInspections(true))
  getJSON(remoteDataUrl + `?$where=license_ = ${license}&$order=inspection_date DESC`)
    .fork(
      throwErr, 
      inspections => {
        dispatch(actionify('data', 'setInspections', set_([license, 'inspections']))(inspections))
        dispatch(setLoadingInspections(false))
      }
    )
}

export const loadInspectionsForLicense2 = (atom: Atom<AppState>, license) => {
  let loadingInspections = atom.lens(s => s.ui.loadingInspections)
  loadingInspections.set(true)
  getJSON(remoteDataUrl + `?$where=license_ = ${license}&$order=inspection_date DESC`)
    .fork(
      throwErr, 
      inspections => {
        // dispatch(actionify('data', 'setInspections', set_([license, 'inspections']))(inspections))
        atom.lens(x => x.data).modify(set_([license, 'inspections'], inspections))
        loadingInspections.set(false)
      }
    )
}

export const setData = actionify('data', 'setData', compose(K, establishmentsByLicense))
export const setLoadingInspections = actionify('UI', 'setLoadingInspections', set_('loadingInspections'))
export const setLoadingLocations = actionify('UI', 'setLoadingLocations', set_('loadingLocations'))
////////////////////////////////////////////////////////////////////////////
