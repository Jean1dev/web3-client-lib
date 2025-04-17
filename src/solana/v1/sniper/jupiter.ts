import {
  Instruction,
  QuoteResponse,
  ResponseError,
  SwapApi,
} from "@jup-ag/api";
import {
  AddressLookupTableAccount,
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

interface RequestJupiterQuoteInput {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippage: number;
  userPublicKey?: string;
  disableEstimate?: boolean;
  onlyDirectRoutes?: boolean;
  forceFetch?: boolean;
  feeBps?: number;
  referralAddress?: string;
}

export async function getQuote(
  jupiterApi: SwapApi,
  quoteInput: RequestJupiterQuoteInput,
): Promise<QuoteResponse> {
  try {
    const quote: QuoteResponse | null = await jupiterApi.quoteGet(quoteInput);
    if (!quote) {
      throw new Error("No quote found");
    }
    return quote;
  } catch (error) {
    if (error instanceof ResponseError) {
      console.log(await error.response.json());
    } else {
      console.error(error);
    }
    throw new Error("Unable to find quote");
  }
}

function instructionDataToTransactionInstruction(
  instruction: Instruction | undefined,
) {
  if (instruction === null || instruction === undefined) return null;
  return new TransactionInstruction({
    programId: new PublicKey(instruction.programId),
    keys: instruction.accounts.map((key: any) => ({
      pubkey: new PublicKey(key.pubkey),
      isSigner: key.isSigner,
      isWritable: key.isWritable,
    })),
    data: Buffer.from(instruction.data, "base64"),
  });
}

async function getAdressLookupTableAccounts(
  keys: string[],
  connection: Connection,
): Promise<AddressLookupTableAccount[]> {
  const addressLookupTableAccountInfos =
    await connection.getMultipleAccountsInfo(
      keys.map((key) => new PublicKey(key)),
    );

  return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
    const addressLookupTableAddress = keys[index];
    if (accountInfo) {
      const addressLookupTableAccount = new AddressLookupTableAccount({
        key: new PublicKey(addressLookupTableAddress),
        state: AddressLookupTableAccount.deserialize(accountInfo.data),
      });
      acc.push(addressLookupTableAccount);
    }

    return acc;
  }, new Array<AddressLookupTableAccount>());
}

interface JupiterSwapInput {
  jupiterApi: SwapApi;
  route: QuoteResponse;
  wallet: Keypair;
  solanaConnection: Connection;
  postTransactionProcessing?: (quote: QuoteResponse, txid: string) => void;
}

export async function swap(swapInput: JupiterSwapInput): Promise<void> {
  const {
    route,
    jupiterApi,
    wallet,
    solanaConnection,
    postTransactionProcessing = (...args) => {},
  } = swapInput;
  try {
    const {
      computeBudgetInstructions,
      setupInstructions,
      swapInstruction,
      cleanupInstruction,
      addressLookupTableAddresses,
    } = await jupiterApi.swapInstructionsPost({
      swapRequest: {
        quoteResponse: route,
        userPublicKey: wallet.publicKey.toBase58(),
      },
    });

    const instructions: TransactionInstruction[] = [
      ...computeBudgetInstructions.map(instructionDataToTransactionInstruction),
      ...setupInstructions.map(instructionDataToTransactionInstruction),
      instructionDataToTransactionInstruction(swapInstruction),
      instructionDataToTransactionInstruction(cleanupInstruction),
    ].filter((ix) => ix !== null) as TransactionInstruction[];

    const addressLookupTableAccounts = await getAdressLookupTableAccounts(
      addressLookupTableAddresses,
      solanaConnection,
    );

    const { blockhash, lastValidBlockHeight } =
      await solanaConnection.getLatestBlockhash();

    const messageV0 = new TransactionMessage({
      payerKey: wallet.publicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message(addressLookupTableAccounts);

    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([wallet]);

    const rawTransaction = transaction.serialize();
    const txid = await solanaConnection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 2,
    });

    const confirmation = await solanaConnection.confirmTransaction(
      { signature: txid, blockhash, lastValidBlockHeight },
      "confirmed",
    );
    if (confirmation.value.err) {
      throw new Error("Transaction failed");
    }

    postTransactionProcessing(route, txid);
  } catch (error) {
    if (error instanceof ResponseError) {
      console.log(await error.response.json());
    } else {
      console.error(error);
    }
    throw new Error("Unable to execute swap");
  }
}
