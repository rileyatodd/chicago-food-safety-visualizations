import * as React from 'react'
import { F, Atom, lift } from '@grammarly/focal'
import { values, map } from 'ramda'
import { Business, AppState } from 'models'
import { Observable } from 'rxjs'

interface Props {
  filteredBusinesses: Observable<Business[]>
  selectedBusiness: Atom<string>
}

export default function BusinessList({ filteredBusinesses, selectedBusiness }: Props) {
  return (
    <F.ul>
      {filteredBusinesses.map(map(biz => (
        <div key={biz.license} onClick={() => selectedBusiness.set(biz.license)}>
          <h3>{biz.dba_name}</h3>
          <div>{biz.address}</div>

        </div>
      )))}
    </F.ul>
  )
}