import assert from 'assert';
import fs from 'fs/promises';
import path from 'path';
import { generateKeyPair } from 'jose/util/generate_key_pair';
import common from '../../lib/common';

const fixturesDir = path.resolve(__dirname, '..', 'fixtures');
const keysDir = path.join(fixturesDir, 'keys');
const privateKeyFile = path.join(keysDir, 'privateKey.pem');

describe('lib/common', () => {
  describe('#exportPrivateKey()', () => {
    beforeEach(async () => {
      this.keyPair = await generateKeyPair(common.CERTIFICATE_KEY_ALGORITHM)
    })

    it('exports private key for certificate', async () => {
      const privateKeyData = common.exportPrivateKey(this.keyPair.privateKey)

      assert.strictEqual(typeof privateKeyData, 'string')
      assert(privateKeyData.startsWith('-----BEGIN PRIVATE KEY-----\n'))
      assert(privateKeyData.endsWith('-----END PRIVATE KEY-----\n'))
    })
  })

  describe('#writeKeyToFile()', () => {
    before(async () => {
      await fs.promises.mkdir(keysDir)
    })

    after(async () => {
      await fs.promises.rmdir(keysDir, { recursive: true })
    })

    beforeEach(async () => {
      this.keyPair = await generateKeyPair(common.CERTIFICATE_KEY_ALGORITHM)
    })

    it('writes privateKey and privateKeyData to filesystem', async () => {
      const privateKey = this.keyPair.privateKey
      const privateKeyData = common.exportPrivateKey(privateKey)

      await common.writeKeyToFile(privateKeyFile, privateKeyData)
      const privateKeyData1 = await fs.promises.readFile(privateKeyFile, 'utf8')
      const privateKey1 = common.importPrivateKey(privateKeyData1)

      await common.writeKeyToFile(privateKeyFile, privateKey, 'foobar')
      const privateKeyData2 = await fs.promises.readFile(privateKeyFile, 'utf8')
      const privateKey2 = common.importPrivateKey(privateKeyData2, 'foobar')

      assert.deepStrictEqual(privateKey1, privateKey2)
    })
  })
})
