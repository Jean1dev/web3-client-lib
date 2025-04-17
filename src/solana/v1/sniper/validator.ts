import { Connection, PublicKey } from "@solana/web3.js";

export async function validateSolanaAddress(
  connection: Connection,
  address: string,
): Promise<boolean> {
  try {
    const mintInfo = await connection.getParsedAccountInfo(
      new PublicKey(address),
    );
    if (!mintInfo.value) return false;

    // Aqui você pode adicionar mais validações como:
    // - verificar freezeAuthority
    // - verificar supply
    // - verificar se tem pool (ver integração com Raydium ou Jupiter)

    return true;
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return false;
  }
}
