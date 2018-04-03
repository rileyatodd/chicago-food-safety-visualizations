import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Root from './containers/Root'
import configureStore from './store/'
import { Atom } from '@grammarly/focal'
import { defaultState } from './models'

const store = configureStore({})

const atom = Atom.create(defaultState)
window['atom'] = atom

render(
  <Provider store={store}>
    <Root store={store} atom={atom} />
  </Provider>,
  document.getElementById('root')
)

let {locations, viewType} = this.props


let heatMap
atom.subscribe(s => {
  heatMap = heatMap || new google.maps.visualization.HeatmapLayer({
    data: map(loc => new google.maps.LatLng(loc.position), s.data),
    radius: 20
  })
  heatMap.setMap(s.ui.viewType == 'heatmap' ? window['gMap'] : null)
  heatMap.setData(map(loc => new google.maps.LatLng(loc.position), s.data))
})

if (module.hot) {
  require('preact/devtools')
}

export { 
  store
}
