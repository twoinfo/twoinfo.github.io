export default function throttle(func, delay = 200) {
  let lastCall = 0
  return function (...args) {
    const now = new Date().getTime()
    if (now - lastCall < delay) {
      return
    }
    lastCall = now
    return func.apply(this, args)
  }
}
