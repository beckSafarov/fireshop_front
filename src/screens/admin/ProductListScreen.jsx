// libraries & methods
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// UI components
import { Table, Row, Col, Button } from 'react-bootstrap'
import {
  ConfirmModal,
  Spinner,
  AdminProductSearch,
  FlashMsg,
} from '../../components'

// redux actions
import { listProducts } from '../../actions/productActions'
import { addProduct, deleteProduct } from '../../actions/adminActions'
import {
  PRODUCT_LIST_PROPERTY_RESET as listReset,
  PRODUCT_SEARCH_RESET as searchReset,
} from '../../constants'
import { Link, useLocation } from 'react-router-dom'
import Paginate from '../../components/Paginate'
import { isNone } from '../../helpers/utilities'

const tableHeadings = ['photo', 'name', 'price', 'category', 'brand', 'actions']

const ProductListScreen = ({ history }) => {
  const dispatch = useDispatch()
  const [confirmModal, setConfirmModal] = useState({})
  const [flashMsg, setFlashMsg] = useState({})
  const [products, setProducts] = useState([])
  const [lastSearched, setLastSearched] = useState('')
  const [clearSearchField, setClearSearchField] = useState(false)
  const [currProductsPage, setCurrProductsPage] = useState(1)
  const pageNumber = +useLocation().pathname.split('/').pop() || 1

  const {
    loading: allProductsLoading,
    error,
    products: allProducts,
    pages,
    page: currPage,
    success,
    type,
  } = useSelector((state) => state.productList)
  const {
    loading: searchLoading,
    products: searchedProducts,
    error: searchFailed,
  } = useSelector((state) => state.productSearchStore)

  const requestError = error && type === 'request' ? error : null
  const loading = allProductsLoading || searchLoading

  useEffect(() => {
    handleGetProducts()

    if (success) handleSuccess()
    if (error && type !== 'request') handleError()
    if (searchedProducts) setProducts(searchedProducts)

    if (requestError) {
      setFlashMsg({ variant: 'danger', msg: requestError })
    }

    return () => {
      axios.CancelToken.source().cancel()
      if (searchedProducts || searchFailed) {
        handleSearchClear()
      }
    }
  }, [
    dispatch,
    success,
    error,
    allProducts,
    searchedProducts,
    requestError,
    pageNumber,
  ])

  const handleGetProducts = () => {
    if (isNone(allProducts) || pageNumber !== currProductsPage) {
      dispatch(listProducts('', pageNumber))
      setCurrProductsPage(pageNumber)
      return
    }
    setProducts(allProducts)
  }

  const handleSuccess = () => {
    switch (type) {
      case 'update':
        setFlashMsg({ msg: 'Updated successfully', variant: 'success' })
        break
      case 'add':
        setProducts(allProducts)
        const newProduct = allProducts.find((p) => p.new)
        history.push(`/admin/productedit/${newProduct._id}`)
        break
    }
  }

  const handleError = () => {
    setFlashMsg({ msg: error, variant: 'danger' })
    dispatch({ type: listReset, payload: 'error' })
  }

  const handleCreateProduct = () => {
    handleSearchClear()
    setClearSearchField(true)
    dispatch(addProduct())
  }

  const handleDelete = () => {
    handleSearchClear()
    setClearSearchField(true)
    dispatch(deleteProduct(confirmModal._id))
    hideModalHandler()
  }

  const handleConfirm = (_id, name) => {
    setConfirmModal({
      display: true,
      heading: `Deleting ${name}`,
      message: `Are you sure to delete ${name}? This action cannot be reverted`,
      proceedText: 'Delete',
      primaryVariant: 'Danger',
      _id,
    })
  }

  const hideModalHandler = () => setConfirmModal({ display: false })

  const handleSearch = (kword) => {
    dispatch(listProducts(kword))
    setLastSearched(kword)
  }

  const handleSearchClear = () => dispatch({ type: searchReset })

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Product List</h1>
        </Col>
        <Col className='text-right'>
          <Button variant='info' className='my-3' onClick={handleCreateProduct}>
            <i className='fas fa-plus'></i> New Product
          </Button>
        </Col>
      </Row>
      <Spinner hidden={!loading} />
      <FlashMsg
        variant={flashMsg.variant}
        clearChildren={() => setFlashMsg({})}
        permanent={Boolean(requestError)}
      >
        {flashMsg.msg}
      </FlashMsg>
      <div className='py-3'>
        <AdminProductSearch
          onSearch={handleSearch}
          onClear={handleSearchClear}
          reset={clearSearchField}
          setReset={setClearSearchField}
        />
      </div>
      <ConfirmModal
        active={confirmModal.display}
        heading={confirmModal.heading}
        message={confirmModal.message}
        confirmHandler={handleDelete}
        hideHandler={hideModalHandler}
        proceedText='Delete'
        primaryVariant='danger'
      />
      {searchFailed ? (
        <>
          <h3>Not found</h3>
          <p className='py-3'>
            No product found with the name{' '}
            <span style={{ color: 'tomato' }}>{lastSearched}</span>. Try again
            with a different keyword
          </p>
        </>
      ) : (
        !requestError && (
          <Table hover responsive className='tale-sm'>
            <thead>
              <tr>
                {tableHeadings.map((t, i) => (
                  <th key={i}>{t.toLocaleUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <img
                    className='product-table-img'
                    src={product.image}
                    alt={product.name}
                  />
                  <td>{product.name}</td>
                  <td>$ {product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <div className='two-horizontal-icons'>
                      <div>
                        <Link to={`/admin/productedit/${product._id}`}>
                          <i className='fas fa-edit'></i>
                        </Link>
                      </div>
                      <div>
                        <i
                          onClick={() =>
                            handleConfirm(product._id, product.name)
                          }
                          className='fas fa-trash'
                        ></i>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )
      )}
      <Paginate
        pages={pages}
        activePage={currPage}
        linkHead={'/admin/productlist/page'}
      />
    </>
  )
}

export default ProductListScreen
