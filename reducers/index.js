import { combineReducers } from 'redux'
import {RECEIVE_DEVICES, OPEN_DEVICE} from '../actions/devices'
import {RECEIVE_OPTIONS, REQUEST_OPTION_VALUE, RECEIVE_OPTION_VALUE} from '../actions/options'
import {REQUEST_SCAN, RECEIVE_SCAN, ADD_SCAN_REGION, REMOVE_SCAN_REGION, UPDATE_SCAN_REGION, SELECT_SCAN_REGION} from '../actions/scans'

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
      let groups = []
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

function scans (state = {}, action) {
  switch (action.type) {
    case REQUEST_SCAN:
      return {
        ...state,
        [action.meta.id]: {pending: true}
      }
    case RECEIVE_SCAN:
      return {
        ...state,
        [action.meta.id]: {
          ...state[action.meta.id],
          pending: false,
          image: action.payload,
          regions: []
        }
      }
    case ADD_SCAN_REGION:
      return {
        ...state,
        [action.meta.scan]: {
          ...state[action.meta.scan],
          regions: [
            ...state[action.meta.scan].regions,
            {
              geometry: {position: {x: 0, y: 0}, dimension: {x: 100, y: 100}, rotation: 0, ...action.payload.geometry},
              image: action.payload.image
            }
          ],
          selectedRegion: state[action.meta.scan].regions.length
        }
      }
    case REMOVE_SCAN_REGION:
      return {
        ...state,
        [action.meta.scan]: {
          ...state[action.meta.scan],
          regions: [
            ...state[action.meta.scan].regions.slice(0, action.meta.region),
            ...state[action.meta.scan].regions.slice(action.meta.region + 1)
          ]
        }
      }
    case UPDATE_SCAN_REGION:
      return {
        ...state,
        [action.meta.scan]: {
          ...state[action.meta.scan],
          regions: [
            ...state[action.meta.scan].regions.slice(0, action.meta.region),
            {
              geometry: {...state[action.meta.scan].regions[action.meta.region].geometry, ...action.payload.geometry},
              image: action.payload.image || state[action.meta.scan].regions[action.meta.region].image
            },
            ...state[action.meta.scan].regions.slice(action.meta.region + 1)
          ]
        }
      }
    case SELECT_SCAN_REGION:
      return action.meta.scan ? {
        ...state,
        [action.meta.scan]: {
          ...state[action.meta.scan],
          selectedRegion: action.meta.region
        }
      } : state
    default:
      return state
  }
}

function selectedScan (state = null, action) {
  switch (action.type) {
    case REQUEST_SCAN:
      return action.meta.id
    case SELECT_SCAN_REGION:
      return action.meta.scan
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
  optionsGrouped,
  scans,
  selectedScan
})

export default rootReducer
