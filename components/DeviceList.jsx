import React from 'react'
import PropTypes from 'prop-types'

const DeviceList = props => {
  return (<div>
    <p>Devices</p>
    {props.devices.map(
      device => <Device
        key={device.name}
        name={device.name}
        vendor={device.vendor}
        model={device.model}
        type={device.type}
        handleClick={() => props.select(device.name)} />
    )}
  </div>)
}

DeviceList.propTypes = {
  devices: PropTypes.array,
  select: PropTypes.func
}

const Device = props => {
  return (<div onClick={props.handleClick}>{props.vendor} {props.model} ({props.type}) [{props.name}]</div>)
}

export default DeviceList
