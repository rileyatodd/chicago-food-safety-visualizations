import * as React from 'react'
import GMap from '../components/GMap'
import { Marker } from 'react-google-maps'
import { loadInspectionsForLicense, filterBusinesses, AppState, gMapsScriptUrl, Business } from 'models'
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
  selectedBusiness: Atom<string>
  selectedTab: Atom<string>
  viewType: Atom<string>
  filteredBusinesses: Observable<Business[]>
}

export default class FoodSafetyMap2 extends React.Component<Props, any> {

  render() {
    let { filteredBusinesses, selectedBusiness, selectedTab, viewType } = this.props

    return (
      <WaitForScript src={gMapsScriptUrl}>
        {({ loaded }) => (
          loaded
          ? <LiftedGMap 
              childs={
                Observable.combineLatest(filteredBusinesses, selectedBusiness, viewType)
                  .map(([ businesses, selectedBiz, viewType ]) => 
                    businesses.filter(() => viewType === 'marker')
                      .map(bus => renderMarker(
                        () => {
                          selectedBusiness.set(bus.license)
                          loadInspectionsForLicense(window['atom'], bus.license)
                          selectedTab.set('business')
                        },
                        selectedBiz === bus.license,
                        bus
                      )))
              } />
          : <Spinner />
        )}
      </WaitForScript>
    )
  }
}
