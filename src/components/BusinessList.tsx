import * as React from 'react'
import { F, Atom } from '@grammarly/focal'
import { values, map, whereEq } from 'ramda'
import { Business, AppState } from 'models'
import { Observable } from 'rxjs'
import BusinessInfo from 'src/components/BusinessInfo'
import * as styles from 'src/styles/BusinessList.css'

interface Props {
  filteredBusinesses: Observable<Business[]>
  selectedBusiness: Atom<string>
  isLoading: Observable<boolean>
}

export default function BusinessList({ filteredBusinesses, selectedBusiness, isLoading }: Props) {
  return (
    <F.ul className={styles.list}>
      {Observable.combineLatest(filteredBusinesses, selectedBusiness, isLoading).map(
        ([bizs, selBiz, loading]) => selBiz 
          ? <li className={styles.card}>
              <a href="#" onClick={() => selectedBusiness.set(null)}>&lt;- Back to list</a>
              <BusinessInfo business={bizs.find(whereEq({license: selBiz}))} 
                            isLoading={loading} 
                            focused={true} />
            </li>
          : bizs.map(biz => (
              <li className={styles.card} key={biz.license} onClick={() => selectedBusiness.set(biz.license)}>
                <BusinessInfo business={biz} isLoading={false} focused={false} />
              </li>
      )))}
    </F.ul>
  )
}