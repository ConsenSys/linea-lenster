import clsx from 'clsx';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';

interface TabButtonProps {
  name: string;
  icon?: ReactNode;
  active: boolean;
  type?: string;
  count?: string;
  showOnSm?: boolean;
  onClick: () => void;
}

const TabButton: FC<TabButtonProps> = ({
  name,
  icon,
  active,
  type,
  count,
  showOnSm = false,
  onClick
}) => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (type) {
          router.replace({ query: { ...router.query, type } }, undefined, {
            shallow: true
          });
        }
        onClick();
      }}
      className={clsx(
        {
          'text-brand-500 flex items-center justify-center space-x-2 px-4 py-2 text-sm  font-medium hover:cursor-default sm:px-3 sm:py-1.5':
            active
        },
        {
          'text-dark hover:text-brand-500 dark:hover:text-brand-500 flex items-center justify-center space-x-2  px-4 py-2 text-sm font-medium dark:text-white sm:px-3 sm:py-1.5':
            !active
        }
      )}
      data-testid={`tab-button-${name.toLowerCase()}`}
      aria-label={name}
    >
      {icon}
      <span className={clsx({ 'hidden uppercase sm:block': !showOnSm })}>
        {name}
      </span>
      {count && (
        <span
          className={clsx(
            active
              ? 'bg-brand-500 dark:bg-brand-500/80 text-white dark:text-white'
              : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
            'ml-2 rounded-2xl px-2 py-0.5 text-xs font-bold'
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default TabButton;
