// @ts-check

/**
 * Centralised credentials and configuration for all SKILLAB user roles.
 * Used by global-setup.js and individual test files.
 */

/** @type {Record<string, { email: string; password: string; dashboardPath: string }>} */
export const USERS = {
  admin: {
    email: 'aaaa@gmail.com',
    password: 'aaaaaaaa',
    dashboardPath: '/admin',
  },
  citizen: {
    email: 'citizen@citizen.com',
    password: 'citizen',
    dashboardPath: '/citizen/account',
  },
  education: {
    email: 'education@education.com',
    password: 'education',
    dashboardPath: '/education',
  },
  industry: {
    email: 'industry@industry.com',
    password: 'industry',
    dashboardPath: '/industry',
  },
  policy: {
    email: 'policy@policy.com',
    password: 'policy',
    dashboardPath: '/policy',
  },
};

/** Base URL for the SKILLAB app */
export const BASE_URL = 'http://localhost:3000';

/** Directory where auth storage state files are saved */
export const AUTH_DIR = './playwright/.auth';

/**
 * Returns the storage state file path for a given role.
 * @param {string} role - One of: admin, citizen, education, industry, policy
 * @returns {string}
 */
export function authFile(role) {
  return `${AUTH_DIR}/${role}.json`;
}
