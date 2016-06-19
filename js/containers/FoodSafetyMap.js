/* global google */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps"
import { curry, view, lensPath, toPairs, allPass, map, flip, compose, values, filter, prop, any, none, equals, T } from 'ramda'
import { selectLocation } from '../actions'
import LocationInfo from '../components/LocationInfo'

const renderMarker = curry((handleClick, location) => <Marker {...location} key={location.license} onClick={() => handleClick(location.license)} />)

class FoodSafetyMap extends Component {

  componentDidUpdate() {
    if (!window.heatMap) {
      window.heatMap = new google.maps.visualization.HeatmapLayer({
        data: map(loc => new google.maps.LatLng(loc.position), this.props.locations),
        radius: 10
      });
    }
    window.heatMap.set('radius', 20)
    window.heatMap.setMap(this.props.viewType == 'heatmap' ? window.gMap : null)
    window.heatMap.setData(map(loc => new google.maps.LatLng(loc.position), this.props.locations))
  }

  render() {
    return (
      <div>
        <GoogleMapLoader
          containerElement={
            <div
              {...this.props.containerElementProps}
              style={{height: "400px", width: "500px"}}
            />
          }
          googleMapElement={
            <GoogleMap
              ref={(mapElement) => {
                this.gMap = mapElement
                if (mapElement) {
                  window.gMap = mapElement.props.map
                }
              }}
              defaultZoom={15}
              defaultCenter={{ lat: 41.879272, lng: -87.639737 }}
            >
              {this.props.viewType == 'marker' ? map(renderMarker(this.props.handleMarkerClicked), this.props.locations) : ''}
            </GoogleMap>
          }
        />
        <LocationInfo location={this.props.selectedLocation} />
      </div>
    )
  }
}

FoodSafetyMap.propTypes = {
  containerElementProps: PropTypes.object.isRequired,
  handleMarkerClicked: PropTypes.func.isRequired,
  locations: PropTypes.array,
  selectedLocation: PropTypes.object,
  viewType: PropTypes.string.isRequired
}

function mapStateToProps(state) {

  const allResults = compose(map(prop('results')), prop('inspections'))

  const hasNotFailed = compose(none(equals('Fail')), allResults)

  const hasFailed = compose(any(equals('Fail')), allResults)

  let filters = {
    passFail: {
      all : T,
      pass: hasNotFailed,
      fail: hasFailed
    }
  }

  // {k: v} -> [Lens]
  let filterLenses = compose(map(lensPath), toPairs)

  let viewsIntoFilters = map(flip(view)(filters))

  // [Lens] -> [pred]
  let activeFilters = compose(viewsIntoFilters, filterLenses)

  return {
    containerElementProps: {},
    locations: filter(allPass(activeFilters(state.filters)), values(state.data)),
    selectedLocation: state.data[state.selectedLocation],
    viewType: state.viewType
  }
}

let mapDispatchToProps = (dispatch) => ({
  handleMarkerClicked: compose(dispatch, selectLocation)
})

export default connect(mapStateToProps, mapDispatchToProps)(FoodSafetyMap)