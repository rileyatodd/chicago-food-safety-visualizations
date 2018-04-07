/* global google */
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Root from './containers/Root'
import configureStore from './store/'
import { Atom } from '@grammarly/focal'
import { omit, map } from 'ramda'
import { filteredEstablishments, defaultState } from './models'

const store = configureStore({})

const atom = Atom.create(defaultState)
window['atom'] = atom

render(
  <Provider store={store}>
    <Root store={store} atom={atom} />
  </Provider>,
  document.getElementById('root')
)

let heatMap
atom.view(s => map(omit(['inspections']), filteredEstablishments(s.ui.filters, s.data)))
    .filter(data => data && window['google'])// TODO, would be nice to have an observable of the google script loading
    .map(map(bus => new window['google'].maps.LatLng(bus.position)))
    .subscribe(heatMapData => {
      heatMap = heatMap || new window['google'].maps.visualization.HeatmapLayer({
        data: heatMapData,
        radius: 20
      })
      heatMap.setData(heatMapData)
      console.log('heatmap data calculated')
    })

atom.view(s => s.ui.viewType).subscribe(viewType => {
  heatMap && heatMap.setMap(viewType == 'heatmap' ? window['gMap'] : null)
  console.log('heatmap map set')
})
