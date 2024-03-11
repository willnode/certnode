import assert from 'assert';
import { install as installFakeTimers } from '@sinonjs/fake-timers';
import request from '../../lib/request';

describe('lib/request', () => {
  beforeEach(() => {
    this.clock = installFakeTimers();
  })

  afterEach(() => {
    this.clock.uninstall()
  })

  it('times out', async () => {
    try {
      await request('https://some.where', { method: 'POST' }, () => {
        this.clock.tick(10e3)
      })

      assert.fail('Should reject')
    } catch ({ message }) {
      assert.strictEqual(message, 'POST request to "https://some.where/" timed out')
    }
  })
})
