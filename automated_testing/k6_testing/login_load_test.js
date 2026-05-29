import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * k6 Load Test - SKILLAB Authentication API
 *
 * Target:  POST http://localhost:8081/login
 * Profile: Gentle ramp (15 VUs max) for Docker-constrained environments
 *
 * Run:     k6 run login_load_test.js
 */

export const options = {
  stages: [
    { duration: '10s', target: 15 }, // Ramp up to 15 VUs over 10 seconds
    { duration: '30s', target: 15 }, // Hold at 15 VUs for 30 seconds
    { duration: '10s', target: 0 },  // Ramp down to 0 VUs over 10 seconds
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // HTTP error rate must be less than 1%
  },
};

export default function () {
  const url = 'http://localhost:8081/login';
  const payload = 'email=citizen%40citizen.com&password=citizen';

  const params = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
