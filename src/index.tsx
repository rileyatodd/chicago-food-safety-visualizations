/* global google */
import * as React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import { Atom } from '@grammarly/focal'
import { omit, map, chain, values, compose, prop } from 'ramda'
import { filterBusinesses, defaultState, Business } from './models'
import { fuseOpts } from './models/search'
import { Observable } from 'rxjs'
import * as Fuse from 'fuse.js'

const atom = Atom.create(defaultState)
window['atom'] = atom

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

let heatMap
filteredBusinesses
  .filter(data => data && window['google'])// TODO, would be nice to have an observable of the google script loading
  .map(map(biz => new window['google'].maps.LatLng(biz.position)))
  .combineLatest(atom.view(s => s.ui.viewType))
  .subscribe(([ heatMapData, viewType ]) => {
    heatMap = heatMap || new window['google'].maps.visualization.HeatmapLayer({
      data: heatMapData,
      radius: 20
    })
    heatMap.setData(heatMapData)
  })

Observable.combineLatest(
  atom.view(s => s.ui.viewType),
  atom.view(s => s.businesses)
)
  .subscribe(([ viewType, _ ]) => {
    heatMap && heatMap.setMap(viewType == 'heatmap' ? window['gMap'] : null)
  })


render(
  <Root state={atom} filteredBusinesses={filteredBusinesses} />,
  document.getElementById('root')
)