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
  selectedBusiness: Business
  loadingInspections: boolean
  atom: Atom<AppState>
}

let BusinessInfo$ = lift(BusinessInfo)

export default function Root({ selectedBusiness, loadingInspections, atom }: Props) {
  return (
    <div>
      <F.div className={vsStyles.root}>
        <FoodMapFilters atom={window['atom']} />

        {atom.view(s => 
          Object.keys(s.data || {}).length > 950 &&
            <div className={vsStyles.warning}>
              <p>
                Your last search returned quite a few businesses!
                There may be a few businesses missing from your results due
                to the constraints of the city of Chicago's open data system.
              </p>
              <p>
                If the business you are looking for can't be found,
                try zooming the map in a bit so that less businesses are
                inside the bounds of the map.
              </p>
            </div>)}
        <FoodSafetyMap state={window['atom']} />
      </F.div>
      <PickOne defaultSelected='about'>
        {({ selected, select }) =>
          <div className={styles.tabContainer}>
            <div className={tabStyles.container}>
              <span className={cn(
                      tabStyles.tab, 
                      {[tabStyles.selected]: selected === 'about'})
                    } 
                    onClick={() => select('about')}>
                About
              </span>
              <span className={cn(
                      tabStyles.tab, 
                      {[tabStyles.selected]: selected === 'business'})
                    }
                    onClick={() => select('business')}>
                Business
              </span>
            </div>
            <div>
            {
              selected === 'about' ? 
                <About /> :
              selected === 'business' ?
                <BusinessInfo$ business={atom.map(s => s.data[s.ui.selectedBusiness])} 
                               isLoading={atom.map(s => s.ui.loadingInspections)} />
              : null
            }
            </div>      
          </div>
        }
      </PickOne>
    </div>
  )
}