import { allPass, values, filter, groupBy
       , head, lensPath, flip, view
       , toPairs, T, compose, map, sum
       , prop, any, none, equals, lt
       , replace, split, identity, propEq
       , find, countBy, isEmpty, all
       } from 'ramda'
import { getJSON, throwErr, safeFind, set_, trace } from '../util'
import { F, Atom } from '@grammarly/focal'
import * as ui from './ui'

export const gMapsScriptUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBu9YoSsRP2XYViyxIcPaMgwg2Engc2Nh4&libraries=geometry,visualization"

export interface AppState {
  map: any
  mapBounds: {south: number; north: number; east: number; west: number}
  ui: ui.State
  search: {
    results: any
  }
  businesses: {[license: string]: Business}
}

export const defaultState: AppState = {
  map: null,
  ui: ui.defaultUIState,
  mapBounds: null,
  businesses: {},
  search: null
}

export interface Business {
  position: LatLng
  license: string
  failCount: number
  inspections: Inspection[]
  address: string
  dba_name: string
}

export interface Inspection {
  latitude: string
  longitude: string
  license: string
  failCount: string
  inspection_id: string
  inspection_date: string
  results: string
  violations: string
}

interface LatLng {
  lat: number
  lng: number
}

const buildPosition = (i: Inspection): LatLng => ({ lat: parseFloat(i.latitude)
                                                  , lng: parseFloat(i.longitude) })

const inspectionsToEstablishment = (inspections: Inspection[]): Business => {
  let { license_, dba_name, address } = head(inspections)

  return {
    position: buildPosition(head(inspections)),
    license: license_,
    dba_name,
    address,
    failCount: sum(map(compose(parseInt, prop('failCount')), inspections)),
    inspections: []
  }
}

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

const businessesQuery =
  '?$select=license_,latitude,longitude,address,dba_name'
  + ',sum(case(results = "Fail", 1, true, 0)) as failCount'
  + '&$group=license_,latitude,longitude,address,dba_name'

export const loadBusinesses = (atom: Atom<AppState>) => {
  let bounds = atom.view('mapBounds').get()
  let geoQuery = validateBounds(bounds) ? buildGeoQuery(bounds) : ''
  atom.lens('ui', 'loadingBusinesses').set(true)
  getJSON(remoteDataUrl + businessesQuery + geoQuery).fork(
    throwErr,
    data => {
      atom.lens('ui', 'loadingBusinesses').set(false)
      atom.lens('businesses').set(establishmentsByLicense(data))
    }
  )
}

export const loadInspectionsForLicense = (atom: Atom<AppState>, license) => {
  let loadingInspections = atom.lens(s => s.ui.loadingInspections)
  loadingInspections.set(true)
  getJSON(remoteDataUrl + `?$where=license_ = ${license}&$order=inspection_date DESC`)
    .fork(
      err => (loadingInspections.set(false), throwErr(err)), 
      inspections => {
        atom.lens('businesses', license, 'inspections').set(inspections)
        loadingInspections.set(false)
      }
    )
}
////////////////////////////////////////////////////////////////////////////
