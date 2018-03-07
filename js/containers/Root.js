import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import VisualizationSurface from 'containers/VisualizationSurface'
import PickOne from 'components/PickOne'
import About from 'components/About'
import LocationInfo from 'components/LocationInfo'

function Root({ selectedLocation, loadingInspections }) {
  return (
    <div>
      <VisualizationSurface />
      <PickOne defaultSelected='about'>
        {({ selected, select }) =>
          <div>
            <div>
              <span onClick={() => select('about')}>About</span>
              <span onClick={() => select('location')}>Location</span>
            </div>
            <div>
            {
              selected === 'about' ? 
                <About id='about' /> :
              selected === 'location' ?
                <LocationInfo location={selectedLocation} 
                              isLoading={loadingInspections} />                          
              : null
            }
            </div>      
          </div>
        }
      </PickOne>
    </div>
  )
}

Root.displayName = 'Root'

const mapStateToProps = (state) => ({
  selectedLocation: state.data[state.ui.selectedLocation],
  loadingInspections: state.ui.loadingInspections
})

export default connect(mapStateToProps)(Root)