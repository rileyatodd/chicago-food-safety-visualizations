import * as React from 'react'

interface Props {
  defaultSelected: any
  children: (p: ChildProps) => JSX.Element
}

interface ChildProps {
  selected: any
  select: (x) => void
}

export default class PickOne extends React.Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = { selected: props.defaultSelected }
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