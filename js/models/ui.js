import { actionify } from 'util/redux'
import { set_ } from 'util'

export const defaultUIState = {filters: {passFail: 'all'}, viewType: 'marker'}

export const setPassFailFilter = actionify('UI', 'setPassFailFilter', set_(['filters', 'passFail']))
export const selectLocation = actionify('UI', 'selectLocation', set_('selectedLocation'))
export const setMarkerType = actionify('UI', 'changeMarkerType', set_('viewType'))
export const updateQuery = actionify('UI', 'updateQuery', set_('query'))
export const setMap = actionify('UI', 'setMap', set_('map'))
