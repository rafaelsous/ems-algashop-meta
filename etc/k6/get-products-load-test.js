import http from 'k6/http';
import { sleep, check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8083'; // Default to localhost if BASE_URL is not set

export const options = {
  stages: [
    { duration: '5s', target: 100 },
    { duration: '5s', target: 300 },
    { duration: '5s', target: 500 },
    { duration: '10s', target: 1000 },
    { duration: '3s', target: 300 },
    { duration: '3s', target: 0 },
  ],
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