/* global google */
import * as React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import { Atom } from '@grammarly/focal'
import { range, omit, map, chain, values, compose, prop } from 'ramda'
import { loadDataFromRemote, loadInspectionsForLicense, filterBusinesses, defaultState, Business, gMapsScriptUrl } from './models'
import { fuseOpts } from './models/search'
import { Observable } from 'rxjs'
import * as Fuse from 'fuse.js'
let { loadScript } = require('util')

const atom = Atom.create(defaultState)
window['atom'] = atom

loadScript({ src: gMapsScriptUrl
           , onload: () => atom.lens(s => s.ui.isGmapsLoaded).set(true) })

// atom.lens(s => s.ui.selectedBusiness).filter(Boolean).subscribe(
//   () => atom.lens(s => s.ui.selectedTab).set('business')
// )

let index: Observable<Fuse> = atom.view(x => x.businesses).map(
  compose( data => new Fuse(data, fuseOpts)
         , chain(prop('inspections'))
         , values
         )
)

let results = atom.view(x => x.ui.query)
  .combineLatest(index)
  .map(([ query, index ]) => new Set(index.search(query || "")))


let filteredBusinesses: Observable<Business[]> = results.combineLatest(atom)
  .map(([ results, { ui, businesses } ]) => {
    let filteredBizs = filterBusinesses(ui.filters, businesses)
    return ui.query ? filteredBizs.filter(x => results.has(x.license)) 
                    : filteredBizs
  })
  .filter(Boolean)

let gMapsLoaded = atom.lens(s => s.ui.isGmapsLoaded).filter(Boolean)

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

atom.lens(s => s.map)
  .filter(Boolean)
  .flatMap(map => Observable.fromEventPattern(f => map.addListener('bounds_changed', f)))
  .debounceTime(800)
  .subscribe(() => loadDataFromRemote(atom))

render(
  <Root state={atom} filteredBusinesses={filteredBusinesses} />,
  document.getElementById('root')
)