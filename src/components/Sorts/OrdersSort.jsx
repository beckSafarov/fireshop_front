import { useState, useEffect } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { initSortVals, saveSorts } from '../../helpers/sortLCS'
import { findDuplicates } from '../../helpers/utilities'
import OrdersSortRow from './OrdersSortRow'
const sortOptions = ['price', 'delivered', 'ordered']
const typeOptions = ['ascending', 'descending']
const shortTypeOptions = ['asc', 'desc']

const OrdersSort = ({ onSubmit }) => {
  const [vals, setVals] = useState(initSortVals())
  const [submittable, setSubmittable] = useState(false)
  let currVals

  useEffect(() => setSubmittable(fieldsValid()), [vals])

  const changesHandler = (e) => {
    const { id, value } = e.target
    let [category, i] = id.split('_')
    i = Number(i)
    currVals = [...vals]

    category === 'always'
      ? (currVals[i].always = !currVals[i].always)
      : (currVals[i][category] = value.toLowerCase())

    setVals(currVals)
  }

  const addRow = () =>
    setVals((vals) => [
      ...vals,
      { sort: getNextSort(), type: 'asc', always: false },
    ])

  const removeSort = (i) => setVals(vals.filter((v, c) => c !== i))

  const getNextSort = () => {
    if (vals.length > 2) return false
    let found, notFound
    sortOptions.forEach((opt) => {
      found = vals.find((val) => val.sort === opt)
      if (!found) notFound = opt
    })
    return notFound
  }

  const submitHandler = (e) => {
    e.preventDefault()
    saveSorts(vals.filter((val) => val.always))
    console.log(vals)
    onSubmit(
      vals.map((val) =>
        val.sort === 'price' ? { ...val, sort: 'totalPrice' } : val
      )
    )
    setSubmittable(false)
  }

  const fieldsValid = () => {
    if (vals.length < 2) return true
    const duplicates = findDuplicates(vals.map((val) => val.sort))
    return duplicates.length === 0
  }

  return (
    <Form onSubmit={submitHandler}>
      {vals.map((val, i) => (
        <div className='mb-2' key={i}>
          <OrdersSortRow
            sortOptions={sortOptions}
            typeOptions={typeOptions}
            changesHandler={changesHandler}
            index={i}
            defaults={val}
            shortTypeOptions={shortTypeOptions}
            hideRemove={i === 0}
            onRemove={removeSort}
          />
        </div>
      ))}

      {vals.length < 3 && (
        <Row className='py-3'>
          <Col>
            <button
              type='button'
              className='light-btn-small'
              onClick={addRow}
              title='Add Another Sort'
            >
              + Add Sort
            </button>
          </Col>
        </Row>
      )}
      <Row className='fully-centered pt-4'>
        <Button
          type='submit'
          variant='outline-info'
          className='p-2 rounded'
          disabled={!submittable}
        >
          Sort
        </Button>
      </Row>
    </Form>
  )
}

OrdersSort.defaultProps = {
  onSubmit: (vals) => console.log(vals),
}

export default OrdersSort
