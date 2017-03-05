import React from 'react'
import { render } from 'react-dom'
import { assoc } from 'ramda'
import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import Main, { COLOR_CHANGE } from './Main'
import Spotlight from '../src/Spotlight'
import enhancer from '../src/enhancer'
import { switchState } from '../src/actions'

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

const store = createStore(
  rootReducer,
  compose(
    enhancer,
    applyMiddleware(createLogger())
  )
)

let renderMain = () => {
  let { current, states } = store.getState()
  let dispatch = store.dispatch

  render(
    <div>
      <Spotlight
        current={current}
        states={states}
        onSwitch={compose(store.dispatch, switchState)}
        View={({ state }) => (<Main state={state} />)} />
      <Main state={states[current]} dispatch={dispatch} />
    </div>,
    document.getElementById('root')
  )
}

store.subscribe(renderMain)
renderMain()
