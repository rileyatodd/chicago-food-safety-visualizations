import * as React from 'react'
import PickOne from 'src/components/PickOne'
import About from 'src/components/About'
import BusinessInfo from 'src/components/BusinessInfo'
import FoodMapFilters from 'src/components/FoodMapFilters'
import FoodSafetyMap from 'src/containers/FoodSafetyMap'
import * as tabStyles from 'src/styles/Tabs.css'
import * as styles from 'src/styles/Root.css'
import * as vsStyles from 'src/styles/VisualizationSurface.css'
import * as cn from 'classnames'
import { F, Atom, lift } from '@grammarly/focal'
import * as ui from 'src/models/ui'
import { Business, AppState } from 'models'

interface Props {
  atom: Atom<AppState>
}

let BusinessInfo$ = lift(BusinessInfo)

export default function Root({ atom }: Props) {
  return (
    <div>
      <F.div className={vsStyles.root}>
        <FoodMapFilters atom={atom.lens(s => s.ui)} />

        {atom.view(s => 
          Object.keys(s.businesses || {}).length > 950 &&
            <div className={vsStyles.warning}>
              <p>
                Your last search returned quite a few businesses!
                There may be a few businesses missing from your results due
                to the constraints of the city of Chicago's open data system.
              </p>
              <p>
                If the business you are looking for can't be found,
                try zooming the map in a bit so that fewer businesses are
                inside the bounds of the map.
              </p>
            </div>)}
        <FoodSafetyMap state={window['atom']} />
      </F.div>
      <div className={styles.tabContainer}>
        <div className={tabStyles.container}>
          <F.span className={atom.view(s => cn(
                    tabStyles.tab, 
                    {[tabStyles.selected]: s.ui.selectedTab === 'about'})
                  )} 
                  onClick={() => atom.lens(s => s.ui.selectedTab).set('about')}>
            About
          </F.span>
          <F.span className={atom.view(s => cn(
                  tabStyles.tab, 
                  {[tabStyles.selected]: s.ui.selectedTab === 'business'})
                )}
                onClick={() => atom.lens(s => s.ui.selectedTab).set('business')}>
            Business
          </F.span>
        </div>
        <F.div>
        {atom.view(s =>
          s.ui.selectedTab === 'about' ? 
            <About /> :
          s.ui.selectedTab === 'business' ?
            <BusinessInfo$ business={atom.map(s => s.businesses[s.ui.selectedBusiness])} 
                           isLoading={atom.map(s => s.ui.loadingInspections)} />
          : null
        )}
        </F.div>      
      </div>
    </div>
  )
}