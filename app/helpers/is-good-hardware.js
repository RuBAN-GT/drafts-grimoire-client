/**
 * Check if device can do hard operations
 *
 * @return {Boolean}
 */
export default function isGoodHardware() {
  const byAgent  = !navigator.userAgent || navigator.userAgent.indexOf('PlayStation') == -1
  
  const byMemory = !window.performance || !window.performance.memory || window.performance.memory.jsHeapSizeLimit > 1000000000

  return byAgent && byMemory
}
