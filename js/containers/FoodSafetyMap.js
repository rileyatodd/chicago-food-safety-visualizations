/* global google */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps"
import { curry, map, compose } from 'ramda'
import { filteredEstablishments, selectLocation } from 'models'

const renderMarker = curry((handleClick, location) =>
  <Marker {...location}
          key={location.license}
          onClick={() => handleClick(location.license)} />)

class FoodSafetyMap extends Component {

  componentDidUpdate() {
    let {locations, viewType} = this.props

    if (!window.heatMap) {
      window.heatMap = new google.maps.visualization.HeatmapLayer({
        data: map(loc => new google.maps.LatLng(loc.position), locations),
        radius: 20
      });
    }
    window.heatMap.setMap(viewType == 'heatmap' ? window.gMap : null)
    window.heatMap.setData(map(loc => new google.maps.LatLng(loc.position), locations))
  }

  render() {
    let { locations
        , handleMarkerClicked
        , viewType
        , selectedLocation
        } = this.props

    return (
      <GoogleMapLoader
        containerElement={<div style={{height: "400px"}} />}
        googleMapElement={
          <GoogleMap
            ref={mapElement => {
              this.gMap = mapElement
              if (mapElement) {
                window.gMap = mapElement.props.map
              }
            }}
            defaultZoom={15}
            defaultCenter={{lat: 41.879272, lng: -87.639737}}
          >
            {viewType == 'marker' &&
              locations.map(renderMarker(handleMarkerClicked))}
          </GoogleMap>
        }
      />
    )
  }
}

FoodSafetyMap.propTypes = {
  handleMarkerClicked: PropTypes.func.isRequired,
  locations: PropTypes.array,
  viewType: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  return {
    locations: filteredEstablishments(state.filters, state.data),
    selectedLocation: state.data[state.selectedLocation],
    viewType: state.viewType
  }
}

let mapDispatchToProps = (dispatch) => ({
  handleMarkerClicked: compose(dispatch, selectLocation)
})

export default connect(mapStateToProps, mapDispatchToProps)(FoodSafetyMap)
