import base from './playwright.config.js';
export default { ...base, testMatch: '**/hockey.spec.js', use: { ...base.use, browserName: 'firefox', viewport: { width: 393, height: 852 }, launchOptions: {} } };
