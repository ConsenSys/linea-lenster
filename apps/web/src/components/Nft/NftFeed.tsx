import SingleNft from '@components/Nft/SingleNft';
import { CollectionIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { EmptyState } from 'ui';

import type { NftLinea, RawNfts } from '../../types';

interface NftFeedProps {
  profile: Profile;
}

const NftFeed: FC<NftFeedProps> = ({ profile }) => {
  const [nfts, setNfts] = useState<NftLinea[]>([]);

  const getNfts = async () => {
    const response = await axios<RawNfts>({
      url: 'https://api-testnet.nftnest.io/v1/wallet/get_nfts',
      method: 'POST',
      data: {
        address: profile?.ownedBy,
        chain: 'linea_goerli',
        page: 0,
        sort_by: 'minted_newest',
        contract_addresses: '',
        name: ''
      }
    });

    return response.data;
  };

  const { data: rawNfts, isLoading: isGalleryLoading } = useQuery([], () => getNfts().then((res) => res));

  useEffect(() => {
    if (rawNfts) {
      const collections = Object.entries(rawNfts.contracts['59140']).map((entry) => {
        return {
          contract_address: entry[0],
          collection_info: entry[1].collection_info
        };
      });

      const ownedNfts: NftLinea[] = rawNfts.tokens['59140']?.map((nft) => {
        const collection = collections.find((collection) => {
          return collection.contract_address === nft?.contract_address;
        });

        return {
          contractAddress: collection?.contract_address,
          collectionName: collection?.collection_info?.name,
          contractName: collection?.collection_info?.name,
          chainId: 59140,
          tokenId: parseInt(nft.token_id, 16),
          name: nft.token_info?.metadata?.name,
          description: nft.token_info?.metadata?.description,
          originalContent: { uri: nft.token_info?.metadata?.image }
        };
      });

      setNfts(ownedNfts);
    }
  }, [rawNfts]);

  if (nfts?.length === 0) {
    return (
      <EmptyState
        message={
          isGalleryLoading ? (
            <span>
              <Trans>NFTs are loading...</Trans>
            </span>
          ) : (
            <div>
              <span className="mr-1 font-bold">@{formatHandle(profile?.handle)}</span>
              <span>
                <Trans>doesn’t have any NFTs!</Trans>
              </span>
            </div>
          )
        }
        icon={<CollectionIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {nfts?.map((nft) => (
        <div key={`${nft?.chainId}_${nft?.contractAddress}_${nft?.tokenId}`}>
          <SingleNft nft={nft} />
        </div>
      ))}
    </div>
  );
};

export default NftFeed;
