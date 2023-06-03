import ChooseFile from '@components/Shared/ChooseFile';
import useSimpleDebounce from '@components/utils/hooks/useSimpleDebounce';
import { PlusIcon } from '@heroicons/react/outline';
import { Regex } from '@lenster/data';
import uploadToIPFS from '@lib/uploadToIPFS';
import {
  Button,
  ErrorMessage,
  Form,
  Input,
  Spinner,
  useZodForm
} from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import {
  APP_NAME,
  IS_RELAYER_AVAILABLE,
  LENS_PROFILE_CREATOR,
  LENS_PROFILE_CREATOR_ABI,
  ZERO_ADDRESS
} from 'data/constants';
import { useCreateProfileMutation } from 'lens';
import getStampFyiURL from 'lib/getStampFyiURL';
import type { ChangeEvent, FC } from 'react';
import React, { useEffect, useState } from 'react';
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi';
import { object, string } from 'zod';

import Pending from './Pending';

const newUserSchema = object({
  handle: string()
    .min(5, { message: t`Handle should be at least 5 characters` })
    .max(26, { message: t`Handle should not exceed 26 characters` })
    .regex(Regex.handle, {
      message: t`Handle should only contain lowercase alphanumeric characters`
    })
});

interface NewProfileProps {
  isModal?: boolean;
}

const NewProfile: FC<NewProfileProps> = ({ isModal = false }) => {
  const { address, isConnected } = useAccount();

  const [handle, setHandle] = useState('');
  const [avatar, setAvatar] = useState(getStampFyiURL(address ?? ZERO_ADDRESS));
  const [uploading, setUploading] = useState(false);
  const [createProfile, { data }] = useCreateProfileMutation();
  const [isCreationLoading, setIsCreationLoading] = useState(false);

  const debouncedHandle = useSimpleDebounce(handle);

  const form = useZodForm({
    schema: newUserSchema
  });

  const { config } = usePrepareContractWrite({
    address: LENS_PROFILE_CREATOR,
    abi: LENS_PROFILE_CREATOR_ABI,
    functionName: 'proxyCreateProfile',
    args: [
      {
        to: address,
        handle: debouncedHandle,
        imageURI: avatar,
        followModule: ZERO_ADDRESS,
        followModuleInitData: '0x',
        followNFTURI: ''
      }
    ],
    enabled: Boolean(debouncedHandle)
  });
  const { data: txData, write } = useContractWrite(config);

  const { isLoading, error } = useWaitForTransaction({
    hash: txData?.hash
  });

  /*const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
                                                                          event.preventDefault();
                                                                          if (event.target.files?.length) {
                                                                          try {
                                                                            setUploading(true);
        const attachment = await uploadFileToIPFS(event.target.files[0]);
                                                                            if (attachment.original.url) {
                                                                              setAvatar(attachment.original.url);
                                                                            }
                                                                          } finally {
                                                                            setUploading(false);
                                                                          }}
  };

  const relayErrorToString = (error: RelayErrorReasons): string => {
    return error === RelayErrorReasons.HandleTaken
      ? t`The selected handle is already taken`
      : error;
                                                                        };*/

  const handleCreateProfile = async () => {
    write?.();
  };

  useEffect(() => {
    setIsCreationLoading(
      IS_RELAYER_AVAILABLE ? data?.createProfile.__typename === 'RelayerResult' : !!txData?.hash
    );
  }, [data, txData]);

  return isCreationLoading ? (
    <Pending
      handle={form.getValues('handle')}
      txHash={
        IS_RELAYER_AVAILABLE && data?.createProfile.__typename === 'RelayerResult'
          ? data?.createProfile?.txHash
          : txData?.hash
      }
    />
  ) : (
    <Form
      form={form}
      className="space-y-4"
      onSubmit={({ handle }) => {
        if (IS_RELAYER_AVAILABLE) {
          const username = handle.toLowerCase();
          createProfile({
            variables: {
              request: {
                handle: username,
                profilePictureUri: avatar || getStampFyiURL(address ?? ZERO_ADDRESS)
              }
            }
          });
        } else {
          handleCreateProfile();
        }
      }}
    >
      {data?.createProfile.__typename === 'RelayError' && (data?.createProfile.reason || error) && (
        <ErrorMessage
          className="mb-3"
          title="Create profile failed!"
          error={{
            name: 'Create profile failed!',
            message: IS_RELAYER_AVAILABLE ? data?.createProfile?.reason : error?.message || ''
          }}
        />
      )}
      {isModal && (
        <div className="mb-2 space-y-4">
          <img
            className="h-10 w-10"
            height={40}
            width={40}
            src="/logo.svg"
            alt="Logo"
          />
          <div className="text-xl font-bold">
            <Trans>Sign up to {APP_NAME}</Trans>
          </div>
        </div>
      )}
      <Input
        label={t`Handle`}
        type="text"
        placeholder="gavin"
        {...form.register('handle', {
          onChange: (e) => setHandle(e.target.value)
        })}
      />
      <div className="space-y-1.5">
        <div className="label">Avatar</div>
        <div className="space-y-3">
          {avatar && (
            <div>
              <img
                className="h-60 w-60 rounded-lg"
                height={240}
                width={240}
                src={avatar}
                alt={avatar}
              />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-3">
              <ChooseFile
                onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                  handleUpload(evt)
                }
              />
              {uploading && <Spinner size="sm" />}
            </div>
          </div>
        </div>
      </div>
      <Button
        className="ml-auto"
        type="submit"
        disabled={isLoading || !isConnected}
        icon={
          isLoading ? <Spinner size="xs" /> : <PlusIcon className="h-4 w-4" />
        }
      >
        <Trans>{isConnected ? 'Sign up' : 'Connect your wallet'}</Trans>
      </Button>
    </Form>
  );
};

export default NewProfile;
