import React from 'react'
import { useEffect } from 'react'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listTopProducts } from '../../actions/productActions'
import { isNone } from '../../helpers/utilities'
import Slider from '../Slider'

const TopProductsCarousel = () => {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector(
    (state) => state.productTopRating
  )

  useEffect(() => {
    if (!products) dispatch(listTopProducts())
    if (error) console.log(error)
  }, [products, error])

  const getCarouselData = useCallback(() => {
    if (isNone(products)) return []
    return products.map((product) => ({
      _id: product._id,
      src: product.image,
      title: product.name,
    }))
  }, [products])

  return <Slider slides={getCarouselData()} />
}

export default TopProductsCarousel
