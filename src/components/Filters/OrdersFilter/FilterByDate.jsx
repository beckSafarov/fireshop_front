import { useState } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
const timeOptions = ['day', 'week', 'month', 'year']

const FilterByDate = ({ onSubmit }) => {
  const [category, setCategory] = useState('ordered')
  const [time, setTime] = useState('day')

  const submitHandler = (e) => {
    e.preventDefault()
    onSubmit({ time, category })
  }

  return (
    <Form onSubmit={submitHandler}>
      <Row>
        <Col md={5} lg={5} sm={12}>
          <Form.Control
            as='select'
            name='status'
            defaultValue={category}
            className={'bordered rounded'}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option key={1} value={'ordered'}>
              Ordered
            </option>
            <option key={2} value={'delivered'}>
              Delivered
            </option>
          </Form.Control>
        </Col>
        <Col md={5} lg={5} sm={12}>
          <Form.Control
            as='select'
            name='time'
            defaultValue={time}
            className={'bordered rounded'}
            onChange={(e) => setTime(e.target.value)}
          >
            {timeOptions.map((time, i) => (
              <option key={i} value={time}>{`a ${time} ago`}</option>
            ))}
          </Form.Control>
        </Col>
        <Col md={2} lg={2} sm={12}>
          <Button
            type='submit'
            variant='outline-info'
            className='p-2 rounded btn-block'
          >
            Filter
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

FilterByDate.defaultProps = {
  onSubmit: () => false,
}

export default FilterByDate
