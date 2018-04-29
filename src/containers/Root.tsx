import * as React from 'react'
import PickOne from 'src/components/PickOne'
import About from 'src/components/About'
import BusinessInfo from 'src/components/BusinessInfo'
import FoodMapFilters from 'src/components/FoodMapFilters'
import FoodSafetyMap from 'src/containers/FoodSafetyMap'
import BusinessList from 'src/components/BusinessList'
import * as tabStyles from 'src/styles/Tabs.css'
import * as styles from 'src/styles/Root.css'
import * as vsStyles from 'src/styles/VisualizationSurface.css'
import * as cn from 'classnames'
import * as Fuse from 'fuse.js'
import { F, Atom, lift } from '@grammarly/focal'
import { chain, prop, values, curry, map, compose } from 'ramda'
import { Observable } from 'rxjs'
import { filterBusinesses, Business, AppState } from 'models'
import { fuseOpts } from 'src/models/search'

interface Props {
  state: Atom<AppState>
}

let BusinessInfo$ = lift(BusinessInfo)

export default function Root({ state }: Props) {
  let index: Observable<Fuse> = state.view(x => x.businesses).map(
    compose( data => new Fuse(data, fuseOpts)
           , chain(prop('inspections'))
           , values
           )
  )

  let results = state.view(x => x.ui.query)
    .combineLatest(index)
    .map(([ query, index ]) => new Set(index.search(query || "")))


  let filteredBusinesses: Observable<Business[]> = results.combineLatest(state)
    .map(([ results, { ui, businesses } ]) => {
      let filteredBizs = filterBusinesses(ui.filters, businesses)
      return ui.query ? filteredBizs.filter(x => results.has(x.license)) 
                      : filteredBizs
    })

  return (
    <div>
      <F.div className={vsStyles.root}>
        <FoodMapFilters atom={state.lens(s => s.ui)} />

        {state.view(s => 
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
        <FoodSafetyMap 
          selectedBusiness={state.lens(s => s.ui.selectedBusiness)}
          selectedTab={state.lens(s => s.ui.selectedTab)}
          viewType={state.lens(s => s.ui.viewType)}
          filteredBusinesses={filteredBusinesses}
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