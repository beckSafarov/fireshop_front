import { useState, useEffect } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
const placeholders = {
  city: 'e.g. Boston',
  country: 'e.g. USA',
  postalCode: 'e.g. 12300',
}

const FilterByAddress = ({ onSubmit }) => {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('city')
  const [type, setType] = useState('text')
  const [placeholder, setPlaceholder] = useState('e.g. Boston')
  const [submittable, setSubmittable] = useState(true)

  useEffect(() => {
    setSubmittable(keyword ? true : false)
  }, [keyword])

  const submitHandler = (e) => {
    e.preventDefault()
    onSubmit({ keyword, category })
  }

  const changesHandler = (e) => {
    const { id, value } = e.target
    if (id === '1') {
      setKeyword(value)
    } else {
      setCategory(value)
      setPlaceholder(placeholders[value])
      value === 2 && setType('number')
    }
  }

  return (
    <Form onSubmit={submitHandler}>
      <Row>
        <Col md={7} sm={7} lg={7}>
          <Form.Control
            type={type}
            placeholder={placeholder}
            id='1'
            className='bordered rounded'
            name='textField'
            onChange={changesHandler}
          />
        </Col>
        <Col md={3} lg={3} sm={3}>
          <Form.Control
            as='select'
            name='options'
            id='2'
            defaultValue={category}
            className='bordered rounded'
            onChange={changesHandler}
          >
            <option key={0} value={'city'}>
              By City
            </option>
            <option key={1} value={'country'}>
              By Country
            </option>
            <option key={2} value={'postalCode'}>
              By Postal Code
            </option>
          </Form.Control>
        </Col>
        <Col md={2} sm={2} lg={2}>
          <Button
            className='p-2 rounded'
            variant='outline-info'
            type='submit'
            disabled={!submittable}
            block
          >
            Filter
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

FilterByAddress.defaultProps = {
  onSubmit: () => false,
}

export default FilterByAddress
