import React, { Component } from 'react'
import PropTypes from 'prop-types'

const ScanView = props => {
  let {selectedDevice, scans, selectedScan, receiveScan, addRegion, updateRegion} = props
  let src
  let regions = []
  if (selectedScan) {
    console.log(selectedScan, scans[selectedScan].image)
    src = scans[selectedScan] && scans[selectedScan].image && scans[selectedScan].image.data ||
          `/api/devices/${selectedDevice}/scan.png?id=${selectedScan}`
    regions = scans[selectedScan] && scans[selectedScan].regions && scans[selectedScan].regions.map(
      (region, i) => <Region
        key={i}
        x={region.position.x}
        y={region.position.y}
        w={region.dimension.x}
        h={region.dimension.y}
        r={region.rotation}
        update={data => updateRegion(selectedDevice, selectedScan, i, data)}
      />
    )
  }
  return (<div id='scan' style={{height: '100vh', overflow: 'hidden', textAlign: 'center', lineHeight: '100vh'}} onDoubleClick={e => { addRegion(selectedDevice, selectedScan) }}>
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
        receiveScan(selectedDevice, selectedScan, {data: dataURL, width: img.width, height: img.width})
      }}
      style={{maxWidth: '100%', maxHeight: '100vh', verticalAlign: 'center'}} />
    {regions}
  </div>)
}

ScanView.propTypes = {
  selectedDevice: PropTypes.string,
  selectedScan: PropTypes.number,
  scanActions: PropTypes.function
}

class Region extends Component {
  constructor (props) {
    super(props)
    this.state = {mode: 'resize'}
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.dragStart && !prevState.dragStart) {
      document.addEventListener('mousemove', this.drag.bind(this))
      document.addEventListener('mouseup', this.dragEnd.bind(this))
    }
    if (!this.state.dragStart && prevState.dragStart) {
      document.removeEventListener('mousemove', this.drag.bind(this))
      document.removeEventListener('mouseup', this.dragEnd.bind(this))
    }

    if (this.state.cornerStart && !prevState.cornerStart) {
      document.addEventListener('mousemove', this.cornerMove.bind(this))
      document.addEventListener('mouseup', this.cornerEnd.bind(this))
    }
    if (!this.state.cornerStart && prevState.cornerStart) {
      document.removeEventListener('mousemove', this.cornerMove.bind(this))
      document.removeEventListener('mouseup', this.cornerEnd.bind(this))
    }
  }
  dragStart (e) {
    this.setState({dragStart: {x: e.clientX, y: e.clientY}})
    this.setState({position: {x: this.props.x, y: this.props.y}})
    e.preventDefault()
    e.stopPropagation()
  }
  drag (e) {
    if (!this.state.dragStart) { return }
    let x = this.props.x + e.clientX - this.state.dragStart.x
    let y = this.props.y + e.clientY - this.state.dragStart.y
    this.setState({position: {x: x, y: y}})
    e.preventDefault()
    e.stopPropagation()
  }
  dragEnd (e) {
    if (this.state.position && (this.state.position.x !== this.props.x || this.state.position.y !== this.props.y)) {
      this.props.update({position: this.state.position})
    }
    this.setState({dragStart: undefined, position: undefined})
    e.preventDefault()
    e.stopPropagation()
  }
  switchMode (e) {
    this.setState({mode: this.state.mode === 'resize' ? 'rotate' : 'resize'})
    e.preventDefault()
    e.stopPropagation()
  }

  cornerStart (corner, e) {
    this.setState({
      cornerStart: {x: e.clientX, y: e.clientY},
      activeCorner: corner,
      position: {x: this.props.x, y: this.props.y},
      dimension: {x: this.props.w, y: this.props.h},
      rotation: this.props.r
    })
    e.preventDefault()
    e.stopPropagation()
  }
  cornerMove (e) {
    if (!this.state.cornerStart) { return }
    let m = {x: e.clientX - this.state.cornerStart.x, y: e.clientY - this.state.cornerStart.y}
    const rad = -this.props.r * (Math.PI / 180)
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)
    m = {x: m.x * cos - m.y * sin, y: m.x * sin + m.y * cos} // rotate mouse movement relative to rectangle
    if (this.state.mode === 'resize') {
      let w = this.props.w
      let h = this.props.h
      let dx = 0
      let dy = 0
      if (this.state.activeCorner.top) { h = Math.max(this.props.h - m.y, 0); dy = -(h - this.props.h) / 2 }
      if (this.state.activeCorner.bottom) { h = Math.max(this.props.h + m.y, 0); dy = (h - this.props.h) / 2 }
      if (this.state.activeCorner.left) { w = Math.max(this.props.w - m.x, 0); dx = -(w - this.props.w) / 2 }
      if (this.state.activeCorner.right) { w = Math.max(this.props.w + m.x, 0); dx = (w - this.props.w) / 2 }
      const x = this.props.x + dx * cos - dy * (-sin) // calculate new center position
      const y = this.props.y + dx * (-sin) + dy * cos // relative to rectangle rotation
      this.setState({position: {x: x, y: y}, dimension: {x: w, y: h}})
    } else {
      const corner = {
        x: this.state.activeCorner.left && -this.props.w / 2 || this.state.activeCorner.right && this.props.w / 2 || 0,
        y: this.state.activeCorner.top && -this.props.h / 2 || this.state.activeCorner.bottom && this.props.h / 2 || 0
      }
      const r = (Math.atan2(corner.y + m.y, corner.x + m.x) - Math.atan2(corner.y, corner.x)) * (180 / Math.PI)
      console.log(corner, r)
      this.setState({rotation: this.props.r + r})
    }
    e.preventDefault()
    e.stopPropagation()
  }
  cornerEnd (e) {
    if (this.state.position && (this.state.position.x !== this.props.x || this.state.position.y !== this.props.y) ||
        this.state.dimension && (this.state.dimension.x !== this.props.w || this.state.dimension.y !== this.props.h) ||
        this.state.rotation
    ) {
      this.props.update({position: this.state.position, dimension: this.state.dimension, rotation: this.state.rotation})
    }
    this.setState({cornerStart: undefined, activeCorner: undefined, position: undefined, dimension: undefined, rotation: undefined})
    e.preventDefault()
    e.stopPropagation()
  }

  render () {
    let x = this.state.position ? this.state.position.x : this.props.x
    let y = this.state.position ? this.state.position.y : this.props.y
    let w = this.state.dimension ? this.state.dimension.x : this.props.w
    let h = this.state.dimension ? this.state.dimension.y : this.props.h
    let r = this.state.rotation ? this.state.rotation : this.props.r
    return <div
      className='region'
      data-dragged={this.state.dragged}
      data-mode={this.state.mode}
      style={{top: y - h / 2, left: x - w / 2, width: w, height: h, transform: `rotate(${r}deg)`}}
      ref={ref => { this.ref = ref }}
      onMouseDown={this.dragStart.bind(this)}
      onDoubleClick={this.switchMode.bind(this)}
    >
      <div className='corner t l' onMouseDown={this.cornerStart.bind(this, {top: true, left: true})} />
      <div className='corner t' onMouseDown={this.cornerStart.bind(this, {top: true})} />
      <div className='corner t r' onMouseDown={this.cornerStart.bind(this, {top: true, right: true})} />
      <div className='corner r' onMouseDown={this.cornerStart.bind(this, {right: true})} />
      <div className='corner b r' onMouseDown={this.cornerStart.bind(this, {bottom: true, right: true})} />
      <div className='corner b' onMouseDown={this.cornerStart.bind(this, {bottom: true})} />
      <div className='corner b l' onMouseDown={this.cornerStart.bind(this, {bottom: true, left: true})} />
      <div className='corner l' onMouseDown={this.cornerStart.bind(this, {left: true})} />

    </div>
  }
}

export default ScanView
