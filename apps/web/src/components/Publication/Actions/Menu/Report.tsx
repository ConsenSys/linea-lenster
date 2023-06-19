import { Menu } from '@headlessui/react';
import { ShieldExclamationIcon } from '@heroicons/react/outline';
import type { Publication } from '@lenster/lens';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import clsx from 'clsx';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

interface ReportProps {
  publication: Publication;
}

const Report: FC<ReportProps> = ({ publication }) => {
  const setShowReportModal = useGlobalModalStateStore((state) => state.setShowReportModal);

  return (
    <Menu.Item
      as="div"
      className="block cursor-pointer rounded-md px-4 py-1.5 text-sm outline-none focus:outline:none hover:bg-black dark:hover:bg-dark hover:text-brand-500 text-red-500"
      onClick={(event) => {
        stopEventPropagation(event);
        setShowReportModal(true, publication);
      }}
    >
      <div className="flex items-center justify-start space-x-2">
        <ShieldExclamationIcon className="h-4 w-4 uppercase" />
        <div>Report Post</div>
      </div>
    </Menu.Item>
  );
};

export default Report;
