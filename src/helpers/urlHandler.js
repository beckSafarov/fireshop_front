export const getQueriesArray = (loc) => {
  let values = []
  if (loc.search.includes('&')) {
    const blocks = loc.search.split('&')
    blocks.forEach((block) => {
      values.push(block.split('=')[1])
    })
  } else {
    values.push(loc.search.split('=')[1])
  }
  return values
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
