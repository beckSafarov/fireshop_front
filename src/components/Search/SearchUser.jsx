import React, { useState } from 'react'
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'
import { Formik, Form as FormikForm, Field } from 'formik'

const searchOptions = [
  { value: '_id', label: 'By ID' },
  { value: 'name', label: 'By Name' },
  { value: 'email', label: 'By Email' },
  { value: 'address', label: 'By Shipping Address' },
]

const searchByAddressOptions = [
  { value: 'address', label: 'By Address' },
  { value: 'city', label: 'By City' },
  { value: 'country', label: 'By Country' },
  { value: 'postalCode', label: 'By Postal Code' },
]

const SearchUser = ({ onSearch, onClear }) => {
  const [showCancel, setShowCancel] = useState(false)

  const handleSubmit = (vals) => {
    onSearch(vals)
    setShowCancel(true)
  }

  const handleClear = () => {
    onClear()
    setShowCancel(false)
  }

  const selects = [
    {
      name: 'searchBy',
      options: searchOptions,
      md: 3,
    },
    {
      name: 'searchAddressBy',
      options: searchByAddressOptions,
      md: 2,
    },
  ]

  const validate = ({ keyword }) => (!keyword ? { keyword: 'No keyword' } : {})

  return (
    <Formik
      initialValues={{ keyword: '', searchBy: '', searchAddressBy: '' }}
      onSubmit={handleSubmit}
      validate={validate}
    >
      <FormikForm>
        <Row>
          <Field name='keyword'>
            {({ field }) => (
              <Col md={5}>
                <InputGroup className='mb-3'>
                  <Form.Control
                    type='text'
                    placeholder='Search Users...'
                    {...field}
                  />
                  <Button
                    style={{ fontSize: '1rem' }}
                    type='reset'
                    onClick={handleClear}
                    variant='outline-secondary'
                    hidden={!showCancel}
                    size='sm'
                  >
                    <FaTimes />
                  </Button>
                </InputGroup>
              </Col>
            )}
          </Field>
          {selects.map((select, key) => (
            <Field name={select.name} key={key}>
              {({ field, form }) => (
                <Col
                  md={select.md}
                  hidden={
                    select.name === 'searchAddressBy' &&
                    form.values.searchBy !== 'address'
                  }
                >
                  <Form.Control as='select' {...field}>
                    {select.options.map((o, i) => (
                      <option key={i} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              )}
            </Field>
          ))}
          <div className='mx-1'>
            <Button
              type='submit'
              variant='outline-info'
              className='p-2 rounded'
            >
              Search
            </Button>
          </div>
        </Row>
      </FormikForm>
    </Formik>
  )
}

SearchUser.defaultProps = {
  onSearch: () => false,
  onClear: () => false,
  bordered: true,
  rounded: true,
}

export default withRouter(SearchUser)
