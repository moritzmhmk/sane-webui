import fetch from 'isomorphic-fetch'

export const REQUEST_OPTIONS = 'REQUEST_OPTIONS'
function requestOptions (device) {
  return {
    type: REQUEST_OPTIONS,
    meta: device
  }
}

export const RECEIVE_OPTIONS = 'RECEIVE_OPTIONS'
function receiveOptions (device, options) {
  return {
    type: RECEIVE_OPTIONS,
    meta: device,
    payload: options
  }
}

const hasCap = (option, cap) => option.cap.indexOf(cap) >= 0

export function fetchOptions (device) {
  return function (dispatch) {
    dispatch(requestOptions(device))
    return fetch(`/api/devices/${device}/options`)
      .then(response => response.json())
      .then(options => {
        dispatch(receiveOptions(device, options))
        options.forEach((option, id) => {
          if (hasCap(option, 'SOFT_DETECT') && !hasCap(option, 'INACTIVE') && option.type !== 'BUTTON') {
            dispatch(fetchOptionValue(device, id))
          }
        })
      })
  }
}

export const REQUEST_OPTION_VALUE = 'REQUEST_OPTION_VALUE'
function requestOptionValue (device, option) {
  return {
    type: REQUEST_OPTION_VALUE,
    meta: {device: device, option: option}
  }
}

export const RECEIVE_OPTION_VALUE = 'RECEIVE_OPTION_VALUE'
function receiveOptionValue (device, option, value) {
  return {
    type: RECEIVE_OPTION_VALUE,
    meta: {device: device, option: option},
    payload: value
  }
}

export function fetchOptionValue (device, option) {
  return function (dispatch) {
    dispatch(requestOptionValue(device, option))
    return fetch(`/api/devices/${device}/options/${option}`)
      .then(response => response.json())
      .then(json => dispatch(receiveOptionValue(device, option, json.value)))
  }
}

export function setOptionValue (device, option, value) {
  return function (dispatch) {
    dispatch(requestOptionValue(device, option))
    return fetch(`/api/devices/${device}/options/${option}`, {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({value})
    })
      .then(response => response.json())
      .then(json => {
        dispatch(receiveOptionValue(device, option, json.value))
        if (json.info.indexOf('RELOAD_OPTIONS') >= 0) { // TODO handle RELOAD_PARAMS
          dispatch(fetchOptions(device))
        }
      })
  }
}
