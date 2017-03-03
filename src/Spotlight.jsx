import React, { Component } from 'react'

const styles = {
  spotlight: {
    position: 'fixed',
    bottom: '50%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  inner: {
    background: '#46464d',
    display: 'flex',
    padding: '16 0 8 16',
    border: '0px solid',
    borderRadius: 2
  },
  item: {
    marginRight: 16,
    marginBottom: 8,
    width: 80,
    height: 80
  },
  currentItem: {
    marginBottom: 0,
    paddingBottom: 4,
    borderBottom: '4px solid #ddd'
  }
}

class Spotlight extends Component {
  constructor (props) {
    super(props)
    let { current, states } = props.state

    this.state = {
      holding: false,
      cycle: parseInt(current),
      total: Object.keys(states).length
    }

    this.keydownHandlerBound = this.keydownHandler.bind(this)
    this.keyupHandlerBound = this.keyupHandler.bind(this)
  }

  componentWillReceiveProps (props) {
    let { current, states } = props.state
    this.setState({
      cycle: parseInt(current),
      total: Object.keys(states).length
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
      this.setState({ holding: false, cycle: this.props.state.current })
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
    let { state, onSwitch } = this.props
    let { cycle, total } = this.state
    if (key === 'n') {
      onSwitch && onSwitch(Object.keys(state.states).length.toString())
    } else if (key === ']') {
      this.setState({ cycle: (cycle + 1) % total })
    } else if (key === '[') {
      this.setState({ cycle: (cycle === 0 ? total : cycle) - 1 })
    }
  }

  render () {
    let { state, Item } = this.props
    let { holding, cycle } = this.state
    let { states } = state

    return !holding ? null : (
      <div style={styles.spotlight}>
        <div style={styles.inner}>
          {Object.keys(states).map(k =>
            <div key={k} style={{ ...styles.item, ...(k === cycle.toString() ? styles.currentItem : {}) }}>
              <Item state={states[k]}>{k}</Item>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Spotlight
