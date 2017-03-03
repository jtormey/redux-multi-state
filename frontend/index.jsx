import React from 'react'
import { render } from 'react-dom'
import { assoc } from 'ramda'
import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import Main from './Main'

const rootReducer = (state = { count: 0 }, action) => {
  let { type } = action
  switch (type) {
    case 'INC': {
      let { count } = state
      return assoc('count', count + 1, state)
    }
    default:
      return state
  }
}

const myEnhancer = (next) => {
  return (reducer, s) => {
    let initState = { current: 0, states: s ? { 0: s } : {} }

    const myReducer = (state = initState, action) => {
      if (action.type === 'STATE_SWITCH') {
        return assoc('current', action.payload, state)
      } else {
        // debugger
        let { current, states } = state
        let updatedStates = assoc(current, reducer(states[current], action), states)
        let r = assoc('states', updatedStates, state)
        return r
      }
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

let renderMain = () => {
  render(
    <Main state={store.getState()} dispatch={store.dispatch} />,
    document.getElementById('root')
  )
}

store.subscribe(renderMain)
renderMain()
