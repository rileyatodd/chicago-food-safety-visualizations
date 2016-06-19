import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import VisualizationSurface from './VisualizationSurface'

export default class Root extends Component {
  render() {
    const { store } = this.props
    return (
      <Provider store={store}>
        <VisualizationSurface />
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
}