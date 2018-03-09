/* global google */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import GMap from 'components/GMap'
import { Marker } from 'react-google-maps'
import { curry, map, compose } from 'expose-loader?r!ramda'
import { loadInspectionsForLicense, filteredEstablishments } from 'models'
import { selectLocation, setGMap } from 'models/ui'
import WaitForScript from 'util/WaitForScript'
import Spinner from 'components/Spinner'

const blueMarkerUrl = 'http://www.rileyatodd.com/images/map-marker.png'

const renderMarker = (handleClick, selected, location) =>
  <Marker {...location}
          key={location.license}
          onClick={() => handleClick(location.license)} 
          zIndex={selected ? 100 : 20}
          icon={
            selected ? { url: blueMarkerUrl } : null
          }
          />

class FoodSafetyMap extends Component {

  componentDidUpdate() {
    let {locations, viewType, heatmapLayer, setHeatmapLayer} = this.props

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
        , results
        , query
        } = this.props

    let filteredLocations = query 
      ? locations.filter(x => results.has(x.license))
      : locations

    return (
      <WaitForScript src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBu9YoSsRP2XYViyxIcPaMgwg2Engc2Nh4&libraries=geometry,visualization">
        {({ loaded }) => (
          loaded
          ? <GMap refFn={c => {
                    window.gMap = c.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
                  }}
                  childs={
                    viewType == 'marker' 
                    && filteredLocations.map(
                      location => renderMarker(
                        handleMarkerClicked, 
                        selectedLocation === location,
                        location
                      )
                    )
                  } />
          : <Spinner />
        )}
      </WaitForScript>
    )
  }
}

FoodSafetyMap.propTypes =
  { handleMarkerClicked: PropTypes.func.isRequired
  , locations: PropTypes.array
  , viewType: PropTypes.string.isRequired }

let mapStateToProps = state => (
  { locations: filteredEstablishments(state.ui.filters, state.data)
  , results: state.search.results
  , query: state.ui.query
  , selectedLocation: state.data[state.ui.selectedLocation]
  , viewType: state.ui.viewType })

let mapDispatchToProps = dispatch => (
  { handleMarkerClicked: license => { dispatch(selectLocation(license))
                                      dispatch(loadInspectionsForLicense(license)) } })

export default connect(mapStateToProps, mapDispatchToProps)(FoodSafetyMap)
