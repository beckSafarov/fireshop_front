// -- LIBRARIES & METHODS
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// -- UI COMPONENTS
import { Product, FlashMsg, Spinner } from '../components'
import { Row, Col } from 'react-bootstrap'

// -- REDUX RELATED IMPORTS
import { listProducts } from '../actions/productActions.js'
import Paginate from '../components/Paginate'
import TopProductsCarousel from '../components/Product/TopProductsCarousel'

const HomeScreen = ({ match }) => {
  const dispatch = useDispatch()
  const {
    loading,
    error,
    products,
    pages,
    page: currPage,
  } = useSelector((state) => state.productList)
  const pageNumber = match.params.pageNumber || 1

  useEffect(() => {
    dispatch(listProducts('', pageNumber))
    return () => axios.CancelToken.source().cancel()
  }, [dispatch, pageNumber])

  return (
    <>
      <h1>Latest Products</h1>
      <Spinner hidden={!loading} />
      <FlashMsg variant='danger' permanent>
        {error}
      </FlashMsg>
      <TopProductsCarousel />
      {products && (
        <Row>
          {products.map((product) => (
            <Col
              className='align-items-stretch d-flex'
              key={product._id}
              sm={12}
              md={6}
              lg={4}
              xl={3}
            >
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
      <Paginate pages={pages} activePage={currPage} />
    </>
  )
}

export default HomeScreen
