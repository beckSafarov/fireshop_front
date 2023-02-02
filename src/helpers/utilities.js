import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export const timeSince = (a, withoutAgo = false) => {
  if (!a) return 'undefined'
  const then = new Date(a)
  const now = new Date()
  return dayjs(then).from(now, withoutAgo)
}

export const findDuplicates = (arr) =>
  arr.filter((item, index) => arr.indexOf(item) != index)

export const pluralize = (n, t = 'review') => {
  n = Number(n)
  return n === 0 ? `No ${t}s` : n === 1 ? `${n} ${t}` : `${n} ${t}s`
}

export const isDate = (param) => Boolean(param?.getTime)

export const isObject = (param) => param && typeof param === 'object'

/**
 * @desc checks whether an element is defined and contains value
 * @elem array|object|variable|null|undefined|NaN
 * @returns true|false
 */
export const isNone = (elem, exceptZero = false) => {
  if (exceptZero && elem === 0) return false
  if (!elem) return true
  if (isDate(elem)) return false
  if (isObject(elem)) return Object.keys(elem).length < 1
  return !Boolean(elem)
}

export const getQueries = (loc) => {
  let values = {}
  let property
  if (loc.search.includes('&')) {
    const blocks = loc.search.split('&')
    blocks.forEach((block) => {
      property = block.split('=')[0]
      property = property.includes('?') ? property.split('?')[1] : property
      values[property] = block.split('=')[1]
    })
  } else {
    property = loc.search.split('=')[0].split('?')[1]
    values[property] = loc.search.split('=')[1]
  }

  return values
}

export const ObjectsCompare = (obj1, obj2) => {
  let ch = false
  Object.keys(obj1).forEach((i) => {
    if (typeof obj1[i] === 'object') {
      Object.keys(obj1[i]).forEach((j) => {
        ch = obj1[i][j] !== obj2[i][j] ? true : ch
      })
    } else {
      ch = obj1[i] !== obj2[i] ? true : ch
    }
  })
  return ch
}

export const areSameObjects = (obj1, obj2) => {
  const str1 = Object.values(obj1).join(', ')
  const str2 = Object.values(obj2).join(', ')
  return str1 === str2
}

export const withoutProps = (obj, props = []) => {
  const objCopy = { ...obj }
  props.forEach((p) => delete objCopy[p])
  return objCopy
}

export const onlyProps = (obj, props = []) => {
  const obj2 = {}
  props.forEach((p) => {
    obj2[p] = obj[p]
  })
  return obj2
}

export const isEmptyObj = (obj = {}) => Object.keys(obj).length === 0

export const isInvalid = (f, p) => f.touched[p] && f.errors[p]

export const getErrMessage = (err) => err.response?.data?.message || err.message

export const getUserAddress = (data) => {
  return data ? Object.values(data).join(', ') : ''
}

export const getURLParam = (query, fallBack = '') =>
  new URLSearchParams(window?.location?.search).get(query) || fallBack
