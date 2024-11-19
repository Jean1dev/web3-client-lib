import axios, { AxiosRequestConfig } from "axios";

const baseUrl = 'https://web3-dapplication-0703ff8b748e.herokuapp.com'

interface SolanaV1Response {
    error: boolean;
    errorDetails?: {
        message: string;
        code: number;
    }
    pubKey?: string;
    privKey?: string;
}

export async function genereateSolanaKeyPair(): Promise<SolanaV1Response> {
    try {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: `${baseUrl}/wallet/new-wallet`,
            headers: { 
                'Content-Type': 'application/json',
                'User-Agent': 'web3-client-lib'
            },
            timeout: 10000
        };
        const response = await axios(config)
        if (response.status === 200) {
          return {
            error: false,
            pubKey: response.data.publicKey,
            privKey: response.data.secretKey
          }
        }

        return {
            error: true,
            errorDetails: {
                message: 'Failed to generate key pair',
                code: response.status
            }
        }
    } catch (error) {
        return {
            error: true,
            errorDetails: {
                message: 'Failed to generate key pair',
                code: 500
            }
        }
    }
}