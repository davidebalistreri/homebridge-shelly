/* eslint-env mocha */

const assert = require('assert')
const sinon = require('sinon')

const AdminServer = require('../admin')
const log = require('./mocks/log')

describe('AdminServer', function() {
  afterEach(function() {
    sinon.restore()
  })

  it('should bind to localhost by default', async function() {
    const admin = new AdminServer({}, {}, log)

    const fakeServer = {
      address: () => ({ port: 8181 }),
      on: function() {
        return this
      },
    }

    const listen = sinon.stub(admin.app, 'listen')
      .callsFake((port, host, callback) => {
        process.nextTick(callback)
        return fakeServer
      })

    const port = await admin.listen()

    assert.strictEqual(port, 8181)
    assert.strictEqual(listen.firstCall.args[0], 8181)
    assert.strictEqual(listen.firstCall.args[1], '127.0.0.1')
  })

  it('should allow an explicit bind address', async function() {
    const admin = new AdminServer({}, {
      host: '0.0.0.0',
      port: 9191,
    }, log)

    const fakeServer = {
      address: () => ({ port: 9191 }),
      on: function() {
        return this
      },
    }

    const listen = sinon.stub(admin.app, 'listen')
      .callsFake((port, host, callback) => {
        process.nextTick(callback)
        return fakeServer
      })

    const port = await admin.listen()

    assert.strictEqual(port, 9191)
    assert.strictEqual(listen.firstCall.args[0], 9191)
    assert.strictEqual(listen.firstCall.args[1], '0.0.0.0')
  })
})
