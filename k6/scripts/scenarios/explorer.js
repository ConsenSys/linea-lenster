export const explorerConstantsVus = {
  executor: 'constant-vus',
  duration: '1m',
  vus: 5000
};

export const explorerRampingVus = {
  executor: 'ramping-vus',
  // startTime: '30s',
  startVUs: 0,
  stages: [
    { duration: '20s', target: 5000 },
    { duration: '30s', target: 0 }
  ]
};
