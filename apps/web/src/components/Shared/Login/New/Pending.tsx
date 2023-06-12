import { ArrowRightIcon } from '@heroicons/react/outline';
import { Errors } from '@lenster/data';
import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useHasTxHashBeenIndexedQuery,
  useUserProfilesQuery
} from '@lenster/lens';
import { Button, Spinner } from '@lenster/ui';
import errorToast from '@lib/errorToast';
import { Trans } from '@lingui/macro';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useAccount, useSignMessage } from 'wagmi';

import { useGlobalModalStateStore } from '../../../../store/modals';

interface PendingProps {
  handle: string;
  txHash: string;
}

const Pending: FC<PendingProps> = ({ handle, txHash }) => {
  const setShowAuthModal = useGlobalModalStateStore((state) => state.setShowAuthModal);
  const { data, loading } = useHasTxHashBeenIndexedQuery({
    variables: { request: { txHash } },
    pollInterval: 1000
  });
  const { push } = useRouter();
  const [authenticate] = useAuthenticateMutation();
  const { address } = useAccount();

  //get profiles with the address
  const { data: userProfilesData } = useUserProfilesQuery({
    variables: { ownedBy: address },
    pollInterval: 1000
  });

  const [loadChallenge] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  });
  const onError = (error: any) => {
    errorToast(error);
  };
  const { signMessageAsync } = useSignMessage({ onError });
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const handleSign = async () => {
    let keepModal = false;
    try {
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request: { address } }
      });
      if (!challenge?.data?.challenge?.text) {
        return toast.error(Errors.SomethingWentWrong);
      }
      // Get signature
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      });
      // Auth user and set cookies
      const auth = await authenticate({
        variables: { request: { address, signature } }
      });

      localStorage.setItem('accessToken', auth.data?.authenticate.accessToken);
      localStorage.setItem('refreshToken', auth.data?.authenticate.refreshToken);

      // Get authed profiles
      if (!userProfilesData?.profiles?.items?.length) {
        keepModal = true;
        console.error('No profiles with this address');
      } else {
        const profiles: any = userProfilesData?.profiles?.items
          ?.slice()
          ?.sort((a, b) => Number(a.id) - Number(b.id))
          ?.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));

        const currentProfile = profiles[0];
        setProfiles(profiles);
        setCurrentProfile(currentProfile);
        setProfileId(currentProfile.id);
        keepModal = false;
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      if (!keepModal) {
        setShowAuthModal(false);
      }
      push(`/u/${handle}`);
    }
  };

  return (
    <div className="p-5 text-center font-bold">
      {loading ||
      (data?.hasTxHashBeenIndexed.__typename === 'TransactionIndexedResult' &&
        !data?.hasTxHashBeenIndexed.indexed) ? (
        <div className="space-y-3 text-white font-medium">
          <Spinner className="mx-auto" />
          <div>
            <Trans>Account creation in progress, please wait!</Trans>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-white font-medium">
          <div className="text-[40px]">🌿</div>
          <div>Account created successfully</div>
          <div className="pt-3">
            <Button
              className="mx-auto"
              icon={<ArrowRightIcon className="mr-1 h-4 w-4" />}
              onClick={handleSign}
            >
              <Trans>Go to profile</Trans>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pending;
