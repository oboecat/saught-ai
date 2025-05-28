import packageJson from '../../package.json';

export const VERSION = packageJson.version;
export const MAJOR_VERSION = VERSION.split('.')[0];

// Widget URLs
export const WIDGET_LATEST_URL = `https://saught.ai/v${MAJOR_VERSION}.js`;
export const WIDGET_PINNED_URL = `https://saught.ai/v${VERSION}.js`; 