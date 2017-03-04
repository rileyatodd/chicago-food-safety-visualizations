import React, { PropTypes } from 'react'
import moment from 'moment'
import Violations from 'components/Violations'

const LocationInfo = ({ location }) => {
  if (!location) return <div style={{display: 'none'}}></div>

  let { address, dba_name, facility_type } = location.inspections[0]
  return (
    <div>
      <div>
        <h3>{dba_name}</h3>
        <dl>
          <dt>Address</dt>
          <dd>{address}</dd>
          <dt>Type</dt>
          <dd>{facility_type}</dd>
        </dl>
      </div>
      <div>
        <h4>Inspections</h4>
        <table>
          <thead>
            <tr>
              <th>Inpection Date</th>
              <th>Result</th>
              <th>Violations and Comments</th>
            </tr>
          </thead>
          <tbody>
            {location.inspections.map(inspection => (
              <tr key={inspection.inspection_id}>
                <td>{moment(inspection.inspection_date).format('MMM D YYYY')}</td>
                <td>{inspection.results}</td>
                <td>
                  <Violations violationsStr={inspection.violations} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

LocationInfo.propTypes = {
  location: PropTypes.object
}

export default LocationInfo
