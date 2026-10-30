import base from './playwright.config.js';
export default { ...base, use: { ...base.use, browserName: 'firefox', headless: false, launchOptions: {firefoxUserPrefs: {'webgl.force-enabled':true,'webgl.disabled':false}} } };
