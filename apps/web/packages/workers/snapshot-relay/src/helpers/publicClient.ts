import { createPublicClient, http } from 'viem';
import { lineaTestnet } from 'viem/chains';

/**
 * Create a public client for Polygon and Polygon Mumbai
 * @param isMainnet Is mainnet
 * @returns Public viem client
 */
const publicClient = (isMainnet: boolean): any => {
  return createPublicClient({
    chain: lineaTestnet,
    transport: http()
  });
};

export default publicClient;
