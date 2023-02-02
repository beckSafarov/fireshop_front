import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Slider from '../components/Slider'
import { getURLParam } from '../helpers/utilities'

const TestScreen = ({ history, match }) => {
  const people = ['Beck', 'Tom']
  const dispatch = useDispatch()
  const [status, setStatus] = useState(10)
  const [positive, setPositive] = useState(false)
  const [msg, setMsg] = useState('Tample Message')
  const [modal, setModal] = useState({
    display: false,
    info: {
      isDelivered: false,
      deliveryStatus: 'Packed',
    },
  })

  // useEffect(() => {
  // }, [])

  const changeStatus = (value) => setStatus(value * 3)
  console.log(useHistory())
  const clickMe = () => {
    const someQuery = getURLParam('mambo')
    console.log(someQuery)
    // setMsg('Again temple msg')
  }

  const playGroundFunc = () => {
    return true
  }

  return (
    <>
      <h1>Welcome to test page</h1>
      <p>playground for testing stuff</p>
      {positive && <p>positive</p>}
      <button onClick={clickMe} className='btn btn-success'>
        Click me
      </button>
      <Slider />
    </>
  )
}

export default TestScreen
