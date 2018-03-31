import * as React from 'react'
import { connect } from 'react-redux'
import VisualizationSurface from 'containers/VisualizationSurface'
import PickOne from 'components/PickOne'
import About from 'components/About'
import LocationInfo from 'components/LocationInfo'
import * as tabStyles from 'styles/Tabs.css'
import * as styles from 'styles/Root.css'
import * as cn from 'classnames'
import { F, Atom } from '@grammarly/focal'

let interval;

function Root({ selectedLocation, loadingInspections, atom }: { selectedLocation: any, loadingInspections: any, atom: Atom<{time: number}> }) {
  interval && clearInterval(interval)
  interval = setInterval(
    () => atom.lens(state => state.time).modify(x => x + 1),
    1000
  )
  return (
    <div>
      <F.div>
        Time since refresh: {atom.lens(state => state.time)}
      </F.div>
      <VisualizationSurface />
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