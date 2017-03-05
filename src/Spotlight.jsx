import React, { Component } from 'react'
import { map, join, compose } from 'ramda'

const SCALE_FACTOR = 10

let px = compose(join(' '), map(n => `${n}px`))

const styles = {
  spotlight: {
    zIndex: 128000,
    position: 'fixed',
    bottom: '50%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  inner: {
    background: '#46464d',
    display: 'flex',
    padding: px([16, 0, 8, 16]),
    border: '0px solid',
    borderRadius: 2
  },
  item: (x, y, factor) => ({
    marginRight: 16,
    marginBottom: 8,
    width: x / factor,
    height: y / factor,
    overflow: 'hidden'
  }),
  selectedItem: {
    marginBottom: 0,
    paddingBottom: 4,
    borderBottom: '4px solid #ddd'
  }
}

class Spotlight extends Component {
  constructor (props) {
    super(props)
    let { __current, __states } = props.store.getState()

    this.state = {
      holding: false,
      cycle: parseInt(__current),
      total: Object.keys(__states).length
    }

    this.keydownHandlerBound = this.keydownHandler.bind(this)
    this.keyupHandlerBound = this.keyupHandler.bind(this)
  }

  componentWillReceiveProps (props) {
    let { __current, __states } = props.store.getState()
    this.setState({
      cycle: parseInt(__current),
      total: Object.keys(__states).length
    })
  }

  componentWillMount () {
    document.addEventListener('keydown', this.keydownHandlerBound)
    document.addEventListener('keyup', this.keyupHandlerBound)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.keydownHandlerBound)
    document.removeEventListener('keyup', this.keyupHandlerBound)
  }

  keydownHandler (event) {
    let { key } = event
    if (key === 'Control') {
      this.setState({ holding: true })
    } else if (key === 'Escape' && this.state.holding) {
      this.setState({ holding: false, cycle: this.props.current })
    } else if (this.state.holding) {
      event.preventDefault()
      this.handleCmdKey(key)
    }
  }

  keyupHandler (event) {
    let { onSwitch } = this.props
    if (event.key === 'Control') {
      this.setState({ holding: false })
      onSwitch && onSwitch(this.state.cycle.toString())
    }
  }

  handleCmdKey (key) {
    let { store, onSwitch } = this.props
    let { __states } = store.getState()
    let { cycle, total } = this.state
    if (key === 'n') {
      onSwitch && onSwitch(Object.keys(__states).length.toString())
    } else if (key === ']') {
      this.setState({ cycle: (cycle + 1) % total })
    } else if (key === '[') {
      this.setState({ cycle: (cycle === 0 ? total : cycle) - 1 })
    }
  }

  render () {
    let { store, View } = this.props
    let { holding, cycle } = this.state
    let { width, height } = window.screen

    let transform = `translate(-50%, -50%) scale(${1 / SCALE_FACTOR}) translate(50%, 50%)`
    let itemStyles = styles.item(width, height, SCALE_FACTOR)
    let getSelectedStyles = (k) => k === cycle.toString() ? styles.selectedItem : {}

    const renderItem = (k) => (
      <div key={k} style={{ ...itemStyles, ...getSelectedStyles(k) }}>
        <div style={{ width, height, transform, background: 'white', overflow: 'hidden' }}>
          <View state={store.getState(k)} />
        </div>
      </div>
    )

    return !holding ? null : (
      <div style={styles.spotlight}>
        <div style={styles.inner}>
          {Object.keys(store.getState().__states).map(renderItem)}
        </div>
      </div>
    )
  }
}

export default Spotlight
