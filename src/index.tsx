/* global google */
import * as React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import { Atom } from '@grammarly/focal'
import { omit, map } from 'ramda'
import { filterBusinesses, defaultState } from './models'

const atom = Atom.create(defaultState)
window['atom'] = atom

render(
  <Root state={atom} />,
  document.getElementById('root')
)

let heatMap
atom.view(s => map(omit(['inspections']), filterBusinesses(s.ui.filters, s.businesses)))
    .filter(data => data && window['google'])// TODO, would be nice to have an observable of the google script loading
    .map(map(bus => new window['google'].maps.LatLng(bus.position)))
    .subscribe(heatMapData => {
      heatMap = heatMap || new window['google'].maps.visualization.HeatmapLayer({
        data: heatMapData,
        radius: 20
      })
      heatMap.setData(heatMapData)
    })

atom.view(s => s.ui.viewType).subscribe(viewType => {
  heatMap && heatMap.setMap(viewType == 'heatmap' ? window['gMap'] : null)
})
