import React, { PropTypes, Component } from 'react'

export default class PickOne extends Component {

  constructor({ defaultSelected }) {
    super()
    this.state = { selected: defaultSelected }
    this.select = this.select.bind(this)
  }

  select(selected) {
    this.setState({ selected })
  }

  render() {
    let { selected } = this.state
    let { children } = this.props

    return children({ selected, select: this.select })
  }
}