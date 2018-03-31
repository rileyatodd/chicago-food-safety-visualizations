import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Root from './containers/Root'
import configureStore from './store/'
import { Atom } from '@grammarly/focal'

const store = configureStore({})

const atom = Atom.create({ time: 0 })
window['atom'] = atom

render(
  <Provider store={store}>
    <Root store={store} atom={atom} />
  </Provider>,
  document.getElementById('root')
)

if (module.hot) {
  require('preact/devtools')
}

export { 
  store
}
