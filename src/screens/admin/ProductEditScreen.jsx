// libraries & methods
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import * as Yup from 'yup'
import {
  IMG_UPLOAD_RESET,
  PRODUCT_DETAILS_RESET as prodDetailsReset,
} from '../../constants'
import { imgUpload, updateProduct } from '../../actions/adminActions'
import { listProductDetails as getProduct } from '../../actions/productActions'
import { areSameObjects, isEmptyObj } from '../../helpers/utilities'

// UI components
import { FlashMsg, FormContainer, Spinner } from '../../components'
import { Formik, Form as FormikForm } from 'formik'
import { Form, Row, Col, Button } from 'react-bootstrap'
import FormikFieldGroup from '../../components/FormikFieldGroup'

const formFields = [
  { name: '_id', label: 'Product ID', type: 'text', disabled: true },
  { name: 'name', label: 'Product Name', type: 'text' },
  { name: 'price', label: 'Price', type: 'number' },
  { name: 'user', label: 'User', type: 'text', disabled: true },
  { name: 'brand', label: 'Brand', type: 'text' },
  { name: 'category', label: 'Category', type: 'text' },
  { name: 'countInStock', label: 'In Stock', type: 'number' },
  {
    name: 'numReviews',
    label: 'Number of Reviews',
    type: 'number',
    disabled: true,
  },
  { name: 'description', label: 'Description', type: 'text' },
]

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .required('Please enter the product name!'),
  price: Yup.number()
    .min(0, 'Why free?')
    .required('Please enter the product price!'),
  brand: Yup.string()
    .min(2, 'Too Short!')
    .max(32, 'Too Long!')
    .required('Please enter the brand name!'),
  category: Yup.string()
    .min(3, 'Too Short!')
    .max(32, 'Too Long!')
    .required('Please enter the product category!'),
  countInStock: Yup.number().required('Please enter the number in stock!'),
  description: Yup.string()
    .min(3, 'Too Short!')
    .required('Please enter the product description!'),
})

const ProductEditScreen = ({ history, match }) => {
  // redux stuff
  const dispatch = useDispatch()
  const {
    loading: requestLoading,
    success,
    type,
    product,
    error,
  } = useSelector((state) => state.productDetails)
  const {
    loading: uploadLoading,
    success: uploaded,
    data: uploadData,
    error: uploadError,
  } = useSelector((state) => state.imgUploadStore)
  // hooks
  const [flashMsg, setFlashMsg] = useState({})
  const [uploadLabel, setUploadLabel] = useState('No File Chosen')
  const [newUpload, setNewUpload] = useState('')

  // variables
  const requestError = error && type === 'request' ? error : null
  const loading = requestLoading || uploadLoading

  useEffect(() => {
    if ((!isEmptyObj(product) || product?._id !== match.params.id) && !error) {
      dispatch(getProduct(match.params.id))
    }

    if (success && type === 'update' && !error) {
      history.replace('/admin/productlist')
      prodStateReset('success')
    }

    if (error && type === 'update') {
      setFlashMsg({ msg: error })
      window.scrollTo(0, 0)
      prodStateReset('error')
    }

    if (uploaded) {
      setNewUpload(uploadData)
      dispatch({ type: IMG_UPLOAD_RESET })
    }

    if (uploadError) {
      setFlashMsg({ msg: uploadError })
      dispatch({ type: IMG_UPLOAD_RESET })
    }

    return () => axios.CancelToken.source().cancel()
  }, [
    product?._id,
    match.params.id,
    success,
    type,
    error,
    uploaded,
    uploadError,
  ])

  const handleImgUpload = (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploadLabel(file.name)
    dispatch(imgUpload(formData))
  }

  const handleSubmit = (vals) => {
    const updated = { ...vals, image: newUpload || vals.image }
    if (areSameObjects(updated, product)) {
      history.goBack()
      return
    }
    dispatch(updateProduct(updated))
  }

  const prodStateReset = (payload) =>
    dispatch({ type: prodDetailsReset, payload })

  const btns = [
    {
      type: 'reset',
      variant: 'dark',
      icon: <i className='fas fa-times'></i>,
      label: 'Cancel',
      onClick: () => history.goBack(),
    },
    {
      type: 'submit',
      variant: 'success',
      icon: <i className='fas fa-save'></i>,
      label: 'Submit',
      onClick: () => void 0,
    },
  ]

  return (
    <FormContainer>
      <h2>{product?.name}</h2>
      <Spinner hidden={!loading} />
      <FlashMsg
        variant='danger'
        clearChildren={() => setFlashMsg({})}
        permanent={Boolean(requestError)}
      >
        {flashMsg.msg || requestError}
      </FlashMsg>
      <div className='py-4'>
        <div className='centered-img'>
          <img src={newUpload || product?.image} alt='Product Image' />
        </div>
      </div>
      {!isEmptyObj(product) && product?._id === match.params.id && (
        <Formik
          initialValues={product}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <FormikForm>
            <Form.Group controlId='imgUpload'>
              <Form.File
                id='image-file'
                label={uploadLabel}
                onChange={handleImgUpload}
                accept='image/jpg, image/jpeg, image/png'
                custom
              />
            </Form.Group>
            {formFields.map((f, i) => (
              <FormikFieldGroup
                key={i}
                formField={f}
                as={f.name === 'description' ? 'textarea' : 'input'}
              />
            ))}
            <Row>
              {btns.map((btn, i) => (
                <Col mb={2} key={i}>
                  <Button
                    type={btn.type}
                    className='rounded-btn'
                    variant={btn.variant}
                    onClick={btn.onClick}
                    block
                  >
                    {btn.icon}
                    {' ' + btn.label}
                  </Button>
                </Col>
              ))}
            </Row>
          </FormikForm>
        </Formik>
      )}
    </FormContainer>
  )
}

export default ProductEditScreen
