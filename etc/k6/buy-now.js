import http from 'k6/http';
import { sleep, check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080'; // Default to localhost if BASE_URL is not set

export const options = {
  scenarios: {
    buy_now_smoke_test: {
      executor: 'constant-vus',
      vus: 1, // Number of virtual users
      duration: '5s', // Duration of the test
    },
    buy_now_volume_test: {
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
    http_req_duration: ['p(95) < 1200'], // 95% of requests should be below 1200ms
  }
};

export default function buyNow() {
  const url = `${BASE_URL}/api/v1/orders`;
  const params = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/vnd.order-with-product.v1+json',
    },
  };
  const payload = {
    customerId: '41cdc65c-6158-48b0-a8e6-34c0ff8fd74e',
    productId: '2eea613a-3a11-46dd-95ee-2678c295559e',
    quantity: 12,
    paymentMethod: 'GATEWAY_BALANCE',
    shipping: {
      recipient: {
        firstName: 'John',
        lastName: 'Doe',
        document: '12345',
        phone: '5511912341234',
      },
      address: {
        street: '123 Main St',
        number: '100',
        complement: 'Apt 4B',
        neighborhood: 'Downtown',
        city: 'Springfield',
        state: 'South Carolina',
        zipCode: '12345'
      }
    },
    billing: {
      firstName: 'John',
      lastName: 'Doe',
      document: '12345',
      phone: '5511912341234',
      email: 'johndoe@email.com',
      address: {
        street: '123 Main St',
        number: '100',
        complement: 'Apt 4B',
        neighborhood: 'Downtown',
        city: 'Springfield',
        state: 'South Carolina',
        zipCode: '62701'
      }
    }
  };
  const json = JSON.stringify(payload);

  let res = http.post(url, json, params);
  check(res, { "status is 201": (res) => res.status === 201 });
  sleep(1);
}
