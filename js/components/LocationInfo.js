import React, { PropTypes } from 'react'
import { map } from 'ramda'
import moment from 'moment'

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
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Inpection Date</th>
              <th>Result</th>
              <th>Violations and Comments</th>
            </tr>
          </thead>
          <tbody>
            {map(inspection => (
              <tr key={inspection.inspection_id}>
                <td>{moment(inspection.inspection_date).format('MMM D YYYY')}</td>
                <td>{inspection.results}</td>
                <td>{inspection.violations}</td>
              </tr>
            ))(location.inspections)}
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