import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const timeSince = (a, withoutAgo = false) => {
  if (!a) return 'undefined'
  const then = new Date(a)
  const now = new Date()
  return dayjs(then).from(now, withoutAgo)
}

export default timeSince
