import React from 'react'
import PropTypes from 'prop-types'

const ThumbnailsView = props => {
  let {scans, select} = props
  return (<div id='thumbnails'>
    {Object.keys(scans).map((id) => <img key={id} src={scans[id].image && scans[id].image.data} style={{width: '100%'}} onClick={() => select(id)} />)}
    <div className='add' onClick={() => select(null)} />
  </div>)
}

ThumbnailsView.propTypes = {
  selectedDevice: PropTypes.string,
  selectedScan: PropTypes.number,
  scanActions: PropTypes.function
}

export default ThumbnailsView
