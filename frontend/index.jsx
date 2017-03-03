import React from 'react'
import { render } from 'react-dom'
import { assoc } from 'ramda'
import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import Main, { COLOR_CHANGE } from './Main'
import Spotlight from '../src/Spotlight'

const rootReducer = (state = { color: 'white' }, action) => {
  let { type } = action
  switch (type) {
    case COLOR_CHANGE: {
      return assoc('color', action.payload, state)
    }
    default:
      return state
  }
}

const STATE_SWITCH = 'STATE_SWITCH'

const switchState = (to) => ({
  type: STATE_SWITCH, payload: to
})

const myEnhancer = (next) => {
  return (reducer, s) => {
    let initState = { current: '0', states: s ? { '0': s } : {} }

    const myReducer = (state = initState, action) => {
      if (action.type === 'STATE_SWITCH') {
        state = assoc('current', action.payload, state)
      }
      let { current, states } = state
      let updatedStates = assoc(current, reducer(states[current], action), states)
      let r = assoc('states', updatedStates, state)
      return r
    }

    return next(myReducer, initState)
  }
}

const store = createStore(
  rootReducer,
  compose(
    myEnhancer,
    applyMiddleware(createLogger())
  )
)

const SpotlightItem = ({ state, children }) => (
  <div style={{ background: state.color, width: '100%', height: '100%' }} />
)

let renderMain = () => {
  let state = store.getState()
  let { current, states } = state

  render(
    <div>
      <Spotlight
        state={state}
        onSwitch={compose(store.dispatch, switchState)}
        Item={SpotlightItem} />
      <Main state={states[current]} dispatch={store.dispatch} />
    </div>,
    document.getElementById('root')
  )
}

store.subscribe(renderMain)
renderMain()
