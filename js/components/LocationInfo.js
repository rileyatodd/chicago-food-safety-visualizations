import React, { PropTypes } from 'react'
import format from 'date-fns/format'
import { lastFailureDate, countResults } from 'models'
import Violations from 'components/Violations'
import styles from 'styles/LocationInfo.css'

const LocationInfo = ({ location }) => {
  if (!location) return <div style={{height: '20px'}}></div>

  let { inspections } = location
  let { address, dba_name, facility_type } = inspections[0]
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
            <dt>Type</dt>
            <dd>{facility_type}</dd>
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

LocationInfo.propTypes = {
  location: PropTypes.object
}

export default LocationInfo
