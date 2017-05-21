import { combineReducers } from 'redux'
import {RECEIVE_DEVICES, OPEN_DEVICE} from '../actions/devices'
import {RECEIVE_OPTIONS, REQUEST_OPTION_VALUE, RECEIVE_OPTION_VALUE} from '../actions/options'

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
        option.device = action.meta
        newState[option.id] = option
      })
      return newState
    case REQUEST_OPTION_VALUE:
      return {...state, [action.meta.option]: {...state[action.meta.option], valuePending: true}}
    case RECEIVE_OPTION_VALUE:
      return {...state, [action.meta.option]: {...state[action.meta.option], value: action.payload, valuePending: false}}
    default:
      return state
  }
}

function optionsByName (state = {}, action) {
  switch (action.type) {
    case RECEIVE_OPTIONS:
      let newState = {}
      action.payload.forEach(function (option, id) { newState[option.name] = option.id })
      return newState
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
  optionsByName,
  optionsGrouped
})

export default rootReducer
