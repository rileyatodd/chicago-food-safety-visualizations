import React, { PropTypes, Component } from 'react'

export default class FoodMapFilters extends Component { 
  
  render() {
    return (
      <div style={{width: '500px', float: 'right'}}>
        <button className="btn" onClick={() => this.props.handleUpdate(window.gMap.getBounds())}>Search In Map</button>
        <div>
          <label style={{display: 'block'}}>Result Filter</label>
          <select defaultValue="all" onChange={this.props.handlePassFailChange}>
            <option value="all">All</option>
            <option value="pass">Have always passed</option>
            <option value="fail">Have failed at least once</option>
          </select>
        </div>
        <div>
          <label style={{display: 'block'}}>Data Display Type</label>
          <select defaultValue="marker" onChange={this.props.handleViewTypeChange}>
            <option value="marker">Location Markers</option>
            <option value="heatmap">Heatmap</option>
          </select>
        </div>
      </div>
    )
  }
} 

FoodMapFilters.propTypes = {
  handleUpdate: PropTypes.func.isRequired,
  handlePassFailChange: PropTypes.func.isRequired,
  handleViewTypeChange: PropTypes.func.isRequired
}