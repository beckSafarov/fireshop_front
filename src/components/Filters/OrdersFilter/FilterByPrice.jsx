import { useState, useEffect } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
const filterOptions = {
  gt: {
    id: 2,
    text: 'Greater than',
  },
  gte: {
    id: 1,
    text: 'Greater than or equal to',
  },
  eq: {
    id: 0,
    text: 'Equal to',
  },
  lte: {
    id: -1,
    text: 'Less than or equal to',
  },
  lt: {
    id: -2,
    text: 'Less than',
  },
}

const FilterByPrice = ({ onSubmit }) => {
  const [vals, setVals] = useState([{ category: 'gt' }])
  const [secondFilter, setSecondFilter] = useState(false)
  const [submittable, setSubmittable] = useState(false)
  const [fieldDisabled, setFieldDisabled] = useState(null)
  const [invalidFilter, setInvalidFilter] = useState(false)
  const [invalidValues, setInvalidValues] = useState([false, false])
  let currVals = {}
  let order, field

  useEffect(() => {
    let fieldsFull = fieldsFilled()
    setInvalidFilter(vals.length > 1 && !filterValid())

    setSubmittable(
      vals.length > 1 ? fieldsFull && filterValid() : vals[0].value
    )

    if (vals[0].value) {
      let validVals = valuesValid()
      if (!validVals.success) {
        validVals.both
          ? setInvalidValues([true, true])
          : setInvalidValues([validVals.index === 0, validVals.index === 1])
        setSubmittable(false)
      } else {
        setInvalidValues([false, false])
      }
    }
  }, [vals])

  const changesHandler = (e) => {
    currVals = [...vals]
    const { id, value } = e.target
    order = Number(id.split('_')[1])

    field = id.split('_')[0]
    if (!currVals[order]) currVals[order] = {}
    currVals[order][field] = value
    if (field === 'category') {
      value === 'eq'
        ? setFieldDisabled(Number(!order))
        : setFieldDisabled((fieldDisabled === 1 || fieldDisabled === 0) && null)
    }

    setVals(currVals)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    let validFilter = true
    let finalVals = [...vals]
    finalVals.forEach((val) => {
      val.value =
        val.value && (val.value < 0 || val.value.startsWith('0'))
          ? 0
          : val.value
    })

    if (finalVals.length > 1) {
      let eq = haveEqual()
      if (eq) finalVals = [eq]
    }
    validFilter && onSubmit(finalVals)
  }

  const addFilter = () => {
    setVals([...vals, { category: complementFilter(vals[0].category) }])
    setSecondFilter(true)
  }

  const removeFilter = () => {
    currVals = [...vals]
    currVals.pop()
    setVals(currVals)
    setSecondFilter(false)
  }

  const complementFilter = (category) => {
    switch (category) {
      case 'gt':
        return 'lt'
      case 'gte':
        return 'lte'
      case 'lt':
        return 'gt'
      case 'lte':
        return 'gte'
    }
  }

  const filterValid = () =>
    filterOptions[vals[0].category].id * filterOptions[vals[1].category].id <= 0

  const fieldsFilled = () => {
    let filled = true
    let eq = haveEqual()
    eq
      ? (filled = eq.value ? filled : false)
      : vals.forEach((val) => !val.value && (filled = false))
    return filled
  }

  const valuesValid = () => {
    if (vals.length > 1 && !haveEqual()) {
      if ('gt|gte'.includes(vals[0].category)) {
        if (Number(vals[0].value) >= Number(vals[1].value)) {
          return { both: true }
        }
      } else {
        if (Number(vals[0].value) <= Number(vals[1].value)) {
          return { both: true }
        }
      }
    }

    return { success: true }
  }

  const haveEqual = () => vals.find((v) => v.category === 'eq')

  return (
    <Form onSubmit={submitHandler}>
      <Row className='fully-centered'>
        <Col md={3} lg={3} sm={5}>
          <Form.Control
            as='select'
            id='category_0'
            defaultValue={vals[0] ? vals[0].category : 'gt'}
            className={'bordered rounded'}
            disabled={fieldDisabled === 0}
            onChange={changesHandler}
            isInvalid={invalidFilter}
          >
            {Object.keys(filterOptions).map((o, i) => (
              <option key={i} value={o}>
                {filterOptions[o].text}
              </option>
            ))}
          </Form.Control>
        </Col>
        <Col md={2} lg={2} sm={5}>
          <Form.Control
            type='number'
            id='value_0'
            onChange={changesHandler}
            disabled={fieldDisabled === 0}
            className='bordered rounded'
            isInvalid={invalidValues[0]}
            required
          ></Form.Control>
        </Col>
        {secondFilter ? (
          <>
            <Col md={3} lg={3} sm={3}>
              <Form.Control
                as='select'
                id='category_1'
                className={'bordered rounded'}
                defaultValue={vals[1] ? vals[1].category : 'gt'}
                disabled={fieldDisabled === 1}
                onChange={changesHandler}
                isInvalid={invalidFilter}
              >
                {Object.keys(filterOptions).map((v, i) => (
                  <option key={i} value={v}>
                    {filterOptions[v].text}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={2} lg={2} sm={2}>
              <Form.Control
                type='number'
                id='value_1'
                onChange={changesHandler}
                className='bordered rounded'
                disabled={fieldDisabled === 1}
                isInvalid={invalidValues[1]}
                required
              ></Form.Control>
            </Col>
            <span
              onClick={removeFilter}
              style={{ cursor: 'pointer', color: '#999999' }}
            >
              <i className='fas fa-times'></i>
            </span>
          </>
        ) : !haveEqual() ? (
          <Col md={1} lg={1} sm={1}>
            <button
              type='button'
              className='light-btn-small'
              onClick={addFilter}
              title='Add Another Filter'
            >
              <i className='fas fa-plus'></i>
            </button>
          </Col>
        ) : (
          <></>
        )}
        <Col md={1} lg={1} sm={1}>
          <Button
            type='submit'
            variant='outline-info'
            className='p-2 rounded'
            disabled={!submittable}
          >
            Filter
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

FilterByPrice.defaultProps = {
  onSubmit: () => false,
}

export default FilterByPrice
