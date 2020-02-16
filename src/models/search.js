import { set_ } from 'util'
import Fuse from 'fuse.js'

export const fuseOpts =
  { threshold: 0.3
  , location: 0
  , distance: 50
  , maxPatternLength: 32
  , minMatchCharLength: 1
  , id: 'license'
  , keys: [ "address"
          , "dba_name" ] }
