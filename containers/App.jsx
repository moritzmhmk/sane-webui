import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DeviceList from '../components/DeviceList.jsx'
import Option from '../components/Option.jsx'
import OptionList from '../components/OptionList.jsx'

import * as deviceActions from '../actions/devices'
import * as optionActions from '../actions/options'

class App extends Component {
  render () {
    const { selectedDevice, devices, deviceActions, options, optionsByName, optionsGrouped, optionActions } = this.props
    if (!selectedDevice) {
      return (<DeviceList devices={devices} select={deviceActions.requestOpenDevice} />)
    } else {
      return <div>
        <p>
          <h1>Well Known Options</h1>
          {optionsByName.mode && <Option {...options[optionsByName.mode]} setValue={optionActions.setOptionValue} />}
          {optionsByName.depth && <Option {...options[optionsByName.depth]} setValue={optionActions.setOptionValue} />}
          {optionsByName.resolution && <Option {...options[optionsByName.resolution]} setValue={optionActions.setOptionValue} />}
          {optionsByName.source && <Option {...options[optionsByName.source]} setValue={optionActions.setOptionValue} />}
        </p>
        <p>
          <OptionList options={options} optionsByName={optionsByName} optionsGrouped={optionsGrouped} setOptionValue={optionActions.setOptionValue} />
        </p>
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
    optionsGrouped: state.optionsGrouped || []
  }
}

function mapDispatch (dispatch) {
  return {
    deviceActions: bindActionCreators(deviceActions, dispatch),
    optionActions: bindActionCreators(optionActions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(App)
