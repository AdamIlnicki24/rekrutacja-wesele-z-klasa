import {
  CHROME_BROWSER,
  EDGE_BROWSER,
  FIREFOX_BROWSER,
  SAFARI_BROWSER,
  UNKNOWN_BROWSER,
} from '../constants/browsers';

export function getBrowserName(): string {
  const agent = navigator.userAgent;

  if (agent.includes(FIREFOX_BROWSER)) {
    return FIREFOX_BROWSER;
  }

  if (agent.includes(EDGE_BROWSER)) {
    return EDGE_BROWSER;
  }

  if (agent.includes(CHROME_BROWSER) && !agent.includes(EDGE_BROWSER)) {
    return CHROME_BROWSER;
  }

  if (agent.includes(SAFARI_BROWSER) && !agent.includes(CHROME_BROWSER)) {
    return SAFARI_BROWSER;
  }

  return UNKNOWN_BROWSER;
}
