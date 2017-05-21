import React from 'react'
import PropTypes from 'prop-types'

const mapOption = (options, id, setOptionValue) => <Option
  key={options[id].id}
  id={options[id].id}
  name={options[id].name}
  title={options[id].title}
  description={options[id].description}
  type={options[id].type}
  constraint={options[id].constraint}
  cap={options[id].cap}
  value={options[id].value}
  valuePending={options[id].valuePending}
  setValue={v => setOptionValue(options[id].device, id, v)}
/>

const OptionList = props => {
  return (<div>
    <p>
      Well Known Options
      {props.optionsByName.resolution && mapOption(props.options, props.optionsByName.resolution)}
    </p>
    <p>Options</p>{props.optionsGrouped.map(group =>
      <Group title={group.title} cap={group.cap}>{
        group.members.map(id => mapOption(props.options, id, props.setOptionValue))
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
  return <div title={props.description}>
    [{props.id}]
    {props.title}
    {props.valuePending && '{PENDING}'}
    {props.cap.indexOf('SOFT_SELECT') >= 0 && optionInput(props)}
  </div>
}

const optionInput = props => {
  let disabled = props.cap.indexOf('INACTIVE') >= 0
  if (props.type === 'BOOL') {
    return <input type='checkbox' checked={props.value === 1} disabled={disabled} onChange={e => props.setValue(e.target.checked ? 1 : 0)} />
  }
  if (props.type === 'INT' && props.constraint.type === 'NONE') {
    return <input type='number' value={props.value} step='1' disabled={disabled} onChange={e => props.setValue(e.target.value)} />
  }
  if (props.type === 'FIXED' && props.constraint.type === 'NONE') {
    return <input type='number' value={props.value} step='any' disabled={disabled} onChange={e => props.setValue(e.target.value)} />
  }
  if (props.type === 'STRING' && props.constraint.type === 'NONE') {
    return <input type='text' value={props.value} disabled={disabled} onChange={e => props.setValue(e.target.value)} />
  }
  if (props.constraint.type === 'RANGE') {
    return <input type='number' value={props.value} min={props.constraint.value.min} max={props.constraint.value.max} step={props.constraint.value.quantization} disabled={disabled} onChange={e => props.setValue(e.target.value)} />
  }
  if (props.constraint.type === 'WORD_LIST' || props.constraint.type === 'STRING_LIST') {
    return <select value={props.value} disabled={disabled} onChange={e => props.setValue(e.target.value)}>{props.constraint.value.map((v) => <option value={v}>{v} ({props.value})</option>)}</select>
  }
  if (props.type === 'BUTTON') {
    return <input type='button' value={props.title} disabled={disabled} /> // TODO
  }
}

export default OptionList
