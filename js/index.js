import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import configureStore from './store/'

const store = configureStore({})

render(
  <Root store={store} />,
  document.getElementById('root')
)

if (module.hot) {
  require('preact/devtools')
}

export { 
  store
}
