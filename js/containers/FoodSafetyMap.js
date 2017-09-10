/* global google */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps"
import { curry, map, compose } from 'expose-loader?r!ramda'
import { loadInspectionsForLicense, filteredEstablishments } from 'models'
import { selectLocation, setMap } from 'models/ui'
import { actionify } from 'util/redux'
import { set_ } from 'util'

const renderMarker = curry((handleClick, location) =>
  <Marker {...location}
          key={location.license}
          onClick={() => handleClick(location.license)} />)

class FoodSafetyMap extends Component {

  componentDidUpdate() {
    let {locations, viewType, gMap, heatmapLayer, setHeatmapLayer} = this.props

    if (!this.heatMap) {
      this.heatMap = new google.maps.visualization.HeatmapLayer({
        data: map(loc => new google.maps.LatLng(loc.position), locations),
        radius: 20
      })
    } else {
      this.heatMap.setMap(viewType == 'heatmap' ? window.gMap : null)
      this.heatMap.setData(map(loc => new google.maps.LatLng(loc.position), locations))
    }
  }

  render() {
    let { locations
        , handleMarkerClicked
        , viewType
        , selectedLocation
        , setMap
        , map
        , results
        , query
        } = this.props

    let filteredLocations = query 
      ? locations.filter(x => results.has(x.license))
      : locations

    return (
      <GoogleMapLoader
        containerElement={<div style={{height: "400px"}} />}
        googleMapElement={
          <GoogleMap ref={c => c && !map && setMap(c.props.map)}
                     defaultZoom={15}
                     defaultCenter={{lat: 41.879272, lng: -87.639737}}>
            {viewType == 'marker' &&
              filteredLocations.map(renderMarker(handleMarkerClicked))}
          </GoogleMap>
        }
      />
    )
  }
}

FoodSafetyMap.propTypes =
  { handleMarkerClicked: PropTypes.func.isRequired
  , setMap: PropTypes.func.isRequired
  , locations: PropTypes.array
  , viewType: PropTypes.string.isRequired
  }

let mapStateToProps = state => (
  { locations: filteredEstablishments(state.ui.filters, state.data)
  , results: state.search.results
  , query: state.ui.query
  , selectedLocation: state.data[state.ui.selectedLocation]
  , viewType: state.ui.viewType
  , map: state.ui.map
  })

let mapDispatchToProps = dispatch => (
  { handleMarkerClicked: license => { dispatch(selectLocation(license))
                                    ; dispatch(loadInspectionsForLicense(license))
                                    }
  , setMap: compose(dispatch, setMap)
  })

export default connect(mapStateToProps, mapDispatchToProps)(FoodSafetyMap)
