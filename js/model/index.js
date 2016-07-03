import { allPass, values, filter, groupBy, head, lensPath, flip, view, toPairs, T, compose, map, prop, any, none, equals } from 'ramda'

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

// {filterType: {filterName: f} -> [Lens]
let filterLenses = compose(map(lensPath), toPairs)

// [Lens] -> [Predicate]
let viewsIntoFilters = map(flip(view)(filters))

// {filterType: {filterName: f} -> [Predicate]
let activeFilters = compose(viewsIntoFilters, filterLenses)

// {filterType: {filterName: f} -> {license: Establishment} -> [Establishment]
export const filteredEstablishments = (filterNames, data) => filter(allPass(activeFilters(filterNames)), values(data))

// Inspection -> LatLngLiteral
const buildPosition = (x) => ({lat: parseFloat(x.latitude), lng: parseFloat(x.longitude)})

// [Inspection] -> Establishment
const inspectionsToEstablishment = (inspections) => ({
  position: buildPosition(head(inspections)),
  license: head(inspections)['license_'],
  inspections
})

// [Inspection] -> {license: Establishment}
export const establishmentsByLicense = compose(map(inspectionsToEstablishment), groupBy(prop('license_')))