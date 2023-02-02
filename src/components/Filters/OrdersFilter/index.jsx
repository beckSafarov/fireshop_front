import { useState } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'
import AdminProductSearch from '../../Search/AdminProductSearch'
import FilterByAddress from './FilterByAddress'
import FilterByDate from './FilterByDate'
import FilterByPrice from './FilterByPrice'
const checkBoxes = ['Customer', 'Product', 'Address', 'Date', 'Price']

const OrdersFilter = ({ onSubmit }) => {
  const [checked, setChecked] = useState(0)

  const checkHandler = (e) => {
    e.preventDefault()
    setChecked(Number(e.target.id))
  }

  const formSwitcher = () => {
    switch (checked) {
      case 0:
        return (
          <AdminProductSearch
            onSearch={(o) => formSubmitHandler('user', o)}
            placeholder={'e.g. John Doe'}
            buttonText='Filter'
            buttonClass='outline-info'
            cancelButton={false}
          />
        )
      case 1:
        return (
          <AdminProductSearch
            onSearch={(o) => formSubmitHandler('orderItems', o)}
            placeholder={'e.g. iphone'}
            buttonText='Filter'
            buttonClass='outline-info'
            cancelButton={false}
          />
        )
      case 2:
        return (
          <FilterByAddress onSubmit={(o) => formSubmitHandler('address', o)} />
        )
      case 3:
        return <FilterByDate onSubmit={(o) => formSubmitHandler('date', o)} />
      case 4:
        return <FilterByPrice onSubmit={(o) => formSubmitHandler('price', o)} />
    }
  }

  const formSubmitHandler = (type, output) => {
    switch (type) {
      case 'user':
      case 'orderItems':
        onSubmit(`?filter=${type}&${type}=${output}`)
        break
      case 'address':
        onSubmit(
          `?filter=shippingAddress&shippingAddress=${output.category}.${output.keyword}`
        )
        break
      case 'date':
        onSubmit(`?filter=${output.category}&${output.category}=${output.time}`)
        break
      case 'price':
        const firstParam = `${output[0].category}=${output[0].value}`
        const secondParam =
          output.length > 1 ? `&${output[1].category}=${output[1].value}` : ''
        onSubmit(`?filter=price&${firstParam}${secondParam}`)
        break
    }
  }

  return (
    <>
      <ButtonGroup size='sm'>
        {checkBoxes.map((label, i) => (
          <Button
            variant='secondary'
            id={i}
            key={i}
            disabled={checked === i}
            onClick={checkHandler}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
      <div className='py-4'>{formSwitcher()}</div>
    </>
  )
}

OrdersFilter.defaultProps = {
  onSubmit: (query) => console.log(query),
}

export default OrdersFilter
