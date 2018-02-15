import React, { PropTypes } from 'react'
import Spinner from 'components/Spinner'
import styles from 'styles/FoodMapFilters.css'

export default function FoodMapFilters({
  updateQuery, 
  handleUpdate, 
  handlePassFailChange, 
  handleViewTypeChange,
  isLoading
}) {
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
      <div>
        <label style={{display: 'block'}}>Search Within Map</label>
        <input type='text' onChange={e => updateQuery(e.target.value)}/>
      </div>
      <button onClick={handleUpdate}>
        Search In Map
      </button>
      {isLoading && <Spinner />}
    </div>
  )
}

FoodMapFilters.displayName = 'FoodMapFilters'

FoodMapFilters.propTypes = {
  updateQuery: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handlePassFailChange: PropTypes.func.isRequired,
  handleViewTypeChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
}
