import { testnetGardeners } from './gardeners';
import { mainnetStaffs, testnetStaffs } from './staffs';

export const mainnetVerified = [
  ...mainnetStaffs,
  ...testnetGardeners,
  '0x26', // linea
  '0x82', // chinzilla
  '0x87', // nakedwinnie
  '0x7a', // rooshee
  '0x33', // lovekosmas
  '0x8e', // chaindoe
  '0x75', // hiroprotagonist
  '0x6d' // emily
];

export const testnetVerified = [
  ...testnetStaffs,
  ...testnetGardeners,
  '0x26', // linea
  '0x82', // chinzilla
  '0x87', // nakedwinnie
  '0x7a', // rooshee
  '0x33', // lovekosmas
  '0x8e', // chaindoe
  '0x75', // hiroprotagonist
  '0x6d' // emily
];
