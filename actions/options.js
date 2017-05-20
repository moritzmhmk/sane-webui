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
    dispatch(requestOptions())
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
    return fetch(`/api/devices/${device}/options/${option}`)
      .then(response => response.json())
      .then(json => dispatch(receiveOptionValue(device, option, json.value)))
  }
}
