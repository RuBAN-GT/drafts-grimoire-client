/**
 * Get current screen Width
 * 
 * @return {Integer}
 */
export function currentWidth() {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
}

/**
 * Check screen size on mobile
 * 
 * @return {Boolean}
 */
export function isMobile() {
  return currentWidth() <= 767
}

/**
 * Check screen size on tablet
 * 
 * @return {Boolean}
 */
export function isTablet() {
  return currentWidth() <= 991 && currentWidth() >= 768
}

/**
 * Check screen size on desktop
 * 
 * @return {Boolean}
 */
export function isDesktop() {
  return currentWidth() >= 992
}
