const defaults = [{ sort: 'price', type: 'asc', always: false }]

export const initSortVals = (getDefs = true) => {
  const out = JSON.parse(localStorage.getItem('savedSorts'))
  return out && out.length > 0 ? out : getDefs ? defaults : null
}

export const saveSorts = (sorts) =>
  localStorage.setItem('savedSorts', JSON.stringify(sorts))
