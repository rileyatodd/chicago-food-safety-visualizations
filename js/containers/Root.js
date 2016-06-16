import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'

export default class Root extends Component {
  render() {
    const { store } = this.props
    return (
      <Provider store={store}>
        <h1>sup sup y'all</h1>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
}