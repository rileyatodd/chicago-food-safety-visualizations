import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Root from './containers/Root'
import configureStore from './store/'

const store = configureStore({})

render(
  <Provider store={store}>
    <Root store={store} />
  </Provider>,
  document.getElementById('root')
)

if (module.hot) {
  require('preact/devtools')
}

export { 
  store
}
