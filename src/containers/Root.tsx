import * as React from 'react'
import PickOne from 'src/components/PickOne'
import About from 'src/components/About'
import BusinessInfo from 'src/components/BusinessInfo'
import FoodMapFilters from 'src/components/FoodMapFilters'
import FoodSafetyMap from 'src/containers/FoodSafetyMap'
import BusinessList from 'src/components/BusinessList'
import * as tabStyles from 'src/styles/Tabs.css'
import * as styles from 'src/styles/Root.css'
import * as cn from 'classnames'
import { F, Atom, lift } from '@grammarly/focal'
import { Observable } from 'rxjs'
import { Business, AppState } from 'models'

interface Props {
  state: Atom<AppState>,
  filteredBusinesses: Observable<Business[]>
}

let BusinessInfo$ = lift(BusinessInfo)

export default function Root({ state, filteredBusinesses }: Props) {
  return (
    <div>
      <F.div className={styles.root}>
        <FoodMapFilters viewType={state.lens(s => s.ui.viewType)} 
                        query={state.lens(s => s.ui.query)}
                        passFail={state.lens(s => s.ui.filters.passFail)} 
                        loadingBusinesses={state.lens(s => s.ui.loadingBusinesses)} />
        {state.view(s => 
          Object.keys(s.businesses || {}).length > 950 &&
            <div className={styles.warning}>
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
        <FoodSafetyMap 
          selectedBusiness={state.lens(s => s.ui.selectedBusiness)}
          selectedTab={state.lens(s => s.ui.selectedTab)}
          viewType={state.lens(s => s.ui.viewType)}
          filteredBusinesses={filteredBusinesses}
          isGmapsLoaded={state.lens(s => s.ui.isGmapsLoaded)}
          map={state.lens(s => s.map)}
        />
      </F.div>
      <div className={styles.tabContainer}>
        <div className={tabStyles.container}>
          <F.span className={state.view(s => cn(
                    tabStyles.tab, 
                    {[tabStyles.selected]: s.ui.selectedTab === 'about'})
                  )} 
                  onClick={() => state.lens(s => s.ui.selectedTab).set('about')}>
            About
          </F.span>
          <F.span className={state.view(s => cn(
                    tabStyles.tab, 
                    {[tabStyles.selected]: s.ui.selectedTab === 'business'})
                  )}
                  onClick={() => state.lens(s => s.ui.selectedTab).set('business')}>
            Business
          </F.span>
          <F.span className={state.view(s => cn(
                    tabStyles.tab, 
                    {[tabStyles.selected]: s.ui.selectedTab === 'businesses'})
                  )}
                  onClick={() => state.lens(s => s.ui.selectedTab).set('businesses')}>
            Businesses
          </F.span>
        </div>
        <F.div>
        {state.view(s =>
          s.ui.selectedTab === 'about' ? 
            <About /> :
          s.ui.selectedTab === 'business' ?
            <BusinessInfo$ business={state.map(s => s.businesses[s.ui.selectedBusiness])} 
                           isLoading={state.map(s => s.ui.loadingInspections)} /> :
          s.ui.selectedTab === 'businesses' ?
             <BusinessList filteredBusinesses={filteredBusinesses} 
                           selectedBusiness={state.lens(s => s.ui.selectedBusiness)} />
          : null
        )}
        </F.div>      
      </div>
    </div>
  )
}