import clsx from 'clsx';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';

interface TabButtonProps {
  name: string;
  icon: ReactNode;
  active: boolean;
  type?: string;
  showOnSm?: boolean;
  onClick: () => void;
}

const TabButton: FC<TabButtonProps> = ({ name, icon, active, type, showOnSm = false, onClick }) => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (type) {
          router.replace({ query: { ...router.query, type } }, undefined, { shallow: true });
        }
        onClick();
      }}
      className={clsx(
        { 'text-brand bg-blue-500 bg-opacity-100 dark:bg-opacity-20': active },
        'text-brand flex items-center space-x-2 rounded-[2px] px-4 py-2 text-sm font-medium hover:bg-blue-500 hover:bg-opacity-100 dark:hover:bg-opacity-20 sm:px-3 sm:py-1.5'
      )}
      aria-label={name}
    >
      {icon}
      <span className={clsx({ 'hidden uppercase sm:block': !showOnSm })}>{name}</span>
    </button>
  );
};

export default TabButton;
