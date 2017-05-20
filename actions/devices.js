import fetch from 'isomorphic-fetch'
import * as optionActions from './options'

export const RECEIVE_DEVICES = 'RECEIVE_DEVICES'
function receiveDevices (devices) {
  return {
    type: RECEIVE_DEVICES,
    payload: devices
  }
}

export function fetchDevices () {
  return function (dispatch) {
    // TODO dispatch(requestDevices())
    return fetch(`/api/devices`)
      .then(response => response.json())
      .then(devices =>
        dispatch(receiveDevices(devices))
      )
  }
}

export const OPEN_DEVICE = 'OPEN_DEVICE'
export function openDevice (device, status) {
  return {
    type: OPEN_DEVICE,
    meta: device,
    payload: status
  }
}

export function requestOpenDevice (device) {
  return function (dispatch) {
    // TODO dispatch(requestDevices())
    return fetch(`/api/devices/${device}/open`, {method: 'put', body: 'true'})
      .then(response => response.json())
      .then(status => dispatch(openDevice(device, status.open)))
      .then(() => dispatch(optionActions.fetchOptions(device)))
  }
}
