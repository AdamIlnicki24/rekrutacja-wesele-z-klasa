import {
  FIREFOX_BROWSER,
  EDGE_BROWSER,
  CHROME_BROWSER,
  SAFARI_BROWSER,
  UNKNOWN_BROWSER,
  OPERA_BROWSER,
} from '../constants/browsers';

export function getBrowserName(): string {
  const userAgent = navigator.userAgent.toLowerCase();

  switch (true) {
    case /firefox|fxios/.test(userAgent):
      return FIREFOX_BROWSER;
    case /\bedg(e|)/.test(userAgent):
      return EDGE_BROWSER;
    case /opr|opera/.test(userAgent):
      return OPERA_BROWSER;
    case /\bchrome\b|crios/.test(userAgent) && !/edg|opr|opera/.test(userAgent):
      return CHROME_BROWSER;
    case /safari/.test(userAgent) && !/chrome|crios|android/.test(userAgent):
      return SAFARI_BROWSER;
    default:
      return UNKNOWN_BROWSER;
  }
}