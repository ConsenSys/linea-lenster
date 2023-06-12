import { Button } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';
import { AUTH } from 'src/tracking';

const LoginButton: FC = () => {
  const setShowAuthModal = useGlobalModalStateStore((state) => state.setShowAuthModal);

  return (
    <Button
      onClick={() => {
        setShowAuthModal(true);
        Leafwatch.track(AUTH.LOGIN);
      }}
      className="text-darker rounded-full border-none text-sm font-medium uppercase hover:bg-brand-500"
      data-testid="login-button"
    >
      <Trans>Login</Trans>
    </Button>
  );
};

export default LoginButton;
