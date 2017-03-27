import { set_ } from 'util'
import Fuse from 'fuse.js'

export function searchListeners(state = defaultUIState, action) {
  switch (action.type) {
    case 'data__setData':
      return set_('index', new Fuse(action.args[0], fuseOpts), state)
    case 'UI__updateQuery':
      return set_('results', state.index.search(action.args[0]), state)
    default:
      return state
  }
}


const fuseOpts =
  { threshold: 0.6
  , location: 0
  , distance: 100
  , maxPatternLength: 32
  , minMatchCharLength: 1
  , keys: [ "title"
          , "author.firstName"
          ]
  }
