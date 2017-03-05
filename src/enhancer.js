import { assoc } from 'ramda'

const enhancer = (next) => {
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

export default enhancer
