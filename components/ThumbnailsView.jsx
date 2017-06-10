import React from 'react'
import PropTypes from 'prop-types'

const ThumbnailsView = props => {
  let {scans, select} = props
  return (<div id='thumbnails'>
    {Object.keys(scans).map(
      id => <div>
        <img key={id} className='scan' src={scans[id].image && scans[id].image.data} onClick={() => select(id)} />
        {scans[id].regions && scans[id].regions.map(
          (region, i) => <img className='region' src={region.image} onClick={() => select(id, i)} />
        )}
      </div>)}
    <div className='add' onClick={() => select(null)} />
  </div>)
}

ThumbnailsView.propTypes = {
  selectedDevice: PropTypes.string,
  selectedScan: PropTypes.number,
  scanActions: PropTypes.function
}

export default ThumbnailsView
