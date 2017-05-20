import { combineReducers } from 'redux'
import {RECEIVE_DEVICES, OPEN_DEVICE} from '../actions/devices'
import {RECEIVE_OPTIONS, RECEIVE_OPTION_VALUE} from '../actions/options'

function devices (state = [], action) {
  switch (action.type) {
    case RECEIVE_DEVICES:
      return action.payload
    default:
      return state
  }
}

function options (state = {}, action) {
  switch (action.type) {
    case RECEIVE_OPTIONS:
      let newState = {}
      action.payload.forEach(function (option, id) {
        option.id = id
        newState[option.id] = option
      })
      return newState
    case RECEIVE_OPTION_VALUE:
      let o = action.meta.option
      let v = action.payload
      console.log(RECEIVE_OPTION_VALUE, o, v)
      return {...state, [o]: {...state[o], value: v}}
    default:
      return state
  }
}

function optionsGrouped (state = [], action) {
  switch (action.type) {
    case RECEIVE_OPTIONS:
      let group = { members: [], cap: [], title: '' }
      let groups = [group]
      action.payload.forEach((option) => {
        if (option.type === 'GROUP') {
          group = {
            title: option.title,
            description: option.description,
            cap: option.cap,
            id: option.id,
            members: []
          }
          groups.push(group)
        } else {
          group.members.push(option.id)
        }
      })
      return groups
    default:
      return state
  }
}

function selectedDevice (state = null, action) {
  switch (action.type) {
    case OPEN_DEVICE:
      return action.meta
    default:
      return state
  }
}

const rootReducer = combineReducers({
  devices,
  selectedDevice,
  options,
  optionsGrouped
})

export default rootReducer
