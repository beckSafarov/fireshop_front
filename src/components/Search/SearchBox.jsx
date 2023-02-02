import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'

const SearchBox = ({ history, page = '', reset, setKeyReset }) => {
  const [keyword, setKeyWord] = useState('')

  const changeHandler = (e) => setKeyWord(e.target.value)

  useEffect(() => {
    reset && setKeyWord('')
    setKeyReset(false)
  }, [reset])

  const submitHandler = (e) => {
    e.preventDefault()
    history.push(keyword.trim() ? `${page}/search?keyword=${keyword}` : '/')
  }

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type='text'
        onChange={changeHandler}
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5'
        value={keyword}
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2'>
        Search
      </Button>
    </Form>
  )
}

export default withRouter(SearchBox)
