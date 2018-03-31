import React, { Component } from 'react'
import { loadScript } from 'util/index.js'

export default class WaitForScript extends Component {
  state = {
    loaded: false
  }

  handleLoad() {
    !this.isUnmounted && this.setState({loaded: true})
  }

  componentWillMount() {
    loadScript({ src: this.props.src
               , onload: this.handleLoad.bind(this) })
  }

  render() {
    return this.props.children({loaded: this.state.loaded})
  }
}