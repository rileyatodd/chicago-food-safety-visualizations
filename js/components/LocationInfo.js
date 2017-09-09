import React, { PropTypes } from 'react'
import { formatDate } from 'util'
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
              {lastFailureDate(inspections).map(formatDate('MMM D YYYY'))
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
          {inspections.map(inspection => (
            <li key={inspection.inspection_id}>
              <div className={styles.date}>{formatDate('MMM D YYYY', inspection.inspection_date)}</div>
              <div className={styles.result}>{inspection.results}</div>
              <div>
                <Violations violationsStr={inspection.violations || ""} />
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