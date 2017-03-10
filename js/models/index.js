import { allPass, values, filter, groupBy
       , head, lensPath, flip, view
       , toPairs, T, compose, map
       , prop, any, none, equals
       , replace, split, identity, propEq
       , find, countBy, isEmpty, all, always as K
       } from 'ramda'
import { getJSON, throwErr, safeFind, set_, trace } from 'util'
import { actionify } from 'util/redux'

// [Establishment] -> [Result]
const allResults = compose(map(prop('results')), prop('inspections'))

// [Establishment] -> Bool
const hasNotFailed = compose(none(equals('Fail')), allResults)

// [Establishment] -> Bool
const hasFailed = compose(any(equals('Fail')), allResults)

// Organizes possible filters into a queryable hierarchy
let filters = {
  passFail: {
    all : T,
    pass: hasNotFailed,
    fail: hasFailed
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

// Inspection -> LatLngLiteral
const buildPosition = (x) => ({ lat: parseFloat(x.latitude)
                              , lng: parseFloat(x.longitude)
                              })

// [Inspection] -> Establishment
const inspectionsToEstablishment = (inspections) => ({
  position: buildPosition(head(inspections)),
  license: head(inspections)['license_'],
  inspections
})

// [Inspection] -> {license: Establishment}
export const establishmentsByLicense = compose(map(inspectionsToEstablishment), groupBy(prop('license_')))

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
                                      , safeFind(propEq('results', 'Fail'))
                                      )

// [Inspection] -> {Pass: Integer, Fail: Integer, Pass w/ Exceptions: Integer}
export const countResults = countBy(prop('results'))


////// STUFF FOR INTERACTING WITH data.cityofchicago.org's SODA endpoint

const validateBounds = bounds => bounds && !isEmpty(values(bounds)) 
                                        && all(identity, values(bounds))

// {north, south, east, west} -> String
const buildGeoQuery = (bounds) =>
  `&$where=latitude > ${bounds.south} AND latitude < ${bounds.north} AND longitude > ${bounds.west} AND longitude < ${bounds.east}`

const remoteDataUrl = 'https://data.cityofchicago.org/resource/cwig-ma7x.json?$order=inspection_date DESC&$limit=1000'

export const loadDataFromRemote = (bounds) => (dispatch, getState) => {
  let query = validateBounds(bounds) ? buildGeoQuery(bounds.toJSON()) : ''
  dispatch(setLoadingData(true))
  getJSON(remoteDataUrl + query).fork(
    throwErr,
    compose(dispatch, setData)
  )
}

export const setLoadingData = actionify('UI', 'setLoading', set_('loading'))
export const setData = actionify('data', 'setData', compose(K, establishmentsByLicense))
export const setPassFailFilter = actionify('UI', 'setPassFailFilter', set_(['filters', 'passFail']))
export const selectLocation = actionify('UI', 'selectLocation', set_('selectedLocation'))
export const setMarkerType = actionify('UI', 'changeMarkerType', set_('viewType'))

////////////////////////////////////////////////////////////////////////////
