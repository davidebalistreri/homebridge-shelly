/* eslint-env mocha */

const assert = require('assert')

const Homebridge = require('./mocks/homebridge')

const homebridge = new Homebridge()

const BatteryAbility = require('../abilities/battery')(homebridge)
const Categories = require('../util/categories')(homebridge)
const {
  ConsumptionCharacteristic,
} = require('../util/custom-characteristics')(homebridge)

describe('Homebridge 2 compatibility', function() {
  it('should use the top-level HAP Categories export', function() {
    assert.strictEqual(homebridge.hap.Accessory.Categories, undefined)
    assert.strictEqual(Categories, homebridge.hap.Categories)
    assert.strictEqual(Categories.SWITCH, 'SWITCH')
  })

  it('should use the HAP v2 Battery service', function() {
    assert.strictEqual(homebridge.hap.Service.BatteryService, undefined)

    const ability = new BatteryAbility('battery')
    ability.device = {
      battery: 42,
    }

    const service = ability._createService()

    assert.ok(service instanceof homebridge.hap.Service.Battery)
  })

  it('should use HAP v2 paired-read permissions', function() {
    assert.strictEqual(homebridge.hap.Characteristic.Perms, undefined)

    const characteristic = new ConsumptionCharacteristic()

    assert.deepStrictEqual(characteristic.props.perms, [
      homebridge.hap.Perms.PAIRED_READ,
      homebridge.hap.Perms.NOTIFY,
    ])
  })
})
