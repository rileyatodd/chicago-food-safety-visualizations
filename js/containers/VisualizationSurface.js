import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { prop, compose, keys } from 'ramda'
import FoodSafetyMap from './FoodSafetyMap'
import FoodMapFilters from '../components/FoodMapFilters'
import LocationInfo from 'components/LocationInfo'
import styles from 'styles/VisualizationSurface.css'
import { loadDataFromRemote } from 'models'
import { updateQuery, setMarkerType, setPassFailFilter } from 'models/ui'
import { actionify } from 'util/redux'

class VisualizationSurface extends Component {
  render() {
    let { establishments = {}
        , handleUpdate
        , handlePassFailChange
        , handleViewTypeChange
        , selectedLocation
        , updateQuery
        , loadingInspections
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

      {keys(establishments).length > 950 &&
        <div className={styles.warning}>
          <p>
            Your last search returned quite a few establishments!
            There may be a few establishments missing from your results due
            to the constraints of the city of Chicago's open data system.
          </p>
          <p>
            If the establishment you are looking for can't be found,
            try zooming the map in a bit so that less establishments are
            inside the bounds of the map.
          </p>
        </div>}
        <FoodSafetyMap />
        <LocationInfo location={selectedLocation} isLoading={loadingInspections}/>
      </div>
    )
  }
}

VisualizationSurface.propTypes = {
  establishments: PropTypes.object,
  handleUpdate: PropTypes.func.isRequired,
  handlePassFailChange: PropTypes.func.isRequired,
  handleViewTypeChange: PropTypes.func.isRequired,
  selectedLocation: PropTypes.object
}

const mapStateToProps = (state) => ({
  establishments: state.data,
  selectedLocation: state.data[state.ui.selectedLocation],
  loadingInspections: state.ui.loadingInspections,
  loadingLocations: state.ui.loadingLocations
})

const mapDispatchToProps = (dispatch) => ({
  handleUpdate: compose(dispatch, () => loadDataFromRemote(window.gMap.getBounds())),
  handlePassFailChange: compose(dispatch, setPassFailFilter, prop('value'), prop('target')),
  handleViewTypeChange: compose(dispatch, setMarkerType, prop('value'), prop('target')),
  updateQuery: compose(dispatch, updateQuery)
})

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationSurface)
