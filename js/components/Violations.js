import React, { PropTypes } from 'react'
import { parseViolations } from 'models'
import styles from 'styles/Violations.css'

export default function Violations({violationsStr}) {

  return (
    <ul className={styles.list}>
      {parseViolations(violationsStr).map(({title, comments}, i) =>
        <li key={i}>
          <div>{title}</div>
          {comments && <div className={styles.commentsLabel}>Comments</div>}
          <div>{comments}</div>
        </li>
      )}
    </ul>
  )
}

Violations.displayName = 'Violations'
