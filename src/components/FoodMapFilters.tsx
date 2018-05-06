import * as React from 'react'
import Spinner from 'src/components/Spinner'
import * as styles from 'src/styles/FoodMapFilters.css'
import * as btnGroupS from 'src/styles/ButtonGroup.css'
import * as inputGroupS from 'src/styles/InputGroup.css'
import { F, Atom } from '@grammarly/focal'
import * as ui from 'src/models/ui'
import * as cn from 'classnames'

interface Props {
  viewType: Atom<string>
  query: Atom<string>
  passFail: Atom<string>
  loadingBusinesses: Atom<boolean>
}

export default function FoodMapFilters({ viewType, query, passFail, loadingBusinesses }: Props) {
  return (
    <F.div className={styles.container}>
      <select defaultValue="all" onChange={e => passFail.set(e.target.value)}>
        <option value="all">All</option>
        <option value="pass">Have always passed</option>
        <option value="fail">Have failed at least once</option>
      </select>
      <div className={btnGroupS.buttonGroup}>
        <F.button onClick={() => viewType.set('marker')} 
                  className={viewType.view(type => cn({[btnGroupS.selected]: type === 'marker'}, btnGroupS.btn))}>
          <i className='fa fa-map-marker-alt' />
        </F.button>
        <F.button onClick={() => viewType.set('heatmap')}
                  className={viewType.view(type => cn({[btnGroupS.selected]: type === 'heatmap'}, btnGroupS.btn))}>
          <img src='/images/heatmap.png' width="17" />
        </F.button>
      </div>
      <div className={inputGroupS.group}>
        <i className='fa fa-search' />
        <input type='text' onChange={e => query.set(e.target.value)}/>
      </div>
      {loadingBusinesses.view(loading => loading && <Spinner key="_" />)}
    </F.div>
  )
}