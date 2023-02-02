const pluralize = (n, t = 'review') => {
  n = Number(n)
  return n === 0 ? `No ${t}s` : n === 1 ? `${n} ${t}` : `${n} ${t}s`
}

export default pluralize
