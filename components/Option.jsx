import React from 'react'

const Option = props => {
  let advanced = props.cap.indexOf('ADVANCED') >= 0
  return <div title={props.description} data-advanced={advanced} data-pending={props.valuePending}>
    [{props.id}] {props.title}
    <OptionInput {...props} />
  </div>
}

const OptionInput = props => {
  let setValue = (v) => props.setValue(props.device, props.id, v)

  let input = {
    value: props.value,
    disabled: props.cap.indexOf('INACTIVE') >= 0,
    readOnly: props.cap.indexOf('SOFT_SELECT') < 0,
    onChange: e => setValue(e.target.value)
  }

  if (props.constraint.type === 'NONE') {
    switch (props.type) {
      case 'BOOL':
        return <input {...input} type='checkbox' checked={props.value === 1} onChange={e => setValue(e.target.checked ? 1 : 0)} />
      case 'INT':
        return <input {...input} type='number' step='1' />
      case 'FIXED':
        return <input {...input} type='number' step='any' />
      case 'STRING':
        return <input {...input} type='text' />
      case 'BUTTON':
        return <input type='button' value={props.title} disabled={input.disabled} /> // TODO
      default:
        return null
    }
  }
  if (props.constraint.type === 'RANGE') {
    return <input {...input} type='number' min={props.constraint.value.min} max={props.constraint.value.max} step={props.constraint.value.quantization} />
  }
  if (props.constraint.type === 'WORD_LIST' || props.constraint.type === 'STRING_LIST') {
    return <select {...input}>{props.constraint.value.map((v) => <option value={v}>{v} ({props.value})</option>)}</select>
  }
}

export default Option
