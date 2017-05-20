const express = require('express')
const webpack = require('webpack')
const config = require('./webpack.config')
const webpackDevMiddleware = require('webpack-dev-middleware')

let app = express()
let compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {colors: true}
}))

app.use(express.static(`${__dirname}/static`))

var api = require('./api')
app.use('/api', api)

app.get('/*', (req, res) => res.sendFile(`${__dirname}/static/index.html`))

let server = app.listen(8080, () => {
  let host = server.address().address
  let port = server.address().port
  console.log(`sane-webui running on http://${host}:${port}`)
})
