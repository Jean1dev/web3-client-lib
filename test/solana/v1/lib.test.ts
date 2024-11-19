import { genereateSolanaKeyPair } from '../../../src/solana/index'

describe('lib', () => {
    it('should generate a keypair', async() => {
        const keypair = await genereateSolanaKeyPair();
        expect(keypair).toBeDefined();
        expect(keypair.error).toBeFalsy();
        expect(keypair.privKey).toBeDefined();
        expect(keypair.pubKey).toBeDefined();
    });
})