import * as React from 'react'
import GMap from '../components/GMap'
import { Marker } from 'react-google-maps'
import { AppState, gMapsScriptUrl, Business } from 'models'
import Spinner from '../components/Spinner'
import { F, Atom, lift } from '@grammarly/focal'
import { Observable } from 'rxjs'
import { K } from 'src/util/util'

const blueMarkerUrl = '/images/map-marker.png'

const renderMarker = (handleClick, selected, business) =>
  <Marker position={business.position}
          key={business.license}
          onClick={handleClick} 
          zIndex={selected ? 100 : 20}
          icon={selected ? { url: blueMarkerUrl } : null}
  />

let google = window['google']
let LiftedGMap = lift(GMap as (props: {childs: JSX.Element[], refFn: any}) => JSX.Element)

interface Props {
  selectedBusiness: Atom<string>
  selectedTab: Atom<string>
  viewType: Atom<string>
  filteredBusinesses: Observable<Business[]>
  isGmapsLoaded: Atom<boolean>
  map: Atom<any>
}

export default class FoodSafetyMap extends React.Component<Props, any> {

  render() {
    let { filteredBusinesses, selectedBusiness, selectedTab, viewType, isGmapsLoaded, map } = this.props

    return (
      <F.div>
        {isGmapsLoaded.view(loaded => loaded
          ? <LiftedGMap 
              childs={
                K(filteredBusinesses, selectedBusiness, viewType,
                  (businesses, selectedBiz, viewType) => 
                    viewType === 'marker' 
                      ? businesses.map(bus => renderMarker(
                          () => selectedBusiness.set(bus.license),
                          selectedBiz === bus.license,
                          bus
                        ))
                      : [])
              }
              refFn={gMap => map.set(gMap)} 
            />
          : <Spinner />)}
      </F.div>
    )
  }
}
