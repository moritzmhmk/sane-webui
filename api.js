const net = require('net')
const express = require('express')
const bodyParser = require('body-parser')
const sane = require('../node-sane-net')
const PNGTransform = require('../node-sane-net/example/png-transform')

var api = express.Router()

let handles = {}
let authorization = {}
let saneClient = new sane.Socket()
saneClient.on('authorize', (backend, callback) => {
  let {name, pw} = authorization[backend] || {name: '', pw: ''}
  console.log(`backend "${backend}" requires authorization using pw provided for user "${name}"`)
  callback(name, pw)
})
saneClient.connect(6566, '127.0.0.1').then(() => saneClient.init())

api.use(bodyParser.json())

api.get('/devices', function (req, res) {
  saneClient.getDevices()
  .then(data => res.json(data))
  .catch(err => res.json({reason: err}))
})

api.get('/devices/:name', function (req, res) {
  saneClient.getDevices()
  .then(devices => {
    let device = devices.find(_ => _.name === req.params.name)
    if (device === undefined) { res.status(400).json({reason: 'device not found'}) }
    res.json(device)
  })
  .catch(err => res.status(500).json({reason: err}))
})

api.get('/devices/:name/authorization', function (req, res) {
  let backend = req.params.name.split(':')[0]
  res.json({authorization: authorization[backend] !== undefined})
})

api.put('/devices/:name/authorization', function (req, res) {
  let backend = req.params.name.split(':')[0]
  authorization[backend] = {name: req.body.name, pw: req.body.pw}
  console.log(backend, authorization[backend])
  res.json({authorization: true})
})

api.get('/devices/:name/open', function (req, res) {
  res.json({open: handles[req.params.name] !== undefined})
})

api.put('/devices/:name/open', function (req, res) { // TODO put true or false (open/close)
  if (handles[req.params.name] !== undefined) {
    res.json({open: true})
    return
  }
  saneClient.open(req.params.name)
  .then((handle) => {
    handles[req.params.name] = handle
    res.json({open: true})
  })
  .catch(err => res.status(500).json({reason: err}))
})

api.get('/devices/:name/options', function (req, res) {
  saneClient.getOptionDescriptors(handles[req.params.name])
  .then(options => {
    res.json(options)
  })
  .catch(err => res.status(500).json({reason: err}))
})

api.get('/devices/:name/options/:id', function (req, res) {
  saneClient.getOption(handles[req.params.name], req.params.id)
  .then(data => {
    res.json(data)
  })
  .catch(err => res.status(500).json({reason: err}))
})

api.put('/devices/:name/options/:id', function (req, res) {
  saneClient.setOption(handles[req.params.name], req.params.id, req.body.value)
  .then(data => {
    res.json(data)
  })
  .catch(err => res.status(500).json({reason: err}))
})

api.get('/devices/:name/parameters', function (req, res) {
  saneClient.getParameters(handles[req.params.name])
  .then(parameters => {
    res.json(parameters)
  })
  .catch(err => res.status(500).json({reason: err}))
})

api.get('/devices/:name/scan.png', function (req, res) {
  saneClient.getParameters(handles[req.params.name])
  .then(({pixelsPerLine, lines, depth, format}) => {
    return saneClient.start(handles[req.params.name])
    .then(({port, byteOrder}) => {
      var saneTransform = new sane.ImageTransform()
      var pngTransform = new PNGTransform(pixelsPerLine, lines, depth, format)
      var dataSocket = new net.Socket()
      dataSocket.pipe(saneTransform).pipe(pngTransform).pipe(res)
      dataSocket.on('error', (err) => { console.log(err) }) // TODO
      dataSocket.connect(port, '127.0.0.1')
    })
  })
  .catch(err => res.status(500).json({reason: err}))
})

api.get('/*', function (req, res) {
  res.status(404).json({'reason': 'command not found'})
})

module.exports = api
