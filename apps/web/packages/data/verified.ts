import { aaveMembers } from './aave-members';
import { mainnetStaffs, testnetStaffs } from './staffs';

export const mainnetVerified = [...aaveMembers, ...mainnetStaffs];

export const testnetVerified = [...aaveMembers, ...testnetStaffs];
