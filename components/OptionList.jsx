import React from 'react'
import PropTypes from 'prop-types'

const OptionList = props => {
  console.log(props.optionsGrouped)
  return (<div>
    <p>Options</p>{props.optionsGrouped.map(group =>
      <Group title={group.title} cap={group.cap}>{
        group.members.map(name => <Option
          key={props.options[name].id}
          id={props.options[name].id}
          name={props.options[name].name}
          title={props.options[name].title}
          description={props.options[name].description}
          type={props.options[name].type}
          constraint={props.options[name].constraint}
          cap={props.options[name].cap}
          value={props.options[name].value}
        />)
      }</Group>
    )}</div>)
}

OptionList.propTypes = {
  options: PropTypes.array,
  optionsGrouped: PropTypes.array
}

const Group = props => {
  if (props.cap.indexOf('ADVANCED') >= 0) { return null } // TODO toggle advanced groups
  return <div>
    <h1>{props.title}</h1>
    {props.children}
  </div>
}

const Option = props => {
  if (props.cap.indexOf('ADVANCED') >= 0) { return null } // TODO toggle advanced options
  switch (props.type) {
    case 'BOOL':
    case 'INT':
    case 'FIXED':
    case 'STRING':
      return <div title={props.description}>[{props.id}] {props.title} {
          props.cap.indexOf('SOFT_SELECT') >= 0 && optionInput(props)
        }</div>
    case 'BUTTON':
      return <div title={props.description}>[{props.id}] {
          props.cap.indexOf('SOFT_SELECT') >= 0 && optionInput(props)
        }</div>
    default:
      return null
  }
}

const optionInput = props => {
  let disabled = props.cap.indexOf('INACTIVE') >= 0
  if (props.type === 'BOOL') {
    return <input type='checkbox' checked={props.value === 1} disabled={disabled} />
  }
  if (props.type === 'INT' && props.constraint.type === 'NONE') {
    return <input type='number' value={props.value} step='1' disabled={disabled} />
  }
  if (props.type === 'FIXED' && props.constraint.type === 'NONE') {
    return <input type='number' value={props.value} step='any' disabled={disabled} />
  }
  if (props.type === 'STRING' && props.constraint.type === 'NONE') {
    return <input type='text' value={props.value} disabled={disabled} />
  }
  if (props.constraint.type === 'RANGE') {
    return <input type='number' value={props.value} min={props.constraint.value.min} max={props.constraint.value.max} step={props.constraint.value.quantization} disabled={disabled} />
  }
  if (props.constraint.type === 'WORD_LIST' || props.constraint.type === 'STRING_LIST') {
    console.log(props.value, props.constraint.value)
    return <select value={props.value} disabled={disabled}>{props.constraint.value.map((v) => <option value={v}>{v} ({props.value})</option>)}</select>
  }
  if (props.type === 'BUTTON') {
    return <input type='button' value={props.title} disabled={disabled} />
  }
}

export default OptionList
