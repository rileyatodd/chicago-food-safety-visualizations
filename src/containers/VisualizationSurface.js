import React, { Component } from 'react'
import { connect } from 'react-redux'
import { prop, compose, keys } from 'ramda'
import FoodSafetyMap from './FoodSafetyMap'
import FoodMapFilters from '../components/FoodMapFilters'
import styles from 'styles/VisualizationSurface.css'
import { loadDataFromRemote } from 'models'
import { updateQuery, setMarkerType, setPassFailFilter } from 'models/ui'
import { actionify } from 'util/redux'

class VisualizationSurface extends Component {
  render() {
    let { businesses = {}
        , handleUpdate
        , handlePassFailChange
        , handleViewTypeChange
        , updateQuery
        , loadingLocations
        } = this.props

    return (
      <div className={styles.root}>
        <FoodMapFilters handleUpdate={handleUpdate}
                        handlePassFailChange={handlePassFailChange}
                        handleViewTypeChange={handleViewTypeChange}
                        updateQuery={updateQuery}
                        isLoading={loadingLocations}
                        />

      {keys(businesses).length > 950 &&
        <div className={styles.warning}>
          <p>
            Your last search returned quite a few businesses!
            There may be a few businesses missing from your results due
            to the constraints of the city of Chicago's open data system.
          </p>
          <p>
            If the business you are looking for can't be found,
            try zooming the map in a bit so that less businesses are
            inside the bounds of the map.
          </p>
        </div>}
        <FoodSafetyMap />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  businesses: state.data,
  loadingLocations: state.ui.loadingLocations
})

const mapDispatchToProps = (dispatch) => ({
  handleUpdate: compose(dispatch, () => loadDataFromRemote(window.gMap.getBounds())),
  handlePassFailChange: compose(dispatch, setPassFailFilter, prop('value'), prop('target')),
  handleViewTypeChange: compose(dispatch, setMarkerType, prop('value'), prop('target')),
  updateQuery: compose(dispatch, updateQuery)
})

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationSurface)
