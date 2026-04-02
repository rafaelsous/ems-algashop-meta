import http from 'k6/http';
import { sleep, check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8083'; // Default to localhost if BASE_URL is not set

export const options = {
  scenarios: {
    get_products_smoke_test: {
      executor: 'constant-vus',
      vus: 1, // Number of virtual users
      duration: '5s', // Duration of the test
    },
    get_products_load_test: {
      executor: 'constant-arrival-rate',
      rate: 100, // Number of iterations to start per second
      timeUnit: '1s', // Time unit for the rate
      duration: '1m', // Duration of the test
      startTime: '5s', // Start after the smoke test
      maxVUs: 200, // Maximum number of VUs to allow
      preAllocatedVUs: 50, // Pre-allocate VUs to handle the load
    },
  },
  thresholds: {
    http_req_duration: ['p(95) < 800'], // 95% of requests should be below 800ms
    http_req_failed: ['rate < 0.01'], // Less than 1% of requests should fail
  }
};

export default function loadTest() {
  const url = `${BASE_URL}/api/v1/products`;
  let res = http.get(url);
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1);
}