const express = require('express')
const path = require('path')

const api = require('./api')

class AdminServer {
  constructor(platform, config, log) {
    this.platform = platform
    this.config = config
    this.log = log

    this.app = express()
    this.app.use('/api', api(platform, config, log))
    this.app.use('/', express.static(path.join(__dirname, 'static')))
  }

  listen() {
    return new Promise((resolve, reject) => {
      const port = this.config.port || 8181
      const host = this.config.host || '127.0.0.1'

      const server = this.app.listen(port, host, () => {
        resolve(server.address().port)
      }).on('error', e => {
        reject(e)
      })
    })
  }
}

module.exports = AdminServer
