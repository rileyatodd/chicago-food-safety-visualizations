import React, { PropTypes, Component } from 'react'

export default class FoodMapFilters extends Component { 
  
  render() {
    return (
      <div style={{float: 'right', marginBottom: '15px'}}>
        <div className="form-group">
          <label style={{display: 'block'}}>Result Filter</label>
          <select className="form-control" defaultValue="all" onChange={this.props.handlePassFailChange}>
            <option value="all">All</option>
            <option value="pass">Have always passed</option>
            <option value="fail">Have failed at least once</option>
          </select>
        </div>
        <div className="form-group">
          <label style={{display: 'block'}}>Data Display Type</label>
          <select className="form-control" defaultValue="marker" onChange={this.props.handleViewTypeChange}>
            <option value="marker">Location Markers</option>
            <option value="heatmap">Heatmap</option>
          </select>
        </div>
        <button className="btn pull-right" onClick={() => this.props.handleUpdate(window.gMap.getBounds())}>Search In Map</button>
      </div>
    )
  }
} 

FoodMapFilters.propTypes = {
  handleUpdate: PropTypes.func.isRequired,
  handlePassFailChange: PropTypes.func.isRequired,
  handleViewTypeChange: PropTypes.func.isRequired
}