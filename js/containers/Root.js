import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import VisualizationSurface from './VisualizationSurface'

export default function Root({ store }) {
  return (
    <Provider store={store}>
      <VisualizationSurface />
    </Provider>
  )
}

Root.displayName = 'Root'

Root.propTypes = {
  store: PropTypes.object.isRequired
}
