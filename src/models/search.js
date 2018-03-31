import { set_ } from 'util'
import Fuse from 'fuse.js'

export function searchListeners(state = {}, action) {
  switch (action.type) {
    case 'data__setData':
      return set_('index', new Fuse(action.args[0], fuseOpts), state)
    case 'UI__updateQuery':
      return set_( 'results'
                 , new Set(state.index.search(action.args[0]))
                 , state )
    default:
      return state
  }
}


const fuseOpts =
  { threshold: 0.3
  , location: 0
  , distance: 50
  , maxPatternLength: 32
  , minMatchCharLength: 1
  , id: 'license_'
  , keys: [ "address"
          , "dba_name" ] }
