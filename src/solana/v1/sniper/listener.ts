import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const TOKEN_PROGRAM = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
);

export async function listenerTokenChanges(callback: Function) {
  const connection = new Connection(clusterApiUrl("devnet"));

  connection.onProgramAccountChange(
    TOKEN_PROGRAM,
    (keyedAccountInfo) => {
      const mint = keyedAccountInfo.accountId.toBase58();
      console.log("🎯 Novo token detectado:", mint);

      callback(connection, mint);
    },
    {
      commitment: "confirmed",
    },
  );
}
