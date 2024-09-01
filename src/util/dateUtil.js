const REGEX_FORMAT = /y{1,4}|m{1,4}|d{1,2}|H{1,2}|M{1,2}S{1,2}/g

export function format(date, template = 'yyyy/mm/dd') {
  const detail = getDateDetail(date)
  const matches = getMatches(detail)
  return template.replace(REGEX_FORMAT, (match) => matches[match])
}

export function prevDate(date, amount = 1) {
  date = toDate(date)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - amount)
}

export function nextDate(date, amount = 1) {
  date = toDate(date)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

export function toDate(date) {
  return isDate(date) ? new Date(date) : null
}

function isDate(date) {
  if (date === null || date === undefined) return false
  if (isNaN(new Date(date).getTime())) return false
  if (Array.isArray(date)) return false // deal with `new Date([ new Date() ]) -> new Date()`
  return true
}

/**
 *
 * @param {Date} date
 * @returns
 */
function getDateDetail(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  }
}

function getMatches({ year, month, date, hours, minutes, seconds }) {
  return {
    yyyy: year,
    yy: String(year).slice(-2),
    mm: patchZero(month),
    m: month,
    dd: patchZero(date),
    d: date,
    HH: patchZero(hours),
    H: hours,
    MM: patchZero(minutes),
    M: minutes,
    SS: patchZero(seconds),
    S: seconds,
  }
}

function patchZero(num) {
  return num < 10 ? '0' + num : num
}
console.log(format(new Date(), 'yyyy-mm-dd'))
