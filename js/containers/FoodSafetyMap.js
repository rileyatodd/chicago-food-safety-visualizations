/* global google */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps"
import { curry, map, compose } from 'ramda'
import { loadInspectionsForLicense, filteredEstablishments } from 'models'
import { selectLocation } from 'models/ui'
import { actionify } from 'util/redux'
import { set_ } from 'util'

const renderMarker = curry((handleClick, location) =>
  <Marker {...location}
          key={location.license}
          onClick={() => handleClick(location.license)} />)

class FoodSafetyMap extends Component {

  componentDidUpdate() {
    let {locations, viewType, gMap, heatmapLayer, setHeatmapLayer} = this.props

    if (!heatmapLayer) {
      setHeatmapLayer(new google.maps.visualization.HeatmapLayer({
        data: map(loc => new google.maps.LatLng(loc.position), locations),
        radius: 20
      }))
    } else {
      heatmapLayer.setMap(viewType == 'heatmap' ? gMap : null)
      heatmapLayer.setData(map(loc => new google.maps.LatLng(loc.position), locations))
    }
  }

  render() {
    let { locations
        , handleMarkerClicked
        , viewType
        , selectedLocation
        , setMap
        , gMap
        } = this.props

    return (
      <GoogleMapLoader
        containerElement={<div style={{height: "400px"}} />}
        googleMapElement={
          <GoogleMap ref={c => {
            console.log(c)
            console.log(gMap)
            console.log(setMap)
            setMap(c)
          }}
                     defaultZoom={15}
                     defaultCenter={{lat: 41.879272, lng: -87.639737}}>
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
    locations: filteredEstablishments(state.ui.filters, state.data),
    selectedLocation: state.data[state.ui.selectedLocation],
    viewType: state.ui.viewType,
    gMap: state.ui.gMap,
    heatmapLayer: state.ui.heatmapLayer
  }
}

let mapDispatchToProps = (dispatch) => ({
  handleMarkerClicked: license => { dispatch(selectLocation(license))
                                  ; dispatch(loadInspectionsForLicense(license))
                                  }
  , setMap: compose(dispatch, actionify('UI', 'setMap'), set_('gMap'))
  , setHeatmapLayer: actionify('UI', 'setHeatmapLayer', set_('heatmapLayer'))
})

export default connect(mapStateToProps, mapDispatchToProps)(FoodSafetyMap)
