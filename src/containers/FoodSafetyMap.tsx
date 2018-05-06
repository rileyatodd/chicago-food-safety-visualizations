import * as React from 'react'
import GMap from '../components/GMap'
import { Marker } from 'react-google-maps'
import { filterBusinesses, AppState, gMapsScriptUrl, Business } from 'models'
import Spinner from '../components/Spinner'
import { F, Atom, lift } from '@grammarly/focal'
import { Observable } from 'rxjs'

const blueMarkerUrl = 'http://www.rileyatodd.com/images/map-marker.png'

const renderMarker = (handleClick, selected, business) =>
  <Marker position={business.position}
          key={business.license}
          onClick={handleClick} 
          zIndex={selected ? 100 : 20}
          icon={selected ? { url: blueMarkerUrl } : null}
  />

let google = window['google']
let LiftedGMap = lift(GMap as (props: {childs: any}) => JSX.Element)

interface Props {
  selectedBusiness: Atom<string>
  selectedTab: Atom<string>
  viewType: Atom<string>
  filteredBusinesses: Observable<Business[]>
  isGmapsLoaded: Atom<boolean>
}

export default class FoodSafetyMap extends React.Component<Props, any> {

  render() {
    let { filteredBusinesses, selectedBusiness, selectedTab, viewType, isGmapsLoaded } = this.props

    return (
      <F.div>
        {isGmapsLoaded.view(loaded => loaded
          ? <LiftedGMap 
              childs={
                Observable.combineLatest(filteredBusinesses, selectedBusiness, viewType)
                  .map(([ businesses, selectedBiz, viewType ]) => 
                    businesses.filter(() => viewType === 'marker')
                      .map(bus => renderMarker(
                        () => {
                          selectedBusiness.set(bus.license)
                          selectedTab.set('business')
                        },
                        selectedBiz === bus.license,
                        bus
                      )))
              } />
          : <Spinner />)}
      </F.div>
    )
  }
}
