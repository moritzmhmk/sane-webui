import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DeviceList from '../components/DeviceList.jsx'
import Option from '../components/Option.jsx'
import OptionList from '../components/OptionList.jsx'

import * as deviceActions from '../actions/devices'
import * as optionActions from '../actions/options'
import * as scanActions from '../actions/scans'

class App extends Component {
  render () {
    const {
      selectedDevice, devices, deviceActions,
      options, optionsByName, optionsGrouped, optionActions,
      scans, selectedScan, scanActions
    } = this.props
    if (!selectedDevice) {
      return (<DeviceList devices={devices} select={deviceActions.requestOpenDevice} />)
    } else {
      return <div className='row'>
        <div className='col col-1'>
          {Object.values(scans).map(scan => <img src={scan.data} />)}
        </div>
        <div className='col'>
          <img src={selectedScan && `/api/devices/${selectedDevice}/scan.png?id=${selectedScan}`} onLoad={e => {
            console.log(e)
            let img = e.target
            let canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            let dataURL = canvas.toDataURL('image/png')
            console.log(dataURL)
            scanActions.receiveScan(selectedDevice, selectedScan, dataURL)
          }} />
        </div>
        <div className='col col-sm-6 col-md-5 col-lg-4 col-xl-3'>
          <div>
            <h1>Well Known Options</h1>
            {optionsByName.mode && <Option {...options[optionsByName.mode]} setValue={optionActions.setOptionValue} />}
            {optionsByName.depth && <Option {...options[optionsByName.depth]} setValue={optionActions.setOptionValue} />}
            {optionsByName.resolution && <Option {...options[optionsByName.resolution]} setValue={optionActions.setOptionValue} />}
            {optionsByName.source && <Option {...options[optionsByName.source]} setValue={optionActions.setOptionValue} />}
            <button className='btn btn-primary' onClick={scanActions.requestScan}>Scan</button>
          </div>
          <div className='row'>
            <OptionList options={options} optionsByName={optionsByName} optionsGrouped={optionsGrouped} setOptionValue={optionActions.setOptionValue} />
          </div>
        </div>
      </div>
    }
  }
}

App.propTypes = {
  children: PropTypes.node,
  actions: PropTypes.object
}

function mapState (state) {
  return {
    selectedDevice: state.selectedDevice,
    devices: state.devices,
    options: state.options || [],
    optionsByName: state.optionsByName || {},
    optionsGrouped: state.optionsGrouped || [],
    scans: state.scans,
    selectedScan: state.selectedScan
  }
}

function mapDispatch (dispatch) {
  return {
    deviceActions: bindActionCreators(deviceActions, dispatch),
    optionActions: bindActionCreators(optionActions, dispatch),
    scanActions: bindActionCreators(scanActions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(App)
