import React, { Component } from 'react'

export const COLOR_CHANGE = 'COLOR_CHANGE'

const changeColor = (color) => ({
  type: COLOR_CHANGE, payload: color
})

const styles = {
  display: 'flex',
  flexDirection: 'column',
  padding: 16,
  width: 128,
  border: '1px solid #ddd'
}

class Main extends Component {
  render () {
    let { state, dispatch } = this.props
    let changeColorF = (c) => () => { dispatch(changeColor(c)) }

    const options = [
      { color: 'lightblue', text: 'Blue' },
      { color: 'lightgreen', text: 'Green' },
      { color: 'lightpink', text: 'Pink' },
      { color: 'lightyellow', text: 'Yellow' }
    ]

    return (
      <div style={{ ...styles, background: state.color }}>
        <span>Pick a color:</span>
        {options.map(({ color, text }) =>
          <button key={color} style={{ marginTop: 8 }} onClick={changeColorF(color)}>{text}</button>
        )}
      </div>
    )
  }
}

export default Main
