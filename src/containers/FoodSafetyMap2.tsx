import * as React from 'react'
import { connect } from 'react-redux'
import * as Fuse from 'fuse.js'
import { fuseOpts } from '../models/search'
import GMap from '../components/GMap'
import { Marker } from 'react-google-maps'
import { chain, prop, values, curry, map, compose } from 'ramda'
import { loadInspectionsForLicense2, filteredEstablishments } from 'models'
import { selectLocation, setGMap } from '../models/ui'
import WaitForScript from '../util/WaitForScript'
import Spinner from '../components/Spinner'
import { Atom, lift } from '@grammarly/focal'
import { AppState } from '../models'
import { Observable } from 'rxjs'

const blueMarkerUrl = 'http://www.rileyatodd.com/images/map-marker.png'

const renderMarker = (handleClick, selected, location) =>
  <Marker {...location}
          key={location.license}
          onClick={handleClick} 
          zIndex={selected ? 100 : 20}
          icon={
            selected ? { url: blueMarkerUrl } : null
          }
          />

let google = window['google']
let LiftedGMap = lift(GMap as (props: {childs: any}) => JSX.Element)

interface Props {
  state: Atom<AppState>
}

export default class FoodSafetyMap2 extends React.Component<Props, any> {

  render() {
    let { state } = this.props

    let index: Observable<Fuse> = state.view(x => x.data).map(
      compose( data => new Fuse(data, fuseOpts)
             , chain(prop('inspections'))
             , values
             )
    )

    let results = state.view(x => x.ui.query)
      .combineLatest(index)
      .map(([ query, index ]) => new Set(index.search(query || "")))
      .do(console.log)


    let filteredLocations = results.combineLatest(state)
      .map(([ results, { ui, data } ]) => {
        let businesses = filteredEstablishments(ui.filters, data)
        return ui.query ? businesses.filter(x => results.has(x.license)) 
                        : businesses
      })

    let selectedLocation = state.lens(x => x.ui.selectedLocation)

    return (
      <WaitForScript src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBu9YoSsRP2XYViyxIcPaMgwg2Engc2Nh4&libraries=geometry,visualization">
        {({ loaded }) => (
          loaded
          ? <LiftedGMap 
              childs={
                filteredLocations.combineLatest(state.map(x => x.ui))
                  .map(([ locations, ui ]) => 
                    locations.filter(() => ui.viewType === 'marker')
                      .map(location => renderMarker(
                        //TODO trigger load of all inspections for that license
                        () => {
                          selectedLocation.set(location.license)
                          loadInspectionsForLicense2(state, location.license)
                        },
                        ui.selectedLocation === location.license,
                        location
                      )))
              } />
          : <Spinner />
        )}
      </WaitForScript>
    )
  }
}
