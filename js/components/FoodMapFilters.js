import React, { PropTypes } from 'react'
import styles from 'styles/FoodMapFilters.css'

export default function FoodMapFilters({handleUpdate, handlePassFailChange, handleViewTypeChange}) {
  return (
    <div className={styles.container}>
      <div>
        <label style={{display: 'block'}}>Result Filter</label>
        <select defaultValue="all" onChange={handlePassFailChange}>
          <option value="all">All</option>
          <option value="pass">Have always passed</option>
          <option value="fail">Have failed at least once</option>
        </select>
      </div>
      <div>
        <label style={{display: 'block'}}>Data Display Type</label>
        <select defaultValue="marker" onChange={handleViewTypeChange}>
          <option value="marker">Location Markers</option>
          <option value="heatmap">Heatmap</option>
        </select>
      </div>
      <button onClick={() => handleUpdate(window.gMap.getBounds())}>
        Search In Map
      </button>
    </div>
  )
}

FoodMapFilters.displayName = 'FoodMapFilters'

FoodMapFilters.propTypes = {
  handleUpdate: PropTypes.func.isRequired,
  handlePassFailChange: PropTypes.func.isRequired,
  handleViewTypeChange: PropTypes.func.isRequired
}
