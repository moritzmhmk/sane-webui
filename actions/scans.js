export const REQUEST_SCAN = 'REQUEST_SCAN'
export function requestScan (device) {
  return {
    type: REQUEST_SCAN,
    meta: {device, id: Date.now()}
  }
}

export const RECEIVE_SCAN = 'RECEIVE_SCAN'
export function receiveScan (device, id, image) {
  return {
    type: RECEIVE_SCAN,
    meta: {device, id},
    payload: image
  }
}

export const ADD_SCAN_REGION = 'ADD_SCAN_REGION'
export function addScanRegion (device, scan, geometry, image) {
  return {
    type: ADD_SCAN_REGION,
    meta: {device, scan},
    payload: {geometry, image}
  }
}

export const REMOVE_SCAN_REGION = 'REMOVE_SCAN_REGION'
export function removeScanRegion (device, scan, region) {
  return {
    type: ADD_SCAN_REGION,
    meta: {device, scan, region}
  }
}

export const UPDATE_SCAN_REGION = 'UPDATE_SCAN_REGION'
export function updateScanRegion (device, scan, region, geometry, image) {
  return {
    type: UPDATE_SCAN_REGION,
    meta: {device, scan, region},
    payload: {geometry, image}
  }
}

export const SELECT_SCAN_REGION = 'SELECT_SCAN_REGION'
export function selectScanRegion (device, scan, region) {
  return {
    type: SELECT_SCAN_REGION,
    meta: {device, scan, region}
  }
}
