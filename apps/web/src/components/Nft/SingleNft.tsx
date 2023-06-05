import { IS_RARIBLE_AVAILABLE, RARIBLE_URL, STATIC_IMAGES_URL, ZONIC_URL } from '@lenster/data/constants';
import type { Nft } from '@lenster/lens';
import sanitizeDStorageUrl from '@lenster/lib/sanitizeDStorageUrl';
import { Card } from '@lenster/ui';
import Link from 'next/link';
import type { FC } from 'react';
import { useMemo } from 'react';
import { CHAIN_ID } from 'src/constants';

import type { NftLinea } from '../../types';

interface SingleNftProps {
  nft: Nft | NftLinea;
  linkToDetail?: boolean;
}

const SingleNft: FC<SingleNftProps> = ({ nft, linkToDetail = true }) => {
  const nftUrl = useMemo(() => {
    if (linkToDetail) {
      if (IS_RARIBLE_AVAILABLE) {
        return `${RARIBLE_URL}/token/${nft.chainId === CHAIN_ID ? 'linea/' : ''}${nft.contractAddress}:${
          nft.tokenId
        }`.toLowerCase();
      } else {
        return `${ZONIC_URL}/asset/linea_goerli/${nft.contractAddress}/${nft.tokenId}`.toLowerCase();
      }
    }
  }, [linkToDetail, nft.chainId, nft.tokenId, nft.contractAddress]);

  return (
    <Card>
      <a href={nftUrl} target="_blank" rel="noreferrer noopener">
        <div
          className="divider h-52 sm:h-80 sm:rounded-t-[10px]"
          style={{
            backgroundImage: `url(${sanitizeDStorageUrl(
              nft.originalContent?.uri || `${STATIC_IMAGES_URL}/placeholder.webp`
            )}`,
            backgroundSize: 'contain',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </a>
      <div className="space-y-1 p-5">
        {nft.collectionName && <div className="lt-text-gray-500 truncate text-sm">{nft.collectionName}</div>}
        <div className="truncate">
          <Link className="font-bold" href={nftUrl ?? ''} target="_blank" rel="noreferrer noopener">
            {nft.name ? nft.name : `#${nft.tokenId}`}
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default SingleNft;
