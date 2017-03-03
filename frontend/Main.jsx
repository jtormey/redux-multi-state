import React, { Component } from 'react'

class Main extends Component {
  constructor (props) {
    super(props)
    let c = 0
    setInterval(() => {
      c++
      props.dispatch({ type: 'INC' })
      if (c > 3) props.dispatch({ type: 'STATE_SWITCH', payload: 1 })
    }, 2000)
  }
  render () {
    return (
      <div className='main'>
        <span>Main</span>
        <pre>{JSON.stringify(this.props.state, null, 2)}</pre>
      </div>
    )
  }
}

export default Main
