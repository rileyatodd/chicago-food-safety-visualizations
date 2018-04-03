import { actionify } from '../util/redux'
import { set_ } from '../util'

export interface State {
  filters: {passFail: string}
  viewType: string
  loadingInspections: boolean;
  loadingLocations: boolean;
  query: string;
  selectedLocation: string;
}

export const defaultUIState: State = {
  filters: {passFail: 'all'}, 
  viewType: 'marker', 
  loadingInspections: false,
  loadingLocations: false, 
  query: null, 
  selectedLocation: null
}

export const setPassFailFilter = actionify('UI', 'setPassFailFilter', set_(['filters', 'passFail']))
export const selectLocation = actionify('UI', 'selectLocation', set_('selectedLocation'))
export const setMarkerType = actionify('UI', 'changeMarkerType', set_('viewType'))
export const updateQuery = actionify('UI', 'updateQuery', set_('query'))
export const setGMap = actionify('UI', 'setGMap', set_('gMap'))
