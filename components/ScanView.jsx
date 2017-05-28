import React from 'react'
import PropTypes from 'prop-types'

const ScanView = props => {
  let {selectedDevice, scans, selectedScan, scanActions} = props
  let src
  if (selectedScan) {
    console.log(selectedScan, scans[selectedScan].image)
    src = scans[selectedScan] && scans[selectedScan].image && scans[selectedScan].image.data ||
          `/api/devices/${selectedDevice}/scan.png?id=${selectedScan}`
  }
  return (<div id='scan' style={{height: '100vh', overflow: 'hidden', textAlign: 'center', lineHeight: '100vh'}}>
    <img
      key={selectedScan/* changing key causes replacement in DOM -> image is shown while loading */}
      src={src}
      onLoad={e => {
        console.log(e)
        let img = e.target
        let canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        let dataURL = canvas.toDataURL('image/png')
        scanActions.receiveScan(selectedDevice, selectedScan, {data: dataURL, width: img.width, height: img.width})
      }}
      style={{maxWidth: '100%', maxHeight: '100vh', verticalAlign: 'center'}} />
    <div className='selection' />
  </div>)
}

ScanView.propTypes = {
  selectedDevice: PropTypes.string,
  selectedScan: PropTypes.number,
  scanActions: PropTypes.function
}

export default ScanView
