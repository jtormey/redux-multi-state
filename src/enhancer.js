import { STATE_SWITCH } from './actions'

const decorate = (current, states) => {
  let state = states[current]
  if (typeof state === 'object') {
    state.__current = current
    state.__states = states
  } else {
    console.error('Cannot decorate non-object state')
  }
  return state
}

const createStatesReducer = (reducer, initialState) => {
  let current = 0
  let states = initialState ? { [current]: initialState } : {}

  return (state = initialState, action) => {
    if (action.type === STATE_SWITCH) {
      current = action.payload
    }
    states[current] = reducer(states[current], action)
    return decorate(current, states)
  }
}

const enhancer = (next) => (reducer, initialState) => {
  let statesReducer = createStatesReducer(reducer, initialState)
  let store = next(statesReducer, initialState)
  let getState = store.getState

  store.getState = (index) => {
    let state = getState()
    if (index == null || isNaN(index) || index < 0 || index >= state.__states.length) {
      index = state.__current
    }
    return state.__states[index]
  }

  return store
}

export default enhancer
