import * as React from 'react'
import { F, Atom, lift } from '@grammarly/focal'
import { values, map } from 'ramda'
import { Business, AppState } from 'models'
import { Observable } from 'rxjs'
import BusinessInfo from 'src/components/BusinessInfo'
import * as styles from 'src/styles/BusinessList.css'

interface Props {
  filteredBusinesses: Observable<Business[]>
  selectedBusiness: Atom<string>
}

export default function BusinessList({ filteredBusinesses, selectedBusiness }: Props) {
  return (
    <F.ul className={styles.list}>
      {filteredBusinesses.map(map(biz => (
        <li className={styles.card} key={biz.license} onClick={() => selectedBusiness.set(biz.license)}>
          <BusinessInfo business={biz} isLoading={false} focused={selectedBusiness.get() === biz.license} />
        </li>
      )))}
    </F.ul>
  )
}