import { useState, useEffect } from 'react'
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap'
import { FaTimes } from 'react-icons/fa'
import { withRouter } from 'react-router-dom'

const AdminProductSearch = ({
  onSearch,
  onClear,
  reset,
  setReset,
  placeholder,
  buttonText,
  buttonClass,
}) => {
  const [keyword, setKeyWord] = useState('')
  const [showCancel, setShowCancel] = useState(false)
  const [submittable, setSubmittable] = useState(true)

  useEffect(() => {
    if (reset) {
      handleClear()
      setReset(false)
    }
    setSubmittable(keyword ? true : false)
  }, [reset, keyword])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(keyword)
    setShowCancel(true)
  }

  const handleClear = () => {
    setKeyWord('')
    onClear()
    setShowCancel(false)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row className='fully-centered'>
        <Col md={8}>
          <InputGroup>
            <Form.Control
              type='text'
              onChange={(e) => setKeyWord(e.target.value)}
              placeholder={placeholder}
              value={keyword}
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
        <Col md={2}>
          <Button
            type='submit'
            variant={buttonClass}
            className='p-2 rounded'
            disabled={!submittable}
            block
          >
            {buttonText}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

AdminProductSearch.defaultProps = {
  onSearch: () => false,
  onClear: () => false,
  reset: false,
  setReset: () => false,
  placeholder: 'Search Product...',
  buttonText: 'Search',
  buttonClass: 'outline-info',
}

export default withRouter(AdminProductSearch)
