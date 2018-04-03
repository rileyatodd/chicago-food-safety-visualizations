import * as React from 'react'
import { connect } from 'react-redux'
import PickOne from '../components/PickOne'
import About from '../components/About'
import LocationInfo from '../components/LocationInfo'
import FoodMapFilters2 from '../components/FoodMapFilters2'
import FoodSafetyMap2 from '../containers/FoodSafetyMap2'
import * as tabStyles from 'styles/Tabs.css'
import * as styles from 'styles/Root.css'
import * as vsStyles from 'styles/VisualizationSurface.css'
import * as cn from 'classnames'
import { F, Atom } from '@grammarly/focal'
import * as ui from '../models/ui'
import { AppState } from '../models'

interface Props {
  selectedLocation: any
  loadingInspections: any
  atom: Atom<AppState>
}

function Root({ selectedLocation, loadingInspections, atom }: Props) {
  return (
    <div>
      <F.div className={vsStyles.root}>
        <FoodMapFilters2 atom={window['atom']} />

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
        <FoodSafetyMap2 state={window['atom']} />
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
                      {[tabStyles.selected]: selected === 'location'})
                    }
                    onClick={() => select('location')}>
                Location
              </span>
            </div>
            <div>
            {
              selected === 'about' ? 
                <About /> :
              selected === 'location' ?
                <LocationInfo location={selectedLocation} 
                              isLoading={loadingInspections} />                          
              : null
            }
            </div>      
          </div>
        }
      </PickOne>
    </div>
  )
}

Root['displayName'] = 'Root'

const mapStateToProps = (state) => ({
  selectedLocation: state.data[state.ui.selectedLocation],
  loadingInspections: state.ui.loadingInspections
})

export default connect(mapStateToProps)(Root)