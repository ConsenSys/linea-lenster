import http from 'k6/http';
import { check, sleep } from 'k6';
import { exploreFeedQuery } from './queries.js';
import { explorerConstantsVus, explorerRampingVus } from './scenarios/explorer.js';

const payload = JSON.stringify(exploreFeedQuery);

const API = 'https://api-zkevm-goerli.lens.dev';

const params = {
  headers: {
    'Content-Type': 'application/json'
  }
};
// Test configuration
export const options = {
  thresholds: {
    // Assert that 99% of requests finish within 3000ms.
    http_req_duration: ['p(99) < 3000']
  },
  scenarios: {
    // explorerConstantsVus
    explorerRampingVus
  }
};

export default function () {
  let res = http.post(API, payload, params);
  // Validate response status
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
