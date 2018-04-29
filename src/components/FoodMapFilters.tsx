import * as React from 'react'
import Spinner from 'src/components/Spinner'
import * as styles from 'src/styles/FoodMapFilters.css'
import { F, Atom } from '@grammarly/focal'
import * as ui from 'src/models/ui'
import { loadDataFromRemote, AppState } from 'src/models'

export default function FoodMapFilters({
  atom
}: {atom: Atom<ui.State>}) {
  return (
    <F.div className={styles.container}>
      <div>
        <label style={{display: 'block'}}>Result Filter</label>
        <select defaultValue="all" onChange={e => atom.lens(s => s.filters.passFail).set(e.target.value)}>
          <option value="all">All</option>
          <option value="pass">Have always passed</option>
          <option value="fail">Have failed at least once</option>
        </select>
      </div>
      <div>
        <label style={{display: 'block'}}>Data Display Type</label>
        <select defaultValue="marker" onChange={e => atom.lens(s => s.viewType).set(e.target.value)}>
          <option value="marker">Location Markers</option>
          <option value="heatmap">Heatmap</option>
        </select>
      </div>
      <div>
        <label style={{display: 'block'}}>Search Businesses and Violations</label>
        <input type='text' onChange={e => atom.lens(s => s.query).set(e.target.value)}/>
      </div>
      <button onClick={() => loadDataFromRemote(window['atom'])}>
        <i className="fa fa-sync" />
      </button>
      {atom.view(s => s.loadingInspections && <Spinner key="_" />)}
    </F.div>
  )
}