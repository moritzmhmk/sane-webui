import React from 'react'
import { render } from 'react-dom'
import configureStore from './store/configureStore'
import Root from './containers/Root.jsx'

import {fetchDevices} from './actions/devices'

const store = configureStore()

store.dispatch(fetchDevices())

render(
  <Root store={store} />,
  document.getElementById('root')
)
