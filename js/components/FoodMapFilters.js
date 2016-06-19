import React, { PropTypes, Component } from 'react'

export default class FoodMapFilters extends Component { 
  
  render() {
    return (
      <div>
        <button onClick={() => this.props.handleUpdate(window.gMap.getBounds())}>Update</button>
        <select defaultValue="all" onChange={this.props.handlePassFailChange}>
          <option value="all">All</option>
          <option value="pass">Have always passed</option>
          <option value="fail">Have failed at least once</option>
        </select>
        <select defaultValue="marker" onChange={this.props.handleViewTypeChange}>
          <option value="marker">Location Markers</option>
          <option value="heatmap">Heatmap</option>
        </select>
      </div>
    )
  }
} 

FoodMapFilters.propTypes = {
  handleUpdate: PropTypes.func.isRequired,
  handlePassFailChange: PropTypes.func.isRequired,
  handleViewTypeChange: PropTypes.func.isRequired
}