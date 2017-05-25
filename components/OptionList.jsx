import React from 'react'
import PropTypes from 'prop-types'

import Option from './Option.jsx'

const OptionList = props => {
  return (<div>
    <h1>OptionList</h1>{props.optionsGrouped.map(group =>
      <Group key={group.id} title={group.title} cap={group.cap}>{
        group.members.map(id => <Option {...props.options[id]} setValue={props.setOptionValue} />)
      }</Group>
    )}</div>)
}

OptionList.propTypes = {
  options: PropTypes.array,
  optionsGrouped: PropTypes.array
}

const Group = props => {
  let advanced = props.cap.indexOf('ADVANCED') >= 0
  return <div className='card' data-advanced={advanced} style={{marginBottom: '10px'}}>
    <h3 className='card-header'>{props.title}</h3>
    <div className='card-block'>
      {props.children}
    </div>
  </div>
}

export default OptionList
