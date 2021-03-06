/* global google */
import * as React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import { Atom } from '@grammarly/focal'
import { range, omit, map, chain, values, compose, prop } from 'ramda'
import { loadBusinesses, loadInspectionsForLicense, defaultState, Business, gMapsScriptUrl } from './models'
import { fuseOpts } from './models/search'
import { Observable } from 'rxjs'
import { K } from 'src/util/util'
import * as Fuse from 'fuse.js'
let { loadScript } = require('util')

const atom = Atom.create(defaultState)
window['atom'] = atom

loadScript({ src: gMapsScriptUrl
           , onload: () => atom.lens('ui', 'isGmapsLoaded').set(true) })

// Load the businesses once the map is loaded and we can calculate the bounds
atom.view('mapBounds').filter(Boolean).take(1).subscribe(() => loadBusinesses(atom))

let index: Observable<Fuse> = atom.view(x => x.businesses).map(
  bizMap => new Fuse(values(bizMap), fuseOpts))

let results: Observable<string[]> = K(
  atom.view('ui', 'query'), index,
  (query, index) => index.search(query || ""))

let filteredBusinesses: Observable<Business[]> = K(
  results, atom.view('ui'), atom.view('businesses'),
  (results, ui, businesses) =>
    ui.query ? results.map(license => businesses[license])
             : values(businesses)
)
  .filter(Boolean)

let gMapsLoaded = atom.lens(s => s.ui.isGmapsLoaded).filter(Boolean)

atom.view('map').filter(Boolean).take(1).subscribe(
  map => window['google'].maps.event.addListener(
    map,
    'bounds_changed',
    () => atom.lens('mapBounds').set(map.getBounds().toJSON())))

let heatMap = gMapsLoaded
  .map(() => new window['google'].maps.visualization.HeatmapLayer({
    data: [],
    radius: 20
  }))
  .share()

gMapsLoaded.flatMap(() => filteredBusinesses)
  .map(map(biz => ({location: new window['google'].maps.LatLng(biz.position), weight: biz.failCount})))
  .combineLatest(heatMap)
  .subscribe(([data, heatMap]) => heatMap.setData(data))

Observable.combineLatest(
  atom.lens(s => s.ui.viewType),
  atom.lens(s => s.map),
  heatMap
)
  .subscribe(([viewType, map, heatMap]) => heatMap.setMap(viewType == 'heatmap' ? map : null))

atom.lens(s => s.ui.selectedBusiness).filter(Boolean).subscribe(
  license => loadInspectionsForLicense(atom, license)
)

render(
  <Root state={atom} filteredBusinesses={filteredBusinesses} />,
  document.getElementById('root')
)