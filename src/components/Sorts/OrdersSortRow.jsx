import React from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { capitalize } from 'lodash'

const OrdersSortRow = ({
  sortOptions,
  typeOptions,
  index,
  defaults,
  shortTypeOptions,
  changesHandler,
  hideRemove,
  onRemove,
}) => {
  return (
    <Row className='fully-centered'>
      <Col md={4} lg={4} sm={6}>
        <Form.Control
          as='select'
          id={`sort_${index}`}
          className='bordered rounded'
          value={defaults.sort}
          onChange={changesHandler}
        >
          {sortOptions.map((option, i) => (
            <option key={i} value={option}>
              {capitalize(option)}
            </option>
          ))}
        </Form.Control>
      </Col>
      <Col md={3} lg={3} sm={6}>
        <Form.Control
          as='select'
          id={`type_${index}`}
          className='bordered rounded'
          onChange={changesHandler}
          value={defaults.type}
        >
          {typeOptions.map((option, i) => (
            <option key={i} value={shortTypeOptions[i]}>
              {option}
            </option>
          ))}
        </Form.Control>
      </Col>
      <Col md={2} lg={2} sm={6} className='fully-centered'>
        <Form.Check
          type='checkbox'
          id={`always_${index}`}
          label='Always'
          onChange={changesHandler}
          checked={defaults.always || false}
        />
      </Col>
      <Col md={1} lg={1} className='fully-centered'>
        {!hideRemove && (
          <button
            type='button'
            className='light-btn-small'
            onClick={() => onRemove(index)}
            title='Remove Sort'
          >
            <i className='fas fa-times'></i>
          </button>
        )}
      </Col>
    </Row>
  )
}

OrdersSortRow.defaultProps = {
  sortOptions: [],
  typeOptions: [],
  shortTypeOptions: [],
  defaults: { sort: 'price', type: 'asc', always: false },
  index: 0,
  changesHandler: () => false,
  hideRemove: false,
  onRemove: () => false,
}

export default OrdersSortRow
