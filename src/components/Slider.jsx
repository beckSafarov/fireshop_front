import { Image } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel'
import { Link } from 'react-router-dom'
const defSlides = [
  { src: 'images/airpods.jpg', title: 'Airpods' },
  { src: 'images/camera.jpg', title: 'Camera' },
  { src: 'images/mouse.jpg', title: 'Mouse' },
]

const Slider = ({ slides }) => {
  return (
    <Carousel className='bg-dark' pause='hover'>
      {slides.map((slide, i) => (
        <Carousel.Item key={i}>
          <Link to={`/product/${slide._id}`}>
            <Image
              className='d-block w-100'
              src={slide.src}
              alt={slide.title}
              fluid
            />
            <Carousel.Caption className='carousel-caption'>
              <h3>{slide.title}</h3>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

Slider.defaultProps = {
  slides: defSlides,
}

export default Slider
