import React, { PropTypes } from 'react'

export default function Violations({violationsStr}) {
  let violationsArr = violationsStr.split(/| [0-9]+\./)

  return (
    <div>
      violationsArr.map(violation => <div>{violation}</div>)
    </div>
  )
}

Violations.displayName = 'Violations'
