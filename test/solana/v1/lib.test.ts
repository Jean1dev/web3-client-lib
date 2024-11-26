import { genereateSolanaKeyPair, requestAirDrop } from "../../../src/solana/index";

describe("lib", () => {
  it("should generate a keypair", async () => {
    const keypair = await genereateSolanaKeyPair();
    expect(keypair).toBeDefined();
    expect(keypair.error).toBeFalsy();
    expect(keypair.privKey).toBeDefined();
    expect(keypair.pubKey).toBeDefined();
  });

  it("shoud be request a airdrop", async () => {
    const response = await requestAirDrop({
      sols: 2
    })

    expect(response.error).toBeTruthy()
  })
});
