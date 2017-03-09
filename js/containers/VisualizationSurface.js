import React, { Component, PropTypes } from 'react'
import { changeViewType, updateFailFilter } from '../actions'
import { connect } from 'react-redux'
import { prop, compose, keys } from 'ramda'
import FoodSafetyMap from './FoodSafetyMap'
import FoodMapFilters from '../components/FoodMapFilters'
import LocationInfo from 'components/LocationInfo'
import styles from 'styles/VisualizationSurface.css'
import { loadDataFromRemote } from 'models'

class VisualizationSurface extends Component {
  render() {
    let { establishments = {}
        , handleUpdate
        , handlePassFailChange
        , handleViewTypeChange
        , selectedLocation
        } = this.props

    return (
      <div className={styles.root}>
        <h3># of Unique Establishments: {keys(establishments).length}</h3>
        <FoodMapFilters handleUpdate={handleUpdate}
                        handlePassFailChange={handlePassFailChange}
                        handleViewTypeChange={handleViewTypeChange} />
        <FoodSafetyMap />
        <LocationInfo location={selectedLocation} />
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
  selectedLocation: state.data[state.selectedLocation],
})

const mapDispatchToProps = (dispatch) => ({
  handleUpdate: compose(dispatch, loadDataFromRemote),
  handlePassFailChange: compose(dispatch, updateFailFilter, prop('value'), prop('target')),
  handleViewTypeChange: compose(dispatch, changeViewType, prop('value'), prop('target'))
})

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationSurface)
