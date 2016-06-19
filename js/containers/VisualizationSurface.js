import React, { Component, PropTypes } from 'react'
import { changeViewType, loadDataFromRemote, updateFailFilter } from '../actions'
import { connect } from 'react-redux'
import { prop, compose, keys } from 'ramda'
import FoodSafetyMap from './FoodSafetyMap'
import FoodMapFilters from '../components/FoodMapFilters'

class VisualizationSurface extends Component {
  render() {
    const json = this.props.json || {}
    return (
      <div>
        <h3>{keys(json).length}</h3>
        <FoodMapFilters handleUpdate={this.props.handleUpdate} 
                        handlePassFailChange={this.props.handlePassFailChange} 
                        handleViewTypeChange={this.props.handleViewTypeChange} />
        <FoodSafetyMap />
      </div>
    )
  }
}

VisualizationSurface.propTypes = {
  json: PropTypes.object,
  handleUpdate: PropTypes.func.isRequired,
  handlePassFailChange: PropTypes.func.isRequired,
  handleViewTypeChange: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  json: state.data
})

const mapDispatchToProps = (dispatch) => ({
  handleUpdate: compose(dispatch, loadDataFromRemote),
  handlePassFailChange: compose(dispatch, updateFailFilter, prop('value'), prop('target')),
  handleViewTypeChange: compose(dispatch, changeViewType, prop('value'), prop('target'))
})

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationSurface)