import * as React from 'react'
let format = require('date-fns/format')
import { lastFailureDate, countResults } from 'models'
import Violations from 'src/components/Violations'
import Spinner from 'src/components/Spinner'
import * as styles from 'src/styles/BusinessInfo.css'

export default function BusinessInfo({ business, isLoading }) {
  if (!business) return <div style={{height: '20px'}}></div>

  if (isLoading) return <Spinner />

  let { inspections, address, dba_name } = business
  let resultCounts = countResults(inspections)
  return (
    <div className={styles.container}>
      <div className={styles.metadataContainer}>
        <h3>{dba_name}</h3>
        <dl>
          <div>
            <dt>Address</dt>
            <dd>{address}</dd>
          </div>
          <div>
            <dt>Last Failure</dt>
            <dd>
              {lastFailureDate(inspections)
                .map(x => format(x, 'MMM D YYYY'))
                .getOrElse('None')}
            </dd>
          </div>
          <div>
            <dt># of Failures</dt>
            <dd>{resultCounts.Fail || 0}</dd>
          </div>
          <div>
            <dt># of Passes</dt>
            <dd>{(resultCounts.Pass || 0) + (resultCounts['Pass w/ Conditions'] || 0)}</dd>
          </div>
        </dl>
      </div>
      <div>
        <h4>Inspections</h4>
        <ol className={styles.inspectionList}>
          {inspections.map(({inspection_id, inspection_date, results, violations}) => (
            <li key={inspection_id}>
              <div className={styles.date}>{format(inspection_date, 'MMM D YYYY')}</div>
              <div className={styles.result}>{results}</div>
              <div>
                <Violations violationsStr={violations || ""} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
