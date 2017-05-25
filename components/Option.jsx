import React from 'react'

const Option = props => {
  let advanced = props.cap.indexOf('ADVANCED') >= 0
  let disabled = props.cap.indexOf('INACTIVE') >= 0
  return <div className='form-group' title={props.description} data-advanced={advanced} data-pending={props.valuePending}>
    <label forHtml={props.id}>{props.title} {props.valuePending && <i className='fa fa-refresh fa-spin' />}</label>
    <div className='input-group input-group-sm'>
      <OptionInput {...props} disabled={disabled} />
      { props.type === 'BOOL' && <span className='form-control' style={{width: '100%', textOverflow: 'ellipsis', overflow: 'hidden', display: 'inline-block'}}>{props.title}</span> }
      <Unit type={props.units} className='input-group-addon' />
    </div>
  </div>
}

const OptionInput = props => {
  let setValue = (v) => props.setValue(props.device, props.id, v)

  let input = {
    className: 'form-control',
    id: 'option' + props.id,
    value: props.value,
    disabled: props.disabled,
    readOnly: props.cap.indexOf('SOFT_SELECT') < 0,
    onChange: e => setValue(e.target.value)
  }

  if (props.constraint.type === 'NONE') {
    switch (props.type) {
      case 'BOOL':
        return <span className='input-group-addon'>
          <input {...input} className='checkbox' type='checkbox' checked={props.value === 1} onChange={e => setValue(e.target.checked ? 1 : 0)} />
        </span>
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
    return <select {...input} className='form-control custom-select'>{props.constraint.value.map((v) => <option value={v}>{v} ({props.value})</option>)}</select>
  }
}

const Unit = props => {
  let unit = {
    NONE: null,
    PIXEL: 'px',
    BIT: 'bit',
    MM: 'mm',
    DPI: 'dpi',
    PERCENT: '%',
    MICROSECOND: 'µs'
  }
  return unit[props.type] && <span className={props.className}>{unit[props.type]}</span>
}

export default Option
