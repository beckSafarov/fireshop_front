import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// -- UI COMPONENTS
import { FlashMsg, Rating, Spinner } from '../components'
import { Row, Col, Container, Image, ListGroup } from 'react-bootstrap'

// -- REDUX RELATED IMPORTS
import { listProducts } from '../actions/productActions.js'
import { Link, withRouter } from 'react-router-dom'
import { getQueries } from '../helpers/urlHandler'
import { PRODUCT_SEARCH_RESET } from '../constants'
import { pluralize } from '../helpers/utilities'

// page/search?p=home&keyword=something
const SearchScreen = ({ history }) => {
  const dispatch = useDispatch()

  const keyword = getQueries(history.location).keyword

  const { loading, error, products } = useSelector(
    (state) => state.productSearchStore
  )

  const notFound = error ? error.includes('No result') : null
  useEffect(() => {
    if (!products || keyword) {
      dispatch(listProducts(keyword))
    }

    return () => {
      axios.CancelToken.source().cancel()
      dispatch({ type: PRODUCT_SEARCH_RESET })
    }
  }, [keyword, dispatch])

  return (
    <>
      <Spinner hidden={!loading} />
      <Container>
        <FlashMsg variant='danger' permanent>
          {error}
        </FlashMsg>
        {products && (
          <ListGroup>
            {notFound && (
              <>
                <h3>Not found</h3>
                <p className='py-3'>
                  No product found with the name{' '}
                  <span style={{ color: 'tomato' }}>{keyword}</span>. Try again
                  with a different keyword
                </p>
              </>
            )}
            {products.map((product) => (
              <ListGroup.Item key={product._id}>
                <Row>
                  <Col xs={2} md={2}>
                    <Image src={product.image} thumbnail />
                  </Col>
                  <Col xs={7} md={7}>
                    <Link to={`/product/${product._id}`}>
                      <h5>{product.name}</h5>
                    </Link>
                    <p>${product.price}</p>
                  </Col>
                  <Col xs={3} md={3}>
                    <div style={{ textAlign: 'right' }}>
                      <Rating
                        value={product.rating}
                        text={pluralize(product.numReviews)}
                      />
                    </div>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>
    </>
  )
}

export default withRouter(SearchScreen)
