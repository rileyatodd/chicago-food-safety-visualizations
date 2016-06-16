import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import configureStore from './store/'
import * as actions from './actions/'

const store = configureStore({})

render(
  <Root store={store} />,
  document.getElementById('root')
)

export { 
  store,
  actions
}