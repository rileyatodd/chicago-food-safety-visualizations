import * as React from 'react'
import * as Fuse from 'fuse.js'
import { fuseOpts } from 'src/models/search'
import GMap from '../components/GMap'
import { Marker } from 'react-google-maps'
import { chain, prop, values, curry, map, compose } from 'ramda'
import { loadInspectionsForLicense, filterBusinesses, AppState, gMapsScriptUrl } from 'models'
import WaitForScript from '../util/WaitForScript'
import Spinner from '../components/Spinner'
import { Atom, lift } from '@grammarly/focal'
import { Observable } from 'rxjs'

const blueMarkerUrl = 'http://www.rileyatodd.com/images/map-marker.png'

const renderMarker = (handleClick, selected, business) =>
  <Marker position={business.position}
          key={business.license}
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


    let filteredBusinesses = results.combineLatest(state)
      .map(([ results, { ui, data } ]) => {
        let businesses = filterBusinesses(ui.filters, data)
        return ui.query ? businesses.filter(x => results.has(x.license)) 
                        : businesses
      })

    let selectedBusiness = state.lens(x => x.ui.selectedBusiness)

    return (
      <WaitForScript src={gMapsScriptUrl}>
        {({ loaded }) => (
          loaded
          ? <LiftedGMap 
              childs={
                filteredBusinesses.combineLatest(state.map(x => x.ui))
                  .map(([ businesses, ui ]) => 
                    businesses.filter(() => ui.viewType === 'marker')
                      .map(bus => renderMarker(
                        () => {
                          selectedBusiness.set(bus.license)
                          loadInspectionsForLicense(state, bus.license)
                        },
                        ui.selectedBusiness === bus.license,
                        bus
                      )))
              } />
          : <Spinner />
        )}
      </WaitForScript>
    )
  }
}
