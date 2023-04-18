import useSimpleDebounce from '@components/utils/hooks/useSimpleDebounce';
import { PlusIcon } from '@heroicons/react/outline';
import { Regex } from '@lenster/data';
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
  LENS_PROFILE_CREATOR,
  LENS_PROFILE_CREATOR_ABI,
  ZERO_ADDRESS
} from 'data/constants';
import getStampFyiURL from 'lib/getStampFyiURL';
import type { FC } from 'react';
import React, { useState } from 'react';
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi';
import { object, string } from 'zod';

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
  //const [uploading, setUploading] = useState(false);

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
        followModule: '0x0000000000000000000000000000000000000000',
        followModuleInitData: '0x',
        followNFTURI: ''
      }
    ],
    enabled: Boolean(debouncedHandle)
  });
  const { data, write } = useContractWrite(config);

  const { isLoading, error } = useWaitForTransaction({
    hash: data?.hash
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

  return (
    <Form form={form} className="space-y-4" onSubmit={handleCreateProfile}>
      {error && (
        <ErrorMessage
          className="mb-3"
          title="Create profile failed!"
          error={{
            name: 'Create profile failed!',
            message: error.message
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
          {/* TODO: reactivate avatar upload once we have a S3 bucket
          <div>
            <div className="flex items-center space-x-3">
              <ChooseFile
                onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                  handleUpload(evt)
                }
              />
              {uploading && <Spinner size="sm" />}
            </div>
          </div>*/}
        </div>
      </div>
      <Button
        className="ml-auto"
        type="submit"
        disabled={!write || isLoading || !isConnected}
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
