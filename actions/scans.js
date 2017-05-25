export const REQUEST_SCAN = 'REQUEST_SCAN'
export function requestScan (device) {
  return {
    type: REQUEST_SCAN,
    meta: {device, id: Date.now()}
  }
}

export const RECEIVE_SCAN = 'RECEIVE_SCAN'
export function receiveScan (device, id, data) {
  return {
    type: RECEIVE_SCAN,
    meta: {device, id},
    payload: data
  }
}
